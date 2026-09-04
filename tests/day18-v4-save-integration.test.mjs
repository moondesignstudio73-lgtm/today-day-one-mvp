import assert from 'node:assert/strict';
import test from 'node:test';
import {createInitialState} from '../src/game-core.mjs';
import {createGirlfriendFromProfile} from '../src/girlfriend-manager.mjs';
import {SaveManager} from '../src/save-manager.mjs';
import {GAME_MODES} from '../src/scenario-state.mjs';
import {prepareCampaignDayAdvance} from '../src/story-flow-guard.mjs';
import {getDay18V4Options, getDay18V4FollowUpContract} from '../src/day18-v4-state-contract.mjs';
import {getDay18V4GameContext, prepareDay18V4GameEntry, getDay18V4GameSegment,
  applyDay18V4GameChoice, completeDay18V4GameChapter, DAY18_V4_CAMPAIGN_SLOT} from '../src/day18-v4-game-bridge.mjs';

function seed(partner) {
  const s = createInitialState(createGirlfriendFromProfile('haeun', () => .5), () => .5, {mode:GAME_MODES.MARRIAGE_30});
  s.day = 18; s.pendingStoryId = DAY18_V4_CAMPAIGN_SLOT;
  Object.assign(s.storyFlags, {day17V4Completed:true, day17V4Day18HookPending:true,
    day17V4TomorrowPlan:partner === 'YURI' ? 'YURI_MEET' : partner,
    day17V4Choice9:partner === 'YURI' ? 'day17_v4_yuri_short' : 'day17_v4_life_haeun',
    day17V4DinnerAgreement:{day:18,partner,status:'ACCEPTED',sourceChoiceId:partner === 'YURI' ? 'day17_v4_yuri_short' : 'day17_v4_life_haeun'},
    day16V4YuriEncountered:partner === 'YURI',day16V4YuriContact:'SHARED',day16V4YuriInvitation:'ANSWER_TOMORROW'});
  return s;
}

test('DAY18 real SaveManager preserves every route checkpoint and completion advances once without safety rewards', () => {
  for (const partner of ['YURI','HAEUN','SOLO']) for (let attitude = 0; attitude < 4; attitude++) {
    let s = seed(partner);
    const data = new Map(), storage = {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
    assert.equal(prepareDay18V4GameEntry(s).mode,'V4');
    const money = s.money;
    let count = 0;
    while(s.storyFlags.day18V4.phase !== 'ending') {
      assert.ok(count++ < 25);
      const options = getDay18V4Options(s.storyFlags.day18V4);
      const pick = s.storyFlags.day18V4.phase === 'morning' && partner !== 'SOLO' ? 0 : attitude % options.length;
      applyDay18V4GameChoice(s,options[pick].id);
      const chapter = structuredClone(s.storyFlags.day18V4), segment = getDay18V4GameSegment(s);
      SaveManager.save(s,storage); s = SaveManager.load(storage,GAME_MODES.MARRIAGE_30);
      assert.ok(s,'production save validation');
      assert.equal(prepareDay18V4GameEntry(s).mode,'V4');
      assert.deepEqual(s.storyFlags.day18V4,chapter);
      assert.deepEqual(getDay18V4GameSegment(s),segment);
    }
    const cue = getDay18V4GameSegment(s).at(-1);
    completeDay18V4GameChapter(s,cue); completeDay18V4GameChapter(s,cue);
    assert.equal(s.storyHistory.filter(h=>h.sceneId===DAY18_V4_CAMPAIGN_SLOT).length,1);
    const followUp = getDay18V4FollowUpContract(s.storyFlags.day18V4);
    assert.deepEqual(s.storyHistory.find(h=>h.sceneId===DAY18_V4_CAMPAIGN_SLOT).followUp,followUp);
    SaveManager.save(s,storage);
    const completedSave = SaveManager.load(storage,GAME_MODES.MARRIAGE_30);
    assert.ok(completedSave);
    assert.deepEqual(completedSave.storyHistory.find(h=>h.sceneId===DAY18_V4_CAMPAIGN_SLOT).followUp,followUp);
    assert.equal(s.money,money);
    assert.equal(s.storyFlags.day18AccessStrategy,undefined);
    assert.equal(s.storyFlags.day18V4Day19HookPending,true);
    assert.equal(prepareCampaignDayAdvance(s,DAY18_V4_CAMPAIGN_SLOT),18);
    assert.equal(prepareCampaignDayAdvance(s,DAY18_V4_CAMPAIGN_SLOT),null);
    assert.equal(s.day,19);
  }
});

test('unanswered morning survives production save/load with alarm and water in order', () => {
  for(const partner of ['YURI','HAEUN','SOLO']) {
    const s=seed(partner);prepareDay18V4GameEntry(s);
    const expected=getDay18V4GameSegment(s),before=structuredClone(s.storyFlags.day18V4);
    const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
    SaveManager.save(s,storage);
    const restored=SaveManager.load(storage,GAME_MODES.MARRIAGE_30);
    assert.ok(restored);
    assert.equal(prepareDay18V4GameEntry(restored).mode,'V4');
    assert.deepEqual(restored.storyFlags.day18V4,before);
    const steps=getDay18V4GameSegment(restored);
    assert.deepEqual(steps,expected);
    assert.deepEqual(steps.filter(x=>x.type==='cgShow'||x.type==='alarmAction').map(x=>x.source),[
      'assets/events/day18-v4/morning-alarm-off-v2.png',
      'assets/events/day18-v4/morning-feet-rest-v1.png',
      'assets/events/day18-v4/morning-feet-flex-v1.png',
      'assets/events/day18-v4/morning-feet-rest-v1.png',
      'assets/events/day18-v4/morning-water-v1.png'
    ]);
    assert.equal(restored.storyFlags.day18V4.choices.length,0);
    assert.equal(restored.storyFlags.day18V4.phase,'morning');
    assert.equal(steps[0].backgroundId,'day4-bedroom-morning');
    assert.equal(steps[0].storyClock,'08:00');
  }
});

test('morning starts in the bedroom but selected replies resume at the living-room table', () => {
  for(const partner of ['YURI','HAEUN','SOLO']) {
    const s=seed(partner);prepareDay18V4GameEntry(s);
    const opening=getDay18V4GameSegment(s);
    assert.equal(opening[0].backgroundId,'day4-bedroom-morning');
    assert.equal(opening[0].characterId,null);
    const water=opening.findIndex(x=>x.source?.includes?.('morning-water'));
    assert.equal(opening[water-1].backgroundId,'home-morning');
    for(const option of getDay18V4Options(s.storyFlags.day18V4)) {
      const branch=structuredClone(s);applyDay18V4GameChoice(branch,option.id);
      const segment=getDay18V4GameSegment(branch);
      assert.equal(segment[0].backgroundId,'home-morning');
      assert.equal(segment[0].storyClock,'08:00');
      assert.deepEqual(segment,getDay18V4GameSegment(JSON.parse(JSON.stringify(branch))));
    }
  }
});

test('old completed DAY18 history is not silently backfilled on repeated completion', () => {
  const s = seed('SOLO'); prepareDay18V4GameEntry(s);
  while (s.storyFlags.day18V4.phase !== 'ending') {
    applyDay18V4GameChoice(s,getDay18V4Options(s.storyFlags.day18V4)[0].id);
  }
  const cue = getDay18V4GameSegment(s).at(-1);
  completeDay18V4GameChapter(s,cue);
  delete s.storyHistory.find(h=>h.sceneId===DAY18_V4_CAMPAIGN_SLOT).followUp;
  const before = JSON.stringify(s);
  completeDay18V4GameChapter(s,cue);
  assert.equal(JSON.stringify(s),before);
  assert.equal(getDay18V4FollowUpContract(s.storyFlags.day18V4).agreedTime,null);
});

test('contact availability is not attraction or Haeun knowledge of Yuri', () => {
  const s = {storyFlags:{day15V4SeojinCallbackAvailable:true,day15V4AraCallbackAvailable:true,
    day16V4YuriEncountered:true,day16V4YuriContact:'SHARED',day16V4HaeunYuriKnowledge:'UNKNOWN'}};
  assert.equal(getDay18V4GameContext(s).otherInterest,false);
  assert.equal(getDay18V4GameContext(s).yuriPastRelevant,false);
  s.storyFlags.day16V4IntentToYuri='UNKNOWN';
  assert.equal(getDay18V4GameContext(s).otherInterest,false);
  s.storyFlags.day12V3SeojinIntent='SPARK';
  assert.equal(getDay18V4GameContext(s).otherInterest,true);
  s.storyFlags.day16V4HaeunYuriKnowledge='CONTACT_SHARED';
  assert.equal(getDay18V4GameContext(s).yuriPastRelevant,true);
  s.storyFlags.day16V4IntentToYuri='END_HERE';
  assert.equal(getDay18V4GameContext(s).yuriPastRelevant,false);
});

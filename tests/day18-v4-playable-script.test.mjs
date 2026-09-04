import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync} from 'node:fs';
import {beginDay18V4, applyDay18V4Choice, getDay18V4Options} from '../src/day18-v4-state-contract.mjs';
import {getDay18V4PlayableSegment} from '../src/day18-v4-playable-script.mjs';
import {DAY18_V4_SOURCE_SCENES} from '../src/day18-v4-source-registry.mjs';
import {selectDay18V4Source} from '../src/day18-v4-source-selection.mjs';
import {validateDay18V4BeatAnchors} from '../src/day18-v4-source-beats.mjs';

function start(partner, known = true, context = {}) {
  const s = {storyFlags: {day17V4Completed: true, day17V4Day18HookPending: true,
    day17V4TomorrowPlan: partner === 'YURI' ? 'YURI_MEET' : partner,
    day17V4Choice9: partner === 'YURI' ? 'day17_v4_yuri_short' : 'day17_v4_life_haeun',
    day17V4DinnerAgreement: {day: 18, partner, status: 'ACCEPTED', sourceChoiceId: 'day17_v4_life_haeun'},
    day16V4YuriEncountered: partner === 'YURI', day16V4YuriContact: 'SHARED', day16V4YuriInvitation: 'ANSWER_TOMORROW',
    day16V4HaeunRelationshipDisclosure: known ? 'NAMED_GIRLFRIEND' : 'WITHHELD',
    day17V4HaeunDisclosure: known ? 'TOLD' : 'WITHHELD'}};
  beginDay18V4(s, context); return s;
}

test('directed source anchors exist and filename setup precedes the joke', () => {
  assert.equal(validateDay18V4BeatAnchors(), true);
  const s = start('HAEUN');
  for (const id of ['morning_keep','disclose_together','menu_share']) applyDay18V4Choice(s, `day18_v4_${id}`);
  const lines = getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x => x.text);
  assert.ok(lines.indexOf('파일 이름에 진짜마지막이라고 써 놨거든.') < lines.indexOf('그럼 다음 파일은?'));
  assert.ok(lines.includes('파일 이름에 진짜마지막이라고 써 놨거든.'));
});

test('Haeun arrival establishes the wind before the original joke', () => {
  const s=start('HAEUN');
  for(const id of ['morning_keep','disclose_together']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const segment=getDay18V4PlayableSegment(s.storyFlags.day18V4);
  const lines=segment.map(x=>x.text??'');
  const cause=lines.indexOf('밖에서 기다리려다가 바람이 불어서 먼저 들어왔어.');
  assert.ok(cause>=0);
  assert.equal(lines[cause+1],'잘했네.');
  assert.ok(lines.findIndex(x=>x.includes('밖에 있었으면 더 멋있었을까'))>cause);
  const directions=segment.filter(x=>x.type==='sceneDirection');
  assert.equal(directions[0].character,null);
  assert.equal(directions[1].character,'girlfriend');
});

test('withheld noon disclosure lets Haeun leave for her own lunch', () => {
  const s=start('YURI',false);
  for(const id of ['morning_keep','disclose_withhold']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const segment=getDay18V4PlayableSegment(s.storyFlags.day18V4);
  assert.ok(segment.some(x=>x.text==='나는 이제 점심 먹으러 갈게.'));
  assert.ok(segment.some(x=>x.text==='그녀의 오후가 내 답장 옆에서 멈추지는 않았다.'));
});

test('present-purpose reply places the cup down before Yuri speaks', () => {
  const s=start('YURI');
  for(const id of ['morning_keep','disclose_yuri','menu_each','purpose_present']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const segment=getDay18V4PlayableSegment(s.storyFlags.day18V4);
  const reply=segment.findIndex(x=>x.text==='그 말이 반갑기도 한데, 좀 조심스럽다.');
  assert.ok(reply>=2);
  assert.equal(segment[reply-2].sfxId,'SFX_CUP_SET_DOWN');
  assert.equal(segment[reply-1].type,'storyPause');
});

test('Yuri arrives after waiting and says goodbye even without Haeun contact', () => {
  const s = start('YURI', true, {haeunContactAllowed:false});
  applyDay18V4Choice(s,'day18_v4_morning_keep');
  const arrival = getDay18V4PlayableSegment(s.storyFlags.day18V4);
  const directions = arrival.filter(x=>x.type==='sceneDirection');
  assert.equal(directions[0].character, null);
  assert.equal(directions[1].character, 'yuri');
  for(const id of ['menu_each','purpose_present','apology_thanks','relationship_haeun','next_ask','pay_split']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const departure = getDay18V4PlayableSegment(s.storyFlags.day18V4);
  assert.ok(departure.some(x=>x.speaker==='유리'&&x.text==='잘 들어가.'));
  assert.ok(!departure.some(x=>x.sender==='하은'));
});

test('night disclosure reports the chosen purpose and an unaccepted request accurately', () => {
  const s=start('YURI');
  for(const id of ['morning_keep','disclose_yuri','menu_each','purpose_present','apology_thanks','relationship_haeun','next_ask','pay_split','night_tell']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.match(text,/지금의 유리 씨가 궁금해서/);
  assert.match(text,/아직 만나겠다고 한 건 아니라고/);
  assert.doesNotMatch(text,/예전에 둘이 어땠는지 궁금해서 나갔어/);
});

test('Yuri book recollection requires that exact prior conversation, not just meeting her', () => {
  for (const known of [true,false]) {
    const s = start('YURI',true,{yuriOwnBookKnown:known});
    for (const id of ['morning_keep','disclose_yuri','menu_each','purpose_present','apology_thanks']) applyDay18V4Choice(s,`day18_v4_${id}`);
    const text = getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
    assert.equal(text.includes('지난번 자기 책 이야기를 할 때'),known);
    assert.equal(text.includes('아, 그냥 읽는 책.'),!known);
  }
});

test('a peaceful solo night does not invent a difficult relationship conversation for Jihoon', () => {
  const s = start('SOLO', true, {haeunContactAllowed:false});
  for (const id of ['morning_solo','menu_familiar','solo_food','return_home','alone_jihoon']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const text = getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.doesNotMatch(text,/말을 좀 어렵게|상대한테|그 사람한텐|반성/);
  assert.match(text,/밥 먹었어/);
});

test('conflict at dinner is not resolved by choosing a pleasant night greeting', () => {
  const s = start('HAEUN', true, {otherInterest:true});
  for (const id of ['morning_keep','disclose_together','menu_each','topic_other','night_good']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const chapter = s.storyFlags.day18V4;
  const text = getDay18V4PlayableSegment(chapter).map(x=>x.text??'').join('\n');
  assert.equal(chapter.phase,'relationship_future');
  assert.doesNotMatch(text,/다음에도 그냥 배고프면 같이 먹자/);
  assert.match(text,/아까 들은 마음/);
});

test('home return and fridge actions happen after leaving the restaurant', () => {
  for (const id of ['return_home','return_food']) {
    const s = start('SOLO');
    for (const key of ['morning_solo','disclose_solo','menu_familiar','solo_food',id]) applyDay18V4Choice(s,`day18_v4_${key}`);
    const segment = getDay18V4PlayableSegment(s.storyFlags.day18V4);
    assert.equal(segment[0].type,'sceneDirection');
    assert.equal(segment[0].location,'home-evening');
    assert.equal(segment[0].character,null);
  }
});

test('telling Haeun at noon is remembered by the night report', () => {
  const s=start('YURI',false);
  for(const id of ['morning_keep','disclose_yuri','menu_each','purpose_past','apology_thanks','relationship_haeun','next_time','pay_split','night_tell']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.match(text,/네가 아는 그 저녁/);
});

test('ending after an unresolved confession does not summarize the night as merely keeping an appointment', () => {
  const s=start('HAEUN',true,{otherInterest:true});
  for(const id of ['morning_keep','disclose_together','menu_each','topic_other','night_good','future_others','travel_life']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.doesNotMatch(text,/그 정도로 끝나는 날도 있었다/);
  assert.match(text,/이미 말한 마음/);
});

test('follow-up intent alone does not invent an agreed contact date', () => {
  const s=start('YURI');
  for(const id of ['morning_keep','disclose_yuri','menu_each','purpose_present','apology_thanks','relationship_haeun','next_ask','pay_split','night_tell','future_unsure','travel_life']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.doesNotMatch(text,/내일 연락하기로 한 약속/);
  assert.match(text,/다시 이야기할 시간을 함께 정해야/);
});

test('cancelled dinner has a solo prompt and never claims the appointment was kept', () => {
  const s = start('YURI');
  for (const id of ['morning_change','disclose_solo']) applyDay18V4Choice(s,`day18_v4_${id}`);
  assert.equal(getDay18V4PlayableSegment(s.storyFlags.day18V4).at(-1).prompt,'오늘 먹을 것을 고른다');
  while(s.storyFlags.day18V4.phase !== 'ending') applyDay18V4Choice(s,getDay18V4Options(s.storyFlags.day18V4)[0].id);
  const text = getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
  assert.doesNotMatch(text,/오늘 내가 한 약속을 지킨 것/);
  assert.match(text,/약속을 바꾼 사실/);
});

test('source selection retains non-dialogue as non-renderable notes, never narration', () => {
  assert.equal(DAY18_V4_SOURCE_SCENES.length, 24);
  assert.deepEqual(DAY18_V4_SOURCE_SCENES.map(s => s.number), Array.from({length: 24}, (_, i) => i + 1));
  const steps = selectDay18V4Source(2);
  assert.ok(steps.some(s => s.type === 'sourceNote' && s.text.includes('아직 전하지 않았다면')));
  assert.equal(steps.some(s => s.type === 'narration'), false);
  assert.throws(() => selectDay18V4Source(2, {from: 'nonexistent boundary'}), /BOUNDARY_MISSING/);
});

test('Jihoon meal photo appears before the evidence joke, only on his contact branch', () => {
  for(const contact of ['solo_jihoon','solo_haeun','solo_food']) {
    const s=start('SOLO');
    for(const id of ['morning_solo','disclose_solo','menu_new',contact]) applyDay18V4Choice(s,`day18_v4_${id}`);
    const segment=getDay18V4PlayableSegment(s.storyFlags.day18V4);
    const photos=segment.filter(x=>x.type==='cgShow');
    assert.equal(photos.length,contact==='solo_jihoon'?1:0);
    if(contact==='solo_jihoon') {
      const index=segment.findIndex(x=>x.type==='cgShow');
      assert.equal(segment[index-1].text,'내가 지금 입이 바빠.');
      assert.equal(segment[index+1].text,'리뷰가 아니라 증거네.');
      assert.ok(existsSync(new URL(`../${photos[0].source}`,import.meta.url)));
      assert.equal(photos[0].fit,'contain');
      assert.deepEqual(getDay18V4PlayableSegment(JSON.parse(JSON.stringify(s.storyFlags.day18V4))),segment);
    }
  }
});

test('actual interest is spoken before Haeun asks what it means, never invented otherwise', () => {
  for(const otherInterest of [true,false]) {
    const s=start('HAEUN',true,{otherInterest});
    for(const id of ['morning_keep','disclose_together','menu_each','topic_other']) applyDay18V4Choice(s,`day18_v4_${id}`);
    const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
    if(otherInterest) {
      assert.ok(text.indexOf('다른 사람을 더 알고 싶은 마음이 있어.')>=0);
      assert.ok(text.indexOf('다른 사람을 더 알고 싶은 마음이 있어.')<text.indexOf('그 사람을 알고 싶은 거야'));
    } else assert.doesNotMatch(text,/다른 사람을 더 알고 싶은 마음이 있어/);
  }
});

test('unreported reunion request is remembered only with an active contact and no night report', () => {
  for(const contactAllowed of [true,false]) for(const report of [true,false]) {
    const s=start('YURI',true,{haeunContactAllowed:contactAllowed});
    const ids=['morning_keep',...(contactAllowed?['disclose_yuri']:[]),'menu_each','purpose_present','apology_thanks','relationship_haeun','next_ask','pay_split',
      ...(contactAllowed ? report?['night_tell','future_unsure']:['night_defer','alone_note'] : ['alone_note']), 'travel_life'];
    for(const id of ids) applyDay18V4Choice(s,`day18_v4_${id}`);
    assert.equal(s.storyFlags.day18V4.phase,'ending');
    const text=getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
    assert.equal(text.includes('다시 만나고 싶다고 한 말은 아직 하은에게 전하지 않았다.'),contactAllowed&&!report);
    assert.match(text,/내일의 약속은 그 말 다음에서 시작해야 했다/);
  }
});

test('Jihoon states his availability before the difficult night conversation', () => {
  const s=start('YURI');
  for(const id of ['morning_keep','disclose_yuri','menu_each','purpose_present','apology_thanks','relationship_haeun','next_time','pay_split','night_defer','alone_jihoon']) applyDay18V4Choice(s,`day18_v4_${id}`);
  const messages=getDay18V4PlayableSegment(s.storyFlags.day18V4).filter(x=>x.type==='message');
  assert.equal(messages[0].sender,'지훈');
  assert.equal(messages[0].text,'지금 길게는 어려워.');
  assert.equal(messages[1].text,'무슨 일인데?');
});

test('source-locked dialogue and all choices resolve through deterministic route coverage', () => {
  const covered = new Set();
  for (const partner of ['YURI', 'HAEUN', 'SOLO']) for (let run = 0; run < 180; run++) {
    const s = start(partner, run % 2 === 0), all = [];
    let step = 0, random = run + 11;
    while (true) {
      const chapter = s.storyFlags.day18V4;
      const segment = getDay18V4PlayableSegment(chapter); all.push(...segment);
      for (const line of segment.filter(s => s.source && typeof s.source === 'object')) {
        const original = DAY18_V4_SOURCE_SCENES[line.source.scene - 1].body.split('\n')[line.source.line - 1];
        assert.ok(original.includes(`“${line.text}”`), `source mismatch ${JSON.stringify(line.source)}`);
      }
      if (chapter.phase === 'ending') break;
      assert.ok(step++ < 25, 'bounded progression');
      random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
      const options = getDay18V4Options(chapter);
      const selected = options[chapter.phase === 'morning' && partner !== 'SOLO' ? 0 : (random >>> 8) % options.length];
      covered.add(selected.id); applyDay18V4Choice(s, selected.id);
      assert.deepEqual(getDay18V4PlayableSegment(JSON.parse(JSON.stringify(s.storyFlags.day18V4))), getDay18V4PlayableSegment(s.storyFlags.day18V4));
    }
    const text = all.filter(s => s.text).map(s => s.text).join('\n');
    assert.doesNotMatch(text, /SCENARIO|INTERNAL|실제 관심이 없다면|하은과 약속했다면|경로의 선택|day18V4/);
    if (partner !== 'YURI') assert.ok(!all.some(s => s.speaker === '유리' || s.sender === '유리'));
    if (partner === 'SOLO') assert.ok(!all.some(s => s.type === 'sceneDirection' && s.character));
    else assert.doesNotMatch(text,/혼자 보내기로 한 저녁을 누구에게 벌처럼/);
    assert.equal(all.at(-1).type, 'chapterCompletionCue');
  }
  for (const id of ['yuri_correct', 'yuri_lie_breakup', 'night_correct', 'night_lie_cancel', 'future_others', 'calm_trip', 'next_ask']) {
    assert.ok(covered.has(`day18_v4_${id}`), `missing route coverage: ${id}`);
  }
});

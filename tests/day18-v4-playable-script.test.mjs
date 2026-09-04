import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4, applyDay18V4Choice, getDay18V4Options} from '../src/day18-v4-state-contract.mjs';
import {getDay18V4PlayableSegment} from '../src/day18-v4-playable-script.mjs';
import {DAY18_V4_SOURCE_SCENES} from '../src/day18-v4-source-registry.mjs';
import {selectDay18V4Source} from '../src/day18-v4-source-selection.mjs';

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

test('Yuri book recollection requires that exact prior conversation, not just meeting her', () => {
  for (const known of [true,false]) {
    const s = start('YURI',true,{yuriOwnBookKnown:known});
    for (const id of ['morning_keep','disclose_yuri','menu_each','purpose_present','apology_thanks']) applyDay18V4Choice(s,`day18_v4_${id}`);
    const text = getDay18V4PlayableSegment(s.storyFlags.day18V4).map(x=>x.text??'').join('\n');
    assert.equal(text.includes('지난번 자기 책 이야기를 할 때'),known);
    assert.equal(text.includes('아, 그냥 읽는 책.'),!known);
  }
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

test('source-locked dialogue and all choices resolve through deterministic route coverage', () => {
  const covered = new Set();
  for (const partner of ['YURI', 'HAEUN', 'SOLO']) for (let run = 0; run < 180; run++) {
    const s = start(partner, run % 2 === 0), all = [];
    let step = 0, random = run + 11;
    while (true) {
      const chapter = s.storyFlags.day18V4;
      const segment = getDay18V4PlayableSegment(chapter); all.push(...segment);
      for (const line of segment.filter(s => s.source)) {
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
    assert.equal(all.at(-1).type, 'chapterCompletionCue');
  }
  for (const id of ['yuri_correct', 'yuri_lie_breakup', 'night_correct', 'night_lie_cancel', 'future_others', 'calm_trip', 'next_ask']) {
    assert.ok(covered.has(`day18_v4_${id}`), `missing route coverage: ${id}`);
  }
});

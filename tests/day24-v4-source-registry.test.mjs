import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DAY24_V4_SOURCE_PAGE_ID, DAY24_V4_SOURCE_SCENES, DAY24_V4_SOURCE_SHA256} from '../src/day24-v4-source-registry.mjs';
import {day24V4SourceRef, validateDay24V4SourceStep} from '../src/day24-v4-source-selection.mjs';

test('DAY24 registry preserves all source scenes and choice variants', () => {
  assert.equal(DAY24_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-811e-9af0-cedccb66d1cf');
  assert.equal(DAY24_V4_SOURCE_SHA256, 'c0a59b11ceffa729a15b07da81a1ee7604035698406bba31ddf263a6debb2032');
  assert.deepEqual(DAY24_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  const choices = DAY24_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.equal(choices.length, 20);
  assert.deepEqual(choices.filter(choice => choice.variant === 'COMMON').map(choice => choice.number), [1, 2, 3, 4, 5, 6, 7, 8, 15]);
  assert.deepEqual(choices.filter(choice => choice.variant === 'NO_PENDING_CONTACT').map(choice => choice.number), [9, 10]);
  assert.deepEqual(choices.filter(choice => choice.variant === 'CONTINUE').map(choice => choice.number), [11, 14]);
  assert.equal(choices.every(choice => choice.labels.length === 3), true);
  const raw = readFileSync(new URL('../docs/scenarios/DAY24_SCENARIO_V4_NOTION.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(raw).digest('hex'), DAY24_V4_SOURCE_SHA256);
});

test('DAY24 registry keeps relationship, contact, lie and next-talk labels exact', () => {
  const choices = DAY24_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  const find = (number, variant = 'COMMON') => choices.find(choice => choice.number === number && choice.variant === variant);
  assert.deepEqual([...find(3).labels], ['나는 너랑 계속 만나고 싶어.', '좋아하는데 아직 대답 못 한 마음이 있어.', '우리 관계를 끝내는 얘기를 해야 할 것 같아.']);
  assert.deepEqual([...find(6).labels], ['다른 연애 가능성을 붙잡아 두지 않을게. 너와 계속 만나고 싶어.', '나는 시간이 더 필요해. 네가 기다리지 않는 것도 받아들일게.', '좋았던 날 때문에 미뤘지만, 여기서 헤어지고 싶어.']);
  assert.deepEqual([...find(9, 'YURI').labels], ['그날은 유리 씨 오늘 얘기를 듣고 싶어요.', '저도 제 얘기를 조금 해 보고 싶어요.', '서두르지 않고, 지금은 여기까지 이야기하고 싶어요.']);
  assert.deepEqual([...find(10, 'PENDING_RELATIONSHIP').labels], ['내가 표현을 흐렸어. 아직 헤어지지 않았어.', '관계를 정리하지 않은 채 더 만나자고 하지는 않을게.', '지금은 혼자야.']);
  assert.deepEqual([...find(14, 'CONTINUE').labels], ['나도 궁금해. 내일 밥 먹으면서 이야기할까?', '나도 생각해 보고 싶어. 편하게 이야기할 시간을 정하자.', '지금은 아직 준비가 덜 된 것 같아. 그래도 피하고 싶지는 않아.']);
});

test('DAY24 source references validate exact player-facing lines only', () => {
  const source = day24V4SourceRef(22, '**하은** “계속 만나고 싶다는 말, 나도 같아.”');
  assert.equal(validateDay24V4SourceStep({type: 'dialogue', source}), true);
  assert.equal(validateDay24V4SourceStep({type: 'dialogue', source: {...source, exact: '**하은** “나도 같아.”'}}), false);
  assert.throws(() => day24V4SourceRef(22, 'DAY23 관계 플래그를 회수한다.'), /DAY24_SOURCE_LINE_MISSING/);
});

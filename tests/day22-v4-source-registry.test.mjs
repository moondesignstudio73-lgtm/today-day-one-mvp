import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DAY22_V4_SOURCE_PAGE_ID, DAY22_V4_SOURCE_SCENES, DAY22_V4_SOURCE_SHA256} from '../src/day22-v4-source-registry.mjs';
import {day22V4SourceRef, validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';

test('DAY22 registry preserves all source scenes and choice variants', () => {
  assert.equal(DAY22_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-81f3-ba7f-eb07c6979d27');
  assert.equal(DAY22_V4_SOURCE_SHA256, '9b63b8194229ef8ed290a51b45949cf5138175815a3d2f6e7d2a82b58f539383');
  assert.deepEqual(DAY22_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  const choices = DAY22_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.equal(choices.length, 23);
  assert.deepEqual(choices.filter(choice => choice.variant === 'TRAVEL').map(choice => choice.number),
    Array.from({length: 17}, (_, index) => index + 1));
  assert.deepEqual(choices.filter(choice => choice.variant === 'NO_TRAVEL').map(choice => choice.number), [3, 4, 5, 6, 7, 8]);
  assert.equal(choices.every(choice => choice.labels.length === 3), true);
  const raw = readFileSync(new URL('../docs/scenarios/DAY22_SCENARIO_V4_NOTION.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(raw).digest('hex'), DAY22_V4_SOURCE_SHA256);
});

test('DAY22 registry keeps travel, photo, contact and no-travel labels exact', () => {
  const choices = DAY22_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  const find = (number, variant = 'TRAVEL') => choices.find(choice => choice.number === number && choice.variant === variant);
  assert.deepEqual([...find(1).labels], ['지금 뺄 수 있는 건 빼고 가자.', '내가 챙긴 짐은 내가 들게. 힘들면 말하고.', '생각보다 무겁네. 오늘 동선도 더 줄여야겠어.']);
  assert.deepEqual([...find(6).labels], ['오늘은 내 앨범에만 둘래.', '하은에게 보여 주고 싶어.', '사진을 나누기로 한 사람에게 보내고 싶어.']);
  assert.deepEqual([...find(14).labels], ['나도. 안고 싶어.', '손 잡고 조금 더 이야기하자.', '나는 지금 이대로 쉬고 싶어.']);
  assert.deepEqual([...find(3, 'NO_TRAVEL').labels], ['동네를 조금 걸어 보자.', '집에서 오래 미뤄 둔 작은 일을 하자.', '오늘은 쉬는 데 시간을 쓰자.']);
  assert.deepEqual([...find(6, 'NO_TRAVEL').labels], ['오늘 어떻게 보냈어?', '나 오늘 생각보다 잘 쉬었어.', '여행 못 간 건 조금 아쉽더라.']);
});

test('DAY22 source references validate exact player-facing lines only', () => {
  const source = day22V4SourceRef(18, '**하은** “오늘 너랑 와서 좋았어.”');
  assert.equal(validateDay22V4SourceStep({type: 'dialogue', source}), true);
  assert.equal(validateDay22V4SourceStep({type: 'dialogue', source: {...source, exact: '**하은** “오늘 같이 와서 좋았어.”'}}), false);
  assert.throws(() => day22V4SourceRef(18, 'DAY20 포옹 플래그를 회수한다.'), /DAY22_SOURCE_LINE_MISSING/);
});

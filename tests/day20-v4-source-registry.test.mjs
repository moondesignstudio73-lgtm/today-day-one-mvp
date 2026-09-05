import assert from 'node:assert/strict';
import test from 'node:test';
import {DAY20_V4_SOURCE_PAGE_ID, DAY20_V4_SOURCE_SCENES, DAY20_V4_SOURCE_SHA256} from '../src/day20-v4-source-registry.mjs';
import {day20V4SourceRef, validateDay20V4SourceStep} from '../src/day20-v4-source-selection.mjs';

test('DAY20 registry preserves all source scenes and choice variants', () => {
  assert.equal(DAY20_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-81b3-b82a-c4fbc39173e4');
  assert.equal(DAY20_V4_SOURCE_SHA256, '9db072f65fd3b0e0bf930628bbcb9e1601153413377baced59b0ae43ceeb3c1e');
  assert.deepEqual(DAY20_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  const choices = DAY20_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.equal(choices.length, 19);
  assert.deepEqual(choices.filter(choice => choice.variant === 'FACE_TO_FACE').map(choice => choice.number),
    Array.from({length: 14}, (_, index) => index + 1));
  assert.deepEqual(choices.filter(choice => choice.variant === 'SOLO').map(choice => choice.number), [5, 6, 7, 8]);
  assert.deepEqual(choices.filter(choice => choice.variant === 'CONFLICT').map(choice => choice.number), [10]);
  assert.equal(choices.every(choice => choice.labels.length === 3), true);
});

test('DAY20 registry keeps critical labels exact and separates duplicate choice numbers', () => {
  const choices = DAY20_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  const face10 = choices.find(choice => choice.number === 10 && choice.variant === 'FACE_TO_FACE');
  const conflict10 = choices.find(choice => choice.number === 10 && choice.variant === 'CONFLICT');
  assert.deepEqual([...face10.labels], ['지금 안고 싶어.', '손 잡고 조금 더 이야기하고 싶어.', '나는 오늘 이 정도 거리도 좋아.']);
  assert.deepEqual([...conflict10.labels], ['오늘은 여기까지 이야기하고 싶다면 그럴게.', '내가 말한 것 중에 더 묻고 싶은 게 있어?', '네가 돌아가면 무서울 것 같아.']);
  const solo8 = choices.find(choice => choice.number === 8 && choice.variant === 'SOLO');
  assert.deepEqual([...solo8.labels], ['다음에 이야기할 수 있을 때 알려 줘.', '오늘은 푹 쉬자.', '오늘 내가 웃은 이야기 하나만 남길게.']);
});

test('DAY20 source references validate exact player-facing lines only', () => {
  const source = day20V4SourceRef(14, '**주인공** “안아도 될까?”');
  assert.equal(validateDay20V4SourceStep({type: 'dialogue', source}), true);
  assert.equal(validateDay20V4SourceStep({type: 'dialogue', source: {...source, exact: '**주인공** “안아도 돼.”'}}), false);
  assert.throws(() => day20V4SourceRef(14, 'DAY19에서 포옹 조건을 회수한다.'), /DAY20_SOURCE_LINE_MISSING/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {DAY21_V4_SOURCE_PAGE_ID, DAY21_V4_SOURCE_SCENES, DAY21_V4_SOURCE_SHA256} from '../src/day21-v4-source-registry.mjs';
import {day21V4SourceRef, validateDay21V4SourceStep} from '../src/day21-v4-source-selection.mjs';

test('DAY21 registry preserves all source scenes and choice variants', () => {
  assert.equal(DAY21_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-8138-9d37-e5b6c8b74a32');
  assert.equal(DAY21_V4_SOURCE_SHA256, '39797c3086e9e2f23c4fc4acc37c9fe1525816e74a21fd709b011a4fdbcb9589');
  assert.deepEqual(DAY21_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  const choices = DAY21_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.equal(choices.length, 21);
  assert.deepEqual(choices.filter(choice => choice.variant === 'FACE_TO_FACE').map(choice => choice.number),
    Array.from({length: 16}, (_, index) => index + 1));
  assert.deepEqual(choices.filter(choice => choice.variant === 'DEFERRED').map(choice => choice.number), [4, 5, 6, 7, 8]);
  assert.equal(choices.every(choice => choice.labels.length === 3), true);
});

test('DAY21 registry keeps route, feeling, contact and travel labels exact', () => {
  const choices = DAY21_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  const find = (number, variant = 'FACE_TO_FACE') => choices.find(choice => choice.number === number && choice.variant === variant);
  assert.deepEqual([...find(3).labels], ['공원에서 만나자.', '나는 오늘 집에서 통화하는 게 더 편해.', '오늘은 마음이 너무 복잡해. 다른 때 들어도 될까?']);
  assert.deepEqual([...find(8).labels], ['고마워. 그리고 지금 너를 좋아해.', '고마움이랑 좋아하는 마음을 아직 잘 나누기 어려워.', '너한테 갚으려고 결혼을 말하고 싶지는 않아.']);
  assert.deepEqual([...find(10).labels], ['안고 싶어.', '손 잡고 조금만 걸을까?', '조금 떨어져서 같이 걸어도 좋을 것 같아.']);
  assert.deepEqual([...find(12).labels], ['둘 다 가능하면 부산 후보를 확정하고 싶어.', '나는 서울에서 하루가 더 좋겠어.', '이번에는 각자 쉬자.']);
  assert.deepEqual([...find(4, 'DEFERRED').labels], ['내가 말하기 어려웠던 이유를 생각해 보자.', '민호에게 답하기로 한 날짜를 확인하자.', '오늘은 밥부터 먹자.']);
});

test('DAY21 source references validate exact player-facing lines only', () => {
  const source = day21V4SourceRef(16, '**주인공** “오늘 이야기한 너도 좋아.”');
  assert.equal(validateDay21V4SourceStep({type: 'dialogue', source}), true);
  assert.equal(validateDay21V4SourceStep({type: 'dialogue', source: {...source, exact: '**주인공** “오늘 이야기한 네가 좋아.”'}}), false);
  assert.throws(() => day21V4SourceRef(16, 'DAY20의 첫 포옹 플래그를 회수한다.'), /DAY21_SOURCE_LINE_MISSING/);
});

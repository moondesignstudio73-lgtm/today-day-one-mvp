import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DAY19_V4_SOURCE_LAST_EDITED,
  DAY19_V4_SOURCE_PAGE_ID,
  DAY19_V4_SOURCE_SCENES
} from '../src/day19-v4-source-registry.mjs';

const expectedLabels = [
  ['내가 지금 쓸 수 있는 돈부터 보자.', '하은이 생각한 하루부터 물어보자.', '일단 멋진 계획을 하나 만들어 보고 싶어.'],
  ['가까운 하루부터 찾아보자.', '멀리 가는 건 돈과 시간을 조금 더 모아서 하자.', '짧은 여행이 가능한지 끝까지 비교해 보자.'],
  ['오늘은 안 쓸래.', '미리 정한 작은 오락비 안에서만 복권을 살래.', '투자는 따로 생각하자. 여행비를 불리는 방법으로 잡지는 말자.'],
  ['가능한 날짜부터 확인해서 말씀드릴게요.', '다음에는 어느 정도 시간을 생각하시는지 궁금해요.', '오늘은 판단이 어려워요. 내일 다시 연락드려도 될까요?'],
  ['각자 편하게 쓸 수 있는 만큼 같이 보자.', '내가 더 내고 싶은 부분은 말해도 되지?', '네가 돈 신경 안 썼으면 좋겠어.'],
  ['한 장소를 빼자.', '출발을 늦추자.', '내가 꼭 보고 싶은 하나만 남기고 다시 짜자.'],
  ['너한테 좋은 하루를 해 주고 싶었어.', '내가 아직 해 줄 수 있는 게 있다는 걸 보여 주고 싶었어.', '좋은 데 가면 우리 사이도 좀 편해질 것 같았어.'],
  ['조건만 남겨 두자. 결제는 같이 정하고.', '이번에는 각자 하루를 보내도 괜찮아.', '우리가 원하는 걸 하나씩 더 말해 보자.'],
  ['이동을 덜 힘들게 하고 싶어.', '좋아하는 풍경에 오래 있고 싶어.', '이번에는 돈을 남기고 싶어.'],
  ['부산에서 하룻밤 보내는 후보를 맞춰 보자.', '서울에서 하루를 정하자.', '이번 여행은 미루자.'],
  ['오늘은 후보로 두자.', '둘 다 확실히 갈 수 있는지 한 번 더 확인하자.', '내가 먼저 잡아 두면 마음이 편할 것 같아.'],
  ['오늘 남은 돈으로만 생각하자.', '기대한 만큼 조금 아쉽다고 인정하자.', '지훈한테 농담 한 번 돌려주자.'],
  ['간단히 같이 먹을까?', '오늘은 각자 먹고 쉬자.', '내일 집에서 함께 먹는 건 어때?'],
  ['그럼 컵부터 같이 꺼내자.', '먹고 싶은 거 하나씩만 정하자.', '내일 만나서 배고픈 만큼 고르자.'],
  ['지금 답할 수 있는 말은 보내자.', '생각할 시간이 더 필요하다고 알리자.', '오늘은 미뤄 두고 싶어.'],
  ['생활에 필요한 돈은 그대로 두자.', '함께 쓰기로 한 범위만 따로 생각해 두자.', '아직 정하지 말고 오늘은 더 쓰지 말자.']
];

test('DAY19 registry is locked to the verified Notion snapshot', () => {
  assert.equal(DAY19_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-8126-8d1d-dd90f6b6d7f4');
  assert.equal(DAY19_V4_SOURCE_LAST_EDITED, '2026-08-27T20:11:18.241Z');
  assert.equal(DAY19_V4_SOURCE_SCENES.length, 24);
  assert.deepEqual(DAY19_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  assert.equal(DAY19_V4_SOURCE_SCENES[0].title, '창문이 큰 방');
  assert.equal(DAY19_V4_SOURCE_SCENES.at(-1).title, '같이 고친 하루');
});

test('DAY19 registry preserves all 16 exact three-label choices', () => {
  const choices = DAY19_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.deepEqual(choices.map(choice => choice.number), Array.from({length: 16}, (_, index) => index + 1));
  assert.deepEqual(choices.map(choice => [...choice.labels]), expectedLabels);
});

test('DAY19 registry excludes editorial notes and keeps non-choice source prose', () => {
  const text = DAY19_V4_SOURCE_SCENES.map(scene => scene.body).join('\n');
  assert.doesNotMatch(text, /INTERNAL EDITORIAL NOTES|플레이어 비노출/);
  assert.match(text, /나는 오늘 후보를 남기는 데까지 마쳤다/);
  assert.match(text, /새로운 월급은 적지 않았다/);
  assert.match(text, /확인할 내용이 남으면 오늘은 결제를 멈췄다/);
});

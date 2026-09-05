import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DAY23_V4_SOURCE_PAGE_ID, DAY23_V4_SOURCE_SCENES, DAY23_V4_SOURCE_SHA256} from '../src/day23-v4-source-registry.mjs';
import {day23V4SourceRef, validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';

test('DAY23 registry preserves all source scenes and choice variants', () => {
  assert.equal(DAY23_V4_SOURCE_PAGE_ID, '3c9c31f0-29a6-814b-b599-e8b6ed6f23a6');
  assert.equal(DAY23_V4_SOURCE_SHA256, 'd0abf2a4f1ead70b38eb6429ca12df49def0ecc699e499cb35e6dd0327641055');
  assert.deepEqual(DAY23_V4_SOURCE_SCENES.map(scene => scene.number), Array.from({length: 24}, (_, index) => index + 1));
  const choices = DAY23_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  assert.equal(choices.length, 24);
  assert.deepEqual(choices.filter(choice => choice.variant === 'MAIN').map(choice => choice.number), Array.from({length: 17}, (_, index) => index + 1));
  assert.deepEqual(choices.filter(choice => choice.variant === 'NO_PENDING_CONTACT').map(choice => choice.number), [14]);
  assert.deepEqual(choices.filter(choice => choice.variant === 'NO_TRAVEL').map(choice => choice.number), [3, 4, 5, 6, 7, 8]);
  assert.equal(choices.every(choice => choice.labels.length === 3), true);
  const raw = readFileSync(new URL('../docs/scenarios/DAY23_SCENARIO_V4_NOTION.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(raw).digest('hex'), DAY23_V4_SOURCE_SHA256);
});

test('DAY23 registry keeps return, relationship, contact and no-travel labels exact', () => {
  const choices = DAY23_V4_SOURCE_SCENES.flatMap(scene => scene.choices);
  const find = (number, variant = 'MAIN') => choices.find(choice => choice.number === number && choice.variant === variant);
  assert.deepEqual([...find(1).labels], ['천천히 아침부터 먹자.', '짐을 조금 정리하고 쉬자.', '아직 피곤하네. 남은 계획을 줄이자.']);
  assert.deepEqual([...find(10).labels], ['도착하면 한 줄만 보내 줘.', '저녁에 둘 다 괜찮으면 잠깐 통화할까?', '오늘은 푹 쉬고 나중에 이야기하자.']);
  assert.deepEqual([...find(14).labels], ['지금 관계를 이어 가고 싶은 뜻에 맞게 답하자.', '내가 아직 흔들린다는 걸 숨기지 말자.', '관계를 끝내고 싶은 마음이 있다면 하은에게 먼저 말하자.']);
  assert.deepEqual([...find(14, 'NO_PENDING_CONTACT').labels], ['나는 계속 너를 만나고 싶어.', '너와 어떤 미래를 원하는지도 이야기해 보고 싶어.', '오늘은 그냥 보고 싶다는 말부터 할래.']);
  assert.deepEqual([...find(3, 'NO_TRAVEL').labels], ['동네를 잠깐 걸을까.', '하은도 원하면 가까이서 잠깐 만날까.', '오늘은 집이 좋다.']);
});

test('DAY23 source references validate exact player-facing lines only', () => {
  const source = day23V4SourceRef(19, '**하은** “아까까지 봤는데 벌써 보고 싶어?”');
  assert.equal(validateDay23V4SourceStep({type: 'dialogue', source}), true);
  assert.equal(validateDay23V4SourceStep({type: 'dialogue', source: {...source, exact: '**하은** “벌써 보고 싶어?”'}}), false);
  assert.throws(() => day23V4SourceRef(19, 'DAY22 관계 톤 플래그를 회수한다.'), /DAY23_SOURCE_LINE_MISSING/);
});

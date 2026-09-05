import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const sourcePath = new URL('../docs/scenarios/DAY21_SCENARIO_V4_NOTION.md', import.meta.url);
const source = readFileSync(sourcePath, 'utf8');

test('DAY21 source snapshot is byte-locked to the fetched Notion V4 player body', () => {
  assert.equal(source.length, 19525);
  assert.equal(createHash('sha256').update(source).digest('hex'),
    '39797c3086e9e2f23c4fc4acc37c9fe1525816e74a21fd709b011a4fdbcb9589');
  assert.match(source, /^## SCENE 01 — 먼저 일어난 사람/m);
  assert.match(source, /^## SCENE 24 — 남아 있는 이유/m);
  assert.match(source, /\\\[DAY 21 END\\\]\n+$/);
});

test('DAY21 source snapshot preserves 24 scenes, 16 main choices and five no-talk alternatives', () => {
  const scenes = [...source.matchAll(/^## SCENE (\d+) — (.+)$/gm)];
  const mainChoices = [...source.matchAll(/^### 선택 (\d+) — (.+)$/gm)];
  const noTalkChoices = [...source.matchAll(/^### 이 경로의 선택 (\d+) — (.+)$/gm)];
  assert.deepEqual(scenes.map(match => Number(match[1])), Array.from({length: 24}, (_, index) => index + 1));
  assert.deepEqual(mainChoices.map(match => Number(match[1])), Array.from({length: 16}, (_, index) => index + 1));
  assert.deepEqual(noTalkChoices.map(match => Number(match[1])), [4, 5, 6, 7, 8]);
  assert.equal(new Set(scenes.map(match => match[2])).size, 24);
});

test('DAY21 player source excludes editorial notes and preserves knowledge and consent boundaries', () => {
  assert.doesNotMatch(source, /INTERNAL EDITORIAL NOTES|플레이어 비노출/);
  assert.match(source, /이날 듣지 않은 이야기는 내 기억에 들어오지 않았다\./);
  assert.match(source, /오늘 하지 않은 대화는 내일의 추억에 포함되지 않았다\./);
  assert.match(source, /어제 같은 집에 있었다고 내일도 같은 공간이 당연한 것은 아니었다\./);
  assert.match(source, /같은 방에서 쉬고 싶다는 말에 더 많은 행동의 동의를 붙이지 않았다\./);
  assert.match(source, /가능한 이동편과 방이 있고 서로 동의한 경우에만 여행을 확정했다\./);
});

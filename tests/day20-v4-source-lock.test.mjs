import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const sourcePath = new URL('../docs/scenarios/DAY20_SCENARIO_V4_NOTION.md', import.meta.url);
const source = readFileSync(sourcePath, 'utf8');

test('DAY20 source snapshot is byte-locked to the fetched Notion V4 body', () => {
  assert.equal(source.length, 19242);
  assert.equal(createHash('sha256').update(source).digest('hex'),
    '9db072f65fd3b0e0bf930628bbcb9e1601153413377baced59b0ae43ceeb3c1e');
  assert.match(source, /^## SCENE 01 — 의자 위에 있던 하루/m);
  assert.match(source, /^## SCENE 24 — 두 개의 컵, 하나의 컵/m);
  assert.match(source, /\\\[DAY 20 END\\\]\n+$/);
});

test('DAY20 source snapshot contains every numbered scene and choice once', () => {
  const scenes = [...source.matchAll(/^## SCENE (\d+) — (.+)$/gm)];
  const choices = [...source.matchAll(/^### 선택 (\d+) — (.+)$/gm)];
  assert.deepEqual(scenes.map(match => Number(match[1])), Array.from({length: 24}, (_, index) => index + 1));
  assert.deepEqual(choices.map(match => Number(match[1])), Array.from({length: 14}, (_, index) => index + 1));
  assert.equal(new Set(scenes.map(match => match[2])).size, 24);
  assert.equal(new Set(choices.map(match => match[2])).size, 14);
});

test('player source excludes the editorial appendix and keeps consent boundaries', () => {
  assert.doesNotMatch(source, /INTERNAL EDITORIAL NOTES|플레이어 비노출/);
  assert.match(source, /앞서 어깨를 기대거나 손을 잡는 것이 편안했던 사이라도, 오늘 새롭게 안고 싶은 마음은 같은 행동이 아니었다\./);
  assert.match(source, /그것이 새로운 접촉 전부를 허락한 말은 아니었다\./);
  assert.match(source, /하은과 연락이 가능한 사이면 실제 메시지를 보냈다\. 그녀가 거리를 요청한 상태에서는 보내지 않고 내일 합의한 연락만 남겼다\./);
});

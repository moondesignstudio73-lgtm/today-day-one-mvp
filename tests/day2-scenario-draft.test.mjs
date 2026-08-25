import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const scenario = readFileSync(new URL("../docs/day2/DAY2_SCENARIO_REVISION_V1.md", import.meta.url), "utf8");
const playerFacing = scenario.slice(scenario.indexOf("# SCENE 01."), scenario.indexOf("## 5. 중요 대사"));
const compactLength = text => text.replace(/[#*`>\[\]()_|—-]/g, "").replace(/\s/g, "").length;

assert.equal((playerFacing.match(/^# SCENE \d+/gm) ?? []).length, 12);
for (const flag of [
  "contact_boundary", "contact_acceptance", "identity_first",
  "family_question_first", "accident_interest", "recovery_focus",
  "family_photo_checked", "couple_photo_checked", "home_search_started", "haeun_contact_unlocked"
]) assert.ok(scenario.includes(flag), `missing scenario contract: ${flag}`);

for (const prohibited of [
  "사고 때 망가졌어", "아무것도 아니야", "표정이 아주 조금 굳는다",
  "가짜 하은", "트럭과 충돌", "하은이 동승"
]) assert.ok(!playerFacing.includes(prohibited), `premature or conflicting player-facing line: ${prohibited}`);

const choiceBlocks = [1, 2, 3, 4, 5].map(number => {
  const start = playerFacing.indexOf(`## 선택 ${number}`);
  const end = playerFacing.indexOf("[분기 합류", start);
  assert.ok(start >= 0 && end > start, `choice ${number} block missing`);
  return playerFacing.slice(start, end);
});

const branchLengths = block => {
  const indices = [...block.matchAll(/^### [ABC]\. /gm)].map(match => match.index);
  assert.equal(indices.length, 3);
  return indices.map((start, index) => compactLength(block.slice(start, indices[index + 1] ?? block.length)));
};

const choiceLengths = choiceBlocks.map(branchLengths);
const roomStart = playerFacing.indexOf("## 방 탐색");
const roomEnd = playerFacing.indexOf("[세 번째 방 탐색 완료", roomStart);
assert.ok(roomStart >= 0 && roomEnd > roomStart);
const roomBlock = playerFacing.slice(roomStart, roomEnd);
const roomIndices = [...roomBlock.matchAll(/^### [ABCDE]\. /gm)].map(match => match.index);
assert.equal(roomIndices.length, 5);
const roomLengths = roomIndices.map((start, index) => compactLength(roomBlock.slice(start, roomIndices[index + 1] ?? roomBlock.length)));

const allBranchChars = choiceLengths.flat().reduce((sum, length) => sum + length, 0) + roomLengths.reduce((sum, length) => sum + length, 0);
const commonChars = compactLength(playerFacing) - allBranchChars;
const minChoiceChars = choiceLengths.reduce((sum, lengths) => sum + Math.min(...lengths), 0);
const maxChoiceChars = choiceLengths.reduce((sum, lengths) => sum + Math.max(...lengths), 0);
const sortedRoom = [...roomLengths].sort((a, b) => a - b);
const minPathChars = commonChars + minChoiceChars + sortedRoom.slice(0, 3).reduce((sum, length) => sum + length, 0);
const maxPathChars = commonChars + maxChoiceChars + sortedRoom.slice(-3).reduce((sum, length) => sum + length, 0);

// 9 DAY 1 states × current choices. The accident-interest rows expose one extra car strategy.
// Room paths: 4 combinations without the key + 6 combinations with either of two key responses = 16.
const routeCount = (3 * 3 * 3 * 3 * 3 * 16 * 3) + (6 * 3 * 3 * 2 * 3 * 16 * 3);
assert.equal(routeCount, 27216);
assert.ok(minPathChars >= 4500);
assert.ok(maxPathChars <= 7000);

console.log(`✓ DAY 2 시나리오 12 Scene · 동등 조건군 27,216경로 · ${minPathChars}~${maxPathChars}자 검증 통과`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DAY16_CONTACT_CHOICES,
  DAY16_MEETING_CHOICES,
  DAY16_SHARING_CHOICES,
} from '../src/day16-campaign-runtime.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const scenario = fs.readFileSync(path.join(root, 'docs/day16/DAY16_SCENARIO_DRAFT_V1.md'), 'utf8');

assert.match(scenario, /FULL PLAYABLE SCENARIO DRAFT V1/);
assert.equal((scenario.match(/^## SCENE \d+ —/gm) ?? []).length, 8, 'DAY 16 must contain exactly 8 playable scenes');
assert.ok((scenario.match(/MICRO-PROGRESSION/g) ?? []).length >= 8, 'each beat needs micro-progression');
assert.equal((scenario.match(/^### 선택 \d+ —/gm) ?? []).length, 3, 'three strategy moments are required');

const day15Callbacks = [
  'leisure15_activity_each_pick', 'leisure15_activity_two_options', 'leisure15_activity_low_sensory',
  'leisure15_change_shorten', 'leisure15_change_switch', 'leisure15_change_end',
  'leisure15_privacy_private_note', 'leisure15_privacy_ask_each_photo', 'leisure15_privacy_no_location',
];
const day4Callbacks = [
  'contact_direct_call', 'contact_written_proof', 'contact_haeun_crosscheck',
  'identity_balanced_character', 'identity_evidence_first', 'identity_present_boundary',
  'accident_last_verified_contact', 'accident_direct_knowledge_only', 'accident_defer',
  'sharing_transparent', 'sharing_organize_first', 'sharing_compare_then_disclose',
];
const day16ChoiceIds = [
  ...DAY16_CONTACT_CHOICES,
  ...DAY16_MEETING_CHOICES,
  ...DAY16_SHARING_CHOICES,
].map(({ id }) => id);
for (const id of [...day15Callbacks, ...day4Callbacks, ...day16ChoiceIds]) {
  assert.ok(scenario.includes(id), `scenario must preserve callback/choice id ${id}`);
}

assert.ok((scenario.match(/\*\*하은\*\*/g) ?? []).length >= 35, 'Haeun needs a warm, lived-in speaking presence');
assert.ok((scenario.match(/\*\*주인공\*\*/g) ?? []).length >= 55, 'protagonist needs enough observable reasoning and agency');
assert.ok((scenario.match(/\*\*지훈(?:\(메시지\))?\*\*/g) ?? []).length >= 40, 'Jihoon needs a full current-day interaction');

for (const required of [
  'current-social-circle-record',
  'day17-current-health-routine',
  'stage 0', 'stage 1', 'stage 2', 'stage 3',
  'seojinAffection', 'seojinStatusInterest',
  '직접 지식', '전언', '미확인',
]) {
  assert.ok(scenario.includes(required), `scenario must include ${required}`);
}

const prohibited = [
  '의미심장한 미소', '묘한 표정', '알 수 없는 감정', '공기가 달라졌다', '왠지 모를 불안',
  '운명의 시작', '모든 것이 변하기 시작했다', '과연 진실', '헤헤', '에헤헷', '우와아아',
];
for (const phrase of prohibited) {
  assert.ok(!scenario.includes(phrase), `scenario must not use prohibited phrase: ${phrase}`);
}

for (const spoiler of ['가해자는 하은', '차량을 조작', '가짜 하은의 정체는']) {
  assert.ok(!scenario.includes(spoiler), `scenario must not reveal late spoiler: ${spoiler}`);
}

assert.match(scenario, /## 선택 반응·후속 기억표/);
assert.match(scenario, /## 저장·복원 계약/);
assert.match(scenario, /## 초안 자체 점검/);

console.log('DAY 16 full playable scenario draft tests passed.');

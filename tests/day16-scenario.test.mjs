import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  DAY16_CONTACT_CHOICES,
  DAY16_MEETING_CHOICES,
  DAY16_SHARING_CHOICES,
} from '../src/day16-campaign-runtime.mjs';

const scenario = readFileSync(new URL('../docs/day16/DAY16_SCENARIO_DRAFT_V1.md', import.meta.url), 'utf8');
const contract = readFileSync(new URL('../docs/day16/DAY16_CHAPTER_CONTRACT_V1.md', import.meta.url), 'utf8');
const qa = readFileSync(new URL('../docs/day16/DAY16_SCENARIO_QA_V1.md', import.meta.url), 'utf8');

assert.ok(scenario.includes('NARRATIVE QA PASS · SCENARIO LOCK V1'));
assert.ok(contract.includes('CHAPTER CONTRACT LOCK V1'));
assert.equal((scenario.match(/^## SCENE \d+ —/gm) ?? []).length, 8);
assert.deepEqual(
  [DAY16_CONTACT_CHOICES.length, DAY16_MEETING_CHOICES.length, DAY16_SHARING_CHOICES.length],
  [3, 3, 3],
);
for (const choice of [...DAY16_CONTACT_CHOICES, ...DAY16_MEETING_CHOICES, ...DAY16_SHARING_CHOICES]) {
  assert.ok(scenario.includes(choice.id), `시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label), `시나리오 선택 문구 누락: ${choice.id}`);
}

const callbacks = [
  'leisure15_activity_each_pick', 'leisure15_activity_two_options', 'leisure15_activity_low_sensory',
  'leisure15_change_shorten', 'leisure15_change_switch', 'leisure15_change_end',
  'leisure15_privacy_private_note', 'leisure15_privacy_ask_each_photo', 'leisure15_privacy_no_location',
  'contact_direct_call', 'contact_written_proof', 'contact_haeun_crosscheck',
  'identity_balanced_character', 'identity_evidence_first', 'identity_present_boundary',
  'accident_last_verified_contact', 'accident_direct_knowledge_only', 'accident_defer',
  'sharing_transparent', 'sharing_organize_first', 'sharing_compare_then_disclose',
];
for (const callback of callbacks) assert.ok(scenario.includes(callback), `이전 선택 콜백 누락: ${callback}`);

for (const strategy of ['social16_meeting_public_45', 'social16_meeting_topics_current', 'social16_meeting_exit_anytime']) {
  assert.ok((scenario.match(new RegExp(strategy, 'g')) ?? []).length >= 4, `만남 전략별 실행·상태·기억 부족: ${strategy}`);
}
for (const marker of [
  'current-social-circle-record', 'jihun-current', 'day17-current-health-routine',
  'stage 0', 'stage 1', 'stage 2', 'stage 3',
  '사고 이틀 전', '직접 지식', '전언', '미확인',
  'seojinAffection', 'seojinStatusInterest',
  '내러티브 QA와 시나리오 잠금 판정은 완료했다',
]) assert.ok(scenario.includes(marker), `불변·후속 계약 누락: ${marker}`);

for (const forbidden of [
  '사고는 고의였다', '가해자는', '하은이 사고에 동승', '아무것도 아니야',
  '의미심장한 미소', '묘한 표정', '알 수 없는 감정', '공기가 달라졌다',
  '왠지 모를 불안', '운명의 시작', '모든 것이 변하기 시작했다', '과연 진실',
]) assert.equal(scenario.includes(forbidden), false, `조기 공개·악역 코딩 금지: ${forbidden}`);

const haeun = (scenario.match(/\*\*하은\*\*/g) ?? []).length;
const protagonist = (scenario.match(/\*\*주인공\*\*/g) ?? []).length;
const jihun = (scenario.match(/\*\*지훈(?:\(메시지\))?\*\*/g) ?? []).length;
assert.ok(haeun >= 50 && protagonist >= 80 && jihun >= 45, '세 화자 모두 완전 챕터 밀도가 필요하다');
assert.ok(protagonist > haeun, '지훈 조사 구간에서는 주인공의 질문 주도가 자연스럽다');
assert.ok((scenario.match(/MICRO-PROGRESSION/g) ?? []).length >= 8, '30~90초 미세 진행 표식 필요');

for (const marker of [
  'NARRATIVE QA PASS', 'SCENARIO LOCK V1', 'NEEDS FIX`: 0',
  'QA에서 발견하고 수정한 결함', 'DAY 16 기존 에셋 감사',
]) assert.ok(qa.includes(marker), `QA 판정 누락: ${marker}`);

console.log('✓ DAY 16 8 Scene·9선택·21콜백·화자·밀도·정보 예산 QA PASS');

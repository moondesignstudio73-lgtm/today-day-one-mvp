# DAY 16 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`

기준 시나리오: `docs/day16/DAY16_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 3종, 하은 DAY 8 생활 외출복 1종, 지훈 기존 NPC 1종으로 8개 Scene과 카페 퇴장 분기를 구성할 수 있다.
- 신규 최종 아트 필요: 0종. 기존·사용자 자산을 덮어쓰거나 삭제·이동하지 않는다.
- 이번 관문 상태는 `assetStatus: audited`다. 다음 이미지 QA 관문에서 파일 규격·선명도·크롭·알파·UI 안전 여백을 기술·육안 검사한 뒤 `ready`로 전환한다.
- DAY 16은 사고 의심 구간의 첫날이지만, 시각·음향은 지훈의 직접 지식 범위를 차분히 확인하는 생활적 만남을 유지한다.

## 기존 자산 감사

| ID | 파일 | Scene | 재사용 판정 |
|---|---|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | S01·S02·S07·S08 | 아침 연락 확인과 저녁 관계망 정리를 같은 생활 공간에서 잇는다. 저녁은 색조 공포화 없이 조명·대사 시간 정보로만 구분한다. |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | S03~S06 | 공개된 낮 카페에서 소개·명함·직접 지식 범위·종료권을 확인하는 장면에 적합하다. |
| `neighborhood-street-day` | `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png` | S06 퇴장 분기 | 합의한 종료권을 실제 행동으로 실행하고 낮 거리로 나오는 종결 공간에 적합하다. |
| `day8` | `assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png` | S01·S02·S07·S08 | 집 안의 연락 준비와 저녁 기록 정리에 어울리는 차분하고 생활적인 복장이다. |
| `best-friend` | `assets/npcs/best-friend.png` | S03~S06 | DAY 4부터 이어진 지훈의 현재 인물 자산으로 재사용한다. 다른 친구 NPC로 대체하지 않는다. |

연락처·답장·단체 알림·관계망 화면은 이름·계정·시간·기기 정보가 읽히지 않는 흐린 소품으로 둔다. 지훈과 하은을 감시자/피감시자처럼 분리하거나, 과거 미디어를 증거 CG처럼 확대하지 않는다.

## Scene별 연출 계약

| Scene | 배경·화면·카메라 | 전환 | 오디오·안전 규칙 |
|---|---|---|---|
| S01 확인 상태가 다른 연락처 | `home-morning`, 연락 상태 목록 근접→주방 투샷 | fade | `daily` 0.065, 휴대전화 키·컵. 빈칸을 공포 단서가 아닌 확인 대기 항목으로 제시 |
| S02 답장 문장 고르기 | `home-morning`, 흐린 답장 초안→투샷 | crossfade | `daily` 0.06, 휴대전화·화면 종료·연필. 하은이 대신 답하지 않고 함께 문장을 고른다 |
| S03 현재 연락 범위 | `neighborhood-cafe-day`, 공개 입구 와이드→세 사람 중경 | crossfade | `daily` 0.065, 자동문·컵. 지훈 등장에 충격 컷이나 의심 sting 금지 |
| S04 편집하지 않은 소개 | `neighborhood-cafe-day`, 명함·포트폴리오 근접→테이블 투샷 | cut | `daily` 0.06, 문서·연필. 현재 역할과 직접 확인 범위만 화면에 남긴다 |
| S05 친구라는 이름의 범위 | `neighborhood-cafe-day`, 흐린 단체 알림→서로 다른 시선의 투샷 | crossfade | `daily` 0.055, 휴대전화·화면 종료. 닫힌 과거 미디어를 위협으로 과장하지 않는다 |
| S06 만남의 종료권 | 카페 기본→`neighborhood-street-day`, 출구·낮 거리 와이드 | cut | `daily` 0.06, 가방 지퍼·자동문. 세 전략 모두 종료권을 실제 이동으로 확인한다 |
| S07 내 소식의 주인 | `home-morning`, 저녁 식탁·흐린 관계망 메모→투샷 | crossfade | `daily` 0.06, 컵·연필·휴대전화. 제3자 공유 동의를 생활 규칙으로 정리 |
| S08 한 명씩 다시 | `home-morning`, 관계망 빈칸 근접→저녁 투샷 | fade | `daily` 0.065, 문서·화면 종료. DAY 17 건강 루틴 훅을 평온하게 연결 |

## 오디오 계약

- 전 Scene은 기존 `daily`, variant 0, volume 0.055~0.065만 사용한다. S05의 직접 지식 한계 확인에서도 미스터리·위기·심박 BGM으로 전환하지 않는다.
- 재사용 생활 SFX: `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`, `SFX_DOCUMENT_RECEIVE`, `SFX_PENCIL_NOTE`, `SFX_CUP_SET_DOWN`, `SFX_AUTO_DOOR`, `SFX_BAG_ZIPPER`.
- 전화벨·심장박동·충돌·충격·위기·글리치 음향과 붉은 색보정·공포 줌·화면 흔들림·하은 단독 감시 구도를 금지한다.
- 음향은 연락 작성, 서류 확인, 컵, 공개 장소 출입과 퇴장 같은 실제 행동만 표시하며 지훈의 증언을 정답으로 보증하지 않는다.

## 다음 관문

- 배경 3종, 하은 DAY 8 스프라이트, 지훈 NPC의 파일 존재·PNG 규격·색상 유형·투명도·선명도·크롭·UI 안전 여백을 기술·육안 검사한다.
- `IMAGE QA PASS`, `NEEDS FIX: 0`을 확인한 뒤 8 Scene의 `assetStatus`를 `ready`로 전환한다.

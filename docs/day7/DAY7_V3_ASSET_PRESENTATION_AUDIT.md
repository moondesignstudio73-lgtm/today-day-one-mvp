# DAY 7 V3 Asset & Presentation Audit

## Verdict

`AUDIT PASS / PRODUCTION REQUIRED` — 최신 Notion V3의 24개 문서 Scene(단일 경로 22개)을 실제 지도와 기존 16:9 자산으로 구성할 수 있다. 다만 DAY 2의 행동 중심 CG 기준을 만족하려면 회사 사진·카드·손 제안 장면 전용 자산을 신규 제작한 뒤 원본/브라우저 이미지 QA를 통과해야 한다. 이 관문은 자산 적합성 및 제작 경계 확정이며 이미지 QA 완료 판정은 아니다.

## DAY 2 invariant comparison

| 기준 | DAY 2 기준점 | DAY 7 V3 판정 |
|---|---|---|
| 비율/선명도 | 배경·행동 CG 1672×941, 약 16:9 | 지도 배경 9종과 기존 DAY 7 배경 모두 1672×941로 PASS |
| 장면 행동성 | 열쇠·사진·손동작을 화면 안에서 전달 | S02 사진, S17 카드, S21 손 제안은 신규 행동 CG 필수 |
| 캐릭터 정체성 | 보라색 단발·동일 얼굴/체형 | `haeun-day7-date-dusty-rose-2d-v1.png` 887×1774 재사용 PASS |
| 합성 일체감 | 동일 원근·조명, 알파 프린지 없음 | 의상 원본은 투명 가장자리 양호. 실제 합성 QA는 V3 프레젠테이션 연결 후 수행 |
| UI 안전 영역 | 상단 HUD·하단 대화창 밖에 얼굴/손/소품 | 지도 배경은 중앙/측면 여백 충분. 신규 CG는 얼굴·카드·손을 화면 중앙 60%에 고정 |
| cover/crop | 원본 비율 왜곡·과도한 크롭 없음 | 1672×941 원본을 `cover`하되 모바일 초상 화면에서는 중심 앵커를 장면별 지정 |

## Existing asset reuse map

| V3 Scene | 장소/행동 | 자산 판정 |
|---|---|---|
| S01–S04 | 집, 휴대전화 알림, 데이트 준비 | 기존 집 배경·휴대전화 UI 재사용. S02 사진 내용은 신규 CG |
| S05–S07 | 만남과 이동 | `haeun-day7-date-dusty-rose-2d-v1.png` 및 실제 지도 이동 UI 재사용 |
| S08 야경 경로 | 남산역→K타워→전망대/레스토랑 | `049_namsan-station`, `050_k-tower`, `051_sky-observatory`, `052_tower-restaurant` 재사용 |
| S09 놀이공원 경로 | 드림캐슬→호수 산책로 | `038_dream-castle`, `042_lake-promenade` 재사용 |
| S10 서점 경로 | 중앙백화점 내부 북 코너→식품관 | `044_central-department`, `048_department-food` 재사용. 독립 서점 배경은 제외 |
| S11–S16 | 경로 콜백·대화·식사 | 해당 경로 지도 배경과 하은 의상 재사용, 표정/배치 변주 |
| S17–S20 | 카드 앞·뒷면, 노래/서진 대화 | 카드 POV 신규 CG 필수 |
| S21–S22 | 손 제안/동의/비접촉 작별 | 손 제안·성립/유보를 보여 주는 신규 POV CG 필수 |
| S23–S24 | 귀가 문자·지훈 초대 | 기존 메시지/통화 UI 재사용 |

## Explicit non-reuse decisions

- `day7-small-bookshop-day-v1.png`: 선명도와 16:9 품질은 통과하지만 거리의 독립 서점으로 읽힌다. 최신 원고의 `중앙백화점 내부 북 코너`를 거짓 장소로 바꾸므로 V3에서는 사용하지 않는다.
- `day7-river-promenade-day-v1.png`: 최신 세 경로에 없는 낮 강변이며 V1 압축 사건의 잔재다. V3 장면 수를 채우기 위한 임의 삽입을 금지한다.
- 지도 배경만 반복하고 핵심 소품을 대사로 설명하는 방식: DAY 2 행동성 기준 미달이므로 금지한다.

## Required production set

1. `S02 company-photo-phone`: 휴대전화 화면 안 단체 사진, 주인공의 종이 왕관과 볼 테이프가 읽히되 서진의 개인 관심을 확정하지 않는 구도.
2. `S17 card-front-back-pov`: 노래 제목이 적힌 앞면과 손글씨 문장이 있는 뒷면을 실제 손동작으로 뒤집어 보여 주는 POV.
3. `S21 hand-offer-consent-pov`: 하은이 먼저 손을 내미는 제안과 주인공의 수락/유보가 모두 성립하도록 접촉 직전 안전 구도. 최대 스킨십은 손잡기.

모든 신규 자산은 1672×941 이상, 16:9, 얼굴·손·핵심 소품 중앙 안전 영역, 하은의 보라색 단발/더스티 로즈 복장, 동일 광원·그림자를 지켜야 한다. 원본 육안 QA와 데스크톱·모바일 실제 브라우저 QA 전에는 `IMAGE PASS`로 표시하지 않는다.

## Audio and direction boundary

- 기존 지도별 ambience와 공통 UI/메시지 효과음을 우선 재사용한다.
- 경로 전환은 야경의 도시 저역, 놀이공원의 원거리 군중, 북 코너의 실내 정숙음으로 구분한다.
- S17 카드 뒤집기와 S21 손 제안에는 작은 종이 마찰/옷깃·손 움직임만 사용하며 감정을 강요하는 과도한 효과음을 금지한다.
- 관계 LOW·신뢰 부족·거짓 상태에서는 S21 CG가 접촉 완료로 보이지 않게 하고 비접촉 프레임에서 종료한다.

## Next gate

위 3종 행동 CG를 제작·원본 검사하고 V3 프레젠테이션 데이터에 장면별 배경, 캐릭터 앵커, CG, ambience/SFX를 연결한다. DAY 8은 시작하지 않는다.

## Production log — 2026-08-28

| 자산 | 원본 QA | 결과 |
|---|---|---|
| `cg-day7-card-front-back-pov-v1.png` | 1672×941, 한 카드의 앞/뒷면 연속 컷, 손·카드 중앙 안전 영역, 최종 문장과 취소 문장 대조 | PASS |
| `cg-day7-hand-offer-consent-pov-v1.png` | 1672×941, 하은 보라색 단발·더스티 로즈 의상, 하은이 먼저 제안, 접촉 전 정지, 양손/얼굴 안전 영역 | PASS |
| 회사 사진 1차 생성본 | 1672×941, 휴대전화 POV·테이프·간식·평범한 팀 행사 | REJECT — 원고의 `뒤집힌 종이 왕관` 대신 왕관이 세워져 있어 프로젝트에 반입하지 않음 |
| `cg-day7-company-photo-phone-pov-v1.png` | 1672×941, 세로 휴대전화 POV, 숙인 주인공·테이프 끝·간식, 왕관 끝이 테이블에 닿고 개구부가 위를 향함, 배경 동료 비식별 | PASS |

카드 1차 생성본도 원고에 없는 앞면 문장을 만들었으므로 폐기했다. 탈락본은 프로젝트 자산으로 복사하지 않았다. 최종 3종은 모두 내장 이미지 생성 도구로 제작했으며, 핵심 프롬프트는 각각 `회사 팀 행사/뒤집힌 왕관·테이프·비식별 동료`, `동일 카드 앞뒷면/정확한 두 문장`, `하은의 접촉 전 손 제안/선택 공통 프레임`이었다.

원본 3종은 1672×941, 16:9, 중앙 안전 영역과 DAY 2 행동성 기준을 PASS했다. 다음 관문은 V3 프레젠테이션 데이터에 연결하고 실제 데스크톱·모바일 화면에서 cover/crop·HUD/대화창 가림을 검증하는 것이다.

## V3 presentation/audio integration — 2026-08-28

- 24개 문서 Scene 모두 배경 URL, DAY 7 하은 의상, 표정/포즈, 카메라, 전환, BGM, SFX, 중앙 안전 영역 계약을 갖는다.
- 야경은 남산역→K타워→전망대→타워 레스토랑→러브 테라스, 놀이공원은 잠실역→드림캐슬/놀이기구→호수 산책로→동네 식사, 서점은 명동역→중앙백화점→식품관으로 실제 지도 자산을 사용한다.
- 회사 사진 CG는 S02/S12의 `RECEIVED_NOW`, S19의 `RECEIVED_NOW|DEFERRED`에만 연결하고 `DECLINED`에는 노출하지 않는다.
- 카드 CG는 S17, 접촉 전 손 제안 CG는 S21에 연결한다. 손 CG 자체는 수락·옆 걷기·더 말하기 결과를 미리 확정하지 않는다.
- BGM은 `daily`/`dateShopping`만 사용하고 위기 테마를 금지했다. 기존 DAY 1~2의 검증된 생활 소품/이동 SFX만 재사용한다.
- 집중 테스트: `day7-v3-presentation`, V3 runtime/playable/data, 레거시 DAY 7 presentation 총 5종 PASS.

다음 관문은 실제 런타임 화면 어댑터 연결 및 데스크톱·모바일 cover/crop·HUD/대화창 안전 영역 QA다.

## V3 immersive screen adapter — 2026-08-28

- 상태 기반 플레이 스크립트와 프레젠테이션을 `transition → SFX → character/event CG → dialogue/message/narration → choice` 화면 명령으로 결합했다.
- 한 경로에서 선택되지 않은 S08/S09/S10 두 Scene은 화면 단계에서도 완전히 건너뛴다. 선택 5는 실제 선택 경로 Scene에서만 열린다.
- 사진 동의 전 회사 CG 미노출, 사진 거절 후 S12/S19 미노출, 카드 S17, 접촉 전 손 제안 S21을 집중 검증했다.
- CG는 `cover`, 중앙 object-position, desktop center-80/mobile center-60 안전 영역 계약을 함께 전달한다.
- 11개 선택 이후 체크포인트 재개와 선택 반응 연속 처리, DAY 8 지훈 초대 `sceneEnd` 훅을 구현했다.
- 집중 테스트: 신규 immersive 4개 케이스와 presentation/runtime/playable/data 회귀 PASS.

다음 관문은 게임 공개 진입점에 V3 화면 어댑터를 연결하고 실제 브라우저 데스크톱·모바일 QA를 수행하는 것이다.

## Public game entrypoint integration — 2026-08-28

- `game.js`가 신규 저장을 `getDay7V3Compatibility`로 판별하고 V3 시작 상태·관계 구간·접촉 경계를 초기화한다. 기존 DAY 7 진행 저장은 V1 경로를 유지한다.
- V3 체크포인트 복원 시 `getDay7V3Presentation`의 실제 경로 배경 URL과 조건부 행동 CG 계약을 사용한다.
- 화면 시퀀스와 11개 선택 콜백은 V3 immersive adapter/runtime을 사용하며 각 선택 직후 저장하고 다음 장면으로 이어진다.
- 완료 판정은 기존 `day7MemoryStrategy`와 신규 `day7V3Complete`를 모두 허용해 자유행동·기존 저장 호환을 보존한다.
- 집중 회귀: 게임 통합 2개 + immersive 4개 + presentation/runtime/playable/data/legacy presentation, 총 10/10 PASS.

다음 관문은 실제 브라우저 데스크톱·모바일에서 세 경로의 cover/crop, HUD/대화창 가림, 핵심 CG 3종, 선택 진행과 체크포인트 복원을 육안 검증하는 것이다.

## Browser CG contract QA — 2026-08-28

- 로컬 공개 서버와 인앱 브라우저에서 1440×900 데스크톱, 390×844 모바일로 핵심 CG 3종을 원본 렌더링했다.
- 회사 사진: 휴대전화·숙인 주인공·뒤집힌 왕관·손이 중앙에 남고 모바일에서도 서사 소품이 잘리지 않는다 — PASS.
- 카드 앞뒷면: 두 면과 양손이 모두 보이며 문장 대비가 유지된다 — PASS.
- 손 제안: 하은의 얼굴·보라색 단발·더스티 로즈 의상·두 손이 중앙에 남고 접촉 전 선택 공통 구도를 유지한다 — PASS.
- 실제 화면 렌더러는 `cgShow/source`를 요구하지만 어댑터가 `eventCg/assetUrl`을 내보내던 결함을 발견했다. `cgShow`, `source`, 2400ms, `fit=contain`으로 수정하고 집중 회귀 11/11을 통과했다.
- 브라우저 콘솔 error/warning은 0이다. 선택 진행·체크포인트 복원·완료 후 DAY 8 도달성의 실제 브라우저 관문은 아직 남아 있다.

## Browser choice/save/adjacent-day QA — 2026-08-28

- `tests/day7-v3-browser-harness.html`이 실제 브라우저에서 V3 campaign data/runtime/immersive adapter를 직접 import해 11개 선택을 순서대로 실행한다.
- 선택 5 직후 JSON 직렬화·복원을 수행하고 호환 모드 `V3`, 다음 선택 `C6`, 체크포인트 11을 확인했다.
- 복원 뒤 C6~C11을 완료해 최종 `sceneEnd`, `day8-jihoon-invitation`, `day7V3Complete=true`, `day8JihoonInvitationPending=true`를 확인했다.
- 1440×900 데스크톱과 390×844 모바일 모두 PASS이며, 모바일에서는 3종 CG가 단일 열 `contain`으로 표시되어 얼굴·손·카드 문장·휴대전화 소품을 보존한다.
- 브라우저 콘솔 error/warning 0. DAY 7 실제 브라우저 시각·선택·저장 복원·인접 DAY 도달성 관문은 PASS다.

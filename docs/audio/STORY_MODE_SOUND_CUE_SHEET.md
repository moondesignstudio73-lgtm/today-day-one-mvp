# 스토리 모드 사운드 큐 시트

적용 범위: 결혼까지 30일 DAY 1~30. 대사·선택지·분기 조건은 변경하지 않는다.

## 믹싱과 상태 규칙

- BGM 목표 볼륨 0.047~0.072, Ambient 0.065~0.09, 개별 SFX 0.10~0.24, 합성 UI 0.025~0.055.
- BGM 기본 Fade In 0.8~1.4초, 감정 변화 Cross Fade 1.0~1.8초.
- 같은 음원 재요청은 재시작하지 않고 목표 볼륨만 램핑한다.
- 일반 선택지는 현재 BGM을 52~72%로 Duck하고 선택 뒤 0.32초에 복귀한다.
- 장소 변경 시 이전 Ambient를 먼저 정지한다. 전용 자산이 없는 장소에는 다른 장소 소리를 억지로 재사용하지 않는다.
- 동일 비루프 SFX는 120ms 쿨다운으로 빠른 클릭·Skip 중첩을 차단한다.
- Load·음소거·페이지 종료 시 BGM, Ambient, transient SFX 상태를 모두 초기화한다.
- 기억 연출은 `memory_minor`, `memory_medium`, `memory_major` 3단계로 나누며 강도가 높을수록 BGM을 더 낮추고 Cross Fade를 길게 잡는다.

## DAY 1 정밀 큐

| Scene | 상황 | BGM | Ambient | SFX | 전환 |
|---|---|---|---|---|---|
| D1-S01 | 병실에서 의식 회복 | 최초 침묵 → mystery_light | hospital room | cart distant | 1.0초 Fade In |
| D1-S02 | 하은과 첫 시선·접촉 범위 | mystery_light 저음량 유지 | hospital room | phone soft drop, footsteps | 유지 |
| D1-S03 | 기억상실·혼수 1년 인지 | memory/mystery_dark 수준으로 감쇠 | hospital room | door open, medical light | 1.2초 Cross Fade |
| D1-S04 | 가족의 사망 확인 | sad, 0.055 이하 | hospital room | door close | 음악 감쇠 |
| D1-S05 | 도움과 접촉 동의 | romance_soft에 가까운 theme 회복 | hospital room | cup set down | 1.2초 Cross Fade |
| D1-S06 | 결혼까지 30일 공개 | 낮은 theme → resolve | hospital room | phone screen off | 숫자 공개 전 감쇠, 결의 뒤 회복 |
| D1-END | 병실 야간 자유행동 | BGM 정지 | hospital 종료 | DAY 종료 UI | 1.2초 Fade Out |

## DAY별 기본 큐

세부 Scene의 `기억·사고·사진`, `데이트·결혼·약속`, `장례·상실`, `최종·서명` 키워드는 기본 큐보다 우선해 memory, romance, sad, tension 계열로 자연스럽게 Cross Fade된다.

| DAY | 핵심 상황 | 기본 BGM 상태 | Ambient | 주요 SFX/연출 |
|---:|---|---|---|---|
| 1 | 병원에서 눈을 뜸 | mystery_light | hospital room | 의료기기·문·발걸음, 충격 직후 감쇠 |
| 2 | 퇴원과 집 진입 | normal_daily | corridor→lobby→car→home | 자동문·안전벨트·열쇠·사진·서랍 |
| 3 | 퇴원 뒤 첫 연락 | normal_daily | hospital/home | 문서·휴대폰, 선택지 Duck |
| 4 | 사라진 1년의 흔적 | memory_medium | home | 사진·서랍·메모, 기억 장면 저음량 |
| 5 | 회사 문턱 | normal_daily | 전용 없음 | 자동문·문서, 업무 선택지 Duck |
| 6 | 동네 생활 반경 | romance_soft | home, 외부 전용 없음 | 열쇠·컵·메모 |
| 7 | 첫 현재형 데이트 | romance_deep | 외부 전용 없음 | 발걸음·컵·휴대폰 |
| 8 | 독립 외출 | normal_daily | home, 외부 전용 없음 | 열쇠·생활용품·휴대폰 |
| 9 | 두 번째 출근 | normal_daily | home, office 전용 없음 | 자동문·문서·메모 |
| 10 | 세 시간 업무 리듬 | normal_daily | home, office 전용 없음 | 자동문·문서·컵·열쇠 |
| 11 | 현재 생활표 | normal_daily | home, 외부 전용 없음 | 메모·휴대폰·발걸음·컵 |
| 12 | 현재 계정 확인 | normal_daily | home, cafe 전용 없음 | 문서·휴대폰·컵·메모 |
| 13 | 공동 예산 합의 | normal_daily | home | 예산표 메모, 선택지 Duck |
| 14 | 현재 소비 선택 | comedy | home, shop 전용 없음 | 결제 전 메모·확인 UI |
| 15 | 현재형 여가 데이트 | romance_deep | 외부 전용 없음 | 발걸음·컵·기록 확인 |
| 16 | 친구 관계 재연결 | normal_daily | home | 연락·휴대폰, 공유 선택 Duck |
| 17 | 건강 루틴 | normal_daily | home/hospital | 문서·의료 확인, 과도한 긴장음 금지 |
| 18 | 집 안전 점검 | normal_daily | home | 열쇠·서랍·메모 |
| 19 | 공동 집안일 | comedy | home | 생활 소품·완료 Confirm |
| 20 | 공동 식사 | romance_soft | home, cafe 전용 없음 | 컵·메모, 식사 선택 Duck |
| 21 | 첫 전일 근무 | tension | office 전용 없음 | 자동문·문서, 휴식 선택 전 감쇠 |
| 22 | 회복일 | sad | home | 생활 소음 유지, BGM 최저 믹싱 |
| 23 | 가족 연락 | memory_minor | home | 휴대폰·기록, 통화 전 감쇠 |
| 24 | 결혼 약속 재선택 | romance_deep | home | 메모·선택지 62% Duck |
| 25 | 결혼 범위 합의 | climax | home | 문서·비용·초대 범위 확인 |
| 26 | 법적 준비 | tension | home | 서류·서명 전 침착한 감쇠 |
| 27 | 최종 점검 | climax | home | 체크리스트·중단 선택 Duck |
| 28 | 안전 리허설 | romance_soft | home | 발걸음·메모·중단 확인 |
| 29 | 예식 전날 재확인 | climax | home | 휴대폰·컨디션 기록, 밤에는 저음량 |
| 30 | 현재의 결말 선택 | ending_day | home | 선택지 Duck→결말 BGM, DAY 종료 UI |

## 기존 리소스 분류

- BGM: `assets/audio/bgm/`의 6개 카테고리, 각 2 variant(총 12곡).
- Ambient: 병실, 병원 복도, 병원 로비, 자동차 실내, 조용한 집(총 5종).
- 환경·소품 SFX: DAY 1의 문·발걸음·컵·의료 조명·휴대폰 8종과 DAY 2의 자동문·열쇠·문서·서랍·메모·차량 등 13종.
- UI: Web Audio 합성 프리셋 `select`, `confirm`, `choiceOpen`, `save`, `success`, `dayEnd`.

## 중복·교체 및 추후 필요 리소스

- 삭제·교체한 오디오 파일 없음. 저작권이 불분명한 외부 파일 추가 없음.
- 현재 없는 전용 Ambient: 사무실 낮, 카페 낮, 주거 거리 낮/밤, 공원 낮/밤, 상점 실내.
- 현재 없는 시그니처 SFX: memory minor/medium/major riser·flash, heartbeat 3단계, 부드러운 silence tail.
- 위 자산이 추가되기 전에는 잘못된 장소의 환경음을 재사용하지 않고 BGM과 기존 소품음만 사용한다.

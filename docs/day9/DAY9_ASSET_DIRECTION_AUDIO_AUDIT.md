# DAY 9 기존 에셋·연출·오디오 감사

판정: `CONTRACT PASS / NEW ART NOT REQUIRED / IMAGE QA NOT APPLICABLE`

## 감사 기준

- DAY 9은 DAY 6~10 생활 확장 구간이므로 직장 적응을 범죄·정체 미스터리처럼 보이게 하지 않는다.
- 같은 회사 안의 로비·팀 자리·작은 회의실은 `office-day`의 열린 사무공간, 유리 회의실, 데스크 구역을 카메라로 분리한다. 서로 다른 회사처럼 보이는 배경을 섞지 않는다.
- 하은은 집에서만 밝은 생활 톤으로 표시한다. 출근길은 주인공 단독, 회사에서는 현재 발화자만 교대해 과밀한 단체 컷을 피한다.
- 윤서진의 개인적 관심과 업무 평가는 표정 색조나 위험 연출로 암시하지 않고 대사 순서와 피드백 선택으로 구분한다.

## 육안·기술 감사

| 자산 | 규격·상태 | 판정 |
|---|---|---|
| `home-morning` | 1672×941 RGB, 밝은 실내 | 하은과 출근 준비·귀가 대화 재사용 PASS |
| `neighborhood-street-day` | 1672×941 RGB, 낮 거리와 벤치 | 단독 출근·회사 앞 물병 대화 재사용 PASS. 지하철 내부로 설명하지 않는다. |
| `office-day` | 1599×900 RGB WebP, 열린 데스크·유리 회의실·휴게 구역 | 로비 방향 확인, 팀 자리, 작은 회의실을 프레이밍으로 분리해 재사용 PASS |
| 하은 기본 `smile` | 기존 캐릭터 매니페스트 | 밝은 아침·귀가 장면 PASS |
| 민호 `office-best-male` | 1024×1536 RGBA | 출입증·좌석표 안내 PASS |
| 윤서진 `female-coworker` | 1024×1536 RGBA | 자료·피드백 장면 PASS |
| 팀장 `team-lead` | 1024×1536 RGBA | 제한·책임 확인 PASS |
| 주니어 `office-rookie` | 1024×1536 RGBA | 급한 질문 장면 PASS |

모든 인물 PNG는 투명 알파를 보유하고 확대 전제 해상도를 충족한다. 자산의 복장과 소품이 회사 역할을 구분하며, 사용자 미추적 원본이나 기존 파일을 수정하지 않는다.

## Scene별 매핑

| Scene | 배경·인물 | 카메라·전환 | BGM·SFX |
|---|---|---|---|
| S01 출근 준비 | `home-morning`, 하은 `smile` | 종이 메모 medium-prop, fade | `daily`, 메모·가방 |
| S02 혼자 출근 | `neighborhood-street-day`, 인물 없음 | wide→안내판, crossfade | `daily`, 예비폰·자동문 |
| S03 로비·현재 역할 | `office-day`, 민호 중심 / 팀장·서진 교대 | medium→좌석표, crossfade | `daily`, 자동문·문서 |
| S04 적응 범위 | `office-day`, 서진 중심 / 민호 교대 | 파일 close, cut | `daily`, 문서·메모 |
| S05 권한 압박 | `office-day`, 주니어 중심 / 민호·서진 교대 | 태블릿 close→medium, cut | `daily` 0.05, 문 열림 |
| S06 책임 분리 | `office-day`, 팀장 중심 / 주니어·서진 교대 | 기록 close→medium, crossfade | `daily`, 메모·문서 전달 |
| S07 피드백 계약 | `neighborhood-street-day`, 서진 | 물병 two-shot, crossfade | `daily`, 물병 내려놓기 |
| S08 종료·귀가 | `office-day`→`home-morning`, 민호→팀장→하은 | 시계 close→집 medium, fade | `daily`, 휴대폰 종료·현관 열쇠 |

## 금지 연출

- `crisis`, `theme`, 추적성 심장박동, 이명, 색수차, 급격한 암전, 윤서진 또는 하은의 수상한 표정 금지.
- S05의 음량은 낮추되 공포 무음으로 만들지 않는다. 압박은 빈 승인란과 책임자 확인 행동으로 보여 준다.
- `office-day`를 병원·수사실·다른 회사로 설명하지 않는다. S02 거리 배경을 지하철 내부로 설명하지 않는다.
- 서진 `AFFECTION`과 `STATUS_INTEREST` 차이는 카메라 우열이나 선정적 확대가 아니라 상태 질문과 업무 질문의 분리로 표현한다.

## 오디오 계약

- 전 Scene은 `daily` BGM 0.05~0.065를 유지한다. 업무 압박도 생활 리듬 안의 책임 문제로 들려야 한다.
- 기존 DAY 1·2의 문서, 메모, 문, 휴대폰, 물병 SFX만 비파괴 재사용한다.
- S07 `SFX_CUP_SET_DOWN`은 물병을 벤치에 놓는 한 번의 소품음으로 사용한다. 관계 위기 효과로 반복하지 않는다.
- S08은 회사 종료와 귀가를 `SFX_PHONE_SCREEN_OFF`→`SFX_HOME_KEY_UNLOCK` 순서로 구분한다.

최종 판정: 기존 배경 3종과 캐릭터 5종만으로 8개 Scene의 장소·역할·감정 온도를 정확히 표현할 수 있다. 신규 최종 아트 제작과 별도 이미지 QA는 필요하지 않으며, 연출·오디오 데이터 계약은 PASS다.

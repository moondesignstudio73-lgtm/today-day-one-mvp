# DAY 16 기존 자산 이미지 품질 QA

상태: `IMAGE QA PASS`

수정 필요: `NEEDS FIX`: 0

기준 감사: `docs/day16/DAY16_ASSET_DIRECTION_AUDIO_AUDIT.md`

## 기술 검사

- 배경 3종: `1672×941, 8-bit RGB PNG`.
- 하은 DAY 8: `887×1774, 8-bit RGBA PNG`.
- 지훈 NPC: `1024×1536, 8-bit RGBA PNG`.

| 자산 | 규격 | 색상·알파 | SHA-256 | 판정 |
|---|---:|---|---|---|
| `assets/backgrounds/morning-studio-2d.png` | 1672×941 | 8-bit RGB PNG | `1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42` | PASS |
| `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941 | 8-bit RGB PNG | `fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661` | PASS |
| `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png` | 1672×941 | 8-bit RGB PNG | `973f0bc371f1ba76c932f1944d7952ad72bbc4883812e2cc06c3b69db3526583` | PASS |
| `assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png` | 887×1774 | 8-bit RGBA PNG | `7526406e31919c4a5f625f31e5577d6f0a6d9a6ccead4a5f17a54cd0e30496ae` | PASS |
| `assets/npcs/best-friend.png` | 1024×1536 | 8-bit RGBA PNG | `2d3ede82f10df1f651a6004c462399e2a9c96c848d4195cfbc9366cf3fe88e44` | PASS |

- 배경 3종은 16:9에 가까운 동일 1672×941 규격이며 고정 인물·개인정보·읽히는 상호·워터마크가 없다.
- 하은 스프라이트의 유효 알파 영역은 `(246,26)–(661,1693)`, 지훈은 `(245,8)–(770,1513)`으로 전신이 잘리지 않고 좌우 대화 UI 배치 여백을 확보한다.
- 지훈 PNG는 원본 투명 알파를 흰 배경 합성으로 별도 확인해 검은 프린지·불투명 사각형·배경 잔여가 없음을 검증했다.

## 원본 해상도 육안 검사

- `home-morning`: 밝은 생활 공간, 우측 캐릭터 안전 영역, 소파·탁자·휴대전화 소품의 선명도가 정상이며 과도한 블러·왜곡·압축 흔적이 없다.
- `neighborhood-cafe-day`: 공개 낮 카페의 테이블·출입구 동선이 명확하고, 세 인물 중경 및 선택 UI를 놓을 중앙·우측 여백이 충분하다.
- `neighborhood-street-day`: 낮 퇴장 동선과 벤치가 자연스럽고 화면 중심 원근·건물선·그림자에 왜곡이나 잘못된 크롭이 없다.
- 하은 DAY 8: 머리·손·가방·신발까지 경계가 선명하고 알파 프린지·절단·중복 사지·의상 왜곡이 없다. 밝고 생활적인 현재 관계 톤에 맞는다.
- 지훈 `best-friend`: 머리·손·태블릿·가방·신발까지 전신이 완전하며 투명 합성 경계가 깨끗하다. 위협적 실루엣이나 공포 표정이 아닌 편안한 현재 친구 인상을 유지한다.
- 모든 자산에서 읽히는 로고·서명·워터마크·개인정보, 공포 색보정, 감시 구도, 스포일러 시각 정보가 발견되지 않았다.

## Scene 적용 판정

- 8 Scene 모두 `assetStatus: ready`로 전환한다.
- 흐린 연락처·답장·단체 알림·관계망 소품은 런타임 UI에서 비가독 오버레이로만 처리하고 이미지 자체에 개인정보를 합성하지 않는다.
- 신규 자산 제작: 0종.
- 기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건.

## 다음 관문

- 잠금 시나리오와 `ready` 프레젠테이션을 기존 DAY 16 런타임에 연결하고 8 Scene, 9개 행동 전략, DAY 4·15 콜백, stage 0~3 저장 복원과 DAY 17 훅을 구현 감사한다.

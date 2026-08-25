# DAY 1 — 이벤트 CG 선정 및 제작 프롬프트

상태: `PHASE 15 COMPLETE / GENERATION NOT STARTED`

기준 시나리오: `docs/day1/DAY1_SCENARIO_REVISION_V1.md`  
연동 명세: `docs/day1/DAY1_BACKGROUND_ASSET_SPEC.md`, `docs/day1/DAY1_CHARACTER_EXPRESSION_SPEC.md`, `docs/day1/DAY1_CHARACTER_POSE_SPEC.md`

## 선정 원칙

- 이벤트 CG는 대사와 스프라이트를 대체하는 요약 화면이 아니라, 플레이어가 장면의 방향 전환을 직접 체감하게 하는 강조점으로 사용한다.
- DAY 1에는 핵심 CG 2장과 짧은 디테일 컷인 1장만 둔다. 의료 설명이나 가족 소식은 표정·포즈·침묵의 연속성이 중요하므로 별도 CG로 고정하지 않는다.
- 첫 접촉 선택 이후 결과가 달라지는 포옹 장면은 단일 결과 CG로 만들지 않는다. CG는 선택 직전의 공통 순간까지만 보여 주고, 분기 반응은 PHASE 13~14 스프라이트로 처리한다.
- 주인공 얼굴은 보여 주지 않는다. 1인칭 시점과 손 레이어를 사용해 플레이어가 정한 외형과 충돌하지 않게 한다.
- CG에 판독 가능한 병원명, 구체적 날짜, 메시지, 프로필, 사고 현장, 가족 얼굴, 웨딩 사진, 반지, 트럭, 하은의 사고 동승 또는 후반 정체 단서를 넣지 않는다.
- 하은은 밝고 생활적이며 지친 기다림 끝에 안도한 23세 여성으로 보인다. 공포·집착·죄책감·소유욕을 암시하는 조명과 구도를 금지한다.

## 정보·감정 예산

### 보여 줘야 하는 것

- 같은 병원 입원실, 깨어난 주인공, 하은이 곁을 지키고 있었다는 사실.
- 하은의 놀람과 안도, 그러나 플레이어 선택 이후에는 거리를 존중한다는 행동.
- 물 한 모금에서 허락을 구한 뒤 협력하는 현재의 관계.
- 과거 결혼 약속보다 현재 주인공의 재판단이 중요해졌다는 마지막 거리와 시선.

### 보여 줘도 되는 것

- 꺼진 휴대폰, 보호자 의자, 종이컵, 물병, 날짜 글자가 없는 달력 구조.
- 피곤한 흔적, 맺힌 눈물, 병실의 부드러운 낮 자연광.

### 보여 주면 안 되는 것

- 하은의 MBTI·직업·상세 성격 프로필, 과거 관계의 구체적 증거.
- 사고 차량·충돌 방향·동승자·보호 행동 등 미확정 사고 세부사항.
- 숨긴 휴대폰, 수상한 그림자, 비대칭 냉소, 감시 구도, 위협적인 역광.
- 웨딩드레스·결혼식장·반지 교환처럼 결혼을 이미 확정된 미래로 만드는 이미지.

## CG 목록과 우선순위

| ID | 등급 | 삽입 지점 | 화면의 극적 기능 | 유지 시간 |
|---|---|---|---|---|
| `CG_DAY1_FIRST_EYE_CONTACT` | 필수 핵심 CG | SCENE 01, 하은과 처음 눈이 마주치고 휴대폰이 이불 위에 떨어진 직후 | 하은이 낯선 미스터리 인물이 아니라 오래 기다린 사람임을 첫인상으로 만든다. 포옹 선택 직전 공통 화면이다. | 약 3~5초 후 대사 진행, 선택 진입 전 스프라이트로 복귀 |
| `CG_DAY1_CUP_SUPPORT_CUTIN` | 필수 디테일 컷인 | SCENE 05, “컵 아래만 부탁해” 뒤 하은이 컵을 받치는 순간 | 첫 접촉 선택이 ‘허락받은 도움’으로 회수됐음을 손동작으로 보여 준다. | 약 1.5~2.5초, 입력으로 넘길 수 있음 |
| `CG_DAY1_THIRTY_DAY_RESOLVE` | 필수 핵심 CG | SCENE 06, 하은이 “나부터”라고 답하고 의자를 원래 거리로 둔 직후 | 과거 약속을 강요하는 장면이 아니라 두 사람이 30일 동안 현재를 확인하기로 한 장면임을 고정한다. | DAY 1 종료 직전 약 4~6초, 이후 Fade Out |

세 항목 모두 PHASE 16에서 기존 에셋 재사용·합성 가능성을 먼저 감사한다. 적합한 기존 이미지나 레이어 조합이 있으면 신규 생성 수량을 줄인다.

## 공통 인물·화풍 기준

- 화풍: 현대 한국 배경의 순수 2D 셀 셰이딩 비주얼노벨 일러스트. 깨끗한 선, 부드러운 그라데이션, 현실적인 병실 소품, 과장되지 않은 애니메이션 비율.
- 하은 얼굴 기준 후보: `assets/characters/girlfriend-standing-2d.png`와 `assets/heroines/haeun/outfit-sheet.png`. 보라색 단발, 보라색 눈, 동일한 얼굴 비율과 체형을 유지한다.
- DAY 1 의상 기준 후보: `assets/heroines/haeun/outfits/04.png`의 베이지 롱 카디건, 흰색 상의, 편안한 밝은색 바지. PHASE 16 감사 전에는 최종 채택으로 간주하지 않는다.
- 병실 기준: `BG_DAY1_HOSPITAL_BEDSIDE_DAY`와 같은 구조·주간 조명. 미색, 연회색, 낮은 채도의 푸른 포인트를 사용한다.
- 화면비: 16:9. 마스터 2560×1440 이상, sRGB. 배포 후보는 1600×900 WebP 품질 88 전후.
- UI 안전 영역: 하단 28%에 얼굴·손·핵심 소품을 두지 않는다. 모바일 중앙 크롭에서도 하은 얼굴과 핵심 행동이 남아야 한다.
- CG 내부에 텍스트·로고·워터마크·서명·UI를 생성하지 않는다. 날짜와 대사는 게임 레이어에서 표시한다.

## 프롬프트 1 — 첫 눈맞춤

### 생성 프롬프트

```text
《결혼까지 30일!》 DAY 1의 핵심 이벤트 CG. 현대 한국 병원의 조용한 주간 입원실, 순수 2D 셀 셰이딩 비주얼노벨 일러스트, 16:9. 침대에 누운 성인 남성 환자의 1인칭 시점으로 병상 옆 보호자 의자를 바라본다. 23세 여성 이하은이 의자에서 급히 반쯤 일어나다 멈춘 순간, 오래 기다린 피로가 남아 있지만 환자가 깨어난 것을 알아보고 놀람과 따뜻한 안도가 동시에 번지는 얼굴. 보라색 턱선 길이 단발, 보라색 눈, 제공된 하은 캐릭터 참조와 얼굴 비율·헤어스타일·체형을 정확히 유지. 편안한 베이지 롱 카디건과 흰색 상의, 밝은색 바지의 생활적인 병원 보호자 복장. 꺼진 스마트폰은 이미 흰 이불 위에 안전하게 떨어져 있고 화면은 보이지 않는다. 손은 환자에게 닿기 전 열린 상태이며, 위협이나 집착이 아니라 믿기 어려운 기쁨과 조심스러운 접근이 느껴진다. 부드러운 낮 자연광과 중성 병원 조명, 따뜻한 미색·연회색 배경, 침대 난간과 수액대는 주변부에만 배치. 하은의 얼굴과 열린 손을 중앙 안전 영역에 두고 하단 28%는 대화 UI를 위해 단순하게 비운다. 카메라는 환자 눈높이, 자연스러운 원근, 감정이 읽히는 중간 클로즈업. 고품질 캐릭터 일관성, 정확한 손, 다섯 손가락, 깨끗한 선화.
```

### 네거티브 프롬프트

```text
photorealistic, 3D render, horror, thriller lighting, ominous shadow, dutch angle, villain smile, smirk, frozen stare, possessive expression, secret phone, hidden screen, readable phone text, hospital logo, readable chart, wedding ring, wedding dress, crash scene, truck, blood, injury gore, ICU surgery room, childlike body, sexualized hospital outfit, exaggerated cleavage, hugging already, touching patient before choice, protagonist face, extra people, extra arms, fused hands, missing fingers, extra fingers, distorted anatomy, text, subtitles, watermark, signature, UI
```

### 합격 기준

- 하은의 첫인상이 ‘수상함’보다 놀람·안도·생활적 피로로 먼저 읽힌다.
- 포옹 전 순간이므로 하은의 손이 주인공 몸에 닿지 않는다.
- 휴대폰 화면과 병원 기록에 판독 가능한 정보가 없다.
- 하은 얼굴·헤어·의상 후보가 참조 이미지와 동일 인물로 인식된다.

## 프롬프트 2 — 컵 아래만

### 생성 프롬프트

```text
《결혼까지 30일!》 DAY 1의 짧은 디테일 컷인. 현대 한국 병원 입원실의 부드러운 낮 조명, 순수 2D 셀 셰이딩 비주얼노벨 일러스트, 16:9 와이드 디테일 구도. 기억상실 환자의 1인칭 시점에서 흰 이불 위 종이컵과 두 사람의 손을 본다. 힘이 약해 조금 떨리는 성인 남성의 손이 흰 종이컵을 직접 잡고 있고, 컵 속 물에는 아주 작은 물결이 있다. 이하은의 열린 손바닥이 환자의 손목을 잡지 않은 채 컵 바닥만 조심스럽게 받쳐 물결이 잦아드는 순간. 그녀의 베이지 카디건 소매와 자연스러운 손만 화면에 들어오며, 도움을 빼앗는 것이 아니라 허락받은 뒤 안전하게 보조한다는 관계가 명확하다. 손과 컵은 화면 중앙 상단에 두고 하단 28%는 UI 안전 영역으로 비운다. 현실적인 컵 크기, 정확한 손가락 관절과 다섯 손가락, 수액 줄과 병상 난간은 동작을 가리지 않는 주변부. 따뜻하고 소박하며 안심되는 생활적 분위기, 고품질 깨끗한 선화.
```

### 네거티브 프롬프트

```text
romantic hand holding, wrist grabbing, forced feeding, nurse hands, spilled water, broken cup, glass cup, alcohol, medicine, blood, injury gore, ominous lighting, secret gesture, wedding ring, jewelry focus, protagonist face, Haeun full face, extra hands, merged fingers, extra fingers, missing fingers, deformed wrists, impossible cup perspective, readable text, logo, watermark, signature, UI
```

### 합격 기준

- 주인공이 컵을 잡고 있고 하은은 컵 바닥만 받쳐 주도권을 빼앗지 않는다.
- 손목 접촉이 없으며 하은 손바닥과 컵 사이의 지지가 명확하다.
- 선택 3종이 합류한 뒤 사용할 수 있는 공통 결과 화면이며 특정 분기를 무효화하지 않는다.
- 손가락·컵 원근·물 수평선에 해부학적 또는 물리적 오류가 없다.

## 프롬프트 3 — 30일 동안 확인해

### 생성 프롬프트

```text
《결혼까지 30일!》 DAY 1의 엔딩 핵심 이벤트 CG. 현대 한국 병원의 같은 주간 입원실, 순수 2D 셀 셰이딩 비주얼노벨 일러스트, 16:9. 침대에 누운 성인 남성 환자의 1인칭 시점. 23세 이하은이 병상 난간 밖의 보호자 의자를 원래의 존중하는 거리로 돌려놓고 그 옆에 서 있다. 보라색 턱선 길이 단발, 보라색 눈, 제공된 하은 참조와 동일한 얼굴·체형, 편안한 베이지 롱 카디건과 흰색 상의, 밝은색 바지. 방금 결혼 날짜를 알렸지만 강요하지 않고 ‘30일 동안 나부터 확인해’라는 제안을 받아들이는 순간, 시선을 다시 맞추고 작고 안정된 미소를 짓는다. 한 손은 의자 등받이에서 자연스럽게 내려오고 다른 손은 열려 있으며, 침대 쪽으로 다가오지 않는다. 벽의 달력은 배경 주변부에 있으나 날짜·글자는 비어 있거나 흐려서 읽을 수 없고, 스마트폰은 화면이 꺼진 채 탁자 위에 평범하게 놓여 있다. 부드러운 낮 자연광, 미색과 연회색 병실, 공포가 아니라 조용한 희망과 아직 남은 거리. 하은 얼굴과 열린 손, 의자와 침대 사이의 공간이 모두 보이는 미디엄 와이드 구도. 하단 28%는 대화 UI용 안전 영역, 중앙 크롭에서도 얼굴과 의자가 남는다. 정확한 손과 다섯 손가락, 고품질 캐릭터 일관성, 깨끗한 선화.
```

### 네거티브 프롬프트

```text
wedding poster, wedding dress, groom, wedding hall, engagement ring, proposal pose, kneeling, possessive smile, villain smile, ominous calendar, red circle date baked into image, readable calendar text, countdown text, horror shadow, phone hiding, secret message, glowing phone, back turned to patient, blocking the door, touching patient, protagonist face, extra people, doctor, nurse, extra limbs, deformed hands, extra fingers, text, subtitles, logo, watermark, signature, UI
```

### 합격 기준

- 결혼이 확정된 미래가 아니라 현재의 두 사람이 다시 판단할 30일로 읽힌다.
- 하은은 침대 밖의 존중하는 거리를 유지하고 표정은 `E08_GENTLE_RESOLVE`와 일치한다.
- 달력은 후속 UI 날짜를 방해하지 않으며 판독 가능한 날짜가 이미지에 굽지 않는다.
- 휴대폰은 수상한 단서가 아니라 평범한 비활성 소품으로 남는다.

## 생성·감사 절차

1. PHASE 16에서 기존 이벤트 이미지, 하은 참조 에셋, 배경 구조와 실제 렌더러 규격을 먼저 감사한다.
2. 기존 합성으로 충족되지 않는 항목만 위 프롬프트와 참조 이미지를 사용해 생성한다.
3. 같은 세션·같은 참조 세트로 핵심 CG 2장을 만들고, 컵 컷인은 승인된 하은 소매·손 색을 참조해 별도 제작한다.
4. 생성본에는 원본 프롬프트, 참조 파일, 생성 일시, 후보 번호를 메타 문서에 기록한다.
5. PHASE 17에서 얼굴·헤어·의상·손·병실 구조·조명·UI 크롭·금지 정보 노출을 전수 검사한다.
6. 한 항목이라도 불합격이면 게임에 연결하지 않고 재생성 또는 합성 수정 후보로 돌린다.

## 완료 기준

- 6개 Scene 중 CG가 필요한 감정 전환만 2개 핵심 CG와 1개 컷인으로 선정됐다.
- 각 CG의 삽입 지점, 극적 기능, 유지 시간, 정보 공개 제한이 정의됐다.
- 공통 화풍·인물 동일성·의상 후보·병실 연속성·UI 안전 영역이 명시됐다.
- 생성 프롬프트, 네거티브 프롬프트, 이미지별 합격 기준이 모두 준비됐다.
- 기존 에셋 감사 전에는 신규 생성을 시작하지 않는 절차가 명시됐다.

따라서 PHASE 15 이벤트 CG 선정 및 프롬프트는 완료다. 다음 관문은 PHASE 16 기존 에셋 감사 후 필요한 생성·수급이다.

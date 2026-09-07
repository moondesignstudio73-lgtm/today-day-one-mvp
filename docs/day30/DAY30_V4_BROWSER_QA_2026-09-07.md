# DAY30 V4 실제 Chrome QA — 2026-09-07

## 범위

- Chrome 152 headless 렌더링 엔진(CDP)
- 실제 `index.html` / `game.js?v=291` Story UI
- AUTO OFF, SKIP 클릭 0회
- Friendly / Neutral / Distant / Mixed 네 경로
- Story/Free Action 배타성, runtime error, 완료 훅, 사용자 저장 복원

## 최초 네 경로 완주

| 경로 | 실제 최종 route | 핵심 결과 |
|---|---|---|
| Friendly | `HAEUN_PREPARE_MARRIAGE` | 하은 현재 만남·미래 응답·사진 동의, 준비 대화 일정 |
| Neutral | `HAEUN_REDISCUSS` | 결혼 자동 확정 없이 재논의 일정 |
| Distant | `SOLO` | 인물·사진 응답·다음 약속 없음 |
| Mixed | `ARA_RELATIONSHIP` | 실제 아라만 등장, 사진 동의와 다음 만남 응답 |

모든 경로에서 `complete=true`, `day30RuntimeComplete=true`, Story/Free 중첩 0, runtime exception 및 조치 가능한 console error 0, 사용자 localStorage 복원을 확인했다.

## 발견·수정한 결함

Friendly SCENE08 선택 화면에서 최초 진행 직후 하은 스프라이트가 숨고 새로고침 재개 후에만 보이는 차이를 발견했다. `lateV4TransitionCharacterSceneIds`가 DAY29까지만 포함해 DAY30 transition의 명시 캐릭터를 갱신하지 않던 원인이었다.

DAY30 장면 ID를 갱신 집합에 추가하고 브라우저 QA에 다음 회귀 판정을 고정했다.

- 재개 전 `characterVisible=true`
- 재개 후 `characterVisible=true`
- 재개 전후 `12:30 / alley-pub / haeun_first_task / 동일 choiceCount`

수정 후 Friendly를 깨끗한 Chrome 프로필과 새 CDP 포트에서 처음부터 다시 완주해 위 판정을 통과했다.

## 비차단 경고

CDP의 자바스크립트 클릭은 실제 사용자 제스처로 인정되지 않아 fullscreen 요청 경고가 발생했다. 사용하지 않은 preload 이미지 경고도 있었으나 자산 404, 런타임 예외, 저장 손상은 없었다.

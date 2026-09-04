import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(source,/function startGame\(\) \{ if\(titleTransitioning\)return;requestInitialFullscreen\(\);/);
assert.match(source,/function finishOnboarding\(\) \{ requestInitialFullscreen\(\);/);
assert.match(source,/function loadGame\(\) \{\s*requestInitialFullscreen\(\);/);
assert.match(source,/document\.addEventListener\("click",\(\)=>\{if\(isGameplayVisible\(\)&&!document\.fullscreenElement\)requestInitialFullscreen\(\);\},true\);/);
assert.doesNotMatch(source,/document\.addEventListener\("pointerdown",[^\n]*requestInitialFullscreen/);
assert.match(source,/document\.body\.classList\.add\("theater-mode"\);/);
console.log("✓ 게임 시작·이어하기·전체화면 해제 후 재진입 계약 PASS");

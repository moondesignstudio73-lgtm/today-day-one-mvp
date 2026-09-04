import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");

assert.match(game,/function isDay1HospitalNight\(\).*state\.storyFreeAction\?\.status==="REPORT"/);
assert.match(game,/function renderDay1HospitalNight\(\)/);
assert.match(game,/assets\/backgrounds\/hospital\/day1-hospital-bedside-day-v1\.png/);
assert.match(game,/NIGHT TIME · 병실/);
assert.match(game,/하은이 돌아간 뒤, 조용해진 병실/);
assert.match(game,/button\.dataset\.roomAction==="report"/);
assert.match(game,/button\.dataset\.roomAction==="bed"/);
assert.match(game,/completeStoryFreeAction\(state\)/);
assert.match(css,/\.day1-hospital-night \.room-phone,[\s\S]*?\.room-exit\{display:none!important\}/);
assert.match(html,/styles\.css\?v=99/);
assert.match(html,/game\.js\?v=228/);
console.log("✓ 스토리 DAY 1 병실 NIGHT TIME · 리포트/침대 전용 화면 계약 PASS");

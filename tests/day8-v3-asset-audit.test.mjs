import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";

const audit=readFileSync(new URL("../docs/day8/DAY8_V3_ASSET_PRESENTATION_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["china-diner","small-cafe","live-house","007_china-diner.png","004_small-cafe.png","027_live-house.png","cg-day8-v3-overfilled-water-glass-v1.png","READY — 사진 요청 경로 한정","NEW PHONE POV REQUIRED","NEW CLOTHING PHOTO POV REQUIRED","desktop center-80/mobile center-60","DAY 9는 시작하지 않는다"])assert.ok(audit.includes(marker),marker);
for(const path of ["../assets/backgrounds/map-locations/007_china-diner.png","../assets/backgrounds/map-locations/004_small-cafe.png","../assets/backgrounds/map-locations/027_live-house.png","../assets/backgrounds/day4/day4-bedroom-morning-v1.png","../assets/backgrounds/day4/day4-home-night-consistent-v1.png","../assets/events/day4/cg-day4-table-phone-photo-pov-v1.png"])assert.equal(existsSync(new URL(path,import.meta.url)),true,path);
assert.equal(audit.includes("구 세이지 의상은 ‘오늘 외출’로 오해됨"),true);
assert.equal(audit.includes("신규 6종"),true);
console.log("day8-v3-asset-audit.test: asset/presentation audit assertions passed");

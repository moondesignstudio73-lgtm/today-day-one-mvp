import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";

const gameUrl=new URL("../game.js",import.meta.url);
const source=readFileSync(gameUrl,"utf8");
const imports=[...source.matchAll(/from\s+["'](\.\/[^"']+)["']/g)].map(match=>match[1].replace(/\?.*$/,""));
assert.ok(imports.length>40,"game entrypoint import coverage");
for(const specifier of imports)assert.equal(existsSync(new URL(specifier,gameUrl)),true,`missing browser entry module: ${specifier}`);
const voice=await import("../src/elevenlabs-voice-client.mjs");
assert.equal(typeof voice.speakWithElevenLabs,"function");assert.equal(typeof voice.stopVoicePlayback,"function");
console.log(`✓ 브라우저 엔트리 모듈 ${imports.length}개 경로·음성 폴백 기동 계약 PASS`);

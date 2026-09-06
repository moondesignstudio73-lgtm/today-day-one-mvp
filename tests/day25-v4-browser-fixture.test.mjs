import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

test('DAY25 browser harness seeds replay-locked routes without SKIP and preserves saves',()=>{const source=readFileSync(new URL('./day25-v4-browser-entry.html',import.meta.url),'utf8');for(const route of ['friendly','ended'])assert.match(source,new RegExp(`data-route="${route}"`));for(const marker of ['day25ContinuedFixture','day25EndedFixture','day25-v4-qa-save-backup','테스트 전 저장을 복원했습니다'])assert.match(source,new RegExp(marker));assert.match(source,/localStorage\.getItem\(SaveManager\.keyForMode\(GAME_MODES\.MARRIAGE_30\)\)/);assert.doesNotMatch(source,/skipButton|\.click\([^)]*SKIP/i);});

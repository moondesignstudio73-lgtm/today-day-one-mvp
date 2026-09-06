import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

test('DAY26 browser harness seeds replay-locked routes without SKIP and preserves saves',()=>{const source=readFileSync(new URL('./day26-v4-browser-entry.html',import.meta.url),'utf8');for(const route of ['friendly','neutral','distant','mixed','new-meeting'])assert.match(source,new RegExp(`data-route="${route}"`));for(const marker of ['completeDay25V4','day25ContinuedFixture','day25DeferredFixture','day25EndedFixture','day25MixedFixture','day25NewMeetingFixture','day26-v4-qa-save-backup','mealSettlement','foodCount','테스트 전 저장을 복원했습니다'])assert.match(source,new RegExp(marker));assert.match(source,/localStorage\.getItem\(SaveManager\.keyForMode\(GAME_MODES\.MARRIAGE_30\)\)/);assert.doesNotMatch(source,/skipButton|\.click\([^)]*SKIP/i);});

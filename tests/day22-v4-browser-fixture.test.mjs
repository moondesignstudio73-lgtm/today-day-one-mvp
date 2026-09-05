import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

test('DAY22 browser fixture replays production history and preserves the user save',()=>{
  const source=readFileSync(new URL('./day22-v4-browser-entry.html',import.meta.url),'utf8');
  for(const marker of ['beginDay18V4','prepareDay19V4GameEntry','prepareDay20V4GameEntry','prepareDay21V4GameEntry','completeDay21V4GameChapter'])assert.match(source,new RegExp(marker));
  assert.match(source,/qa-day22-busan-shared/);
  assert.match(source,/shared_room_wish/);
  assert.match(source,/sessionStorage\.getItem\(backupKey\)===null/);
  assert.match(source,/value===null\?localStorage\.removeItem/);
  assert.match(source,/테스트 전 저장을 복원했습니다/);
  assert.doesNotMatch(source,/skipButton|\.click\([^)]*SKIP/i,{message:'fixture must not automate the SKIP control'});
});

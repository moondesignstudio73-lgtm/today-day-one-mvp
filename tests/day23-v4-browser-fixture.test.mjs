import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

test('DAY23 browser fixture builds verified DAY21-22 routes and preserves the user save',()=>{
  const source=readFileSync(new URL('./day23-v4-browser-entry.html',import.meta.url),'utf8');
  for(const marker of ['DAY21_V4_SCHEMA','completeDay21V4','beginDay22V4','completeDay22V4','m30-day23-current-family-contact'])assert.match(source,new RegExp(marker));
  for(const route of ['busan-shared','busan-separate','seoul-day','seoul-yuri','no-travel-contact','no-travel-unavailable','busan-rejections'])assert.match(source,new RegExp(`data-route="${route}"`));
  assert.match(source,/pendingContacts:yuri\?\['YURI'\]:\[\]/);
  assert.match(source,/difficult:rejections/);
  for(const suffix of ['shared_room_wish','separate_spaces','seoul','rest_separately'])assert.match(source,new RegExp(suffix));
  for(const fact of ['route','tone','phase','complete','photoKept','relationshipOutcome','farewellContact','nextConversation','day24Hook','freeAction'])assert.match(source,new RegExp(fact));
  assert.match(source,/sessionStorage\.getItem\(backupKey\)===null/);
  assert.match(source,/value===null\?localStorage\.removeItem/);
  assert.match(source,/테스트 전 저장을 복원했습니다/);
  assert.doesNotMatch(source,/skipButton|\.click\([^)]*SKIP/i,{message:'fixture must not automate the SKIP control'});
});

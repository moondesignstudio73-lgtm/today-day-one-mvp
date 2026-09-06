import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

test('DAY24 browser harness continues from verified DAY23 and preserves user saves',()=>{const source=readFileSync(new URL('./day24-v4-browser-entry.html',import.meta.url),'utf8');assert.match(source,/day23-v4-browser-entry\.html\?day24-followup=1/);assert.match(source,/day23-v4-qa-save-backup/);assert.match(source,/sessionStorage\.getItem/);assert.match(source,/localStorage\.getItem\('today-day-one\.save\.v1\.story'\)/);for(const fact of ['phase','complete','conversation','relationship','contactRecipient','contactCleanup','contactDirection','relationshipStatusLie','newMeetingAccepted','futureAccepted','day25Route','day25Hook','freeAction'])assert.match(source,new RegExp(fact));});

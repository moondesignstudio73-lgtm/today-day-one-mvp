import test from 'node:test';
import assert from 'node:assert/strict';
import {getDialogueHistoryTime} from '../src/dialogue-history-time.mjs';

test('backlog captures story time independently from the Free Mode phase', () => {
  const p={timeOfDay:'evening',storyClock:'19:00'};
  const recorded=getDialogueHistoryTime(p,'MORNING · 아침');
  assert.equal(recorded,'저녁 · 19:00');
  p.timeOfDay='night';p.storyClock='22:00';
  assert.equal(recorded,'저녁 · 19:00');
  assert.equal(getDialogueHistoryTime(p,'MORNING · 아침'),'밤 · 22:00');
  assert.equal(getDialogueHistoryTime({timeOfDay:'afternoon',storyClock:'12:30'},'아침'),'낮 · 12:30');
});

test('non-story dialogue preserves its original phase label', () => {
  assert.equal(getDialogueHistoryTime(null,'AFTERNOON · 오후'),'AFTERNOON · 오후');
  assert.equal(getDialogueHistoryTime({timeOfDay:'night'},'NIGHT · 밤'),'NIGHT · 밤');
});

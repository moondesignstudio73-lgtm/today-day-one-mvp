import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableEnding} from '../src/day22-v4-playable-ending.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4,resolveDay22V4Contact,resolveDay22V4Photo} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(step.source)assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
function reachFinalPhase(state){beginDay22V4(state);while(!['ending','seoul_return'].includes(state.storyFlags.day22V4.phase)){const chapter=state.storyFlags.day22V4;if(chapter.phase==='photo_resolution')resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:false});else if(chapter.phase==='contact_resolution')resolveDay22V4Contact(state,{type:'haeunContactResponse',contact:chapter.facts.contactIntent,accepted:false});else chooseDay22(state);}}

test('Seoul SCENE22 C17 returns home and completes only after SCENE24',()=>{
  const state=completedDay21ForDay22('SEOUL_DAY');reachFinalPhase(state);let steps=getDay22V4PlayableEnding(state.storyFlags.day22V4);assert.equal(steps[0].number,22);assert.equal(steps.at(-1).choiceNumber,17);assert.equal(steps.some(step=>step.type==='chapterCompletionCue'),false);assertSourced(steps);
  chooseDay22(state,'choose_photo_tomorrow');steps=getDay22V4PlayableEnding(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.text?.includes('함께 사진이 없다면 풍경이나 기억')));assert.ok(steps.some(step=>step.text==='서울의 밤이라면 내 집에 돌아와 있었다.'));assert.equal(steps.some(step=>step.text?.includes('부산의 밤')),false);assert.equal(steps.at(-1).type,'chapterCompletionCue');assertSourced(steps);
});

test('Busan ending uses the booked space and has no Seoul return choice',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');reachFinalPhase(state);const steps=getDay22V4PlayableEnding(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.text==='부산의 밤이라면 나는 실제 예약한 공간에 있었다.'));assert.equal(steps.some(step=>step.type==='choice'&&step.choiceNumber===17),false);assert.equal(steps.some(step=>step.text?.includes('서울의 밤')),false);assert.equal(steps.at(-1).type,'chapterCompletionCue');assertSourced(steps);
});

test('NO_TRAVEL ending recalls only the familiar room and own pace',()=>{
  const state=completedDay21ForDay22('NO_TRAVEL');reachFinalPhase(state);const steps=getDay22V4PlayableEnding(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.text==='떠나지 않은 날이면 익숙한 방에서 오늘의 작은 일을 떠올렸다.'));assert.ok(steps.some(step=>step.text?.startsWith('혼자 지낸 날이면')));assert.equal(steps.some(step=>/부산의 밤|서울의 밤|함께 여행한 하은|같이 온 사람/.test(step.text??'')),false);assert.equal(steps.at(-1).type,'chapterCompletionCue');assertSourced(steps);
});

test('unfinished chapters receive only a route boundary and no completion cue',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');beginDay22V4(state);const steps=getDay22V4PlayableEnding(state.storyFlags.day22V4);assert.deepEqual(steps,[{type:'endingBoundary',nextScene:21,route:'BUSAN_TRIP'}]);assert.equal(steps.some(step=>step.type==='chapterCompletionCue'),false);
});

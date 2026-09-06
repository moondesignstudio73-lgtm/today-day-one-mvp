import assert from 'node:assert/strict';
import test from 'node:test';
import {day28FriendlyFixture,day28NewMeetingFixture,day28SoloFixture} from './day28-v4-playable-fixture.mjs';
import {applyDay28V4GameChoice,applyDay28V4GameResolution,getDay28V4GameSegment} from '../src/day28-v4-game-bridge.mjs';
import {getDay28V4RuntimeResolution} from '../src/day28-v4-runtime-resolution.mjs';
import {isPlayerFacingStoryStep} from '../src/story-player-facing-policy.mjs';
import {validateDay28V4SourceStep} from '../src/day28-v4-source-selection.mjs';

const resolutionTypes=new Set(['day28MeetingCue','day28RelationshipCue','day28ContactCue','day28HomeInvitationCue','day28NextMeetingCue','day28NewRelationshipCue']);
const sourcedTypes=new Set(['dialogue','message','monologue','playerNarration','stageAction','storyActionCue']);

function play(state){const rendered=[];for(let guard=0;guard<40;guard++){const segment=getDay28V4GameSegment(state);rendered.push(...segment);if(segment.some(step=>step.type==='chapterCompletionCue'))return rendered;const resolution=segment.find(step=>resolutionTypes.has(step.type));if(resolution){applyDay28V4GameResolution(state,getDay28V4RuntimeResolution(state,resolution));continue;}const choice=segment.find(step=>step.type==='choice');assert.ok(choice,`stalled:${state.storyFlags.day28V4.phase}`);applyDay28V4GameChoice(state,choice.options[0].id);}throw new Error('DAY28_AUDIT_GUARD');}

test('DAY28 representative routes expose only grounded story text and authored choices',()=>{for(const makeState of [day28FriendlyFixture,day28SoloFixture,day28NewMeetingFixture]){const steps=play(makeState());for(const step of steps){if(sourcedTypes.has(step.type))assert.equal(validateDay28V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);const strings=step.type==='choice'?[step.prompt,...step.options.map(option=>option.label)]:isPlayerFacingStoryStep(step)?[step.text]:[];for(const value of strings)assert.doesNotMatch(value,/DAY\s*\d+|플래그|시나리오|다음\s*DAY|이\s*장면|이\s*선택|핵심\s*목적|회수/i);}}});

test('new-person player surface contains no Haeun-only chair, wardrobe or reunion dialogue',()=>{const steps=play(day28NewMeetingFixture()),surface=steps.flatMap(step=>step.type==='choice'?[step.prompt,...step.options.map(option=>option.label)]:isPlayerFacingStoryStep(step)?[step.text]:step.type==='transition'?[step.label]:[]).join('\n');assert.doesNotMatch(surface,/하은|의자를 되찾는 계획|우리 집 의자|내일은 옷부터|우리가 한 말은 이미 있잖아/);assert.match(surface,/아라|보는 것까지 다 일로 만들고 싶지 않을 때요|그럼 제가 본 게 되잖아요/);});

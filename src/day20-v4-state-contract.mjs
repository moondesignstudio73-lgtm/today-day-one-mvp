import {validateDay19V4} from './day19-v4-state-contract.mjs';

export const DAY20_V4_SCHEMA = 'day20-notion-v4/1';
const clone = value => JSON.parse(JSON.stringify(value));
const legacyKeys = ['day20MenuStrategy', 'day20CostStrategy', 'day20FinishStrategy',
  'day20RuntimeStage', 'day20CurrentSharedMealCompleted', 'day20RuntimeComplete'];

function choiceId(chapter, number) {
  return chapter.choices.find(choice => choice.number === number)?.id ?? null;
}

function deriveInput(state) {
  const day19 = state.storyFlags.day19V4;
  const mealAccepted = day19.facts.tomorrowMeal === 'ACCEPTED';
  const relationshipActive = state.breakup == null && state.ended !== true && day19.input.relationshipActive;
  const contactAllowed = relationshipActive && day19.input.contactAllowed;
  const visitMode = mealAccepted && contactAllowed ? 'FACE_TO_FACE' : 'SOLO';
  return {
    visitMode,
    relationshipActive,
    contactAllowed,
    invitation: {
      status: visitMode === 'FACE_TO_FACE' ? 'ACCEPTED' : 'NONE',
      sourceChoiceId: visitMode === 'FACE_TO_FACE' ? choiceId(day19, 13) : null
    },
    day19TomorrowMeal: day19.facts.tomorrowMeal,
    day19TomorrowTable: day19.facts.tomorrowTable,
    cupConversationExperienced: day19.facts.tomorrowTable === 'CUPS_TOGETHER',
    sharedTravelConversationExperienced: day19.input.sharedPlanningEligible === true,
    relationshipTone: day19.input.relationshipTone,
    day18DiscussionPending: day19.input.day18DiscussionPending,
    source: {
      day19Schema: day19.schema,
      day19Choice13: choiceId(day19, 13),
      day19Choice14: choiceId(day19, 14)
    }
  };
}

function initial(input) {
  return {schema: DAY20_V4_SCHEMA, input: clone(input), choices: [], phase: 'preparation', complete: false,
    facts: {visitMode: input.visitMode, preparation: null, broughtItem: null, requestedItem: null,
      cupChoice: null, kitchenPlan: null, dinnerConversation: null, disclosureRoute: null,
      quietTime: null, sharedScreenContent: null, eveningExtension: null, borrowedClothes: false,
      firstHug: false, satSideBySide: false, heldHands: false, nextInvitation: null,
      songResponse: null, nightEnd: null, stayedOver: false, sleepingPlan: null}};
}

export function getDay20V4Entry(state) {
  const flags = state?.storyFlags ?? {};
  if (flags.day20V4 != null) return {mode: validateDay20V4(flags.day20V4) ? 'V4' : 'INVALID_V4'};
  if (legacyKeys.some(key => flags[key] != null && flags[key] !== false && flags[key] !== 0)) return {mode: 'LEGACY'};
  if (!validateDay19V4(flags.day19V4) || flags.day19V4.complete !== true ||
    flags.day19V4Day20HookPending !== true) return {mode: 'BLOCKED_PREREQUISITE'};
  return {mode: 'V4_NEW', input: deriveInput(state)};
}

export function beginDay20V4(state) {
  const entry = getDay20V4Entry(state);
  if (entry.mode !== 'V4_NEW') return entry;
  state.storyFlags.day20V4 = initial(entry.input);
  return {mode: 'V4'};
}

export function validateDay20V4(chapter) {
  if (chapter?.schema !== DAY20_V4_SCHEMA || chapter.phase !== 'preparation' || chapter.complete !== false ||
    !Array.isArray(chapter.choices) || chapter.choices.length !== 0) return false;
  const input = chapter.input;
  if (!['FACE_TO_FACE', 'SOLO'].includes(input?.visitMode) ||
    !['CALM', 'DIFFICULT', 'QUIET'].includes(input?.relationshipTone)) return false;
  for (const key of ['relationshipActive', 'contactAllowed', 'cupConversationExperienced',
    'sharedTravelConversationExperienced', 'day18DiscussionPending']) if (typeof input[key] !== 'boolean') return false;
  if ((!input.relationshipActive && input.contactAllowed) ||
    (input.visitMode === 'FACE_TO_FACE' && (!input.contactAllowed || input.invitation?.status !== 'ACCEPTED')) ||
    (input.visitMode === 'SOLO' && input.invitation?.status !== 'NONE')) return false;
  return JSON.stringify(chapter) === JSON.stringify(initial(input));
}

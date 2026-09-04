// DAY18's facts are independent of the legacy home-safety chapter.
// Every consequence is replayed from a frozen entry snapshot and ordered choices.
export const DAY18_V4_SCHEMA = 'day18-notion-v4/1';
const clone = value => JSON.parse(JSON.stringify(value));
const option = (id, label) => ({id: `day18_v4_${id}`, label});
const opts = pairs => pairs.map(([id, label]) => option(id, label));
const legacyKeys = ['day18RouteStrategy', 'day18StorageStrategy', 'day18AccessStrategy',
  'day18RuntimeStage', 'day18CurrentHomeSafetyCompleted', 'day18RuntimeComplete'];

export function getDay18V4Entry(state, context = {}) {
  const f = state?.storyFlags ?? {};
  if (f.day18V4 != null) return {mode: validateDay18V4(f.day18V4) ? 'V4' : 'INVALID_V4'};
  if (legacyKeys.some(key => f[key] != null && f[key] !== false && f[key] !== 0)) return {mode: 'LEGACY'};
  if (f.day17V4Completed !== true || f.day17V4Day18HookPending !== true) return {mode: 'BLOCKED_PREREQUISITE'};
  const plan = f.day17V4TomorrowPlan;
  const agreement = f.day17V4DinnerAgreement;
  let appointment = 'SOLO';
  if (plan === 'YURI_MEET') {
    if (f.day16V4YuriEncountered !== true || f.day16V4YuriContact !== 'SHARED' ||
      !['ACCEPT_INTENT', 'ANSWER_TOMORROW'].includes(f.day16V4YuriInvitation)) return {mode: 'INVALID_PREREQUISITE'};
    // Older DAY17 Yuri acceptance already has a bilateral reply in its script.
    if (f.day17V4Choice9 !== 'day17_v4_yuri_short') return {mode: 'INVALID_PREREQUISITE'};
    appointment = 'YURI';
  } else if (plan === 'HAEUN') {
    if (agreement?.day !== 18 || agreement.partner !== 'HAEUN' || agreement.status !== 'ACCEPTED' ||
      agreement.sourceChoiceId !== 'day17_v4_life_haeun') return {mode: 'NEEDS_AGREEMENT_REPAIR'};
    appointment = 'HAEUN';
  } else if (!['SOLO', 'YURI_DECLINED', 'YURI_UNSET'].includes(plan)) return {mode: 'INVALID_PREREQUISITE'};
  const relationshipActive = state.breakup == null && state.ended !== true;
  const contactAllowed = relationshipActive && context.haeunContactAllowed !== false;
  if (appointment === 'HAEUN' && !contactAllowed) return {mode: 'CONFLICTING_APPOINTMENT'};
  return {mode: 'V4_NEW', input: {
    appointment, relationshipActive, contactAllowed,
    haeunKnowsAppointment: appointment === 'YURI' && f.day17V4HaeunDisclosure === 'TOLD',
    yuriKnowsRelationship: f.day16V4HaeunRelationshipDisclosure === 'NAMED_GIRLFRIEND',
    otherInterest: context.otherInterest === true,
    yuriPastRelevant: context.yuriPastRelevant === true,
    yuriOwnBookKnown: context.yuriOwnBookKnown === true,
    handHoldingComfortable: context.handHoldingComfortable === true,
    source: {day17Choice9: f.day17V4Choice9 ?? null, day17Disclosure: f.day17V4HaeunDisclosure ?? null}
  }};
}

function initial(input) {
  return {schema: DAY18_V4_SCHEMA, input: clone(input), choices: [], phase: 'morning', complete: false,
    facts: {dinner: null, appointmentCancelled: false, haeunKnowsDinner: input.haeunKnowsAppointment,
      statements: [], yuriRelationshipClaim: null, yuriNext: null, payment: null,
      haeunTopic: null, comfortableDinner: false, sharedSeat: false, walkTogether: false,
      contactTonight: null, nightRoute: null, relationshipIntent: null, travelCandidate: null,
      travelTogetherDiscussed: false, followUpContact: false, heardYuriPast: false}};
}

export function beginDay18V4(state, context = {}) {
  const entry = getDay18V4Entry(state, context);
  if (entry.mode !== 'V4_NEW') return entry;
  state.storyFlags.day18V4 = initial(entry.input);
  return {mode: 'V4'};
}

export function getDay18V4Options(chapter) {
  const {phase, input: i, facts: f} = chapter;
  switch (phase) {
    case 'morning': return opts(i.appointment === 'SOLO' ? [['morning_solo', '오늘은 혼자 저녁을 먹자.']] : [
      ['morning_keep', '어제 정한 대로 만나고 싶어요.'],
      ['morning_change', '오늘은 몸이 무거워요. 약속을 바꿀 수 있을까요?'],
      ['morning_solo', '오늘은 혼자 저녁을 먹자.']]);
    case 'disclosure': return opts(f.dinner === 'YURI' ? [
      ['disclose_yuri', '오늘 유리 씨와 저녁 먹기로 한 얘기도 하고 싶어.'],
      ['disclose_withhold', '저녁 약속이 있어. 누구랑 만나는지는 지금 말하기가 어렵네.'],
      ['disclose_solo', '오늘 저녁은 혼자 먹을 것 같아.']]
      : f.dinner === 'HAEUN' ? [['disclose_together', '이따 만나서 얘기하고 싶어.']]
      : [['disclose_solo', '오늘 저녁은 혼자 먹을 것 같아.']]);
    case 'menu': return opts(f.dinner === 'SOLO' ? [
      ['menu_familiar', '익숙한 김밥을 먹는다.'], ['menu_new', '다른 김밥을 먹는다.'],
      ['menu_later', '한 줄 뒤에 더 고른다.']] : [
      ['menu_each', '오늘 먹고 싶은 쪽으로 해요. 제 건 제가 고를게요.'],
      ['menu_share', '하나씩 시켜서 조금 나눠 먹을까요?'], ['menu_wait', '아직 못 골랐어요. 두 분 더 볼게요.']]);
    case 'yuri_purpose': return opts([
      ['purpose_past', '우리 이야기를 조금 더 알고 싶었어요.'],
      ['purpose_present', '유리 씨가 지금 어떤 사람인지 궁금했어요.'],
      ['purpose_self', '제가 왜 다시 만나고 싶은지 확인하고 싶었어요.']]);
    case 'yuri_apology': return opts([
      ['apology_thanks', '오늘 얘기해 줘서 고마워요.'], ['apology_lonely', '그때 많이 외로웠겠어요.'],
      ['apology_all', '제가 다 잘못한 거라고 하면, 좀 나아질까요?']]);
    case 'yuri_relationship': return opts(i.relationshipActive ? [
      ['relationship_haeun', '하은과 계속 만나고 있어요.'],
      ['relationship_wavering', '만나는 사람은 있어요. 제 마음이 흔들리는 게 문제예요.'],
      ['relationship_free', '지금은 자유롭게 지내요.']] : [['relationship_free', '지금은 자유롭게 지내요.']]);
    case 'yuri_correction': return opts([
      ['yuri_correct', '아니요. 표현을 흐렸어요.'], ['yuri_lie_breakup', '네.']]);
    case 'yuri_next': return opts([
      ['next_time', '오늘 들은 이야기를 갖고, 당분간 지내 볼게요.'],
      ['next_end', '과거 이야기는 여기까지 듣고 싶어요.'], ['next_ask', '다시 만나고 싶어요. 그래도 되나요?']]);
    case 'payment': return opts([
      ['pay_split', '그럼 각자 먹은 만큼 낼까요?'], ['pay_offer', '오늘 밥은 제가 사고 싶었어요. 부담이면 나눠요.'],
      ['pay_debt', '제가 다 내야 마음이 편할 것 같아요.']]);
    case 'haeun_topic': return opts([
      ['topic_good', '오늘 너랑 이렇게 있는 게 좋아.'], ['topic_other', '요즘 다른 사람에게 느낀 마음도 이야기하고 싶어.'],
      ['topic_score', '내가 잘하고 있는지 자꾸 확인받고 싶어져.']]);
    case 'closeness': return opts([
      ['close_seat', '옆으로 가도 돼?'], ['close_walk', '다 먹으면 조금만 걸을까?'],
      ['close_home', '오늘은 여기서 천천히 먹고 들어가자.']]);
    case 'solo_contact': return opts([
      ['solo_jihoon', '지훈에게 안부나 물어볼까.'],
      ...(i.contactAllowed ? [['solo_haeun', '하은한테 오늘 먹은 얘기를 보내고 싶어.']] : []),
      ['solo_food', '오늘은 휴대전화 없이 끝까지 먹자.']]);
    case 'return': return opts([
      ['return_walk', '조금 걸어서 집에 가자.'], ['return_home', '오늘은 바로 들어가자.'],
      ['return_food', '내일 먹을 것만 생각해 두자.']]);
    case 'night': return opts(f.dinner === 'HAEUN' ? [
      ['night_good', '오늘 너랑 먹어서 좋았어.'], ['night_thought', '아까는 잘 못 말했는데, 생각이 좀 남았어.'],
      ['night_rest', '잘 도착했어. 오늘은 푹 쉬자.']] : [
      ['night_tell', '오늘 저녁이 어땠는지 이야기하고 싶어.'],
      ['night_defer', '생각을 조금 정리하고 싶어. 내일 이야기할 수 있을까?'],
      ['night_solo', '별일 없었어. 혼자 먹고 왔어.']]);
    case 'night_correction': return opts([
      ['night_correct', '아니. 만났어. 방금 내가 거짓말했어.'], ['night_lie_cancel', '응, 취소됐어.']]);
    case 'relationship_future': return opts([
      ['future_continue', '나는 너와 계속 만나고 싶어. 다른 만남도 그 마음에 맞게 정할게.'],
      ['future_unsure', '너를 좋아하지만, 지금 확신하는 척하고 싶지는 않아.'],
      ['future_others', '오늘은 이 말을 피했어. 다른 사람을 더 만나고 싶은 마음이 있어.']]);
    case 'calm_future': return opts([
      ['calm_trip', '하루 어디 다녀오고 싶어.'], ['calm_rest', '네가 편하게 쉬는 모습을 보고 싶어.'],
      ['calm_dinner', '오늘 같은 저녁을 또 먹고 싶어.']]);
    case 'alone_end': return opts([
      ['alone_stop', '오늘은 더 연락하지 말자.'], ['alone_note', '내가 한 말만 짧게 다시 적어 두자.'],
      ['alone_jihoon', '지훈에게 잠깐 이야기할 수 있는지 물어보자.']]);
    case 'travel': return opts([
      ['travel_near', '가까운 데서 하루 보내는 걸 보자.'], ['travel_busan', '부산에 가는 시간과 비용을 알아보자.'],
      ['travel_life', '여행보다 지금 생활부터 보자.']]);
    case 'ending': return [];
    default: throw new Error(`DAY18_INVALID_PHASE:${phase}`);
  }
}

function statement(c, recipient, claim, truthful, correctionOf = null) {
  const record = {id: `d18-statement-${c.facts.statements.length + 1}`, recipient, claim,
    truthful, choiceId: c.choices.at(-1).id, correctionOf};
  c.facts.statements.push(record);
  return record;
}

function moveAfterDinner(c) {
  c.phase = c.input.contactAllowed ? 'night' : 'alone_end';
  if (!c.input.contactAllowed) c.facts.nightRoute = 'ALONE';
}

function reduce(c, id) {
  const selected = getDay18V4Options(c).find(o => o.id === id);
  if (!selected || c.complete) throw new Error(`DAY18_CHOICE_UNAVAILABLE:${id}`);
  const phase = c.phase, f = c.facts, i = c.input;
  c.choices.push({phase, id});
  const key = id.replace('day18_v4_', '');
  switch (phase) {
    case 'morning':
      f.dinner = key === 'morning_keep' ? i.appointment : 'SOLO';
      f.appointmentCancelled = i.appointment !== 'SOLO' && f.dinner === 'SOLO';
      c.phase = i.contactAllowed ? 'disclosure' : 'menu'; break;
    case 'disclosure':
      if (key === 'disclose_yuri') { f.haeunKnowsDinner = true; statement(c, 'HAEUN', 'YURI_DINNER_PLANNED', true); }
      if (key === 'disclose_withhold') statement(c, 'HAEUN', 'PARTNER_WITHHELD', true);
      if (key === 'disclose_solo') statement(c, 'HAEUN', 'SOLO_DINNER_PLANNED', f.dinner === 'SOLO');
      c.phase = 'menu'; break;
    case 'menu':
      f.menu = key;
      c.phase = f.dinner === 'YURI' ? 'yuri_purpose' : f.dinner === 'HAEUN' ? 'haeun_topic' : 'solo_contact'; break;
    case 'yuri_purpose': f.yuriPurpose = key; c.phase = 'yuri_apology'; break;
    case 'yuri_apology': f.heardYuriPast = true; f.yuriApology = key; c.phase = 'yuri_relationship'; break;
    case 'yuri_relationship':
      f.yuriRelationshipClaim = key;
      statement(c, 'YURI', key === 'relationship_free' ? 'SINGLE' : 'CURRENT_RELATIONSHIP', key !== 'relationship_free' || !i.relationshipActive);
      c.phase = key === 'relationship_free' && i.relationshipActive && i.yuriKnowsRelationship ? 'yuri_correction' : 'yuri_next'; break;
    case 'yuri_correction': {
      const previous = f.statements.findLast(s => s.recipient === 'YURI');
      statement(c, 'YURI', key === 'yuri_correct' ? 'CURRENT_RELATIONSHIP' : 'BREAKUP', key === 'yuri_correct', key === 'yuri_correct' ? previous.id : null);
      if (key === 'yuri_correct') f.yuriRelationshipClaim = 'relationship_haeun';
      c.phase = 'yuri_next'; break;
    }
    case 'yuri_next':
      f.yuriNext = key === 'next_ask' ? 'REQUESTED_NOT_ACCEPTED' : key === 'next_end' ? 'PAST_CLOSED' : 'TIME_APART';
      c.phase = 'payment'; break;
    case 'payment':
      // The original rejects paying to erase guilt and returns to a shared bill.
      f.payment = key === 'pay_offer' ? 'ONE_MEAL_GIFT' : 'SPLIT';
      moveAfterDinner(c); break;
    case 'haeun_topic':
      f.haeunTopic = key;
      f.comfortableDinner = !(key === 'topic_other' && i.otherInterest);
      if (f.comfortableDinner) c.phase = 'closeness'; else moveAfterDinner(c);
      break;
    case 'closeness':
      f.sharedSeat = key === 'close_seat'; f.walkTogether = key === 'close_walk';
      f.heldHands = f.walkTogether && i.handHoldingComfortable;
      moveAfterDinner(c); break;
    case 'solo_contact': f.soloContact = key; c.phase = 'return'; break;
    case 'return': f.returnAction = key; moveAfterDinner(c); break;
    case 'night':
      f.contactTonight = key;
      if (key === 'night_defer' || key === 'night_rest') {
        f.followUpContact = key === 'night_defer'; f.nightRoute = 'ALONE'; c.phase = 'alone_end';
      } else if (key === 'night_solo' && f.dinner === 'YURI') {
        statement(c, 'HAEUN', 'ATE_ALONE', false);
        f.nightRoute = 'UNRESOLVED'; c.phase = f.haeunKnowsDinner ? 'night_correction' : 'alone_end';
      } else if (f.dinner === 'YURI' || (f.dinner === 'HAEUN' && !f.comfortableDinner)) {
        if (f.dinner === 'YURI') { f.haeunKnowsDinner = true; statement(c, 'HAEUN', 'ATE_WITH_YURI', true); }
        f.nightRoute = 'RELATIONSHIP'; c.phase = 'relationship_future';
      } else {
        if (key === 'night_solo') statement(c, 'HAEUN', 'ATE_ALONE', true);
        f.nightRoute = 'CALM'; c.phase = 'calm_future';
      }
      break;
    case 'night_correction': {
      const previous = f.statements.findLast(s => s.recipient === 'HAEUN');
      statement(c, 'HAEUN', key === 'night_correct' ? 'ATE_WITH_YURI' : 'APPOINTMENT_CANCELLED', key === 'night_correct', key === 'night_correct' ? previous.id : null);
      // Admitting a lie does not make Haeun ready for a cheerful travel call.
      f.followUpContact = key === 'night_correct'; f.nightRoute = 'UNRESOLVED'; c.phase = 'alone_end'; break;
    }
    case 'relationship_future':
      f.relationshipIntent = key; f.nightRoute = key === 'future_others' ? 'ENDED_CALL' : 'UNRESOLVED';
      f.followUpContact = key !== 'future_others'; c.phase = 'travel'; break;
    case 'calm_future': f.calmFuture = key; f.travelTogetherDiscussed = key === 'calm_trip'; c.phase = 'travel'; break;
    case 'alone_end': f.aloneAction = key; c.phase = 'travel'; break;
    case 'travel': f.travelCandidate = key; c.phase = 'ending'; break;
    default: throw new Error(`DAY18_INVALID_PHASE:${phase}`);
  }
  return c;
}

export function validateDay18V4(chapter) {
  try {
    if (chapter?.schema !== DAY18_V4_SCHEMA || !Array.isArray(chapter.choices) || typeof chapter.complete !== 'boolean') return false;
    const i = chapter.input;
    if (!['YURI', 'HAEUN', 'SOLO'].includes(i?.appointment)) return false;
    for (const key of ['relationshipActive', 'contactAllowed', 'haeunKnowsAppointment', 'yuriKnowsRelationship', 'otherInterest', 'yuriPastRelevant', 'yuriOwnBookKnown', 'handHoldingComfortable']) {
      if (typeof i[key] !== 'boolean') return false;
    }
    if ((!i.relationshipActive && i.contactAllowed) || (i.appointment === 'HAEUN' && !i.contactAllowed)) return false;
    const replay = initial(i);
    for (const record of chapter.choices) {
      if (record.phase !== replay.phase) return false;
      reduce(replay, record.id);
    }
    if (chapter.complete && replay.phase !== 'ending') return false;
    replay.complete = chapter.complete;
    return JSON.stringify(replay) === JSON.stringify(chapter);
  } catch { return false; }
}

// Derived, not part of the replay-locked /1 save schema. A promise to contact
// someone is not their consent to a call, nor an agreed appointment time.
export function getDay18V4FollowUpContract(chapter) {
  if (!validateDay18V4(chapter)) throw new Error('DAY18_INVALID_SAVE');
  const result = {status: 'NONE', promisedBy: null, contactDay: null,
    agreedTime: null, sourceChoiceId: null};
  if (!chapter.input.contactAllowed) return result;
  const record = chapter.choices.findLast(({id}) => [
    'day18_v4_night_defer', 'day18_v4_night_correct',
    'day18_v4_future_continue', 'day18_v4_future_unsure'
  ].includes(id));
  if (!record) return result;
  const promised = record.id === 'day18_v4_night_defer';
  return {...result, status: promised ? 'CONTACT_PROMISED' : 'DISCUSSION_PENDING',
    promisedBy: promised ? 'PLAYER' : null, contactDay: promised ? 19 : null,
    sourceChoiceId: record.id};
}

export function applyDay18V4Choice(state, id) {
  const chapter = state?.storyFlags?.day18V4;
  if (!validateDay18V4(chapter)) throw new Error('DAY18_INVALID_SAVE');
  const next = reduce(clone(chapter), id);
  state.storyFlags.day18V4 = next;
  return clone(next);
}

export function completeDay18V4(state, cue) {
  const chapter = state?.storyFlags?.day18V4;
  if (!validateDay18V4(chapter) || chapter.phase !== 'ending' ||
    cue?.type !== 'chapterCompletionCue' || cue.day !== 18 || cue.finalSceneReached !== true) throw new Error('DAY18_INVALID_COMPLETION');
  if (chapter.complete) return clone(chapter);
  chapter.complete = true;
  state.storyFlags.day18V4Day19HookPending = true;
  state.storyFlags.day17V4Day18HookPending = false;
  return clone(chapter);
}

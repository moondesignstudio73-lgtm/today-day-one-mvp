export const LATE_NIGHT_INVITATION_MIN_DAY = 6;
export const LATE_NIGHT_INVITATION_START_MINUTES = 22 * 60;
export const LATE_NIGHT_INVITATION_CHANCE = 0.1;
export const LATE_NIGHT_INVITATION_MESSAGE = "너무 보고 싶어. 우리 집에 와줄 수 있어?";

function getNightState(state) {
  return state?.nightState && state.nightState.day === state.day ? state.nightState : null;
}

export function getLateNightInvitation(state) {
  return getNightState(state)?.lateNightInvitation ?? null;
}

export function getPendingLateNightInvitation(state) {
  const invitation = getLateNightInvitation(state);
  return invitation?.status === "received" ? invitation : null;
}

export function canCheckLateNightInvitation(state) {
  const night = getNightState(state);
  return Boolean(
    night &&
    state.day >= LATE_NIGHT_INVITATION_MIN_DAY &&
    night.minutes >= LATE_NIGHT_INVITATION_START_MINUTES &&
    night.lateNightInvitationCheckedDay !== state.day &&
    !night.lateNightInvitation
  );
}

export function maybeTriggerLateNightInvitation(state, random = Math.random) {
  if (!canCheckLateNightInvitation(state)) return { checked:false, triggered:false, invitation:getLateNightInvitation(state) };
  const night = getNightState(state);
  night.lateNightInvitationCheckedDay = state.day;
  if (random() >= LATE_NIGHT_INVITATION_CHANCE) return { checked:true, triggered:false, invitation:null };

  const invitation = {
    id:`late-night-invitation-${state.day}`,
    day:state.day,
    receivedMinutes:night.minutes,
    status:"received",
    message:LATE_NIGHT_INVITATION_MESSAGE
  };
  night.lateNightInvitation = invitation;
  night.messagesRead = false;
  state.initiatedMessages ??= [];
  state.initiatedMessages.push({
    id:invitation.id,
    day:state.day,
    phase:state.phase,
    text:invitation.message,
    type:"late-night-home-invitation",
    chance:LATE_NIGHT_INVITATION_CHANCE
  });
  return { checked:true, triggered:true, invitation };
}

export function completeLateNightInvitation(state, completedMinutes) {
  const invitation = getPendingLateNightInvitation(state);
  if (!invitation) return null;
  invitation.status = "completed";
  invitation.completedMinutes = completedMinutes ?? getNightState(state)?.minutes ?? null;
  return invitation;
}

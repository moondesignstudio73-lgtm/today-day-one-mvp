// Story scenes can advance their presentation clock without advancing Free Mode.
// Capture the displayed scene time at insertion, not when opening the backlog.
export function getDialogueHistoryTime(presentation, fallbackLabel) {
  const label = {morning:'아침',afternoon:'낮',evening:'저녁',night:'밤'}[presentation?.timeOfDay];
  return presentation?.storyClock && label ? `${label} · ${presentation.storyClock}` : fallbackLabel;
}

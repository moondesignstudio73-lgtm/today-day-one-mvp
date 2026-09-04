export function getStoryCommunicationPresentation(step) {
  const message=step?.type==='message';
  const call=step?.type==='dialogue'&&step.device==='call';
  const speaker=message?step.sender:step?.speaker;
  return {message,call,side:message&&speaker==='나'?'outgoing':'incoming',
    label:message?`문자 · ${speaker??''}`:call?`통화 · ${speaker??''}`:'대화'};
}

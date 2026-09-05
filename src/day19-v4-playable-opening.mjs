import {DAY19_V4_SOURCE_SCENES} from './day19-v4-source-registry.mjs';
import {day19V4SourceRef} from './day19-v4-source-selection.mjs';
import {getDay19V4Options, validateDay19V4} from './day19-v4-state-contract.mjs';

const ref = (scene, line) => day19V4SourceRef(scene, line);
const mono = (scene, text) => ({type:'monologue', text, source:ref(scene,text)});
const directedMono = (scene, text, exact) => ({type:'monologue', text, origin:'source-directed', source:ref(scene,exact)});
const act = (scene, exact, status, actionLabel) => ({type:'stageAction', status, actionLabel, source:ref(scene,exact)});
const quoted = (scene, exact, device = null) => {
  const match = exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);
  if (!match) throw new Error(`DAY19_DIALOGUE_LINE_INVALID:${scene}:${exact}`);
  return {type:device ? 'message' : 'dialogue', speaker:match[1] === '주인공' ? '나' : match[1],
    ...(device ? {sender:match[1] === '주인공' ? '나' : match[1], device} : {}), text:match[2], source:ref(scene,exact)};
};
const directedMessage = (scene, text, exact) => ({type:'message', speaker:'지훈', sender:'지훈', device:'phone', text,
  origin:'source-directed', source:ref(scene,exact)});
const scene = (number, location, time) => ({type:'sceneDirection', number,
  title:DAY19_V4_SOURCE_SCENES[number-1].title, location, time});
const choice = chapter => ({type:'choice', choiceNumber:chapter.choices.length + 1,
  prompt:DAY19_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===chapter.choices.length+1)?.title,
  options:getDay19V4Options(chapter)});
const last = chapter => chapter.choices.at(-1)?.id ?? '';

function scene1Opening(chapter) {
  return [scene(1,'home-morning','morning'),
    mono(1,'사진 속 방에는 커다란 창문이 있었다. 바다가 잘 보이는 방향으로 의자가 두 개 놓여 있었다.'),
    mono(1,'나는 한쪽 의자에 하은을 앉혀 봤다.'),
    mono(1,'그녀가 웃을 것 같았다. 어떤 표정으로 웃을지까지 잠깐 떠올랐다.'),
    act(1,'그러고 나서 가격을 봤다.','travel-price-view','여행 후보의 가격을 확인함'),
    act(1,'화면을 조금 내렸다가 다시 올렸다. 숫자가 잘못 보인 건 아니었다.','travel-price-scroll','가격 화면을 내려 다시 확인함'),
    mono(1,'내 방 창문으로는 맞은편 건물이 보였다. 창문을 크게 닦는다고 바다가 생길 일은 없었다.'),
    choice(chapter)];
}

function choice1Reaction(chapter) {
  const id = last(chapter);
  if (id.endsWith('_money')) return [
    mono(1,'나는 통장에 있는 숫자를 봤다가, 앞으로 나갈 돈을 떠올렸다. 숫자 전부가 오늘 자유롭게 쓸 수 있는 돈은 아니었다. 집에서 생활하고, 먹고, 이동하고, 필요한 곳에 가야 했다.'),
    act(1,'여행 사진을 닫지는 않았다. 다만 다른 창 옆으로 옮겼다. 보고 싶은 것과 쓸 수 있는 것을 같이 볼 수 있게.','travel-tab-beside-budget','여행 사진을 예산 화면 옆으로 옮김')];
  if (id.endsWith('_ask_haeun')) {
    if (!chapter.input.contactAllowed) throw new Error('DAY19_CONTACT_HISTORY_VIOLATION');
    if (chapter.input.day18DiscussionPending) return [quoted(1,'**주인공** “어제 이야기 이어 갈 수 있을 때 알려 줘. 여행 얘기로 건너뛰지는 않을게.”','phone')];
    return [quoted(1,'**주인공** “어제 말한 하루, 너는 어떤 게 좋아?”','phone'),
      quoted(1,'**하은** “지금 바로 대답해야 돼?”','phone'), quoted(1,'**주인공** “아니.”','phone'),
      quoted(1,'**하은** “그럼 점심쯤 생각해서 말해 줄게.”','phone'),
      mono(1,'나는 답장 옆에 점심을 기다리는 표시를 따로 만들지 않았다. 하은은 오늘도 자기 일을 하러 나갔다.')];
  }
  return [mono(1,'이동, 식사, 산책, 숙소.'),
    act(1,'사진을 붙이니 그럴듯해졌다. 나는 아직 하은에게 받은 답이 없는 자리에 ‘휴식’이라고 썼다. 휴식 시간이 제일 적다는 건 다 만든 뒤에야 보였다.','travel-draft-filled','이동·식사·산책·숙소 사진으로 계획 초안을 채움'),
    directedMono(1,'휴식 시간이 제일 적다는 건 다 만든 뒤에야 보였다.','사진을 붙이니 그럴듯해졌다. 나는 아직 하은에게 받은 답이 없는 자리에 ‘휴식’이라고 썼다. 휴식 시간이 제일 적다는 건 다 만든 뒤에야 보였다.')];
}

function scene2Opening(chapter) {
  return [scene(2,'home-morning','morning'), act(2,'나는 여행 다음 날의 칸을 열었다. 비어 있었다.','next-day-cell-open','여행 다음 날 칸을 열어 봄'),
    mono(2,'거기에도 아침을 먹는 내가 있을 텐데, 아무것도 적지 않았다.'),
    act(2,'찬장을 열어 남은 것을 봤다. 세제를 언제 샀는지 기억이 나지 않아 병을 들어 무게를 가늠했다. 생각보다 가벼웠다.','detergent-weight-check','찬장에서 세제의 남은 무게를 확인함'),
    mono(2,'여행 사진 속 욕실에는 이런 걱정이 없었다. 누군가 채워 놓았을 것이다.'),
    act(2,'나는 돈을 나눠 적었다. 이번 주 생활에 필요한 것, 이미 약속한 지출, 지금 내가 바꾸어 쓸 수 있는 것.','budget-categories-write','생활비·약속한 지출·가용 금액을 나눠 적음'),
    mono(2,'새로운 월급은 적지 않았다. 회사에 다녀왔던 날은 하루가 끝나면 통장 숫자가 올라가는 종류의 출근으로 확정된 게 아니었다.'), choice(chapter)];
}

function choice2Reaction(chapter) {
  const id=last(chapter);
  if(id.endsWith('_near'))return [act(2,'멀리 떠나는 후보를 지우지는 않았다. 아래로 옮겼다.','far-candidate-move-down','먼 여행 후보를 아래로 옮김'),mono(2,'가까운 곳의 사진을 보자, 이미 아는 길도 있었다. 내가 멀리 간 사람처럼 보여야만 데이트가 되는 건 아닐 텐데.')];
  if(id.endsWith('_save_later'))return [mono(2,'나는 ‘나중에’만 쓰려다가 멈췄다. 언제 다시 살펴볼 수 있을지 내 생활부터 보기로 했다. 아무 기한 없는 나중은 영영 보지 않겠다는 말이 되기 쉬웠다.')];
  return [mono(2,'좋은 방을 조금 포기하면 이동을 덜 힘들게 할 수도 있었다. 반대로 이동 시간을 늘려 방을 고르는 방법도 있었다. 어느 쪽이든 대신 내는 것은 돈만이 아니었다.'),mono(2,'사진에 있는 바다는 같은 색이었다. 내가 거기에 도착하는 모습은 선택마다 달랐다.')];
}

function scene3And4Opening(chapter) {
  return [scene(3,'home-morning','morning'),act(3,'지훈에게 메시지를 보냈다.','message-jihoon','지훈에게 메시지를 보냄'),
    quoted(3,'**주인공** “여행 가려면 생각보다 이것저것 많네.”','phone'),quoted(3,'**지훈** “짐?”','phone'),
    quoted(3,'**주인공** “돈.”','phone'),quoted(3,'**지훈** “그것도 짐이지. 없으면 가볍고 서러움.”','phone'),
    act(3,'나는 웃었다.','jihoon-chat-laugh','지훈의 답에 웃음'),quoted(3,'**주인공** “너 되게 격언처럼 말한다.”','phone'),
    quoted(3,'**지훈** “출근길에 나온 말은 다 격언임.”','phone'),act(3,'그가 잠시 뒤 다시 보냈다.','jihoon-message-pause','잠시 뒤 메시지가 도착함'),
    quoted(3,'**지훈** “복권 되면 해결.”','phone'),quoted(3,'**주인공** “안 되면?”','phone'),quoted(3,'**지훈** “집.”','phone'),
    quoted(3,'**주인공** “네 집?”','phone'),quoted(3,'**지훈** “내 집은 관광 숙박업 안 한다.”','phone'),
    mono(3,'나는 지훈의 집을 여행 후보에 쓰는 척만 하고 그만뒀다. 실제로 묵을 약속은 하지 않았다.'),
    quoted(3,'**주인공** “청소부터 시킬 것 같아.”','phone'),quoted(3,'**지훈** “숙박 후기: 호스트와 함께 성장할 수 있어요.”','phone'),
    quoted(3,'**주인공** “너한테는 돈 내고 안 갈게.”','phone'),quoted(3,'**지훈** “돈 안 내고도 오지 말고. 오늘 바쁨.”','phone'),
    mono(3,'웃고 나니 잠깐 숨이 가벼워졌다. 친구의 농담이 계산을 끝내 주지는 않았지만, 숫자가 나를 혼내는 것처럼 느껴지지는 않았다.'),
    directedMessage(3,'진짜로 무리하진 말고','지훈은 마지막으로 “진짜로 무리하진 말고”라고 했다.'),
    mono(3,'나는 알겠다고 답했다. 그 말까지 농담으로 돌리지는 않았다.'),
    scene(4,'home-morning','morning'),mono(4,'작은 금액으로 큰돈을 얻을 수도 있다는 화면이 보였다.'),
    mono(4,'방금까지 조금씩 줄이던 여행비가, 어느새 아주 쉽게 채워질 수 있는 것처럼 보였다.'),
    mono(4,'나는 사진 속 창문을 다시 떠올렸다.'),mono(4,'당첨된다면.'),mono(4,'가격이 오른다면.'),
    mono(4,'그 짧은 말 뒤에서는 방도 좋고, 식사도 좋고, 내 표정도 훨씬 여유로웠다.'),
    mono(4,'그 말 앞에 있는 오늘의 나는 그대로였다.'),choice(chapter)];
}

function choice3Reaction(chapter) {
  const id=last(chapter), lottery=chapter.facts.lottery;
  if(id.endsWith('_no_spend'))return [act(4,'화면을 닫았다. 놓친 행운이 있는지 확인할 수는 없었다. 다만 내 통장에서 나가지 않은 돈은 알 수 있었다.','expectation-screen-close','기대 화면을 닫음'),mono(4,'나는 여행비 옆에 아무 숫자도 더하지 않았다.')];
  if(id.endsWith('_lottery'))return lottery==='PURCHASE_PENDING_RESULT' ? [
    act(4,'오락에 쓰기로 남겨 둔 돈이 있는 경우에만 작은 구매를 했다. 생활비를 다시 지우지는 않았다.','lottery-purchase-pending','미리 분리한 오락비 안에서만 작은 구매를 요청함'),
    mono(4,'나는 결과를 기다리는 칸을 잠깐 보다가 여행 화면으로 돌아왔다. 오늘 정할 여행에 아직 받지 않은 돈을 더하지 않았다.'),
    mono(4,'작게 기대하는 것과 그 기대가 꼭 맞아야 생활이 되는 것은 다른 일이었다.')]
    : [act(4,'오락비가 남아 있지 않았다면 구매를 멈췄다. 오늘은 안 샀다는 사실이 손해가 되지는 않았다.','lottery-purchase-stopped','분리된 오락비가 없어 구매를 중단함')];
  return [act(4,'나는 여행 계획 옆에 투자금이라는 줄을 만들려다가 지웠다. 언제 필요할지 정해진 돈을 당장 더 커질 돈처럼 쓰고 싶었던 마음이 먼저였다.','investment-line-delete','여행 계획의 투자금 줄을 지움'),
    mono(4,'오늘은 상품을 고르거나 사지 않았다. 나중에 알아보더라도 없어졌을 때 일상에 문제가 없는 여유부터 따로 살펴보기로 했다.'),
    mono(4,'창문이 큰 방은 아직 비쌌다. 그래도 오늘 당장 그 방을 살 수 있는 사람인 척할 필요는 없었다.')];
}

function scene5Opening(chapter) {
  return [scene(5,'home-morning','morning'),act(5,'민호에게 메시지가 왔다.','minho-message-arrive','민호에게 메시지가 도착함'),
    quoted(5,'**민호** “다음번 적응 방문, 가능한 날짜를 다시 맞춰 보면 어떨까요? 무리 없는 쪽으로요.”','phone'),
    act(5,'나는 달력을 보았다. 여행 후보가 크게 차지한 칸 옆에 다음 방문을 넣어 봤다. 일을 더 하면 여행도 더 쉽게 갈 수 있을 것 같았다.','calendar-visit-candidate','달력에 적응 방문 후보를 놓아 봄'),
    mono(5,'그런데 민호의 문장에는 새 업무도, 보수도 적혀 있지 않았다. 내가 다른 말을 붙여 읽고 있었다.'),choice(chapter)];
}

function choice4Reaction(chapter) {
  const id=last(chapter);
  if(id.endsWith('_dates'))return [quoted(5,'**민호** “네. 서두르지 않으셔도 됩니다.”','phone'),mono(5,'나는 여행을 갈 수 있는 척하려고 회사 날짜를 숨기지 않았다. 아직 확정하지 않았다는 사실도 그대로 두었다.')];
  if(id.endsWith('_duration'))return [mono(5,'민호는 지난 방문에서 무리가 없었는지 먼저 되물었다.'),mono(5,'나는 가능한 부분과 힘들었던 부분을 짧게 답했다. 민호는 그걸 보고 다시 조율하자고 했다.'),mono(5,'오늘 더 오래 일하겠다고 말하는 것만으로 다음 방문이 정규 근무로 바뀌지는 않았다.')];
  return [quoted(5,'**민호** “네. 연락 기다리겠습니다.”','phone'),act(5,'나는 답을 보낸 뒤 알림을 남겼다. 일정을 미루는 것과 연락을 잊어버리는 건 같은 일이 아니었다.','minho-reply-reminder','내일 회신 알림을 남김'),mono(5,'휴대전화를 내려놓자 조금 허전했다. 큰돈을 벌게 된 것도, 일을 전부 못 하게 된 것도 아니었다. 다음에 할 수 있는 일을 알아보는 중이었다.'),mono(5,'그 정도로도 하루가 앞으로 갈 수는 있었다.')];
}

export function getDay19V4PlayableOpening(chapter) {
  if (!validateDay19V4(chapter)) throw new Error('DAY19_INVALID_SAVE');
  if(chapter.phase==='money_view')return scene1Opening(chapter);
  if(chapter.phase==='scope')return [...choice1Reaction(chapter),...scene2Opening(chapter)];
  if(chapter.phase==='expectation_spend')return [...choice2Reaction(chapter),...scene3And4Opening(chapter)];
  if(chapter.phase==='minho_reply')return [...choice3Reaction(chapter),...scene5Opening(chapter)];
  if(chapter.phase==='budget')return [...choice4Reaction(chapter),{type:'openingBoundary',nextScene:6}];
  return [{type:'openingBoundary',nextScene:6}];
}

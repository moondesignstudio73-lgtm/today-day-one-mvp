export const DAY11_V3_VERSION="NOTION_V3";
export const DAY11_V3_SCENARIO_ID="m30-day11-haeun-before-her-friend-v3";

const freeze=value=>Object.freeze(value);
const scene=(number,title,act,route="BOTH")=>freeze({number,id:`day11-v3-scene-${String(number).padStart(2,"0")}`,title,act,route});
const option=(id,label,effects)=>freeze({id,label,effects:freeze(effects)});
const choice=(number,sceneNumber,title,options,{route="BOTH"}={})=>freeze({number,sceneNumber,title,route,options:freeze(options)});

export const DAY11_V3_CHAPTER_CONTRACT=freeze({
  id:DAY11_V3_SCENARIO_ID,day:11,title:"하은의 친구 앞에서",chapterType:"관계 경계·첫 질투 압력",
  windows:freeze(["오전","오후","늦은 오후","저녁"]),
  locations:freeze(["나의 방","연희 베이커리","플로라 카페","카페 모퉁이","연결 역"]),
  participants:freeze(["주인공","하은","소라","민호","지훈","시우(메시지)"]),
  prerequisites:freeze(["DAY10_COMPLETE"]),
  attendancePrerequisites:freeze(["DAY10_HAEUN_CONSENT","DAY10_SORA_CONSENT"]),
  dramaticPurpose:"소라에게 좋은 평가를 얻으려던 주인공이 하은의 현재 마음을 직접 듣는 태도로 이동한다.",
  protagonistWant:"하은의 오래된 친구에게 괜찮은 연인으로 보이고 싶다.",
  haeunWant:"친구와 연인을 각각 자기 선택으로 만나며 자기 이야기를 직접 말하고 싶다.",
  informationBudget:freeze({mustReveal:freeze(["작년 소라와 취소한 여행","시우라는 직장 선배 이름","전시 일정 전달","DAY12 회사 방문 시간"]),mayReveal:freeze(["소라의 제목 고민","친구 앞 하은의 빠른 말투"]),mustNotReveal:freeze(["하은의 정체 진실","사고 원인","시우와의 사적 관계 확정","전시 동행 확정","잠금 프로필"])}),
  emotionalCurve:freeze(["평가 불안","어색한 합류 또는 자기 시간","친구 앞 하은 발견","여행 죄책감 공개","평가 대신 직접 질문","시우 이름의 질투 압력","경계 존중과 선택적 친밀감","내일의 질문"]),
  targetPlayMinutes:freeze({invited:"25-35 manuscript estimate; browser measurement required",notAttending:"shorter branch; browser measurement required"}),
  followUpHook:"내일 오전 10시 회사 적응 방문, 점심 포함 최대 3시간"
});

export const DAY11_V3_VOICE_PROFILES=freeze({
  protagonist:freeze({rhythm:"짧고 구체적",humor:"건조한 맞받아치기",reasoning:"관찰→가능성→확인→판단→행동",jealousy:"질문과 경계 점검으로 표현",mustNot:"확정되지 않은 관계 단정"}),
  haeun:freeze({rhythm:"주인공보다 조금 길고 친구 앞에서는 빨라짐",humor:"생활형 장난",affection:"다정하지만 자기 선택을 양보하지 않음",conflict:"좋은 순간과 남은 문제를 함께 말함",mustNot:"죄책감으로 결혼을 갚는 사람"}),
  sora:freeze({rhythm:"조심스럽게 시작하고 실수를 바로 고침",humor:"영화·케이크·제목에서 현실적",role:"친구이지 심사위원이나 폭로자가 아님",mustNot:"하은 대신 비밀을 설명"}),
  minho:freeze({rhythm:"업무적으로 짧고 배려를 행동으로 표시",role:"회사 적응 방문의 시간 경계 제공"}),
  siwoo:freeze({presence:"전시 일정 메시지로만 등장",knowledge:"동행·사적 관계 미정",mustNot:"오늘 감정이나 의도를 작가가 확정"})
});

export const DAY11_V3_KNOWLEDGE_LEDGER=freeze({
  protagonist:freeze({knows:freeze(["기억상실","DAY10 결과","내일 회사 방문"]),suspects:freeze(["친구의 평가가 관계 안정에 영향을 줄 수 있음","시우라는 이름이 불안을 일으킴"]),doesNotKnow:freeze(["소라와 하은의 첫 한 시간 대화","시우 동행 여부"]),wants:"평가와 불안을 확인 가능한 질문으로 바꾸기",fears:"하은의 세계에서 자신만 뒤처지는 것"}),
  haeun:freeze({knows:freeze(["작년 여행을 포기한 자기 모순","소라와의 우정","시우 전시 일정"]),hides:freeze([]),liesAbout:freeze([]),wants:"자기 이야기를 자기 속도로 공개하고 각 관계의 시간을 지키기",fears:"배려가 다시 의무와 심사로 바뀌는 것"}),
  sora:freeze({knows:freeze(["하은과 못 간 여행","하은의 현재 말 범위"]),doesNotKnow:freeze(["주인공의 숨긴 사실","시우와 전시의 미래"]),wants:"하은을 맡기지 않고도 함께 잘 지내길 바람",fears:"친구의 삶이 연인 평가로 환원되는 것"})
});

export const DAY11_V3_SCENES=freeze([
  scene(1,"초대받은 사람, 남겨 둔 시간",1),scene(2,"누구 옷을 입고 갈까",1),scene(3,"내일의 시간",1),scene(4,"조금 일찍 도착한 사람",1),
  scene(5,"문 앞에서 듣는 웃음",2),scene(6,"메뉴를 대신 말하는 사람",2),scene(7,"끝을 모르는 두 사람",2),scene(8,"잘 부탁한다는 말",2),scene(9,"좋은 사람처럼 대답하기",2),scene(10,"소라가 꺼내지 않는 이야기",2),
  scene(11,"가지 못한 여행",3),scene(12,"고맙다는 말이 멈추는 곳",3),scene(13,"잘 나누지 못하는 케이크",3),scene(14,"소라의 제목",3),scene(15,"누가 맞는지 고르지 않고",3),scene(16,"잠깐 비운 자리",3),scene(17,"내가 고른 사람이라고 말할 때",3),scene(18,"오래 아는 친구의 말",3),
  scene(19,"시우라는 이름",4),scene(20,"헤어질 시간을 먼저 말하는 사람",4),scene(21,"조금 더 함께할까",4),scene(22,"내 쪽으로 기울어진 어깨",4),
  scene(23,"외우지 않는 밤",5),scene(24,"질문 하나를 챙긴 사람",5)
]);

export const DAY11_V3_CHOICES=freeze([
  choice(1,1,"하은의 오후를 듣고",[
    option("day11_attend_at_agreed_time","좋아. 정한 시간에 갈게.",{attendanceIntent:"ATTEND_AT_THREE"}),
    option("day11_leave_friends_alone","오늘은 둘이 편하게 만나. 나는 내일 준비 좀 할게.",{attendanceIntent:"DECLINE_FOR_PRIVATE_TIME"}),
    option("day11_admit_evaluation_anxiety","조금 긴장되네. 잘 보여야 할 것 같아서.",{attendanceIntent:"ATTEND_AND_ADMIT_ANXIETY"})]),
  choice(2,2,"거울 앞에서",[
    option("day11_wear_personal_comfort","내가 편한 걸 입자. 오늘 말도 좀 해야 하니까.",{outfitStrategy:"PERSONAL_COMFORT"}),
    option("day11_wear_haeun_preference_if_owned","하은이 좋아했던 쪽도 한번 입고 싶어.",{outfitStrategy:"HAEUN_PREFERENCE_IF_OWNED"}),
    option("day11_wear_ordinary_self","너무 잘 보이려고 애쓰진 말자. 평소처럼.",{outfitStrategy:"ORDINARY_SELF"})]),
  choice(3,4,"남는 시간에",[
    option("day11_buy_only_own_food","내가 먹을 것만 하나 고르자.",{waitingStrategy:"OWN_FOOD_ONLY"}),
    option("day11_ask_before_shared_bread","작은 걸 같이 먹으면 좋겠는데. 먼저 물어보자.",{waitingStrategy:"ASK_BEFORE_SHARED_FOOD"}),
    option("day11_wait_without_purchase","아무것도 사지 말고 잠깐 앉아 있자.",{waitingStrategy:"WAIT_AND_RESPECT_HOUR"})]),
  choice(4,6,"나도 모르게 아는 척하고 싶을 때",[
    option("day11_say_still_learning","아직 알아가는 중이에요.",{knowledgeStrategy:"ADMIT_LEARNING"}),
    option("day11_notice_today_preference","하은이 이런 것도 좋아하는구나.",{knowledgeStrategy:"NOTICE_TODAY"}),
    option("day11_admit_embarrassment","제가 잘 몰라서 좀 민망하네요.",{knowledgeStrategy:"ADMIT_EMBARRASSMENT"})],{route:"ATTENDING"}),
  choice(5,9,"마음에 걸린 말",[
    option("day11_want_to_know_more","아직 잘 모르겠어요. 그래서 더 알고 싶어요.",{evaluationStrategy:"ASK_HAEUN_DIRECTLY"}),
    option("day11_want_safe_conversation","하은이 편하게 말할 수 있는 사람이 되고 싶어요.",{evaluationStrategy:"MAKE_ROOM_TO_SPEAK"}),
    option("day11_promise_to_sora","걱정 안 하셔도 돼요. 제가 잘할게요.",{evaluationStrategy:"PERFORM_FOR_SORA"})],{route:"ATTENDING"}),
  choice(6,12,"그때의 하은에게, 지금 하는 말",[
    option("day11_name_haeun_complexity","그때 네 마음이 많이 복잡했겠다.",{tripResponse:"NAME_COMPLEXITY"}),
    option("day11_gratitude_and_apology","고마운데, 미안하다는 말만 하게 되네.",{tripResponse:"GRATITUDE_AND_APOLOGY"}),
    option("day11_ask_her_current_wish","지금은 가고 싶은 데 있어?",{tripResponse:"ASK_CURRENT_WISH"})]),
  choice(7,15,"친구들 사이에 앉는 방법",[
    option("day11_ask_why_title_worked","처음에 왜 좋았는지 궁금해요.",{friendConversation:"ASK_ORIGIN"}),
    option("day11_listen_as_newcomer","저는 듣기만 할게요. 오늘은 처음 보는 사람이니까.",{friendConversation:"LISTEN_FIRST"}),
    option("day11_ask_haeun_title","하은이 추천한 제목도 한번 들어 보고 싶은데.",{friendConversation:"PLAYFUL_HAEUN_SIDE"})]),
  choice(8,17,"하은에게 제대로 묻기",[
    option("day11_ask_haeun_today","그럼 너는, 오늘 나랑 있는 거 어때?",{directQuestion:"HAEUN_PRESENT_FEELING"}),
    option("day11_admit_waiting_for_praise","나를 좋게 말해 주길 기다렸나 봐.",{directQuestion:"ADMIT_EVALUATION_DEPENDENCE"}),
    option("day11_admit_recruiting_ally","나도 네 친구를 내 편으로 만들려고 했던 것 같아.",{directQuestion:"ADMIT_ALLY_SEEKING"})]),
  choice(9,19,"처음 듣는 이름 앞에서",[
    option("day11_ask_exhibition_content","무슨 전시인지 나도 궁금해.",{siwooResponse:"CURIOUS_ABOUT_EXHIBITION"}),
    option("day11_support_haeun_choice","네가 가 보고 싶으면 보고 와. 나중에 얘기해 줘.",{siwooResponse:"SUPPORT_WITHOUT_CLAIM"}),
    option("day11_ask_if_alone_with_siwoo","그 선배랑 둘이 가는 거야?",{siwooResponse:"ASK_COMPANION_FROM_ANXIETY"})]),
  choice(10,21,"하은에게 남는 시간",[
    option("day11_invite_short_walk","조금만 더 걷고 갈래?",{closingTime:"SHORT_WALK_IF_AVAILABLE"}),
    option("day11_end_and_prepare","오늘은 여기서 인사하자. 내일 준비도 해야 하고.",{closingTime:"END_WITH_BOUNDARY"}),
    option("day11_say_like_more","나 오늘 네가 좀 더 좋아졌어.",{closingTime:"DISCLOSE_PRESENT_AFFECTION"})]),
  choice(11,23,"내일의 나에게 남길 것",[
    option("day11_prepare_questions","모르는 건 물어보자.",{workPreparation:"ASK_WHEN_UNKNOWN"}),
    option("day11_prepare_one_small_task","할 수 있는 작은 일 하나만 해 보자.",{workPreparation:"ONE_SMALL_TASK"}),
    option("day11_stop_and_rest","오늘은 여기까지 읽고 쉬자.",{workPreparation:"REST_WITH_BOUNDARY"})])
]);

export const DAY11_V3_ROUTE_CONTRACT=freeze({
  invited:"DAY10_HAEUN_CONSENT && DAY10_SORA_CONSENT",
  attending:"invited && choice1 !== day11_leave_friends_alone",
  nonAttendance:"!invited || choice1 === day11_leave_friends_alone",
  attendingOnlyChoices:freeze([4,5]),
  firstHour:"Haeun and Sora only; player cannot arrive early",
  shoulderLean:"attending && relationshipBand === HIGH && priorNaturalContact && !unresolvedConflict && haeunInitiates && choice10 !== day11_end_and_prepare"
});

export const DAY11_V3_SAVE_KEYS=freeze([
  "day11V3Invited","day11V3AttendedSoraMeeting","day11V3PlayerDeclined","day11V3TripDisclosed","day11V3SoraTripFirstIntent","day11V3HeardSiwooName","day11V3ExhibitionInterest","day11V3CompanionUndecided","day11V3ShoulderLeanOccurred","day11V3WorkVisitTime","day11V3WorkVisitMaxHours","day11V3WorkIncludesLunch","day11V3PreparedQuestion","day11V3RelationshipBand","day11V3UnresolvedConflict","day11V3Choice1","day11V3Choice2","day11V3Choice3","day11V3Choice4","day11V3Choice5","day11V3Choice6","day11V3Choice7","day11V3Choice8","day11V3Choice9","day11V3Choice10","day11V3Choice11"
]);

export function validateDay11V3CampaignData(){
  const choicesValid=DAY11_V3_CHOICES.length===11&&DAY11_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3);
  const ids=DAY11_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id));
  return DAY11_V3_SCENES.length===24&&DAY11_V3_SCENES.every((item,index)=>item.number===index+1)&&choicesValid&&new Set(ids).size===33&&DAY11_V3_SAVE_KEYS.length===26;
}

import {DAY13_V3_CHOICES} from "./day13-v3-campaign-data.mjs";

const freezeSteps=steps=>Object.freeze(steps.map(step=>Object.freeze(step)));
const line=(type,text,extra={})=>Object.freeze({type,text,...extra});
const narration=text=>line("narration",text);
const dialogue=(speaker,text)=>line("dialogue",text,{speaker});
const message=(sender,text)=>line("message",text,{sender});
const stage=text=>line("stageDirection",text);

const scenes=[
  {number:13,title:"잘 찍히는 얼굴보다",choiceNumber:6,routeBranches:{
    ara:[narration("아라가 카메라 화면을 확인한다. 사람 얼굴보다 비가 그친 길과 창문, 빈 의자가 많다."),dialogue("주인공","사람 없는 게 많네요."),dialogue("아라","있을 때도 있어요. 근데 사람 없다고 아무 일 없던 건 아니니까."),narration("주인공은 오늘 아침 사진 속에 하은이 없었던 것을 생각한다."),dialogue("아라","한 장 찍어 드릴까요? 여기 앉은 거."),dialogue("주인공","이렇게요?"),dialogue("아라","네. 지금 이렇게요.")],
    solo:[narration("주인공은 휴대폰을 세워 자기 사진을 찍을지 생각한다. 누군가에게 잘 찍혔는지 묻기 전에 오늘 자기 얼굴을 먼저 보는 시간이다.")]},branches:{
    day13_portrait_now:[dialogue("주인공","네. 그냥 지금처럼 찍어 주세요."),narration("아라가 표정을 크게 바꾸라고 하지 않고 구도를 잡는다.")],
    day13_stay_photographer:[dialogue("주인공","오늘은 제가 찍는 쪽이 좋아요."),narration("아라는 바로 카메라를 내린다."),dialogue("아라","좋아요. 그럼 저 나무가 계속 일하겠네요."),narration("주인공이 웃는다.")],
    day13_portrait_one_then_decide:[dialogue("주인공","사진 보면 좀 낯설 것 같긴 한데, 한 장은 보고 싶어요."),dialogue("아라","한 장 보고 낯설면 지워도 돼요."),narration("아라는 먼저 한 장만 찍는다.")]},soloBranches:{
    day13_portrait_now:[narration("주인공은 타이머를 맞춰 지금 모습 그대로 한 장 찍는다. 낯선 얼굴을 바로 지우지 않고 잠깐 본다.")],
    day13_stay_photographer:[narration("주인공은 자신의 얼굴 대신 창밖의 길이나 물컵을 찍는다. 오늘 얼굴을 남기지 않을 자유도 있었다.")],
    day13_portrait_one_then_decide:[narration("주인공은 타이머로 한 장만 찍는다. 낯설어도 삭제 여부는 사진을 본 뒤 정하기로 한다.")]}},
  {number:14,title:"어색하게 웃는 법",routeBranches:{
    araPortrait:[narration("주인공은 자기도 모르게 허리를 조금 편다."),dialogue("아라","지금 증명사진 됐어요."),dialogue("주인공","안 움직여야 하는 줄 알았어요."),dialogue("아라","너무 안 움직이면 제가 더 긴장해요."),narration("주인공이 웃는 순간 셔터가 눌린다. 첫 사진에서는 눈을 감고 있다."),dialogue("주인공","좋은 카메라도 이건 안 되는군요."),dialogue("아라","좋은 카메라 잘못은 아닌 것 같아요."),narration("아라는 다시 찍어도 되겠냐고 눈으로 묻는다. 주인공이 고개를 끄덕인 뒤에만 한 장 더 찍는다."),dialogue("아라","어느 쪽이 좋아요?"),dialogue("주인공","첫 번째도 웃기네요."),dialogue("아라","그럼 실패한 척 안 할게요."),narration("멀쩡한 사진만 남겨야 오늘이 잘 지나간 것은 아닌 듯했다.")],
    araDecline:[narration("아라는 자기 나무 사진을 보여 준다."),dialogue("아라","이 나무도 좀 긴장한 것 같죠?"),dialogue("주인공","되게 곧네요."),dialogue("아라","오늘 다들 자세가 좋네요."),narration("주인공이 웃는다. 아라는 그 웃음을 몰래 찍지 않는다.")],
    soloPortrait:[narration("타이머 사진 속 주인공은 웃으려다 만 표정이다. 한 장을 더 찍자 이번에는 반쯤 움직인 얼굴이 나온다."),narration("남에게 보내기에는 애매하지만 자기가 어떤 날을 보내는지는 두 번째 사진에 더 잘 보인다.")],
    soloNoFace:[narration("주인공은 휴대폰 화면에 잠깐 비친 자기 표정을 보고 카메라를 끈다. 오늘 얼굴을 남기지 않을 자유도 있었다.")] }},
  {number:15,title:"어떤 사람이세요",choiceNumber:7,routeBranches:{
    ara:[dialogue("아라","평소에는 무슨 일 하세요?"),narration("서비스 전략 일을 했다고 말하면 된다. 다만 지금도 똑같이 일한다고 하기에는 어제의 세 시간이 짧다.")],
    solo:[narration("주인공은 사진에 붙일 한 줄을 적다가 ‘회사원’이라는 단어를 본다. 자신을 어떻게 부르고 싶은지와 실제 하루가 조금 다를 수 있다.")]},branches:{
    day13_work_relearning:[dialogue("주인공","서비스 쪽 일을 했어요. 지금은 조금씩 다시 익숙해지는 중이고요."),dialogue("아라","다시 시작하는 때네요."),dialogue("주인공","예전에 하던 건데, 지금은 다시 배우는 게 많아요. 남들은 제가 했던 걸 아는데 저는 잘 모르니까."),dialogue("아라","그 얘기는 하고 싶으면 해요. 저는 지금 처음 들었으니까, 뭘 물어봐도 되는지도 모르겠고."),dialogue("주인공","안 물어보시니까 좀 편하네요."),dialogue("아라","다행이네요. 저도 말 잘 고르는 편은 아니라서."),narration("사고 이야기를 더하지 않아도, 나중에 자신이 원할 때 설명할 수 있다는 것이 편했다."),dialogue("아라","저는 가끔 같은 곳 다시 가도 길 틀려요."),dialogue("주인공","많이 가셨다면서요."),dialogue("아라","많이 틀렸죠.")],
    day13_work_resting_visit:[dialogue("주인공","요즘은 쉬는 시간이 많아요. 어제 회사 잠깐 다녀왔어요."),dialogue("아라","그럼 오늘은 쉬는 날이군요."),narration("주인공이 사고와 기억을 더 말하지 않아도 아라는 이상하게 생각하지 않는다.")],
    day13_work_simple:[dialogue("주인공","회사 다녀요. 그냥 평범하게."),narration("아라는 그대로 받아들인다. 간단한 말이 곧 구체적인 허위 근무 주장은 아니지만, 평범하게 보이고 싶은 마음은 남는다.")]},soloBranches:{
    day13_work_relearning:[line("note","서비스 쪽 일을 했어요. 지금은 조금씩 다시 익숙해지는 중이고요."),narration("아직 누구에게도 보내지 않은 자기소개다.")],
    day13_work_resting_visit:[line("note","요즘은 쉬는 시간이 많아요. 어제 회사 잠깐 다녀왔어요."),narration("아직 누구에게도 보내지 않은 자기소개다.")],
    day13_work_simple:[line("note","회사 다녀요. 그냥 평범하게."),narration("말이 쉬운 만큼 더 하고 싶어지는 마음을 혼자 확인한다.")]}},
  {number:16,title:"설명하지 않아도 되는 편안함",routeBranches:{
    ara:[dialogue("아라","다음에 어디로 갈지는 일이 정해져야 알아요."),dialogue("주인공","계획 안 세워도 괜찮아요?"),dialogue("아라","일정은 세워요. 근데 갔다 온 다음 제가 어떤 기분일지까지는 안 세워요."),dialogue("주인공","그건 세우면 잘 안 맞더라고요."),dialogue("아라","많이 세워 보셨어요?"),dialogue("주인공","최근에 좀요."),narration("아라는 이유를 캐묻지 않는다. 그녀에게는 주인공의 옛 사진도 아팠던 날의 얼굴도 없다."),narration("이 편함이 아라 때문인지, 설명하지 않은 자기 사정 때문인지는 아직 구별하기 어렵다.")],
    solo:[narration("주인공은 하은에게 사진을 보내려다 잠깐 미룬다. 아직 누구의 반응도 오지 않은 사진을 자기 것처럼 조금 더 보고 싶다."),narration("그 마음이 나쁜 것은 아니다. 누가 무슨 기분이냐고 묻지 않는 시간도 필요했다.")] }},
  {number:17,title:"먼저 보내는 점심",choiceNumber:8,steps:[narration("점심때가 조금 지났다. 주인공은 하은에게 먼저 메시지를 쓴다."),message("주인공","점심 챙길게. 먼저 말했어."),message("하은","잘했어. 나도 이제 먹으려고."),narration("하은이 묻기 전에 보고해야 하는 규칙이 아니라 어젯밤 농담이 이어진 것이다.")],routeBranches:{
    ara:[dialogue("아라","저도 뭐 좀 먹고 가야겠네요."),narration("아라는 자기 길 쪽을 가리킨다. 가까운 프로틴 카페에서 간단히 쉬며 마실 수 있을 것 같다.")],
    solo:[narration("주인공은 간단히 먹고 귀가하거나 사진을 정리한다. 아라에게 하지 않은 제안이 새로 생기지는 않는다.")]},branches:{
    day13_brief_drink:[dialogue("주인공","저도 가까운 데서 마실 것 하나만 하고 가려고요."),narration("아라의 일정이 맞으면 프로틴 카페에 잠깐 들르고, 시간이 없으면 각자 간다. 긴 점심 약속은 아니다.")],
    day13_end_conversation:[dialogue("주인공","오늘 이야기 재밌었어요. 저는 이제 갈게요."),narration("둘은 여기서 인사하고 각자 길로 간다.")],
    day13_ask_photo_contact:[dialogue("주인공","다음에 사진 보면서 또 얘기할 수 있을까요?"),dialogue("아라","가끔 사진 보내는 정도면 좋아요. 바로 답은 못 할 때가 많아요."),narration("주인공은 자신이 원하는 다음이 그 정도인지 생각한다.")]}},
  {number:18,title:"연인이 있는 사람",choiceNumber:9,routeBranches:{
    ara:[stage("프로틴 카페 / 또는 헤어지기 전 길"),narration("아라는 휴대폰을 보지 않는다. 주인공이 하은의 답장을 보고 웃는 모습만 본다."),dialogue("아라","좋은 소식이에요?")],
    solo:[narration("주인공은 하은의 답장에 웃고 자기 식사를 챙긴다. 듣지 않은 사람에게 연애 상태가 전달됐다고 기록하지 않는다.")]},branches:{
    day13_name_girlfriend:[dialogue("주인공","여자친구예요. 점심 챙긴다고 먼저 말했어요."),dialogue("아라","아, 그러셨구나. 사진 좋아해요?"),dialogue("주인공","제가 찍은 건 아직 많이 못 봤어요."),dialogue("아라","그럼 오늘 본 거 보내 주면 되겠네요."),narration("이름을 말하고 나니 누군가와 관계를 이어 가는 사람이라는 사실도 이 자리에 놓인다.")],
    day13_name_close_person:[dialogue("주인공","가까운 사람이요. 오늘은 각자 보내고 있어요."),dialogue("아라","각자 시간도 좋죠."),narration("틀린 말은 아니지만 여자친구라고 말하지 않은 이유는 스스로 남는다.")],
    day13_minimize_message:[dialogue("주인공","아니요. 별거 아니에요."),narration("아라는 다른 이야기로 넘어간다. 평범한 인사를 작게 만들고 싶었던 마음은 평범하지 않을 수 있다.")]}},
  {number:19,title:"보내도 되는 사진",choiceNumber:10,routeBranches:{
    ara:[narration("아라는 주인공 사진을 다시 확인한다. 찍지 않았다면 약속한 나무 사진만 보여 준다."),dialogue("아라","이건 보내 드릴까요?")],
    solo:[narration("주인공은 오늘 사진을 하은에게만 보낼지 자신의 앨범에만 둘지 생각한다. 지나가던 사람의 얼굴이 크게 나온 사진은 남에게 보내지 않는다.")]},branches:{
    day13_receive_photo_only:[dialogue("주인공","네. 사진만 받아도 좋겠어요."),narration("두 사람은 보내기로 한 사진 한 장을 전송할 방법만 정한다."),dialogue("아라","다른 데 올리는 건 제가 안 할게요."),dialogue("주인공","고마워요."),narration("사진을 받는 것과 공개할 권한을 얻는 것은 다르다.")],
    day13_exchange_photos:[dialogue("주인공","서로 가끔 찍은 것 보여 줘요."),dialogue("아라","제가 답이 늦어도 사진이 별로라는 뜻은 아니에요."),dialogue("주인공","얼마나 늦는데요?"),dialogue("아라","그건 저도 답하기 어렵네요."),narration("촬영 때 못 보거나 답하려다 놓칠 수 있다는 아라와, 기다리면 다시 보는 주인공의 방식은 처음부터 완전히 맞지 않는다."),dialogue("주인공","일단 사진 한 장부터 보죠."),dialogue("아라","좋아요. 아직 한 장도 안 보냈는데 미래가 너무 길어졌네요."),dialogue("아라","다른 데 올리는 건 제가 안 할게요.")],
    day13_no_contact:[dialogue("주인공","오늘 본 걸로 괜찮아요. 고마웠어요."),narration("연락처를 나누지 않고 현재 화면으로 본 사진만 남긴다. 공개 게시 동의도 생기지 않는다.")]},soloBranches:{
    day13_receive_photo_only:[narration("주인공은 실제 남긴 한 장을 하은에게만 보낼 후보로 고른다. 아라의 사진이나 연락처는 생기지 않는다.")],
    day13_exchange_photos:[narration("주인공은 마음에 든 사진을 앨범에 남기고 하은에게 보여 줄 후보도 따로 둔다. 아라와의 교류 약속은 생기지 않는다.")],
    day13_no_contact:[narration("주인공은 한 장을 자기 앨범에만 둔다. 모두 정리할 때까지 오늘을 끝낼 필요는 없다.")]}},
  {number:20,title:"먼저 가는 아라",routeBranches:{
    farewell:[narration("아라는 카메라를 가방에 넣는다."),dialogue("아라","저는 이쪽이에요."),dialogue("주인공","저는 반대네요."),dialogue("아라","그럼 여기서."),narration("둘은 오늘이 여기까지임을 알아듣고 서로 다른 길로 간다. 나눈 말보다 많은 약속을 혼자 만들지 않는다.")],
    alreadyLeft:[stage("나의 방 / 오후"),narration("주인공은 이미 집에서 물을 마신다. 연락처를 나누지 않았다면 아라의 메시지도 없다. 이미 한 인사를 다시 만들지 않는다.")],
    noAra:[narration("주인공은 동네에서 돌아오거나 창가를 정리한다. 사진은 몇 장 생겼고 특별한 만남은 없었다. 그것도 자신이 고른 오후였다.")] }},
  {number:21,title:"어떤 사진을 보낼까",choiceNumber:11,steps:[message("하은","좋은 거 봤어?"),narration("주인공은 오늘 실제 남긴 사진을 넘긴다.")],branches:{
    day13_send_favorite_photo:[message("주인공","이게 제일 마음에 들어. 왜 찍었는지는 만나서 말해 줄게."),message("하은","난 저 그림자 먼저 보였어."),message("주인공","난 빛이었는데."),message("하은","그럼 둘 다 있네."),narration("다른 사진을 보냈다면 둘은 실제 화면에 보이는 부분만 이야기한다. 하은은 말하지 않은 촬영 상대를 알아맞히지 않는다.")],
    day13_tell_ara_meeting:[message("주인공","사진 찍다가 사람을 만났어. 아라라는 분."),message("하은","사진 찍는 분이야?"),narration("주인공은 여행 사진가이고 잠깐 이야기를 나눴다고 설명한다. 실제 연락처를 나눴을 때만 그 사실도 말한다."),narration("하은은 어떤 사람이었는지 묻는다. 그 질문이 곧 비난은 아니다.")],
    day13_report_rest:[message("주인공","오늘은 혼자 좀 잘 쉬었어."),narration("실제로 혼자였거나 짧게 인사한 뒤 대부분 혼자 보낸 날에는 오늘을 사실대로 설명한다."),narration("오래 함께했고 교류를 약속한 일을 없던 것처럼 말하려 했다면 주인공은 자기 말의 빈자리를 안다.")]},soloBranches:{
    day13_send_favorite_photo:[message("주인공","이게 제일 마음에 들어. 왜 찍었는지는 만나서 말해 줄게."),message("하은","난 저 그림자 먼저 보였어."),message("주인공","난 빛이었는데."),message("하은","그럼 둘 다 있네.")],
    day13_tell_ara_meeting:[message("주인공","오늘 사진 찍는 게 생각보다 재밌더라."),message("하은","어떤 걸 봤는데?"),narration("만나지 않은 아라의 이름·사진·연락처는 만들지 않는다.")],
    day13_report_rest:[message("주인공","오늘은 혼자 좀 잘 쉬었어."),message("하은","잘됐네."),narration("오늘의 대부분을 사실대로 말한다.")]}},
  {number:22,title:"가벼웠던 이유",choiceNumber:12,routeBranches:{
    toldAra:[dialogue("주인공","내가 어떤 사람이었는지 모르니까 좀 편했어."),dialogue("하은","그건 그럴 것 같아."),dialogue("주인공","네가 불편하다는 뜻은 아니야."),dialogue("하은","그렇게 바로 말 안 해도 돼."),dialogue("하은","나는 네 예전 모습을 안다는 게 좋을 때도 있고, 그게 너한테 무거울 때도 있겠지.")],
    noAra:[dialogue("주인공","아무한테도 설명 안 하고 찍으니까 편하더라."),dialogue("하은","그럼 나한테도 다 설명하지 마."),dialogue("주인공","좋아. 그럼 이 사진은 그냥 네가 보고 싶은 대로 봐."),dialogue("하은","그래도 왜 찍었는지 듣고 싶긴 해."),narration("설명하지 않아도 되는 것과 서로 듣고 싶은 것은 함께 있을 수 있었다.")],
    notTold:[narration("하은은 주인공이 실제로 보낸 사진과 말한 하루에만 반응한다. 숨긴 연락처나 대화를 자동으로 알아맞히지 않는다."),narration("주인공은 설명을 미룬 것과 확정적인 안심을 거짓으로 준 것이 같은지 스스로 살핀다.")]},branches:{
    day13_comfort_no_full_explanation:[dialogue("주인공","처음부터 다 설명하지 않아도 돼서 좋았어."),dialogue("하은","나한테 말하는 너랑, 그 사람한테 말하는 네가 너무 다르지는 않았으면 해."),narration("하은은 새 사람을 만나지 말라고 하지 않는다.")],
    day13_admit_personal_interest:[dialogue("주인공","그 사람이 조금 궁금해졌어. 그건 솔직히 말하고 싶어."),dialogue("하은","알겠어. 나도 내 마음을 정리할 시간이 조금 필요해."),narration("그 궁금함은 아직 우정인지 연애 감정인지 확정되지 않는다.")],
    day13_call_passing_meeting:[dialogue("주인공","그냥 스쳐 간 만남이야."),narration("짧게 끝난 만남이라면 억지로 더 설명하지 않는다. 계속 연락하고 싶은 실제 선택과 다르다면 주인공은 그 차이를 안다."),dialogue("하은","나한테 말하는 너랑, 그 사람한테 말하는 네가 너무 다르지는 않았으면 해.")]}},
  {number:23,title:"내 쪽으로 보내 준 풍경",routeBranches:{
    comfortable:[message("하은","나는 오늘 여기."),narration("하은이 책상 한쪽과 작은 메모, 빈 컵 사진을 보낸다."),message("주인공","여기도 빛 좋네."),message("하은","컵 씻기 전에 찍었어."),message("주인공","그래도 좋다."),narration("조금 뒤 전화가 온다."),dialogue("하은","사진만 보고도 할 말이 많네."),dialogue("주인공","네가 거기 앉아 있었다는 게 보여서."),dialogue("하은","그럼 내가 안 나와도 내 사진이야?"),dialogue("주인공","내가 받은 건 그렇네."),narration("컵 옆 메모는 작아서 읽히지 않지만 확대해 보고 싶지는 않다."),dialogue("하은","다음에는 같이 찍자."),dialogue("주인공","얼굴?"),dialogue("하은","그건 그때 정하고."),dialogue("주인공","좋아."),dialogue("하은","응. 듣고 있었어.")],
    needsSpace:[message("하은","오늘 얘기는 들었어. 나도 조금 생각해 볼게."),narration("주인공은 사진을 여러 장 더 보내 분위기를 바꾸려 하지 않는다.")],
    solo:[message("하은","잘 쉬었으면 됐어. 나도 이제 쉬려고."),narration("주인공은 짧게 인사한다.")]},endingBranches:{
    invited:[message("하은","내일은 꽃 좀 보려고. 책상에 하나 두고 싶어서."),message("하은","플로라 카페 쪽에 잠깐 들를까 해."),narration("주인공은 선물을 고르기 전에 하은이 어떤 꽃을 보고 싶은지 궁금해한다.")],
    notInvited:[message("하은","내일은 꽃 좀 보려고. 책상에 하나 두고 싶어서."),narration("마음을 정리 중인 날에는 함께 오라는 초대가 붙지 않는다. 꽃은 하은이 자기 책상에 둘 계획이다.")]}},
  {number:24,title:"오늘의 얼굴",routeBranches:{
    face:[stage("나의 방 / 밤"),narration("주인공은 오늘 실제 찍힌 자기 얼굴을 다시 본다. 과거를 아는 사람이 골라 준 표정은 아니지만 지금의 자기 얼굴이다.")],
    scenery:[stage("나의 방 / 밤"),narration("주인공은 빈 길이나 창가의 물컵 사진을 본다. 그 길과 컵을 바라본 사람이 자신이라는 건 안다.")]},contactBranches:{
    contact:[narration("사진을 전송받은 대화방이 하나 생겼다. 오늘 한 번 받기로 했는지 다음에도 가끔 나누기로 했는지 주인공은 구별한다.")],
    none:[narration("아라와 연락처를 나누지 않은 경로에는 새로운 대화방이 생기지 않는다.")]},steps:[narration("하은의 대화방도 그대로 있다. 새 사람에게 설명하지 않은 과거가 있어도 지금 맺고 있는 관계까지 없는 사람이 되는 것은 아니다."),narration("그 사실이 조금 무겁고 조금 든든하다. 기억이 회복된 것은 아니어도 오늘 자기가 본 것은 조금 더 남기고 싶다."),narration("주인공은 휴대폰을 내려놓는다."),stage("DAY 13 END")]}
];

const CHOICE_LABELS=new Map(DAY13_V3_CHOICES.slice(5).flatMap(choice=>choice.options.map(option=>[option.id,option.label])));
export const DAY13_V3_PLAYABLE_SCRIPT_13_24=Object.freeze(scenes.map(scene=>Object.freeze({
  ...scene,id:`D13V3_S${String(scene.number).padStart(2,"0")}`,
  steps:freezeSteps(scene.steps??[]),
  branches:Object.freeze(Object.entries(scene.branches??{}).map(([key,steps])=>Object.freeze({key,label:CHOICE_LABELS.get(key)??key,steps:freezeSteps(steps)}))),
  soloBranches:Object.freeze(Object.entries(scene.soloBranches??{}).map(([key,steps])=>Object.freeze({key,label:CHOICE_LABELS.get(key)??key,steps:freezeSteps(steps)}))),
  routeBranches:Object.freeze(Object.entries(scene.routeBranches??{}).map(([key,steps])=>Object.freeze({key,steps:freezeSteps(steps)}))),
  endingBranches:Object.freeze(Object.entries(scene.endingBranches??{}).map(([key,steps])=>Object.freeze({key,steps:freezeSteps(steps)}))),
  contactBranches:Object.freeze(Object.entries(scene.contactBranches??{}).map(([key,steps])=>Object.freeze({key,steps:freezeSteps(steps)})))
})));

const flagsOf=state=>state?.storyFlags??{};
const routeOf=flags=>flags.day13V3OutingRoute??(flags.day13V3Choice1==="day13_go_seoul_forest"?"SEOUL_FOREST":flags.day13V3Choice1==="day13_walk_neighborhood"?"NEIGHBORHOOD":"HOME");
const araMet=flags=>flags.day13V3AraMet??routeOf(flags)==="SEOUL_FOREST";
const earlyExit=flags=>flags.day13V3AraEarlyExit??flags.day13V3Choice5==="day13_leave_now";
const araContinuationEligible=flags=>araMet(flags)&&!earlyExit(flags);
const physicallyPresent=flags=>flags.day13V3AraPhysicallyPresent??(araContinuationEligible(flags)&&flags.day13V3Choice8!=="day13_end_conversation");
const portraitExists=flags=>(flags.day13V3PortraitExists??flags.day13V3Choice6!=="day13_stay_photographer");
const hasContact=flags=>araMet(flags)&&["day13_receive_photo_only","day13_exchange_photos"].includes(flags.day13V3Choice10);
const extendedRoute=flags=>physicallyPresent(flags)&&(["day13_ask_photo_contact"].includes(flags.day13V3Choice8)||flags.day13V3Choice10==="day13_exchange_photos");
const disclosureMismatch=flags=>flags.day13V3HaeunDisclosureMismatch??((flags.day13V3Choice12==="day13_call_passing_meeting"&&extendedRoute(flags))||(flags.day13V3Choice11==="day13_report_rest"&&extendedRoute(flags)));
const needsSpace=flags=>flags.day13V3HaeunNeedsSpace??flags.day13V3Choice12==="day13_admit_personal_interest";

function routeKey(scene,flags){
  const met=araMet(flags),present=physicallyPresent(flags),portrait=portraitExists(flags);
  if(scene.number===13||scene.number===15||scene.number===16)return met&&!earlyExit(flags)?"ara":"solo";
  if(scene.number===14)return met&&!earlyExit(flags)?portrait?"araPortrait":"araDecline":portrait?"soloPortrait":"soloNoFace";
  if(scene.number===17)return araContinuationEligible(flags)?"ara":"solo";
  if(scene.number===18||scene.number===19)return present?"ara":"solo";
  if(scene.number===20)return present?"farewell":met?"alreadyLeft":"noAra";
  if(scene.number===22)return !met?"noAra":flags.day13V3Choice11==="day13_tell_ara_meeting"?"toldAra":"notTold";
  if(scene.number===23)return !met?"solo":needsSpace(flags)||disclosureMismatch(flags)?"needsSpace":"comfortable";
  if(scene.number===24)return portrait?"face":"scenery";
  return null;
}

function choiceIsAvailable(scene,flags){
  if(scene.choiceNumber===8)return araContinuationEligible(flags);
  if(scene.choiceNumber===9)return physicallyPresent(flags);
  if(scene.choiceNumber===12)return araMet(flags)&&flags.day13V3Choice11==="day13_tell_ara_meeting";
  return true;
}

export function getDay13V3PlayableScene13To24(state,sceneNumber){
  const scene=DAY13_V3_PLAYABLE_SCRIPT_13_24.find(item=>item.number===sceneNumber);
  if(!scene)throw new Error(`UNKNOWN_DAY13_V3_SCENE_${sceneNumber}`);
  const flags=flagsOf(state),met=araMet(flags),steps=[],selected=[];
  const routeKeyValue=routeKey(scene,flags),routeBranch=scene.routeBranches.find(branch=>branch.key===routeKeyValue);
  if(routeBranch){selected.push(routeKeyValue);steps.push(...routeBranch.steps);}
  steps.push(...scene.steps);
  const choiceAvailable=scene.choiceNumber&&choiceIsAvailable(scene,flags);
  if(choiceAvailable){
    steps.push(Object.freeze({type:"choiceCue",choiceNumber:scene.choiceNumber}));
    const choiceId=flags[`day13V3Choice${scene.choiceNumber}`];
    const source=!met&&scene.soloBranches.length?scene.soloBranches:scene.branches;
    const branch=source.find(item=>item.key===choiceId);
    if(branch){selected.push(choiceId);steps.push(...branch.steps);}
  }
  if(scene.number===23){
    const endingKey=routeKeyValue==="comfortable"?"invited":"notInvited";
    const ending=scene.endingBranches.find(branch=>branch.key===endingKey);
    selected.push(endingKey);steps.push(...ending.steps);
  }
  if(scene.number===24){
    const contactKey=hasContact(flags)?"contact":"none";
    const contact=scene.contactBranches.find(branch=>branch.key===contactKey);
    selected.push(contactKey);steps.push(...contact.steps);
  }
  const availableChoiceOptions=scene.choiceNumber===11&&!met
    ?Object.freeze(DAY13_V3_CHOICES[10].options.filter(option=>option.id!=="day13_tell_ara_meeting").map(option=>option.id))
    :Object.freeze(scene.choiceNumber?DAY13_V3_CHOICES[scene.choiceNumber-1].options.map(option=>option.id):[]);
  return Object.freeze({...scene,omitted:false,choiceAvailable:Boolean(choiceAvailable),availableChoiceOptions,selectedBranches:Object.freeze(selected),steps:Object.freeze(steps)});
}

export function validateDay13V3PlayableScript13To24(){
  const expectedChoiceIds=DAY13_V3_CHOICES.slice(5).flatMap(choice=>choice.options.map(option=>option.id));
  const branchKeys=new Set(DAY13_V3_PLAYABLE_SCRIPT_13_24.flatMap(scene=>[...scene.branches,...scene.soloBranches].map(branch=>branch.key)));
  return DAY13_V3_PLAYABLE_SCRIPT_13_24.length===12&&DAY13_V3_PLAYABLE_SCRIPT_13_24.every((scene,index)=>scene.number===index+13)&&expectedChoiceIds.every(id=>branchKeys.has(id));
}

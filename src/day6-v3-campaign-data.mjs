export const DAY6_V3_VERSION=3;
export const DAY6_V3_SCENE_ID="m30-day6-neighborhood";

export const DAY6_V3_CHAPTER_CONTRACT=Object.freeze({
  title:"처음 가는 길",day:6,window:"10:20-21:40",chapterType:"present-day-first-date",
  prerequisites:["day5RuntimeComplete","day6-life-restart"],
  locations:["home","small-cafe","gimbap-village","dongsu-station","yeonhui-station","vinyl-store","memory-park"],
  participants:["protagonist","haeun","cafe-staff","gimbap-owner","record-store-staff"],
  dramaticPurpose:"과거 데이트 재현을 포기하고 현재의 두 사람이 고른 첫 데이트를 만든다.",
  emotionalCurve:["기대와 불안","과거 재현 강박","서운함 폭발","상호 불안 인정","현재 취향의 작은 실패","동등한 첫 경험","동의 기반 친밀감","다음 약속과 사진 훅"],
  targetPlaytimeMinutes:[25,35],
  mustReveal:["하은도 과거가 달라질까 두려웠다","현재의 서로를 알고 싶다는 합의","오늘의 사진과 새 앨범"],
  mayReveal:["관계와 경계가 허용할 때의 상호 손잡기","윤서진이 사진을 찾았다는 사실"],
  mustNotReveal:["사진의 내용","사고의 정답","가짜 하은 진실","새 인물의 정체"],
  followUpHooks:["day7-date-candidates","day7-song-card","seojin-photo-found-unopened"]
});

export const DAY6_V3_VOICE_PROFILES=Object.freeze({
  protagonist:{rhythm:"짧은 관찰 뒤 확인 질문, 판단 뒤 행동",humor:"실패를 함께 웃을 수 있는 건조한 받아치기",emotionalExpression:"추측을 사실처럼 말하지 않고 두려움도 구체 행동 뒤에 인정"},
  haeun:{rhythm:"생활적인 짧은 문장과 장난, 감정이 깊어지면 말끝과 침묵",humor:"따뜻한 놀림과 자기 실수 인정",emotionalExpression:"서운함을 직접 말하되 상대를 심문하거나 시험하지 않음"}
});

export const DAY6_V3_KNOWLEDGE_LEDGER=Object.freeze({
  protagonist:{KNOWS:["기억이 없고 과거 사진이 있다","하은이 과거 취향을 기억한다"],BELIEVES:["과거를 재현하면 하은이 알던 자신에 가까워질 수 있다"],SUSPECTS:["현재 취향은 과거와 다를 수 있다"],DOES_NOT_KNOW:["윤서진이 찾은 사진 내용"],HIDES:[],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["하은에게 낯선 사람이 되지 않기"],FEARS:["자신이 텅 빈 사람이라는 감각"]},
  haeun:{KNOWS:["과거 데이트 장소와 취향","자신도 과거를 붙잡고 있다"],BELIEVES:["익숙한 코스가 둘을 안심시킬 수 있다"],SUSPECTS:["재현이 현재의 주인공을 지우고 있다"],DOES_NOT_KNOW:["현재 주인공이 무엇을 좋아하게 될지"],HIDES:[],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["과거 흉내가 아닌 현재의 그와 데이트하기"],FEARS:["모든 취향이 달라지면 자신도 달라질 가능성"]}
});

const scene=(number,act,title,location,job)=>Object.freeze({id:`D6V3_S${String(number).padStart(2,"0")}`,number,act,title,location,job});
export const DAY6_V3_SCENES=Object.freeze([
  scene(1,1,"데이트라는 단어","home","초대에 대한 현재 태도 선택"),scene(2,1,"거울 속의 남자","home","과거 의상과 현재 취향 충돌"),scene(3,1,"사진과 같은 자리","small-cafe","과거 자리 재현 시작"),scene(4,1,"내가 마시던 것","small-cafe","음료로 현재 취향 확인"),scene(5,1,"창가 두 번째 자리","small-cafe","과거 구도 고정"),scene(6,1,"질문이 된 대화","small-cafe","데이트가 기억 시험으로 변질"),scene(7,1,"같은 사진","small-cafe","사진 재현과 하은 이탈"),
  scene(8,2,"더는 대답하지 않는 하은","small-cafe-outside","재현 강박의 이유 확인"),scene(9,2,"하나도 안 반가웠어","small-cafe-outside","하은의 서운함과 두려움 발화"),scene(10,2,"오늘을 망쳤다는 말","small-cafe-outside","사과·두려움·재출발 전략"),
  scene(11,3,"계획표를 접다","street","과거 코스를 버림"),scene(12,3,"김밥 한 줄의 참사","gimbap-village","현재 취향의 실패를 함께 웃음"),scene(13,3,"동전이 정한 방향","transit","공동 지도와 길 찾기"),scene(14,3,"오후의 레코드","vinyl-store","둘 다 처음인 장소 진입"),scene(15,3,"노래가 끝난 뒤","vinyl-store","음악 선택과 관계별 거리"),
  scene(16,4,"오늘의 첫 사진","vinyl-store","현재의 두 사람이 고른 사진"),scene(17,4,"기억의 공원으로","street","새 장소를 함께 찾음"),scene(18,4,"카드에 남길 말","memory-park","현재 취향을 상대에게 기록"),scene(19,4,"실패의 콜백","memory-park","점심 실패를 둘만의 기억으로 전환"),scene(20,4,"손을 내미는 방식","memory-park","관계·경계·동의 기반 손 선택"),
  scene(21,5,"돌아가는 길의 질문","transit","과거의 나 대신 하은을 질문"),scene(22,5,"집 앞의 판정","home-outside","하루 이름과 관계별 작별"),scene(23,5,"과거 사진 옆에 두지 않는 사진","home","새 앨범·DAY7 후보·윤서진 훅")
]);

const choice=(number,key,prompt,options,saveKey)=>Object.freeze({number,key,prompt,saveKey,options:Object.freeze(options.map(([id,label])=>Object.freeze({id,label})))});
export const DAY6_V3_CHOICES=Object.freeze([
  choice(1,"invitation","하은의 초대",[["date-call-it-date","데이트로 하자."],["date-name-later","일단 만나. 이름은 끝나고 정하자."],["date-admit-uncertainty","내가 잘할 수 있을지는 모르겠어."]],"day6V3InvitationChoice"),
  choice(2,"outfit","오늘 입을 옷",[["outfit-past-black","사진 속 옷과 비슷하게 입는다."],["outfit-current-bright","지금 마음에 드는 밝은 셔츠를 입는다."],["outfit-ask-haeun","하은에게 두 장을 보내 골라 달라고 한다."]],"day6V3OutfitChoice"),
  choice(3,"drink","첫 주문",[["drink-past-americano","예전에 마시던 아메리카노를 주문한다."],["drink-current-choice","메뉴판에서 지금 당기는 음료를 고른다."],["drink-match-haeun","너는 뭘 마셨는데? 하고 같은 것을 주문한다."]],"day6V3DrinkChoice"),
  choice(4,"cafe-photo","사진을 찍는 이유",[["photo-compare-past","같은 사진을 찍으면 비교할 수 있으니까."],["photo-haeun-place","아니. 오늘 네가 앉고 싶은 데서 찍자."],["photo-lower-camera","카메라를 내리고 싫으면 안 찍어도 돼.라고 한다."]],"day6V3CafePhotoChoice"),
  choice(5,"repair","하은에게 건네는 말",[["repair-see-haeun","미안해. 네가 아니라 사진만 봤네."],["repair-share-fear","나도 내가 텅 빈 것 같아서 겁났어."],["repair-restart-now","그럼 여기서부터 다르게 해 보자."]],"day6V3RepairChoice"),
  choice(6,"lunch","계획 밖의 점심",[["lunch-spicy","저 떡볶이, 매워도 먹어 보고 싶다."],["lunch-share-bites","다른 거 시켜서 한입씩 바꿔 먹자."],["lunch-carrot-gimbap","김밥 먹고 싶어. 속은 안 빼고."]],"day6V3LunchChoice"),
  choice(7,"music","서로에게 한 곡",[["music-title-only","내가 제목만 보고 골라 줄게."],["music-haeun-pick","네가 고른 거, 같이 듣고 싶어."],["music-swap-reasons-later","한 곡씩 고르고 이유는 나중에 말하자."]],"day6V3MusicChoice"),
  choice(8,"current-photo","오늘의 첫 사진",[["current-photo-formal","이번엔 제대로 웃어 볼게."],["current-photo-funny","사진은 연출이라며."],["current-photo-candid","각자 하고 싶은 표정으로 찍자."]],"day6V3CurrentPhotoChoice"),
  choice(9,"card","카드에 남길 말",[["card-tease","김밥 앞에서 제일 많이 웃는 사람."],["card-shared-time","계획이 망가진 뒤에 더 많이 웃는 사람."],["card-current-taste","내가 지금 좋아하는 걸 알고 싶어 하는 사람."]],"day6V3CardChoice"),
  choice(10,"hand","손을 내미는 방식",[["hand-offer","손을 내민다."],["hand-ask","손 잡아도 되는지 묻고 기다린다."],["hand-keep-walking","조금 더 나란히 걷는다."]],"day6V3HandChoice"),
  choice(11,"day-name","오늘의 이름",[["name-first-date","우리의 첫 데이트."],["name-restarted-date","망했다가 다시 시작한 데이트."],["name-next-day","다음이 생긴 날."]],"day6V3DayNameChoice")
]);

export const DAY6_V3_SAVE_KEYS=Object.freeze([...DAY6_V3_CHOICES.map(item=>item.saveKey),"day6V3SceneCheckpoint","day6V3CafePhotoTaken","day6V3CurrentPhotoVariant","day6V3HandContactEstablished","day6V3RelationshipBand","day6V3Complete"]);

export function validateDay6V3CampaignData(){
  const sceneIds=new Set(DAY6_V3_SCENES.map(item=>item.id));
  const choiceIds=DAY6_V3_CHOICES.flatMap(item=>item.options.map(option=>option.id));
  return DAY6_V3_SCENES.length===23&&sceneIds.size===23&&DAY6_V3_SCENES.every((item,index)=>item.number===index+1)&&DAY6_V3_CHOICES.length===11&&DAY6_V3_CHOICES.every(item=>item.options.length===3)&&new Set(choiceIds).size===33&&DAY6_V3_CHAPTER_CONTRACT.mustNotReveal.includes("가짜 하은 진실")&&DAY6_V3_SAVE_KEYS.length===17;
}

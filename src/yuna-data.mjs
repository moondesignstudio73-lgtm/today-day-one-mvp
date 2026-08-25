export const YUNA_PROFILE={
  id:"yuna",name:"한유나",age:18,ageCategory:"high-school-senior",job:"고등학교 3학년",height:158,bodyType:"학생다운 아담한 체형",archetype:"풋풋한 첫사랑형",
  bio:"고등학교 3학년 · 낯을 조금 가리지만 친해지면 장난과 이야기가 끊이지 않는 밝은 학생",
  personality:{contactImportance:76,jealousy:58,materialism:14,romanticism:88,independence:48,marriageDesire:8,economicPreference:18,vanity:38,loyalty:86,opportunism:10,emotionalSensitivity:82,giftPreference:70,socialPreference:66},
  hiddenTrait:"좋아하는 마음을 숨기려 할수록 표정과 메시지 말투에 더 선명하게 드러난다.",
  preferredDates:["방과 후 카페","분식집","공원 산책","놀이공원","학교 축제"],dislikedActions:["답장 없이 잠수","친구 앞에서 놀리기","시험 기간 약속 강요","술자리 권유"],preferredGifts:["작은 문구","캐릭터 키링","간식","헤어 액세서리"],
  fashionPreferences:{교복:100,스쿨룩:98,캐주얼:90,러블리:86,니트:82,스포티:70,럭셔리:8},
  rivalReaction:"괜찮은 척하지만 말수가 갑자기 줄고 표정에 질투가 그대로 드러난다.",conflictStyle:"메신저 답장이 짧아졌다가 결국 참지 못하고 솔직하게 묻는다.",reconciliationStyle:"작은 간식과 직접 쓴 메모, 방과 후의 솔직한 대화",
  aiVoice:"또래다운 짧고 밝은 반말. 친해질수록 이모티콘과 장난이 늘고, 진지한 순간에는 서툴지만 솔직하다.",palette:"sunny-sky",uiAccent:"#ffca58",studentSafe:true,
  referenceImage:"assets/heroines/yuna/outfits/01.webp",messageVoice:{greeting:"오늘 학교 끝나고 잠깐 볼래? 진짜 잠깐만!",shy:"아니, 그냥 네 생각이 조금 났다고.",close:"잘 자. 내일 답장 늦으면 삐질 거야 ㅋㅋ"},
  excludedEventTags:["office","work-dinner","alcohol","bar","nightlife","marriage","adult-only"]
};

const OUTFITS=[
  ["uniform","기본 교복",1,18000,"교복"],["summer-uniform","하복",3,16000,"스쿨룩"],["cardigan-uniform","가디건 교복",5,26000,"니트"],["hoodie-uniform","후드집업 + 교복",7,32000,"캐주얼"],["after-school","방과 후 캐주얼",9,39000,"캐주얼"],
  ["cute-knit","귀여운 니트 코디",11,45000,"러블리"],["amusement-date","놀이공원 데이트룩",14,52000,"데이트"],["winter-puffer","겨울 패딩 코디",17,59000,"겨울"],["summer-casual","여름 캐주얼",20,38000,"여름"],["festival","학교 축제 특별 코디",23,48000,"축제"]
];

export const YUNA_OUTFITS=OUTFITS.map(([kind,label,day,price,tag],index)=>({
  id:`outfit-yuna-${String(index+1).padStart(2,"0")}`,outfitId:`OUTFIT_YUNA_${kind.toUpperCase().replaceAll("-","_")}_${String(index+1).padStart(3,"0")}`,
  icon:"🎀",name:`한유나 · ${label}`,brand:"School Days Closet",category:"heroine-outfit",heroineId:"yuna",studentSafe:true,price,luxuryLevel:1,
  attractivenessBonus:2+Math.floor(index/3),fashionBonus:3+index,preferenceTags:[tag,"스쿨룩","풋풋함"],styleTags:[tag,"스쿨룩","풋풋함"],rarity:index>=8?"rare":"common",
  unlockConditions:{day,affection:index>=8?620:index>=6?540:0,trust:index===9?560:0},productImage:`assets/heroines/yuna/outfits/${String(index+1).padStart(2,"0")}.webp`,characterWearingImage:`assets/heroines/yuna/outfits/${String(index+1).padStart(2,"0")}.webp`
}));

export const YUNA_GIFT_ITEMS=[
  {id:"yuna-star-hairpin",icon:"⭐",name:"하늘빛 별 헤어핀",brand:"Tiny Day",category:"accessory",price:12000,luxuryLevel:1,attractivenessBonus:2,fashionBonus:3,preferenceTags:["스쿨룩","헤어 액세서리","풋풋함"],heroineIds:["yuna"],studentSafe:true},
  {id:"yuna-study-note",icon:"📒",name:"시험 응원 노트 세트",brand:"Paper Picnic",category:"stationery",price:8500,luxuryLevel:1,attractivenessBonus:0,fashionBonus:1,preferenceTags:["작은 문구","학교","풋풋함"],heroineIds:["yuna"],studentSafe:true},
  {id:"yuna-bag-keyring",icon:"🐣",name:"병아리 가방 키링",brand:"Pocket Friend",category:"accessory",price:15000,luxuryLevel:1,attractivenessBonus:1,fashionBonus:3,preferenceTags:["캐릭터 키링","러블리","풋풋함"],heroineIds:["yuna"],studentSafe:true},
  {id:"yuna-snack-box",icon:"🍪",name:"방과 후 간식 상자",brand:"After School",category:"snack",price:11000,luxuryLevel:1,attractivenessBonus:0,fashionBonus:0,preferenceTags:["간식","학교","풋풋함"],heroineIds:["yuna"],studentSafe:true}
];

export const YUNA_EXPRESSIONS={neutral:"neutral",calm:"neutral",smile:"smile",bigSmile:"big-smile",embarrassed:"embarrassed",pouting:"pouting",surprised:"surprised",sad:"sad",angry:"angry",worried:"worried",crying:"crying",excited:"excited",shy:"shy",tense:"worried"};
export function getYunaExpressionAsset(expression="neutral"){return `assets/heroines/yuna/expressions/${YUNA_EXPRESSIONS[expression]??"neutral"}.webp`;}
const YUNA_OUTFIT_ALIASES={uniform:0,"summer-uniform":1,"cardigan-uniform":2,"hoodie-uniform":3,"after-school":4,"cute-knit":5,"amusement-date":6,"winter-puffer":7,"summer-casual":8,festival:9};
export function getYunaOutfitAsset(alias="uniform"){const index=YUNA_OUTFIT_ALIASES[alias];return Number.isInteger(index)?YUNA_OUTFITS[index].characterWearingImage:null;}

export const YUNA_BACKGROUNDS={
  "yuna-school-front":"assets/backgrounds/yuna/school-front.webp","yuna-school-field":"assets/backgrounds/yuna/school-field.webp","yuna-school-festival":"assets/backgrounds/yuna/school-festival.webp","yuna-classroom":"assets/backgrounds/yuna/classroom.webp","yuna-library":"assets/backgrounds/yuna/library.webp","yuna-academy-district":"assets/backgrounds/yuna/academy-district.webp","yuna-convenience-store":"assets/backgrounds/yuna/convenience-store.webp","yuna-snack-restaurant":"assets/backgrounds/yuna/snack-restaurant.webp","yuna-bus-stop":"assets/backgrounds/yuna/bus-stop.webp","yuna-cafe":"assets/backgrounds/yuna/cafe.webp","yuna-park":"assets/backgrounds/yuna/park.webp","yuna-amusement-park":"assets/backgrounds/yuna/amusement-park.webp","yuna-rainy-street":"assets/backgrounds/yuna/rainy-street.webp","yuna-evening-neighborhood":"assets/backgrounds/yuna/evening-neighborhood.webp"
};

const EVENT_BLUEPRINTS=[
  ["convenience-encounter","편의점에서 우연히 마주침",2,6,"yuna-convenience-store","방과 후 편의점 냉장고 앞에서 유나와 동시에 같은 음료를 집었다.","우연이 조금 민망했지만 둘은 컵라면이 익는 동안 처음으로 길게 이야기했다.","neutral","smile"],
  ["shared-rainy-umbrella","비 오는 날 우산을 함께 씀",4,9,"yuna-rainy-street","갑작스러운 비에 우산이 없던 유나가 학교 처마 아래 서 있었다.","좁은 우산 아래 가까워진 거리가 평소보다 긴 침묵을 만들었다.","worried","embarrassed"],
  ["failed-exam","시험을 망쳤다며 풀이 죽은 유나",6,12,"yuna-library","유나는 모의고사 성적표를 접어 책 사이에 숨겼다.","점수보다 기대에 못 미쳤다는 생각이 유나를 더 힘들게 했다.","sad","smile"],
  ["almost-caught","친구들에게 관계를 들킬 뻔함",8,15,"yuna-school-front","교문 앞에서 이야기를 나누던 순간 유나의 친구들이 다가왔다.","유나는 아무 사이도 아니라고 말했지만 얼굴은 금세 빨개졌다.","surprised","shy"],
  ["festival-invitation","학교 축제에 놀러 오라고 연락함",11,18,"yuna-school-festival","유나가 며칠 동안 고쳐 쓴 축제 초대 메시지를 보냈다.","사람이 많은 축제에서도 유나는 계속 한 사람만 찾고 있었다.","excited","bigSmile"],
  ["amusement-park-date","놀이공원에 가는 날",14,21,"yuna-amusement-park","첫 정식 데이트를 앞두고 유나는 약속 시간보다 삼십 분 먼저 도착했다.","놀이기구보다 손을 잡을지 말지가 둘에게 더 큰 사건이었다.","excited","embarrassed"],
  ["classmate-confession","다른 남학생에게 고백받았다는 이야기",17,23,"yuna-classroom","하교 직전 같은 반 남학생이 유나에게 마음을 고백했다.","유나는 대답을 미룬 채 가장 먼저 이 사실을 털어놓았다.","worried","shy"],
  ["career-talk","진로 문제로 처음 진지한 대화를 나눔",20,26,"yuna-academy-district","학원 상담 뒤 유나는 자신이 정말 원하는 진로를 모르겠다고 말했다.","처음으로 장난 없는 목소리로 두려움과 기대를 함께 꺼냈다.","worried","smile"],
  ["quiet-misunderstanding","사소한 오해로 연락이 줄어듦",23,28,"yuna-bus-stop","짧게 잘린 메시지 하나가 서로 다른 뜻으로 읽혔다.","유나는 괜찮다고 했지만 며칠째 먼저 연락하지 않았다.","pouting","sad"],
  ["honest-heart","DAY 후반부 자신의 솔직한 마음을 이야기함",27,30,"yuna-evening-neighborhood","저녁 주택가에서 유나는 몇 번이나 멈췄다가 다시 걸었다.","끝내 유나는 숨기지 못했던 첫사랑의 마음을 자기 말로 전했다.","shy","crying"]
];

const SCENE_BACKGROUNDS=[
  ["yuna-convenience-store","yuna-snack-restaurant","yuna-evening-neighborhood"],["yuna-school-front","yuna-rainy-street","yuna-bus-stop"],["yuna-classroom","yuna-library","yuna-cafe"],["yuna-school-front","yuna-school-field","yuna-cafe"],["yuna-classroom","yuna-school-festival","yuna-evening-neighborhood"],
  ["yuna-bus-stop","yuna-amusement-park","yuna-cafe"],["yuna-classroom","yuna-school-field","yuna-park"],["yuna-academy-district","yuna-library","yuna-evening-neighborhood"],["yuna-bus-stop","yuna-cafe","yuna-park"],["yuna-school-front","yuna-park","yuna-evening-neighborhood"]
];

function dialogueTurns(title,hook,reveal,sceneIndex,startExpression,endExpression){
  const stages=["뜻밖의 만남","조금 깊어진 대화","마음에 남은 약속"];
  return [
    {type:"narration",speaker:"내레이션",text:`${stages[sceneIndex]}. ${sceneIndex===0?hook:sceneIndex===1?reveal:`${title}의 여운이 쉽게 사라지지 않았다.`}`},
    {type:"dialogue",speaker:"한유나",text:sceneIndex===0?"어? 너도 여기 있었어? 나 진짜 우연히 온 거야.":sceneIndex===1?"나 사실 아까부터 할 말 있었는데, 웃으면 안 돼.":"오늘 이야기한 거… 내일 모른 척하면 안 된다?",expressionId:startExpression},
    {type:"dialogue",speaker:"플레이어",text:"안 웃을게. 천천히 말해도 괜찮아."},
    {type:"dialogue",speaker:"한유나",text:sceneIndex===0?"그렇게 진지하게 말하면 더 긴장되잖아. 평소처럼 해.":sceneIndex===1?"친구들한테는 잘 말하면서 네 앞에서는 자꾸 꼬여.":"나 원래 이렇게 솔직한 애 아닌데, 네 앞에서는 다 티 나나 봐.",expressionId:sceneIndex===1?"shy":endExpression},
    {type:"dialogue",speaker:"플레이어",text:"티가 나도 괜찮아. 네 마음을 함부로 판단하지 않을게."},
    {type:"narration",speaker:"내레이션",text:"유나는 대답 대신 헤어핀을 만지작거리며 잠깐 시선을 피했다."},
    {type:"dialogue",speaker:"한유나",text:"그럼 하나만 약속해. 모르는 게 있으면 혼자 결론 내리지 말고 나한테 물어보기."},
    {type:"dialogue",speaker:"플레이어",text:"약속할게. 너도 속상하면 괜찮은 척만 하지 않기."},
    {type:"dialogue",speaker:"한유나",text:"그건 좀 어려운데… 그래도 해 볼게. 대신 간식 사 줘.",expressionId:endExpression},
    {type:"narration",speaker:"내레이션",text:"작은 농담 뒤에 놓인 진심을 둘 다 알아차렸다."}
  ];
}

function buildYunaEvent([slug,title,startDay,endDay,backgroundId,hook,reveal,startExpression,endExpression],index){
  const id=`yuna-${slug}`,requiredEvents=index?[`yuna-${EVENT_BLUEPRINTS[index-1][0]}`]:[];
  const scenes=SCENE_BACKGROUNDS[index].map((sceneBackground,sceneIndex)=>({id:`${id}-scene-${sceneIndex+1}`,title:["방과 후","솔직한 이야기","다음 날을 향해"][sceneIndex],backgroundId:sceneBackground,characterIds:["girlfriend"],expression:[startExpression,"shy",endExpression][sceneIndex],pose:"standing",animation:sceneIndex===1?"look-away":"soft-sway",outfit:index===5?"amusement-date":index===4?"festival":"uniform",itemIds:[],bgmId:"schoolYouth",sfxId:sceneBackground.includes("rain")?"rain-window":"scene",transition:sceneIndex===0?"fade":"slide",lighting:sceneIndex===2?"sunset":"bright",timeOfDay:sceneIndex===2?"evening":"day",weather:sceneBackground.includes("rain")?"rain":"sunny",dialogueTurns:dialogueTurns(title,hook,reveal,sceneIndex,startExpression,endExpression)}));
  return {id,title,kind:"story",studentSafe:true,heroineIds:["yuna"],category:"school-romance",categoryLabel:"유나 · 첫사랑과 성장",hook,reveal,message:hook,image:{intro:`assets/events/school-romance/${id}-01.png`,result:`assets/events/school-romance/${id}-01.png`,status:"ready"},conditions:[{stat:"day",operator:">=",value:startDay}],probability:.7,priority:120-index, cooldown:0,effects:{affection:4,trust:3,excitement:3},baseWeight:100,dayRange:[startDay,endDay],timeOfDay:index%3===0?"evening":"day",location:backgroundId,tensionLevel:index===6||index===8?"medium":"low",relationshipStates:["DISTANT","HONEYMOON","STABLE","PASSIONATE","SUSPICIOUS","CONFLICT"],npcRequirements:[],requiredMemories:[],requiredEvents,forbiddenFlags:[`${id}:COMPLETED`],repeatable:false,maxTriggerCount:1,eventState:"LOCKED",startMood:startExpression,middleMood:"shy",peakMood:index===8?"sad":"excited",endMood:endExpression,scenes,
    choices:[
      {id:"listen",label:"유나의 말을 끝까지 듣고 마음을 확인한다",effects:{trust:12,affection:8,conflict:-3},flag:`${id}:LISTEN`,memory:`${title}에서 유나의 속도를 존중하며 끝까지 들었다.`,futureEventWeights:{"school-romance":1.25}},
      {id:"playful",label:"부담스럽지 않게 장난으로 긴장을 풀어 준다",effects:{affection:10,excitement:8,trust:3},flag:`${id}:PLAYFUL`,memory:`${title}에서 둘만 아는 장난으로 긴장을 풀었다.`,futureEventWeights:{"school-romance":1.15}},
      {id:"distance",label:"시험과 진로에 집중할 시간을 먼저 존중한다",effects:{trust:8,affection:2,excitement:-2},flag:`${id}:SPACE`,memory:`${title}에서 유나의 학교생활과 선택할 시간을 존중했다.`,futureEventWeights:{growth:1.3}}
    ],storyFlag:`${id}:COMPLETED`,futureEventWeights:{"school-romance":1.2,growth:1.1},cgCandidate:[1,4,5,9].includes(index)?`CG_YUNA_${slug.toUpperCase().replaceAll("-","_")}`:null,chainId:"YUNA_FIRST_LOVE",chainStage:index+1};
}

export const YUNA_STORY_EVENTS=EVENT_BLUEPRINTS.map(buildYunaEvent);

export function isYunaCompatibleEvent(event){return Boolean(event?.studentSafe||event?.heroineIds?.includes("yuna"));}
export function validateYunaContent(){
  const ids=new Set(YUNA_STORY_EVENTS.map(event=>event.id));
  return YUNA_PROFILE.age===18&&YUNA_OUTFITS.length===10&&Object.keys(YUNA_EXPRESSIONS).length>=12&&Object.keys(YUNA_BACKGROUNDS).length===14&&YUNA_STORY_EVENTS.length===10&&ids.size===10&&YUNA_STORY_EVENTS.every((event,index)=>event.scenes.length>=3&&event.scenes.reduce((sum,scene)=>sum+scene.dialogueTurns.length,0)>=30&&event.choices.every(choice=>choice.memory&&choice.flag)&&event.storyFlag&&event.heroineIds.includes("yuna")&&(index===0||event.requiredEvents.length));
}

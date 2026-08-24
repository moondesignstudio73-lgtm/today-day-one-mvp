import { YUNA_OUTFITS, YUNA_PROFILE } from "./yuna-data.mjs";

const outfitKinds = [
  ["casual","기본 캐주얼",1,45000,"캐주얼"], ["office","시그니처 오피스룩",1,78000,"오피스"],
  ["date","데이트 스타일",3,125000,"데이트"], ["home","편안한 홈웨어",1,38000,"홈웨어"],
  ["sport","액티브 웨어",4,69000,"스포티"], ["winter","윈터 코디",8,158000,"겨울"],
  ["summer","서머 코디",6,82000,"여름"], ["dinner","파인 다이닝 룩",12,235000,"엘레강트"],
  ["party","스페셜 파티룩",15,310000,"파티"], ["travel","트래블 룩",10,145000,"여행"]
];

const haeunOutfitKinds = [
  ["soft-minimal","아이보리 소프트 미니멀 룩",1,79000,"미니멀"],
  ["navy-office","네이비 시그니처 오피스 수트",1,229000,"오피스"],
  ["ivory-wrap","아이보리 로맨틱 랩 드레스",3,148000,"데이트"],
  ["weekend-casual","베이지 위크엔드 캐주얼",1,89000,"캐주얼"],
  ["sage-active","세이지 밸런스 액티브 셋업",4,198000,"스포티"],
  ["camel-coat","카멜 클래식 롱 코트",8,198000,"겨울"],
  ["summer-white","화이트 브리즈 서머 셋업",6,198000,"여름"],
  ["black-evening","블랙 이브닝 랩 드레스",12,998000,"엘레강트"],
  ["teal-dress","딥 틸 우아한 미디 드레스",15,1490000,"파티"],
  ["black-mini","블랙 리브드 미니 원피스",10,2200000,"데이트"]
];

export const HEROINE_PROFILES = [
  {
    id:"haeun", name:"하은", age:29, job:"재무기획자", height:166, bodyType:"슬림 밸런스", archetype:"안정형 직장인", bio:"재무기획자 · 차분하고 현실적인 인상",
    personality:{contactImportance:38,jealousy:34,materialism:28,romanticism:54,independence:72,marriageDesire:68,economicPreference:82,vanity:30,loyalty:88,opportunism:12,emotionalSensitivity:42,giftPreference:48,socialPreference:50},
    hiddenTrait:"관계가 불안해지면 감정보다 계획을 먼저 세운다.", preferredDates:["조용한 식당","서점","함께 장보기"], dislikedActions:["충동 지출","말 없는 잠수"], preferredGifts:["미니멀","클래식","의미"],
    fashionPreferences:{미니멀:95,오피스:92,엘레강트:82,로맨틱:55,스포티:45,럭셔리:48}, rivalReaction:"사실을 확인한 뒤 조용히 거리를 둔다.", conflictStyle:"근거와 약속을 확인한다.", reconciliationStyle:"구체적인 재발 방지 약속", aiVoice:"짧고 차분하며 현실적인 존댓말과 반말을 섞는다.", palette:"ivory-navy", referenceImage:"assets/heroines/haeun/outfits/01.png"
  },
  {
    id:"nari", name:"나리", age:25, job:"플로리스트", height:160, bodyType:"쁘띠 글래머", archetype:"감정표현형", bio:"플로리스트 · 감정이 얼굴에 드러나는 다정한 사람",
    personality:{contactImportance:90,jealousy:78,materialism:42,romanticism:94,independence:28,marriageDesire:80,economicPreference:40,vanity:68,loyalty:84,opportunism:18,emotionalSensitivity:90,giftPreference:86,socialPreference:72},
    hiddenTrait:"서운함을 크게 표현하지만 사과도 가장 먼저 한다.", preferredDates:["기념일 데이트","야경","꽃시장"], dislikedActions:["답장 미루기","기념일 무시"], preferredGifts:["로맨틱","뷰티","향수"],
    fashionPreferences:{러블리:96,로맨틱:94,엘레강트:70,미니멀:42,스포티:38,럭셔리:60}, rivalReaction:"질투를 숨기지 않고 바로 묻는다.", conflictStyle:"감정을 전부 말한다.", reconciliationStyle:"포옹과 솔직한 애정표현", aiVoice:"감탄사와 이모티콘을 자연스럽게 쓰는 다정한 반말.", palette:"blush-coral", referenceImage:"assets/heroines/nari/outfits/01.webp"
  },
  {
    id:"sejin", name:"채연", age:31, job:"전략 컨설턴트", height:171, bodyType:"톨 애슬레틱", archetype:"야망형", bio:"전략 컨설턴트 · 냉철하고 자신감 있는 분위기",
    personality:{contactImportance:48,jealousy:46,materialism:72,romanticism:38,independence:84,marriageDesire:52,economicPreference:92,vanity:82,loyalty:72,opportunism:44,emotionalSensitivity:32,giftPreference:68,socialPreference:88},
    hiddenTrait:"성공보다 성장 의지가 없는 태도를 더 싫어한다.", preferredDates:["파인 다이닝","전시 오프닝","커리어 세미나"], dislikedActions:["무계획","성장 포기"], preferredGifts:["럭셔리","클래식","테크"],
    fashionPreferences:{럭셔리:96,오피스:95,시크:92,엘레강트:84,러블리:20,스포티:58}, rivalReaction:"경쟁 상대를 냉정하게 비교한다.", conflictStyle:"핵심 문제를 직설적으로 지적한다.", reconciliationStyle:"행동으로 증명한 변화", aiVoice:"간결하고 자신감 있으며 가끔 건조한 농담을 한다.", palette:"black-wine", referenceImage:"assets/heroines/sejin/outfits/01.webp"
  },
  {
    id:"ara", name:"아라", age:27, job:"여행 사진가", height:168, bodyType:"린 스포티", archetype:"자유로운 독립형", bio:"여행 사진가 · 자유롭고 활동적인 에너지",
    personality:{contactImportance:22,jealousy:18,materialism:20,romanticism:58,independence:96,marriageDesire:30,economicPreference:36,vanity:46,loyalty:76,opportunism:26,emotionalSensitivity:45,giftPreference:52,socialPreference:82},
    hiddenTrait:"구속은 싫지만 함께 모험할 사람에게는 오래 충실하다.", preferredDates:["즉흥 여행","클라이밍","사진 산책"], dislikedActions:["연락 강요","일정 통제"], preferredGifts:["여행","캐주얼","테크"],
    fashionPreferences:{스트리트:96,스포티:92,캐주얼:90,여행:94,엘레강트:38,럭셔리:24}, rivalReaction:"질투 대신 관계의 자유를 다시 확인한다.", conflictStyle:"잠시 혼자 생각할 시간을 요청한다.", reconciliationStyle:"새로운 경험을 함께한다.", aiVoice:"짧고 경쾌한 반말, 여행과 사진 비유를 즐긴다.", palette:"rust-denim", referenceImage:"assets/heroines/ara/outfits/01.webp"
  },
  {
    id:"yuri", name:"유리", age:28, job:"고서 복원가", height:164, bodyType:"슬렌더 엘레강트", archetype:"미스터리형", bio:"고서 복원가 · 쉽게 속내를 읽을 수 없는 사람",
    personality:{contactImportance:55,jealousy:62,materialism:34,romanticism:76,independence:70,marriageDesire:58,economicPreference:50,vanity:60,loyalty:68,opportunism:38,emotionalSensitivity:74,giftPreference:64,socialPreference:26},
    hiddenTrait:"과거의 배신 때문에 확신이 생기기 전까지 미래를 말하지 않는다.", preferredDates:["고서점","심야 박물관","비 오는 카페"], dislikedActions:["과거 추궁","거짓말"], preferredGifts:["빈티지","의미","클래식"],
    fashionPreferences:{빈티지:98,엘레강트:90,다크:94,클래식:86,러블리:35,스포티:20}, rivalReaction:"아무렇지 않은 척하며 오래 관찰한다.", conflictStyle:"말수가 줄고 질문으로 진의를 확인한다.", reconciliationStyle:"숨기지 않은 진실과 기다림", aiVoice:"여백이 많은 차분한 반말, 책의 문장을 닮은 표현을 쓴다.", palette:"midnight-burgundy", referenceImage:"assets/heroines/yuri/outfits/01.webp"
  },
  YUNA_PROFILE
];

const styleByHeroine = {
  haeun:["미니멀","오피스","엘레강트"], nari:["러블리","로맨틱","페미닌"], sejin:["럭셔리","시크","포멀"],
  ara:["캐주얼","스트리트","스포티"], yuri:["다크","엘레강트","빈티지"]
};

const HAEUN_OUTFIT_VIDEOS = Object.freeze({
  3:"assets/heroines/haeun/videos/03_transparent.webm",
  5:"https://raw.githubusercontent.com/superstarman35/game/gh-pages/assets/heroines/haeun/videos/05_transparent.webm",
  8:"https://raw.githubusercontent.com/superstarman35/game/gh-pages/assets/heroines/haeun/videos/08_transparent.webm"
});

export const HEROINE_OUTFITS = [...HEROINE_PROFILES.filter(profile=>profile.id!=="yuna").flatMap(profile => (profile.id === "haeun" ? haeunOutfitKinds : outfitKinds).map(([kind,label,day,price,tag],index) => ({
  id:`outfit-${profile.id}-${String(index + 1).padStart(2,"0")}`, outfitId:`OUTFIT_${profile.id.toUpperCase()}_${kind.toUpperCase()}_${String(index + 1).padStart(3,"0")}`,
  icon:"👗", name:`${profile.name} · ${label}`, brand:"Atelier One Day", category:"heroine-outfit", heroineId:profile.id,
  price, luxuryLevel:Math.max(1,Math.ceil(price / 70000)), attractivenessBonus:2 + Math.ceil(index / 2), fashionBonus:4 + index,
  preferenceTags:[tag,...styleByHeroine[profile.id]], styleTags:[tag,...styleByHeroine[profile.id]], rarity:index >= 8 ? "legendary" : index >= 6 ? "rare" : "common",
  unlockConditions:{day, affection:index >= 8 ? 650 : index >= 6 ? 560 : 0, trust:index === 9 ? 600 : 0},
  productImage:`assets/heroines/${profile.id}/outfits/${String(index + 1).padStart(2,"0")}.${profile.id === "haeun" ? "png" : "webp"}`,
  characterWearingImage:`assets/heroines/${profile.id}/outfits/${String(index + 1).padStart(2,"0")}.${profile.id === "haeun" ? "png" : "webp"}`,
  characterWearingVideo:profile.id === "haeun" ? HAEUN_OUTFIT_VIDEOS[index + 1] ?? null : null
}))),...YUNA_OUTFITS];

const mainBeats = ["첫 번째 약속","일과 사랑의 경계","예상 밖의 데이트","친구에게 소개하는 날","처음 드러난 약점","서로의 돈 이야기","라이벌의 등장","크게 부딪힌 밤","다시 손을 잡는 방법","우리의 다음 계절"];
const subBeats = ["우산 하나","점심의 메시지","취향을 고르는 시간","사진 한 장","늦은 퇴근길","작은 선물","친구의 조언","서툰 요리","잠들기 전 통화","비밀 하나"];

function makeHeroineScene(profile, title, index, type) {
  const day = Math.min(29,2 + index + (type === "sub" ? 1 : 0));
  return {
    id:`heroine-${profile.id}-${type}-${String(index + 1).padStart(2,"0")}`, heroineIds:[profile.id], arc:`${profile.name} 전용 ${type === "main" ? "메인" : "서브"}`,
    window:[day,Math.min(30,day + 5)], priority:type === "main" ? 74 : 54, bgm:type === "main" ? "theme" : "daily",
    title, speaker:profile.name, message:`${profile.archetype}인 ${profile.name}와의 관계에서만 만날 수 있는 장면이다.`,
    choices:[
      {id:"understand",label:`${profile.name}의 방식부터 이해해 본다`,effects:{affection:8,trust:10},response:`“내 방식을 존중해 줘서 고마워. 나도 네 이야기를 더 들을게.”`,memory:`${profile.name} 전용 장면: ${title}`},
      {id:"honest",label:"내 생각도 숨기지 않고 말한다",effects:{trust:7,confidence:3},response:"서로 다른 마음을 감추지 않자 대화가 조금 길어졌다.",memory:`${profile.name}와 솔직하게 나눈 ${title}`},
      {id:"avoid",label:"지금은 대화를 피한다",effects:{trust:-6,relationshipStress:5},response:`${profile.name}는 더 묻지 않았지만 대화에는 여운이 남았다.`,memory:`미뤄 둔 ${profile.name}와의 ${title}`}
    ]
  };
}

export const HEROINE_STORY_SCENES = HEROINE_PROFILES.filter(profile=>profile.id!=="yuna").flatMap(profile => [
  ...mainBeats.map((title,index)=>makeHeroineScene(profile,title,index,"main")),
  ...subBeats.map((title,index)=>makeHeroineScene(profile,title,index,"sub"))
]);

export function getHeroineProfile(id) { return HEROINE_PROFILES.find(profile => profile.id === id) ?? null; }
export function getHeroineOutfits(id) { return HEROINE_OUTFITS.filter(outfit => outfit.heroineId === id); }
export function isOutfitUnlocked(state,outfit) {
  const conditions=outfit?.unlockConditions ?? {};
  return (!conditions.day || state.day >= conditions.day) && (!conditions.affection || state.affection >= conditions.affection) && (!conditions.trust || state.trust >= conditions.trust);
}
export function getEquippedHeroineOutfit(state) {
  const instance=(state.inventory ?? []).find(entry=>entry.owner === "girlfriend" && entry.equipped && getHeroineOutfits(state.partner.heroineId).some(outfit=>outfit.id===entry.itemId));
  return instance ? HEROINE_OUTFITS.find(outfit=>outfit.id===instance.itemId) ?? null : null;
}
export function validateHeroineContent() {
  const heroineIds=new Set(HEROINE_PROFILES.map(profile=>profile.id));
  const outfitIds=new Set(HEROINE_OUTFITS.map(outfit=>outfit.id));
  const storyIds=new Set(HEROINE_STORY_SCENES.map(scene=>scene.id));
  return heroineIds.size >= 6 && HEROINE_PROFILES.every(profile=>getHeroineOutfits(profile.id).length >= 10 && profile.referenceImage && Object.keys(profile.fashionPreferences).length >= 6) && outfitIds.size === HEROINE_OUTFITS.length && HEROINE_OUTFITS.every(outfit=>outfit.productImage && outfit.characterWearingImage && outfit.styleTags.length >= 2) && storyIds.size === HEROINE_STORY_SCENES.length && HEROINE_PROFILES.filter(profile=>profile.id!=="yuna").every(profile=>HEROINE_STORY_SCENES.filter(scene=>scene.heroineIds.includes(profile.id)).length >= 20);
}

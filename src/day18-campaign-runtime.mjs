import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs?v=2";
const ID="m30-day18-current-home-safety",asset=STORY_OUTFIT_ASSETS.day8,n=text=>({type:"narration",text}),a=action=>({type:"stageAction",action}),d=(speaker,text,expressionId="calm")=>({type:"dialogue",speaker,text,expressionId}),enter=(expressionId="calm")=>({type:"characterEnter",characterId:"girlfriend",expressionId,animationId:"idle-breathe"}),transition=(label,backgroundId,expressionId="calm")=>({type:"transition",style:"crossfade",label,backgroundId,characterId:"girlfriend",characterAssetUrl:asset,expressionId,poseId:"standing",bgmId:"daily"}),choice=options=>({type:"choice",options});
export const LOCKED_DAY18_SCENE_ID=ID;
export const DAY18_ROUTE_CHOICES=Object.freeze([{id:"home18_route_clear_path",label:"현관·침실·화장실 사이의 이동 동선부터 비운다"},{id:"home18_route_night_lights",label:"야간 조명과 손이 닿는 스위치 위치부터 확인한다"},{id:"home18_route_stop_points",label:"어지럼이 생길 때 앉을 지점과 호출 수단을 표시한다"}]);
export const DAY18_STORAGE_CHOICES=Object.freeze([{id:"home18_storage_current_meds",label:"현재 처방 약만 한 칸에 두고 중단 약은 봉인한다"},{id:"home18_storage_labels",label:"소유자·용도·확인일이 있는 물건만 생활 구역에 둔다"},{id:"home18_storage_no_search",label:"안전과 무관한 서랍·상자·과거 물건은 계속 열지 않는다"}]);
export const DAY18_ACCESS_CHOICES=Object.freeze([{id:"home18_access_one_time_code",label:"비상시에는 목적과 만료 시간이 있는 1회 출입 코드를 쓴다"},{id:"home18_access_call_first",label:"응답 가능할 때는 연락 후 내가 직접 문을 연다"},{id:"home18_access_no_admin",label:"연인·관리자 누구에게도 영구 도어락 관리자 권한을 주지 않는다"}]);
function routeReaction(id){if(id==="home18_route_night_lights")return [d("나","야간 조명과 손이 닿는 스위치부터 확인하자."),d("하은","빛을 켜려고 어두운 곳을 먼저 걸을 필요 없게.","smile")];if(id==="home18_route_stop_points")return [d("나","어지러울 때 앉을 곳과 호출 수단을 표시할게."),d("하은","멈춘 뒤 누구에게 어떤 순서로 연락할지도 같이.","calm")];return [d("나","현관, 침실, 화장실 사이 동선부터 비우자."),d("하은","정리보다 넘어지지 않는 길이 먼저네.","smile")];}
function storageReaction(id){if(id==="home18_storage_labels")return [d("나","소유자, 용도, 확인일이 있는 물건만 생활 구역에 둘게."),d("하은","모르는 물건을 버리거나 네 것으로 정하지 않고.","calm")];if(id==="home18_storage_no_search")return [d("나","안전과 무관한 서랍과 과거 물건은 오늘 열지 않겠어."),d("하은","집 안전 점검이 기억 수색 허가가 되지는 않게.","smile")];return [d("나","현재 처방 약만 한 칸에 두고 중단 약은 봉인하자."),d("하은","같은 모양이어도 현재 지시가 없으면 쓰지 않기.","calm")];}
function accessReaction(id){if(id==="home18_access_call_first")return [d("나","응답할 수 있을 때는 먼저 연락하고 내가 직접 문을 열게."),d("하은","걱정된다는 이유로 비상 상황을 미리 가정하지 않을게.","smile")];if(id==="home18_access_no_admin")return [d("나","누구에게도 영구 관리자 권한을 주지 않을게."),d("하은","도울 수 있는 방법과 집을 계속 열 수 있는 권한은 다르니까.","calm")];return [d("나","비상시에는 목적과 만료 시간이 있는 1회 코드만 쓰자."),d("하은","사용 기록이 남고 끝나면 바로 닫히는 방식으로.","smile")];}
const segment0=()=>[
  transition("DAY 18 · 안전하게 사는 집","day2-home-entry","calm"),enter("calm"),
  a("하은이 식탁 위의 약봉투를 집어 든다."),d("하은","이거 계속 여기 둘 거야?"),d("나","왜? 찾기 쉽잖아."),d("하은","찾기 쉬운 거랑 아무 데나 두는 건 좀 다르지."),
  a("하은이 약봉투를 내려놓고 현관 쪽을 바라본다."),d("하은","정리하다 모르는 물건이 나와도 오늘은 열지 말자."),d("나","생활 동선에 있는 것만 볼게."),
  transition("SCENE 02 · 현관에서 침실까지","day2-bedroom","calm"),enter("calm"),
  a("현관에서 침실로 가는 길에 충전선이 비스듬히 놓여 있다."),d("하은","밤에 이거 보여?"),d("나","지금도 발끝에 걸리는데."),a("주인공이 선을 벽 쪽으로 옮긴다. 하은이 매트 가장자리를 발로 눌러 본다."),d("하은","이건 밟을 때마다 움직여."),d("나","치울지 고정할지 먼저 정해야겠네."),
  transition("SCENE 03 · 멈출 수 있는 동선","day2-home-entry","smile"),enter("smile"),choice(DAY18_ROUTE_CHOICES)
];
const segment1=state=>[
  ...routeReaction(state.storyFlags?.day18RouteStrategy),transition("SCENE 04 · 현재 약의 자리","day2-bedroom","calm"),enter("calm"),
  a("하은이 서랍 하나를 비우고 안쪽을 손으로 가리킨다."),d("하은","여기는 약."),d("나","지금 먹는 것만?"),d("하은","응. 멈춘 약이나 모르는 건 다른 통에 넣고 날짜부터 확인하자."),
  a("주인공이 현재 처방전과 이름이 맞는 봉투만 서랍에 놓고 나머지는 닫히는 상자에 넣는다."),d("하은","내가 기억하는 네 습관으로 자리를 정하지는 않을게."),d("나","확인된 것만 손 닿는 데 두자."),
  transition("SCENE 05 · 생활과 수색의 경계","home-morning","calm"),enter("calm"),choice(DAY18_STORAGE_CHOICES)
];
const segment2=state=>[
  ...storageReaction(state.storyFlags?.day18StorageStrategy),transition("SCENE 06 · 비상 연락 카드","day2-home-entry","smile"),enter("smile"),
  a("주인공이 작은 카드 맨 위에 현재 주소를 적는다."),d("나","병원 번호, 지금 먹는 약, 그리고 도움을 요청할 범위."),d("하은","내 번호도 쓰되, 집 안의 다른 정보까지 다 적지는 말자."),d("나","문을 열어야 하는 상황도 따로 정하고."),
  a("카드를 현관 안쪽, 밖에서는 보이지 않는 높이에 놓는다."),
  transition("SCENE 07 · 누가 문을 열 수 있나","day2-home-entry","calm"),enter("calm"),
  a("도어락 앱 화면에 ‘관리자 추가’ 버튼이 떠 있다."),d("하은","이 버튼 하나면 내가 언제든 들어올 수 있는 거네."),d("나","비상시에 돕는 거랑 항상 들어올 수 있는 건 다르지."),d("하은","응. 그러니까 누르기 전에 정하자."),choice(DAY18_ACCESS_CHOICES)
];
const segment3=state=>[
  ...accessReaction(state.storyFlags?.day18AccessStrategy),transition("SCENE 08 · 선택권이 있는 안전","home-morning","smile"),enter("smile"),
  a("현관에서 침실까지 바닥이 비고, 약 서랍에는 오늘 확인한 봉투만 남는다."),d("하은","네 집이 안전해지는 것과 네 집이 내 관리 대상이 되는 건 다르네.","smile"),d("나","도움이 필요하면 범위와 시간을 말할게."),d("하은","그러면 나는 그 안에서 도울게."),
  a("하은이 관리자 추가 화면을 닫는다. 주인공이 비상 연락 카드를 읽고 현관 안쪽에 다시 꽂는다."),
  {type:"transition",style:"fade",label:"DAY 18 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:asset,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
export function getLockedDay18Segment(state,stage=state.storyFlags?.day18RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay18ResumePresentation(state){const stage=state.storyFlags?.day18RuntimeStage??0,backgroundId=stage===0?"day2-home-entry":stage===1?"day2-bedroom":stage===2?"day2-home-entry":"home-morning";return {backgroundId,characterId:"girlfriend",characterAssetUrl:asset,expressionId:stage>=3?"smile":"calm",poseId:"standing"};}
export function applyLockedDay18ChoiceState(state,id){state.storyFlags??={};if(DAY18_ROUTE_CHOICES.some(x=>x.id===id)){state.storyFlags.day18RouteStrategy=id;state.storyFlags.day18RuntimeStage=1;state.storyFlags[id]=true;addCollection(state,"unlockedActions","current-home-safety-route");return {stage:1};}if(DAY18_STORAGE_CHOICES.some(x=>x.id===id)){state.storyFlags.day18StorageStrategy=id;state.storyFlags.day18RuntimeStage=2;state.storyFlags[id]=true;addCollection(state,"unlockedActions","verified-home-storage");return {stage:2};}if(DAY18_ACCESS_CHOICES.some(x=>x.id===id)){state.storyFlags.day18AccessStrategy=id;state.storyFlags.day18RuntimeStage=3;state.storyFlags.day18CurrentHomeSafetyPending=false;state.storyFlags.day18CurrentHomeSafetyCompleted=true;state.storyFlags.day19CurrentSharedChorePending=true;state.storyFlags[id]=true;addCollection(state,"clues","current-home-safety-record");addCollection(state,"unlockedActions","bounded-emergency-access");addCollection(state,"followUpHooks","day19-current-shared-chore");return {stage:3};}return null;}
export function getLockedDay18LegacyChoice(state){return state.storyFlags?.day18AccessStrategy??"home18_access_one_time_code";}
export function validateLockedDay18Runtime(){const state={storyFlags:{day18RouteStrategy:"home18_route_clear_path",day18StorageStrategy:"home18_storage_current_meds",day18AccessStrategy:"home18_access_one_time_code"}};const all=[...segment0(state),...segment1(state),...segment2(state),...segment3(state)];return all.filter(x=>x.type==="transition").length>=8&&all.filter(x=>x.type==="choice").length===3&&all.at(-1)?.type==="sceneEnd";}

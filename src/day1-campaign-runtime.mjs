const BG_CEILING="day1-hospital-ceiling";
const BG_BEDSIDE="day1-hospital-bedside";
const HAEUN="assets/characters/day1/haeun/";
const NPC="assets/npcs/day1/";
const CG="assets/events/day1/";

const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm-attentive",extra={})=>({type:"dialogue",speaker,text,expressionId,focusCharacterId:speaker==="하은"?"haeun":speaker==="담당 의사"?"doctor":speaker==="간호사"?"nurse":"pov",...extra});
const tr=(label,backgroundId=BG_BEDSIDE,extra={})=>({type:"transition",style:"fade",label,backgroundId,...extra});
const sfx=id=>({type:"sfx",sfxId:id});
const bgm=id=>({type:"animation",bgmCue:id});
const cg=(source,duration=1800)=>({type:"cgShow",source,duration});
const sprite=(asset,expressionId,stage={positionPreset:"right",depth:"normal"})=>({type:"characterEnter",characterId:"haeun",assetUrl:`${HAEUN}${asset}`,expressionId,animationId:"idle-breathe",stage});
const npc=(layer,source,characterId,stage)=>({type:"itemShow",layer,source:source?`${NPC}${source}`:"",characterId,stage});

export const LOCKED_DAY1_SCENE_ID="m30-day1-hospital-awakening";
export const DAY1_CONTACT_CHOICES=Object.freeze([
  {id:"contact_boundary",label:"아파. 일단 조금만 떨어져 줘."},
  {id:"contact_acceptance",label:"잠깐 그대로 있는다"},
  {id:"identity_first",label:"누구야?"}
]);
export const DAY1_QUESTION_CHOICES=Object.freeze([
  {id:"family_question_first",label:"가족은요?"},
  {id:"accident_interest",label:"사고 기록은 어디까지 확인됐습니까?"},
  {id:"recovery_focus",label:"제가 다시 혼자 움직이려면 무엇부터 해야 합니까?"}
]);

const LEGACY_CONTACT={contact_boundary:"set-boundary",contact_acceptance:"accept-support",identity_first:"controlled-help"};

function contactReaction(choiceId){
  if(choiceId==="contact_boundary")return [sprite("poses/haeun-pose-step-back-open-2d.png","apologetic-worried"),d("나","아파. 일단 조금만 떨어져 줘."),d("하은","미안. 깨어난 것만 보고 내가…… 통증 어디야? 어깨? 가슴?","apologetic-worried"),d("나","지금은 괜찮아. 가까이 오기 전에는 먼저 말해 줘."),d("하은","응. 그건 꼭 지킬게.","calm-attentive")];
  if(choiceId==="contact_acceptance")return [sprite("expressions/haeun-expression-teary-relief-2d.png","teary-relief"),n("나는 손을 들지 않았다. 그렇다고 그녀를 밀어내지도 않았다. 어깨가 조금씩 젖었다."),d("하은","진짜 다행이다. 정말……","teary-relief"),d("나","미안한데, 이제는 조금 숨이 막혀."),sprite("poses/haeun-pose-step-back-open-2d.png","warm-playful"),d("하은","일어나자마자 보호자한테 압사당할 뻔했네. 이건 병원 기록에서 빼 달라고 해야겠다.","warm-playful"),d("나","보호자?")];
  return [sprite("poses/haeun-pose-step-back-open-2d.png","soft-vulnerable"),d("나","누구야?"),d("나","미안. 정말 모르겠어."),d("하은","알겠어. 이름부터 말할게. 나는 이하은이야.","soft-vulnerable"),d("나","이하은."),d("하은","응. 나머지는 선생님하고 상태부터 확인한 다음에 말하자.","calm-attentive")];
}

function questionReaction(choiceId){
  if(choiceId==="family_question_first")return [d("나","가족은요? 지금 연락할 수 있는 사람이 있습니까?"),d("담당 의사","사고 당시 부모님도 함께 계셨고 두 분은 사망하셨습니다. 지금 더 자세한 설명을 원하시면 한 번에 하나씩 확인하겠습니다."),d("나","먼저 그 사실까지만 듣겠습니다.")];
  if(choiceId==="accident_interest")return [d("나","사고 기록은 어디까지 확인됐습니까?"),d("담당 의사","교통사고였다는 사실과 부상·치료 기록은 병원에서 확인할 수 있습니다. 사고 경위의 세부사항은 의료 기록과 별개입니다."),d("나","지금 모르는 것과 나중에 확인할 수 있는 것을 나눠 주십시오."),d("담당 의사","좋습니다. 오늘은 치료 기록, 이후에는 정식 사고 기록을 확인하는 순서가 안전합니다.")];
  return [d("나","제가 다시 혼자 움직이려면 무엇부터 해야 합니까?"),d("담당 의사","오늘은 앉는 자세와 삼킴 상태부터 확인합니다. 기립과 보행은 재활 평가 뒤에 시작합니다."),d("나","중단해야 할 증상도 알려 주십시오."),d("담당 의사","어지럼, 호흡 곤란, 새 통증이 있으면 즉시 멈춥니다. 혼자 시험하지 않는 것이 첫 번째 계획입니다."),d("하은","그 계획은 내가 먼저 지킬게.","calm-attentive")];
}

const SEGMENT_0=[
  tr("DAY 1 · 눈을 뜨다",BG_CEILING,{bgmCue:"S01_B01_BLACK"}),bgm("S01_B01_BLACK"),sfx("SFX_CART_DISTANT"),
  n("처음에는 소리인지, 머릿속에서 울리는 감각인지 구분할 수 없었다. 혀끝이 말라 있었고, 왼손등이 당겼다."),bgm("S01_B02_FOCUS"),sfx("AMB_HOSPITAL_ROOM_DAY"),
  n("천장. 수액. 기계음. 병원인가."),n("고개를 돌리자 침대 옆 의자에 보라색 머리의 여자가 앉아 있었다. 손에는 꺼진 휴대폰이 들려 있었다."),
  sprite("poses/haeun-pose-seated-dozing-2d.png","resting-tired",{positionPreset:"right",depth:"normal"}),sfx("SFX_PHONE_SOFT_DROP"),cg(`${CG}cg-day1-first-eye-contact-v2.png`,2600),
  d("하은","……어?","startled-relief"),sprite("poses/haeun-pose-rise-and-pause-2d.png","startled-relief"),d("하은","나 보여?"),d("하은","손가락은? 움직일 수 있어?"),n("검지를 조금 움직이자 하은이 숨을 길게 내쉬었다."),d("하은","드디어…….","teary-relief"),
  sprite("poses/haeun-pose-careful-embrace-2d.png","teary-relief",{positionPreset:"foregroundRight",depth:"foreground"}),n("그녀가 몸을 숙여 나를 끌어안았다. 따뜻한 체온보다 갈비뼈를 누르는 통증이 먼저 느껴졌다."),n("나를 아는 사람이다. 문제는 내가 이 사람을 모른다는 것."),
  {type:"choice",options:DAY1_CONTACT_CHOICES}
];

const SEGMENT_1_HEAD=[
  sprite("poses/haeun-pose-standing-bedside-restraint-2d.png","calm-attentive"),d("하은","선생님 오실 때까지 무리해서 움직이지 마. 질문은 해도 돼. 내가 아는 것만 대답할게."),
  tr("SCENE 02 · 이름과 관계"),d("나","여긴 병원이지?"),d("하은","응. 병원 입원실이야."),d("나","나는 왜 여기 있어?"),d("하은","사고가 있었어. 자세한 건 의사 선생님이 기록 보면서 설명하는 게 정확해."),n("모르는 건지, 말을 고르는 건지는 아직 판단할 수 없다."),d("나","내 이름은?"),d("하은","[플레이어 이름]."),n("이름을 속으로 되뇌었지만 익숙하다는 느낌조차 없었다."),d("나","우리 관계는?"),sprite("poses/haeun-pose-seated-no-contact-2d.png","calm-attentive"),d("하은","나는 스물세 살, 이하은. 그리고…… 네 여자친구야."),d("나","확인할 수 있는 게 있어?"),d("하은","사진도 있고 연락 기록도 있어. 그런데 지금 네 얼굴 앞에 들이밀지는 않을게. 네 휴대폰이 돌아오면 네가 직접 확인해."),d("나","내가 의심해서 기분 나쁘지는 않고?"),d("하은","조금은 나쁘지. 나는 오래 기다렸는데 넌 처음 보는 사람이니까."),d("하은","그래도 확인하는 게 맞아. 나라도 그럴 거야.","warm-playful"),sfx("SFX_FOOTSTEP_APPROACH"),
  tr("SCENE 03 · 1년"),npc("npcFront","doctor-bedside-assessment-2d.png"),npc("npcRear","nurse-vitals-check-2d.png"),sfx("SFX_DOOR_OPEN"),d("담당 의사","[플레이어 이름] 환자분, 제 말 들리십니까? 담당 의사입니다. 먼저 현재 상태부터 확인하겠습니다."),sfx("SFX_MEDICAL_LIGHT"),n("빛을 따라 눈동자를 움직이고 양손을 번갈아 쥐었다 폈다. 간호사는 활력징후를 확인했다."),d("담당 의사","여기가 어디인지는 아십니까?"),d("나","병원이라는 건 압니다. 병원 이름은 방금 들었습니다."),d("담당 의사","본인 이름은요?"),d("나","저분에게 들었습니다. 스스로 기억난 건 아닙니다."),d("담당 의사","좋습니다. 들은 정보와 떠오른 기억을 구분해서 말씀해 주세요. 오늘 날짜나 사고 전 일은 기억나십니까?"),d("나","아니요. 제 이름도, 가족도, 저 사람도 기억나지 않습니다."),d("담당 의사","현재 대화를 이해하고 판단하는 기능은 유지되어 있습니다. 다만 과거 기억에는 큰 공백이 있는 것으로 보입니다. 정확한 범위는 추가 검사가 필요합니다."),d("나","기억상실입니까?"),d("담당 의사","현재로서는 그 가능성이 높습니다. 회복 시기와 범위는 지금 단정할 수 없습니다."),d("나","얼마나 오래 누워 있었습니까?"),bgm("S03_B03_ONE_YEAR"),d("담당 의사","사고 이후 약 1년입니다."),n("기계음은 같은 간격으로 울렸다. 이불 위의 손은 뼈마디가 도드라져 보였다."),d("나","1년을 잊은 게 아니라, 1년 동안 의식이 없었던 겁니까?"),d("담당 의사","그렇습니다. 사고 전 기억의 손상과 혼수 기간은 구분해서 봐야 합니다."),d("간호사","지금은 혼자 일어나지 마세요. 삼킴 상태를 확인하기 전에는 물도 바로 드시면 안 됩니다."),
  {type:"choice",options:DAY1_QUESTION_CHOICES}
];

function endingSegment(state){const family=Boolean(state.storyFlags?.family_question_first);const contact=state.storyFlags?.day1ContactStrategy;const permission=contact==="contact_boundary"?"받쳐도 돼? 컵 아래만.":contact==="contact_acceptance"?"아까처럼 갑자기 안 잡을게. 필요하면 말해.":"이하은, 컵 보조 대기 중. 허락받으면 움직입니다.";return [
  ...questionReaction(state.storyFlags?.day1QuestionStrategy),d("담당 의사","큰 정보는 오늘 한꺼번에 결론 내리지 마세요. 들은 사실, 본인이 떠올린 기억, 다른 사람이 한 주장을 구분해 두는 게 좋습니다."),d("나","알겠습니다."),npc("npcFront",""),npc("npcRear",""),
  tr("SCENE 04 · 남겨진 사람"),bgm("S04_B01_DOOR_CLOSE"),sfx("SFX_DOOR_CLOSE"),d("나",family?"부모님 두 분 다…… 사고로 돌아가신 게 맞아?":"아까 다른 질문을 먼저 했지. 내 가족은 지금 어디 있어?"),d("하은","부모님도 사고 현장에 계셨어. 두 분 다 돌아가셨어.","soft-vulnerable"),d("하은","병원 기록에도 있고, 장례 절차도 끝났어."),d("나","네가 장례식에 있었어?"),d("하은","있었어. 하지만 지금 그때 이야기를 전부 내 설명으로 채우지는 않을게."),d("나","왜?"),d("하은","네가 직접 확인할 기록도 있고, 네가 나중에 기억할 수도 있으니까. 내가 말한 장면이 네 기억처럼 굳으면 싫어."),n("눈을 감고 부모의 얼굴을 찾았지만 떠오르는 것은 없었다."),d("나","죽었다는 말을 들었는데 얼굴이 안 떠올라."),d("하은","지금 당장 울지 않아도 돼."),d("나","위로하는 거야?"),d("하은","아니. 울어야 정상이라는 숙제부터 치우는 거야.","calm-attentive"),
  tr("SCENE 05 · 물 한 모금"),npc("npcRear","nurse-swallow-assessment-2d.png"),n("간호사가 삼킴 상태를 확인하고 소량의 물 섭취를 허용한 뒤 나갔다."),npc("npcRear",""),d("하은","반 컵. 오늘의 첫 번째 과제치고는 소박하지?","warm-playful"),d("나","마시는 것도 과제야?"),d("하은","아까 간호사 선생님 말 못 들었어? 지금 네 담당자는 내가 아니라 안전 수칙이야."),n("컵을 잡자 손끝이 떨렸다. 하은이 컵 아래로 손바닥을 가져갔지만 닿지는 않았다."),d("하은",permission,"calm-attentive"),d("나","컵 아래만 부탁해."),cg(`${CG}cg-day1-cup-support-v1.png`,1800),n("하은이 컵 바닥을 받쳤다. 천천히 한 모금을 삼켰다."),d("나","이것도 마음대로 안 되네."),d("하은","1년 쉬었는데 첫날부터 팔굽혀펴기 할 생각은 아니지?","warm-playful"),d("나","내가 원래 그랬어?"),d("하은","운동은 했고, 쉬는 건 잘 못했어. 이건 사진보다 병원 선생님들이 먼저 증명해 줄걸."),d("나","검증 가능한 주장이라는 거군."),d("하은","응. 여자친구 주장도 차근차근 검증받겠습니다.","warm-playful"),sfx("SFX_CUP_SET_DOWN"),
  tr("SCENE 06 · 결혼까지 30일"),d("나","우리 얼마나 만났어?"),d("하은","갑자기 관계 면접이야?","warm-playful"),d("나","경력 확인부터 해야지."),d("하은","처음 만난 건 꽤 됐고, 사귄 것도 오래됐고, 싸운 건……."),d("나","횟수가 실시간으로 늘어나는데."),d("하은","분류 기준이 달라서 그래. 네가 화장실 불을 안 끈 사건을 싸움으로 볼지 교육으로 볼지."),d("나","그런 건 기억하면서 내 이름 말할 때는 왜 울었어?"),d("하은","네 이름을 다시 들을 수 있을 줄 몰랐으니까.","soft-vulnerable"),bgm("S06_B02_SHIFT"),d("하은","그리고 중요한 게 하나 있어."),d("나","사고나 가족보다 더 중요한 거야?"),d("하은","더 중요하다기보다는…… 네 결정이 필요한 일."),d("하은","우리, 결혼하기로 했었어."),d("나","언제?"),bgm("S06_B04_REVEAL"),d("하은","30일 뒤.","soft-vulnerable"),n("심전도 소리는 변하지 않았다. 변한 것은 그 숫자가 병실 안에서 차지하는 크기였다."),d("나","과거의 내가 약속한 날짜네."),d("하은","응."),d("나","그러면 지금의 내가 다시 판단해야 해."),d("하은","좋아. 30일 동안 확인해.","gentle-resolve"),d("나","너도 포함해서?"),d("하은","나부터."),bgm("S06_B06_RESOLVE"),sfx("SFX_PHONE_SCREEN_OFF"),cg(`${CG}cg-day1-thirty-day-resolve-v2.png`,4200),d("하은","대신 오늘은 몸부터. 내일 재활 선생님 오시면, 어디까지 혼자 하고 어디부터 도움받을지 네가 정해."),n("결혼까지 30일. 그 전에 내가 누구였는지, 지금 무엇을 선택할 수 있는지부터 확인해야 한다."),bgm("S06_B07_END"),{type:"sfx",stopCueId:"AMB_HOSPITAL_ROOM_DAY"},tr("DAY 1 END"),{type:"sceneEnd"}
];}

export function getLockedDay1Segment(state,segment=0){if(segment===0)return structuredClone(SEGMENT_0);if(segment===1)return [...contactReaction(state.storyFlags?.day1ContactStrategy),...structuredClone(SEGMENT_1_HEAD)];return endingSegment(state);}

export function applyLockedDay1ChoiceState(state,choiceId){state.storyFlags??={};if(LEGACY_CONTACT[choiceId]){state.storyFlags.day1ContactStrategy=choiceId;state.storyFlags[choiceId]=true;return {stage:"contact",legacyChoiceId:LEGACY_CONTACT[choiceId]};}if(DAY1_QUESTION_CHOICES.some(choice=>choice.id===choiceId)){state.storyFlags.day1QuestionStrategy=choiceId;state.storyFlags[choiceId]=true;return {stage:"question",legacyChoiceId:LEGACY_CONTACT[state.storyFlags.day1ContactStrategy]};}return null;}

export function validateLockedDay1Runtime(){const all=[...SEGMENT_0,...SEGMENT_1_HEAD,...endingSegment({storyFlags:{day1ContactStrategy:"contact_boundary",day1QuestionStrategy:"family_question_first",family_question_first:true}})];return DAY1_CONTACT_CHOICES.length===3&&DAY1_QUESTION_CHOICES.length===3&&all.filter(step=>step.type==="transition").length>=7&&all.filter(step=>step.type==="dialogue").length>=55&&all.filter(step=>step.type==="cgShow").length===3&&!JSON.stringify(all).includes("트럭과 충돌")&&!JSON.stringify(all).includes("가짜 하은");}

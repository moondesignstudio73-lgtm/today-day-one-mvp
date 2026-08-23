const AXIS_TAGS={
  E:["SOCIAL","ACTIVE"],I:["PRIVATE","CALM"],S:["PRACTICAL","CONCRETE"],N:["IMAGINATIVE","ROMANTIC","FUTURE"],
  T:["LOGICAL","DIRECT"],F:["EMOTIONAL","CARING","ROMANTIC"],J:["PLANNED","RESPONSIBLE"],P:["SPONTANEOUS","FLEXIBLE"]
};

const EFFECT_BY_AXIS={
  E:{affection:3,excitement:4},I:{trust:4,relationshipStress:-2},S:{trust:4},N:{affection:3,excitement:4},
  T:{trust:4,conflict:-1},F:{affection:5,relationshipStress:-2},J:{trust:5,stress:-1},P:{affection:3,excitement:5,stress:-1}
};

export function getMbtiChoiceAdjustment(state,choice={}){
  const mbti=String(state?.partner?.mbti??"").toUpperCase();
  const tags=new Set(choice.preferenceTags??choice.mbtiTags??[]);
  if(!/^[EI][SN][TF][JP]$/.test(mbti)||!tags.size)return {effects:{},matchedAxes:[],label:""};
  const matchedAxes=[...mbti].filter(axis=>AXIS_TAGS[axis].some(tag=>tags.has(tag)));
  const effects={};
  for(const axis of matchedAxes)for(const [key,value] of Object.entries(EFFECT_BY_AXIS[axis]))effects[key]=(effects[key]??0)+value;
  return {effects,matchedAxes,label:matchedAxes.length?`${mbti} 성향 일치 · ${matchedAxes.join("/")}`:""};
}

export function combineChoiceEffects(base={},bonus={}){
  const keys=new Set([...Object.keys(base),...Object.keys(bonus)]);
  return Object.fromEntries([...keys].map(key=>[key,(Number(base[key])||0)+(Number(bonus[key])||0)]));
}

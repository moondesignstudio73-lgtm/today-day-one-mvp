const f=Object.freeze;

const backgroundFor=number=>number<=2?"home-morning":number<=15?"neighborhood-cafe-day":number<=17?"neighborhood-street-day":number===18?"home-morning":"home-night";

export function getDay16V4Presentation(sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY16_V4_PRESENTATION_SCENE_INVALID");
  const backgroundId=backgroundFor(sceneNumber),night=sceneNumber>=19;
  return f({
    sceneNumber,
    backgroundId,
    characterId:null,
    characterAssetUrl:null,
    expressionId:"calm",
    poseId:"standing",
    transition:[1,3,16,18,19,24].includes(sceneNumber)?"fade":"crossfade",
    bgm:f({category:night?"theme":"daily",variant:night?1:0,volume:night?.05:.06}),
    safeArea:f({desktop:"center-80",mobile:"center-60",objectPosition:"50% 44%"}),
    assetStatus:"ready-reuse"
  });
}

export function validateDay16V4PresentationData(){
  return Array.from({length:24},(_,index)=>getDay16V4Presentation(index+1)).every(entry=>
    ["home-morning","neighborhood-cafe-day","neighborhood-street-day","home-night"].includes(entry.backgroundId)&&
    entry.characterId===null&&entry.characterAssetUrl===null&&entry.assetStatus==="ready-reuse"
  );
}

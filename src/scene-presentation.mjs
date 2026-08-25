import { BACKGROUND_ASSETS, getBackgroundAsset } from "./assets/asset-manifest.mjs";

const MAJOR_CG_PATTERN = /첫 여행|기념|위기|질투|고백|마지막|DAY 30|결혼/;
const CAFE_PATTERN = /카페|커피|대화|거짓말|서운|회상|메시지/;
const OFFICE_PATTERN = /회사|업무|상사|출근|발표|동료|실수/;
const RIVER_PATTERN = /데이트|여행|미래|결혼|약속|고백|만남|함께/;
const NIGHT_PATTERN = /안경|전화|편지|밤|연락/;

export function getWeatherForDay(day = 1) {
  if (day % 7 === 0) return "rain";
  if (day % 5 === 0) return "cloudy";
  return "sunny";
}

function backgroundForText(text, state) {
  if (OFFICE_PATTERN.test(text)) return "office-day";
  if (CAFE_PATTERN.test(text)) return "cafe-rain-evening";
  if (RIVER_PATTERN.test(text)) return "river-night";
  if (NIGHT_PATTERN.test(text)) return "home-night";
  return state?.phase === 1 ? "office-day" : state?.phase === 2 ? "river-night" : "home-morning";
}

function expressionForText(text) {
  if (/위기|긴장|질투|거짓말/.test(text)) return "tense";
  if (/걱정|힘들|서운|회상|감기/.test(text)) return "worried";
  if (/행복|데이트|고백|기념|좋아|함께/.test(text)) return "smile";
  return "calm";
}

function poseForText(text) {
  if (/메시지|연락|전화|사진|SNS/.test(text)) return "phone";
  if (/카페|커피/.test(text)) return "drinking";
  if (/생각|미래|결혼|회상/.test(text)) return "thinking";
  return "standing";
}

function characterForStory(scene) {
  if (scene?.characterId) return scene.characterId;
  const speaker = String(scene?.speaker ?? "");
  const storyText = `${scene?.id ?? ""} ${scene?.arc ?? ""} ${scene?.title ?? ""}`;
  if (/전.?여자친구|전.?연인|유리|ex-message/.test(`${speaker} ${storyText}`)) return "player-ex";
  if (/채린|신입사원/.test(speaker)) return "office-rookie";
  if (/여성 동료|여직원|유진/.test(speaker)) return "female-coworker";
  if (/팀장|상사/.test(speaker)) return "team-lead";
  if (scene?.eventType === "COWORKER" && speaker !== "나") return "female-coworker";
  if (scene?.eventType === "FRIEND" && speaker !== "나") return "best-friend";
  return "girlfriend";
}

export function resolvePhasePresentation(state, phaseKey) {
  const backgroundId = ({ morning:"home-morning", day:"office-day", evening:"river-night", night:"home-night" })[phaseKey] ?? "home-morning";
  return {
    backgroundId,
    characterId:"girlfriend",
    outfitId:phaseKey === "evening" ? "date" : "default",
    expressionId:state?.currentExpression ?? "calm",
    poseId:phaseKey === "night" ? "phone" : "standing",
    animationId:phaseKey === "evening" ? "soft-sway" : "idle-breathe",
    itemIds:[],
    weather:getWeatherForDay(state?.day),
    timeOfDay:phaseKey,
    bgmId:phaseKey === "evening" ? "theme" : phaseKey === "night" ? "theme" : "daily",
    sfxId:phaseKey === "night" ? "room-ambience" : "scene",
    eventCgId:null,
    backgroundUrl:getBackgroundAsset(backgroundId)
  };
}

export function resolveStoryPresentation(scene, state) {
  const text = `${scene?.id ?? ""} ${scene?.arc ?? ""} ${scene?.title ?? ""} ${scene?.message ?? ""}`;
  const backgroundId = scene?.presentation?.backgroundId ?? backgroundForText(text, state);
  const expressionId = scene?.presentation?.expressionId ?? expressionForText(text);
  const poseId = scene?.presentation?.poseId ?? poseForText(text);
  const eventCgId = MAJOR_CG_PATTERN.test(text) ? `CG_${String(scene?.id ?? "scene").toUpperCase().replace(/[^A-Z0-9]+/g, "_")}` : null;
  return {
    backgroundId,
    characterId:scene?.presentation?.characterId ?? characterForStory(scene),
    characterAssetUrl:scene?.presentation?.characterAssetUrl ?? "",
    outfitId:RIVER_PATTERN.test(text) ? "date" : "default",
    expressionId,
    poseId,
    animationId:expressionId === "tense" ? "tense-shift" : expressionId === "worried" ? "look-away" : "idle-breathe",
    itemIds:/가방/.test(text) ? ["mini-bag"] : /선물/.test(text) ? ["rose-parfum"] : [],
    weather:backgroundId.includes("rain") ? "rain" : getWeatherForDay(state?.day),
    timeOfDay:backgroundId.includes("night") ? "night" : backgroundId.includes("evening") ? "evening" : "day",
    bgmId:scene?.bgm ?? "theme",
    sfxId:backgroundId.includes("rain") ? "rain-window" : "scene",
    eventCgId,
    backgroundUrl:getBackgroundAsset(backgroundId)
  };
}

export function validateScenePresentation(value) {
  return value && ["backgroundId","characterId","outfitId","expressionId","poseId","animationId","weather","timeOfDay","bgmId","sfxId","backgroundUrl"].every(key => typeof value[key] === "string") && Array.isArray(value.itemIds) && (value.eventCgId === null || typeof value.eventCgId === "string");
}

export function getAssetRequirementList(storyScenes = [], events = []) {
  const story = storyScenes.map(scene => ({ sceneId:scene.id, ...resolveStoryPresentation(scene, { day:scene.window?.[0] ?? 1, phase:1 }) }));
  const event = events.map(scene => ({ sceneId:scene.id, ...resolveStoryPresentation(scene, { day:1, phase:1 }) }));
  const usedBackgrounds = new Set([...story, ...event].map(entry => entry.backgroundId));
  return { story, event, availableBackgrounds:Object.keys(BACKGROUND_ASSETS), missingBackgrounds:[...usedBackgrounds].filter(id => !BACKGROUND_ASSETS[id]) };
}

export function preloadSceneAssets(presentations = []) {
  const urls = [...new Set(presentations.flatMap(item => [item?.backgroundUrl,item?.characterAssetUrl]).filter(Boolean))];
  if (typeof Image !== "undefined") urls.forEach(url => { const image = new Image(); image.decoding = "async"; image.src = url; });
  return urls;
}

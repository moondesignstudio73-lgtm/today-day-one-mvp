const OPTIONS = {
  age:[23,24,25,26,27,28,29,30],
  bodyType:["slender","balanced","curvy"],
  hairLength:["bob","shoulder","long"],
  hairStyle:["straight","soft-wave","half-up","ponytail"],
  hairColor:["lavender","rose-brown","honey-blonde","midnight"],
  eyeColor:["violet","amber","brown","blue-gray"],
  baseOutfit:["romantic-office","casual-knit","modern-classic","soft-sporty"],
  accessory:["silver-necklace","ribbon-pin","pearl-earrings","none"],
  expressionStyle:["gentle","bright","reserved","playful"],
  poseStyle:["composed","friendly","confident","shy"]
};

export function seedFromIdentity(identity = "today-day-one") {
  let hash = 2166136261;
  for (const character of String(identity)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash,16777619);
  }
  return hash >>> 0;
}

function valueFor(seed, key) {
  const values = OPTIONS[key];
  const mixed = Math.imul((seed ^ seedFromIdentity(key)) >>> 0,2654435761) >>> 0;
  return values[mixed % values.length];
}

export function createCharacterAppearance(seed) {
  const normalizedSeed = Number(seed) >>> 0;
  return Object.fromEntries(Object.keys(OPTIONS).map(key=>[key,valueFor(normalizedSeed,key)]));
}

export function migratePartnerAppearance(partner) {
  if (!partner || typeof partner !== "object") return partner;
  partner.appearanceSeed = Number.isInteger(partner.appearanceSeed) ? partner.appearanceSeed >>> 0 : seedFromIdentity(partner.id);
  partner.characterAppearance ??= createCharacterAppearance(partner.appearanceSeed);
  return partner;
}

export function createVisualState(partner) {
  migratePartnerAppearance(partner);
  return {
    appearanceSeed:partner.appearanceSeed,
    characterAppearance:structuredClone(partner.characterAppearance),
    currentExpression:"calm",
    currentPose:"neutral",
    currentBackground:"home-morning",
    equippedVisualLayers:[],
    dialogueSettings:{ speed:"normal", auto:false },
    soundSettings:{ master:1, bgm:.7, effects:.8, voice:1 }
  };
}

export function migrateVisualState(state) {
  if (!state || typeof state !== "object") return state;
  const defaults = createVisualState(state.partner);
  for (const [key,value] of Object.entries(defaults)) state[key] ??= value;
  return state;
}

export function validateCharacterAppearance(appearance) {
  return appearance && typeof appearance === "object" && Object.keys(OPTIONS).every(key=>OPTIONS[key].includes(appearance[key]));
}

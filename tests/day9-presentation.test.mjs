import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getCharacterSprite,getNpcSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY9_PRESENTATION_SCENES,DAY9_REQUIRED_NEW_ASSETS,validateDay9PresentationData} from "../src/day9-presentation-data.mjs";

assert.equal(validateDay9PresentationData(),true);
assert.deepEqual(DAY9_REQUIRED_NEW_ASSETS,{});

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY9_PRESENTATION_SCENES)){
  for(const backgroundId of [scene.backgroundId,...(scene.sequenceBackgroundIds??[])]){
    const path=BACKGROUND_ASSETS[backgroundId];
    assert.ok(path,`${id} background ${backgroundId}`);
    assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  }
  const characterIds=[scene.characterId,...scene.supportingCharacterIds,...(scene.sequenceCharacterIds??[])].filter(Boolean);
  for(const characterId of characterIds){
    const path=characterId==="girlfriend"
      ? getCharacterSprite(characterId,scene.characterId===characterId?scene.expressionId:"smile",scene.characterId===characterId?scene.poseId:"standing")
      : getNpcSprite(characterId);
    assert.ok(path,`${id} character ${characterId}`);
    assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  }
  for(const cueId of scene.sfx){
    assert.ok(audio[cueId],cueId);
    assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
  }
}

assert.equal(DAY9_PRESENTATION_SCENES.S02_SOLO_COMMUTE.characterId,null);
assert.equal(DAY9_PRESENTATION_SCENES.S03_LOBBY_ORIENTATION.characterId,"office-best-male");
assert.equal(DAY9_PRESENTATION_SCENES.S04_SCOPE_SELECTION.characterId,"female-coworker");
assert.ok(DAY9_PRESENTATION_SCENES.S05_AUTHORITY_PRESSURE.supportingCharacterIds.includes("female-coworker"));
assert.equal(DAY9_PRESENTATION_SCENES.S06_BOUNDED_HELP.characterId,"team-lead");
assert.equal(DAY9_PRESENTATION_SCENES.S07_BENCH_DEBRIEF.backgroundId,"neighborhood-street-day");
assert.deepEqual(DAY9_PRESENTATION_SCENES.S08_STOP_AND_RETURN.sequenceBackgroundIds,["office-day","home-morning"]);
assert.ok(!Object.values(DAY9_PRESENTATION_SCENES).some(scene=>["crisis","theme"].includes(scene.bgm.category)));

const scenario=readFileSync(new URL("../docs/day9/DAY9_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
for(const phrase of ["회사 로비·엘리베이터","작은 회의실","회사 앞 벤치","상태 질문 하나, 업무 질문 하나","오늘의 나는 종료합니다."]) assert.ok(scenario.includes(phrase),phrase);
const audit=readFileSync(new URL("../docs/day9/DAY9_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const phrase of ["NEW ART NOT REQUIRED","IMAGE QA NOT APPLICABLE","1599×900","AFFECTION","STATUS_INTEREST","연출·오디오 데이터 계약은 PASS"]) assert.ok(audit.includes(phrase),phrase);

console.log("✓ DAY 9 기존 자산·8 Scene 연출·생활형 BGM/SFX·신규 자산 불필요 계약 검증 통과");

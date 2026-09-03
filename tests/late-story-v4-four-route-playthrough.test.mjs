import assert from "node:assert/strict";
import test from "node:test";
import {isDevelopmentStyleNarration,isInternalStoryStep,isPlayerFacingStoryStep} from "../src/story-player-facing-policy.mjs";
import {recordLateStoryV4Choice} from "../src/late-story-v4-expansion.mjs";

const ROUTES={friendly:0,neutral:1,distant:2,mixed:null};

for(const [route,fixedIndex] of Object.entries(ROUTES)){
  test(`${route} route completes DAY 19 through DAY 30 with JSON save/restore`,async()=>{
    let state={
      day:19,
      storyFlags:{day19CurrentSharedChorePending:true},
      storyHistory:[],
      scenario:{enabled:true,unlockedActions:[],followUpHooks:[],clues:[]}
    };
    for(let day=19;day<=30;day+=1){
      const runtime=await import(`../src/day${day}-campaign-runtime.mjs`);
      const getSegment=runtime[`getLockedDay${day}Segment`];
      const applyChoice=runtime[`applyLockedDay${day}ChoiceState`];
      for(let stage=0;stage<3;stage+=1){
        const steps=getSegment(state,stage);
        const choice=steps.find(step=>step.type==="choice");
        assert.ok(choice,`${route} DAY ${day} stage ${stage} choice`);
        assert.equal(steps.some(step=>step.type==="narration"),false);
        assert.ok(steps.filter(step=>["dialogue","monologue"].includes(step.type)).every(isPlayerFacingStoryStep));
        assert.ok(steps.filter(isInternalStoryStep).every(step=>step.type==="stageAction"));
        assert.equal(steps.some(step=>isDevelopmentStyleNarration(step.text??"")),false);
        const optionIndex=fixedIndex??((day+stage)%3);
        const option=choice.options[optionIndex];
        recordLateStoryV4Choice(state,day,option.id);
        const result=applyChoice(state,option.id);
        assert.equal(result.stage,stage+1);
        state=JSON.parse(JSON.stringify(state));
      }
      const ending=getSegment(state,3);
      assert.equal(ending.at(-1).type,"sceneEnd");
      assert.equal(state.storyFlags[`day${day}V4Choices`].length,3);
      state.storyHistory.push({sceneId:runtime[`LOCKED_DAY${day}_SCENE_ID`],choiceId:`${route}-${day}`,day,response:"완료"});
      state.day=day+1;
    }
    assert.equal(state.storyFlags.marriage30CampaignCompleted,true);
    assert.equal(state.storyFlags.day30CurrentWeddingDecisionCompleted,true);
  });
}

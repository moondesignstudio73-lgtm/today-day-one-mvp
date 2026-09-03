import assert from "node:assert/strict";
import test from "node:test";
import {isInternalStoryStep,isPlayerFacingStoryStep} from "../src/story-player-facing-policy.mjs";
import {recordLateStoryV4Choice,validateLateStoryV4} from "../src/late-story-v4-expansion.mjs";

const TITLES={
  19:"돈으로 사려던 시간",20:"같은 집, 다른 하루",21:"남겨 둔 자리",22:"떠날 수 있는 사람",
  23:"돌아갈 곳",24:"끝내지 못한 문장",25:"좋아한다는 말 다음",26:"사람들 앞의 우리",
  27:"되돌릴 수 없는 말",28:"다시 만나자는 뜻",29:"내일도 내가 고를게",30:"오늘부터, 그다음"
};

for(const [dayText,title] of Object.entries(TITLES)){
  const day=Number(dayText);
  test(`DAY ${day} V4 presents acted scenes with isolated stage directions`,async()=>{
    const runtime=await import(`../src/day${day}-campaign-runtime.mjs`);
    const getSegment=runtime[`getLockedDay${day}Segment`];
    assert.equal(validateLateStoryV4(day),true);
    for(let stage=0;stage<4;stage+=1){
      const state={storyFlags:{[`day${day}RuntimeStage`]:stage},storyHistory:[],scenario:{enabled:true,unlockedActions:[],followUpHooks:[],clues:[]}};
      const steps=getSegment(state,stage);
      assert.ok(steps.some(step=>step.type==="dialogue"),`DAY ${day} stage ${stage} dialogue`);
      assert.ok(steps.filter(step=>step.type==="dialogue").length>=5,`DAY ${day} stage ${stage} dialogue count`);
      assert.equal(steps.some(step=>step.type==="narration"),false,`DAY ${day} stage ${stage} summary narration`);
      assert.ok(steps.filter(step=>step.type==="stageAction").every(isInternalStoryStep));
      assert.ok(steps.filter(step=>["dialogue","monologue"].includes(step.type)).every(isPlayerFacingStoryStep));
      if(stage<3)assert.equal(steps.at(-1).type,"choice");
      else {
        assert.equal(steps.at(-1).type,"sceneEnd");
        const endIndex=steps.findIndex(step=>step.type==="transition"&&/END/.test(step.label));
        const finalDialogue=steps.map(step=>step.type).lastIndexOf("dialogue");
        assert.ok(endIndex>finalDialogue,"DAY END appears after the final dialogue");
      }
    }
    const opening=getSegment({storyFlags:{},storyHistory:[],scenario:{enabled:true,unlockedActions:[],followUpHooks:[],clues:[]}},0);
    assert.ok(opening.some(step=>step.type==="transition"&&step.label.includes(title)));
  });
}

test("late V4 choice labels come from the Notion scenario instead of checklist placeholders",async()=>{
  const day19=await import("../src/day19-campaign-runtime.mjs");
  const day30=await import("../src/day30-campaign-runtime.mjs");
  const state={storyFlags:{},storyHistory:[],scenario:{enabled:true,unlockedActions:[],followUpHooks:[],clues:[]}};
  assert.deepEqual(day19.getLockedDay19Segment(state,0).at(-1).options.map(x=>x.label),[
    "내가 지금 쓸 수 있는 돈부터 보자.","하은이 생각한 하루부터 물어보자.","일단 멋진 계획을 하나 만들어 보고 싶어."
  ]);
  assert.deepEqual(day30.getLockedDay30Segment(state,0).at(-1).options.map(x=>x.label),[
    "뭐라도 먹자.","몸 상태를 보고 오늘 일정을 조금 줄이자.","창문부터 열어 보자."
  ]);
});

test("late V4 choices append to save-compatible per-day history",()=>{
  const state={storyFlags:{day19RuntimeStage:1}};
  recordLateStoryV4Choice(state,19,"choice-a");
  recordLateStoryV4Choice(state,19,"choice-a");
  recordLateStoryV4Choice(state,19,"choice-b");
  assert.deepEqual(state.storyFlags.day19V4Choices,[
    {stage:1,choiceId:"choice-a"},{stage:1,choiceId:"choice-b"}
  ]);
  assert.deepEqual(structuredClone(state).storyFlags.day19V4Choices,state.storyFlags.day19V4Choices);
});

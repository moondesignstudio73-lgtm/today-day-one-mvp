import assert from "node:assert/strict";
import {
  DAY8_CHECKIN_CHOICES,DAY8_PURCHASE_CHOICES,DAY8_SHARE_CHOICES,
  applyLockedDay8ChoiceState,getLockedDay8LegacyChoice,getLockedDay8ResumePresentation
} from "../src/day8-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";

const checkinBudget={
  errand8_change_only_checkin:{confidence:2,stress:0,trust:2,contract:"change_only"},
  errand8_timed_checkin:{confidence:0,stress:-1,trust:3,contract:"timed"},
  errand8_return_only_report:{confidence:3,stress:0,trust:1,contract:"return_only"}
};
const purchaseBudget={
  errand8_compare_labels:{money:-9000,confidence:3,stress:0,affection:0,trust:0,current:"label_comparison"},
  errand8_ask_current_need:{money:-10000,confidence:0,stress:0,affection:1,trust:2,current:"current_need"},
  errand8_buy_small_test:{money:-6000,confidence:2,stress:-1,affection:0,trust:0,current:"small_test"}
};
const shareBudget={
  errand8_sort_receipt_together:{confidence:0,affection:1,trust:3,debrief:"shared_sort"},
  errand8_explain_decision_log:{confidence:2,affection:0,trust:3,debrief:"decision_log"},
  errand8_set_next_solo_boundary:{confidence:3,affection:0,trust:2,debrief:"next_boundary"}
};

function createState(){
  const scenario=createScenarioState("marriage-in-30-days");
  scenario.haeunAffection=18;scenario.haeunTrust=30;scenario.seojinAffection=7;scenario.seojinStatusInterest=11;
  scenario.followUpHooks=["day8-independent-errand"];
  return {gameMode:"marriage-in-30-days",day:8,money:73000,confidence:26,health:72,stress:10,energy:48,storyFlags:{day7OpeningStrategy:"date7_confirm_together",day7RecoveryStrategy:"date7_rest_and_shorten",day7MemoryStrategy:"date7_record_next_rule",day8IndependentErrandPending:true,shared_change_rule:true},storyHistory:[{day:7,sceneId:"m30-day7-first-present-date",choiceId:"date7_record_next_rule",response:"완료"}],scenario};
}

let paths=0;
for(const checkin of DAY8_CHECKIN_CHOICES){
  for(const purchase of DAY8_PURCHASE_CHOICES){
    for(const share of DAY8_SHARE_CHOICES){
      let state=createState();
      const base={money:state.money,confidence:state.confidence,health:state.health,stress:state.stress,energy:state.energy,affection:state.scenario.haeunAffection,trust:state.scenario.haeunTrust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,profileUnlocks:[...state.scenario.profileUnlocks]};
      assert.deepEqual(applyLockedDay8ChoiceState(state,checkin.id),{stage:1});
      state=structuredClone(state);
      assert.equal(getLockedDay8ResumePresentation(state).characterId,null,"stage 1 is protagonist-only");
      assert.deepEqual(applyLockedDay8ChoiceState(state,purchase.id),{stage:2});
      state=structuredClone(state);
      assert.equal(getLockedDay8ResumePresentation(state).characterId,null,"stage 2 is protagonist-only");
      assert.deepEqual(applyLockedDay8ChoiceState(state,share.id),{stage:3});
      state=structuredClone(state);

      const c=checkinBudget[checkin.id],p=purchaseBudget[purchase.id],s=shareBudget[share.id];
      assert.equal(state.money,base.money+p.money,`${purchase.id} money budget`);
      assert.equal(state.confidence,base.confidence+c.confidence+p.confidence+s.confidence,"confidence budget");
      assert.equal(state.stress,base.stress+c.stress+p.stress,"stress budget");
      assert.equal(state.health,base.health,"DAY 8 does not invent recovery");
      assert.equal(state.energy,base.energy,"DAY 8 does not change energy");
      assert.equal(state.scenario.haeunAffection,base.affection+p.affection+s.affection,"affection budget");
      assert.equal(state.scenario.haeunTrust,base.trust+c.trust+p.trust+s.trust,"trust budget");
      assert.equal(state.scenario.seojinAffection,base.seojinAffection,"Seojin affection isolation");
      assert.equal(state.scenario.seojinStatusInterest,base.seojinStatusInterest,"Seojin status isolation");
      assert.deepEqual(state.scenario.profileUnlocks,base.profileUnlocks,"locked profiles stay locked");

      assert.equal(state.storyFlags.independent_errand_contract,c.contract);
      assert.equal(state.storyFlags.current_household_choice,p.current);
      assert.equal(state.storyFlags.return_debrief_rule,s.debrief);
      assert.equal(state.storyFlags.day8RuntimeStage,3);
      assert.equal(state.storyFlags.day8IndependentErrandPending,false);
      assert.equal(state.storyFlags.day8IndependentErrandCompleted,true);
      assert.equal(state.storyFlags.day9SecondOfficeAdaptationPending,true);
      assert.equal(getLockedDay8LegacyChoice(state),share.id);
      assert.deepEqual(getLockedDay8ResumePresentation(state),{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"});
      for(const id of [checkin.id,purchase.id,share.id])assert.equal(state.storyFlags[id],true,`${id} memory`);
      for(const id of ["independent-errand-contract","current-household-choice","return-debrief-rule"])assert.equal(state.scenario.clues.filter(value=>value===id).length,1,`${id} exactly once`);
      for(const id of ["independent-neighborhood-errand","review-current-mail","prepare-limited-office-return"])assert.equal(state.scenario.unlockedActions.filter(value=>value===id).length,1,`${id} exactly once`);
      assert.equal(state.scenario.followUpHooks.filter(value=>value==="day9-second-office-adaptation").length,1,"DAY 9 hook exactly once");
      assert.equal(validateScenarioState(state.gameMode,state.scenario),true);

      const restored=JSON.parse(JSON.stringify(state));
      assert.deepEqual(restored,state,"completed DAY 8 JSON save is lossless");
      assert.equal(applyLockedDay8ChoiceState(restored,"unknown-day8-choice"),null,"unknown choice is rejected");
      paths++;
    }
  }
}

assert.equal(paths,27);
console.log("✓ DAY 8 27경로 효과 예산·프로필 잠금·중복 방지·DAY 9 훅·완료 저장 불변식 PASS");

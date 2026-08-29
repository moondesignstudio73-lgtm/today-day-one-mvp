import assert from "node:assert/strict";
import {DAY10_V3_CHOICES} from "../src/day10-v3-campaign-data.mjs";
import {DAY10_V3_PLAYABLE_SCRIPT_01_12,getDay10V3PlayableScene01To12,validateDay10V3PlayableScript01To12} from "../src/day10-v3-playable-script-01-12.mjs";

assert.equal(validateDay10V3PlayableScript01To12(),true);
assert.deepEqual(DAY10_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+1));
assert.deepEqual(DAY10_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.title),["두 사람분이라고 적기 전에","하은의 하루도 시작됐다","잘하는 요리","오늘 할 수 있는 것","목록에 없는 물건","집에 들어온 봉투","접시 두 개의 거리","잘되고 있다는 말","말리지 않는 계란","생각한 모양이 아닌 것","도착 시간을 묻는 사람","지금 말하면 달라지는 것"]);

const branchKeys=new Set(DAY10_V3_PLAYABLE_SCRIPT_01_12.flatMap(scene=>scene.branches.map(branch=>branch.key)));
for(const choice of DAY10_V3_CHOICES.slice(0,7))for(const option of choice.options)assert.ok(branchKeys.has(option.id),`missing immediate reaction: ${option.id}`);
for(const key of ["prior-confirmed","prior-contact-before-noon","prior-deferred"])assert.ok(branchKeys.has(key),key);

const confirmed={storyFlags:{day10V3PriorDinnerStatus:"CONFIRMED",day10V3Choice1:"dinner10_share_at_seven",day10V3Choice2:"menu10_takeout_and_side",day10V3Choice3:"spend10_consider_one_plate",day10V3Choice4:"work10_title_only",day10V3Choice5:"prep10_admit_not_started",day10V3Choice6:"remake10_fix_one_timed",day10V3Choice7:"timing10_give_estimate"}};
const scene1=getDay10V3PlayableScene01To12(confirmed,1),scene2=getDay10V3PlayableScene01To12(confirmed,2),scene9=getDay10V3PlayableScene01To12(confirmed,9),scene12=getDay10V3PlayableScene01To12(confirmed,12);
assert.equal(scene1.selectedBranch,"prior-confirmed");assert.ok(scene1.steps.some(step=>step.type==="message"&&step.text==="오늘 저녁, 먹고 싶은 거 있어?"));
assert.equal(scene2.selectedBranch,"dinner10_share_at_seven");assert.ok(scene2.steps.some(step=>step.type==="message"&&step.text==="좋아. 많이 만들진 마."));
assert.equal(scene9.selectedBranch,"menu10_takeout_and_side");assert.ok(scene9.steps.some(step=>step.type==="narration"&&step.text.includes("옮겨 담은 것이 더 많은 저녁")));
assert.equal(scene12.selectedBranch,"timing10_give_estimate");assert.ok(scene12.steps.some(step=>step.type==="narration"&&step.text.includes("막연히 금방이라고 쓰지 않고")));

const separate={storyFlags:{day10V3PriorDinnerStatus:"CONTACT_BEFORE_NOON",day10V3Choice1:"dinner10_eat_separately",day10V3Choice2:"menu10_egg_rice",day10V3Choice7:"timing10_ask_help"}};
assert.equal(getDay10V3PlayableScene01To12(separate,1).selectedBranch,"prior-contact-before-noon");
assert.equal(getDay10V3PlayableScene01To12(separate,7).selectedBranch,"dinner10_eat_separately");
assert.ok(getDay10V3PlayableScene01To12(separate,12).steps.some(step=>step.type==="note"&&step.text.includes("잠깐 통화할 수 있어?")));

const source=DAY10_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.sourceMarkdown).join("\n"),serialized=JSON.stringify(DAY10_V3_PLAYABLE_SCRIPT_01_12);
for(const marker of ["장보기 전에 연락.","자기가 식사를 준비하면 상대도 마음을 준비해야 한다고","그게 매번 달라졌어.","사진에는 왜 냄비가 안 보이지.","실제로 끝나 가는 사람에게는 사실이다."])assert.ok(source.includes(marker),marker);
for(const forbidden of ["가짜 하은","전 여자친구","윤서진","사고 범인","MBTI"])assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay10V3PlayableScene01To12({},13),/UNKNOWN/);
console.log("day10-v3-playable-script-01-12.test: all assertions passed");

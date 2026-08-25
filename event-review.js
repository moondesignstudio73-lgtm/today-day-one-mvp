import { SITUATION_EVENTS } from "./src/situation-events-data.mjs";
import { EVENT_DEFINITIONS } from "./src/events-data.mjs";
import { STORY_SCENES } from "./src/story-data.mjs";
import { ACTIONS, PHASES } from "./src/actions-data.mjs";
import { WORLD_MAPS } from "./src/world-map-manager.mjs";

const $=selector=>document.querySelector(selector);
const esc=value=>String(value??"").replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const pretty=value=>value==null||value===""?"—":typeof value==="string"?value:JSON.stringify(value,null,2);
const effectsText=effects=>Object.entries(effects??{}).map(([key,value])=>`${key} ${Number(value)>0?"+":""}${value}`).join(" · ")||"변화 없음";
const conditionText=conditions=>(conditions??[]).map(entry=>entry.message??`${entry.stat??entry.key??"조건"} ${entry.operator??"="} ${pretty(entry.value)}`).join(" / ")||"별도 조건 없음";
const locationIndex=new Map(Object.values(WORLD_MAPS).flatMap(map=>map.locations.map(location=>[location.id,{...location,mapName:map.name,mapId:map.id}])));
const phaseLabel=key=>PHASES.find(phase=>phase.key===key)?.label??key??"—";

function normalizeSituation(event){
  const dialogues=(event.scenes??[]).flatMap((scene,index)=>(scene.dialogueTurns??[]).map(turn=>({...turn,scene:index+1,sceneTitle:scene.title})));
  return {kind:"situation",kindLabel:"상황 이벤트",free:true,source:"src/situation-events-data.mjs",category:event.categoryLabel??event.category,id:event.id,title:event.title,preview:event.message,conditions:event.conditions,location:event.location,time:event.timeOfDay,probability:event.probability,priority:event.priority,cooldown:event.cooldown,effects:event.effects,dayRange:event.dayRange,scenes:event.scenes??[],dialogues,choices:event.choices??[],raw:event};
}
function normalizeRandom(event){
  return {kind:"random",kindLabel:"랜덤 이벤트",free:true,source:"src/events-data.mjs",category:event.kind??"random",id:event.id,title:event.title,preview:event.message,conditions:event.conditions,location:null,time:null,probability:event.probability,priority:event.priority,cooldown:event.cooldown,effects:event.effects,dayRange:null,scenes:[],dialogues:[{speaker:"시스템",text:event.message}],choices:[],raw:event};
}
function normalizeStory(event){
  const campaign=(event.modes??[]).includes("marriage-in-30-days");
  const scene={id:event.id,title:event.title,backgroundId:event.presentation?.backgroundId??event.locationId,timeOfDay:event.presentation?.timeOfDay,transition:event.presentation?.transition};
  return {kind:"story",kindLabel:campaign?"30일 스토리":"공통 스토리",free:!campaign,source:"src/story-data.mjs",category:event.arc??event.eventType??"story",id:event.id,title:event.title,preview:event.message,conditions:[event.window?{message:`DAY ${event.window[0]}~${event.window[1]}`} : null,event.heroineIds?.length?{message:`히로인: ${event.heroineIds.join(", ")}`} : null].filter(Boolean),location:event.locationId??event.presentation?.backgroundId,time:event.presentation?.timeOfDay,probability:null,priority:event.priority,cooldown:null,effects:null,dayRange:event.window,scenes:[scene],dialogues:event.dialogueTurns??[],choices:event.choices??[],raw:event};
}
function normalizeAction(action,phase){
  return {kind:"action",kindLabel:"행동 버튼",free:true,source:"src/actions-data.mjs",category:action.tag??"행동",id:action.id,title:action.title,preview:action.desc,conditions:action.requirements,location:action.locationId,time:phase,probability:action.random?"랜덤":"고정",priority:null,cooldown:null,effects:action.effects,dayRange:null,scenes:[],dialogues:[{speaker:"설명",text:action.desc}],choices:[],raw:{phase,...action}};
}
function normalizeLocation(location,map){
  return {kind:"location",kindLabel:"지도 장소",free:true,source:"src/world-map-manager.mjs",category:location.category,id:location.id,title:`${location.icon??""} ${location.name}`,preview:location.description,conditions:location.adultOnly?[{message:"성인 전용"}]:[],location:`${map.name} · (${location.x}, ${location.y})`,time:null,probability:null,priority:null,cooldown:null,effects:null,dayRange:null,scenes:[],dialogues:[{speaker:"장소 설명",text:location.description}],choices:[],raw:{mapId:map.id,mapName:map.name,...location}};
}

const items=[
  ...SITUATION_EVENTS.map(normalizeSituation),
  ...EVENT_DEFINITIONS.map(normalizeRandom),
  ...STORY_SCENES.map(normalizeStory),
  ...Object.entries(ACTIONS).flatMap(([phase,list])=>list.map(action=>normalizeAction(action,phase))),
  ...Object.values(WORLD_MAPS).flatMap(map=>map.locations.map(location=>normalizeLocation(location,map)))
];

function movementCount(item){return new Set((item.scenes??[]).map(scene=>scene.backgroundId).filter(Boolean)).size;}
function hasNegative(item){return Object.values(item.effects??{}).some(value=>Number(value)<0)||(item.choices??[]).some(choice=>Object.values(choice.effects??{}).some(value=>Number(value)<0));}
function searchText(item){return JSON.stringify(item.raw).toLowerCase();}
function formatLocation(value){const found=locationIndex.get(value);return found?`${found.mapName} · ${found.name} (${found.id})`:value??"—";}
function chip(text,className=""){return `<span class="chip ${className}">${esc(text)}</span>`;}

function renderSummary(){
  const situation=items.filter(item=>item.kind==="situation"),dialogues=items.reduce((sum,item)=>sum+item.dialogues.length,0),moves=situation.reduce((sum,item)=>sum+movementCount(item),0);
  const cards=[["전체 검토 항목",items.length],["상황 이벤트",situation.length],["행동 버튼",items.filter(item=>item.kind==="action").length],["전체 대사",dialogues],["상황 배경 전환",moves]];
  $("#summary").innerHTML=cards.map(([label,value])=>`<article class="summary-card"><small>${esc(label)}</small><b>${value.toLocaleString("ko-KR")}</b></article>`).join("");
}
function setupFilters(){
  const kinds=[...new Map(items.map(item=>[item.kind,item.kindLabel])).entries()];
  $("#typeFilter").innerHTML=`<option value="all">전체 구성</option>`+kinds.map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join("");
  const categories=[...new Set(items.map(item=>item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ko"));
  $("#categoryFilter").insertAdjacentHTML("beforeend",categories.map(category=>`<option value="${esc(category)}">${esc(category)}</option>`).join(""));
}
function renderScenes(item){
  if(!item.scenes.length)return `<p>별도 장면 전환 없음</p>`;
  return item.scenes.map((scene,index)=>`<article class="scene-row"><header><b>${index+1}. ${esc(scene.title??scene.id??"장면")}</b><code>${esc(scene.backgroundId??"배경 미지정")}</code></header><div>${chip(scene.timeOfDay??item.time??"시간 미지정")}${chip(scene.transition??"전환 미지정")}${chip(`${(scene.dialogueTurns??[]).length} 대사`)}</div></article>`).join("");
}
function renderDialogues(item){
  if(!item.dialogues.length)return `<p>등록된 대사 없음</p>`;
  return item.dialogues.map((turn,index)=>`<div class="dialogue-row"><span>${index+1}. ${turn.type==="narration"?"[내레이션]":""}</span> <b>${esc(turn.speaker??"내레이션")}</b> ${esc(turn.text??turn.message??"")}</div>`).join("");
}
function renderChoices(item){
  if(!item.choices.length)return `<p>선택지 없음</p>`;
  return item.choices.map((choice,index)=>`<article class="choice-row"><header><strong>${index+1}. ${esc(choice.label??choice.title??choice.id)}</strong><code>${esc(choice.id??"")}</code></header><p>${esc(choice.response??choice.result??choice.message??"결과 문구 없음")}</p><div class="effects">${esc(effectsText(choice.effects))}</div></article>`).join("");
}
function renderCard(item){
  const moves=movementCount(item),negative=hasNegative(item),modeClass=item.free?"":"campaign";
  const chips=[chip(item.kindLabel),chip(item.category),item.dayRange?chip(`DAY ${item.dayRange.join("~")}`):"",item.time?chip(phaseLabel(item.time)):"",moves>=3?chip(`화면 이동 ${moves}곳`,"alert"):chip(`화면 이동 ${moves}곳`),item.dialogues.length>=20?chip(`대사 ${item.dialogues.length}개`,"alert"):chip(`대사 ${item.dialogues.length}개`),negative?chip("부정 결과 포함","bad"):""].join("");
  return `<details class="event-card ${modeClass}" data-kind="${item.kind}" data-category="${esc(item.category)}"><summary><div class="event-title"><small>${item.free?"FREE ROMANCE":"30-DAY CAMPAIGN"}</small><strong>${esc(item.title)}</strong><code>${esc(item.id)}</code></div><div class="chips">${chips}</div><div class="event-preview">${esc(item.preview)}</div></summary><div class="event-body"><section class="review-section"><h3>발생 조건과 결과</h3><dl><dt>조건</dt><dd>${esc(conditionText(item.conditions))}</dd><dt>DAY 범위</dt><dd>${esc(item.dayRange?.join(" ~ ")??"—")}</dd><dt>시간</dt><dd>${esc(phaseLabel(item.time))}</dd><dt>확률</dt><dd>${esc(item.probability??"—")}</dd><dt>우선순위</dt><dd>${esc(item.priority??"—")}</dd><dt>쿨다운</dt><dd>${esc(item.cooldown??"—")}</dd><dt>기본 결과</dt><dd class="effects">${esc(effectsText(item.effects))}</dd></dl></section><section class="review-section"><h3>장소와 화면 이동</h3><dl><dt>발생 장소</dt><dd>${esc(formatLocation(item.location))}</dd><dt>서로 다른 배경</dt><dd>${moves}곳</dd><dt>원본 파일</dt><dd class="source-link">${esc(item.source)}</dd></dl>${renderScenes(item)}</section><section class="review-section full"><h3>전체 텍스트 (${item.dialogues.length})</h3>${renderDialogues(item)}</section><section class="review-section full"><h3>선택지와 결과 (${item.choices.length})</h3>${renderChoices(item)}</section><details class="review-section full"><summary><h3>원본 데이터 보기</h3></summary><pre class="raw">${esc(pretty(item.raw))}</pre></details></div></details>`;
}
function filteredItems(){
  const query=$("#searchInput").value.trim().toLowerCase(),kind=$("#typeFilter").value,category=$("#categoryFilter").value,issue=$("#issueFilter").value,freeOnly=$("#freeOnly").checked;
  return items.filter(item=>(!freeOnly||item.free)&&(kind==="all"||item.kind===kind)&&(category==="all"||item.category===category)&&(!query||searchText(item).includes(query))&&(issue==="all"||(issue==="movement"&&movementCount(item)>=3)||(issue==="long"&&item.dialogues.length>=20)||(issue==="no-choice"&&!item.choices.length)||(issue==="negative"&&hasNegative(item))));
}
function render(){
  const visible=filteredItems();$("#resultCount").textContent=`${visible.length.toLocaleString("ko-KR")}개 표시`;
  $("#eventList").innerHTML=visible.length?visible.map(renderCard).join(""):$("#emptyTemplate").innerHTML;
}

renderSummary();setupFilters();render();
for(const control of [$("#searchInput"),$("#typeFilter"),$("#categoryFilter"),$("#issueFilter"),$("#freeOnly")])control.addEventListener(control.tagName==="INPUT"&&control.type==="search"?"input":"change",render);
$("#expandAll").addEventListener("click",()=>document.querySelectorAll("#eventList>.event-card").forEach(card=>card.open=true));
$("#collapseAll").addEventListener("click",()=>document.querySelectorAll("#eventList>.event-card").forEach(card=>card.open=false));

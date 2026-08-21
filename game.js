import { advanceTime, applyEffects, clamp, createInitialState, determineEnding } from "./src/game-core.mjs";
import { SaveManager } from "./src/save-manager.mjs";
import { generateGirlfriend, getVisibleTraitRows, observePersonality } from "./src/girlfriend-manager.mjs";
import { getEventDiagnostics, rollEvent } from "./src/event-manager.mjs";

const $ = (selector) => document.querySelector(selector);

const partners = [
  { name: "서연", bio: "회사원 · 차분한 인상", traits: [["연락 중요도", "높음"], ["질투", "보통"], ["물질성향", "낮음"], ["독립성", "높음"], ["결혼관", "신중함"]], weights: { contact: 1.4, money: .6, trust: 1.2 } },
  { name: "하린", bio: "대학생 · 솔직한 성격", traits: [["연락 중요도", "보통"], ["질투", "높음"], ["물질성향", "보통"], ["애정표현", "적극적"], ["결혼관", "낭만적"]], weights: { contact: 1, money: 1, trust: 1.4 } },
  { name: "지우", bio: "디자이너 · 자유로운 영혼", traits: [["연락 중요도", "낮음"], ["질투", "낮음"], ["물질성향", "높음"], ["독립성", "매우 높음"], ["결혼관", "현실적"]], weights: { contact: .7, money: 1.5, trust: .8 } }
];

const phases = [
  { key:"morning", label:"MORNING · 아침", time:"08:00", icon:"☀", title:"새로운 하루의 시작", text:"연인의 메시지와 함께 아침이 밝았다. 오늘의 첫 선택은?" },
  { key:"day", label:"DAYTIME · 낮", time:"12:30", icon:"◐", title:"바쁜 하루의 한가운데", text:"업무도 관계도 놓칠 수 없다. 점심시간을 어떻게 보낼까?" },
  { key:"evening", label:"EVENING · 저녁", time:"19:00", icon:"◇", title:"퇴근 후의 선택", text:"하루 중 가장 자유로운 시간. 누구와 무엇을 할지 선택하자." },
  { key:"night", label:"NIGHT · 밤", time:"23:20", icon:"☾", title:"하루가 끝나기 전에", text:"잠들기 전, 오늘을 마무리할 마지막 시간이 남았다." }
];

const actions = {
  morning: [
    { icon:"💬", title:"다정하게 연락하기", desc:"좋은 아침 인사로 서로의 하루를 시작한다.", cost:"시간 1", fx:{ affection:16, trust:10, energy:-3 }, tag:"연락" },
    { icon:"🏃", title:"아침 운동", desc:"가볍게 뛰며 몸과 자신감을 관리한다.", cost:"시간 1", fx:{ health:8, charm:5, energy:-7, stress:-4 }, tag:"자기관리" },
    { icon:"🛌", title:"조금 더 자기", desc:"피로를 풀지만 출근 준비는 아슬아슬하다.", cost:"시간 1", fx:{ energy:15, work:-4, stress:-5 }, tag:"휴식" },
    { icon:"☕", title:"일찍 출근하기", desc:"커피 한 잔과 함께 업무를 먼저 시작한다.", cost:"수입 +₩25,000", fx:{ money:25000, work:8, energy:-8, stress:5 }, tag:"성공" }
  ],
  day: [
    { icon:"💼", title:"업무에 집중하기", desc:"성과를 내고 수입과 능력을 높인다.", cost:"수입 +₩45,000", fx:{ money:45000, work:10, energy:-10, stress:8, affection:-4 }, tag:"성공" },
    { icon:"🍝", title:"연인과 점심", desc:"잠깐이라도 얼굴을 보며 함께 식사한다.", cost:"₩38,000", fx:{ money:-38000, affection:22, trust:8, stress:-7 }, tag:"데이트" },
    { icon:"👥", title:"동료와 점심", desc:"회사 사람들과 가까워지고 정보를 얻는다.", cost:"₩14,000", fx:{ money:-14000, social:9, work:4, affection:-2 }, tag:"인간관계" },
    { icon:"📈", title:"주식 확인하기", desc:"변동성 있는 시장에 작은 승부를 건다.", cost:"위험", random:true, fx:{ stress:5 }, tag:"투자" }
  ],
  evening: [
    { icon:"🌙", title:"근사한 데이트", desc:"예약해 둔 레스토랑에서 특별한 저녁을 보낸다.", cost:"₩120,000", fx:{ money:-120000, affection:42, trust:12, stress:-12, energy:-8 }, tag:"데이트" },
    { icon:"🛍️", title:"선물 쇼핑", desc:"그녀가 좋아할 만한 작은 선물을 고른다.", cost:"₩75,000", fx:{ money:-75000, affection:26, charm:3 }, tag:"쇼핑" },
    { icon:"🌃", title:"야근하기", desc:"관계보다 오늘의 성과를 선택한다.", cost:"수입 +₩70,000", fx:{ money:70000, work:12, affection:-12, energy:-16, stress:12 }, tag:"성공" },
    { icon:"🍻", title:"동료의 술자리", desc:"새로운 인맥, 혹은 위험한 인연이 시작될 수 있다.", cost:"₩45,000 · 위험", fx:{ money:-45000, social:12, trust:-8, stress:-8 }, tag:"유혹" }
  ],
  night: [
    { icon:"♥", title:"통화하며 하루 마무리", desc:"오늘 있었던 일을 솔직하게 나눈다.", cost:"시간 1", fx:{ affection:20, trust:18, energy:-5 }, tag:"연락" },
    { icon:"📱", title:"짧게 메시지만", desc:"바쁘다는 핑계로 간단한 인사만 남긴다.", cost:"시간 0", fx:{ affection:3, trust:1 }, tag:"연락" },
    { icon:"🛒", title:"온라인 쇼핑", desc:"새 옷으로 패션과 기분을 챙긴다.", cost:"₩55,000", fx:{ money:-55000, charm:8, stress:-5 }, tag:"쇼핑" },
    { icon:"💤", title:"일찍 잠들기", desc:"내일을 위해 충분히 휴식한다.", cost:"시간 1", fx:{ energy:20, health:5, stress:-8, affection:-5 }, tag:"휴식" }
  ]
};

let state;

function startGame() { state = createInitialState(generateGirlfriend()); showGame(); SaveManager.save(state); }
function showGame() { $("#introScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden"); $("#saveButton").classList.remove("hidden"); $("#debugButton").classList.remove("hidden"); render(); }
function money(value) { return `₩ ${Math.round(value).toLocaleString("ko-KR")}`; }

function render() {
  const p = state.partner, phase = phases[state.phase];
  $("#dayLabel").textContent = state.day; $("#phaseIcon").textContent = phase.icon; $("#phaseLabel").textContent = phase.label;
  $("#clockLabel").textContent = phase.time; $("#sceneTitle").textContent = state.day === 1 && state.phase === 0 ? "첫날의 아침" : phase.title;
  $("#sceneText").textContent = phase.text; $("#partnerName").textContent = p.name; $("#partnerBio").textContent = p.bio;
  $("#affectionValue").textContent = Math.round(state.affection); $("#trustValue").textContent = Math.round(state.trust);
  $("#affectionBar").style.width = `${state.affection/10}%`; $("#trustBar").style.width = `${state.trust/10}%`;
  const traitRows = getVisibleTraitRows(state); const revealedCount = traitRows.filter(row => row.revealed).length;
  $("#moneyValue").textContent = money(state.money); $("#traitProgress").textContent = `${revealedCount} / 5`;
  $("#lifeStatus").textContent = state.stress > 75 ? "한계에 가까움" : state.energy < 25 ? "휴식이 필요함" : state.affection > 750 ? "사랑이 깊어지는 중" : "나쁘지 않은 하루";
  $("#traitList").innerHTML = traitRows.map(row => row.revealed ? `<div class="trait"><span>${row.name}</span><b>${row.value}</b></div>` : `<div class="trait locked"><span>${row.name}</span><b>${row.confidence ? `추론 ${row.confidence}%` : "???"}</b></div>`).join("");
  const stats = [["체력",state.energy],["건강",state.health],["스트레스",state.stress],["매력",state.charm],["업무 능력",state.work],["사회성",state.social]];
  $("#statList").innerHTML = stats.map(([name,val])=>`<div class="stat"><div class="stat-head"><span>${name}</span><b>${Math.round(val)}</b></div><div class="stat-track"><i style="width:${clamp(val)}%;background:${name==='스트레스'?'#e5846d':''}"></i></div></div>`).join("");
  $("#actionGrid").innerHTML = actions[phase.key].map((a,i)=>`<button class="action-card ${state.selected===i?'selected':''}" data-index="${i}"><span class="action-icon">${a.icon}</span><span class="cost">${a.cost}</span><h3>${a.title}</h3><p>${a.desc}</p></button>`).join("");
  document.querySelectorAll(".action-card").forEach(btn=>btn.addEventListener("click",()=>selectAction(Number(btn.dataset.index))));
  $("#eventLog").innerHTML = state.logs.length ? state.logs.slice(-4).reverse().map(l=>`<div class="log-item"><b>${l.time}</b><span>${l.text}</span></div>`).join("") : `<div class="log-item"><b>DAY 1</b><span>두 사람의 첫 번째 이야기가 시작되었습니다.</span></div>`;
  $("#turnCount").textContent = `${state.phase+1}번째 선택`; $("#nextButton").disabled = state.selected === null;
  $("#nextButton").textContent = state.selected === null ? "행동을 선택해 주세요" : (state.phase === 3 ? "하루 마무리하기 →" : "이 행동으로 결정 →");
}

function selectAction(index) { state.selected = index; render(); }
function applyAction() {
  if (state.selected === null) return;
  const phase = phases[state.phase], action = actions[phase.key][state.selected];
  if (action.fx.money < 0 && state.money + action.fx.money < 0) { toast("돈이 부족해 이 행동을 할 수 없어요."); return; }
  const fx = {...action.fx};
  if (action.tag === "연락") { fx.affection = (fx.affection||0)*state.partner.weights.contact; fx.trust = (fx.trust||0)*state.partner.weights.trust; }
  if (["데이트","쇼핑"].includes(action.tag)) fx.affection = (fx.affection||0)*state.partner.weights.money;
  if (action.random) { const win = Math.random() > .48; fx.money = win ? Math.round(40000+Math.random()*90000) : -Math.round(25000+Math.random()*70000); toast(win ? `투자 성공! ${money(fx.money)}` : `투자 손실 ${money(Math.abs(fx.money))}`); }
  applyEffects(state, fx);
  state.choices.push(action.tag); state.logs.push({time:`DAY ${state.day} · ${phase.time}`,text:`${action.title} — ${resultText(action)}`});
  const clue = observePersonality(state, action.tag);
  if (clue?.revealed) toast(`${state.partner.name}의 성향을 하나 알아냈어요.`);
  state.selected = null;
  const finishedDay = state.phase === 3;
  advanceTime(state);
  if (finishedDay) dailyEvent();
  const event = rollEvent(state);
  if (event) {
    state.logs.push({time:`DAY ${state.day} · EVENT`,text:`${event.title} — ${event.message}`});
    toast(`EVENT · ${event.title}`);
  }
  SaveManager.save(state);
  if (state.day > 30) showEnding(); else render();
}

function resultText(a) { if(a.tag==="데이트") return `${state.partner.name}의 표정이 한결 밝아졌다.`; if(a.tag==="성공") return "미래를 위한 한 걸음을 내디뎠다."; if(a.tag==="유혹") return "새로운 인연의 기척이 느껴진다."; if(a.tag==="연락") return "짧은 대화가 두 사람을 조금 더 가깝게 했다."; return "선택의 결과가 하루에 남았다."; }
function dailyEvent() { if(state.day%5===0){ const good=Math.random()>.45; const amount=good?60000:-35000; state.money+=amount; state.logs.push({time:`DAY ${state.day}`,text:good?"예상하지 못한 성과급이 들어왔다.":"갑작스러운 생활비 지출이 생겼다."}); } if(state.day%7===0){state.affection=clamp(state.affection-18,0,1000);state.trust=clamp(state.trust-8,0,1000);} }

function openChat() {
  const cold = state.trust < 350, warm = state.affection > 700;
  const greeting = cold ? "오늘은 왜 이렇게 연락이 늦었어?" : warm ? "오늘도 목소리 듣고 싶었는데 ♥" : "뭐 해? 오늘 하루는 어땠어?";
  $("#modalContent").innerHTML=`<span class="eyebrow">CHAT WITH ${state.partner.name}</span><h2>${state.partner.name}와의 대화</h2><div class="chat-window"><div class="message her">${greeting}</div><div id="chatReply"></div></div><div class="chat-options"><button class="chat-option" data-reply="다정">나도 네 생각하고 있었어. 오늘 있었던 일 말해줄까?</button><button class="chat-option" data-reply="솔직">오늘 조금 힘들었어. 그래도 네 연락 보니까 좋다.</button><button class="chat-option" data-reply="무심">지금 좀 바빠. 나중에 얘기하자.</button></div>`;
  $("#modal").classList.remove("hidden"); document.querySelectorAll(".chat-option").forEach(b=>b.addEventListener("click",()=>chatReply(b.dataset.reply,b.textContent)));
}
function chatReply(type,text){ $("#chatReply").innerHTML=`<div class="message me">${text}</div><div class="message her">${type==="무심"?"알겠어… 방해 안 할게.":type==="솔직"?"힘들었구나. 내가 들어줄게.":"나도! 얼른 얘기해 줘 😊"}</div>`; state.affection=clamp(state.affection+(type==="무심"?-8:6),0,1000); state.trust=clamp(state.trust+(type==="솔직"?8:type==="무심"?-5:3),0,1000); SaveManager.save(state); document.querySelector(".chat-options").remove(); }

function openDebug() {
  if (!state) return;
  const keys = ["day","phase","money","health","energy","stress","charm","work","social","affection","trust","excitement","attachment","conflict","relationshipStress"];
  const stateRows = keys.map(key=>`<div class="debug-stat"><span>${key}</span><b>${Math.round(state[key])}</b></div>`).join("");
  const personalityRows = Object.entries(state.partner.personality).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("");
  const eventRows = getEventDiagnostics(state).map(event=>`<div class="debug-event ${event.eligible?'':event.cooldownRemaining?'cooldown':'ineligible'}"><div><b>${event.title}</b><span>${Math.round(event.probability*100)}%</span></div><small>priority ${event.priority} · ${event.cooldownRemaining?`cooldown ${event.cooldownRemaining}일`:event.conditionsMet?'발생 가능':'조건 불충족'}</small></div>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">DEVELOPER MODE</span><h2>Simulation Debug</h2><p>저장에는 영향을 주지 않는 읽기 전용 상태 패널입니다.</p><h3>Game State</h3><div class="debug-grid">${stateRows}</div><h3>${state.partner.name} · Hidden Personality</h3><div class="debug-grid">${personalityRows}</div><h3>Event Diagnostics</h3><div class="debug-events">${eventRows}</div>`;
  $("#modal").classList.remove("hidden");
}

function showEnding(){ state.ended=true; const [title, desc] = determineEnding(state);
  $("#modalContent").innerHTML=`<span class="eyebrow">DAY 30 · YOUR ENDING</span><h2>${title}</h2><div class="ending-score">${Math.round((state.affection+state.trust)/20)}</div><p>${desc}</p><p><b>최종 기록</b><br>호감도 ${Math.round(state.affection)} · 신뢰도 ${Math.round(state.trust)} · 자산 ${money(state.money)}</p><button class="primary-button" onclick="location.reload()">새로운 30일 시작하기 →</button>`; $("#modal").classList.remove("hidden"); }
function toast(message){ const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200); }

function loadGame() { const loaded = SaveManager.load(); if (!loaded) { toast("불러올 수 있는 저장 데이터가 없어요."); return; } state = loaded; showGame(); toast(`DAY ${state.day} 저장 데이터를 불러왔어요.`); }
function saveGame() { if (!state) return; SaveManager.save(state); toast(`DAY ${state.day} 진행 상황을 저장했어요.`); }

if (!SaveManager.hasSave()) $("#loadButton").classList.add("hidden");
$("#debugButton").addEventListener("click",openDebug);
$("#startButton").addEventListener("click",startGame); $("#nextButton").addEventListener("click",applyAction); $("#chatButton").addEventListener("click",openChat); $("#saveButton").addEventListener("click",saveGame); $("#loadButton").addEventListener("click",loadGame); $("#closeModal").addEventListener("click",()=>$("#modal").classList.add("hidden")); $("#resetButton").addEventListener("click",()=>{ if(confirm("새 게임을 시작할까요? 현재 진행은 사라집니다.")) { SaveManager.clear(); location.reload(); } });

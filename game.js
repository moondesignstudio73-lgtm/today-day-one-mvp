import { advanceTime, applyEffects, clamp, createInitialState, determineEnding } from "./src/game-core.mjs";
import { SaveManager } from "./src/save-manager.mjs";
import { generateGirlfriend, getVisibleTraitRows, observePersonality } from "./src/girlfriend-manager.mjs";
import { getEventDiagnostics, rollEvent } from "./src/event-manager.mjs";
import { ACTIONS as actions, PHASES as phases } from "./src/actions-data.mjs";
import { getActionAvailability } from "./src/action-manager.mjs";
import { calculateActionEffects } from "./src/consequence-manager.mjs";
import { getRelationshipState } from "./src/relationship-manager.mjs";
import { addJobProgress, getCareerSummary } from "./src/job-manager.mjs";
import { appendTransaction, BOND_PURCHASE_AMOUNT, BOND_RETURN_RATE, BOND_TERM_DAYS, calculatePaycheck, depositSavings, getAssetSummary, getEconomySummary, getNextPayday, processDayEndEconomy, purchaseBond, recordTransaction, SAVINGS_TRANSFER_AMOUNT, withdrawSavings } from "./src/economy-manager.mjs?v=2";
import { acquireActionItem, equipItem, getEffectiveAppearance, getEquipmentBonuses, purchaseItem } from "./src/inventory-manager.mjs";
import { getItem, ITEMS } from "./src/items-data.mjs?v=2";
import { giveGift } from "./src/gift-manager.mjs";
import { applyNpcActionEffects, getNpcRelationshipStatus } from "./src/npc-manager.mjs";
import { getTemptationOpportunity, resolveTemptation, TEMPTATION_CHOICES } from "./src/temptation-manager.mjs";
import { applyRivalPressure, calculateRivalRisk } from "./src/rival-manager.mjs";
import { calculateBreakupRisk, evaluateBreakup } from "./src/conflict-manager.mjs";
import { buildConversationContext, getContextualOpening, recordConversationTurn } from "./src/conversation-manager.mjs";
import { requestGirlfriendReply } from "./src/ai-chat-client.mjs";
import { advanceStockMarket, buyStock, getPortfolioSummary, sellStock } from "./src/investment-manager.mjs";
import { buyInstantLottery, DAILY_TICKET_LIMIT, getLotterySummary, LOTTERY_TICKET_PRICE } from "./src/lottery-manager.mjs";
import { analyzePlayHistory } from "./src/ending-manager.mjs";
import { SoundManager } from "./src/sound-manager.mjs";
import { recordMemory } from "./src/memory-manager.mjs";
import { maybeGenerateInitiatedMessage } from "./src/initiated-message-manager.mjs";
import { getWrappedFocusIndex } from "./src/ui-manager.mjs";

const $ = (selector) => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));

let state;
const sound = new SoundManager();
let modalReturnFocus = null;
const modalFocusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

function openModal() {
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) modalReturnFocus = document.activeElement;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => $("#closeModal").focus());
}

function closeModal() {
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) return;
  modal.classList.add("hidden");
  if (modalReturnFocus?.isConnected) modalReturnFocus.focus();
  modalReturnFocus = null;
}

function handleModalKeydown(event) {
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...modal.querySelectorAll(modalFocusableSelector)].filter(element => !element.closest(".hidden"));
  if (!focusable.length) return;
  const currentIndex = focusable.indexOf(document.activeElement);
  const shouldWrap = currentIndex < 0 || (event.shiftKey && currentIndex === 0) || (!event.shiftKey && currentIndex === focusable.length - 1);
  if (!shouldWrap) return;
  event.preventDefault();
  focusable[getWrappedFocusIndex(currentIndex, focusable.length, event.shiftKey)].focus();
}

function renderSoundButton(){ const button=$("#soundButton");button.textContent=sound.enabled?"♪ ON":"♪ OFF";button.setAttribute("aria-pressed",String(sound.enabled));button.title=sound.enabled?"효과음 끄기":"효과음 켜기"; }

function startGame() { state = createInitialState(generateGirlfriend()); showGame(); SaveManager.save(state); }
function showGame() { state.actionHistory ??= []; $("#introScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden"); $("#saveButton").classList.remove("hidden"); $("#debugButton").classList.remove("hidden"); $("#inventoryButton").classList.remove("hidden"); $("#shopButton").classList.remove("hidden"); $("#financeButton").classList.remove("hidden"); $("#careerButton").classList.remove("hidden"); $("#peopleButton").classList.remove("hidden"); $("#investmentButton").classList.remove("hidden"); render(); }
function money(value) { return `₩ ${Math.round(value).toLocaleString("ko-KR")}`; }

function render() {
  const p = state.partner, phase = phases[state.phase];
  $("#dayLabel").textContent = state.day; $("#phaseIcon").textContent = phase.icon; $("#phaseLabel").textContent = phase.label;
  $("#clockLabel").textContent = phase.time; $("#sceneTitle").textContent = state.day === 1 && state.phase === 0 ? "첫날의 아침" : phase.title;
  $("#sceneText").textContent = phase.text; $("#partnerName").textContent = p.name; $("#partnerBio").textContent = p.bio;
  const relationship = getRelationshipState(state); $("#relationshipState").textContent = `● ${relationship.label}`; $("#relationshipState").dataset.tone = relationship.tone; $("#relationshipState").title = relationship.description;
  $("#affectionValue").textContent = Math.round(state.affection); $("#trustValue").textContent = Math.round(state.trust);
  $("#affectionBar").style.width = `${state.affection/10}%`; $("#trustBar").style.width = `${state.trust/10}%`;
  const traitRows = getVisibleTraitRows(state); const revealedCount = traitRows.filter(row => row.revealed).length;
  $("#moneyValue").textContent = money(state.money); $("#jobValue").textContent = `${state.job.name} · Lv.${state.jobLevel}`; $("#traitProgress").textContent = `${revealedCount} / 5`;
  $("#lifeStatus").textContent = state.fatigue >= 70 ? "피로가 누적되는 중" : state.stress > 75 ? "한계에 가까움" : state.energy < 25 ? "휴식이 필요함" : state.confidence >= 70 ? "자신감이 넘치는 중" : state.affection > 750 ? "사랑이 깊어지는 중" : "나쁘지 않은 하루";
  $("#traitList").innerHTML = traitRows.map(row => row.revealed ? `<div class="trait"><span>${row.name}</span><b>${row.value}</b></div>` : `<div class="trait locked"><span>${row.name}</span><b>${row.confidence ? `${row.hint} · ${row.confidence}%` : "???"}</b></div>`).join("");
  const appearance = getEffectiveAppearance(state);
  const stats = [["체력",state.energy],["피로",state.fatigue],["건강",state.health],["스트레스",state.stress],[appearance.bonuses.attractiveness?`매력 +${appearance.bonuses.attractiveness}`:"매력",appearance.charm],[appearance.bonuses.fashion?`패션 +${appearance.bonuses.fashion}`:"패션",appearance.fashion],["자신감",state.confidence],["업무 능력",state.work],["사회성",state.social]];
  $("#statList").innerHTML = stats.map(([name,val])=>`<div class="stat"><div class="stat-head"><span>${name}</span><b>${Math.round(val)}</b></div><div class="stat-track"><i style="width:${clamp(val)}%;background:${name==='스트레스'?'#e5846d':''}"></i></div></div>`).join("");
  $("#actionGrid").innerHTML = actions[phase.key].map((a,i)=>{ const availability=getActionAvailability(state,a); return `<button class="action-card ${state.selected===i?'selected':''} ${availability.available?'':'locked'}" data-index="${i}" ${availability.available?'':'disabled'}><span class="action-icon">${a.icon}</span><span class="cost">${availability.available?a.costLabel:'🔒 '+availability.reason}</span><h3>${a.title}</h3><p>${a.desc}</p></button>`; }).join("");
  $("#eventLog").innerHTML = state.logs.length ? state.logs.slice(-4).reverse().map(l=>`<div class="log-item"><b>${l.time}</b><span>${l.text}</span></div>`).join("") : `<div class="log-item"><b>DAY 1</b><span>두 사람의 첫 번째 이야기가 시작되었습니다.</span></div>`;
  $("#turnCount").textContent = `${state.phase+1}번째 선택`; $("#nextButton").disabled = state.selected === null;
  $("#nextButton").textContent = state.selected === null ? "행동을 선택해 주세요" : (state.phase === 3 ? "하루 마무리하기 →" : "이 행동으로 결정 →");
}

function selectAction(index) { state.selected = index; sound.play("select"); render(); }
function handleActionGridClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest(".action-card");
  if (!button || button.disabled) return;
  selectAction(Number(button.dataset.index));
}
function applyAction() {
  if (state.selected === null) return;
  const phase = phases[state.phase], action = actions[phase.key][state.selected];
  const availability = getActionAvailability(state, action);
  if (!availability.available) { toast(availability.reason); state.selected=null; render(); return; }
  if ((action.effects.money ?? 0) < 0 && state.money + action.effects.money < 0) { toast("돈이 부족해 이 행동을 할 수 없어요."); return; }
  const consequence = calculateActionEffects(state, action);
  const fx = consequence.effects;
  if (action.random) { const win = Math.random() > .48; fx.money = win ? Math.round(40000+Math.random()*90000) : -Math.round(25000+Math.random()*70000); toast(win ? `투자 성공! ${money(fx.money)}` : `투자 손실 ${money(Math.abs(fx.money))}`); }
  applyEffects(state, fx);
  if (fx.money) appendTransaction(state, { category:"action", label:action.title, amount:Math.round(fx.money) });
  const acquiredItem = acquireActionItem(state, action);
  if (acquiredItem) { const giftResult=action.autoGift?giveGift(state,acquiredItem.instanceId):null; toast(giftResult?`${giftResult.item.name} 선물 · “${giftResult.reaction.reaction}”`:`${getItem(acquiredItem.itemId).name} 획득${acquiredItem.equipped?' · 장착 완료':''}`); }
  const promotion = addJobProgress(state, action, fx);
  if (promotion) toast(`승진! 직업 레벨 ${promotion.level} · 수입 보정 상승`);
  const npcResult = applyNpcActionEffects(state, action);
  if (npcResult) state.logs.push({time:`DAY ${state.day} · NPC`,text:`${npcResult.npc.name}와의 관계가 변했다.`});
  const rivalResult = applyRivalPressure(state, action);
  if (rivalResult?.record.delta > 0) state.logs.push({time:`DAY ${state.day} · RIVAL`,text:`${rivalResult.rival.name}의 접근 위험이 높아졌다.`});
  state.choices.push(action.tag); state.actionHistory.push({ day:state.day, phase:state.phase, actionId:action.id, tag:action.tag }); state.logs.push({time:`DAY ${state.day} · ${phase.time}`,text:`${action.title} — ${resultText(action)}`});
  if (["데이트","유혹","쇼핑"].includes(action.tag)) recordMemory(state,{type:"action",summary:action.title,importance:action.tag==="유혹"?4:2,tags:[action.tag]});
  const clue = observePersonality(state, action.tag);
  if (clue?.revealed) toast(`${state.partner.name}의 성향을 하나 알아냈어요.`);
  state.selected = null;
  const finishedDay = state.phase === 3; const completedDay = state.day;
  advanceTime(state);
  const initiatedMessage = maybeGenerateInitiatedMessage(state);
  if (initiatedMessage) { state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}: ${initiatedMessage.text}`}); toast(`${state.partner.name}에게 메시지가 왔어요`); }
  if (finishedDay) { dailyEvent(); advanceStockMarket(state); const transactions=processDayEndEconomy(state,completedDay); transactions.forEach(entry=>state.logs.push({time:`DAY ${completedDay} · ECONOMY`,text:`${entry.label} ${entry.amount>=0?'+':''}${money(entry.amount)}`})); }
  const event = rollEvent(state);
  if (event) {
    state.logs.push({time:`DAY ${state.day} · EVENT`,text:`${event.title} — ${event.message}`});
    toast(`EVENT · ${event.title}`);
    recordMemory(state,{type:"event",summary:event.title,importance:3,tags:["이벤트",event.id]});
  }
  const breakup = evaluateBreakup(state);
  sound.play("confirm");
  SaveManager.save(state);
  if (breakup) showBreakup(breakup); else if (state.day > 30) showEnding(); else { render(); const temptation=npcResult&&getTemptationOpportunity(state); if(temptation) openTemptation(temptation); }
}

function resultText(a) { if(a.tag==="데이트") return `${state.partner.name}의 표정이 한결 밝아졌다.`; if(a.tag==="성공") return "미래를 위한 한 걸음을 내디뎠다."; if(a.tag==="유혹") return "새로운 인연의 기척이 느껴진다."; if(a.tag==="연락") return "짧은 대화가 두 사람을 조금 더 가깝게 했다."; return "선택의 결과가 하루에 남았다."; }
function dailyEvent() { if(state.day%5===0){ const good=Math.random()>.45; const amount=good?60000:-35000; const label=good?"예상하지 못한 성과급":"갑작스러운 생활비 지출"; recordTransaction(state,{category:"event",label,amount}); state.logs.push({time:`DAY ${state.day}`,text:`${label}${good?"이 들어왔다.":"이 생겼다."}`}); } if(state.day%7===0){state.affection=clamp(state.affection-18,0,1000);state.trust=clamp(state.trust-8,0,1000);} }

function openChat() {
  const context = buildConversationContext(state);
  const greeting = getContextualOpening(context).replace(`${state.partner.name}: `, "");
  $("#modalContent").innerHTML=`<span class="eyebrow">CHAT WITH ${state.partner.name}</span><h2>${state.partner.name}와의 대화</h2><div class="chat-window"><div class="message her">${greeting}</div><div id="chatReply"></div></div><form id="chatForm" class="chat-compose"><input id="chatInput" maxlength="180" autocomplete="off" placeholder="자유롭게 메시지를 입력하세요" required><button type="submit">보내기</button></form>`;
  openModal(); $("#chatForm").addEventListener("submit",event=>{ event.preventDefault(); chatReply($("#chatInput").value); });
}
async function chatReply(message){ const form=$("#chatForm"), send=form?.querySelector("button"); if(send)send.disabled=true; const endpoint=document.querySelector('meta[name="today-day-one-ai-endpoint"]')?.content; const response=await requestGirlfriendReply({endpoint,context:buildConversationContext(state),message}); if(!response){if(send)send.disabled=false;return;} $("#chatReply").innerHTML=`<div class="message me">${escapeHtml(message)}</div><div class="message her">${escapeHtml(response.text)}</div><small class="reply-source">${response.source==='remote'?'AI 연결 응답':'로컬 컨텍스트 응답'}</small>`; applyEffects(state,response.effects); recordConversationTurn(state,message,response.text); recordMemory(state,{type:"conversation",summary:`${state.partner.name}와의 대화`,importance:2,tags:["대화",response.source]}); SaveManager.save(state); form?.remove(); render(); }

function openDebug() {
  if (!state) return;
  const keys = ["day","phase","money","health","energy","fatigue","stress","charm","fashion","confidence","work","social","affection","trust","excitement","attachment","conflict","relationshipStress"];
  const stateRows = keys.map(key=>`<div class="debug-stat"><span>${key}</span><b>${Math.round(state[key])}</b></div>`).join("");
  const personalityRows = Object.entries(state.partner.personality).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("");
  const eventRows = getEventDiagnostics(state).map(event=>`<div class="debug-event ${event.eligible?'':event.cooldownRemaining?'cooldown':'ineligible'}"><div><b>${event.title}</b><span>${Math.round(event.probability*100)}%</span></div><small>priority ${event.priority} · ${event.dailyLimitReached?'오늘 이벤트 한도 도달':event.cooldownRemaining?`cooldown ${event.cooldownRemaining}일`:event.conditionsMet?'발생 가능':'조건 불충족'}</small></div>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">DEVELOPER MODE</span><h2>Simulation Debug</h2><p>저장에는 영향을 주지 않는 읽기 전용 상태 패널입니다.</p><h3>Game State</h3><div class="debug-grid">${stateRows}</div><h3>${state.partner.name} · Hidden Personality</h3><div class="debug-grid">${personalityRows}</div><h3>Event Diagnostics</h3><div class="debug-events">${eventRows}</div>`;
  openModal();
}

function openInventory() {
  const bonuses = getEquipmentBonuses(state);
  const ownerLabel = { player:"내 아이템", gift:"선물 대기", girlfriend:`${state.partner.name} 소유` };
  const cards = state.inventory.length ? state.inventory.map(instance=>{ const item=getItem(instance.itemId); const control=instance.owner==='player'?`<button class="equip-button" data-instance="${instance.instanceId}" ${instance.equipped?'disabled':''}>${instance.equipped?'장착 중':'장착'}</button>`:instance.owner==='gift'?`<button class="gift-button" data-gift="${instance.instanceId}">${state.partner.name}에게 선물</button>`:`<em>${instance.equipped?'사용 중':'보관 중'}</em>`; return `<div class="inventory-item"><div><small>${item.brand} · ${item.category}</small><b>${item.name}</b><span>${ownerLabel[instance.owner]} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span></div>${control}</div>`; }).join("") : `<p class="empty-inventory">아직 보유한 아이템이 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">INVENTORY</span><h2>나의 가방</h2><p>장착 보너스 · 매력 +${bonuses.attractiveness} · 패션 +${bonuses.fashion}</p><div class="inventory-list">${cards}</div>`;
  openModal();
  document.querySelectorAll(".equip-button:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{ equipItem(state,button.dataset.instance); SaveManager.save(state); openInventory(); }));
  document.querySelectorAll(".gift-button").forEach(button=>button.addEventListener("click",()=>{ const result=giveGift(state,button.dataset.gift); if(!result)return; state.logs.push({time:`DAY ${state.day} · GIFT`,text:`${result.item.name} 선물 · ${result.reaction.reaction}`}); recordMemory(state,{type:"gift",summary:`${result.item.name} 선물`,importance:4,tags:["선물",result.item.id]}); SaveManager.save(state); toast(`${state.partner.name}: “${result.reaction.reaction}” · 호감 +${result.reaction.affection}`); render(); openInventory(); }));
}

function openShop() {
  const cards = ITEMS.map(item=>`<div class="shop-item"><div><small>${item.brand} · LUX ${item.luxuryLevel}</small><b>${item.name}</b><span>${item.category} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span><strong>${money(item.price)}</strong></div><div class="shop-actions"><button data-buy="${item.id}" data-owner="player">내 것</button><button data-buy="${item.id}" data-owner="gift">선물용</button></div></div>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">LIFESTYLE SHOP</span><h2>오늘의 상점</h2><p>보유 자산 ${money(state.money)} · 구매한 내 아이템은 바로 장착됩니다.</p><div class="shop-list">${cards}</div>`;
  openModal();
  document.querySelectorAll("[data-buy]").forEach(button=>button.addEventListener("click",()=>{ const result=purchaseItem(state,button.dataset.buy,button.dataset.owner); if(!result.ok){toast(result.reason);return;} SaveManager.save(state); toast(`${result.item.name} 구매 완료`); openShop(); render(); }));
}

function openFinance() {
  const summary = getEconomySummary(state), assets=getAssetSummary(state), nextPayday = getNextPayday(state.day);
  const rows = state.economyLedger.length ? state.economyLedger.slice(-10).reverse().map(entry=>`<div class="ledger-row"><span><b>${entry.label}</b><small>DAY ${entry.day} · ${entry.category}</small></span><strong class="${entry.amount>=0?'income':'expense'}">${entry.amount>=0?'+':''}${money(entry.amount)}</strong></div>`).join("") : `<p class="empty-inventory">아직 기록된 거래가 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">MY FINANCE</span><h2>30일 재정 기록</h2><p>총자산 ${money(assets.netWorth)} · ${nextPayday?`다음 급여 DAY ${nextPayday}`:'모든 급여 정산 완료'}</p><div class="finance-summary"><div><small>현금</small><b>${money(assets.cash)}</b></div><div><small>저축</small><b>${money(assets.savings)}</b></div><div><small>주식 평가액</small><b>${money(assets.stockValue)}</b></div><div><small>국채</small><b>${money(assets.bondValue)}</b></div></div><div class="savings-card"><div><small>DAILY INTEREST 0.1%</small><b>안정 저축 계좌</b><span>누적 이자 ${money(state.finance.interestEarned)} · ${money(SAVINGS_TRANSFER_AMOUNT)} 단위 이체</span></div><div><button id="savingsDeposit" ${state.money<SAVINGS_TRANSFER_AMOUNT?'disabled':''}>입금</button><button id="savingsWithdraw" ${state.finance.savings<SAVINGS_TRANSFER_AMOUNT?'disabled':''}>출금</button></div></div><div class="savings-card"><div><small>${BOND_TERM_DAYS} DAYS · RETURN ${(BOND_RETURN_RATE*100).toFixed(0)}%</small><b>안정 국채</b><span>보유 ${state.finance.bonds.length}건 · 누적 수익 ${money(state.finance.bondInterestEarned)}</span></div><div><button id="bondPurchase" ${state.money<BOND_PURCHASE_AMOUNT?'disabled':''}>${money(BOND_PURCHASE_AMOUNT)} 매수</button></div></div><div class="finance-summary"><div><small>누적 수입</small><b>+${money(summary.income)}</b></div><div><small>누적 지출</small><b>-${money(summary.expense)}</b></div><div><small>순손익</small><b>${summary.net>=0?'+':''}${money(summary.net)}</b></div></div><h3>최근 거래</h3><div class="ledger-list">${rows}</div>`;
  openModal();
  $("#savingsDeposit").addEventListener("click",()=>{const result=depositSavings(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`${money(result.amount)} 저축 완료`);});
  $("#savingsWithdraw").addEventListener("click",()=>{const result=withdrawSavings(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`${money(result.amount)} 출금 완료`);});
  $("#bondPurchase").addEventListener("click",()=>{const result=purchaseBond(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`국채 매수 · DAY ${result.bond.maturityDay} 만기`);});
}

function openCareer() {
  const career = getCareerSummary(state), job = state.job;
  $("#modalContent").innerHTML=`<span class="eyebrow">MY CAREER</span><h2>${job.name} · Lv.${state.jobLevel}</h2><p>다음 10일 급여 예상 ${money(calculatePaycheck(state))}</p><div class="career-progress"><div><span>승진 진행도</span><b>${career.progress} / ${career.threshold}</b></div><i><em style="width:${career.percent}%"></em></i><small>승진까지 성장 포인트 ${career.remaining}</small></div><div class="career-stats"><div><small>연봉</small><b>${money(job.salary)}</b></div><div><small>수입 배율</small><b>×${job.incomeMultiplier.toFixed(2)}</b></div><div><small>성장 잠재력</small><b>${job.growthPotential}</b></div><div><small>인맥 기회</small><b>${job.socialOpportunity}</b></div><div><small>스트레스 배율</small><b>×${job.stressRate.toFixed(2)}</b></div></div><p class="career-tip">성공 행동으로 업무 능력을 올리면 승진 진행도가 쌓이고, 승진할 때마다 수입 배율이 증가합니다.</p>`;
  openModal();
}

function openPeople() {
  const breakupRisk = calculateBreakupRisk(state);
  const cards = state.npcs.map(npc=>{ const status=npc.relationshipType==='rival'?calculateRivalRisk(state,npc):getNpcRelationshipStatus(npc); const interest=npc.relationshipType==='rival'?`연인 관심 ${npc.interestInGirlfriend} · 위험 ${status.score}`:`내 관심 ${npc.interestInPlayer}`; return `<div class="npc-card"><div><small>${npc.role}</small><b>${npc.name}</b><span>호감 ${npc.affection} · 신뢰 ${npc.trust} · ${interest}</span></div><em data-tone="${status.tone}">${status.label}</em></div>`; }).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">HUMAN RELATIONSHIPS</span><h2>나의 인맥</h2><p>현재 연애 위기 ${breakupRisk.score} · ${breakupRisk.label}</p><div class="npc-list">${cards}</div>`;
  openModal();
}

function showBreakup(breakup) {
  sound.play("alert");
  $("#modalContent").innerHTML=`<span class="eyebrow">RELATIONSHIP ENDED · DAY ${breakup.day}</span><h2>${breakup.reason}</h2><div class="ending-score">${breakup.risk}</div><p>${state.partner.name}와의 관계는 더 이어지지 못했습니다. 호감 ${breakup.affection} · 신뢰 ${breakup.trust}</p><button class="primary-button" onclick="location.reload()">새로운 30일 시작하기 →</button>`;
  openModal();
}

function openTemptation({ npc, level }) {
  sound.play("alert");
  const message = level==='secret'?`${npc.name}가 둘만의 비밀 만남을 제안했다.`:level==='drinks'?`${npc.name}가 다음에는 단둘이 마시자고 한다.`:`${npc.name}가 개인 연락처로 메시지를 보냈다.`;
  const buttons = Object.entries(TEMPTATION_CHOICES).map(([id,choice])=>`<button data-temptation="${id}">${choice.label}</button>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">TEMPTATION</span><h2>${npc.name}의 접근</h2><p>${message}</p><div class="temptation-options">${buttons}</div>`;
  openModal();
  document.querySelectorAll("[data-temptation]").forEach(button=>button.addEventListener("click",()=>{ const result=resolveTemptation(state,npc.instanceId,button.dataset.temptation); if(!result)return; state.logs.push({time:`DAY ${state.day} · CHOICE`,text:`${npc.name}에게 “${result.choice.label}”`}); recordMemory(state,{type:"temptation",summary:`${npc.name}: ${result.choice.label}`,importance:5,tags:["유혹",button.dataset.temptation]}); SaveManager.save(state); render(); closeModal(); toast(`선택 완료 · 신뢰 ${result.choice.partnerTrust>=0?'+':''}${result.choice.partnerTrust}`); }));
}

function openInvestment() {
  const portfolio=getPortfolioSummary(state);
  const lottery=getLotterySummary(state);
  const cards=state.investment.market.map(stock=>{ const holding=state.investment.holdings[stock.id]; return `<div class="stock-card"><div><small>${stock.risk.toUpperCase()} RISK · ${stock.changeRate>=0?'+':''}${stock.changeRate}%</small><b>${stock.name}</b><span>${money(stock.price)} · 보유 ${holding?.quantity??0}주${holding?` · 평균 ${money(holding.averageCost)}`:''}</span></div><div class="stock-actions"><button data-stock-buy="${stock.id}">1주 매수</button><button data-stock-sell="${stock.id}" ${holding?'':'disabled'}>1주 매도</button></div></div>`; }).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">VIRTUAL MARKET</span><h2>오늘의 투자</h2><p>보유 자산 ${money(state.money)} · 평가금액 ${money(portfolio.marketValue)} · 손익 ${portfolio.profitLoss>=0?'+':''}${money(portfolio.profitLoss)}</p><div class="stock-list">${cards}</div><div class="lottery-card"><div><small>INSTANT LOTTERY · DAY ${state.day}</small><b>오늘의 행운 복권</b><span>1장 ${money(LOTTERY_TICKET_PRICE)} · 오늘 ${lottery.today}/${DAILY_TICKET_LIMIT}장 · 누적 손익 ${lottery.net>=0?'+':''}${money(lottery.net)}</span></div><button id="lotteryBuyButton" ${lottery.today>=DAILY_TICKET_LIMIT||state.money<LOTTERY_TICKET_PRICE?'disabled':''}>한 장 긁기</button></div>`;
  openModal();
  document.querySelectorAll("[data-stock-buy]").forEach(button=>button.addEventListener("click",()=>{const result=buyStock(state,button.dataset.stockBuy);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  document.querySelectorAll("[data-stock-sell]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{const result=sellStock(state,button.dataset.stockSell);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  $("#lotteryBuyButton").addEventListener("click",()=>{const result=buyInstantLottery(state);if(!result.ok){toast(result.reason);return;}state.logs.push({time:`DAY ${state.day} · LOTTERY`,text:`즉석복권 ${result.label}${result.prize?` · ${money(result.prize)} 당첨`:''}`});SaveManager.save(state);render();openInvestment();toast(result.prize?`${result.label}! ${money(result.prize)} 당첨`:`아쉽게도 꽝이에요.`);});
}

function showEnding(){ state.ended=true; const [title, desc] = determineEnding(state); const analysis=analyzePlayHistory(state);
  sound.play("success");
  const highlights=analysis.highlights.map(text=>`<li>${escapeHtml(text)}</li>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">DAY 30 · YOUR ENDING</span><h2>${title}</h2><div class="ending-score">${Math.round((state.affection+state.trust)/20)}</div><p>${desc}</p><div class="ending-analysis"><div><small>총 선택</small><b>${analysis.totalChoices}회</b></div><div><small>가장 많은 선택</small><b>${escapeHtml(analysis.dominantChoice.tag)} · ${analysis.dominantChoice.count}회</b></div><div><small>관계 기록</small><b>${analysis.relationshipLabel}</b></div><div><small>최종 총자산</small><b>${money(analysis.netWorth)}</b></div></div><h3>나의 30일 리포트</h3><ul class="ending-highlights">${highlights}</ul><button class="primary-button" onclick="location.reload()">새로운 30일 시작하기 →</button>`; openModal(); }
function toast(message){ const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200); }

function loadGame() { const loaded = SaveManager.load(); if (!loaded) { toast("불러올 수 있는 저장 데이터가 없어요."); return; } state = loaded; showGame(); if(state.breakup)showBreakup(state.breakup);else if(state.day>30)showEnding();else toast(`DAY ${state.day} 저장 데이터를 불러왔어요.`); }
function saveGame() { if (!state) return; SaveManager.save(state); toast(`DAY ${state.day} 진행 상황을 저장했어요.`); }

if (!SaveManager.hasSave()) $("#loadButton").classList.add("hidden");
renderSoundButton();
$("#soundButton").addEventListener("click",()=>{const enabled=sound.toggle();renderSoundButton();if(enabled)sound.play("success");toast(enabled?"효과음을 켰어요.":"효과음을 껐어요.");});
$("#debugButton").addEventListener("click",openDebug);
$("#inventoryButton").addEventListener("click",openInventory);
$("#shopButton").addEventListener("click",openShop);
$("#financeButton").addEventListener("click",openFinance);
$("#careerButton").addEventListener("click",openCareer);
$("#peopleButton").addEventListener("click",openPeople);
$("#investmentButton").addEventListener("click",openInvestment);
$("#actionGrid").addEventListener("click",handleActionGridClick);
$("#startButton").addEventListener("click",startGame); $("#nextButton").addEventListener("click",applyAction); $("#chatButton").addEventListener("click",openChat); $("#saveButton").addEventListener("click",saveGame); $("#loadButton").addEventListener("click",loadGame); $("#closeModal").addEventListener("click",closeModal); $("#resetButton").addEventListener("click",()=>{ if(confirm("새 게임을 시작할까요? 현재 진행은 사라집니다.")) { SaveManager.clear(); location.reload(); } });
document.addEventListener("keydown", handleModalKeydown);

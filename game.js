import { advanceTime, applyEffects, clamp, createInitialState, determineEnding } from "./src/game-core.mjs?v=6";
import { SaveManager } from "./src/save-manager.mjs?v=9";
import { createGirlfriendFromProfile, generateGirlfriend, getVisibleTraitRows, observePersonality, rerollGirlfriendPersonality } from "./src/girlfriend-manager.mjs?v=7";
import { getEventDiagnostics, rollEvent } from "./src/event-manager.mjs?v=5";
import { SITUATION_EVENTS } from "./src/situation-events-data.mjs?v=5";
import { resolveSituationEventChoice } from "./src/situation-event-manager.mjs?v=4";
import { EventRuntimeManager } from "./src/event-runtime-manager.mjs?v=4";
import { rollMicroEvents } from "./src/micro-event-manager.mjs?v=4";
import { auditEventSystems } from "./src/event-audit.mjs?v=4";
import { EVENT_DEFINITIONS } from "./src/events-data.mjs?v=4";
import { ACTIONS as actions, PHASES as phases } from "./src/actions-data.mjs?v=5";
import { getActionAvailability, getWeekdayName, isActionVisible, isWeekend } from "./src/action-manager.mjs?v=5";
import { calculateActionEffects } from "./src/consequence-manager.mjs";
import { getRelationshipState } from "./src/relationship-manager.mjs";
import { addJobProgress, getCareerSummary } from "./src/job-manager.mjs";
import { appendTransaction, BOND_PURCHASE_AMOUNT, BOND_RETURN_RATE, BOND_TERM_DAYS, calculatePaycheck, depositSavings, getAssetSummary, getEconomySummary, getNextPayday, getPaycheckRange, processDayEndEconomy, purchaseBond, recordTransaction, SAVINGS_TRANSFER_AMOUNT, withdrawSavings } from "./src/economy-manager.mjs?v=6";
import { acquireActionItem, equipItem, getEffectiveAppearance, getEquipmentBonuses, purchaseItem } from "./src/inventory-manager.mjs?v=6";
import { getItem, ITEMS } from "./src/items-data.mjs?v=5";
import { giveGift } from "./src/gift-manager.mjs?v=7";
import { applyNpcActionEffects, getNpcRelationshipStatus } from "./src/npc-manager.mjs";
import { getTemptationOpportunity, resolveTemptation, TEMPTATION_CHOICES } from "./src/temptation-manager.mjs";
import { applyRivalPressure, calculateRivalRisk } from "./src/rival-manager.mjs";
import { calculateBreakupRisk, evaluateBreakup } from "./src/conflict-manager.mjs";
import { buildConversationContext, getContextualOpening, recordConversationTurn } from "./src/conversation-manager.mjs?v=7";
import { requestGirlfriendReply } from "./src/ai-chat-client.mjs";
import { advanceStockMarket, buyStock, getPortfolioSummary, sellStock } from "./src/investment-manager.mjs?v=2";
import { buyInstantLottery, DAILY_TICKET_LIMIT, getLotterySummary, LOTTERY_TICKET_PRICE } from "./src/lottery-manager.mjs";
import { analyzePlayHistory } from "./src/ending-manager.mjs";
import { SoundManager } from "./src/sound-manager.mjs?v=5";
import { recordMemory } from "./src/memory-manager.mjs";
import { maybeGenerateInitiatedMessage } from "./src/initiated-message-manager.mjs?v=6";
import { getWrappedFocusIndex } from "./src/ui-manager.mjs";
import { renderCharacter, resolveCharacterAccessory, resolveCharacterExpression, resolveCharacterOutfit, resolveCharacterPose } from "./src/ui/character-renderer.mjs?v=7";
import { getBackgroundAsset, getGiftVehicleAsset, getNpcSprite } from "./src/assets/asset-manifest.mjs?v=9";
import { getStoryScene, resolveStoryChoice, selectNextStoryScene } from "./src/story-manager.mjs?v=5";
import { STORY_SCENES } from "./src/story-data.mjs";
import { createDaySnapshot, ensureNightState, formatNightTime, getDailyReport, getLateSleepEffects, resetForNextDay, spendNightTime } from "./src/night-manager.mjs";
import { preloadSceneAssets, resolvePhasePresentation, resolveStoryPresentation } from "./src/scene-presentation.mjs";
import { createEventSceneSequence, createStoryReactionSequence, createStorySceneSequence, createTemptationReactionSequence, createTemptationSceneSequence } from "./src/story-scene-controller.mjs";
import { runDailyStoryDirector } from "./src/dynamic-story-director.mjs";
import { HEROINE_OUTFITS, HEROINE_PROFILES, getEquippedHeroineOutfit, isOutfitUnlocked } from "./src/heroine-data.mjs?v=6";
import { NPC_SOCIAL_GRAPH } from "./src/npcs-data.mjs";
import { GIRLFRIEND_JOBS } from "./src/girlfriend-jobs-data.mjs";
import { generateJob, JOBS } from "./src/jobs-data.mjs?v=6";
import { getGirlfriendVisual } from "./src/girlfriend-visual-data.mjs";
import { createPlayerProfile, PLAYER_ARCHETYPES } from "./src/player-profile-data.mjs";
import { getActionResultAsset, getHighTrustActionResultAsset, getVisibleActionEffects } from "./src/action-result-assets.mjs?v=9";
import { getActionResultVideo } from "./src/action-result-videos.mjs?v=2";
import { discoverLocation, getNearbyLocation, getPlayerHomeProfile, getRoadCells, moveWorldPlayer, selectWorldTransport, TRANSPORT_OPTIONS, travelToCity, WORLD_ATLAS, WORLD_MAPS } from "./src/world-map-manager.mjs";

const $ = (selector) => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));

let state;
let onboarding = null;
const INTRO_VIDEO_PLAYLIST = ["assets/video/intro.mp4", "assets/video/intro2.mp4"];
let introVideoIndex = 0;
const sound = new SoundManager();
let modalReturnFocus = null;
let actionResultReturnFocus = null;
let actionResultContinuation = null;
let dialogueTimer = null;
let dialogueText = "";
let dialogueIndex = 0;
const dialogueHistory = [];
const dialogueSpeeds = [{label:"느림",delay:42},{label:"보통",delay:24},{label:"빠름",delay:10}];
let dialogueSpeedIndex = Number(localStorage.getItem("today-day-one-dialogue-speed") ?? 1);
if (!dialogueSpeeds[dialogueSpeedIndex]) dialogueSpeedIndex = 1;
let lastSceneSoundKey = "";
let autoMode = false;
let autoAdvanceTimer = null;
let immersiveScene = null;
let sceneAdvanceTimer = null;
const eventRuntime = new EventRuntimeManager({timeoutMs:5000,onWarning:warning=>{if(state){state.logs.push({time:`DAY ${state.day} · WATCHDOG`,text:`${warning.eventId} · ${warning.state} ${warning.elapsed}ms`});persistEventRuntime(true);}},onRecover:()=>{const layer=$("#sceneTransition");if(layer){layer.classList.remove("active");layer.classList.add("hidden");}if(immersiveScene)renderImmersiveStep();}});
const runtimeWatchdogTimer=setInterval(()=>eventRuntime.watchdog(),1000);
const modalFocusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const THEATER_SETTING_KEY="today-day-one-theater-mode";
const GAMEPLAY_EVENTS_START_DAY = 4;

function areGameplayEventsUnlocked(day=state?.day) { return Number(day) >= GAMEPLAY_EVENTS_START_DAY; }

function persistEventRuntime(save=false){if(!state)return;state.eventRuntime=eventRuntime.snapshot();if(save)SaveManager.save(state);}
function renderFullscreenButtons(){const active=Boolean(document.fullscreenElement)||document.body.classList.contains("theater-mode");for(const button of [$("#fullscreenButton"),$("#storyFullscreenButton")])if(button){button.setAttribute("aria-pressed",String(active));button.textContent=button.id==="storyFullscreenButton"?(active?"WINDOW":"FULLSCREEN"):(active?"▣ 창모드":"⛶ 전체화면");}}
function setTheaterMode(enabled){document.body.classList.toggle("theater-mode",enabled);if(state){state.settings??={};state.settings.theaterMode=enabled;localStorage.setItem(THEATER_SETTING_KEY,String(enabled));SaveManager.save(state);}renderFullscreenButtons();}
async function toggleFullscreen(event){event?.stopPropagation();if(document.fullscreenElement){await document.exitFullscreen();setTheaterMode(false);return;}if(document.body.classList.contains("theater-mode")){setTheaterMode(false);return;}try{if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else setTheaterMode(true);}catch{setTheaterMode(true);}renderFullscreenButtons();}

function openModal() {
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) modalReturnFocus = document.activeElement;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => $("#closeModal").focus());
}

function closeModal() {
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) return;
  modal.classList.add("hidden");
  modal.classList.remove("phone-menu-active");
  modal.classList.remove("world-event-active");
  if (modalReturnFocus?.isConnected) modalReturnFocus.focus();
  modalReturnFocus = null;
  if (state && !state.ended && !state.breakup) { if(state.phase===3)renderNightHome();else sound.playScene(phases[state.phase].key,state.day); }
}

function formatActionEffectValue(effect) {
  const sign = effect.value > 0 ? "+" : "";
  return effect.key === "money" ? `${sign}${money(effect.value)}` : `${sign}${effect.value}`;
}

function animateActionResultEffects(rows) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("#actionResultEffects [data-effect-index]").forEach((badge,index) => {
    const effect = rows[index];
    const value = badge.querySelector("em");
    if (!effect || !value) return;
    const finish = () => { value.textContent = formatActionEffectValue(effect); badge.classList.add("effect-settled"); };
    if (reducedMotion) { finish(); return; }
    const delay = index * 110;
    const duration = 720;
    setTimeout(() => {
      if (!badge.isConnected) return;
      badge.classList.add("effect-animating");
      const startedAt = performance.now();
      const count = now => {
        if (!badge.isConnected) return;
        const progress = Math.min(1,(now-startedAt)/duration);
        const eased = 1-Math.pow(1-progress,3);
        const current = Math.round(effect.value*eased);
        value.textContent = formatActionEffectValue({...effect,value:current});
        if (progress < 1) requestAnimationFrame(count); else finish();
      };
      requestAnimationFrame(count);
    },delay);
  });
}

function openActionResultModal(action, message, effects, continuation) {
  const modal = $("#actionResultModal");
  const image = $("#actionResultImage");
  const video = $("#actionResultVideo");
  const pending = $("#actionResultPending");
  state.seenOneTimeActionResults ??= [];
  state.seenActionResultVideos ??= [];
  const highTrustAsset = getHighTrustActionResultAsset(action.id,state,state.seenOneTimeActionResults);
  const asset = highTrustAsset ?? getActionResultAsset(action.id);
  const videoAsset = highTrustAsset ? null : getActionResultVideo(action.id,state,state.seenActionResultVideos);
  if (highTrustAsset) {
    state.seenOneTimeActionResults.push(action.id);
    SaveManager.save(state);
  }
  if (videoAsset) {
    state.seenActionResultVideos.push(videoAsset);
    SaveManager.save(state);
  }
  actionResultReturnFocus = document.activeElement;
  actionResultContinuation = continuation;
  $("#actionResultTitle").textContent = action.title;
  $("#actionResultText").textContent = message;
  video.pause();
  video.hidden = true;
  video.removeAttribute("src");
  if (videoAsset) {
    image.removeAttribute("src");
    image.alt = "";
    image.hidden = true;
    video.src = videoAsset;
    video.setAttribute("aria-label", `${action.title} 행동 결과 영상`);
    video.hidden = false;
    pending.hidden = true;
    video.play().catch(() => {});
  } else if (asset) {
    image.src = asset;
    image.alt = `${action.title} 활동 결과 장면`;
    image.hidden = false;
    pending.hidden = true;
  } else {
    image.removeAttribute("src");
    image.alt = "";
    image.hidden = true;
    pending.hidden = false;
  }
  const rows = getVisibleActionEffects(effects);
  $("#actionResultEffects").innerHTML = rows.length
    ? rows.map((effect,index) => `<span class="${effect.value > 0 ? "up" : "down"}" data-effect-index="${index}"><b>${escapeHtml(effect.label)}</b><em>0</em></span>`).join("")
    : '<span class="neutral"><b>변화</b><em>기록 완료</em></span>';
  modal.classList.remove("hidden");
  animateActionResultEffects(rows);
  requestAnimationFrame(() => $("#actionResultConfirm").focus());
}

function confirmActionResult() {
  const modal = $("#actionResultModal");
  if (modal.classList.contains("hidden")) return;
  const video = $("#actionResultVideo");
  video.pause();
  video.currentTime = 0;
  video.hidden = true;
  video.removeAttribute("src");
  modal.classList.add("hidden");
  const continuation = actionResultContinuation;
  actionResultContinuation = null;
  if (actionResultReturnFocus?.isConnected) actionResultReturnFocus.focus();
  actionResultReturnFocus = null;
  continuation?.();
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

function finishDialogueTyping() {
  if (!dialogueTimer) return false;
  clearInterval(dialogueTimer);
  dialogueTimer = null;
  dialogueIndex = dialogueText.length;
  $("#sceneText").textContent = dialogueText;
  $("#visualNovelStage").classList.remove("is-typing");
  return true;
}

function typeDialogue(text) {
  if (text === dialogueText && $("#sceneText").textContent) return;
  finishDialogueTyping();
  dialogueText = text;
  dialogueIndex = 0;
  dialogueHistory.push({ day: state.day, phase: phases[state.phase].label, title: $("#sceneTitle").textContent, text });
  if (dialogueHistory.length > 40) dialogueHistory.shift();
  const sceneText = $("#sceneText");
  const stage = $("#visualNovelStage");
  sceneText.textContent = "";
  stage.classList.add("is-typing");
  dialogueTimer = setInterval(() => {
    dialogueIndex = Math.min(dialogueIndex + 1, dialogueText.length);
    sceneText.textContent = dialogueText.slice(0, dialogueIndex);
    if (dialogueIndex >= dialogueText.length) finishDialogueTyping();
  }, dialogueSpeeds[dialogueSpeedIndex].delay);
}

function handleDialogueAdvance() {
  if(eventRuntime.input.snapshot().locked)return;
  if (finishDialogueTyping()) { sound.play("select"); return; }
  if (immersiveScene) advanceImmersiveScene();
}

function renderAutoButton() {
  const button = $("#autoButton");
  button.textContent = autoMode ? "AUTO ON" : "AUTO OFF";
  button.setAttribute("aria-pressed",String(autoMode));
}

function scheduleAutoAdvance() {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  if (immersiveScene) {
    if (sceneAdvanceTimer) clearTimeout(sceneAdvanceTimer);
    sceneAdvanceTimer = autoMode && immersiveScene.currentStep?.type !== "choice" ? setTimeout(()=>{sceneAdvanceTimer=null;handleDialogueAdvance();},1600) : null;
    return;
  }
  autoAdvanceTimer = autoMode && state?.selected !== null ? setTimeout(()=>{autoAdvanceTimer=null;applyAction();},1200) : null;
}

function toggleAutoMode(event) {
  event.stopPropagation();
  autoMode = !autoMode;
  renderAutoButton();
  scheduleAutoAdvance();
  toast(autoMode ? "선택 후 자동으로 진행합니다." : "자동 진행을 껐어요.");
}

function openDialogueHistory() {
  const rows = dialogueHistory.length ? dialogueHistory.slice().reverse().map(entry=>`<article class="history-entry"><small>DAY ${entry.day} · ${escapeHtml(entry.phase)}</small><b>${escapeHtml(entry.title)}</b><p>${escapeHtml(entry.text)}</p></article>`).join("") : `<p>아직 기록된 대화가 없어요.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">BACKLOG</span><h2>대화 기록</h2><div class="dialogue-history">${rows}</div>`;
  openModal();
}

function openGameMenu() {
  const isNight = state.phase === 3;
  if (isNight) { ensureNightState(state).phoneChecked = true; SaveManager.save(state); }
  const apps = isNight ? [
    ["message","💬","메시지",`${withParticle(state.partner.name,"과","와")} 대화`,"rose"],["call","📞","전화","통화하기","violet"],["shop","🛍","쇼핑","온라인 상점","green"],
    ["investment","📈","투자","주식·채권","blue"],["sns","📷","SNS","오늘의 피드","orange"],["people","👥","연락처","인맥 확인","mint"],
    ["schedule","📅","일정","30일 캘린더","pink"],["finance","💳","금융","자산·거래","indigo"],["todaylog","📝","오늘 기록","DAY 로그","gray"],
    ["gallery","🖼","CG 앨범","해금한 장면","violet"]
  ] : [
    ["save","↓","저장","현재 장면 보관","rose"],["load","↻","불러오기","저장 장면 복귀","violet"],["gallery","🖼","CG 앨범","해금한 장면","pink"],
    ["speed","⏩","대사 속도",dialogueSpeeds[dialogueSpeedIndex].label,"indigo"],["debug","⚙","설정","접근성·진단","gray"]
  ];
  const dock = isNight ? [["report","☾","하루 정산"],["save","↓","저장하기"]] : [["history","≡","대화 기록"],["save","↓","저장하기"]];
  const battery = Math.max(1,Math.round((state.energy+state.health)/2));
  const appMarkup = apps.map(([id,icon,label,detail,tone])=>`<button class="phone-app" type="button" data-menu-action="${id}"><span class="phone-app-icon" data-tone="${tone}" aria-hidden="true">${icon}</span><b>${label}</b><small>${escapeHtml(detail)}</small></button>`).join("");
  const dockMarkup = dock.map(([id,icon,label])=>`<button type="button" data-menu-action="${id}"><span aria-hidden="true">${icon}</span><b>${label}</b></button>`).join("");
  $("#modal").classList.add("phone-menu-active");
  $("#modalContent").innerHTML=`<article class="phone-menu ${isNight?"":"story-system-menu"}" aria-label="${isNight?"야간 스마트폰":"스토리 시스템 메뉴"}"><div class="phone-status"><b>${isNight?formatNightTime(state.nightState.minutes):phases[state.phase].time}</b><span>DAY ${state.day} · ${getWeekdayName(state.day)} · ${battery}% ▰</span></div><div class="phone-island" aria-hidden="true"></div><header class="phone-menu-hero"><small>${isNight?"NIGHT TIME · 나의 방":"STORY MODE · SYSTEM"}</small><strong>${isNight?`${state.partner.name}에게 알림이 왔어요`:"이야기를 잠시 멈췄어요"}</strong><span>${isNight?money(state.money):"저장 · 기록 · 설정만 확인할 수 있어요"}</span></header><div class="phone-app-grid">${appMarkup}</div><div class="phone-dock">${dockMarkup}</div><div class="phone-home-indicator" aria-hidden="true"></div></article>`;
  openModal();
  const nightApp = (minutes,label,callback) => () => { const result=spendNightTime(state,minutes,label); if(!result.ok){toast(result.reason);openGameMenu();return;} callback(); SaveManager.save(state); };
  const actions = { inventory:openInventory, shop:isNight?nightApp(20,"온라인 쇼핑",openShop):openShop, finance:openFinance, career:openCareer, people:openPeople, investment:isNight?nightApp(20,"투자 확인",openInvestment):openInvestment, history:openDialogueHistory, gallery:openCgGallery, message:nightApp(10,"메시지",()=>{state.nightState.messagesRead=true;openChat();}), call:nightApp(30,"전화",openChat), sns:nightApp(20,"SNS",openSns), schedule:openSchedule, todaylog:openTodayLog, report:openDailyReport, speed:()=>{dialogueSpeedIndex=(dialogueSpeedIndex+1)%dialogueSpeeds.length;localStorage.setItem("today-day-one-dialogue-speed",String(dialogueSpeedIndex));toast(`대화 속도 · ${dialogueSpeeds[dialogueSpeedIndex].label}`);openGameMenu();}, save:()=>{saveGame();closeModal();}, load:()=>{closeModal();loadGame();}, debug:openDebug };
  document.querySelectorAll("[data-menu-action]").forEach(button=>button.addEventListener("click",()=>{$("#modal").classList.remove("phone-menu-active");actions[button.dataset.menuAction]?.();}));
}

function openStoryScene(scene) {
  if (!scene) return;
  const presentation=resolveStoryPresentation(scene,state);
  state.pendingStoryId = scene.id;
  if(presentation.eventCgId&&!state.cgCollection.some(entry=>entry.id===presentation.eventCgId))state.cgCollection.push({id:presentation.eventCgId,title:scene.title,image:presentation.backgroundUrl,day:state.day});
  SaveManager.save(state);
  sound.playBgm(scene.bgm ?? "theme",state.day);
  startImmersiveScene({id:scene.id,type:"story",presentation,sequence:createStorySceneSequence(scene,presentation),onChoice:choiceId=>{
    const result=resolveStoryChoice(state,scene.id,choiceId);
    if(!result)return null;
    state.logs.push({time:`DAY ${state.day} · STORY`,text:`${scene.title} — ${result.choice.label}`});
    SaveManager.save(state);sound.play("confirm");
    return createStoryReactionSequence(result);
  }});
}

function startImmersiveScene(session) {
  if (!session?.sequence?.length) return;
  if (["story","event","temptation"].includes(session.type) && !session.debugPreview && !areGameplayEventsUnlocked()) return;
  const runtimeStart=eventRuntime.start({...session,sceneId:session.sequence.find(step=>step.backgroundId)?.label??session.id,triggerReason:session.triggerReason??[]});
  if(!runtimeStart.started){persistEventRuntime(true);return;}
  if (sceneAdvanceTimer) clearTimeout(sceneAdvanceTimer);
  immersiveScene={...session,index:0,currentStep:null};
  document.body.classList.remove("ui-classic-mode");
  document.body.classList.add("ui-story-mode");
  $("#gameScreen").classList.remove("classic-mode");
  $("#gameScreen").classList.add("story-mode");
  $("#skipButton").classList.remove("hidden");
  $("#storyChoiceLayer").classList.add("hidden");
  $("#actionGrid").classList.add("hidden");
  $("#nextButton").classList.add("hidden");
  applyScenePresentation(session.presentation);
  eventRuntime.markAssets(session.presentation?.backgroundUrl?"READY":"FALLBACK");eventRuntime.transition("TRANSITIONING");persistEventRuntime(true);
  updateImmersiveCharacter(session.presentation.expressionId);
  renderImmersiveStep();
}

function updateImmersiveCharacter(expressionId="calm") {
  const character=$("#vnCharacter");
  const characterId=immersiveScene?.presentation?.characterId??"girlfriend";
  updateGiftVehicleLayer(characterId);
  const npcSprite=characterId!=="girlfriend"?getNpcSprite(characterId):"";
  if(npcSprite){character.src=npcSprite;character.dataset.expression=expressionId;$("#vnAccessoryLayer").hidden=true;return;}
  if(characterId==="girlfriend"&&immersiveScene?.previewOutfitImage){character.src=immersiveScene.previewOutfitImage;character.dataset.expression=expressionId;$("#vnAccessoryLayer").hidden=true;return;}
  state.currentExpression=expressionId;
  renderCharacter(character,state,$("#vnAccessoryLayer"),{expressionId,poseId:immersiveScene?.presentation?.poseId,outfitId:immersiveScene?.presentation?.outfitId});
}

function updateGiftVehicleLayer(characterId="girlfriend") {
  const layer=$("#vnGiftVehicleLayer");
  if(!layer||!state)return;
  const giftedVehicle=[...(state.inventory??[])].reverse().find(entry=>entry.owner==="girlfriend"&&getGiftVehicleAsset(entry.itemId));
  const asset=giftedVehicle?getGiftVehicleAsset(giftedVehicle.itemId):"";
  const show=Boolean(asset&&state.phase===2&&characterId==="girlfriend");
  layer.hidden=!show;
  layer.dataset.item=giftedVehicle?.itemId??"";
  if(show&&layer.getAttribute("src")!==asset)layer.src=asset;
}

function renderImmersiveStep() {
  if (!immersiveScene) return;
  const step=immersiveScene.sequence[immersiveScene.index++];
  immersiveScene.currentStep=step;
  eventRuntime.setProgress({sequenceIndex:Math.max(0,immersiveScene.index-1),sceneId:step?.label??eventRuntime.active?.sceneId,dialogueIndex:Math.max(0,immersiveScene.index-1),backgroundId:step?.backgroundId??immersiveScene.presentation?.backgroundId,bgmId:step?.bgmId??null});persistEventRuntime(step?.type==="transition"||step?.type==="choice");
  $("#storyChoiceLayer").classList.add("hidden");
  $("#storyChoiceLayer").innerHTML="";
  if (!step || step.type === "sceneEnd") { finishImmersiveScene(); return; }
  if(step.backgroundId){
    immersiveScene.presentation={...immersiveScene.presentation,backgroundId:step.backgroundId,backgroundUrl:getBackgroundAsset(step.backgroundId),characterId:step.characterId??immersiveScene.presentation.characterId,expressionId:step.expressionId??immersiveScene.presentation.expressionId,poseId:step.poseId??immersiveScene.presentation.poseId,outfitId:step.outfitId??immersiveScene.presentation.outfitId,weather:step.weather??immersiveScene.presentation.weather,timeOfDay:step.timeOfDay??immersiveScene.presentation.timeOfDay};
    applyScenePresentation(immersiveScene.presentation);
    if(step.bgmId)sound.playBgm(step.bgmId,state.day);
  }
  if (step.type === "transition") { if(eventRuntime.state!=="TRANSITIONING")eventRuntime.transition("TRANSITIONING",{sceneId:step.label});eventRuntime.input.lock(immersiveScene.id,"StoryTransition");showSceneTransition(step); return; }
  if (step.type === "characterEnter") { updateImmersiveCharacter(step.expressionId??immersiveScene.presentation.expressionId);$("#vnCharacter").classList.add("scene-character-enter"); $("#vnCharacter").dataset.animation=step.animationId??"idle-breathe"; queueSceneStep(420); return; }
  if (step.type === "expressionChange") { updateImmersiveCharacter(step.expressionId); queueSceneStep(220); return; }
  if (step.type === "choice") { if(eventRuntime.state!=="WAITING_CHOICE")eventRuntime.transition("WAITING_CHOICE");eventRuntime.input.unlock(immersiveScene.id);persistEventRuntime(true);renderImmersiveChoices(step.options); return; }
  if (step.expressionId) updateImmersiveCharacter(step.expressionId);
  $("#sceneTitle").textContent=step.type === "narration" ? "내레이션" : step.speaker;
  $("#visualNovelStage").classList.toggle("narration-mode",step.type === "narration");
  typeDialogue(step.text);
  if(eventRuntime.state!=="WAITING_DIALOGUE")eventRuntime.transition("WAITING_DIALOGUE");eventRuntime.input.unlock(immersiveScene.id);persistEventRuntime();
  scheduleAutoAdvance();
}

function queueSceneStep(delay) { if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);sceneAdvanceTimer=setTimeout(()=>{sceneAdvanceTimer=null;renderImmersiveStep();},delay); }
function showSceneTransition(step) {
  const layer=$("#sceneTransition");layer.className=`scene-transition ${step.style??"fade"}`;layer.querySelector("span").textContent=step.label??"";
  requestAnimationFrame(()=>layer.classList.add("active"));
  sceneAdvanceTimer=setTimeout(()=>{layer.classList.remove("active");sceneAdvanceTimer=setTimeout(()=>{layer.classList.add("hidden");sceneAdvanceTimer=null;eventRuntime.input.unlock(immersiveScene?.id);if(eventRuntime.state==="TRANSITIONING")eventRuntime.transition("PLAYING");persistEventRuntime();renderImmersiveStep();},360);},720);
}
function renderImmersiveChoices(options=[]) {
  const layer=$("#storyChoiceLayer");
  layer.innerHTML=options.map(option=>`<button type="button" data-immersive-choice="${escapeHtml(option.id)}">${escapeHtml(option.label)}</button>`).join("");
  layer.classList.remove("hidden");
  layer.querySelector("button")?.focus();
}
function chooseImmersiveOption(choiceId) {
  if(!immersiveScene?.onChoice)return;
  if(!eventRuntime.selectChoice(choiceId))return;
  const choiceResult=immersiveScene.onChoice(choiceId);
  const next=Array.isArray(choiceResult)?choiceResult:choiceResult?.sequence;
  if(!next?.length){eventRuntime.input.unlock(immersiveScene.id);eventRuntime.fail(new Error("Choice callback returned no sequence"),{sceneId:eventRuntime.active?.sceneId});persistEventRuntime(true);finishImmersiveScene();return;}
  immersiveScene.sequence=next;immersiveScene.index=0;immersiveScene.currentStep=null;
  eventRuntime.input.unlock(immersiveScene.id);eventRuntime.transition("PLAYING");persistEventRuntime(true);
  const temptationNpc=immersiveScene.type==="temptation"?state.npcs.find(npc=>immersiveScene.id===`temptation-${npc.instanceId}`):null;
  const secretChoice=TEMPTATION_CHOICES.secret;
  const resultPopup=choiceResult?.resultPopup??(temptationNpc&&choiceId==="secret"?{action:{id:"temptation-secret",title:`${temptationNpc.name}와 비밀 만남`},message:`${temptationNpc.name}와 둘만의 술자리를 선택했다. 설렘은 커졌지만 ${state.partner.name}와의 신뢰에는 위험한 균열이 생겼다.`,effects:{npcInterest:secretChoice.npcInterest,npcTrust:secretChoice.npcTrust,trust:secretChoice.partnerTrust,conflict:secretChoice.conflict}}:null);
  if(resultPopup){openActionResultModal(resultPopup.action,resultPopup.message,resultPopup.effects,renderImmersiveStep);return;}
  renderImmersiveStep();
}
function advanceImmersiveScene() { if(!immersiveScene||immersiveScene.currentStep?.type==="choice"||eventRuntime.input.snapshot().locked)return;if(eventRuntime.state==="WAITING_DIALOGUE")eventRuntime.transition("PLAYING");renderImmersiveStep(); }
function skipImmersiveScene(event) { event.stopPropagation();if(!immersiveScene)return;if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);sceneAdvanceTimer=null;eventRuntime.input.unlock(immersiveScene.id);const choice=immersiveScene.sequence.find(step=>step.type==="choice");if(choice){if(eventRuntime.state==="TRANSITIONING")eventRuntime.transition("PLAYING");if(eventRuntime.state!=="WAITING_CHOICE")eventRuntime.transition("WAITING_CHOICE");immersiveScene.index=immersiveScene.sequence.indexOf(choice)+1;immersiveScene.currentStep=choice;eventRuntime.setProgress({sequenceIndex:immersiveScene.index-1,dialogueIndex:immersiveScene.index-1});persistEventRuntime(true);renderImmersiveChoices(choice.options);}else finishImmersiveScene(); }
function finishImmersiveScene() {
  if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);sceneAdvanceTimer=null;const completedSession=immersiveScene;eventRuntime.input.unlock(completedSession?.id);eventRuntime.complete();immersiveScene=null;persistEventRuntime(true);
  $("#visualNovelStage").classList.remove("narration-mode");$("#skipButton").classList.add("hidden");$("#storyChoiceLayer").classList.add("hidden");$("#actionGrid").classList.remove("hidden");$("#nextButton").classList.remove("hidden");
  SaveManager.save(state);render();const queued=eventRuntime.queue.shift();if(queued)setTimeout(()=>startImmersiveScene(queued),0);
}

function restoreEventCheckpoint(){
  const saved=state?.eventRuntime;if(!saved?.activeEvent||!saved.checkpoint||state.storyFlags?.[`${saved.activeEvent}:COMPLETED`])return;
  if(!areGameplayEventsUnlocked()){state.eventRuntime={...saved,activeEvent:null,state:"IDLE",checkpoint:null,eventQueue:[],microQueue:[],pendingEvent:null,inputLock:{locked:false,owner:null,reason:null,lockedFor:0}};SaveManager.save(state);return;}
  const situation=SITUATION_EVENTS.find(event=>event.id===saved.activeEvent);
  if(situation){const index=Math.max(0,Number(saved.checkpoint.sequenceIndex)||0);openEventScene(situation,{resumeSequenceIndex:index});toast("진행 중이던 에피소드를 안전한 지점에서 복구했어요.");return;}
  const story=getStoryScene(saved.activeEvent);if(story){openStoryScene(story);toast("진행 중이던 스토리를 Scene 시작점에서 복구했어요.");return;}
  state.logs.push({time:`DAY ${state.day} · RECOVERY`,text:`알 수 없는 이벤트 ${saved.activeEvent}를 건너뛰고 안전 지점으로 복구했다.`});state.eventRuntime={...saved,activeEvent:null,state:"IDLE",checkpoint:null,inputLock:{locked:false,owner:null,reason:null,lockedFor:0}};SaveManager.save(state);
}

const MBTI_TYPES = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
const PERSONALITY_LABELS = { romanticism:"로맨틱", independence:"독립적", loyalty:"한결같음", emotionalSensitivity:"섬세함", socialPreference:"사교적", contactImportance:"연락 중시" };

function setOnboardingProgress(step, total = 3) {
  $("#onboardingStepLabel").textContent = `STEP ${step} / ${total}`;
  $("#onboardingProgressBar").style.width = `${step / total * 100}%`;
}

function runRoll(button, output, samples, finalize) {
  button.disabled = true;
  let index = 0;
  const timer = setInterval(() => { output.textContent = samples[index++ % samples.length]; }, 75);
  setTimeout(() => {
    clearInterval(timer);
    output.textContent = finalize();
    button.disabled = false;
  }, 900);
}

function personalitySummary(partner) {
  return Object.entries(partner.personality)
    .filter(([key]) => PERSONALITY_LABELS[key])
    .sort((a,b) => b[1] - a[1]).slice(0,3)
    .map(([key,value]) => `${PERSONALITY_LABELS[key]} ${value}`).join(" · ");
}

function beginOnboarding() {
  onboarding = { step:1, partner:null, girlfriendTraitsReady:false, girlfriendJobReady:false, playerArchetype:null, playerName:"", playerJob:null, previewState:null };
  $("#introScreen").classList.add("hidden");
  $("#onboardingScreen").classList.remove("hidden");
  renderGirlfriendSetup();
}

function renderGirlfriendSetup() {
  setOnboardingProgress(1);
  const candidates = HEROINE_PROFILES.slice(0,3);
  $("#onboardingContent").innerHTML = `
    <header class="setup-heading"><span>GIRLFRIEND SELECT</span><h1>여자친구 캐릭터 선택</h1><p>보라색 머리 캐릭터를 선택한 뒤 MBTI와 직업을 확인하세요. 이름은 그대로 유지됩니다.</p></header>
    <div class="setup-card-grid heroine-select-grid">${candidates.map((profile,index)=>`<button class="setup-character-card ${onboarding.partner?.heroineId===profile.id?"selected":""}" data-heroine="${profile.id}" type="button" ${index?"disabled":""}><img src="${getGirlfriendVisual().previewImage}?v=6" alt="${escapeHtml(profile.name)}"><strong>${escapeHtml(profile.name)}</strong><span>${index?"준비 중 · 선택 불가":"선택 가능"}</span></button>`).join("")}</div>
    <div class="roll-panel ${onboarding.partner?"":"locked"}">
      <div class="roll-row"><div><small>MBTI</small><b id="girlfriendTraitRoll">${onboarding.girlfriendTraitsReady?escapeHtml(onboarding.partner.mbti):"버튼을 눌러 MBTI 선택"}</b></div><button id="rollGirlfriendTraits" type="button" ${onboarding.partner?"":"disabled"}>MBTI 랜덤 선택</button></div>
      <div class="roll-row"><div><small>CAREER</small><b id="girlfriendJobRoll">${onboarding.girlfriendJobReady?escapeHtml(onboarding.partner.career.name):"여자친구의 직업"}</b></div><button id="rollGirlfriendJob" type="button" ${onboarding.partner?"":"disabled"}>직업 랜덤 선택</button></div>
    </div>
    <button id="girlfriendSetupNext" class="primary-button setup-next" type="button" ${onboarding.girlfriendTraitsReady&&onboarding.girlfriendJobReady?"":"disabled"}>나의 캐릭터 선택으로</button>`;
  document.querySelectorAll("[data-heroine]").forEach((button)=>button.addEventListener("click",()=>{
    onboarding.partner=createGirlfriendFromProfile(button.dataset.heroine);
    onboarding.girlfriendTraitsReady=onboarding.girlfriendJobReady=false;
    renderGirlfriendSetup();
  }));
  $("#rollGirlfriendTraits")?.addEventListener("click",(event)=>runRoll(event.currentTarget,$("#girlfriendTraitRoll"),MBTI_TYPES,()=>{rerollGirlfriendPersonality(onboarding.partner);onboarding.partner.mbti=MBTI_TYPES[Math.floor(Math.random()*MBTI_TYPES.length)];onboarding.girlfriendTraitsReady=true;setTimeout(renderGirlfriendSetup,120);return onboarding.partner.mbti;}));
  $("#rollGirlfriendJob")?.addEventListener("click",(event)=>{const careers=GIRLFRIEND_JOBS.filter((career)=>career.id!=="high-school-senior"&&career.id!==onboarding.partner.career?.id);runRoll(event.currentTarget,$("#girlfriendJobRoll"),careers.map((career)=>career.name),()=>{const selected=structuredClone(careers[Math.floor(Math.random()*careers.length)]);selected.heroineId=onboarding.partner.heroineId;onboarding.partner.career=selected;onboarding.partner.job=selected.name;onboarding.girlfriendJobReady=true;setTimeout(renderGirlfriendSetup,120);return selected.name;});});
  $("#girlfriendSetupNext")?.addEventListener("click",renderPlayerSetup);
}

function selectPlayerArchetype(id) {
  onboarding.playerArchetype = id;
  renderPlayerSetup();
}

function showPremiumConfirmation(archetype) {
  const overlay=document.createElement("div");
  overlay.className="premium-confirm-overlay";
  overlay.innerHTML=`<div class="premium-confirm"><span>PREMIUM CHARACTER</span><h2>${escapeHtml(archetype.name)}</h2><p>유료 캐릭터 선택 팝업입니다. 현재 데모에서는 결제 없이 선택 확인만 진행합니다.</p><div><button data-cancel type="button">취소</button><button data-confirm type="button">확인하고 선택</button></div></div>`;
  $("#onboardingContent").append(overlay);
  overlay.querySelector("[data-cancel]").addEventListener("click",()=>overlay.remove());
  overlay.querySelector("[data-confirm]").addEventListener("click",()=>selectPlayerArchetype(archetype.id));
}

function renderPlayerSetup() {
  onboarding.step=2; setOnboardingProgress(2);
  $("#onboardingContent").innerHTML=`
    <header class="setup-heading"><span>PLAYER SETUP</span><h1>나의 생김새 선택</h1><p>외형과 이름, 직업은 게임의 능력치와 대사에 그대로 적용됩니다.</p></header>
    <div class="setup-card-grid player-select-grid">${PLAYER_ARCHETYPES.map((entry)=>`<button class="setup-character-card ${onboarding.playerArchetype===entry.id?"selected":""}" data-player="${entry.id}" type="button"><img src="${entry.image}" alt="${entry.name}"><strong>${entry.name}${entry.premium?" · PREMIUM":""}</strong><span>능력 ${entry.abilityRating} · 외모 ${entry.appearanceRating}</span><small>${entry.description}</small></button>`).join("")}</div>
    <div class="player-input-panel"><label for="playerNameInput">내 이름 <small>최대 3글자</small></label><input id="playerNameInput" maxlength="3" value="${escapeHtml(onboarding.playerName)}" placeholder="이름" autocomplete="off"><div class="roll-row"><div><small>MY CAREER</small><b id="playerJobRoll">${onboarding.playerJob?escapeHtml(onboarding.playerJob.name):"버튼을 눌러 직업 선택"}</b></div><button id="rollPlayerJob" type="button">내 직업 랜덤 선택</button></div></div>
    <button id="playerSetupNext" class="primary-button setup-next" type="button" ${onboarding.playerArchetype&&onboarding.playerName&&onboarding.playerJob?"":"disabled"}>최종 결과 확인</button>`;
  document.querySelectorAll("[data-player]").forEach((button)=>button.addEventListener("click",()=>{const archetype=PLAYER_ARCHETYPES.find((entry)=>entry.id===button.dataset.player);if(archetype.premium)showPremiumConfirmation(archetype);else selectPlayerArchetype(archetype.id);}));
  $("#playerNameInput").addEventListener("input",(event)=>{onboarding.playerName=Array.from(event.target.value.trim()).slice(0,3).join("");event.target.value=onboarding.playerName;$("#playerSetupNext").disabled=!(onboarding.playerArchetype&&onboarding.playerName&&onboarding.playerJob);});
  $("#rollPlayerJob").addEventListener("click",(event)=>runRoll(event.currentTarget,$("#playerJobRoll"),JOBS.map((job)=>job.name),()=>{onboarding.playerJob=generateJob();$("#playerSetupNext").disabled=!(onboarding.playerArchetype&&onboarding.playerName);return onboarding.playerJob.name;}));
  $("#playerSetupNext").addEventListener("click",renderSetupSummary);
}

function renderSetupSummary() {
  onboarding.step=3; setOnboardingProgress(3);
  const player=createPlayerProfile(onboarding.playerArchetype,onboarding.playerName);
  onboarding.previewState=createInitialState(onboarding.partner,Math.random,{player,job:onboarding.playerJob});
  const preview=onboarding.previewState;
  $("#onboardingContent").innerHTML=`<header class="setup-heading"><span>FINAL PROFILE</span><h1>${escapeHtml(player.name)}의 30일이 시작됩니다</h1><p>선택한 설정은 저장 데이터와 모든 게임 시스템에 적용됩니다.</p></header><div class="setup-summary"><img src="${player.image}" alt="${escapeHtml(player.name)}"><div><span>${escapeHtml(player.archetypeName)}</span><h2>${escapeHtml(player.name)}</h2><dl><div><dt>직업</dt><dd>${escapeHtml(preview.job.name)}</dd></div><div><dt>초기 자금</dt><dd>${money(preview.money)}</dd></div><div><dt>매력 / 패션</dt><dd>${preview.charm} / ${preview.fashion}</dd></div><div><dt>업무 / 사교</dt><dd>${preview.work} / ${preview.social}</dd></div></dl></div><div class="summary-partner"><small>GIRLFRIEND</small><strong>${escapeHtml(preview.partner.name)}</strong><span>${escapeHtml(preview.partner.mbti)} · ${escapeHtml(preview.partner.career.name)}</span><p>${personalitySummary(preview.partner)}</p></div></div><button id="openIntroButton" class="primary-button setup-next" type="button">다음 · 프롤로그 보기</button>`;
  $("#openIntroButton").addEventListener("click",openStoryIntro);
}

function openStoryIntro() {
  $("#onboardingScreen").classList.add("hidden");
  $("#storyIntroScreen").classList.remove("hidden");
  const video=$("#introVideo");
  introVideoIndex=0;
  video.src=INTRO_VIDEO_PLAYLIST[introVideoIndex];
  video.load();
  $("#introGameStartButton").disabled=true;
  $("#introPlaybackHint").textContent="프롤로그 1 / 2를 재생하고 있습니다.";
  video.play().catch(()=>{$("#introPlaybackHint").textContent="재생 버튼을 눌러 프롤로그를 감상해 주세요.";});
}

function playNextIntroVideo() {
  const video=$("#introVideo");
  if (introVideoIndex >= INTRO_VIDEO_PLAYLIST.length - 1) { unlockIntroStart(); return; }
  introVideoIndex += 1;
  video.src=INTRO_VIDEO_PLAYLIST[introVideoIndex];
  video.load();
  $("#introPlaybackHint").textContent=`프롤로그 ${introVideoIndex + 1} / ${INTRO_VIDEO_PLAYLIST.length}를 재생하고 있습니다.`;
  video.play().catch(()=>{$("#introPlaybackHint").textContent="다음 프롤로그의 재생 버튼을 눌러 주세요.";});
}

function unlockIntroStart(message="프롤로그가 끝났습니다. 이제 게임을 시작하세요.") { $("#introPlaybackHint").textContent=message; $("#introGameStartButton").disabled=false; }
function finishOnboarding() { state=onboarding.previewState; SaveManager.save(state); showGame(); }
function startGame() { beginOnboarding(); }
function showGame() { state.actionHistory ??= []; $("#introScreen").classList.add("hidden"); $("#onboardingScreen").classList.add("hidden"); $("#storyIntroScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden"); $("#menuButton").classList.remove("hidden"); $("#fullscreenButton").classList.remove("hidden"); $("#loadButton").classList.add("hidden"); const theater=state.settings?.theaterMode??localStorage.getItem(THEATER_SETTING_KEY)!=="false";document.body.classList.toggle("theater-mode",theater);renderAutoButton();renderFullscreenButtons();render();setTimeout(restoreEventCheckpoint,0); }
function money(value) { return `₩ ${Math.round(value).toLocaleString("ko-KR")}`; }
function withParticle(word, consonantParticle, vowelParticle) { const last=String(word).charCodeAt(String(word).length-1); return `${word}${last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28?consonantParticle:vowelParticle}`; }

function render() {
  const p = state.partner, phase = phases[state.phase];
  document.body.dataset.heroine=p.heroineId;document.documentElement.style.setProperty("--heroine-accent",p.uiAccent??"#ff91b5");
  $("#dayLabel").textContent = `${state.day} · ${getWeekdayName(state.day)}`; $("#phaseIcon").textContent = phase.icon;
  if (state.phase === 3) { if(state.world?.mode==="district")renderWorldMap();else renderNightHome(); return; }
  document.body.classList.add("ui-classic-mode");
  document.body.classList.remove("ui-story-mode");
  document.body.classList.remove("ui-night-mode");
  $("#gameScreen").classList.add("classic-mode");
  $("#gameScreen").classList.remove("story-mode");
  $("#gameScreen").classList.remove("night-mode");
  $("#nightHome").classList.add("hidden");
  $(".play-panel").classList.remove("hidden");
  $("#visualNovelStage").dataset.scene = phase.key;
  applyScenePresentation(resolvePhasePresentation(state,phase.key));
  const sceneSoundKey = `${state.day}-${phase.key}`;
  if (sceneSoundKey !== lastSceneSoundKey) { lastSceneSoundKey = sceneSoundKey; sound.playScene(phase.key,state.day); }
  $("#phaseLabel").textContent = phase.label;
  $("#clockLabel").textContent = phase.time; $("#sceneTitle").textContent = state.day === 1 && state.phase === 0 ? "첫날의 아침" : phase.title;
  typeDialogue(phase.text); $("#partnerName").textContent = p.name; $("#partnerBio").textContent = `${p.career?.name ?? p.job} · ${p.archetype}`;
  $("#partnerAvatar").src = `${getGirlfriendVisual(p.visualId).previewImage}?v=6`;
  $("#partnerAvatar").alt = `${p.name} 프로필 사진`;
  const expression = renderCharacter($("#vnCharacter"),state,$("#vnAccessoryLayer"));
  updateGiftVehicleLayer("girlfriend");
  $("#vnExpressionLayer").className=`vn-expression-layer ${expression.tone}`;
  $("#vnExpressionLayer").innerHTML=`<span aria-hidden="true">${expression.icon}</span><b>${expression.label}</b>`;
  const relationship = getRelationshipState(state); $("#relationshipState").textContent = `● ${relationship.label}`; $("#relationshipState").dataset.tone = relationship.tone; $("#relationshipState").title = relationship.description;
  $("#affectionValue").textContent = Math.round(state.affection); $("#trustValue").textContent = Math.round(state.trust);
  $("#affectionBar").style.width = `${state.affection/10}%`; $("#trustBar").style.width = `${state.trust/10}%`;
  const traitRows = getVisibleTraitRows(state); const revealedCount = traitRows.filter(row => row.revealed).length;
  $("#moneyValue").textContent = money(state.money); $("#jobValue").textContent = `${state.player.name} · ${state.job.name} · Lv.${state.jobLevel}`; $("#traitProgress").textContent = `${revealedCount} / 5`;
  $("#lifeStatus").textContent = state.fatigue >= 70 ? "피로가 누적되는 중" : state.stress > 75 ? "한계에 가까움" : state.energy < 25 ? "휴식이 필요함" : state.confidence >= 70 ? "자신감이 넘치는 중" : state.affection > 750 ? "사랑이 깊어지는 중" : "나쁘지 않은 하루";
  $("#traitList").innerHTML = traitRows.map(row => row.revealed ? `<div class="trait"><span>${row.name}</span><b>${row.value}</b></div>` : `<div class="trait locked"><span>${row.name}</span><b>${row.confidence ? `${row.hint} · ${row.confidence}%` : "???"}</b></div>`).join("");
  const appearance = getEffectiveAppearance(state);
  const equippedItems = (state.inventory ?? []).filter(entry=>entry.owner==="player"&&entry.equipped).map(entry=>getItem(entry.itemId)).filter(Boolean);
  $("#vnEquipmentLayer").innerHTML = equippedItems.length ? `<small>NOW WEARING</small>${equippedItems.map(item=>`<span title="${escapeHtml(item.name)}">${item.icon}<b>${escapeHtml(item.name)}</b></span>`).join("")}` : "";
  const stats = [["체력",state.energy],["피로",state.fatigue],["건강",state.health],["스트레스",state.stress],[appearance.bonuses.attractiveness?`매력 +${appearance.bonuses.attractiveness}`:"매력",appearance.charm],[appearance.bonuses.fashion?`패션 +${appearance.bonuses.fashion}`:"패션",appearance.fashion],["자신감",state.confidence],["업무 능력",state.work],["사회성",state.social]];
  $("#statList").innerHTML = stats.map(([name,val])=>`<div class="stat"><div class="stat-head"><span>${name}</span><b>${Math.round(val)}</b></div><div class="stat-track"><i style="width:${clamp(val)}%;background:${name==='스트레스'?'#e5846d':''}"></i></div></div>`).join("");
  $("#actionGrid").innerHTML = actions[phase.key].map((a,i)=>({a,i})).filter(({a})=>isActionVisible(state,a)).map(({a,i})=>{ const availability=getActionAvailability(state,a); return `<button class="action-card ${state.selected===i?'selected':''} ${availability.available?'':'locked'}" data-index="${i}" ${availability.available?'':'disabled'}><span class="action-icon">${a.icon}</span><span class="cost">${availability.available?escapeHtml(a.tag):'🔒 '+escapeHtml(availability.reason)}</span><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.desc)}</p></button>`; }).join("");
  $("#eventLog").innerHTML = state.logs.length ? state.logs.slice(-4).reverse().map(l=>`<div class="log-item"><b>${l.time}</b><span>${l.text}</span></div>`).join("") : `<div class="log-item"><b>DAY 1</b><span>두 사람의 첫 번째 이야기가 시작되었습니다.</span></div>`;
  $("#turnCount").textContent = `${state.phase+1}번째 선택`; $("#nextButton").disabled = state.selected === null;
  $("#nextButton").textContent = state.selected === null ? "행동을 선택해 주세요" : (state.phase === 3 ? "하루 마무리하기 →" : "이 행동으로 결정 →");
  const nextPhase=phases[Math.min(state.phase+1,phases.length-1)];
  preloadSceneAssets([resolvePhasePresentation({...state,phase:Math.min(state.phase+1,3)},nextPhase.key)]);
}

function applyScenePresentation(presentation) {
  state.currentBackground=presentation.backgroundId;
  const stage=$("#visualNovelStage");
  if(stage){stage.dataset.weather=presentation.weather;stage.dataset.timeOfDay=presentation.timeOfDay;}
  const backdrop=$("#vnBackdrop");
  if(backdrop&&backdrop.dataset.backgroundId!==presentation.backgroundId){backdrop.dataset.backgroundId=presentation.backgroundId;backdrop.style.backgroundImage=`linear-gradient(180deg,#1d203114 0 62%,#17182773 100%),url("${presentation.backgroundUrl}")`;}
  verifyPresentationAsset(presentation,backdrop);
  const character=$("#vnCharacter");if(character)character.dataset.animation=presentation.animationId;
}

function verifyPresentationAsset(presentation,backdrop){
  if(!presentation?.backgroundUrl||!backdrop){eventRuntime.markAssets("FALLBACK");return;}
  const expectedId=presentation.backgroundId,image=new Image();let settled=false;
  const settle=(status)=>{if(settled)return;settled=true;eventRuntime.markAssets(status);persistEventRuntime();};
  const timeout=setTimeout(()=>settle("FALLBACK"),1500);
  image.onload=()=>{clearTimeout(timeout);settle("READY");};
  image.onerror=()=>{clearTimeout(timeout);if(backdrop.dataset.backgroundId===expectedId){const fallback=getBackgroundAsset("home-morning");backdrop.dataset.backgroundId="home-morning-fallback";backdrop.style.backgroundImage=`linear-gradient(180deg,#1d203114 0 62%,#17182773 100%),url("${fallback}")`;}settle("FALLBACK");};
  image.src=presentation.backgroundUrl;
}

function renderNightHome() {
  const night = ensureNightState(state);
  const home=getPlayerHomeProfile(state.player?.archetypeId);
  document.body.classList.remove("ui-story-mode","ui-classic-mode");
  document.body.classList.add("ui-night-mode");
  $("#gameScreen").classList.remove("story-mode","classic-mode");
  $("#gameScreen").classList.add("night-mode");
  $(".play-panel").classList.add("hidden");
  $("#nightHome").classList.remove("hidden");
  $("#worldMap").classList.add("hidden");
  const roomScene=$("#nightRoomScene");
  roomScene.classList.add("has-room-background");
  roomScene.style.backgroundImage=`linear-gradient(180deg,#10121b20,#0c0b16a1),url("${home.background}")`;
  roomScene.style.backgroundSize="cover";
  roomScene.style.backgroundPosition="center";
  $(".night-home-header h2").textContent=home.homeName;
  $("#nightClock").textContent = formatNightTime(night.minutes);
  $("#nightDayLabel").textContent = `DAY ${state.day} · ${getWeekdayName(state.day)}`;
  $("#phoneBadge").classList.toggle("hidden",night.messagesRead);
  $("#nightHomeTip").textContent = night.activities.length ? `오늘 밤: ${night.activities.map(item=>item.label).join(" · ")}` : "밤 활동은 시간을 사용합니다. 늦게 잘수록 내일 더 피곤해져요.";
  const soundKey = `${state.day}-night-home`;
  if (soundKey !== lastSceneSoundKey) { lastSceneSoundKey=soundKey;sound.playScene("night",state.day); }
}

function renderWorldMap() {
  const night=ensureNightState(state);
  const world=state.world;
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  document.body.classList.remove("ui-story-mode","ui-classic-mode");document.body.classList.add("ui-night-mode");
  $("#gameScreen").classList.remove("story-mode","classic-mode");$("#gameScreen").classList.add("night-mode");
  $(".play-panel").classList.add("hidden");$("#nightHome").classList.add("hidden");$("#worldMap").classList.remove("hidden");
  $("#worldCityLabel").textContent=`${map.cityId.toUpperCase()} · ${map.theme==="premium"?"PREMIUM DISTRICT":map.theme==="coast"?"COAST DISTRICT":"LOCAL DISTRICT"}`;
  $("#worldMapTitle").textContent=map.name;$("#worldMapSubtitle").textContent=map.subtitle;
  const transport=TRANSPORT_OPTIONS.find(option=>option.id===world.transport)??TRANSPORT_OPTIONS[0];
  $("#worldClock").textContent=`${formatNightTime(night.minutes)} · ${getWeekdayName(state.day)}`;$("#worldTransport").textContent=`${transport.icon} ${transport.name}${world.transportConfirmed?"":" 선택 필요"}`;
  const canvas=$("#worldMapCanvas");canvas.dataset.theme=map.theme;canvas.dataset.district=map.id;
  $("#worldScenery").innerHTML=getWorldSceneryMarkup(map);
  $("#worldRoadLayer").innerHTML=getRoadCells(map).map(cell=>`<i class="world-road-cell" style="--map-x:${cell.x/(map.width-1)*100}%;--map-y:${cell.y/(map.height-1)*100}%"></i>`).join("");
  $("#worldLocationLayer").innerHTML=map.locations.map(location=>`<button class="world-location ${world.discoveredLocations.includes(location.id)?"discovered":""}" type="button" data-world-location="${escapeHtml(location.id)}" style="--map-x:${location.x/(map.width-1)*100}%;--map-y:${location.y/(map.height-1)*100}%"><span>${location.icon}</span><b>${escapeHtml(getWorldLocationName(location))}</b><small>${escapeHtml(location.category)}</small></button>`).join("");
  const player=$("#worldPlayer");player.style.setProperty("--map-x",String(world.x/(map.width-1)));player.style.setProperty("--map-y",String(world.y/(map.height-1)));player.dataset.transport=world.transport;player.dataset.archetype=state.player?.archetypeId??"balanced";$("#worldPlayerName").textContent=state.player?.name??"나";
  $("#worldPlayerSprite").src=state.player?.mapImage??"assets/characters/map/PLAYER_BALANCED.png";
  const nearby=getNearbyLocation(world);const enter=$("#enterLocationButton");
  if(nearby){$("#nearbyLocation").innerHTML=`<b>${escapeHtml(nearby.name)}</b><span>${escapeHtml(nearby.description)}</span>`;enter.disabled=false;enter.textContent=nearby.category==="home"?"귀가하기":"장소 입장";enter.dataset.locationId=nearby.id;}
  else{$("#nearbyLocation").innerHTML="<b>동네를 둘러보세요</b><span>장소 가까이 이동하면 입장할 수 있습니다.</span>";enter.disabled=true;enter.textContent="장소 입장";delete enter.dataset.locationId;}
  canvas.focus({preventScroll:true});
}

function openWorldMap() {
  const home=getPlayerHomeProfile(state.player?.archetypeId);const map=WORLD_MAPS[home.districtId];
  state.world.mode="district";state.world.cityId="seoul";state.world.districtId=home.districtId;
  if(!Number.isFinite(state.world.x)||!Number.isFinite(state.world.y)){state.world.x=map.start.x;state.world.y=map.start.y;}
  SaveManager.save(state);renderWorldMap();
  if(!state.world.transportConfirmed)setTimeout(()=>openTransportSelector(true),0);
}

function returnToNightHome() { state.world.mode="home";SaveManager.save(state);renderNightHome(); }

function resetWorldForNextDay() {
  if(!state.world)return;
  const home=getPlayerHomeProfile(state.player?.archetypeId);
  const map=WORLD_MAPS[home.districtId]??WORLD_MAPS.dongsu;
  state.world.mode="home";
  state.world.cityId=map.cityId;
  state.world.districtId=map.id;
  state.world.x=map.start.x;
  state.world.y=map.start.y;
  state.world.transport=state.world.ownedVehicleId&&state.player?.archetypeId==="wealthy"?"car":"walk";
  state.world.transportConfirmed=Boolean(state.world.ownedVehicleId&&state.player?.archetypeId==="wealthy");
}

function payForTransport(option,cost=option.cost,minutes=option.minutes,label=option.name) {
  if(state.money<cost)return {ok:false,reason:`${option.name} 이용에 필요한 돈이 부족해요.`};
  const timeResult=spendNightTime(state,minutes,`${label} 이동`);
  if(!timeResult.ok)return timeResult;
  applyEffects(state,{money:-cost,...(option.effects??{})});
  if(cost>0)appendTransaction(state,{category:"transport",label:`${label} 이동`,amount:-cost});
  return {ok:true,time:timeResult.time};
}

function getWorldSceneryMarkup(map) {
  const labels={premium:"SEOUL · RIVER CITY",coast:"BUSAN · COASTAL NIGHT",romantic:"YEONHUI · HER NEIGHBORHOOD",nightlife:"HONGDAE · NIGHT LIFE",fitness:"SEONGSU · ACTIVE CITY",amusement:"JAMSIL · DREAM LAND",shopping:"MYEONGDONG · SHOPPING CITY",landmark:"NAMSAN · K TOWER",local:"DONGSU · OLD TOWN"};
  return `<span class="map-landmark-label">${labels[map.theme]??labels.local}</span>`;
}

function getWorldLocationName(location) {
  return location.category==="girlfriend-home"?`${state.partner?.name??"여자친구"}의 집`:location.name;
}

function finishWorldMove(option,result,cost=option.cost,label=option.name) {
  const payment=payForTransport(option,cost,option.minutes,label);
  if(!payment.ok){toast(payment.reason);return false;}
  const nearby=getNearbyLocation(state.world);
  const discovered=nearby&&!state.world.discoveredLocations.includes(nearby.id);
  if(discovered)state.world.discoveredLocations.push(nearby.id);
  SaveManager.save(state);renderWorldMap();
  toast(`${option.name} · ${result.movedSteps??"바로"}칸 · ${option.minutes}분${cost?` · ${money(cost)}`:" · 무료"}${discovered?` · ${nearby.name} 발견`:""}`);
  return true;
}

function moveOnWorldMap(dx,dy) {
  if(!state.world.transportConfirmed){openTransportSelector(true);return;}
  const option=TRANSPORT_OPTIONS.find(item=>item.id===state.world.transport)??TRANSPORT_OPTIONS[0];
  if(option.fastTravel){openTransportDestination(option);return;}
  const preview=structuredClone(state.world),result=moveWorldPlayer(preview,dx,dy,option.steps);
  if(!result.moved){toast("길을 따라 이동해 주세요.");return;}
  if(state.money<option.cost){toast(`${option.name} 이용에 필요한 돈이 부족해요.`);return;}
  const night=ensureNightState(state);if(night.minutes+option.minutes>26*60){toast("너무 늦어서 오늘은 더 이동할 수 없어요.");return;}
  state.world.x=preview.x;state.world.y=preview.y;
  finishWorldMove(option,result);
}

function handleWorldMapKeydown(event) { const moves={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};const move=moves[event.key];if(!move||!$("#modal").classList.contains("hidden"))return;event.preventDefault();moveOnWorldMap(...move); }

function handleWorldMoveClick(event) { const button=event.target.closest("[data-world-move]");if(!button)return;const [dx,dy]=button.dataset.worldMove.split(",").map(Number);moveOnWorldMap(dx,dy); }

function openTransportSelector(required=false) {
  const current=state.world.transport;
  const cards=TRANSPORT_OPTIONS.map(option=>{const locked=option.requiresVehicle&&!state.world.ownedVehicleId;return `<button class="transport-card ${current===option.id?"selected":""}" data-world-transport="${option.id}" type="button" ${locked?"disabled":""}><span>${option.icon}</span><b>${escapeHtml(option.name)}</b><small>${escapeHtml(option.description)}</small><em>${locked?"자동차 미보유":option.cost?`${money(option.cost)} / 1회`:"무료"}</em></button>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">MOVE STYLE</span><h2>이동수단 선택</h2><p>${required?"지도에서 이동하기 전에 이용할 수단을 선택해 주세요.":"이동수단에 따라 지도 위 캐릭터 표시가 달라집니다."}</p><div class="transport-grid">${cards}</div>`;openModal();
  document.querySelectorAll("[data-world-transport]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.worldTransport==="subway"&&getNearbyLocation(state.world)?.category!=="transport"){toast("지하철은 역 가까이에서 이용할 수 있어요.");return;}const result=selectWorldTransport(state.world,button.dataset.worldTransport);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);closeModal();renderWorldMap();toast(`${result.option.name} 이동으로 변경했습니다.`);if(result.option.fastTravel)setTimeout(()=>openTransportDestination(result.option),0);}));
}

function openTransportDestination(option) {
  const currentMap=WORLD_MAPS[state.world.districtId]??WORLD_MAPS.dongsu;
  if(option.id==="subway"&&getNearbyLocation(state.world)?.category!=="transport"){toast("지하철은 역 가까이에서 이용할 수 있어요.");openTransportSelector();return;}
  const destinations=option.fastTravel==="station"
    ? Object.values(WORLD_MAPS).filter(map=>map.cityId===currentMap.cityId).flatMap(map=>map.locations.filter(location=>location.category==="transport").map(location=>({...location,mapId:map.id,mapName:map.name})))
    : currentMap.locations.filter(location=>location.category!=="home").map(location=>({...location,mapId:currentMap.id,mapName:currentMap.name}));
  const cards=destinations.map(destination=>{const distance=destination.mapId===state.world.districtId?Math.abs(destination.x-state.world.x)+Math.abs(destination.y-state.world.y):8;const fare=option.id==="taxi"?option.cost+distance*1200:option.cost;return `<button class="transport-card" data-transport-destination="${escapeHtml(destination.id)}" data-map-id="${escapeHtml(destination.mapId)}" data-fare="${fare}" type="button"><span>${destination.icon}</span><b>${escapeHtml(destination.name)}</b><small>${escapeHtml(destination.mapName)} · ${option.minutes}분</small><em>${money(fare)}</em></button>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">${escapeHtml(option.name.toUpperCase())} DESTINATION</span><h2>${option.icon} 목적지 선택</h2><p>${option.id==="subway"?"이동할 역을 선택하세요. 역에서 역으로 빠르게 이동합니다.":"원하는 장소를 선택하세요. 거리에 따라 요금이 달라집니다."}</p><div class="transport-grid">${cards}</div>`;openModal();
  document.querySelectorAll("[data-transport-destination]").forEach(button=>button.addEventListener("click",()=>{
    const map=WORLD_MAPS[button.dataset.mapId],destination=map?.locations.find(item=>item.id===button.dataset.transportDestination);if(!destination)return;
    const fare=Number(button.dataset.fare);const payment=payForTransport(option,fare,option.minutes,`${option.name} · ${destination.name}`);if(!payment.ok){toast(payment.reason);return;}
    state.world.cityId=map.cityId;state.world.districtId=map.id;state.world.x=destination.x;state.world.y=destination.y;
    if(!state.world.discoveredLocations.includes(destination.id))state.world.discoveredLocations.push(destination.id);
    state.world.travelHistory.push({cityId:map.cityId,districtId:map.id,transport:option.id,destinationId:destination.id,day:state.day});
    SaveManager.save(state);closeModal();renderWorldMap();toast(`${option.name} · ${destination.name} 도착 · ${option.minutes}분 · ${money(fare)}`);
  }));
}

function openWorldAtlas(viewId=state.world.atlasView||"nationwide") {
  const view=WORLD_ATLAS[viewId]??WORLD_ATLAS.nationwide;state.world.atlasView=view.id;
  const tabs=Object.values(WORLD_ATLAS).map(item=>`<button data-atlas-view="${item.id}" class="${item.id===view.id?"selected":""}" type="button">${item.name}</button>`).join("");
  const homeDistrict=getPlayerHomeProfile(state.player?.archetypeId).districtId;
  const panels=view.id==="nationwide"
    ? `<div class="atlas-korea"><span>SEOUL</span><i></i><span>BUSAN</span></div><div class="atlas-destination-grid"><button data-atlas-view="seoul" type="button"><b>서울</b><small>동수동 · 금수동 · ${escapeHtml(state.partner.name)}의 동네</small></button><button data-atlas-view="busan" type="button"><b>부산</b><small>여행 생활권 · 해운동</small></button></div>`
    : view.id==="seoul"
      ? `<div class="atlas-city-card seoul"><b>서울 생활 지도</b><p>원하는 동네나 번화가로 바로 이동할 수 있습니다.</p><div class="atlas-district-grid"><button data-travel-district="${homeDistrict}" type="button">🏠 내 동네</button><button data-travel-district="yeonhui" type="button">💗 ${escapeHtml(state.partner.name)}의 동네</button><button data-travel-district="hongdae" type="button">🪩 홍대 클럽거리</button><button data-travel-district="seongsu" type="button">🏋️ 성수 피트니스</button><button data-travel-district="jamsil" type="button">🎡 잠실 놀이동산</button><button data-travel-district="myeongdong" type="button">🏬 명동 백화점거리</button><button data-travel-district="namsan" type="button">🗼 남산 K타워</button></div></div>`
      : `<div class="atlas-city-card busan"><b>부산 여행 지도</b><p>해운대·광안리·서면을 잇는 바다 여행 지역입니다.</p><button data-travel-city="busan" type="button">부산 해운동으로 이동</button></div>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">WORLD ATLAS</span><h2>${escapeHtml(view.name)} 지도</h2><p>${escapeHtml(view.subtitle)}</p><nav class="atlas-tabs" aria-label="지도 범위">${tabs}</nav>${panels}`;openModal();
  document.querySelectorAll("[data-atlas-view]").forEach(button=>button.addEventListener("click",()=>openWorldAtlas(button.dataset.atlasView)));
  document.querySelectorAll("[data-travel-district]").forEach(button=>button.addEventListener("click",()=>{travelToCity(state.world,"seoul",button.dataset.travelDistrict);SaveManager.save(state);closeModal();renderWorldMap();toast("서울 생활권으로 이동했습니다.");}));
  document.querySelectorAll("[data-travel-city]").forEach(button=>button.addEventListener("click",()=>{const result=travelToCity(state.world,button.dataset.travelCity,homeDistrict);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);closeModal();renderWorldMap();toast(`${result.map.name}으로 이동했습니다.`);}));
}

function getVenueMenu(location) {
  const menus={korean:"김밥 · 라면 · 순댓국 · 국밥 · 제육쌈밥",japanese:"라멘 · 돈부리 · 돈가스 · 스시",chinese:"짜장면 · 짬뽕 · 딤섬 · 마라탕",western:"파스타 · 스테이크 · 디저트",diet:"샐러드 · 포케 · 단백질 식단",cafe:"커피 · 차 · 디저트",bar:"맥주 · 하이볼 · 안주",club:"춤추기 · 공연 감상 · 새로운 사람 만나기",gym:"운동 · 트레이닝 · 체력 관리",amusement:"놀이기구 · 사진 · 퍼레이드",landmark:"전망 감상 · 사진 · 기념품",shopping:"패션 · 선물 · 생활용품",culture:"전시 관람 · 기념품",date:"산책 · 대화 · 사진 남기기","girlfriend-home":"여자친구와 대화하고 함께 시간을 보낸다"};return menus[location.category]??"주변을 둘러보고 새로운 이야기를 발견한다.";
}

const WORLD_EVENT_MAP_IMAGES={local:"assets/maps/dongsu-25d.jpg",premium:"assets/maps/gangnam-25d.jpg",coast:"assets/maps/busan-25d.jpg",romantic:"assets/maps/yeonhui-girlfriend-25d.png",nightlife:"assets/maps/hongdae-nightlife-25d.png",fitness:"assets/maps/seongsu-fitness-25d.png",amusement:"assets/maps/jamsil-park-25d.png",shopping:"assets/maps/myeongdong-shopping-25d.png",landmark:"assets/maps/namsan-ktower-25d.png"};
const WORLD_EVENT_COPY={korean:["따뜻한 음식 냄새가 두 사람의 긴장을 조금 누그러뜨렸다.","무엇을 먹으며 어떤 이야기를 나눌까?"],japanese:["조용한 식당 안에서 서로의 하루를 돌아볼 시간이 생겼다.","오늘 대화를 어떻게 시작할까?"],chinese:["분주한 식당의 소리 사이로 둘만의 대화가 이어졌다.","이 시간을 어떻게 보낼까?"],western:["차분한 조명 아래 평소보다 진지한 이야기를 꺼낼 수 있을 것 같다.","어떤 마음을 먼저 전할까?"],diet:["건강한 식사를 고르며 서로의 생활 습관을 자연스럽게 이야기했다.","서로에게 어떤 제안을 할까?"],cafe:["따뜻한 음료가 놓이자 미뤄 둔 이야기를 꺼내기 좋은 분위기가 됐다.","무엇부터 이야기할까?"],bar:["밤의 소음과 조명 속에서 평소보다 솔직한 말이 나올 것 같다.","오늘은 어떤 태도를 선택할까?"],club:["음악과 조명 속에서 새로운 사람들과 시선이 오갔다.","연인과 이 시간을 어떻게 보낼까?"],gym:["함께 몸을 움직이며 서로의 속도와 방식을 확인했다.","오늘 운동을 어떻게 이어 갈까?"],amusement:["화려한 불빛과 놀이기구가 평범한 밤을 특별하게 만들었다.","어떤 추억을 먼저 만들까?"],landmark:["도시의 불빛이 내려다보이는 곳에서 두 사람의 미래가 가까이 느껴졌다.","이 순간 어떤 말을 전할까?"],shopping:["여러 물건을 비교하며 취향과 소비 기준의 차이가 드러났다.","무엇을 기준으로 고를까?"],culture:["작품과 음악을 함께 보며 서로 몰랐던 취향을 발견했다.","발견한 마음을 어떻게 표현할까?"],date:["천천히 걷는 동안 말하지 못했던 이야기가 떠올랐다.","어떤 대화를 시작할까?"],transport:["다음 목적지로 향하기 전 잠시 숨을 고를 시간이 생겼다.","이동하기 전에 무엇을 할까?"]};

function getHaeunHomeMapEvent(){if(state.partner?.heroineId!=="haeun")return null;const id=state.trust<=700?"situation-haeun-home-outside-talk":state.trust<=900?"situation-haeun-home-tea-talk":"situation-haeun-home-meal";return SITUATION_EVENTS.find(event=>event.id===id)??null;}
function getWorldEventImage(map,event=null){return event?.image?.intro??WORLD_EVENT_MAP_IMAGES[map.theme]??WORLD_EVENT_MAP_IMAGES.local;}
function finishWorldEventLayer(){$("#modal").classList.remove("world-event-active");closeModal();renderWorldMap();}
function showWorldEventResult({map,image,title,response,effects={},mbtiLabel=""}){const labels={affection:"호감도",trust:"신뢰도",excitement:"흥미도",stress:"스트레스",energy:"에너지",fatigue:"피로",social:"사회성",confidence:"자신감",relationshipStress:"관계 스트레스"};const changes=Object.entries(effects).filter(([,value])=>Number(value)).map(([key,value])=>`<span class="${value>=0?"up":"down"}">${escapeHtml(labels[key]??key)} ${value>=0?"+":""}${Math.round(value)}</span>`).join("");$("#modalContent").innerHTML=`<article class="world-event-layer"><img class="world-event-image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}"><div class="world-event-copy"><span class="eyebrow">${escapeHtml(map.name)} · EVENT RESULT</span><h2>${escapeHtml(title)}</h2><p class="world-event-response">${escapeHtml(response)}</p>${mbtiLabel?`<p class="world-event-mbti">${escapeHtml(mbtiLabel)}에 맞는 반응이 추가로 반영됐습니다.</p>`:""}<div class="world-event-effects">${changes||"<span>특별한 수치 변화 없음</span>"}</div><button id="worldEventClose" class="primary-button" type="button">확인 · 지도로 돌아가기</button></div></article>`;$("#worldEventClose").addEventListener("click",finishWorldEventLayer);}

function openWorldEventLayer(map,location){
  const haeunEvent=location.category==="girlfriend-home"?getHaeunHomeMapEvent():null,image=getWorldEventImage(map,haeunEvent);
  const [message,question]=haeunEvent?[haeunEvent.message,haeunEvent.question]:(WORLD_EVENT_COPY[location.category]??[location.description,"이곳에서 무엇을 할까?"]);
  const choices=haeunEvent?.choices??[{id:"talk",label:"함께 둘러보며 솔직하게 대화한다",response:"장소를 천천히 둘러보며 서로의 생각을 편하게 나눴다.",effects:{affection:4,trust:3}},{id:"enjoy",label:"이곳에서 할 수 있는 활동을 즐긴다",response:"복잡한 생각은 잠시 내려놓고 지금의 경험을 함께 즐겼다.",effects:{excitement:6,stress:-3}},{id:"remember",label:"사진과 작은 추억을 남긴다",response:"평범한 방문이 나중에도 떠올릴 수 있는 두 사람의 기억이 됐다.",effects:{affection:5,confidence:2}}];
  $("#modal").classList.add("world-event-active");$("#modalContent").innerHTML=`<article class="world-event-layer"><img class="world-event-image" src="${escapeHtml(image)}" alt="${escapeHtml(getWorldLocationName(location))} 이벤트"><div class="world-event-copy"><span class="eyebrow">${escapeHtml(map.name)} · LOCATION EVENT</span><h2>${location.icon} ${escapeHtml(getWorldLocationName(location))}</h2><p>${escapeHtml(message)}</p><strong class="world-event-question">${escapeHtml(question)}</strong><div class="world-event-choices">${choices.map(choice=>`<button type="button" data-world-event-choice="${escapeHtml(choice.id)}">${escapeHtml(choice.label)}</button>`).join("")}</div></div></article>`;
  document.querySelectorAll("[data-world-event-choice]").forEach(button=>button.addEventListener("click",()=>{const choice=choices.find(item=>item.id===button.dataset.worldEventChoice);if(!choice)return;let effects=choice.effects??{},response=choice.response??choice.memory,mbtiLabel="";if(haeunEvent){const result=resolveSituationEventChoice(state,haeunEvent,choice.id);if(!result)return;effects=result.effects;response=choice.response??choice.memory;mbtiLabel=result.mbtiAdjustment?.label??"";}else applyEffects(state,effects);recordMemory(state,{type:"map-event",summary:`${getWorldLocationName(location)}: ${choice.label}`,importance:3,tags:["지도",map.id,location.id,choice.id]});state.logs.push({time:`DAY ${state.day} · MAP EVENT`,text:`${getWorldLocationName(location)} — ${choice.label}`});SaveManager.save(state);showWorldEventResult({map,image,title:getWorldLocationName(location),response,effects,mbtiLabel});}));
}

function openWorldLocation() {
  const id=$("#enterLocationButton").dataset.locationId;if(!id)return;const map=WORLD_MAPS[state.world.districtId];const location=map.locations.find(item=>item.id===id);if(!location)return;
  if(location.category==="home"){returnToNightHome();return;}
  $("#modalContent").innerHTML=`<span class="eyebrow">${escapeHtml(map.name)} · ${escapeHtml(location.category.toUpperCase())}</span><h2>${location.icon} ${escapeHtml(getWorldLocationName(location))}</h2><p>${escapeHtml(location.description)}</p><div class="venue-menu-preview"><small>이곳에서 할 수 있는 일</small><strong>${escapeHtml(getVenueMenu(location))}</strong></div><button id="visitLocationConfirm" class="primary-button" type="button">둘러보기 · 20분</button>`;openModal();
  $("#visitLocationConfirm").addEventListener("click",()=>{const result=spendNightTime(state,20,`${location.name} 방문`);if(!result.ok){toast(result.reason);return;}discoverLocation(state.world,location.id,state.day);state.logs.push({time:`DAY ${state.day} · MAP`,text:`${map.name}의 ${location.name}에 방문했다.`});SaveManager.save(state);openWorldEventLayer(map,location);});
}

function openDailyReport() {
  const rows=getDailyReport(state);
  const statRows=rows.filter(row=>!["affection","trust"].includes(row.key)).map(row=>`<div class="report-row"><span>${row.label}</span><b>${row.key==="money"?money(row.before):row.before} → ${row.key==="money"?money(row.after):row.after}</b><em class="${row.delta>=0?'up':'down'}">${row.delta>=0?'+':''}${row.key==="money"?money(row.delta):row.delta}</em></div>`).join("");
  const relation=rows.filter(row=>["affection","trust"].includes(row.key));
  const relationRows=relation.map(row=>`<div class="report-row"><span>${row.label}</span><b>${row.before} → ${row.after}</b><em class="${row.delta>=0?'up':'down'}">${row.delta>=0?'▲':'▼'} ${Math.abs(row.delta)}</em></div>`).join("");
  const mood=(state.affection-(state.dayStartSnapshot?.affection??state.affection))+(state.trust-(state.dayStartSnapshot?.trust??state.trust));
  const ledger=(state.economyLedger??[]).filter(entry=>entry.day===state.day).map(entry=>`<li><span>${escapeHtml(entry.label)}</span><b>${entry.amount>=0?'+':''}${money(entry.amount)}</b></li>`).join("")||"<li><span>별도 거래 없음</span><b>—</b></li>";
  const traits=getVisibleTraitRows(state).map(row=>`<div class="report-row"><span>${escapeHtml(row.name)}</span><b>${escapeHtml(row.revealed?row.value:row.hint||"아직 잘 모르겠다")}</b>${row.revealed?'<em class="up">알아냄</em>':'<em>???</em>'}</div>`).join("");
  $("#modalContent").innerHTML=`<article class="daily-report"><span class="eyebrow">DAY ${state.day} · ${getWeekdayName(state.day)} REPORT</span><h2>오늘 하루의 기록</h2><p>${mood>8?`${withParticle(state.partner.name,"과","와")} 조금 더 가까워진 하루였어요.`:mood<0?`${state.partner.name}의 마음에 조금 신경 쓰이는 것이 남았어요.`:"평온하지만 여운이 남는 하루였어요."}</p><h3>생활과 성장</h3><div class="report-list">${statRows}</div><h3>${escapeHtml(withParticle(state.partner.name,"과","와"))}의 관계</h3><div class="report-list">${relationRows}</div><h3>지금까지 알아낸 ${escapeHtml(state.partner.name)}</h3><div class="report-list">${traits}</div><h3>오늘의 수입과 지출</h3><ul class="report-ledger">${ledger}</ul></article>`;
  openModal();
}

function openTodayLog() {
  const rows=(state.logs??[]).filter(entry=>entry.time.includes(`DAY ${state.day}`)).map(entry=>`<div class="history-entry"><small>${escapeHtml(entry.time)}</small><p>${escapeHtml(entry.text)}</p></div>`).join("")||"<p>오늘 기록이 아직 없어요.</p>";
  $("#modalContent").innerHTML=`<span class="eyebrow">TODAY'S RECORD</span><h2>DAY ${state.day} · ${getWeekdayName(state.day)} 오늘의 기록</h2><div class="dialogue-history">${rows}</div>`;openModal();
}

function openSns() {
  const close=state.affection>=650;
  $("#modalContent").innerHTML=`<article class="sns-feed"><span class="eyebrow">SOCIAL FEED · NOW</span><h2>${escapeHtml(state.partner.name)}의 오늘</h2><div class="sns-post"><b>${escapeHtml(state.partner.name)} ♥</b><p>${close?'“오늘은 오래 기억하고 싶은 날 🤍”':'“길었던 하루. 이제야 조금 쉬는 중.”'}</p><small>♥ ${87+state.day*4} · 댓글 ${2+state.day%5}</small></div><p class="sns-hint">${state.npcs?.some(npc=>npc.relationshipType==='rival')?'낯익은 계정이 좋아요를 남겼다. 누구인지 조금 신경 쓰인다.':'친구들의 평범한 밤이 피드에 흐르고 있다.'}</p></article>`;openModal();
}

function openSchedule() { const tomorrow=Math.min(30,state.day+1);$("#modalContent").innerHTML=`<span class="eyebrow">30 DAYS CALENDAR</span><h2>우리의 일정</h2><div class="schedule-card"><b>DAY ${state.day} · ${getWeekdayName(state.day)}</b><span>오늘의 일정을 마무리하는 중</span></div><div class="schedule-card"><b>DAY ${tomorrow} · ${getWeekdayName(tomorrow)}</b><span>내일의 선택은 아직 정해지지 않았어요.</span></div>`;openModal(); }

function openCgGallery() {
  const unlocked=state.cgCollection??[];
  const unlockedCards=unlocked.map(entry=>`<article class="cg-card"><img src="${entry.image}" alt="${escapeHtml(entry.title)}" loading="lazy"><div><small>DAY ${entry.day}</small><b>${escapeHtml(entry.title)}</b></div></article>`).join("");
  const lockedCards=Array.from({length:Math.max(0,8-unlocked.length)},(_,index)=>`<article class="cg-card locked"><span>?</span><div><small>LOCKED ${index+1}</small><b>???</b></div></article>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">CG COLLECTION</span><h2>기억에 남은 장면</h2><p>${unlocked.length} / 8 해금 · 중요 장면을 직접 보면 앨범에 저장됩니다.</p><div class="cg-gallery">${unlockedCards}${lockedCards}</div>`;openModal();
}

function openNightPc() {
  const workButton=isWeekend(state.day)?"":`<button data-pc-action="work">💼 야간 업무<small>수입 증가 · 스트레스 증가</small></button>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">MY COMPUTER · 60 MIN</span><h2>컴퓨터로 무엇을 할까?</h2><div class="pc-actions"><button data-pc-action="game">🎮 게임하기<small>스트레스 완화 · 피로 증가</small></button><button data-pc-action="study">📚 자기계발<small>업무 능력 증가 · 피로 증가</small></button>${workButton}</div>`;openModal();
  document.querySelectorAll("[data-pc-action]").forEach(button=>button.addEventListener("click",()=>{const result=spendNightTime(state,60,button.textContent.trim().split(" ")[1]||"PC 활동");if(!result.ok){toast(result.reason);return;}const id=button.dataset.pcAction;const effects=id==="game"?{stress:-10,fatigue:8,energy:-5}:id==="study"?{work:6,confidence:3,fatigue:9,energy:-7}:{money:50000,work:5,stress:10,fatigue:12,energy:-10};applyEffects(state,effects);if(effects.money)appendTransaction(state,{category:"night-work",label:"야간 업무",amount:effects.money});SaveManager.save(state);closeModal();render();toast(`${result.time} · 밤 활동을 마쳤어요.`);}));
}

function goToSleep() {
  const night=ensureNightState(state);
  $("#modalContent").innerHTML=`<span class="eyebrow">SLEEP · ${formatNightTime(night.minutes)}</span><h2>오늘은 이제 잘까?</h2><p>${night.minutes>=25*60?'늦은 시간이어서 내일 피곤할 수 있어요.':'오늘의 기록을 저장하고 다음 날로 넘어갑니다.'}</p><button id="sleepConfirm" class="primary-button" type="button">취침 · SAVE · NEXT DAY →</button>`;openModal();
  $("#sleepConfirm").addEventListener("click",()=>{if(!night.messagesRead){const importance=state.partner.personality.contactImportance;applyEffects(state,{affection:-Math.max(1,Math.round(importance/25)),trust:-Math.max(1,Math.round(importance/20))});state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}의 메시지를 확인하지 않고 잠들었다.`});}applyEffects(state,getLateSleepEffects(night.minutes));state.selected=actions.night.findIndex(action=>action.id==="early-sleep");SaveManager.save(state);closeModal();applyAction();});
}

function handleRoomAction(event) {
  const button=event.target.closest("[data-room-action]");if(!button)return;
  const handlers={phone:openGameMenu,pc:openNightPc,wardrobe:openInventory,report:openDailyReport,bed:goToSleep,exit:openWorldMap};handlers[button.dataset.roomAction]?.();
}

function selectAction(index) { state.selected = index; sound.play("select"); render(); scheduleAutoAdvance(); }
function handleActionGridClick(event) {
  event.stopPropagation();
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest(".action-card");
  if (!button || button.disabled) return;
  selectAction(Number(button.dataset.index));
}
function applyAction() {
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  if (state.selected === null) return;
  const phase = phases[state.phase], action = actions[phase.key][state.selected];
  const eventsUnlocked = areGameplayEventsUnlocked(state.day);
  const availability = getActionAvailability(state, action);
  if (!availability.available) { toast(availability.reason); state.selected=null; render(); return; }
  if ((action.effects.money ?? 0) < 0 && state.money + action.effects.money < 0) { toast("돈이 부족해 이 행동을 할 수 없어요."); return; }
  const consequence = calculateActionEffects(state, action);
  const fx = consequence.effects;
  if (action.random) { const win = Math.random() > .48, leverage=state.player?.archetypeId==="wealthy"?10:1; fx.money = (win ? Math.round(40000+Math.random()*90000) : -Math.round(25000+Math.random()*70000))*leverage; toast(win ? `투자 성공${leverage>1?" · 부자 특전 ×10":""}! ${money(fx.money)}` : `투자 손실${leverage>1?" · 부자 특전 ×10":""} ${money(Math.abs(fx.money))}`); }
  applyEffects(state, fx);
  if (fx.money) appendTransaction(state, { category:"action", label:action.title, amount:Math.round(fx.money) });
  const acquiredItem = acquireActionItem(state, action);
  if (acquiredItem && getItem(acquiredItem.itemId)?.category==="car" && acquiredItem.owner==="player" && state.world) { state.world.ownedVehicleId=acquiredItem.itemId;state.world.transport="car";state.world.transportConfirmed=true; }
  if (acquiredItem) { const giftResult=action.autoGift?giveGift(state,acquiredItem.instanceId):null; toast(giftResult?`${giftResult.item.name} 선물 · “${giftResult.reaction.reaction}”`:`${getItem(acquiredItem.itemId).name} 획득${acquiredItem.equipped?' · 장착 완료':''}`); }
  const promotion = addJobProgress(state, action, fx);
  if (promotion) toast(`승진! 직업 레벨 ${promotion.level} · 수입 보정 상승`);
  const npcResult = eventsUnlocked ? applyNpcActionEffects(state, action) : null;
  if (npcResult) state.logs.push({time:`DAY ${state.day} · NPC`,text:`${npcResult.npc.name}와의 관계가 변했다.`});
  const rivalResult = eventsUnlocked ? applyRivalPressure(state, action) : null;
  if (rivalResult?.record.delta > 0) state.logs.push({time:`DAY ${state.day} · RIVAL`,text:`${rivalResult.rival.name}의 접근 위험이 높아졌다.`});
  state.choices.push(action.tag); state.actionHistory.push({ day:state.day, phase:state.phase, actionId:action.id, tag:action.tag }); state.logs.push({time:`DAY ${state.day} · ${phase.time}`,text:`${action.title} — ${resultText(action)}`});
  if (["데이트","유혹","쇼핑"].includes(action.tag)) recordMemory(state,{type:"action",summary:action.title,importance:action.tag==="유혹"?4:2,tags:[action.tag]});
  const clue = observePersonality(state, action.tag);
  if (clue?.revealed) toast(`${state.partner.name}의 성향을 하나 알아냈어요.`);
  state.selected = null;
  const finishedDay = state.phase === 3; const completedDay = state.day;
  advanceTime(state);
  const initiatedMessage = eventsUnlocked ? maybeGenerateInitiatedMessage(state) : null;
  if (initiatedMessage) { state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}: ${initiatedMessage.text}`}); toast(`${state.partner.name}에게 메시지가 왔어요`); }
  if (finishedDay) { dailyEvent(); advanceStockMarket(state); const transactions=processDayEndEconomy(state,completedDay); transactions.forEach(entry=>state.logs.push({time:`DAY ${completedDay} · ECONOMY`,text:`${entry.label} ${entry.amount>=0?'+':''}${money(entry.amount)}`})); runDailyStoryDirector(state,completedDay); SaveManager.save(state); if(state.day<=30){resetForNextDay(state);resetWorldForNextDay();} }
  const microEvents=eventsUnlocked?rollMicroEvents(state):[];microEvents.forEach(micro=>state.logs.push({time:`DAY ${micro.day} · MICRO`,text:micro.text}));
  const event = eventsUnlocked?rollEvent(state):null;
  if (event) {
    state.logs.push({time:`DAY ${state.day} · EVENT`,text:`${event.title} — ${event.message}`});
    recordMemory(state,{type:"event",summary:event.title,importance:3,tags:["이벤트",event.id]});
  }
  const breakup = eventsUnlocked ? evaluateBreakup(state) : null;
  sound.play("confirm");
  const currentExpression = resolveCharacterExpression(state);
  state.currentExpression = currentExpression.tone;
  state.currentPose = resolveCharacterPose(state,currentExpression);
  state.currentOutfit = resolveCharacterOutfit(state,currentExpression);
  state.currentAccessory = resolveCharacterAccessory(state);
  SaveManager.save(state);
  const actionMessage = [resultText(action), ...microEvents.map(micro=>micro.text)].join(" ");
  render();
  openActionResultModal(action, actionMessage, fx, () => {
    if (breakup) showBreakup(breakup); else if (state.day > 30) showEnding(); else { const temptation=eventsUnlocked&&npcResult&&getTemptationOpportunity(state); const story=eventsUnlocked?selectNextStoryScene(state):null; if(story) openStoryScene(story); else if(temptation) openTemptation(temptation); else if(event) openEventScene(event); else if(["데이트","쇼핑"].includes(action.tag)) sound.playBgm("dateShopping",state.day); else if(action.tag==="유혹") sound.playBgm("crisis",state.day); }
  });
}

function resultText(a) { if(a.tag==="데이트") return `${state.partner.name}의 표정이 한결 밝아졌다.`; if(a.tag==="성공") return "미래를 위한 한 걸음을 내디뎠다."; if(a.tag==="유혹") return "새로운 인연의 기척이 느껴진다."; if(a.tag==="연락") return "짧은 대화가 두 사람을 조금 더 가깝게 했다."; return "선택의 결과가 하루에 남았다."; }
function dailyEvent() { if(state.day%5===0){ const good=Math.random()>.45; const amount=good?60000:-35000; const label=good?"예상하지 못한 성과급":"갑작스러운 생활비 지출"; recordTransaction(state,{category:"event",label,amount}); state.logs.push({time:`DAY ${state.day}`,text:`${label}${good?"이 들어왔다.":"이 생겼다."}`}); } if(state.day%7===0){state.affection=clamp(state.affection-18,0,1000);state.trust=clamp(state.trust-8,0,1000);} }

function openChat() {
  const context = buildConversationContext(state);
  const greeting = getContextualOpening(context).replace(`${state.partner.name}: `, "");
  $("#modalContent").innerHTML=`<span class="eyebrow">CHAT WITH ${state.partner.name}</span><h2>${withParticle(state.partner.name,"과","와")}의 대화</h2><div class="chat-window"><div class="message her">${greeting}</div><div id="chatReply"></div></div><form id="chatForm" class="chat-compose"><input id="chatInput" maxlength="180" autocomplete="off" placeholder="자유롭게 메시지를 입력하세요" required><button type="submit">보내기</button></form>`;
  openModal(); $("#chatForm").addEventListener("submit",event=>{ event.preventDefault(); chatReply($("#chatInput").value); });
}
async function chatReply(message){ const form=$("#chatForm"), send=form?.querySelector("button"); if(send)send.disabled=true; const endpoint=document.querySelector('meta[name="today-day-one-ai-endpoint"]')?.content; const response=await requestGirlfriendReply({endpoint,context:buildConversationContext(state),message}); if(!response){if(send)send.disabled=false;return;} $("#chatReply").innerHTML=`<div class="message me">${escapeHtml(message)}</div><div class="message her">${escapeHtml(response.text)}</div><small class="reply-source">${response.source==='remote'?'AI 연결 응답':'로컬 컨텍스트 응답'}</small>`; applyEffects(state,response.effects); recordConversationTurn(state,message,response.text); recordMemory(state,{type:"conversation",summary:`${state.partner.name}와의 대화`,importance:2,tags:["대화",response.source]}); SaveManager.save(state); form?.remove(); render(); }

function openDebug() {
  if (!state) return;
  const keys = ["day","phase","appearanceSeed","money","health","energy","fatigue","stress","charm","fashion","confidence","work","social","affection","trust","excitement","attachment","conflict","relationshipStress"];
  const stateRows = keys.map(key=>`<div class="debug-stat"><span>${key}</span><b>${Math.round(state[key])}</b></div>`).join("");
  const personalityRows = Object.entries(state.partner.personality).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("");
  const eventRows = getEventDiagnostics(state).map(event=>`<div class="debug-event ${event.eligible?'':event.cooldownRemaining?'cooldown':'ineligible'}"><div><b>${event.title}</b><span>${Math.round(event.probability*100)}%</span></div><small>priority ${event.priority} · ${event.dailyLimitReached?'오늘 이벤트 한도 도달':event.cooldownRemaining?`cooldown ${event.cooldownRemaining}일`:event.conditionsMet?'발생 가능':'조건 불충족'} · ${escapeHtml((event.eligible?event.triggerReasons:event.blockedReasons).join(' / ')||'기본 조건')}</small></div>`).join("");
  const director=state.storyDirector,analysis=director?.analyses?.at(-1),plan=director?.nextDayPlan;
  const threadRows=Object.entries(director?.threads??{}).sort((a,b)=>b[1]-a[1]).map(([id,value])=>`<div class="debug-stat"><span>${id}</span><b>${value}</b></div>`).join("")||`<p>첫 DAY 종료 후 분석됩니다.</p>`;
  const candidateRows=(plan?.eventCandidates??[]).map(candidate=>`<div class="debug-event ${candidate.blocked?'cooldown':''}"><div><b>${escapeHtml(candidate.title)}</b><span>${candidate.blocked?(candidate.blockedReason??"BLOCKED"):`${Math.round(candidate.finalProbability*100)}%`}</span></div><small>base ${Math.round(candidate.baseProbability*100)}% · ×${candidate.multiplier} · ${candidate.modifiers.map(item=>item.label).join(" · ")||"기본 가중치"}${candidate.cooldownRemaining?` · cooldown ${candidate.cooldownRemaining}`:''}</small></div>`).join("")||`<p>예약 후보가 없습니다.</p>`;
  const unresolvedRows=(director?.unresolvedEvents??[]).map(item=>`<div class="debug-event"><div><b>${item.id}</b><span>STAGE ${item.stage}</span></div><small>${item.type} · DAY ${item.originDay} · ${item.status}</small></div>`).join("")||`<p>미해결 사건이 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">DEVELOPER MODE</span><h2>Simulation Debug</h2><p>저장에는 영향을 주지 않는 읽기 전용 상태 패널입니다.</p><div class="debug-launchers"><button id="characterManagerButton" class="primary-button" type="button">캐릭터 관리 · 히로인 ${HEROINE_PROFILES.length}명 · NPC ${state.npcs.length}명</button><button id="eventViewerButton" class="primary-button" type="button">Event Viewer · 에피소드 ${SITUATION_EVENTS.length}개</button><button id="eventInspectorButton" class="primary-button" type="button">Event Inspector · 실행 상태/큐/복구</button></div><h3>Story Director · ${analysis?`DAY ${analysis.day}`:"WAITING"}</h3><div class="debug-grid"><div class="debug-stat"><span>Relationship</span><b>${analysis?.relationshipState??"-"}</b></div><div class="debug-stat"><span>Tension</span><b>${analysis?.narrativeTension??0}</b></div><div class="debug-stat"><span>Dominant</span><b>${director?.dominantThread??"-"}</b></div><div class="debug-stat"><span>Status</span><b>${director?.dominantStatus??"-"}</b></div><div class="debug-stat"><span>Next Seed</span><b>${plan?.seed??"-"}</b></div><div class="debug-stat"><span>Foreshadow</span><b>R${director?.foreshadowing?.rival??0} · T${director?.foreshadowing?.temptation??0} · L${director?.foreshadowing?.lie??0}</b></div></div><h3>Active Threads</h3><div class="debug-grid">${threadRows}</div><h3>Next DAY Event Candidates</h3><div class="debug-events">${candidateRows}</div><h3>Unresolved Events</h3><div class="debug-events">${unresolvedRows}</div><h3>Game State</h3><div class="debug-grid">${stateRows}</div><h3>${state.partner.name} · Hidden Personality</h3><div class="debug-grid">${personalityRows}</div><h3>Runtime Event Diagnostics</h3><div class="debug-events">${eventRows}</div>`;
  openModal();
  $("#characterManagerButton").addEventListener("click",openCharacterManager);
  $("#eventViewerButton").addEventListener("click",openEventViewer);
  $("#eventInspectorButton").addEventListener("click",openEventInspector);
}

function openEventInspector(){
  const runtime=eventRuntime.snapshot();
  const audit=auditEventSystems({storyScenes:STORY_SCENES,events:EVENT_DEFINITIONS,situationEvents:SITUATION_EVENTS});
  const stateRows=[
    ["ActiveEvent",runtime.activeEvent??"-"],["Scene",runtime.scene??"-"],["DialogueIndex",runtime.dialogueIndex],
    ["State",runtime.state],["InputLock",runtime.inputLock.locked?`${runtime.inputLock.owner} · ${runtime.inputLock.reason}`:"UNLOCKED"],
    ["EventQueue",runtime.eventQueue.join(", ")||"EMPTY"],["PendingEvent",runtime.pendingEvent??"-"],
    ["StoryThread",state.storyDirector?.dominantThread??"-"],["NarrativeTension",state.storyDirector?.analyses?.at(-1)?.narrativeTension??0],
    ["TriggerReason",runtime.triggerReason.join(" / ")||"-"],["AssetStatus",runtime.assetStatus],["SaveStatus",runtime.checkpoint?`CHECKPOINT ${runtime.checkpoint.savedAt}`:"NO CHECKPOINT"]
  ].map(([label,value])=>`<div class="debug-stat"><span>${label}</span><b>${escapeHtml(value)}</b></div>`).join("");
  const logRows=runtime.logs.slice().reverse().map(log=>`<div class="debug-event ${log.level==='error'?'ineligible':log.level==='warning'?'cooldown':''}"><div><b>${escapeHtml(log.state??log.code??log.level)}</b><span>${escapeHtml(log.eventId??'-')}</span></div><small>${escapeHtml(log.previousState??'-')} → ${escapeHtml(log.state??'-')} · scene ${escapeHtml(log.sceneId??'-')} · dialogue ${log.dialogueIndex??0}</small></div>`).join("")||"<p>아직 이벤트 런타임 로그가 없습니다.</p>";
  const auditRows=audit.priority.slice(0,20).map(row=>`<div class="debug-event ${row.classification==='E_ERROR_RISK'?'ineligible':'cooldown'}"><div><b>${escapeHtml(row.id)}</b><span>${row.classification}</span></div><small>${escapeHtml(row.reasons.join(' / '))}</small></div>`).join("")||"<p>우선 수정 대상이 없습니다.</p>";
  $("#modalContent").innerHTML=`<span class="eyebrow">DEBUG EVENT INSPECTOR</span><h2>Event Runtime</h2><p>이벤트 잠금, 큐, 체크포인트, 에셋 상태와 감사 결과를 한 화면에서 확인합니다.</p><div class="debug-grid">${stateRows}</div><h3>Audit Summary</h3><div class="debug-grid">${Object.entries(audit.counts).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("")}</div><h3>Runtime Logs</h3><div class="debug-events">${logRows}</div><h3>Audit Priority</h3><div class="debug-events">${auditRows}</div>`;
  openModal();
}

function openEventViewer() {
  const eventOptions=SITUATION_EVENTS.map(event=>`<option value="${event.id}">${event.categoryLabel} · ${escapeHtml(event.title)}</option>`).join("");
  const npcOptions=(state.npcs??[]).filter(npc=>npc.active).map(npc=>`<option value="${npc.id}">${escapeHtml(npc.name)} · ${escapeHtml(npc.role)}</option>`).join("");
  const heroineOptions=HEROINE_PROFILES.map(profile=>`<option value="${profile.id}" ${profile.id===state.partner.heroineId?'selected':''}>${escapeHtml(profile.name)} · ${escapeHtml(profile.archetype)}</option>`).join("");
  const outfitOptions=HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===state.partner.heroineId).map(outfit=>`<option value="${outfit.id}">${escapeHtml(outfit.name)}</option>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">DEBUG EVENT VIEWER</span><h2>상황 에피소드 강제 실행</h2><p>조건을 무시하고 Scene·NPC·히로인·의상을 바꿔 대화 진행과 선택 결과를 테스트합니다.</p><div class="event-viewer-form"><label>이벤트<select id="viewerEvent">${eventOptions}</select></label><label>시작 Scene<select id="viewerScene"><option value="0">Scene 1</option><option value="1">Scene 2</option><option value="2">Scene 3</option><option value="3">Scene 4 · NIGHT</option></select></label><label>등장 NPC<select id="viewerNpc">${npcOptions}</select></label><label>히로인<select id="viewerHeroine">${heroineOptions}</select></label><label>현재 의상<select id="viewerOutfit">${outfitOptions}</select></label><label class="event-viewer-check"><input id="viewerSkip" type="checkbox"> Dialogue Skip 버튼으로 Choice Test</label></div><div id="viewerSummary" class="event-viewer-summary"></div><button id="viewerLaunch" class="primary-button" type="button">조건 무시 실행 →</button>`;
  openModal();
  const refresh=()=>{const event=SITUATION_EVENTS.find(item=>item.id===$("#viewerEvent").value);$("#viewerSummary").innerHTML=`<b>${escapeHtml(event.title)}</b><span>${event.scenes.length} Scenes · ${event.scenes.reduce((sum,scene)=>sum+scene.dialogueTurns.length,0)} Turns · ${escapeHtml(event.startMood)} → ${escapeHtml(event.peakMood)} → ${escapeHtml(event.endMood)}</span><small>DAY ${event.dayRange[0]}–${event.dayRange[1]} · ${escapeHtml(event.location)} · ${escapeHtml(event.tensionLevel)} tension · ${event.choices.length} choices</small>`;};
  $("#viewerEvent").addEventListener("change",refresh);refresh();
  $("#viewerHeroine").addEventListener("change",()=>{$("#viewerOutfit").innerHTML=HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===$("#viewerHeroine").value).map(outfit=>`<option value="${outfit.id}">${escapeHtml(outfit.name)}</option>`).join("");});
  $("#viewerLaunch").addEventListener("click",()=>{const event=SITUATION_EVENTS.find(item=>item.id===$("#viewerEvent").value),sceneIndex=Number($("#viewerScene").value),npc=(state.npcs??[]).find(item=>item.id===$("#viewerNpc").value),heroine=HEROINE_PROFILES.find(item=>item.id===$("#viewerHeroine").value),outfit=HEROINE_OUTFITS.find(item=>item.id===$("#viewerOutfit").value);const preview=structuredClone(event);preview.scenes=preview.scenes.slice(sceneIndex).map(scene=>({...scene,characterIds:scene.characterIds.map(id=>id==="girlfriend"?"girlfriend":npc?.id??id),dialogueTurns:scene.dialogueTurns.map(turn=>({...turn,speaker:turn.speaker==="연인"?heroine?.name??state.partner.name:["서브 히로인","직장 동료","친구"].includes(turn.speaker)?npc?.name??turn.speaker:turn.speaker}))}));closeModal();openEventScene(preview,{debugPreview:true,previewOutfitImage:outfit?.characterWearingImage??heroine?.referenceImage,skipToChoice:$("#viewerSkip").checked});});
}

function openCharacterManager() {
  const equipped=getEquippedHeroineOutfit(state);
  const heroineCards=HEROINE_PROFILES.map(profile=>`<article class="character-admin-card ${profile.id===state.partner.heroineId?'active':''}"><img src="${profile.referenceImage}" alt="${escapeHtml(profile.name)}"><div><small>${escapeHtml(profile.id)} · ${escapeHtml(profile.archetype)}</small><b>${escapeHtml(profile.name)} · ${profile.age}세</b><span>${escapeHtml(profile.job)} · 의상 ${HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===profile.id).length}종</span><em>${profile.id===state.partner.heroineId?`현재 히로인 · ${escapeHtml(equipped?.name??"기본 의상")}`:"다음 회차 후보"}</em></div></article>`).join("");
  const npcCards=(state.npcs??[]).map(character=>{const status=getNpcRelationshipStatus(character);return `<article class="character-admin-card npc-admin ${character.active?'active':''}"><div><small>${escapeHtml(character.id)} · ${escapeHtml(character.category)}</small><b>${escapeHtml(character.name)} · ${escapeHtml(character.role)}</b><span>호감 ${character.affection} · 신뢰 ${character.trust} · ${escapeHtml(character.storyState)}</span><em>${character.active?'ACTIVE':'INACTIVE'} · ${escapeHtml(status.label)}</em></div></article>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">CHARACTER DATABASE</span><h2>캐릭터 관리</h2><p>이번 회차 활성 NPC ${(state.npcs??[]).filter(character=>character.active).length}명 · 관계망 ${NPC_SOCIAL_GRAPH.length}개 · 현재 의상 ${escapeHtml(equipped?.outfitId??"DEFAULT")}</p><h3>히로인</h3><div class="character-admin-grid">${heroineCards}</div><h3>NPC Social Graph</h3><div class="character-admin-grid">${npcCards}</div>`;openModal();
}

function openInventory() {
  const bonuses = getEquipmentBonuses(state);
  const ownerLabel = { player:"내 아이템", gift:"선물 대기", girlfriend:`${state.partner.name} 소유` };
  const cards = state.inventory.length ? state.inventory.map(instance=>{ const item=getItem(instance.itemId); const control=instance.owner==='player'?`<button class="equip-button" data-instance="${instance.instanceId}" ${instance.equipped?'disabled':''}>${instance.equipped?'장착 중':'장착'}</button>`:instance.owner==='gift'?`<button class="gift-button" data-gift="${instance.instanceId}">${state.partner.name}에게 선물</button>`:`<em>${instance.equipped?'사용 중':'보관 중'}</em>`; const visual=item.productImage?`<img class="inventory-product-image" src="${item.productImage}" alt="" loading="lazy">`:`<div class="item-icon" aria-hidden="true">${item.icon}</div>`; return `<div class="inventory-item">${visual}<div><small>${item.brand} · ${item.category}</small><b>${item.name}</b><span>${ownerLabel[instance.owner]} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span></div>${control}</div>`; }).join("") : `<p class="empty-inventory">아직 보유한 아이템이 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">INVENTORY</span><h2>나의 가방</h2><p>장착 보너스 · 매력 +${bonuses.attractiveness} · 패션 +${bonuses.fashion}</p><div class="inventory-list">${cards}</div>`;
  openModal();
  document.querySelectorAll(".equip-button:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{ equipItem(state,button.dataset.instance); SaveManager.save(state); openInventory(); }));
  document.querySelectorAll(".gift-button").forEach(button=>button.addEventListener("click",()=>{ const result=giveGift(state,button.dataset.gift); if(!result)return; state.logs.push({time:`DAY ${state.day} · GIFT`,text:`${result.item.name} 선물 · ${result.reaction.reaction}`}); recordMemory(state,{type:"gift",summary:`${result.item.name} 선물`,importance:4,tags:["선물",result.item.id]}); SaveManager.save(state); toast(`${state.partner.name}: “${result.reaction.reaction}” · 호감 +${result.reaction.affection}`); render(); openInventory(); }));
}

function openShop() {
  sound.playBgm("dateShopping",state.day);
  const visibleItems=ITEMS.filter(item=>item.category!=="heroine-outfit" || item.heroineId===state.partner.heroineId);
  const cards = visibleItems.map(item=>{const heroineOutfit=item.category==="heroine-outfit",unlocked=!heroineOutfit||isOutfitUnlocked(state,item);const visual=item.productImage?`<img class="shop-product-image" src="${item.productImage}" alt="${escapeHtml(item.name)}" loading="lazy">`:`<div class="item-icon" aria-hidden="true">${item.icon}</div>`;const actions=heroineOutfit?`<button data-buy="${item.id}" data-owner="gift" ${unlocked?'':'disabled'}>${unlocked?`${state.partner.name} 선물용`:`DAY ${item.unlockConditions.day} 잠금`}</button>`:`<button data-buy="${item.id}" data-owner="player">내 것</button><button data-buy="${item.id}" data-owner="gift">선물용</button>`;return `<div class="shop-item ${heroineOutfit?'heroine-outfit-card':''}">${visual}<div><small>${item.brand} · ${item.rarity??`LUX ${item.luxuryLevel}`}</small><b>${escapeHtml(item.name)}</b><span>${escapeHtml((item.styleTags??item.preferenceTags).join(" · "))} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span><strong>${money(item.price)}</strong></div><div class="shop-actions">${actions}</div></div>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">LIFESTYLE SHOP</span><h2>오늘의 상점</h2><p>보유 자산 ${money(state.money)} · ${state.partner.name} 전용 의상 10종이 관계 진행에 따라 해금됩니다.</p><div class="shop-list">${cards}</div>`;
  openModal();
  if (state.job?.id === "used-car-dealer") $("#modalContent").insertAdjacentHTML("afterbegin", `<p class="career-tip"><b>딜러 네트워크 적용:</b> ${escapeHtml(state.partner.name)}에게 선물할 차량은 결제 시 12% 자동 할인됩니다.</p>`);
  document.querySelectorAll("[data-buy]").forEach(button=>button.addEventListener("click",()=>{ const result=purchaseItem(state,button.dataset.buy,button.dataset.owner); if(!result.ok){toast(result.reason);return;} const outfitGift=result.item.category==="heroine-outfit"?giveGift(state,result.instance.instanceId):null; if(outfitGift){state.logs.push({time:`DAY ${state.day} · OUTFIT`,text:`${outfitGift.item.name} 선물 · 바로 착용`});recordMemory(state,{type:"gift",summary:`${outfitGift.item.name} 의상 선물`,importance:4,tags:["선물","의상",outfitGift.item.id]});} SaveManager.save(state); render(); openShop(); toast(outfitGift?`${state.partner.name}에게 선물 완료 · 새 의상 착용`:`${result.item.name} 구매 완료`); }));
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
  const payday = getNextPayday(state.day) ?? state.day;
  const paycheckRange = getPaycheckRange(state);
  $("#modalContent").innerHTML=`<span class="eyebrow">MY CAREER</span><h2>${job.name} · Lv.${state.jobLevel}</h2><p>다음 10일 급여 예상 ${money(calculatePaycheck(state))}</p><div class="career-progress"><div><span>승진 진행도</span><b>${career.progress} / ${career.threshold}</b></div><i><em style="width:${career.percent}%"></em></i><small>승진까지 성장 포인트 ${career.remaining}</small></div><div class="career-stats"><div><small>연봉</small><b>${money(job.salary)}</b></div><div><small>수입 배율</small><b>×${job.incomeMultiplier.toFixed(2)}</b></div><div><small>성장 잠재력</small><b>${job.growthPotential}</b></div><div><small>인맥 기회</small><b>${job.socialOpportunity}</b></div><div><small>스트레스 배율</small><b>×${job.stressRate.toFixed(2)}</b></div></div><p class="career-tip">성공 행동으로 업무 능력을 올리면 승진 진행도가 쌓이고, 승진할 때마다 수입 배율이 증가합니다.</p>`;
  $("#modalContent").insertAdjacentHTML("beforeend", `<section class="career-perk"><small>${escapeHtml(job.incomeType)} · DAY ${payday} 예상 ${money(calculatePaycheck(state, payday))}</small><h3>${escapeHtml(job.perkName)}</h3><p>${escapeHtml(job.perkDescription)}</p><span>급여 범위 ${money(paycheckRange.minimum)} ~ ${money(paycheckRange.maximum)}</span></section>`);
  openModal();
}

function openPeople() {
  const breakupRisk = calculateBreakupRisk(state);
  const career=state.partner.career;
  const partnerCard=career?`<div class="npc-card partner-career-card"><div class="npc-details"><small>MY PARTNER · ${escapeHtml(career.workplace)}</small><b>${escapeHtml(state.partner.name)} · ${escapeHtml(career.name)}</b><span>${escapeHtml(career.workPattern)} · 월수입 ${money(career.incomeRange[0])}~${money(career.incomeRange[1])}</span><span><strong>${escapeHtml(career.perkName)}</strong> · ${escapeHtml(career.perkDescription)}</span><em>목표 · ${escapeHtml(career.careerGoal)}</em></div></div>`:"";
  const cards = state.npcs.filter(npc=>npc.active).map(npc=>{ const status=npc.relationshipType==='rival'?calculateRivalRisk(state,npc):getNpcRelationshipStatus(npc); const interest=npc.relationshipType==='rival'?`연인 관심 ${npc.interestInGirlfriend} · 위험 ${status.score}`:`내 관심 ${npc.interestInPlayer}`; const sprite=getNpcSprite(npc.id); return `<div class="npc-card${sprite?' illustrated':''}">${sprite?`<img src="${sprite}" alt="" aria-hidden="true">`:''}<div class="npc-details"><small>${npc.role}</small><b>${npc.name}</b><span>호감 ${npc.affection} · 신뢰 ${npc.trust} · ${interest}</span></div><em data-tone="${status.tone}">${status.label}</em></div>`; }).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">HUMAN RELATIONSHIPS</span><h2>나의 인맥</h2><p>현재 연애 위기 ${breakupRisk.score} · ${breakupRisk.label}</p>${partnerCard}<h3>주변 인물</h3><div class="npc-list">${cards}</div>`;
  openModal();
}

function showBreakup(breakup) {
  sound.play("alert");
  sound.playBgm("crisis",breakup.day);
  const presentation={...resolvePhasePresentation(state,"evening"),expressionId:"tense",animationId:"look-away"};
  startImmersiveScene({id:`breakup-${breakup.day}`,type:"ending",presentation,sequence:[
    {type:"transition",style:"fade",label:`DAY ${breakup.day} · 마지막 대화`},
    {type:"narration",text:breakup.reason},
    {type:"dialogue",speaker:state.partner.name,text:"우리, 여기까지 하는 게 좋을 것 같아.",expressionId:"tense"},
    {type:"narration",text:`${state.partner.name}와의 관계는 더 이어지지 못했다. 정확한 수치보다 마지막 표정이 오래 남았다.`},
    {type:"choice",options:[{id:"restart",label:"새로운 30일 시작하기 →"}]}
  ],onChoice:choiceId=>{if(choiceId==="restart")location.reload();return null;}});
}

function openTemptation({ npc, level }) {
  sound.play("alert");
  sound.playBgm("crisis",state.day);
  const message = level==='secret'?`${npc.name}(이)가 둘만의 비밀 만남을 제안했다.`:level==='drinks'?`${npc.name}(이)가 다음에는 단둘이 마시자고 한다.`:`${npc.name}(이)가 개인 연락처로 메시지를 보냈다.`;
  const presentation={...resolvePhasePresentation(state,"evening"),characterId:npc.id,expressionId:"calm",animationId:"soft-sway"};
  const choices=Object.entries(TEMPTATION_CHOICES).map(([id,choice])=>({id,label:choice.label}));
  startImmersiveScene({id:`temptation-${npc.instanceId}`,type:"temptation",presentation,sequence:createTemptationSceneSequence({npc,choices},message),onChoice:choiceId=>{const result=resolveTemptation(state,npc.instanceId,choiceId);if(!result)return null;state.logs.push({time:`DAY ${state.day} · CHOICE`,text:`${npc.name}에게 “${result.choice.label}”`});recordMemory(state,{type:"temptation",summary:`${npc.name}: ${result.choice.label}`,importance:5,tags:["유혹",choiceId]});SaveManager.save(state);return createTemptationReactionSequence(npc,choiceId);}});
}

function openEventScene(event,{debugPreview=false,previewOutfitImage=null,skipToChoice=false,resumeSequenceIndex=0}={}) {
  const presentation=resolveStoryPresentation({id:event.id,title:event.title,message:event.message,bgm:"theme"},state);
  const sequence=createEventSceneSequence(event).slice(Math.max(0,resumeSequenceIndex));
  startImmersiveScene({id:event.id,type:"event",presentation,sequence,previewOutfitImage,triggerReason:event.record?.triggerReason??[],onChoice:event.scenes?.length?choiceId=>{const result=resolveSituationEventChoice(state,event,choiceId);if(!result)return null;state.logs.push({time:`DAY ${state.day} · EPISODE`,text:`${event.title} · ${result.choice.label}`});SaveManager.save(state);return [{type:"narration",text:`나는 “${result.choice.label}”라고 답하고 행동했다.`},{type:"expressionChange",expressionId:choiceId==="risk"?"tense":"smile"},{type:"dialogue",speaker:event.scenes.at(-1).dialogueTurns.find(turn=>turn.type==="dialogue")?.speaker??state.partner.name,text:result.choice.response??result.choice.memory,expressionId:choiceId==="risk"?"tense":"smile"},...(result.mbtiAdjustment?.label?[{type:"narration",text:`${result.mbtiAdjustment.label}에 맞는 반응이 관계 수치에 추가로 반영됐다.`}]:[]),{type:"narration",text:"이 선택의 실제 결과가 관계 수치와 다음 사건의 가능성에 남았다."},{type:"sceneEnd"}];}:null,debugPreview});
  if(skipToChoice)setTimeout(()=>skipImmersiveScene(new Event("click")),0);
}

function openInvestment() {
  const portfolio=getPortfolioSummary(state);
  const lottery=getLotterySummary(state);
  const wealthyLeverage=state.player?.archetypeId==="wealthy"?`<p class="career-tip"><b>부자 캐릭터 특전:</b> 주가 상승과 하락이 모두 10배로 적용됩니다.</p>`:"";
  const cards=state.investment.market.map(stock=>{ const holding=state.investment.holdings[stock.id]; return `<div class="stock-card"><div><small>${stock.risk.toUpperCase()} RISK · ${stock.changeRate>=0?'+':''}${stock.changeRate}%</small><b>${stock.name}</b><span>${money(stock.price)} · 보유 ${holding?.quantity??0}주${holding?` · 평균 ${money(holding.averageCost)}`:''}</span></div><div class="stock-actions"><button data-stock-buy="${stock.id}">1주 매수</button><button data-stock-sell="${stock.id}" ${holding?'':'disabled'}>1주 매도</button></div></div>`; }).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">VIRTUAL MARKET</span><h2>오늘의 투자</h2>${wealthyLeverage}<p>보유 자산 ${money(state.money)} · 평가금액 ${money(portfolio.marketValue)} · 손익 ${portfolio.profitLoss>=0?'+':''}${money(portfolio.profitLoss)}</p><div class="stock-list">${cards}</div><div class="lottery-card"><div><small>INSTANT LOTTERY · DAY ${state.day}</small><b>오늘의 행운 복권</b><span>1장 ${money(LOTTERY_TICKET_PRICE)} · 오늘 ${lottery.today}/${DAILY_TICKET_LIMIT}장 · 누적 손익 ${lottery.net>=0?'+':''}${money(lottery.net)}</span></div><button id="lotteryBuyButton" ${lottery.today>=DAILY_TICKET_LIMIT||state.money<LOTTERY_TICKET_PRICE?'disabled':''}>한 장 긁기</button></div>`;
  openModal();
  document.querySelectorAll("[data-stock-buy]").forEach(button=>button.addEventListener("click",()=>{const result=buyStock(state,button.dataset.stockBuy);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  document.querySelectorAll("[data-stock-sell]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{const result=sellStock(state,button.dataset.stockSell);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  $("#lotteryBuyButton").addEventListener("click",()=>{const result=buyInstantLottery(state);if(!result.ok){toast(result.reason);return;}state.logs.push({time:`DAY ${state.day} · LOTTERY`,text:`즉석복권 ${result.label}${result.prize?` · ${money(result.prize)} 당첨`:''}`});SaveManager.save(state);render();openInvestment();toast(result.prize?`${result.label}! ${money(result.prize)} 당첨`:`아쉽게도 꽝이에요.`);});
}

function showEnding(){ state.ended=true; const [title, desc] = determineEnding(state); const analysis=analyzePlayHistory(state);
  sound.play("success");
  sound.playBgm("ending",Math.round(state.affection+state.trust),{loop:false});
  const presentation={...resolvePhasePresentation(state,"evening"),expressionId:state.affection+state.trust>=1200?"smile":"calm",animationId:"soft-sway"};
  const highlights=analysis.highlights.join(" ");
  startImmersiveScene({id:"day-30-ending",type:"ending",presentation,sequence:[
    {type:"transition",style:"flash",label:"DAY 30 · OUR ENDING"},
    {type:"narration",text:desc},
    {type:"dialogue",speaker:state.partner.name,text:title,expressionId:presentation.expressionId},
    {type:"narration",text:`30일 동안 ${analysis.totalChoices}번 선택했다. 가장 많이 택한 방향은 ${analysis.dominantChoice.tag}, 우리의 관계는 ${analysis.relationshipLabel}으로 남았다.`},
    {type:"narration",text:highlights||"서로의 선택이 하나의 이야기가 되었다."},
    {type:"choice",options:[{id:"restart",label:"새로운 30일 시작하기 →"}]}
  ],onChoice:choiceId=>{if(choiceId==="restart")location.reload();return null;}});
}
function toast(message){ const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200); }

function loadGame() { const loaded = SaveManager.load(); if (!loaded) { toast("불러올 수 있는 저장 데이터가 없어요."); return; } state = loaded; showGame(); if(state.breakup&&areGameplayEventsUnlocked())showBreakup(state.breakup);else if(state.day>30)showEnding();else if(state.pendingStoryId&&areGameplayEventsUnlocked())openStoryScene(getStoryScene(state.pendingStoryId));else toast(`DAY ${state.day} 저장 데이터를 불러왔어요.`); }
function saveGame() { if (!state) return; SaveManager.save(state); toast(`DAY ${state.day} 진행 상황을 저장했어요.`); }

if (!SaveManager.hasSave()) $("#loadButton").classList.add("hidden");
renderSoundButton();
$("#soundButton").addEventListener("click",()=>{const enabled=sound.toggle();renderSoundButton();if(enabled){sound.play("success");if(state)sound.playScene(phases[state.phase].key,state.day);else sound.playBgm("title",new Date().getDate());}toast(enabled?"효과음과 BGM을 켰어요.":"모든 소리를 껐어요.");});
$("#debugButton").addEventListener("click",openDebug);
$("#inventoryButton").addEventListener("click",openInventory);
$("#shopButton").addEventListener("click",openShop);
$("#financeButton").addEventListener("click",openFinance);
$("#careerButton").addEventListener("click",openCareer);
$("#peopleButton").addEventListener("click",openPeople);
$("#investmentButton").addEventListener("click",openInvestment);
$("#historyButton").addEventListener("click",openDialogueHistory);
$("#menuButton").addEventListener("click",openGameMenu);
$("#storyMenuButton").addEventListener("click",event=>{event.stopPropagation();openGameMenu();});
$("#storyHistoryButton").addEventListener("click",event=>{event.stopPropagation();openDialogueHistory();});
$("#nightHome").addEventListener("click",handleRoomAction);
$("#returnHomeButton").addEventListener("click",returnToNightHome);
$("#worldAtlasButton").addEventListener("click",()=>openWorldAtlas());
$("#worldTransportButton").addEventListener("click",()=>openTransportSelector(false));
$("#enterLocationButton").addEventListener("click",openWorldLocation);
$("#worldMapCanvas").addEventListener("keydown",handleWorldMapKeydown);
$(".world-dpad").addEventListener("click",handleWorldMoveClick);
$("#actionGrid").addEventListener("click",handleActionGridClick);
$("#visualNovelStage").addEventListener("click",handleDialogueAdvance);
$("#storyChoiceLayer").addEventListener("click",event=>{event.stopPropagation();const button=event.target.closest("[data-immersive-choice]");if(button)chooseImmersiveOption(button.dataset.immersiveChoice);});
$("#visualNovelStage").addEventListener("keydown",event=>{ if(event.key==="Enter"||event.key===" "){event.preventDefault();handleDialogueAdvance();} });
$("#autoButton").addEventListener("click",toggleAutoMode);
$("#skipButton").addEventListener("click",skipImmersiveScene);
$("#fullscreenButton").addEventListener("click",toggleFullscreen);
$("#storyFullscreenButton").addEventListener("click",toggleFullscreen);
$("#startButton").addEventListener("click",startGame); $("#nextButton").addEventListener("click",applyAction); $("#chatButton").addEventListener("click",openChat); $("#saveButton").addEventListener("click",saveGame); $("#loadButton").addEventListener("click",loadGame); $("#closeModal").addEventListener("click",closeModal); $("#actionResultConfirm").addEventListener("click",confirmActionResult); $("#resetButton").addEventListener("click",()=>{ if(confirm("새 게임을 시작할까요? 현재 진행은 사라집니다.")) { SaveManager.clear(); location.reload(); } });
$("#introVideo").addEventListener("ended",playNextIntroVideo);
$("#skipIntroButton").addEventListener("click",()=>{$("#introVideo").pause();introVideoIndex=INTRO_VIDEO_PLAYLIST.length-1;unlockIntroStart("프롤로그 영상을 건너뛰었습니다. 게임을 시작할 수 있습니다.");});
$("#introGameStartButton").addEventListener("click",finishOnboarding);
document.addEventListener("keydown", handleModalKeydown);
document.addEventListener("fullscreenchange",renderFullscreenButtons);
window.addEventListener("beforeunload",()=>clearInterval(runtimeWatchdogTimer));

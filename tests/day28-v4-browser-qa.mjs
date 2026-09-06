import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const args=Object.fromEntries(process.argv.slice(2).map(value=>{const [key,...rest]=value.replace(/^--/,'').split('=');return [key,rest.join('=')||true];}));
const port=Number(args.port??9222);
const base=String(args.base??'http://127.0.0.1:4174').replace(/\/$/,'');
const harness=`${base}/tests/day28-v4-browser-entry.html`;
const routes=['friendly','neutral','distant','mixed'];
const sleep=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
const defaultBrowser='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function waitFor(check,{timeout=15_000,interval=50,label='condition'}={}){
  const started=Date.now();
  while(Date.now()-started<timeout){
    const value=await check();
    if(value)return value;
    await sleep(interval);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function createTarget(url){
  const response=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,{method:'PUT'});
  if(!response.ok)throw new Error(`Unable to create browser target: ${response.status}`);
  return response.json();
}

async function browserVersion(){
  try{
    const response=await fetch(`http://127.0.0.1:${port}/json/version`);
    return response.ok?response.json():null;
  }catch{return null;}
}

async function ensureBrowser(){
  const active=await browserVersion();
  if(active)return {process:null,version:active,logs:[],profile:null,ownsProfile:false};
  const logs=[];
  const ownsProfile=!args.profile;
  const profile=ownsProfile?mkdtempSync(join(tmpdir(),'day28-chrome-qa-')):resolve(String(args.profile));
  const child=spawn(String(args.browser??defaultBrowser),[
    '--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--no-first-run',
    '--disable-background-networking',`--remote-debugging-address=127.0.0.1`,`--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',`--user-data-dir=${profile}`,harness
  ],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  child.stderr.setEncoding('utf8');
  child.stderr.on('data',chunk=>logs.push(chunk));
  const version=await waitFor(async()=>{
    if(child.exitCode!==null)throw new Error(`Browser exited before CDP opened (${child.exitCode}): ${logs.join('').slice(-2000)}`);
    return browserVersion();
  },{timeout:15_000,interval:100,label:'browser CDP endpoint'});
  return {process:child,version,logs,profile,ownsProfile};
}

class CdpPage{
  constructor(webSocketDebuggerUrl){
    this.socket=new WebSocket(webSocketDebuggerUrl);
    this.nextId=1;
    this.pending=new Map();
    this.listeners=new Map();
  }
  async connect(){
    await new Promise((resolve,reject)=>{
      this.socket.addEventListener('open',resolve,{once:true});
      this.socket.addEventListener('error',reject,{once:true});
    });
    this.socket.addEventListener('message',event=>{
      const message=JSON.parse(event.data);
      if(message.id){
        const request=this.pending.get(message.id);
        if(!request)return;
        this.pending.delete(message.id);
        if(message.error)request.reject(new Error(message.error.message));
        else request.resolve(message.result);
        return;
      }
      for(const listener of this.listeners.get(message.method)??[])listener(message.params);
    });
    await Promise.all([this.send('Page.enable'),this.send('Runtime.enable'),this.send('Log.enable')]);
  }
  on(method,listener){
    const listeners=this.listeners.get(method)??[];
    listeners.push(listener);
    this.listeners.set(method,listeners);
  }
  send(method,params={}){
    const id=this.nextId++;
    const promise=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));
    this.socket.send(JSON.stringify({id,method,params}));
    return promise;
  }
  async evaluate(expression){
    const result=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description??result.exceptionDetails.text);
    return result.result.value;
  }
  async navigate(url){
    await this.send('Page.navigate',{url});
    await this.ready();
  }
  async ready(){
    await waitFor(()=>this.evaluate(`document.readyState==='complete'`),{timeout:20_000,label:'document readiness'});
  }
  close(){this.socket.close();}
}

const snapshotExpression=`(()=>{
  const visible=element=>Boolean(element&&!element.hidden&&!element.classList.contains('hidden')&&element.getClientRects().length&&getComputedStyle(element).display!=='none'&&getComputedStyle(element).visibility!=='hidden');
  let saved=null,saveKey=null;
  for(let index=0;index<localStorage.length;index++){
    const key=localStorage.key(index),raw=localStorage.getItem(key);
    try{const value=JSON.parse(raw);if(value?.storyFlags?.day28V4){saved=value;saveKey=key;break;}}catch{}
  }
  const choices=[...document.querySelectorAll('[data-immersive-choice]')].filter(visible).map(button=>({id:button.dataset.immersiveChoice,label:button.textContent.trim()}));
  const freeActions=[...document.querySelectorAll('[data-story-free-action]')].filter(visible).map(button=>button.dataset.storyFreeAction);
  const character=document.querySelector('#vnCharacter');
  return {
    url:location.href,
    ready:document.readyState,
    moduleError:sessionStorage.getItem('day28-v4-qa-module-error'),
    loadVisible:visible(document.querySelector('#loadButton')),
    actionResultVisible:visible(document.querySelector('#actionResultConfirm')),
    choices,
    freeActions,
    freeCompleteVisible:visible(document.querySelector('#completeStoryFreeAction')),
    storyState:document.body.dataset.storyState??null,
    autoPressed:document.querySelector('#autoButton')?.getAttribute('aria-pressed')??null,
    skipVisible:visible(document.querySelector('#skipButton')),
    clock:document.querySelector('#clockLabel')?.textContent.trim()??null,
    phaseLabel:document.querySelector('#phaseLabel')?.textContent.trim()??null,
    backgroundId:document.querySelector('#vnBackdrop')?.dataset.backgroundId??null,
    characterVisible:visible(character),
    characterSource:character?.getAttribute('src')??null,
    lastError:saved?.eventRuntime?.lastError??null,
    day:saved?.day??null,
    saveKey,
    phase:saved?.storyFlags?.day28V4?.phase??null,
    complete:saved?.storyFlags?.day28V4?.complete??false,
    choiceCount:saved?.storyFlags?.day28V4?.choices?.filter(record=>record.kind==='choice').length??0,
    facts:saved?.storyFlags?.day28V4?.facts??null,
    pendingStoryId:saved?.pendingStoryId??null,
    freeAction:saved?.storyFreeAction??null,
    day29Hook:saved?.storyFlags?.day28V4Day29HookPending??false
  };
})()`;

async function click(page,selector){
  return page.evaluate(`(()=>{const element=document.querySelector(${JSON.stringify(selector)});if(!element)return false;element.click();return true;})()`);
}

async function loadSavedGame(page){
  await waitFor(async()=>{
    const state=await page.evaluate(snapshotExpression);
    if(state.moduleError)throw new Error(`QA module failed: ${state.moduleError}`);
    if(state.loadVisible){await click(page,'#loadButton');return false;}
    return state.url.includes('/index.html')&&state.day===28;
  },{timeout:20_000,label:'DAY28 saved game'});
}

function assertStoryUi(state,route){
  assert.equal(state.lastError,null,`${route}: runtime error`);
  assert.equal(state.autoPressed,'false',`${route}: AUTO must remain off`);
  if(state.choices.length){
    assert.ok(['STORY_CHOICE','STORY_EXPLORATION'].includes(state.storyState),`${route}: choice layer/state mismatch (${state.storyState})`);
    assert.equal(state.freeActions.length,0,`${route}: Story and Free Action overlapped`);
  }
  if(state.freeActions.length||state.freeCompleteVisible){
    assert.equal(state.storyState,'STORY_FREE_ACTION',`${route}: free action layer/state mismatch`);
    assert.equal(state.choices.length,0,`${route}: Free Action and Story choice overlapped`);
  }
}

function choiceSelector(route,state){
  if(route==='neutral'&&state.phase==='morning')return '[data-immersive-choice$="_short"]';
  return '[data-immersive-choice]';
}

function assertRouteOutcome(result){
  const final=result.final;
  if(result.route==='friendly'){
    assert.equal(final.meetingMethod,'IN_PERSON','Friendly must use an in-person meeting');
    assert.equal(final.relationshipState,'CONTINUE','Friendly must continue the relationship');
  }else if(result.route==='neutral'){
    assert.equal(final.meetingMethod,'CALL','Neutral must exercise the actual CALL route');
    assert.equal(final.currentContact,null,'CALL route must not invent physical contact');
    assert.equal(final.homeInvitationResponse,null,'CALL route must not invent a home invitation');
  }else if(result.route==='distant'){
    assert.equal(final.route,null,'Distant must stay on the solo route');
    assert.equal(final.relationshipState,'SINGLE','Distant must remain single');
  }else if(result.route==='mixed'){
    assert.equal(final.route,'NEW_MEETING','Mixed must use the new-meeting route');
    assert.notEqual(final.newRelationshipResponse,null,'Mixed must record the new person response');
  }
}

async function verifyFriendlyResume(page,before){
  assert.equal(before.phase,'daily_listening','Friendly resume checkpoint phase');
  assert.equal(before.clock,'19:00','Friendly resume checkpoint clock');
  assert.equal(before.backgroundId,'neighborhood-park-day','Friendly resume checkpoint background');
  assert.equal(before.characterVisible,true,'Friendly resume checkpoint Haeun visibility');
  assert.match(before.characterSource??'',/day12/i,'Friendly resume checkpoint Haeun sprite');
  const priorChoiceCount=before.choiceCount;
  await page.evaluate('location.reload()');
  await page.ready();
  await loadSavedGame(page);
  const resumed=await waitFor(async()=>{
    const state=await page.evaluate(snapshotExpression);
    if(state.choices.length&&state.phase==='daily_listening')return state;
    if(state.loadVisible)await click(page,'#loadButton');
    else if(state.actionResultVisible)await click(page,'#actionResultConfirm');
    else await click(page,'#visualNovelStage');
    await sleep(35);
    return false;
  },{timeout:25_000,label:'Friendly SCENE14/C12 resume'});
  assert.equal(resumed.choiceCount,priorChoiceCount,'Friendly resume must preserve prior choices');
  assert.equal(resumed.clock,'19:00','Friendly resumed clock');
  assert.equal(resumed.backgroundId,'neighborhood-park-day','Friendly resumed background');
  assert.equal(resumed.characterVisible,true,'Friendly resumed Haeun visibility');
  return {before:{clock:before.clock,backgroundId:before.backgroundId,choiceCount:before.choiceCount},after:{clock:resumed.clock,backgroundId:resumed.backgroundId,choiceCount:resumed.choiceCount}};
}

async function playRoute(page,route){
  await page.navigate(harness);
  await waitFor(async()=>{
    const status=await page.evaluate(`document.querySelector('#status')?.textContent??''`);
    if(status.startsWith('QA 모듈 실패'))throw new Error(status);
    return status.includes('검증 경로를 선택');
  },{timeout:15_000,label:`${route} harness module`});
  assert.equal(await click(page,`[data-route="${route}"]`),true,`${route}: route button missing`);
  await waitFor(()=>page.evaluate(`location.pathname.endsWith('/index.html')`),{timeout:15_000,label:`${route} navigation`});
  await loadSavedGame(page);
  let resumeEvidence=null,resumeChecked=false;
  let skipWasEverVisible=false;
  for(let guard=0;guard<1_500;guard++){
    const state=await page.evaluate(snapshotExpression);
    assertStoryUi(state,route);
    skipWasEverVisible||=state.skipVisible;
    if(state.day>=29){
      assert.equal(state.complete,true,`${route}: DAY28 chapter must be complete`);
      assert.equal(state.day29Hook,true,`${route}: DAY29 hook must be present`);
      const result={route,guard,skipWasEverVisible,resumeEvidence,final:{day:state.day,phase:state.phase,complete:state.complete,route:state.facts?.route,meetingMethod:state.facts?.meetingMethod,relationshipState:state.facts?.relationshipState,currentContact:state.facts?.currentContact,homeInvitationResponse:state.facts?.homeInvitationResponse,newRelationshipResponse:state.facts?.newRelationshipResponse,day29Hook:state.day29Hook}};
      assertRouteOutcome(result);
      return result;
    }
    if(route==='friendly'&&!resumeChecked&&state.choices.length&&state.phase==='daily_listening'){
      resumeEvidence=await verifyFriendlyResume(page,state);
      resumeChecked=true;
      continue;
    }
    if(state.loadVisible){await click(page,'#loadButton');}
    else if(state.actionResultVisible){await click(page,'#actionResultConfirm');}
    else if(state.choices.length){await page.evaluate(`document.querySelector(${JSON.stringify(choiceSelector(route,state))})?.click()`);}
    else if(state.freeActions.length){await page.evaluate(`document.querySelector('[data-story-free-action]')?.click()`);}
    else if(state.freeCompleteVisible){await click(page,'#completeStoryFreeAction');}
    else{await click(page,'#visualNovelStage');}
    await sleep(state.storyState==='STORY_TRANSITION'?80:35);
  }
  throw new Error(`${route}: browser play guard exhausted`);
}

const launchedBrowser=await ensureBrowser();
const target=await createTarget(harness);
const page=new CdpPage(target.webSocketDebuggerUrl);
const browserErrors=[];
const browserWarnings=[];
await page.connect();
page.on('Runtime.exceptionThrown',params=>browserErrors.push(params.exceptionDetails?.exception?.description??params.exceptionDetails?.text??'Runtime exception'));
page.on('Log.entryAdded',params=>{const entry=params.entry;if(entry?.level==='error')browserErrors.push(`error: ${entry.url??''} ${entry.text}`.trim());else if(entry?.level==='warning')browserWarnings.push(`warning: ${entry.url??''} ${entry.text}`.trim());});

try{
  const results=[];
  for(const route of routes)results.push(await playRoute(page,route));
  await page.navigate(harness);
  assert.equal(await click(page,'#restore'),true,'Restore button missing');
  const restoreStatus=await page.evaluate(`document.querySelector('#status')?.textContent??''`);
  assert.match(restoreStatus,/테스트 전 저장을 복원했습니다/,'User saves were not restored');
  assert.equal(results[0].resumeEvidence!==null,true,'Friendly SCENE14/C12 resume was not exercised');
  const actionableErrors=browserErrors.filter(message=>!message.includes('/favicon.ico '));
  assert.deepEqual(actionableErrors,[],'Browser console/runtime errors');
  console.log(JSON.stringify({browser:launchedBrowser.version?.Browser??'Chromium (CDP)',auto:'OFF',skipClicks:0,userSaves:'RESTORED',browserWarnings:[...new Set(browserWarnings)],results},null,2));
}finally{
  if(launchedBrowser.process){
    try{await page.send('Browser.close');}catch{}
    await Promise.race([new Promise(resolve=>launchedBrowser.process.once('exit',resolve)),sleep(2_000)]);
    if(launchedBrowser.process.exitCode===null)spawnSync('taskkill',['/PID',String(launchedBrowser.process.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
    if(launchedBrowser.ownsProfile&&launchedBrowser.profile){
      const tempRoot=resolve(tmpdir()),profile=resolve(launchedBrowser.profile);
      if(!profile.startsWith(`${tempRoot}\\`))throw new Error(`Refusing to remove browser profile outside temp: ${profile}`);
      rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
    }
  }
  page.close();
}

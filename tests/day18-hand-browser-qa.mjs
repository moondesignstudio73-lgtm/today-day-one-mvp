import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const port=Number(process.argv.find(value=>value.startsWith('--port='))?.split('=')[1]??9235);
const base='http://127.0.0.1:8000',sleep=ms=>new Promise(done=>setTimeout(done,ms));
async function waitFor(check,label,timeout=20_000){const start=Date.now();while(Date.now()-start<timeout){const value=await check();if(value)return value;await sleep(40);}throw new Error(`Timed out waiting for ${label}`);}
async function browserVersion(){try{const response=await fetch(`http://127.0.0.1:${port}/json/version`);return response.ok?response.json():null;}catch{return null;}}
const profile=mkdtempSync(join(tmpdir(),'day18-hand-browser-qa-'));
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--disable-background-networking',`--remote-debugging-port=${port}`,'--remote-allow-origins=*',`--user-data-dir=${profile}`,`${base}/tests/day18-v4-browser-entry.html`],{windowsHide:true,stdio:'ignore'});
const version=await waitFor(browserVersion,'Chrome CDP');
const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const target=targets.find(item=>item.type==='page');assert.ok(target?.webSocketDebuggerUrl);
const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((done,fail)=>{socket.addEventListener('open',done,{once:true});socket.addEventListener('error',fail,{once:true});});
let id=0;const pending=new Map(),errors=[];
socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const task=pending.get(message.id);if(!task)return;pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result);}else if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails?.text??'Runtime exception');});
const send=(method,params={})=>{const current=++id,sent=new Promise((resolve,reject)=>pending.set(current,{resolve,reject}));socket.send(JSON.stringify({id:current,method,params}));return sent;};
const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;};
await Promise.all([send('Page.enable'),send('Runtime.enable')]);
await waitFor(()=>evaluate(`document.readyState==='complete'`),'fixture load');
assert.equal(await evaluate(`Boolean(document.querySelector('[data-yuri-water]')?.click()||true)`),true);
await waitFor(()=>evaluate(`location.pathname.endsWith('/index.html')`),'game redirect');

const inspect=`(()=>{const cg=document.querySelector('#vnEventCg'),visible=Boolean(cg&&!cg.hidden&&cg.getClientRects().length);return {visible,src:cg?.src??'',width:cg?.naturalWidth??0,height:cg?.naturalHeight??0,load:Boolean(document.querySelector('#loadButton:not(.hidden)')),storyState:document.body.dataset.storyState??null};})()`;
async function reachApprovedCg(){for(let guard=0;guard<500;guard++){const state=await evaluate(inspect);if(state.visible&&state.src.includes('yuri-menu-wait-water-v10.png'))return state;if(state.load)await evaluate(`document.querySelector('#loadButton').click()`);else await evaluate(`document.querySelector('#visualNovelStage').click()`);await sleep(35);}throw new Error('Approved DAY18 CG was not reached');}
const first=await reachApprovedCg();
assert.match(first.src,/yuri-menu-wait-water-v10\.png\?art=hand-review-20260907-2$/);assert.deepEqual([first.width,first.height],[1672,941]);
await send('Page.reload',{ignoreCache:true});await waitFor(()=>evaluate(`document.readyState==='complete'`),'resume reload');
const resumed=await reachApprovedCg();assert.match(resumed.src,/yuri-menu-wait-water-v10\.png\?art=hand-review-20260907-2$/);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({browser:version.Browser,isolatedProfile:true,skipClicks:0,first,resumed},null,2));

try{await send('Browser.close');}catch{}
await Promise.race([new Promise(done=>browser.once('exit',done)),sleep(2000)]);
if(browser.exitCode===null)spawnSync('taskkill',['/PID',String(browser.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
const safeRoot=resolve(tmpdir()),safeProfile=resolve(profile);if(!safeProfile.startsWith(`${safeRoot}\\`))throw new Error('Unsafe profile cleanup');
rmSync(safeProfile,{recursive:true,force:true,maxRetries:5,retryDelay:100});socket.close();

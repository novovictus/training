const STORAGE_KEY='secai-plus-test-engine-v2';
const SUPPORTED_SCHEMA_VERSION=1;
const DEFAULT_QUESTION_COUNT=60;
const LEGACY_PRODUCTION_BANK={bankId:'secai-plus-cy0-001-v1',bankVersion:'1.0.0'};
const OPTION_KEYS=['A','B','C','D'];
const views=['start-view','exam-view','results-view','progress-view'];
const $=id=>document.getElementById(id);

let bankConfig=null;
let bank=[];
let questionLookup=new Map();
let state=null;
let active=null;
let index=0;
let ticker=null;
let controlsBound=false;
let blocked=false;

function init(){
  try{
    bankConfig=loadBankDefinition(window.SECAI_QUESTION_BANK);
    bank=bankConfig.questions;
    questionLookup=new Map(bank.map(question=>[question.id,question]));
    bind();
    renderBankSummary();
    const loaded=loadStoredState();
    state=loaded.state;
    active=state.activeAttempt||null;
    if(loaded.mismatch){renderBankMismatch(loaded.mismatch);return;}
    clearError();setControlsDisabled(false);renderHome();
  }catch(error){renderFatalError(error.message);}
}

function loadBankDefinition(raw){
  if(!isPlainObject(raw))throw new Error('Question bank did not load correctly.');
  if(raw.schemaVersion!==SUPPORTED_SCHEMA_VERSION)throw new Error(`Unsupported question-bank schema version: ${raw.schemaVersion}.`);
  if(typeof raw.bankId!=='string'||!raw.bankId.trim())throw new Error('Question bank is missing a non-empty bankId.');
  if(typeof raw.bankVersion!=='string'||!raw.bankVersion.trim())throw new Error('Question bank is missing a non-empty bankVersion.');
  if(typeof raw.title!=='string'||!raw.title.trim())throw new Error('Question bank is missing a non-empty title.');
  if(!Array.isArray(raw.questions)||!raw.questions.length)throw new Error('Question bank must provide a non-empty questions array.');
  const seenIds=new Set();
  const questions=raw.questions.map((question,position)=>validateQuestion(question,position,seenIds));
  return{schemaVersion:raw.schemaVersion,bankId:raw.bankId.trim(),bankVersion:raw.bankVersion.trim(),title:raw.title.trim(),questions};
}

function validateQuestion(question,position,seenIds){
  if(!isPlainObject(question))throw new Error(`Question ${position+1} is not an object.`);
  if(typeof question.id!=='string'||!question.id.trim())throw new Error(`Question ${position+1} is missing a non-empty id.`);
  if(seenIds.has(question.id))throw new Error(`Question IDs must be unique. Duplicate: ${question.id}`);
  seenIds.add(question.id);
  if(!Number.isFinite(question.number)||question.number<1||Math.floor(question.number)!==question.number)throw new Error(`Question ${question.id} must have a positive integer number.`);
  if(typeof question.stem!=='string'||!question.stem.trim())throw new Error(`Question ${question.id} must have a non-empty stem.`);
  if(typeof question.target!=='string')throw new Error(`Question ${question.id} must have a string target.`);
  if(typeof question.domain!=='string')throw new Error(`Question ${question.id} must have a string domain.`);
  if(!isPlainObject(question.options))throw new Error(`Question ${question.id} must have an options object.`);
  const optionKeys=Object.keys(question.options).sort();
  if(optionKeys.join(',')!==OPTION_KEYS.join(','))throw new Error(`Question ${question.id} must define exactly options A, B, C, and D.`);
  OPTION_KEYS.forEach(key=>{if(typeof question.options[key]!=='string'||!question.options[key].trim())throw new Error(`Question ${question.id} option ${key} must be a non-empty string.`);});
  if(!OPTION_KEYS.includes(question.answer))throw new Error(`Question ${question.id} must have answer A, B, C, or D.`);
  return{id:question.id,number:question.number,domain:question.domain,target:question.target,stem:question.stem,options:{A:question.options.A,B:question.options.B,C:question.options.C,D:question.options.D},answer:question.answer};
}

function defaultState(){
  return{version:2,bankId:bankConfig.bankId,bankVersion:bankConfig.bankVersion,settings:{questionCount:Math.min(DEFAULT_QUESTION_COUNT,bank.length),durationMinutes:60,includeMastered:false},mastery:{},attempts:[],activeAttempt:null};
}

function loadStoredState(){
  const fallback=defaultState();
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!raw)return{state:fallback,mismatch:null};
    const normalized=normalizeStateIdentity(raw,true);
    if(normalized.bankId!==bankConfig.bankId||normalized.bankVersion!==bankConfig.bankVersion){
      return{state:fallback,mismatch:{storedBankId:normalized.bankId,storedBankVersion:normalized.bankVersion}};
    }
    return{state:mergeState(normalized),mismatch:null};
  }catch{return{state:fallback,mismatch:null};}
}

function normalizeStateIdentity(raw,allowLegacy){
  if(!isPlainObject(raw)||raw.version!==2||!Array.isArray(raw.attempts)||!isPlainObject(raw.mastery)||!isPlainObject(raw.settings))throw new Error('Unsupported progress data.');
  const normalized={...raw};
  const hasBankId=typeof normalized.bankId==='string'&&normalized.bankId.trim();
  const hasBankVersion=typeof normalized.bankVersion==='string'&&normalized.bankVersion.trim();
  if(!hasBankId&&!hasBankVersion&&allowLegacy){
    normalized.bankId=LEGACY_PRODUCTION_BANK.bankId;
    normalized.bankVersion=LEGACY_PRODUCTION_BANK.bankVersion;
  }else if(!hasBankId||!hasBankVersion){
    throw new Error('Progress data is missing bank identity.');
  }else{
    normalized.bankId=normalized.bankId.trim();
    normalized.bankVersion=normalized.bankVersion.trim();
  }
  return normalized;
}

function mergeState(data){
  const merged=defaultState();
  const settings=isPlainObject(data.settings)?data.settings:{};
  merged.bankId=data.bankId;
  merged.bankVersion=data.bankVersion;
  merged.mastery=isPlainObject(data.mastery)?data.mastery:{};
  merged.attempts=Array.isArray(data.attempts)?data.attempts:[];
  merged.settings={questionCount:clampQuestionCount(settings.questionCount,bank.length),durationMinutes:Math.max(0,Number(settings.durationMinutes)||0),includeMastered:Boolean(settings.includeMastered)};
  merged.activeAttempt=sanitizeActiveAttempt(data.activeAttempt);
  return merged;
}

function sanitizeActiveAttempt(attempt){
  if(!isPlainObject(attempt)||!Array.isArray(attempt.items)||!isPlainObject(attempt.responses)||!attempt.items.length)return null;
  const items=attempt.items
    .filter(item=>isPlainObject(item)&&typeof item.questionId==='string'&&questionLookup.has(item.questionId)&&isOptionOrder(item.optionOrder))
    .map(item=>({questionId:item.questionId,optionOrder:[...item.optionOrder]}));
  if(!items.length)return null;
  const responses=Object.fromEntries(items.map(item=>{
    const response=isPlainObject(attempt.responses[item.questionId])?attempt.responses[item.questionId]:{};
    return[item.questionId,{answer:isOptionKey(response.answer)?response.answer:null,confidence:isConfidenceValue(response.confidence)?Number(response.confidence):null,flagged:Boolean(response.flagged)}];
  }));
  return{id:typeof attempt.id==='string'&&attempt.id?attempt.id:`attempt-${Number(attempt.startedAt)||Date.now()}`,startedAt:Number(attempt.startedAt)||Date.now(),durationMinutes:Math.max(0,Number(attempt.durationMinutes)||0),expiresAt:attempt.expiresAt===null?null:Number(attempt.expiresAt)||null,currentIndex:Math.max(0,Math.min(Number(attempt.currentIndex)||0,items.length-1)),items,responses};
}

function saveState(){
  if(!state)return;
  state.bankId=bankConfig.bankId;
  state.bankVersion=bankConfig.bankVersion;
  state.activeAttempt=active;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}

function bind(){
  if(controlsBound)return;
  controlsBound=true;
  $('start-btn').onclick=startNew;
  $('customize-btn').onclick=openCustomize;
  $('save-customize').onclick=saveCustomize;
  $('resume-btn').onclick=resume;
  $('history-btn').onclick=renderProgress;$('progress-btn').onclick=renderProgress;$('progress-home-btn').onclick=renderHome;$('home-btn').onclick=renderHome;
  $('prev-btn').onclick=()=>move(-1);$('next-btn').onclick=()=>move(1);$('flag-btn').onclick=toggleFlag;
  $('navigator-btn').onclick=()=>{$('navigator').hidden=!$('navigator').hidden;renderNavigator();};
  $('submit-btn').onclick=()=>submit(false);$('export-btn').onclick=exportProgress;$('import-input').onchange=importProgress;$('reset-btn').onclick=()=>resetProgress(true);
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.onchange=e=>{if(blocked)return;currentResponse().confidence=Number(e.target.value);saveState();renderNavigator();});
}

function showView(id){views.forEach(viewId=>$(viewId).hidden=viewId!==id);$('timer').style.visibility=id==='exam-view'&&active?.durationMinutes>0?'visible':'hidden';}

function renderBankSummary(){
  $('bank-summary').textContent=`${bankConfig.title} · v${bankConfig.bankVersion} · ${bank.length} question${bank.length===1?'':'s'}`;
}

function renderHome(){
  if(blocked)return;
  clearInterval(ticker);showView('start-view');$('resume-btn').hidden=!active;
  renderBankSummary();
  const mastered=bank.filter(question=>masteryFor(question.id).mastered).length;
  const attempts=state.attempts||[];
  $('history-summary').innerHTML=`<strong>${bank.length}</strong> questions · <strong>${mastered}</strong> mastered · <strong>${bank.length-mastered}</strong> remaining · <strong>${attempts.length}</strong> completed run${attempts.length===1?'':'s'}`;
}

function renderBankMismatch(mismatch){
  blocked=true;
  clearInterval(ticker);showView('start-view');renderBankSummary();setControlsDisabled(true);$('resume-btn').hidden=true;
  $('history-summary').innerHTML=`<strong>${bank.length}</strong> questions are loaded for the current bank. Stored progress cannot be reused until you reset it for this bank.`;
  const loadedLabel=`${bankConfig.title} (${bankConfig.bankId} v${bankConfig.bankVersion})`;
  const storedLabel=`${mismatch.storedBankId} v${mismatch.storedBankVersion}`;
  showErrorHtml(`<strong>Stored progress belongs to a different question bank.</strong><br>Loaded bank: ${escapeHtml(loadedLabel)}<br>Stored progress: ${escapeHtml(storedLabel)}<br>Reset local progress to initialize this bank.`,{id:'reset-bank-mismatch',label:'Reset Progress For This Bank',className:'danger',onclick:()=>resetProgress(false)});
}

function renderFatalError(message){
  blocked=true;
  clearInterval(ticker);setControlsDisabled(true);showView('start-view');
  $('history-summary').innerHTML='';$('resume-btn').hidden=true;$('bank-summary').textContent='';
  showErrorHtml(`<strong>Test engine failed to load.</strong><br>${escapeHtml(message)}`);
}

function setControlsDisabled(disabled){
  ['start-btn','customize-btn','resume-btn','history-btn','export-btn','import-input','reset-btn'].forEach(id=>{const element=$(id);if(element)element.disabled=disabled;});
}

function clearError(){$('error').hidden=true;$('error').innerHTML='';}

function showErrorHtml(html,action){
  $('error').hidden=false;
  $('error').innerHTML=`${html}${action?`<div class="actions compact"><button id="${action.id}" type="button" class="${action.className||''}">${escapeHtml(action.label)}</button></div>`:''}`;
  if(action)$(action.id).onclick=action.onclick;
}

function openCustomize(){
  if(blocked)return;
  const settings=state.settings;$('question-limit').max=bank.length;$('question-limit').value=clampQuestionCount(settings.questionCount,bank.length);$('time-limit').value=settings.durationMinutes;$('include-mastered').checked=settings.includeMastered;
  updateCustomizeSummary();['question-limit','time-limit','include-mastered'].forEach(id=>$(id).oninput=updateCustomizeSummary);$('customize-dialog').showModal();
}

function updateCustomizeSummary(){
  const include=$('include-mastered').checked;const eligible=bank.filter(question=>include||!masteryFor(question.id).mastered).length;const maxAllowed=Math.max(1,Math.min(eligible||bank.length,bank.length));
  $('question-limit').max=maxAllowed;$('question-limit').value=clampQuestionCount($('question-limit').value,maxAllowed);$('customize-summary').textContent=`${eligible} questions currently eligible.`;
}

function saveCustomize(event){
  if(blocked)return;
  event.preventDefault();const include=$('include-mastered').checked;const eligible=bank.filter(question=>include||!masteryFor(question.id).mastered).length;
  state.settings={questionCount:clampQuestionCount($('question-limit').value,eligible||bank.length),durationMinutes:Math.max(0,Number($('time-limit').value)||0),includeMastered:include};saveState();$('customize-dialog').close();renderHome();
}

function eligibleQuestions(){const include=state.settings.includeMastered;return bank.filter(question=>include||!masteryFor(question.id).mastered);}

function startNew(){
  if(blocked)return;
  if(active&&!confirm('A practice run is already in progress. Replace it?'))return;
  let pool=eligibleQuestions();if(!pool.length){alert('All questions are mastered. Enable Include mastered questions to continue.');return;}
  const configuredCount=state.settings.questionCount;
  if(configuredCount>pool.length&&!confirm(`Only ${pool.length} questions are currently eligible because mastered questions are excluded. Start a ${pool.length}-question run?`))return;
  pool=shuffle(pool);const selected=pool.slice(0,Math.min(configuredCount,pool.length));const now=Date.now();
  const items=selected.map(question=>({questionId:question.id,optionOrder:shuffle(OPTION_KEYS)}));
  active={id:`attempt-${now}`,startedAt:now,durationMinutes:state.settings.durationMinutes,expiresAt:state.settings.durationMinutes?now+state.settings.durationMinutes*60000:null,currentIndex:0,items,responses:Object.fromEntries(items.map(item=>[item.questionId,{answer:null,confidence:null,flagged:false}]))};
  index=0;saveState();startExam();
}

function resume(){if(blocked||!active)return;index=Math.min(active.currentIndex||0,active.items.length-1);startExam();}

function startExam(){showView('exam-view');renderQuestion();clearInterval(ticker);updateTimer();if(active.durationMinutes>0)ticker=setInterval(updateTimer,1000);}

function updateTimer(){
  if(!active||active.durationMinutes===0)return;
  const ms=Math.max(0,active.expiresAt-Date.now()),total=Math.ceil(ms/1000);$('timer').textContent=`${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;if(ms<=0)submit(true);
}

function currentItem(){return active.items[index];}
function currentQuestion(){return questionById(currentItem().questionId);}
function currentResponse(){return active.responses[currentItem().questionId];}
function questionById(id){return questionLookup.get(id);}
function masteryFor(id){return state.mastery[id]||{attempts:0,correct:0,mastered:false};}
function displayedLetter(item,canonicalKey){const position=item.optionOrder.indexOf(canonicalKey);return position<0?null:String.fromCharCode(65+position);}

function renderQuestion(){
  const item=currentItem(),question=currentQuestion(),response=currentResponse();active.currentIndex=index;saveState();
  $('question-count').textContent=`Question ${index+1} of ${active.items.length} · ${question.id} · Domain ${question.domain} · Mastery ${Math.min(masteryFor(question.id).correct,3)}/3`;
  $('question-stem').textContent=question.stem;
  $('options').innerHTML=item.optionOrder.map((key,position)=>`<label class="option"><input type="radio" name="answer" value="${key}" ${response.answer===key?'checked':''}><strong>${String.fromCharCode(65+position)}.</strong><span>${escapeHtml(question.options[key])}</span></label>`).join('');
  document.querySelectorAll('input[name="answer"]').forEach(el=>el.onchange=e=>{response.answer=e.target.value;saveState();renderNavigator();});
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.checked=String(response.confidence)===el.value);
  $('flag-btn').classList.toggle('flagged',response.flagged);$('flag-btn').textContent=response.flagged?'Flagged':'Flag';$('prev-btn').disabled=index===0;$('next-btn').textContent=index===active.items.length-1?'Review':'Next';renderNavigator();
}

function move(delta){if(blocked)return;index=Math.max(0,Math.min(active.items.length-1,index+delta));renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}
function toggleFlag(){if(blocked)return;const response=currentResponse();response.flagged=!response.flagged;saveState();renderQuestion();}

function renderNavigator(){
  $('navigator').innerHTML=active.items.map((item,itemIndex)=>{const response=active.responses[item.questionId];return`<button type="button" data-i="${itemIndex}" class="${response.answer?'answered ':''}${response.flagged?'flagged ':''}${itemIndex===index?'current':''}">${itemIndex+1}</button>`;}).join('');
  $('navigator').querySelectorAll('button').forEach(button=>button.onclick=()=>{index=Number(button.dataset.i);renderQuestion();});
}

function submit(expired){
  if(blocked||!active)return;
  const unanswered=active.items.filter(item=>!active.responses[item.questionId].answer).length;
  if(!expired&&!confirm(unanswered?`Submit with ${unanswered} unanswered question${unanswered===1?'':'s'}?`:'Submit this practice run?'))return;
  clearInterval(ticker);const finishedAt=Date.now();
  const items=active.items.map((runtime,number)=>{
    const question=questionById(runtime.questionId),response=active.responses[question.id],correct=Boolean(response.answer)&&response.answer===question.answer;
    const previous=masteryFor(question.id),wasMastered=previous.mastered;
    if(response.answer){state.mastery[question.id]={attempts:previous.attempts+1,correct:previous.correct+(correct?1:0),mastered:wasMastered||(correct&&previous.correct+1>=3),lastAttempt:finishedAt};}
    const current=masteryFor(question.id);
    return{...response,id:question.id,number:number+1,domain:question.domain,target:question.target,stem:question.stem,correct,correctAnswer:question.answer,optionOrder:runtime.optionOrder,displayedAnswer:response.answer?displayedLetter(runtime,response.answer):null,displayedCorrectAnswer:displayedLetter(runtime,question.answer),newlyMastered:!wasMastered&&current.mastered};
  });
  const correct=items.filter(item=>item.correct).length;const result={id:active.id,startedAt:active.startedAt,finishedAt,durationSeconds:Math.round((finishedAt-active.startedAt)/1000),configuredMinutes:active.durationMinutes,expired,correct,total:items.length,percent:Math.round(correct/items.length*100),items};
  state.attempts.push(result);active=null;saveState();renderResults(result);
}

function renderResults(result){
  showView('results-view');const unanswered=result.items.filter(item=>!item.answer).length;const newlyMastered=result.items.filter(item=>item.newlyMastered).length;
  $('score-card').innerHTML=`<div class="score-number">${result.percent}%</div><p>${result.correct} of ${result.total} correct · ${formatDuration(result.durationSeconds)} · ${unanswered} unanswered · ${newlyMastered} newly mastered</p>`;
  const mastered=bank.filter(question=>masteryFor(question.id).mastered).length;$('readiness-card').innerHTML=`<strong>${mastered} of ${bank.length} mastered</strong><br>A question is mastered after three correct completions.`;
  const review=result.items.filter(item=>item.answer||item.flagged||item.confidence!==null).sort((a,b)=>a.number-b.number);
  $('review-list').innerHTML=review.length?`<h2>Review queue</h2>${review.map(item=>{const status=!item.answer?'Not answered':item.correct?'Correct':'Incorrect';const statusClass=item.correct?'correct':item.answer?'incorrect':'';const flagBadge=item.flagged?' <span class="review-flag">Flagged</span>':'';return`<article class="review-item"><h3>Question ${item.number} · ${item.id}${flagBadge}: <span class="${statusClass}">${status}</span></h3><p>${escapeHtml(item.stem)}</p><p>Your answer: <strong>${item.displayedAnswer||'Not answered'}</strong> · Correct answer: <strong>${item.displayedCorrectAnswer}</strong> · Confidence: <strong>${item.confidence??'Not set'}</strong></p><p><strong>Target:</strong> ${escapeHtml(item.target)}</p></article>`;}).join('')}`:'<p>No answered, flagged, or confidence-marked questions to review.</p>';
}

function renderProgress(){
  if(blocked)return;
  clearInterval(ticker);showView('progress-view');const attempts=state.attempts||[],mastered=bank.filter(question=>masteryFor(question.id).mastered).length;
  const rows=[...attempts].reverse().map(attempt=>`<tr><td>${new Date(attempt.finishedAt).toLocaleDateString()}</td><td>${attempt.total}</td><td>${attempt.percent}%</td><td>${formatDuration(attempt.durationSeconds)}</td><td>${attempt.expired?'Expired':'Submitted'}</td></tr>`).join('');
  $('progress-content').innerHTML=`<div class="metric-grid"><div class="metric"><strong>Question bank</strong><br>${bank.length}</div><div class="metric"><strong>Mastered</strong><br>${mastered}</div><div class="metric"><strong>Remaining</strong><br>${bank.length-mastered}</div><div class="metric"><strong>Completed runs</strong><br>${attempts.length}</div></div>${attempts.length?`<h3>Attempt history</h3><table class="history-table"><thead><tr><th>Date</th><th>Questions</th><th>Score</th><th>Time</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>`:'<p>No completed runs yet.</p>'}`;
}

function exportProgress(){
  if(blocked)return;
  clearError();
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`secai-training-progress-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(link.href);
}

async function importProgress(event){
  if(blocked)return;
  const file=event.target.files[0];if(!file)return;
  try{
    const normalized=normalizeStateIdentity(JSON.parse(await file.text()),true);
    if(normalized.bankId!==bankConfig.bankId||normalized.bankVersion!==bankConfig.bankVersion)throw new Error(`Progress file belongs to ${normalized.bankId} v${normalized.bankVersion}, but the loaded bank is ${bankConfig.bankId} v${bankConfig.bankVersion}.`);
    state=mergeState(normalized);active=state.activeAttempt||null;saveState();clearError();renderHome();
  }catch(error){showErrorHtml(`<strong>Import failed.</strong><br>${escapeHtml(error.message)}`);}
  finally{event.target.value='';}
}

function resetProgress(confirmReset){
  if(confirmReset&&!confirm('Delete all locally stored attempts, mastery, settings, and active progress for this bank?'))return;
  localStorage.removeItem(STORAGE_KEY);blocked=false;state=defaultState();active=null;saveState();clearError();setControlsDisabled(false);renderHome();
}

function clampQuestionCount(requested,maxAllowed){
  const max=Math.max(1,Math.min(Number(maxAllowed)||bank.length,bank.length));
  return Math.max(1,Math.min(Number(requested)||1,max));
}

function shuffle(values){const shuffled=[...values];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
function formatDuration(seconds){return`${Math.floor(seconds/60)}m ${seconds%60}s`;}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function isPlainObject(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
function isOptionKey(value){return OPTION_KEYS.includes(value);}
function isOptionOrder(value){return Array.isArray(value)&&value.length===OPTION_KEYS.length&&new Set(value).size===OPTION_KEYS.length&&OPTION_KEYS.every(key=>value.includes(key));}
function isConfidenceValue(value){return value!==null&&value!==''&&[0,1,2,3].includes(Number(value));}

init();

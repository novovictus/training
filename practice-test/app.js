const STORAGE_KEY='secai-plus-test-engine-v2';
const $=id=>document.getElementById(id);
const views=['start-view','exam-view','results-view','progress-view'];
const bank=window.SECAI_QUESTION_BANK||[];
let state=loadState();
let active=state.activeAttempt;
let index=0;
let ticker=null;

function defaultState(){return{version:2,settings:{questionCount:60,durationMinutes:60,includeMastered:false},mastery:{},attempts:[],activeAttempt:null};}
function loadState(){try{return Object.assign(defaultState(),JSON.parse(localStorage.getItem(STORAGE_KEY))||{});}catch{return defaultState();}}
function saveState(){state.activeAttempt=active;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function showView(id){views.forEach(v=>$(v).hidden=v!==id);$('timer').style.visibility=id==='exam-view'&&active?.durationMinutes>0?'visible':'hidden';}
function shuffle(values){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function questionById(id){return bank.find(q=>q.id===id);}
function masteryFor(id){return state.mastery[id]||{attempts:0,correct:0,mastered:false};}
function displayedLetter(item,canonicalKey){const position=item.optionOrder.indexOf(canonicalKey);return position<0?null:String.fromCharCode(65+position);}

function init(){
  try{
    if(!bank.length)throw new Error('No questions loaded.');
    const ids=bank.map(q=>q.id);if(new Set(ids).size!==ids.length)throw new Error('Question IDs must be unique.');
    bind();renderHome();
  }catch(error){$('error').hidden=false;$('error').textContent=`Test engine failed to load: ${error.message}`;}
}
function bind(){
  $('start-btn').onclick=startNew;
  $('customize-btn').onclick=openCustomize;
  $('save-customize').onclick=saveCustomize;
  $('resume-btn').onclick=resume;
  $('history-btn').onclick=renderProgress;$('progress-btn').onclick=renderProgress;$('progress-home-btn').onclick=renderHome;$('home-btn').onclick=renderHome;
  $('prev-btn').onclick=()=>move(-1);$('next-btn').onclick=()=>move(1);$('flag-btn').onclick=toggleFlag;
  $('navigator-btn').onclick=()=>{$('navigator').hidden=!$('navigator').hidden;renderNavigator();};
  $('submit-btn').onclick=()=>submit(false);$('export-btn').onclick=exportProgress;$('import-input').onchange=importProgress;$('reset-btn').onclick=resetProgress;
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.onchange=e=>{currentResponse().confidence=Number(e.target.value);saveState();renderNavigator();});
}
function renderHome(){
  clearInterval(ticker);showView('start-view');$('resume-btn').hidden=!active;
  const mastered=bank.filter(q=>masteryFor(q.id).mastered).length;
  const attempts=state.attempts||[];
  $('history-summary').innerHTML=`<strong>${bank.length}</strong> questions · <strong>${mastered}</strong> mastered · <strong>${bank.length-mastered}</strong> remaining · <strong>${attempts.length}</strong> completed run${attempts.length===1?'':'s'}`;
}
function openCustomize(){
  const s=state.settings;$('question-limit').max=bank.length;$('question-limit').value=Math.min(s.questionCount,bank.length);$('time-limit').value=s.durationMinutes;$('include-mastered').checked=s.includeMastered;
  updateCustomizeSummary();['question-limit','time-limit','include-mastered'].forEach(id=>$(id).oninput=updateCustomizeSummary);$('customize-dialog').showModal();
}
function updateCustomizeSummary(){
  const include=$('include-mastered').checked;const eligible=bank.filter(q=>include||!masteryFor(q.id).mastered).length;
  $('customize-summary').textContent=`${eligible} questions currently eligible.`;$('question-limit').max=Math.max(1,eligible);
}
function saveCustomize(event){
  event.preventDefault();const include=$('include-mastered').checked;const eligible=bank.filter(q=>include||!masteryFor(q.id).mastered).length;
  state.settings={questionCount:Math.max(1,Math.min(Number($('question-limit').value)||1,eligible||bank.length)),durationMinutes:Math.max(0,Number($('time-limit').value)||0),includeMastered:include};saveState();$('customize-dialog').close();renderHome();
}
function eligibleQuestions(){const include=state.settings.includeMastered;return bank.filter(q=>include||!masteryFor(q.id).mastered);}
function startNew(){
  if(active&&!confirm('A practice run is already in progress. Replace it?'))return;
  let pool=eligibleQuestions();if(!pool.length){alert('All questions are mastered. Enable Include mastered questions to continue.');return;}
  pool=shuffle(pool);const selected=pool.slice(0,Math.min(state.settings.questionCount,pool.length));const now=Date.now();
  const items=selected.map(q=>({questionId:q.id,optionOrder:shuffle(Object.keys(q.options))}));
  active={id:`attempt-${now}`,startedAt:now,durationMinutes:state.settings.durationMinutes,expiresAt:state.settings.durationMinutes?now+state.settings.durationMinutes*60000:null,currentIndex:0,items,responses:Object.fromEntries(items.map(x=>[x.questionId,{answer:null,confidence:null,flagged:false}]))};
  index=0;saveState();startExam();
}
function resume(){index=Math.min(active.currentIndex||0,active.items.length-1);startExam();}
function startExam(){showView('exam-view');renderQuestion();clearInterval(ticker);updateTimer();if(active.durationMinutes>0)ticker=setInterval(updateTimer,1000);}
function updateTimer(){
  if(!active||active.durationMinutes===0)return;
  const ms=Math.max(0,active.expiresAt-Date.now()),total=Math.ceil(ms/1000);$('timer').textContent=`${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;if(ms<=0)submit(true);
}
function currentItem(){return active.items[index];}
function currentQuestion(){return questionById(currentItem().questionId);}
function currentResponse(){return active.responses[currentItem().questionId];}
function renderQuestion(){
  const item=currentItem(),q=currentQuestion(),r=currentResponse();active.currentIndex=index;saveState();
  $('question-count').textContent=`Question ${index+1} of ${active.items.length} · ${q.id} · Domain ${q.domain} · Mastery ${Math.min(masteryFor(q.id).correct,3)}/3`;
  $('question-stem').textContent=q.stem;
  $('options').innerHTML=item.optionOrder.map((key,position)=>`<label class="option"><input type="radio" name="answer" value="${key}" ${r.answer===key?'checked':''}><strong>${String.fromCharCode(65+position)}.</strong><span>${escapeHtml(q.options[key])}</span></label>`).join('');
  document.querySelectorAll('input[name="answer"]').forEach(el=>el.onchange=e=>{r.answer=e.target.value;saveState();renderNavigator();});
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.checked=String(r.confidence)===el.value);
  $('flag-btn').classList.toggle('flagged',r.flagged);$('flag-btn').textContent=r.flagged?'Flagged':'Flag';$('prev-btn').disabled=index===0;$('next-btn').textContent=index===active.items.length-1?'Review':'Next';renderNavigator();
}
function move(delta){index=Math.max(0,Math.min(active.items.length-1,index+delta));renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}
function toggleFlag(){const r=currentResponse();r.flagged=!r.flagged;saveState();renderQuestion();}
function renderNavigator(){
  $('navigator').innerHTML=active.items.map((item,i)=>{const r=active.responses[item.questionId];return`<button type="button" data-i="${i}" class="${r.answer?'answered ':''}${r.flagged?'flagged ':''}${i===index?'current':''}">${i+1}</button>`;}).join('');
  $('navigator').querySelectorAll('button').forEach(b=>b.onclick=()=>{index=Number(b.dataset.i);renderQuestion();});
}
function submit(expired){
  if(!active)return;const unanswered=active.items.filter(x=>!active.responses[x.questionId].answer).length;
  if(!expired&&!confirm(unanswered?`Submit with ${unanswered} unanswered question${unanswered===1?'':'s'}?`:'Submit this practice run?'))return;
  clearInterval(ticker);const finishedAt=Date.now();
  const items=active.items.map((runtime,number)=>{
    const q=questionById(runtime.questionId),r=active.responses[q.id],correct=Boolean(r.answer)&&r.answer===q.answer;
    const previous=masteryFor(q.id),wasMastered=previous.mastered;
    if(r.answer){state.mastery[q.id]={attempts:previous.attempts+1,correct:previous.correct+(correct?1:0),mastered:wasMastered||(correct&&previous.correct+1>=3),lastAttempt:finishedAt};}
    const current=masteryFor(q.id);
    return{...r,id:q.id,number:number+1,domain:q.domain,target:q.target,stem:q.stem,correct,correctAnswer:q.answer,optionOrder:runtime.optionOrder,displayedAnswer:r.answer?displayedLetter(runtime,r.answer):null,displayedCorrectAnswer:displayedLetter(runtime,q.answer),newlyMastered:!wasMastered&&current.mastered};
  });
  const correct=items.filter(x=>x.correct).length;const result={id:active.id,startedAt:active.startedAt,finishedAt,durationSeconds:Math.round((finishedAt-active.startedAt)/1000),configuredMinutes:active.durationMinutes,expired,correct,total:items.length,percent:Math.round(correct/items.length*100),items};
  state.attempts.push(result);active=null;saveState();renderResults(result);
}
function renderResults(result){
  showView('results-view');const unanswered=result.items.filter(x=>!x.answer).length;const newlyMastered=result.items.filter(x=>x.newlyMastered).length;
  $('score-card').innerHTML=`<div class="score-number">${result.percent}%</div><p>${result.correct} of ${result.total} correct · ${formatDuration(result.durationSeconds)} · ${unanswered} unanswered · ${newlyMastered} newly mastered</p>`;
  const mastered=bank.filter(q=>masteryFor(q.id).mastered).length;$('readiness-card').innerHTML=`<strong>${mastered} of ${bank.length} mastered</strong><br>A question is mastered after three correct completions.`;
  const review=result.items.filter(x=>!x.correct||x.confidence===0||x.confidence===1||x.flagged).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  $('review-list').innerHTML=review.length?`<h2>Review queue</h2>${review.map(item=>`<article class="review-item"><h3>${item.id}: <span class="${item.correct?'correct':'incorrect'}">${item.correct?'Correct':'Incorrect'}</span></h3><p>${escapeHtml(item.stem)}</p><p>Your answer: <strong>${item.displayedAnswer||'Unanswered'}</strong> · Correct answer: <strong>${item.displayedCorrectAnswer}</strong> · Confidence: <strong>${item.confidence??'Not set'}</strong></p><p><strong>Target:</strong> ${escapeHtml(item.target)}</p></article>`).join('')}`:'<p>No review items.</p>';
}
function renderProgress(){
  clearInterval(ticker);showView('progress-view');const attempts=state.attempts||[],mastered=bank.filter(q=>masteryFor(q.id).mastered).length;
  const rows=[...attempts].reverse().map(a=>`<tr><td>${new Date(a.finishedAt).toLocaleDateString()}</td><td>${a.total}</td><td>${a.percent}%</td><td>${formatDuration(a.durationSeconds)}</td><td>${a.expired?'Expired':'Submitted'}</td></tr>`).join('');
  $('progress-content').innerHTML=`<div class="metric-grid"><div class="metric"><strong>Question bank</strong><br>${bank.length}</div><div class="metric"><strong>Mastered</strong><br>${mastered}</div><div class="metric"><strong>Remaining</strong><br>${bank.length-mastered}</div><div class="metric"><strong>Completed runs</strong><br>${attempts.length}</div></div>${attempts.length?`<h3>Attempt history</h3><table class="history-table"><thead><tr><th>Date</th><th>Questions</th><th>Score</th><th>Time</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>`:'<p>No completed runs yet.</p>'}`;
}
function exportProgress(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`secai-training-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
async function importProgress(e){const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.version!==2||!Array.isArray(data.attempts)||typeof data.mastery!=='object')throw new Error('Unsupported progress file.');state=Object.assign(defaultState(),data);active=state.activeAttempt||null;saveState();renderHome();}catch(error){alert(error.message);}finally{e.target.value='';}}
function resetProgress(){if(confirm('Delete all locally stored attempts, mastery, settings, and active progress?')){localStorage.removeItem(STORAGE_KEY);state=defaultState();active=null;renderHome();}}
function formatDuration(seconds){return`${Math.floor(seconds/60)}m ${seconds%60}s`;}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

init();
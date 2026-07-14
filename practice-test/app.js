const STORAGE_KEY='secai-plus-test-engine-v1';
const EXAM_MINUTES=60;
const $=id=>document.getElementById(id);
const views=['start-view','exam-view','results-view','progress-view'];
const bank=window.SECAI_QUESTION_BANK||[];
let state=loadState();
let active=state.activeAttempt;
let index=0;
let ticker=null;

function loadState(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{version:1,attempts:[],activeAttempt:null};}
  catch{return{version:1,attempts:[],activeAttempt:null};}
}
function saveState(){state.activeAttempt=active;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function showView(id){views.forEach(v=>$(v).hidden=v!==id);$('timer').style.visibility=id==='exam-view'?'visible':'hidden';}
function init(){
  try{
    if(bank.length!==60)throw new Error(`Expected 60 questions but loaded ${bank.length}.`);
    bind();
    renderHome();
  }catch(error){$('error').hidden=false;$('error').textContent=`Test engine failed to load: ${error.message}`;}
}
function bind(){
  $('start-btn').onclick=startNew;
  $('resume-btn').onclick=resume;
  $('history-btn').onclick=renderProgress;
  $('progress-btn').onclick=renderProgress;
  $('progress-home-btn').onclick=renderHome;
  $('home-btn').onclick=renderHome;
  $('prev-btn').onclick=()=>move(-1);
  $('next-btn').onclick=()=>move(1);
  $('flag-btn').onclick=toggleFlag;
  $('navigator-btn').onclick=()=>{$('navigator').hidden=!$('navigator').hidden;renderNavigator();};
  $('submit-btn').onclick=()=>submit(false);
  $('export-btn').onclick=exportProgress;
  $('import-input').onchange=importProgress;
  $('reset-btn').onclick=resetProgress;
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.onchange=e=>{active.responses[bank[index].id].confidence=Number(e.target.value);saveState();renderNavigator();});
}
function renderHome(){
  clearInterval(ticker);showView('start-view');
  $('resume-btn').hidden=!active;
  const attempts=state.attempts||[];
  const recent=attempts.slice(-3);
  $('history-summary').innerHTML=attempts.length
    ?`<strong>${attempts.length}</strong> completed test${attempts.length===1?'':'s'} · Recent average <strong>${average(recent.map(a=>a.percent))}%</strong> · Status <strong>${readiness(attempts).label}</strong>`
    :'No completed tests yet.';
}
function blankResponses(){return Object.fromEntries(bank.map(q=>[q.id,{answer:null,confidence:null,flagged:false}]));}
function startNew(){
  if(active&&!confirm('A test is already in progress. Replace it with a new test?'))return;
  const now=Date.now();
  active={id:`attempt-${now}`,startedAt:now,expiresAt:now+EXAM_MINUTES*60000,currentIndex:0,responses:blankResponses()};
  index=0;saveState();startExam();
}
function resume(){index=Math.min(active.currentIndex||0,bank.length-1);startExam();}
function startExam(){showView('exam-view');renderQuestion();clearInterval(ticker);updateTimer();ticker=setInterval(updateTimer,1000);}
function updateTimer(){
  if(!active)return;
  const ms=Math.max(0,active.expiresAt-Date.now());
  const total=Math.ceil(ms/1000);$('timer').textContent=`${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  if(ms<=0)submit(true);
}
function renderQuestion(){
  const q=bank[index],r=active.responses[q.id];active.currentIndex=index;saveState();
  $('question-count').textContent=`Question ${index+1} of ${bank.length} · Domain ${q.domain}`;
  $('question-stem').textContent=q.stem;
  $('options').innerHTML=Object.entries(q.options).map(([key,text])=>`<label class="option"><input type="radio" name="answer" value="${key}" ${r.answer===key?'checked':''}><strong>${key}.</strong><span>${escapeHtml(text)}</span></label>`).join('');
  document.querySelectorAll('input[name="answer"]').forEach(el=>el.onchange=e=>{r.answer=e.target.value;saveState();renderNavigator();});
  document.querySelectorAll('input[name="confidence"]').forEach(el=>el.checked=String(r.confidence)===el.value);
  $('flag-btn').classList.toggle('flagged',r.flagged);$('flag-btn').textContent=r.flagged?'Flagged':'Flag';
  $('prev-btn').disabled=index===0;$('next-btn').textContent=index===bank.length-1?'Review':'Next';
  renderNavigator();
}
function move(delta){index=Math.max(0,Math.min(bank.length-1,index+delta));renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}
function toggleFlag(){const r=active.responses[bank[index].id];r.flagged=!r.flagged;saveState();renderQuestion();}
function renderNavigator(){
  $('navigator').innerHTML=bank.map((q,i)=>{const r=active.responses[q.id];return`<button type="button" data-i="${i}" class="${r.answer?'answered ':''}${r.flagged?'flagged ':''}${i===index?'current':''}">${i+1}</button>`;}).join('');
  $('navigator').querySelectorAll('button').forEach(b=>b.onclick=()=>{index=Number(b.dataset.i);renderQuestion();});
}
function submit(expired){
  if(!active)return;
  const unanswered=bank.filter(q=>!active.responses[q.id].answer).length;
  if(!expired&&!confirm(unanswered?`Submit with ${unanswered} unanswered question${unanswered===1?'':'s'}?`:'Submit this test?'))return;
  clearInterval(ticker);
  const finishedAt=Date.now();
  const items=bank.map(q=>{const r=active.responses[q.id];return{...r,id:q.id,number:q.number,domain:q.domain,target:q.target,correct:r.answer===q.answer,correctAnswer:q.answer};});
  const correct=items.filter(x=>x.correct).length;
  const result={id:active.id,startedAt:active.startedAt,finishedAt,durationSeconds:Math.round((finishedAt-active.startedAt)/1000),expired,correct,total:bank.length,percent:Math.round(correct/bank.length*100),items};
  state.attempts.push(result);active=null;saveState();renderResults(result);
}
function renderResults(result){
  showView('results-view');
  const unanswered=result.items.filter(x=>!x.answer).length;
  const lowConfidenceCorrect=result.items.filter(x=>x.correct&&(x.confidence===0||x.confidence===1)).length;
  const highConfidenceWrong=result.items.filter(x=>!x.correct&&(x.confidence===2||x.confidence===3)).length;
  const domainHtml=[1,2,3,4].map(d=>{const set=result.items.filter(x=>x.domain===String(d));return`<div class="metric"><strong>Domain ${d}</strong><br>${Math.round(set.filter(x=>x.correct).length/set.length*100)}%</div>`;}).join('');
  $('score-card').innerHTML=`<div class="score-number">${result.percent}%</div><p>${result.correct} of ${result.total} correct · ${formatDuration(result.durationSeconds)} · ${unanswered} unanswered</p><div class="metric-grid">${domainHtml}<div class="metric"><strong>Correct, low confidence</strong><br>${lowConfidenceCorrect}</div><div class="metric"><strong>Wrong, high confidence</strong><br>${highConfidenceWrong}</div></div>`;
  const ready=readiness(state.attempts);$('readiness-card').innerHTML=`<strong>${ready.label}</strong><br>${ready.reason}`;
  const review=result.items.filter(x=>!x.correct||x.confidence===0||x.confidence===1||x.flagged);
  $('review-list').innerHTML=review.length?`<h2>Review queue</h2>${review.map(item=>{const q=bank[item.number-1];return`<article class="review-item"><h3>Question ${item.number}: <span class="${item.correct?'correct':'incorrect'}">${item.correct?'Correct':'Incorrect'}</span></h3><p>${escapeHtml(q.stem)}</p><p>Your answer: <strong>${item.answer||'Unanswered'}</strong> · Correct answer: <strong>${item.correctAnswer}</strong> · Confidence: <strong>${item.confidence??'Not set'}</strong></p><p><strong>Target:</strong> ${escapeHtml(item.target)}</p></article>`;}).join('')}`:'<p>No review items.</p>';
}
function renderProgress(){
  clearInterval(ticker);showView('progress-view');
  const attempts=state.attempts||[],ready=readiness(attempts);
  if(!attempts.length){$('progress-content').innerHTML='<p>No completed tests yet.</p>';return;}
  const rows=[...attempts].reverse().map(a=>`<tr><td>${new Date(a.finishedAt).toLocaleDateString()}</td><td>${a.percent}%</td><td>${formatDuration(a.durationSeconds)}</td><td>${a.expired?'Expired':'Submitted'}</td></tr>`).join('');
  const domains=[1,2,3,4].map(d=>{const items=attempts.flatMap(a=>a.items.filter(x=>x.domain===String(d)));return`<div class="metric"><strong>Domain ${d}</strong><br>${Math.round(items.filter(x=>x.correct).length/items.length*100)}%</div>`;}).join('');
  $('progress-content').innerHTML=`<div class="readiness"><strong>${ready.label}</strong><br>${ready.reason}</div><div class="metric-grid"><div class="metric"><strong>Completed</strong><br>${attempts.length}</div><div class="metric"><strong>Overall average</strong><br>${average(attempts.map(a=>a.percent))}%</div><div class="metric"><strong>Best score</strong><br>${Math.max(...attempts.map(a=>a.percent))}%</div>${domains}</div><h3>Attempt history</h3><table class="history-table"><thead><tr><th>Date</th><th>Score</th><th>Time</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function readiness(attempts){
  if(attempts.length<3)return{label:'Not enough evidence',reason:`Complete ${3-attempts.length} more full test${3-attempts.length===1?'':'s'} to calculate readiness.`};
  const recent=attempts.slice(-3),avg=average(recent.map(a=>a.percent));
  const domainScores=[1,2,3,4].map(d=>{const items=recent.flatMap(a=>a.items.filter(x=>x.domain===String(d)));return Math.round(items.filter(x=>x.correct).length/items.length*100);});
  const min=Math.min(...domainScores),timed=recent.every(a=>a.durationSeconds<=EXAM_MINUTES*60&&!a.expired);
  if(avg>=85&&min>=80&&timed)return{label:'Ready',reason:`Recent average ${avg}%, lowest domain ${min}%, and all recent tests completed within time.`};
  if(avg>=75&&min>=70)return{label:'Near ready',reason:`Recent average ${avg}%; lowest domain ${min}%. Target 85% overall and 80% in every domain.`};
  return{label:'Developing',reason:`Recent average ${avg}%; lowest domain ${min}%. Continue targeted review and retesting.`};
}
function exportProgress(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`secai-training-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
async function importProgress(e){
  const file=e.target.files[0];if(!file)return;
  try{const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.attempts))throw new Error('Unsupported progress file.');state=data;active=data.activeAttempt||null;saveState();renderHome();}
  catch(error){alert(error.message);}finally{e.target.value='';}
}
function resetProgress(){if(confirm('Delete all locally stored attempts and active test progress?')){localStorage.removeItem(STORAGE_KEY);state={version:1,attempts:[],activeAttempt:null};active=null;renderHome();}}
function average(values){return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;}
function formatDuration(seconds){return`${Math.floor(seconds/60)}m ${seconds%60}s`;}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

init();

(()=>{
  const registry=window.SECAI_BANKS;
  const originalCustomize=$('customize-btn').onclick;
  const originalSaveCustomize=$('save-customize').onclick;
  const originalRenderResults=renderResults;

  function modeLabel(mode){return sanitizeRunMode(mode)==='practice'?'Practice':'Exam';}

  function updateBankNote(){
    const note=$('bank-file-note');
    if(!note||!registry)return;
    const selected=registry.selected;
    note.textContent=`Current bank: ${selected.title} (${selected.id} v${selected.version}, ${selected.questionCount} questions).`;
    const bundled=$('use-bundled-bank');
    if(bundled)bundled.disabled=selected.kind==='bundled';
  }

  function updateActiveModeNote(){
    const note=$('active-mode-note');
    if(!note)return;
    note.hidden=!active;
    note.textContent=active?`Current run remains ${modeLabel(activeRunMode())}. Saving a different mode applies to new runs unless you explicitly restart the active run.`:'';
  }

  function updateResumeLabel(){
    if(active)$('resume-btn').textContent=`Resume ${modeLabel(activeRunMode())}`;
  }

  function restartActiveInMode(mode){
    if(!active)return;
    const now=Date.now();
    active={
      id:`attempt-${now}`,
      startedAt:now,
      durationMinutes:state.settings.durationMinutes,
      expiresAt:state.settings.durationMinutes?now+state.settings.durationMinutes*60000:null,
      currentIndex:0,
      mode:sanitizeRunMode(mode),
      items:active.items.map(item=>({questionId:item.questionId,optionOrder:[...item.optionOrder]})),
      responses:Object.fromEntries(active.items.map(item=>[item.questionId,createResponseState()]))
    };
    index=0;
    saveState();
    startExam();
  }

  function reviewAnswerLine(item,fullAnswers){
    const selectedLetter=item.displayedAnswer||'Not answered';
    const correctLetter=item.displayedCorrectAnswer;
    if(!fullAnswers)return`<p>Your answer: <strong>${escapeHtml(selectedLetter)}</strong> · Correct answer: <strong>${escapeHtml(correctLetter)}</strong> · Confidence: <strong>${item.confidence??'Not set'}</strong></p>`;
    const selectedText=item.answer?item.options?.[item.answer]||'':'Not answered';
    const correctText=item.options?.[item.correctAnswer]||'';
    return`<p>Your answer: <strong>${escapeHtml(selectedLetter)}${item.answer?`. ${escapeHtml(selectedText)}`:''}</strong><br>Correct answer: <strong>${escapeHtml(correctLetter)}. ${escapeHtml(correctText)}</strong><br>Confidence: <strong>${item.confidence??'Not set'}</strong></p>`;
  }

  function renderReviewQueue(result){
    const wrongOnly=Boolean($('review-wrong-only')?.checked);
    const fullAnswers=Boolean($('review-full-answers')?.checked);
    let review=result.items.filter(item=>item.answer||item.flagged||item.confidence!==null);
    if(wrongOnly)review=review.filter(item=>Boolean(item.answer)&&!item.correct);
    review.sort((a,b)=>a.number-b.number);
    $('review-list').innerHTML=review.length?`<h2>Review queue</h2>${review.map(item=>{
      const status=!item.answer?'Not answered':item.correct?'Correct':'Incorrect';
      const statusClass=item.correct?'correct':item.answer?'incorrect':'';
      const flagBadge=item.flagged?' <span class="review-flag">Flagged</span>':'';
      return`<article class="review-item"><h3>Question ${item.number} · ${item.id}${flagBadge}: <span class="${statusClass}">${status}</span></h3><p>${escapeHtml(item.stem)}</p>${reviewAnswerLine(item,fullAnswers)}<p><strong>Target:</strong> ${escapeHtml(item.target)}</p></article>`;
    }).join('')}`:`<p>${wrongOnly?'No answered questions were incorrect.':'No answered, flagged, or confidence-marked questions to review.'}</p>`;
  }

  function parseBankFile(text,name){
    if(name.toLowerCase().endsWith('.json'))return JSON.parse(text);
    const isolatedWindow={};
    const bank=new Function('window',`${text}\nreturn window.SECAI_QUESTION_BANK;`)(isolatedWindow);
    if(!bank)throw new Error('The JavaScript file did not assign window.SECAI_QUESTION_BANK.');
    return bank;
  }

  async function loadBankFile(event){
    const input=event.target;
    const file=input.files?.[0];
    if(!file)return;
    try{
      const bank=parseBankFile(await file.text(),file.name);
      if(!registry?.validBankShape(bank))throw new Error('The selected file does not contain a supported question bank.');
      if(active&&!confirm(`A ${modeLabel(activeRunMode())} run is in progress. Open ${bank.title} and leave this run available when you return to the current bank?`))return;
      saveState();
      registry.switchToCustom(bank);
    }catch(error){
      alert(`Question bank could not be opened.\n\n${error.message}`);
    }finally{
      input.value='';
    }
  }

  function useBundledBank(){
    if(!registry||registry.selected.kind==='bundled')return;
    if(active&&!confirm(`A ${modeLabel(activeRunMode())} run is in progress. Return to the bundled bank and leave this run available when you reopen the current bank file?`))return;
    saveState();
    registry.useBundled();
  }

  $('customize-btn').onclick=()=>{
    originalCustomize();
    updateBankNote();
    updateActiveModeNote();
  };

  $('save-customize').onclick=event=>{
    const requestedMode=selectedRunMode();
    const modeChanged=Boolean(active)&&requestedMode!==activeRunMode();
    let restart=false;
    if(modeChanged){
      restart=confirm(`This run was started in ${modeLabel(activeRunMode())} mode.\n\nSelect OK to restart the same question set in ${modeLabel(requestedMode)} mode and clear all current answers, flags, confidence ratings, notes, and elapsed time.\n\nSelect Cancel to keep this run in ${modeLabel(activeRunMode())} mode and use ${modeLabel(requestedMode)} only for new runs.`);
    }
    originalSaveCustomize(event);
    if(restart)restartActiveInMode(requestedMode);
    else updateResumeLabel();
  };

  renderResults=function(result){
    originalRenderResults(result);
    if($('review-wrong-only'))$('review-wrong-only').checked=false;
    if($('review-full-answers'))$('review-full-answers').checked=false;
    renderReviewQueue(result);
  };

  $('bank-file-input')?.addEventListener('change',loadBankFile);
  $('use-bundled-bank')?.addEventListener('click',useBundledBank);
  $('review-wrong-only')?.addEventListener('change',()=>{if(currentResult)renderReviewQueue(currentResult);});
  $('review-full-answers')?.addEventListener('change',()=>{if(currentResult)renderReviewQueue(currentResult);});
  $('home-btn')?.addEventListener('click',updateResumeLabel);
  $('progress-home-btn')?.addEventListener('click',updateResumeLabel);

  updateBankNote();
  updateResumeLabel();
})();

(()=>{
  const registry=window.SECAI_BANKS;
  const originalCustomize=$('customize-btn').onclick;
  const originalSaveCustomize=$('save-customize').onclick;
  const originalRenderResults=renderResults;

  function modeLabel(mode){return sanitizeRunMode(mode)==='practice'?'Practice':'Exam';}

  function populateBankControls(){
    const select=$('bank-select');
    if(!select||!registry)return;
    select.innerHTML=registry.banks.map(bank=>`<option value="${escapeHtml(bank.id)}">${escapeHtml(bank.title)} - ${bank.questionCount} questions</option>`).join('');
    select.value=registry.selected.id;
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

  $('customize-btn').onclick=()=>{
    originalCustomize();
    populateBankControls();
    updateActiveModeNote();
  };

  $('save-customize').onclick=event=>{
    const requestedBank=$('bank-select')?.value;
    if(registry&&requestedBank&&requestedBank!==registry.selected.id){
      event.preventDefault();
      if(active&&!confirm(`A ${modeLabel(activeRunMode())} run is in progress. Switch banks and leave it available to resume when you return?`)){
        $('bank-select').value=registry.selected.id;
        return;
      }
      saveState();
      registry.selectBank(requestedBank);
      return;
    }

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

  $('review-wrong-only')?.addEventListener('change',()=>{if(currentResult)renderReviewQueue(currentResult);});
  $('review-full-answers')?.addEventListener('change',()=>{if(currentResult)renderReviewQueue(currentResult);});
  $('home-btn')?.addEventListener('click',updateResumeLabel);
  $('progress-home-btn')?.addEventListener('click',updateResumeLabel);

  populateBankControls();
  updateResumeLabel();
})();

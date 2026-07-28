(()=>{
  const modeKey=`secai-plus-run-mode:${bankConfig.bankId}`;
  const modeInputs=[...document.querySelectorAll('input[name="run-mode"]')];
  const originalStartNew=$('start-btn').onclick;
  const originalRenderQuestion=renderQuestion;
  const originalRenderResults=renderResults;
  const originalSubmit=submit;
  const originalBuildRunExportRecord=buildRunExportRecord;

  function configuredMode(){
    const value=localStorage.getItem(modeKey);
    return value==='practice'?'practice':'exam';
  }

  function setModeControls(){
    const mode=configuredMode();
    modeInputs.forEach(input=>{input.checked=input.value===mode;});
  }

  function activeMode(){return active?.mode==='practice'?'practice':'exam';}
  function isPractice(){return activeMode()==='practice';}

  function restoreActiveMetadata(){
    if(!active)return;
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
      const stored=raw?.activeAttempt;
      if(stored?.id!==active.id)return;
      active.mode=stored.mode==='practice'?'practice':'exam';
      active.items.forEach(item=>{
        const storedResponse=stored.responses?.[item.questionId];
        if(storedResponse?.locked)active.responses[item.questionId].locked=true;
      });
    }catch{}
  }

  function saveMode(){
    const selected=modeInputs.find(input=>input.checked)?.value||'exam';
    localStorage.setItem(modeKey,selected);
  }

  function showFeedback(){
    const controls=$('answer-reveal-controls');
    const box=$('answer-reveal');
    document.querySelectorAll('#options .option').forEach(option=>option.classList.remove('answer-correct','answer-incorrect'));
    if(!isPractice()||!currentResponse().locked){controls.hidden=true;box.hidden=true;box.textContent='';return;}

    const item=currentItem(),question=currentQuestion(),response=currentResponse();
    const correctDisplayed=displayedLetter(item,question.answer);
    const selectedDisplayed=displayedLetter(item,response.answer);
    const correct=response.answer===question.answer;
    box.innerHTML=`<strong class="${correct?'correct':'incorrect'}">${correct?'Correct':'Incorrect'}</strong><br>Correct answer: <strong>${escapeHtml(correctDisplayed)}. ${escapeHtml(question.options[question.answer])}</strong>${correct?'':`<br>Your answer: <strong>${escapeHtml(selectedDisplayed)}. ${escapeHtml(question.options[response.answer])}</strong>`}`;
    controls.hidden=false;box.hidden=false;

    document.querySelectorAll('#options .option').forEach(option=>{
      const input=option.querySelector('input[name="answer"]');
      if(!input)return;
      input.disabled=true;
      option.classList.toggle('answer-correct',input.value===question.answer);
      option.classList.toggle('answer-incorrect',input.value===response.answer&&response.answer!==question.answer);
    });
  }

  function updatePracticeControls(){
    if(!active)return;
    const response=currentResponse();
    const next=$('next-btn');
    $('prev-btn').disabled=index===0;
    if(!isPractice()){
      next.textContent=index===active.items.length-1?'Review':'Next';
      return;
    }
    next.textContent=response.locked?(index===active.items.length-1?'Finish run':'Next'):'Submit answer';
  }

  function submitCurrentAnswer(){
    const response=currentResponse();
    if(!response.answer){alert('Select an answer before submitting it.');return;}
    response.locked=true;
    saveState();
    renderQuestion();
  }

  function practiceNext(){
    if(!isPractice()){move(1);return;}
    const response=currentResponse();
    if(!response.locked){submitCurrentAnswer();return;}
    if(index===active.items.length-1){submit(false);return;}
    move(1);
  }

  setModeControls();
  restoreActiveMetadata();

  $('customize-btn').addEventListener('click',setModeControls);
  $('save-customize').addEventListener('click',saveMode);

  $('start-btn').onclick=()=>{
    originalStartNew();
    if(!active)return;
    active.mode=configuredMode();
    Object.values(active.responses).forEach(response=>{response.locked=false;});
    saveState();
    renderQuestion();
  };

  $('next-btn').onclick=practiceNext;

  renderQuestion=function(){
    originalRenderQuestion();
    const locked=isPractice()&&Boolean(currentResponse().locked);
    document.querySelectorAll('#options input[name="answer"]').forEach(input=>{input.disabled=locked;});
    showFeedback();
    updatePracticeControls();
  };

  renderResults=function(result){
    originalRenderResults(result);
    const mode=result.runMode==='practice'?'Practice':'Exam';
    $('score-card').insertAdjacentHTML('beforeend',`<p><strong>Run mode:</strong> ${mode}</p>`);
  };

  submit=function(expired){
    const mode=activeMode();
    originalSubmit(expired);
    if(active||!currentResult)return;
    currentResult.runMode=mode;
    const stored=state.attempts[state.attempts.length-1];
    if(stored?.id===currentResult.id)stored.runMode=mode;
    saveState();
    renderResults(currentResult);
  };

  buildRunExportRecord=function(result,exportedAt){
    const record=originalBuildRunExportRecord(result,exportedAt);
    record.run.mode=result.runMode==='practice'?'practice':'exam';
    return record;
  };

  if(active)renderQuestion();
})();
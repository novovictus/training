(()=>{
  const settingKey=`secai-plus-answer-reveal:${bankConfig.bankId}`;
  const checkbox=$('enable-answer-reveal');
  const controls=$('answer-reveal-controls');
  const revealButton=$('reveal-answer-btn');
  const revealBox=$('answer-reveal');

  function isEnabled(){return localStorage.getItem(settingKey)==='true';}

  function saveSetting(){
    localStorage.setItem(settingKey,String(checkbox.checked));
    updateVisibility();
  }

  function updateVisibility(){
    controls.hidden=!isEnabled();
    if(controls.hidden)resetReveal();
  }

  function resetReveal(){
    revealBox.hidden=true;
    revealBox.textContent='';
    revealButton.disabled=false;
    document.querySelectorAll('#options .option').forEach(option=>option.classList.remove('answer-correct','answer-incorrect'));
  }

  function revealAnswer(){
    if(!active||!isEnabled())return;
    const item=currentItem();
    const question=currentQuestion();
    const response=currentResponse();
    const correctDisplayed=displayedLetter(item,question.answer);
    const selectedDisplayed=response.answer?displayedLetter(item,response.answer):null;
    const selectedText=!response.answer
      ?'No answer selected.'
      :response.answer===question.answer
        ?`Your answer ${selectedDisplayed} is correct.`
        :`Your answer ${selectedDisplayed} is incorrect.`;

    revealBox.innerHTML=`<strong>Correct answer: ${escapeHtml(correctDisplayed)}. ${escapeHtml(question.options[question.answer])}</strong><br>${escapeHtml(selectedText)}`;
    revealBox.hidden=false;
    revealButton.disabled=true;

    document.querySelectorAll('#options .option').forEach(option=>{
      const input=option.querySelector('input[name="answer"]');
      if(!input)return;
      option.classList.toggle('answer-correct',input.value===question.answer);
      option.classList.toggle('answer-incorrect',Boolean(response.answer)&&input.value===response.answer&&response.answer!==question.answer);
    });
  }

  checkbox.checked=isEnabled();
  updateVisibility();
  revealButton.addEventListener('click',revealAnswer);
  $('save-customize').addEventListener('click',saveSetting);
  $('customize-btn').addEventListener('click',()=>{checkbox.checked=isEnabled();});
  $('options').addEventListener('change',resetReveal);

  const baseRenderQuestion=renderQuestion;
  renderQuestion=function(){
    baseRenderQuestion();
    resetReveal();
    updateVisibility();
  };
})();

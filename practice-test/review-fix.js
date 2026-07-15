renderResults=function(result){
  showView('results-view');
  const unanswered=result.items.filter(item=>!item.answer).length;
  const newlyMastered=result.items.filter(item=>item.newlyMastered).length;
  $('score-card').innerHTML=`<div class="score-number">${result.percent}%</div><p>${result.correct} of ${result.total} correct · ${formatDuration(result.durationSeconds)} · ${unanswered} unanswered · ${newlyMastered} newly mastered</p>`;
  const mastered=bank.filter(question=>masteryFor(question.id).mastered).length;
  $('readiness-card').innerHTML=`<strong>${mastered} of ${bank.length} mastered</strong><br>A question is mastered after three correct completions.`;

  const review=result.items
    .filter(item=>item.answer||item.flagged||item.confidence!==null)
    .sort((a,b)=>a.number-b.number);

  $('review-list').innerHTML=review.length
    ?`<h2>Review queue</h2>${review.map(item=>{
      const status=!item.answer?'Not answered':item.correct?'Correct':'Incorrect';
      const statusClass=item.correct?'correct':item.answer?'incorrect':'';
      return `<article class="review-item"><h3>Question ${item.number} · ${item.id}: <span class="${statusClass}">${status}</span></h3><p>${escapeHtml(item.stem)}</p><p>Your answer: <strong>${item.displayedAnswer||'Unanswered'}</strong> · Correct answer: <strong>${item.displayedCorrectAnswer}</strong> · Confidence: <strong>${item.confidence??'Not set'}</strong></p><p><strong>Target:</strong> ${escapeHtml(item.target)}</p></article>`;
    }).join('')}`
    :'<p>No answered, flagged, or confidence-marked questions to review.</p>';
};

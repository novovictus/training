const STORAGE_KEY='secai-plus-test-engine-v2';
const $=id=>document.getElementById(id);
const views=['start-view','exam-view','results-view','progress-view'];
const bank=window.SECAI_QUESTION_BANK||[];
let state=loadState();
let active=state.activeAttempt;
let index=0;
let ticker=null;

function defaultState(){return{version:2,settings:{questionCount:60,durationMinutes:60,includeMastered:false},
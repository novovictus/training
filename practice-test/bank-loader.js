(()=>{
  const BASE_STORAGE_KEY='secai-plus-test-engine-v2';
  const SELECTED_BANK_KEY='secai-plus-selected-bank';
  const BANKS=[
    {id:'secai-plus-cy0-001-v2',version:'2.0.0',title:'Diagnostic v2',questionCount:60,source:'questions.js'},
    {id:'secai-plus-cy0-001-minimal-independent-v1',version:'1.0.0',title:'Minimal Independent v1',questionCount:60,source:'../test-banks/secai-plus-minimal-independent-bank-v1.js'}
  ];
  const selected=BANKS.find(bank=>bank.id===localStorage.getItem(SELECTED_BANK_KEY))||BANKS[0];
  const scopedKey=id=>`${BASE_STORAGE_KEY}:${id}`;

  function archiveCurrent(){
    const raw=localStorage.getItem(BASE_STORAGE_KEY);
    if(raw)localStorage.setItem(scopedKey(selected.id),raw);
  }

  function activateSelectedState(){
    const scoped=localStorage.getItem(scopedKey(selected.id));
    if(scoped){localStorage.setItem(BASE_STORAGE_KEY,scoped);return;}
    const legacy=localStorage.getItem(BASE_STORAGE_KEY);
    if(!legacy)return;
    try{
      const parsed=JSON.parse(legacy);
      if(parsed?.bankId===selected.id)localStorage.setItem(scopedKey(selected.id),legacy);
      else localStorage.removeItem(BASE_STORAGE_KEY);
    }catch{localStorage.removeItem(BASE_STORAGE_KEY);}
  }

  function selectBank(bankId){
    const next=BANKS.find(bank=>bank.id===bankId);
    if(!next||next.id===selected.id)return false;
    archiveCurrent();
    localStorage.setItem(SELECTED_BANK_KEY,next.id);
    const nextState=localStorage.getItem(scopedKey(next.id));
    if(nextState)localStorage.setItem(BASE_STORAGE_KEY,nextState);
    else localStorage.removeItem(BASE_STORAGE_KEY);
    location.reload();
    return true;
  }

  activateSelectedState();
  localStorage.setItem(SELECTED_BANK_KEY,selected.id);
  addEventListener('pagehide',archiveCurrent);
  window.SECAI_BANKS={banks:BANKS.map(bank=>({...bank})),selected:{...selected},selectBank,archiveCurrent};
  document.write(`<script src="${selected.source}"><\/script>`);
})();

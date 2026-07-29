(()=>{
  const BASE_STORAGE_KEY='secai-plus-test-engine-v2';
  const SELECTED_SOURCE_KEY='secai-plus-selected-bank-source';
  const CUSTOM_BANK_KEY='secai-plus-custom-bank';
  const BUNDLED_BANK={id:'secai-plus-cy0-001-v2',version:'2.0.0',title:'Diagnostic v2',questionCount:60,source:'questions.js',kind:'bundled'};
  const scopedKey=id=>`${BASE_STORAGE_KEY}:${id}`;

  function readCustomBank(){
    try{
      const parsed=JSON.parse(localStorage.getItem(CUSTOM_BANK_KEY));
      return validBankShape(parsed)?parsed:null;
    }catch{return null;}
  }

  function validBankShape(bank){
    return Boolean(bank&&typeof bank==='object'&&bank.schemaVersion===1&&typeof bank.bankId==='string'&&bank.bankId.trim()&&typeof bank.bankVersion==='string'&&bank.bankVersion.trim()&&typeof bank.title==='string'&&bank.title.trim()&&Array.isArray(bank.questions)&&bank.questions.length);
  }

  const customBank=readCustomBank();
  const useCustom=localStorage.getItem(SELECTED_SOURCE_KEY)==='custom'&&customBank;
  const selected=useCustom?{id:customBank.bankId,version:customBank.bankVersion,title:customBank.title,questionCount:customBank.questions.length,kind:'custom'}:BUNDLED_BANK;

  function archiveCurrent(){
    const raw=localStorage.getItem(BASE_STORAGE_KEY);
    if(raw)localStorage.setItem(scopedKey(selected.id),raw);
  }

  function activateState(bankId){
    const scoped=localStorage.getItem(scopedKey(bankId));
    if(scoped){localStorage.setItem(BASE_STORAGE_KEY,scoped);return;}
    const legacy=localStorage.getItem(BASE_STORAGE_KEY);
    if(!legacy)return;
    try{
      const parsed=JSON.parse(legacy);
      if(parsed?.bankId===bankId)localStorage.setItem(scopedKey(bankId),legacy);
      else localStorage.removeItem(BASE_STORAGE_KEY);
    }catch{localStorage.removeItem(BASE_STORAGE_KEY);}
  }

  function switchToCustom(bank){
    if(!validBankShape(bank))throw new Error('Selected file does not contain a valid question bank.');
    archiveCurrent();
    localStorage.setItem(CUSTOM_BANK_KEY,JSON.stringify(bank));
    localStorage.setItem(SELECTED_SOURCE_KEY,'custom');
    activateState(bank.bankId);
    location.reload();
  }

  function useBundled(){
    if(selected.kind==='bundled')return false;
    archiveCurrent();
    localStorage.setItem(SELECTED_SOURCE_KEY,'bundled');
    activateState(BUNDLED_BANK.id);
    location.reload();
    return true;
  }

  activateState(selected.id);
  addEventListener('pagehide',archiveCurrent);
  window.SECAI_BANKS={selected:{...selected},switchToCustom,useBundled,archiveCurrent,validBankShape};
  if(useCustom)window.SECAI_QUESTION_BANK=customBank;
  else document.write(`<script src="${BUNDLED_BANK.source}"><\/script>`);
})();

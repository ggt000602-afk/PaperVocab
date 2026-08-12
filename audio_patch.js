(function(){
  function pvSpeak(text){
    if(!text) return;
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='en-US';
      try{u.rate=(typeof settings==='function'&&settings().ttsRate)||0.78}catch(e){u.rate=0.78}
      const voices=window.speechSynthesis.getVoices();
      const en=voices.find(v=>/^en-US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
      if(en) u.voice=en;
      window.speechSynthesis.speak(u);
    }catch(e){console.warn('TTS failed',e)}
  }
  window.pvSpeak=pvSpeak;

  function enhanceStudy(){
    const view=document.querySelector('#view');
    if(!view) return;
    const cards=[...view.querySelectorAll('.study-card,.flash-card,.card')];
    cards.forEach(card=>{
      if(card.querySelector('.pv-inline-audio')) return;
      const textEls=[...card.querySelectorAll('h1,h2,h3,strong,.term,.study-term')];
      let termEl=textEls.find(el=>{
        const t=(el.textContent||'').trim();
        return t && (window.WORDS||[]).some(w=>w.term===t||t.startsWith(w.term));
      });
      if(!termEl){
        termEl=textEls.find(el=>/[A-Za-z]{3}/.test(el.textContent||''));
      }
      if(!termEl) return;
      const raw=(termEl.textContent||'').trim();
      let spoken=raw.replace(/\s*\([A-Z]{2,8}\)\s*$/,'').trim();
      const w=(window.WORDS||[]).find(x=>raw===x.term||raw.startsWith(x.term)||spoken===x.term);
      if(w) spoken=w.term;
      const row=document.createElement('div');
      row.className='pv-inline-audio';
      row.style.cssText='display:flex;justify-content:center;gap:10px;margin:18px 0 2px;flex-wrap:wrap';
      const b=document.createElement('button');
      b.type='button';
      b.textContent='🔊 발음 듣기';
      b.style.cssText='border:1px solid #7c3aed;background:#24123d;color:#f3e8ff;border-radius:999px;padding:11px 18px;font-weight:700;font-size:15px';
      b.addEventListener('click',e=>{e.stopPropagation();pvSpeak(spoken)});
      row.appendChild(b);
      if(w&&w.example){
        const ebtn=document.createElement('button');
        ebtn.type='button';
        ebtn.textContent='🔊 예문 듣기';
        ebtn.style.cssText=b.style.cssText;
        ebtn.addEventListener('click',e=>{e.stopPropagation();pvSpeak(w.example)});
        row.appendChild(ebtn);
      }
      const ko=card.querySelector('.ko-pron,.big-pron,.pron-line');
      (ko||termEl).insertAdjacentElement('afterend',row);
    });
  }

  document.addEventListener('click',()=>setTimeout(enhanceStudy,40),true);
  const obs=new MutationObserver(()=>enhanceStudy());
  const target=document.querySelector('#view');
  if(target) obs.observe(target,{childList:true,subtree:true});
  window.addEventListener('load',()=>{window.speechSynthesis.getVoices();enhanceStudy()});
  setTimeout(enhanceStudy,250);
})();
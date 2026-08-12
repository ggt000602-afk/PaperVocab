(function(){
  const DAY=86400000;
  let autoTimer=null;
  let lastAutoTerm='';

  function pvDueQueue(){
    const set=settings(), p=progress(), now=Date.now();
    const active=activeUniverse().filter(w=>!p[w.term]?.mastered);
    const overdue=active.filter(w=>p[w.term]?.next!=null && p[w.term].next<=now)
      .sort((a,b)=>(p[a.term]?.next||0)-(p[b.term]?.next||0));
    const recovered=active.filter(w=>p[w.term] && p[w.term].next==null && !overdue.includes(w));
    const fresh=active.filter(w=>!p[w.term]).slice(0,set.newLimit);
    const seen=new Set(), out=[];
    for(const w of [...overdue,...recovered,...fresh]){
      if(!seen.has(w.term)){
        out.push(w); seen.add(w.term);
        if(out.length>=set.dailyLimit) break;
      }
    }
    return out;
  }
  window.pvDueQueue=pvDueQueue;

  function resetReviewSession(){
    S._reviewSession=null;
    S._reviewSessionKey=null;
    S._reviewSessionTotal=0;
    S._reviewDone=0;
    S._reviewSessionComplete=false;
    S.answer=false;
    S.current=0;
    lastAutoTerm='';
  }
  window.pvResetReviewSession=resetReviewSession;

  const originalStartMode=window.startMode;
  if(typeof originalStartMode==='function'){
    window.startMode=function(m){
      if(m==='review') resetReviewSession();
      return originalStartMode(m);
    };
  }

  function ensureSession(){
    const key=S.paperStudy||'__all__';
    if(S._reviewSessionKey!==key){
      resetReviewSession();
      S._reviewSessionKey=key;
    }
    if(S._reviewSessionComplete) return [];
    if(!Array.isArray(S._reviewSession)){
      const q=pvDueQueue();
      S._reviewSession=q.map(w=>w.term);
      S._reviewSessionTotal=S._reviewSession.length;
      S._reviewDone=0;
    }
    S._reviewSession=S._reviewSession.filter(t=>{
      const w=WORDS.find(x=>x.term===t);
      return w && !isMastered(w);
    });
    return S._reviewSession;
  }

  window.reviewStudy=function(){
    const session=ensureSession();
    if(!session.length){
      return `<div class="empty card study-done"><div class="done-icon">✓</div><h2>복습 큐 완료</h2><p>이번 학습 세션의 단어를 모두 처리했습니다.</p>${S.paperStudy?'<button class="btn secondary" onclick="S.paperStudy=null;pvResetReviewSession();render()">논문 필터 해제</button>':''}</div>`;
    }
    const w=WORDS.find(x=>x.term===session[0]);
    if(!w){ session.shift(); return reviewStudy(); }
    const idx=WORDS.indexOf(w);
    const done=S._reviewDone||0, total=Math.max(1,S._reviewSessionTotal||session.length);
    const pos=Math.min(total,done+1);
    return `${S.paperStudy?`<div class="filter-banner compact-filter"><span>논문 전용 복습</span><button onclick="S.paperStudy=null;pvResetReviewSession();render()">해제</button></div>`:''}<div class="study-head"><span>${pos}/${total}</span><span>${escapeHtml(w.category)}</span></div><div class="progress"><div style="width:${pos/total*100}%"></div></div><div class="card study-card" data-study-term="${escapeHtml(w.term)}" onclick="S.answer=true;render()"><span class="study-label">단어</span><h2>${escapeHtml(w.term)}</h2>${settings().showIPA&&w.pronunciation?`<div class="pron">${escapeHtml(w.pronunciation)}</div>`:''}${settings().showKoreanPron&&w.koreanPronunciation?`<div class="ko-pron big-pron">[${escapeHtml(w.koreanPronunciation)}]</div>`:''}${S.answer?`<div class="answer"><h3>${escapeHtml(w.korean)}</h3><p>${escapeHtml(w.meaning)}</p><div class="example-mini">${escapeHtml(w.example)}</div><div class="translation">${escapeHtml(w.translation)}</div></div>`:'<div class="tap-hint">카드를 탭하면 답이 표시됩니다</div>'}</div>${S.answer?`<div class="review-grid"><button onclick="grade(0)">다시<small>10분</small></button><button onclick="grade(1)">어려움<small>1일</small></button><button onclick="grade(2)">보통<small>간격 증가</small></button><button onclick="grade(3)">쉬움<small>큰 간격</small></button></div><button class="btn master wide compact-master" onclick="masterFromStudy(${idx})">✓ 완전 암기</button>`:`<button class="btn primary wide compact-answer" onclick="S.answer=true;render()">정답 보기</button>`}`;
  };

  window.grade=function(q){
    const session=ensureSession();
    if(!session.length) return;
    const term=session[0], w=WORDS.find(x=>x.term===term);
    if(!w){session.shift();render();return;}
    updateReview(w,q);
    session.shift();
    S._reviewDone=(S._reviewDone||0)+1;
    S.answer=false;
    if(!session.length) S._reviewSessionComplete=true;
    render();
  };

  window.masterFromStudy=function(i){
    const w=WORDS[i]; if(!w) return;
    const p=progress(),o=p[w.term]||{mastery:0,seen:0,wrong:0,correct:0};
    p[w.term]={...o,mastered:true,next:null,masteredAt:Date.now(),seen:(o.seen||0)+1,correct:(o.correct||0)+1};
    saveProgress(p);recordStudyDay();
    const session=ensureSession();
    const at=session.indexOf(w.term); if(at>=0) session.splice(at,1);
    S._reviewDone=(S._reviewDone||0)+1;
    S.answer=false;
    if(!session.length) S._reviewSessionComplete=true;
    render();
  };

  function updateStudyBodyState(){
    document.body.classList.toggle('pv-study-active',S.tab==='study');
    document.body.classList.toggle('pv-review-active',S.tab==='study'&&S.studyMode==='review');
  }

  function scheduleAutoPronunciation(){
    updateStudyBodyState();
    if(!(S.tab==='study'&&S.studyMode==='review')) return;
    const card=document.querySelector('.study-card[data-study-term]');
    if(!card) return;
    const term=card.dataset.studyTerm||'';
    if(!term||term===lastAutoTerm) return;
    lastAutoTerm=term;
    clearTimeout(autoTimer);
    autoTimer=setTimeout(()=>{
      if(S.tab==='study'&&S.studyMode==='review'&&document.querySelector(`.study-card[data-study-term="${CSS.escape(term)}"]`)){
        if(typeof window.pvSpeak==='function') window.pvSpeak(term); else if(typeof speak==='function') speak(term);
      }
    },300);
  }

  document.addEventListener('pointerdown',()=>{
    try{ window.speechSynthesis.getVoices(); }catch(e){}
  },{once:true,capture:true});

  const view=document.querySelector('#view');
  if(view){
    const observer=new MutationObserver(()=>requestAnimationFrame(scheduleAutoPronunciation));
    observer.observe(view,{childList:true,subtree:true});
  }
  window.addEventListener('load',()=>setTimeout(scheduleAutoPronunciation,80));
})();
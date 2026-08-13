(function(){
  S.categoryStudy=S.categoryStudy||null;

  const baseActiveUniverse=window.activeUniverse;
  window.activeUniverse=function(){
    if(S.categoryStudy) return WORDS.filter(w=>w.category===S.categoryStudy);
    if(S.paperStudy) return paperWords(S.paperStudy);
    return WORDS;
  };

  window.startCategoryStudy=function(category){
    S.categoryStudy=category;
    S.paperStudy=null;
    S.studyMode='review';
    S.answer=false;
    if(typeof window.pvResetReviewSession==='function') window.pvResetReviewSession();
    setTab('study');
  };

  window.clearCategoryStudy=function(){
    S.categoryStudy=null;
    if(typeof window.pvResetReviewSession==='function') window.pvResetReviewSession();
    render();
  };

  window.continueReview=function(){
    if(typeof window.pvResetReviewSession==='function') window.pvResetReviewSession();
    S._reviewSessionComplete=false;
    S.answer=false;
    render();
  };

  function remainingStudyCount(){
    const p=progress(), now=Date.now();
    return activeUniverse().filter(w=>!p[w.term]?.mastered).length;
  }

  const originalReviewStudy=window.reviewStudy;
  window.reviewStudy=function(){
    let html=originalReviewStudy();
    const isDone=html.includes('복습 큐 완료');
    if(isDone){
      const remain=remainingStudyCount();
      if(remain>0){
        html=html.replace('</div>',`<button class="btn primary wide continue-review-btn" onclick="continueReview()">계속 학습하기</button><p class="continue-note">남은 학습 대상 ${remain}개 · 다음 묶음을 이어서 불러옵니다.</p></div>`);
      }
      return html;
    }
    if(S.categoryStudy){
      html=`<div class="filter-banner category-study-banner"><span>${escapeHtml(S.categoryStudy)} 전용 학습</span><button onclick="clearCategoryStudy()">전체로</button></div>`+html;
    }
    return html;
  };

  const originalWordsView=window.wordsView;
  window.wordsView=function(){
    let html=originalWordsView();
    if(S.selected!==null) return html;
    if(S.category && S.category!=='전체'){
      const count=WORDS.filter(w=>w.category===S.category&&!isMastered(w)).length;
      const panel=`<div class="category-study-panel"><div><b>${escapeHtml(S.category)}</b><span>이 카테고리만 모아서 학습할 수 있습니다.</span></div><button class="btn primary" onclick="startCategoryStudy(${JSON.stringify(S.category)})">이 카테고리 학습 시작 · ${count}개</button></div>`;
      const marker='<div class="list-count">';
      const pos=html.indexOf(marker);
      if(pos>=0) html=html.slice(0,pos)+panel+html.slice(pos);
      else html=panel+html;
    }
    return html;
  };

  window.wordCard=function(w,i,p,f){
    const r=p[w.term]||{};
    return `<button class="word-card compact-word-card" onclick="openWord(${i})"><div class="compact-word-main"><strong class="compact-term">${escapeHtml(w.term)}</strong><span class="compact-meaning">${escapeHtml(w.korean)}</span></div><div class="compact-word-status">${r.mastered?'<span>✓ 암기</span>':''}${f.includes(w.term)?'<span>★</span>':''}${r.wrong?`<span>어려움 ${r.wrong}</span>`:''}</div></button>`;
  };

  const originalOpenMode=window.openMode;
  window.openMode=function(m){
    S.categoryStudy=null;
    return originalOpenMode(m);
  };

  const originalSetTab=window.setTab;
  window.setTab=function(t){
    if(t!=='study' && t!=='words') S.categoryStudy=null;
    return originalSetTab(t);
  };
})();
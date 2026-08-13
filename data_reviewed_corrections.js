(()=>{
const norm=s=>(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const REMOVE=new Set(['respect to']);
window.WORDS=(window.WORDS||[]).filter(w=>!REMOVE.has(norm(w.term)));
const C={
'critical heat flux (chf)':{korean:'임계열유속 (CHF)',meaning:'핵비등 상태에서 가열면이 안정적으로 열을 제거할 수 있는 한계 열유속. 이를 넘으면 건조 영역 또는 증기막이 급격히 발달해 가열면 온도가 크게 상승할 수 있다.',translation:'임계열유속은 풀비등에서 핵비등 열전달의 한계를 나타내는 핵심 열유속이다.'},
'heat flux':{meaning:'단위 면적을 통해 단위 시간에 전달되는 열량. 일반적으로 q″ [W/m²]로 나타낸다.'},
'heat transfer coefficient':{meaning:'대류·비등 열전달에서 열유속을 구동 온도차로 나눈 값. 풀비등에서는 보통 h=q″/(T_w-T_sat)로 정의한다.'},
'wall superheat':{korean:'벽면 과열도',meaning:'가열면 온도와 해당 압력에서의 포화온도의 차이, ΔT_sat=T_w-T_sat.'},
'boiling crisis':{korean:'비등 위기',meaning:'핵비등에서 고효율 액체 냉각이 붕괴하고 가열면의 건조 또는 증기막 형성이 급격히 진행되는 전이 현상. 풀비등에서는 보통 CHF와 연관된다.'},
'incipient boiling':{korean:'비등 개시',meaning:'가열면에서 지속적인 기포 핵생성이 처음 나타나기 시작하는 상태 또는 그 조건.'},
'preboiling regime':{korean:'비등 개시 전 영역',meaning:'가열면에서 지속적인 핵비등이 시작되기 전의 열전달 영역.'},
'onset of nucleate boiling':{korean:'핵비등 개시 (ONB)',meaning:'가열면의 활성 핵생성 지점에서 지속적인 기포 생성이 시작되는 조건.'},
'transition boiling':{meaning:'CHF와 최소열유속 사이에서 액체 접촉 영역과 증기막 영역이 시간·공간적으로 공존하며 매우 불안정한 열전달이 나타나는 비등 영역.'},
'partial film boiling':{korean:'부분 막비등',meaning:'가열선 또는 가열면의 일부는 막비등, 다른 일부는 핵비등 또는 젖은 상태로 공존하는 상태.',translation:'같은 와이어에서도 일부 구간은 막비등, 다른 구간은 핵비등 상태로 공존할 수 있다.'},
'mixed boiling':{korean:'혼합 비등',meaning:'하나의 가열면에서 서로 다른 비등 양식(예: 핵비등과 막비등)이 공간적으로 동시에 존재하는 상태.'},
'film boiling':{meaning:'가열면과 액체 사이에 연속적인 증기막이 형성되어 직접 액체 접촉이 크게 억제되는 비등 영역.'},
'vapor sheath':{korean:'증기 피복(증기 시스)',meaning:'가열선 주위를 연속적 또는 준연속적으로 둘러싸는 증기층 또는 증기막.'},
'dryout':{korean:'건조(드라이아웃)',meaning:'가열면을 덮던 액체막 또는 액체 접촉이 소실되어 표면이 국부적 또는 광범위하게 건조되는 현상.'},
'rewetting':{korean:'재젖음',meaning:'건조되었거나 증기막으로 덮였던 가열면에 액체가 다시 접촉하여 젖은 상태가 회복되는 과정.'},
'cold-end effect':{korean:'끝단 냉각 효과 (cold-end effect)',meaning:'얇은 가열선의 끝단이 저온 리드·전극·지지대로 열을 전도해 중앙부보다 낮은 온도를 갖게 되는 끝단 열손실 효과.'},
'effective heated length':{korean:'유효 가열 길이',meaning:'전압강하, 저항, 열유속 등 시험부 물리량을 정의할 때 실제 계산에 사용하는 가열선의 유효 길이. 전체 기계적 고정 길이와 다를 수 있다.'},
'potential tap':{korean:'전압 탭(전위 탭)',meaning:'가열선의 특정 구간 전압강하를 측정하기 위해 연결하는 고임피던스 전압 센싱 접점. 이상적으로는 측정 전류가 매우 작다.'},
'current lead':{korean:'전류 리드',meaning:'가열선에 시험 전류를 공급하는 전력 도선 또는 전류 접점.'},
'lead-line conduction':{korean:'리드선 전도 열손실',meaning:'가열선에서 리드선·전극 방향으로 축방향 열전도에 의해 빠져나가는 열.'},
'support heat loss':{korean:'지지대 방향 열손실',meaning:'가열선에서 지지대나 접속부로 전도되어 시험 유체로 전달되지 않는 열.'},
'axial temperature gradient':{korean:'축방향 온도구배',meaning:'와이어 길이 방향 좌표 x에 따른 온도 변화율 dT/dx.'},
'axial conduction':{korean:'축방향 열전도',meaning:'와이어 또는 고체 내부에서 길이 방향으로 일어나는 열전도.'},
'radial conduction':{korean:'반경방향 열전도',meaning:'원통형 물체의 반경 방향으로 일어나는 열전도.'},
'temperature excursion':{korean:'온도 급변(temperature excursion)',meaning:'정상적인 변동 범위를 벗어나 온도가 짧은 시간에 크게 상승하거나 변화하는 현상. 문맥에 따라 급상승을 뜻할 수 있다.'},
'temperature overshoot':{korean:'온도 오버슈트(과도 초과)',meaning:'과도 응답 중 온도가 최종 정상값 또는 목표값을 일시적으로 초과하는 현상.'},
'temperature disturbance':{korean:'온도 교란',meaning:'공간적·시간적으로 형성된 국부 온도 편차가 감쇠하거나 성장·전파하는 현상.'},
'thermal stability':{korean:'열적 안정성',meaning:'작은 온도 또는 열유속 교란이 시간이 지나며 감쇠해 원래 상태로 돌아가는지, 반대로 성장해 다른 열전달 상태로 전이하는지를 나타내는 안정성.'},
'bifurcation point':{korean:'분기점',meaning:'시스템 매개변수 변화에 따라 정상상태 해의 개수나 안정성이 질적으로 바뀌는 임계점.'},
'thermal runaway':{korean:'열폭주',meaning:'온도 상승이 발열 증가 또는 냉각 성능 저하를 유발하고, 그 결과 추가 온도 상승이 발생하는 양의 되먹임 과정.'},
'current crowding':{korean:'전류 집중',meaning:'기하학적 단면 변화나 전류 접촉부 부근에서 전류밀도가 국부적으로 집중되는 현상.'},
'contact resistance':{korean:'접촉저항',meaning:'두 전기 도체의 실제 접촉면에서 전류가 통과할 때 나타나는 추가 전기저항. 순수 전압 센싱 접점에서는 센싱 전류가 매우 작아 이 저항에 의한 발열도 일반적으로 매우 작다.'},
'constriction resistance':{korean:'수축저항',meaning:'전류가 넓은 도체에서 작은 실제 접촉점으로 수렴·확산할 때 생기는 접촉저항 성분.'},
'stress concentration':{korean:'응력집중',meaning:'노치, 흠집, 단면 급변, 클램프 가장자리 등 기하학적 불연속 부근에서 평균 응력보다 큰 국부 응력이 발생하는 현상.'},
'thermal contraction mismatch':{korean:'열수축 불일치',meaning:'서로 다른 재료의 열팽창계수 차이 때문에 냉각 시 수축량이 달라져 변형 또는 열응력이 생기는 현상.'},
'thermal stress':{korean:'열응력',meaning:'온도 변화 또는 온도구배에 의한 열팽창·수축이 구속될 때 재료에 발생하는 응력.'},
'clamping force':{korean:'클램핑 힘(체결력)',meaning:'와이어나 시험편을 지지부에 눌러 고정하는 힘. 과도하면 소구경 와이어에 국부 변형이나 흠집을 만들 수 있다.'},
'notch effect':{korean:'노치 효과',meaning:'홈, 흠집 또는 급격한 단면 변화가 응력집중을 유발해 균열 또는 파단 개시를 촉진하는 효과.'},
'normal boiling point':{korean:'정상비점(1 atm 비점)',meaning:'압력이 표준 대기압 1 atm일 때 액체의 포화온도.'},
'subcooled liquid':{korean:'과냉각 액체',meaning:'주어진 압력의 포화온도보다 낮은 온도에 있는 액체.'},
'thermal boundary layer':{korean:'열경계층',meaning:'고체 표면 인근에서 유체 온도가 벽면온도에서 벌크온도로 크게 변하는 얇은 영역.'},
'thermal penetration depth':{korean:'열침투 깊이',meaning:'과도 열전도에서 표면 온도 변화의 영향이 일정 시간 동안 고체 또는 유체 내부로 유의미하게 전달된 특성 깊이.'},
'heat capacity':{korean:'열용량',meaning:'물체의 온도를 1 K 변화시키는 데 필요한 열량. 비열과 질량의 곱으로 표현된다.'},
'volumetric heat capacity':{korean:'체적 열용량',meaning:'단위 체적의 온도를 1 K 변화시키는 데 필요한 열량으로, 보통 ρc_p로 나타낸다.'},
'bulk temperature':{korean:'벌크 유체 온도',meaning:'경계층 밖의 주 유동 또는 액체 벌크를 대표하는 평균 유체 온도.'},
'boil-off':{korean:'보일오프(증발 손실)',meaning:'외부 열유입 등으로 저장된 극저온 액체가 증발하여 기체로 빠져나가는 현상 또는 그 증발량.'},
'chill-down':{korean:'예냉(칠다운)',meaning:'극저온 유체를 공급하기 전에 배관·용기·시험부를 극저온에 가깝게 냉각하는 과도 냉각 과정.'},
'nomenclature':{korean:'기호 및 약어 목록',meaning:'논문에서 사용한 기호, 첨자, 약어와 그 정의 또는 단위를 정리한 목록.'},
'caption':{korean:'캡션(그림·표 설명문)',meaning:'그림이나 표의 번호, 제목 및 필요한 설명을 제공하는 문장 또는 짧은 문단.'},
'order of magnitude':{korean:'크기 차수(order of magnitude)',meaning:'어떤 양의 규모를 10의 거듭제곱 수준으로 나타내는 표현. 두 값의 크기 수준을 비교할 때 사용한다.'},
'full scale':{korean:'풀스케일(최대 범위)',meaning:'계측기의 지정 측정범위에서 상한에 해당하는 값 또는 전체 스팬.'},
'steady':{korean:'정상상태의; 일정한',meaning:'시간에 따른 변화가 없거나 무시할 수 있을 정도로 작은 상태를 뜻한다. 열전달에서는 보통 정상상태(steady-state)의 의미로 사용된다.'},
'unsteady':{korean:'비정상상태의; 시간변화가 있는',meaning:'온도, 열유속, 유동 등 관심 물리량이 시간에 따라 변하는 상태.'},
'correct':{korean:'수정하다; 보정하다',meaning:'오류를 바로잡는다는 뜻. 계측·데이터 문맥에서는 측정값에 보정값을 적용한다는 의미로도 사용된다.'},
'property':{korean:'물성; 특성',meaning:'대상의 성질을 나타내는 값 또는 특성. 열유체 문맥에서 fluid properties는 밀도, 점도, 표면장력, 비열 등의 물성을 뜻한다.'},
'behavior':{korean:'거동; 행동',meaning:'현상이나 시스템이 조건 변화에 따라 보이는 응답 또는 양상. 공학 논문에서는 보통 “거동”으로 번역한다.'},
'apparent':{korean:'겉보기의; 명백해 보이는',meaning:'실제로 내재된 값과 구별되는 관측·겉보기 특성을 뜻하거나, 문맥에 따라 “명백한”의 의미로도 쓰인다.'},
'reference':{korean:'참고문헌; 기준; 참조',meaning:'논문에서는 인용 문헌을 뜻하기도 하고, 비교·교정에 사용하는 기준값 또는 기준 대상을 뜻하기도 한다.'},
'regime':{korean:'영역; 지배 상태',meaning:'특정 물리 메커니즘이나 거동이 지배적인 조건 범위. boiling regime은 비등 양식 또는 비등 영역을 뜻한다.'},
'rate':{korean:'율; 속도',meaning:'단위 시간당 변화량을 뜻하는 경우가 많으며, 문맥에 따라 속도·율·비율로 번역한다.'},
'frequency':{korean:'빈도; 주파수',meaning:'주기 현상이 단위 시간에 반복되는 횟수. 반복 사건 문맥에서는 빈도, 주기 신호 문맥에서는 주파수로 번역한다.'},
'significance':{korean:'중요성; 유의성',meaning:'일반 문맥에서는 중요성, 통계 문맥에서는 통계적 유의성을 뜻한다.'},
'scatter':{korean:'산포',meaning:'반복 측정값이나 데이터 점들이 평균 또는 추세선 주변에 퍼져 있는 정도.'},
'baseline':{korean:'기준선; 기준 조건',meaning:'변화량이나 효과를 비교하기 위해 기준으로 삼는 값, 조건 또는 신호 수준.'},
'hysteresis':{korean:'이력현상(히스테리시스)',meaning:'현재 상태가 현재 입력뿐 아니라 과거의 변화 경로에도 의존하여 상승·하강 경로가 서로 달라지는 현상.'}
};
for(const w of window.WORDS){const p=C[norm(w.term)];if(p)Object.assign(w,p,{reviewed:true});}
// Fix a few repeatedly confusing example translations.
for(const w of window.WORDS){
 const k=norm(w.term);
 if(k==='be subjected to') w.korean='~을 받다; ~에 노출되다; ~을 가하다(수동형 문맥)';
 if(k==='be considered as') {w.korean='~로 간주되다';w.meaning='어떤 대상을 특정 개념·범주로 간주한다는 뜻. 현대 학술영어에서는 be considered + 명사/형용사 또는 be considered to be가 더 자연스러운 경우도 많다.';}
 if(k==='whereby') w.korean='그에 의해; 그 결과로';
 if(k==='thereof') w.korean='그것의; 그와 관련된';
 if(k==='possible' && w.korean==='가능하게는') w.korean='가능한';
}
})();
window.addBulkWords=function(text){
 const norm=s=>(s||'').toLowerCase().replace(/\s+/g,' ').trim();
 const existing=new Set((window.WORDS||[]).map(w=>norm(w.term)));
 const paperByCat={'Academic English':'Academic reading core','Data & Statistics':'Experimental methods / uncertainty literature','Heat Transfer':'Heat-transfer literature','Boiling':'Pool-boiling / CHF literature','Bubble Dynamics':'LN2 bubble-dynamics literature','Cryogenics':'Cryogenic boiling literature','Surface':'Surface-modified boiling literature','Experiment':'Experimental methods'};
 const phraseExamples={
  'with respect to':['The data were normalized with respect to the bare-surface value.','데이터는 베어 표면 값을 기준으로 정규화하였다.'],
  'with regard to':['With regard to uncertainty, the heat-flux error was evaluated separately.','불확도와 관련하여 열유속 오차를 별도로 평가하였다.'],
  'as a function of':['The detachment frequency was plotted as a function of heat flux.','이탈 빈도를 열유속의 함수로 도시하였다.'],
  'in accordance with':['The experiment was conducted in accordance with the established procedure.','실험은 확립된 절차에 따라 수행하였다.'],
  'in comparison with':['The modified surface showed a higher CHF in comparison with the bare surface.','개질 표면은 베어 표면과 비교하여 더 높은 CHF를 보였다.'],
  'be characterized by':['Transition boiling can be characterized by intermittent wetting and dryout.','전이비등은 간헐적 젖음과 건조로 특징지어질 수 있다.'],
  'be governed by':['Bubble departure can be governed by the balance of buoyancy and surface tension.','기포 이탈은 부력과 표면장력의 균형에 의해 지배될 수 있다.'],
  'be associated with':['The resistance excursion was associated with a rapid rise in heater temperature.','저항 급상승은 가열기 온도의 빠른 증가와 관련되었다.'],
  'be accompanied by':['CHF can be accompanied by a sharp increase in surface temperature.','CHF는 표면 온도의 급격한 상승을 동반할 수 있다.'],
  'be defined as':['Wall superheat is defined as the difference between wall and saturation temperatures.','벽면 과열도는 벽면 온도와 포화온도의 차이로 정의된다.'],
  'be expressed as':['Heat flux can be expressed as electrical power divided by heater area.','열유속은 전력을 가열면적으로 나눈 값으로 표현할 수 있다.'],
  'be derived from':['Surface temperature can be derived from the measured resistance after calibration.','교정 후 측정 저항으로부터 표면 온도를 유도할 수 있다.'],
  'be subjected to':['The wire was subjected to stepwise electrical heating.','와이어에 단계적 전기 가열을 가하였다.'],
  'be immersed in':['The test wire was immersed in saturated liquid nitrogen.','시험 와이어를 포화 액체질소에 침지하였다.'],
  'be maintained at':['The bath pressure was maintained at approximately atmospheric pressure.','액체조 압력은 대략 대기압으로 유지되었다.'],
  'be kept constant':['The immersion depth was kept constant for all tests.','모든 실험에서 침지 깊이를 일정하게 유지하였다.']
 };
 function meaning(k,c){if(c==='Academic English')return `논문에서 ‘${k}’의 의미로 자주 쓰이는 독해 핵심 표현.`;if(c==='Data & Statistics')return `실험 데이터의 ${k}을 정량적으로 해석하거나 보고할 때 사용하는 용어.`;if(c==='Heat Transfer')return `열전달 및 비등 해석에서 ${k}을 의미하는 핵심 용어.`;if(c==='Boiling')return `비등 현상에서 ${k}을 의미하는 핵심 용어.`;if(c==='Bubble Dynamics')return `기포 생성·성장·이탈 거동에서 ${k}을 의미하는 용어.`;if(c==='Cryogenics')return `극저온 시스템과 액체질소 실험에서 ${k}을 의미하는 용어.`;if(c==='Surface')return `표면개질·젖음성·미세구조 분석에서 ${k}을 의미하는 용어.`;return `실험장치·계측·데이터 획득에서 ${k}을 의미하는 용어.`}
 function example(t,k,c){if(phraseExamples[t])return phraseExamples[t];if(c==='Academic English')return [`The expression “${t}” is frequently encountered in experimental papers and should be interpreted from context.`,`이 표현은 실험 논문에서 자주 등장하며 문맥에 따라 ‘${k}’로 해석된다.`];if(c==='Data & Statistics')return [`The ${t} was evaluated from repeated experimental measurements.`,`반복 실험 측정값으로부터 ${k}을 평가하였다.`];if(c==='Experiment')return [`The ${t} was used or monitored during the liquid-nitrogen boiling experiment.`,`액체질소 비등 실험에서 ${k}을 사용하거나 모니터링하였다.`];if(c==='Surface')return [`The ${t} was examined to interpret the effect of surface modification on boiling.`,`표면 개질이 비등에 미치는 영향을 해석하기 위해 ${k}을 조사하였다.`];if(c==='Cryogenics')return [`The ${t} was considered when defining the cryogenic test condition.`,`극저온 시험 조건을 정의할 때 ${k}을 고려하였다.`];if(c==='Bubble Dynamics')return [`The ${t} was analyzed from high-speed images of the boiling surface.`,`비등 표면의 고속 영상으로부터 ${k}을 분석하였다.`];if(c==='Boiling')return [`The ${t} was examined as the heat flux approached the boiling crisis.`,`열유속이 비등 위기에 접근함에 따라 ${k}을 조사하였다.`];return [`The ${t} was included in the interpretation of the measured heat-transfer data.`,`측정 열전달 데이터를 해석할 때 ${k}을 고려하였다.`]}
 for(const raw of text.split('\n')){if(!raw.trim())continue;const [term,pronunciation,koreanPronunciation,korean,category]=raw.split('|');const key=norm(term);if(!term||existing.has(key))continue;const [ex,tr]=example(term,korean,category);window.WORDS.push({term,pronunciation:pronunciation||'',koreanPronunciation:koreanPronunciation||'',korean,meaning:meaning(korean,category),category,example:ex,translation:tr,collocations:[term],paper:paperByCat[category]||'Thesis reading core',sourceType:'독해 핵심',priority:category==='Academic English'?2:3});existing.add(key)}
};
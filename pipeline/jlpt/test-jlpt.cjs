// 日本語能力試験 화면 검사: 로마자→가나, 판정, 실제 화면 흐름(가나·로마자·한자 입력, 오답 따라쓰기).
// 사용: node pipeline/jlpt/test-jlpt.cjs   (먼저 python3 pipeline/jlpt/build.py)
const {chromium}=require('playwright');
const path=require('path');
const file='file://'+path.resolve(__dirname,'../../tangogoyangjlpt.html');
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('FAIL',m);}else console.log('ok  ',m);};
(async()=>{
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(file);await p.waitForTimeout(600);
  const roma=await p.evaluate(()=>Object.fromEntries(['taberu','kyou','gakkou','konnichiha','onna','shinbun',"kon'ya",'ko-hi-','chotto','shashin','jisho','tsukue','fuyu','denwa','kanji'].map(x=>[x,jpRomaToKana(x,true)])));
  const want={taberu:'たべる',kyou:'きょう',gakkou:'がっこう',konnichiha:'こんにちは',onna:'おんな',shinbun:'しんぶん',"kon'ya":'こんや','ko-hi-':'こーひー',chotto:'ちょっと',shashin:'しゃしん',jisho:'じしょ',tsukue:'つくえ',fuyu:'ふゆ',denwa:'でんわ',kanji:'かんじ'};
  for(const k in want)ok(roma[k]===want[k],`로마자 ${k} → ${roma[k]}`);
  ok(await p.evaluate(()=>jpRomaToKana('kan')==='かn'),'덜 친 n은 남긴다');
  ok(await p.evaluate(()=>normalize('コーヒー')===normalize('こおひい')),'장음 ー = 앞 모음');
  ok(await p.evaluate(()=>isSpellingVariant('こんにちわ','こんにちは')),'こんにちわ는 소리 변형');
  ok(await p.evaluate(()=>!Object.keys(localStorage).some(k=>/^goyang-/.test(k))),'보카고양 저장 키를 쓰지 않는다');
  const cards=await p.evaluate(()=>state.lessons.reduce((a,L)=>a+L.exercises.reduce((b,e)=>b+e.words.length,0),0));
  ok(cards>7000,`카드 ${cards}`);
  // 한자 표기 카드가 있는 연습에서 로마자로 맞히기
  const pos=await p.evaluate(()=>{for(let li=0;li<state.lessons.length;li++){const L=state.lessons[li];for(let ei=0;ei<L.exercises.length;ei++){const w=L.exercises[ei].words[0];if(w.jw!==w.term&&/[一-龯]/.test(w.jw)&&/^[ぁ-ゖ]+$/.test(w.term))return {li,ei};}}});
  await p.evaluate(({li,ei})=>{openLesson(li);startExercise(ei);},pos);await p.waitForTimeout(3000);
  const w=await p.evaluate(()=>{const s=state.session;return s.words[s.currentId]});
  const r=await p.evaluate(t=>{const rev={};for(const [k,v] of Object.entries(JP_ROMA))if(v.length<=2&&(!(v in rev)||k.length<rev[v].length))rev[v]=k;let out='',i=0;const h=t;while(i<h.length){const two=h.slice(i,i+2);if(two.length==2&&rev[two]){out+=rev[two];i+=2;continue;}const c=h[i];if(c==='っ'){out+=(rev[h[i+1]]||'x')[0];i++;continue;}if(c==='ん'){out+='nn';i++;continue;}out+=rev[c]||c;i++;}return out;},w.term);
  await p.focus('#ainput');for(const ch of r){await p.keyboard.type(ch);await p.waitForTimeout(10);}
  await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.querySelector('#ainput').classList.contains('ok')),`로마자 ${r} 로 ${w.term} 정답`);
  ok((await p.innerText('#reveal')).includes(w.jw),'정답 공개에 한자 표기');
  ok(await p.evaluate(()=>!!document.querySelector('#reveal ruby rt')),'후리가나');
  await p.evaluate(({li,ei})=>{startExercise(ei);},pos);await p.waitForTimeout(3000);
  const w2=await p.evaluate(()=>{const s=state.session;return s.words[s.currentId]});
  await p.focus('#ainput');await p.keyboard.type(w2.jw);await p.waitForTimeout(400);
  if(!(await p.evaluate(()=>state.session.answered)))await p.keyboard.press('Enter');await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelector('#ainput').classList.contains('ok')),`한자 ${w2.jw} 로 정답`);
  await p.evaluate(({li,ei})=>{startExercise(ei);},pos);await p.waitForTimeout(3000);
  await p.focus('#ainput');await p.keyboard.type('zzz');await p.keyboard.press('Enter');await p.waitForTimeout(400);
  ok(await p.evaluate(()=>state.session.copyMode),'오답이면 따라쓰기');
  // 최종 검수(26.11.06)에서 찾은 것: 한 자씩 칠 때 nn, tch, 한글 장음, は 변형, 히라가나 장음
  const step=await p.evaluate(()=>{const typeOne=(romaji,ans)=>{let v='';for(const ch of romaji){v=jpScriptLike(jpRomaToKana(v+ch,false,ans),ans);}return jpScriptLike(jpRomaToKana(v,true,ans),ans);};
    return [['minna','みんな'],['konnichiha','こんにちは'],['onna','おんな'],['konnya','こんや'],['kinnen','きんねん'],['shinnyuu','しんにゅう'],['matchi','マッチ'],['kotchi','こっち']].map(([r,a])=>[r,a,typeOne(r,a)]);});
  for(const [r,a,got] of step)ok(got===a,`한 자씩 ${r} → ${got}`);
  ok(await p.evaluate(()=>jpTentative('카-도','カード')==='カード'),'한글 카-도 → カード');
  ok(await p.evaluate(()=>jpTentative('츠즈쿠','つづく')==='つづく'&&jpTentative('스즈시이','すずしい')==='すずしい'),'한글 즈 → づ/ず 정답 쪽');
  ok(await p.evaluate(()=>jpRuby('差し上げる','さしあげる')==='<ruby>差<rt>さ</rt></ruby>し<ruby>上<rt>あ</rt></ruby>げる'),'후리가나는 한자마다');
  ok(await p.evaluate(()=>state.lessons.every(L=>L.exercises.every(e=>e.words.length>=5))),'1~4장짜리 연습이 없다');
  ok(await p.evaluate(()=>!isSpellingVariant('わ','は')&&!isSpellingVariant('とくわ','とくは')&&isSpellingVariant('こんばんわ','こんばんは')),'は→わ 변형은 인사말만');
  ok(await p.evaluate(()=>!isCorrect('おーきい','おおきい')&&isCorrect('こおひい','コーヒー')),'히라가나 말에 ー는 틀림, 가타카나 장음은 앞 모음');

  const hg=await p.evaluate(()=>[['타베루','たべる'],['갓코우','がっこう'],['가방','かばん'],['신분','しんぶん'],['쿄우','きょう'],['코-히-','コーヒー'],['츠쿠에','つくえ'],['파-티-','パーティー'],['깃푸','きっぷ']].map(([h,a])=>[h,a,jpScriptLike(jpRomaToKana(jpHangulToKana(h,a),true),a)]));
  for(const [h,a,r] of hg)ok(r===a,`한글 ${h} → ${r}`);
  const hpos=await p.evaluate(()=>{for(let li=0;li<state.lessons.length;li++){const L=state.lessons[li];for(let ei=0;ei<L.exercises.length;ei++){const i=L.exercises[ei].words.findIndex(w=>w.term==='おとな');if(i===0)return {li,ei};}}return null;});
  if(hpos){await p.evaluate(({li,ei})=>{openLesson(li);startExercise(ei);},hpos);await p.waitForTimeout(3000);
    await p.focus('#ainput');await p.keyboard.insertText('오토나');await p.waitForTimeout(400);
    ok(await p.evaluate(()=>document.querySelector('#ainput').classList.contains('ok')),'한글 오토나 로 おとな 정답');}
  ok(errs.length===0,'페이지 오류 없음 '+errs.join(' | '));
  // 漢字読み
  const p2=await b.newPage({viewport:{width:390,height:844}});p2.on('pageerror',e=>errs.push(e.message));
  await p2.goto('file://'+path.resolve(__dirname,'../../tangogoyangyomi.html'));await p2.waitForTimeout(600);
  ok(await p2.evaluate(()=>JP_MODE==='yomi'&&STORAGE.startsWith('tangogoyang-yomi-')),'漢字読み: 저장 키 따로');
  ok((await p2.innerText('#homeBubble')).includes('戦闘力'),'漢字読み: 첫 대사는 53만 패러디');
  ok(!/[가-힣]/.test(await p2.innerText('#homeBubble')),'漢字読み: 고양이는 일본어로만 말한다');
  ok(await p2.evaluate(()=>{const r=document.querySelector('#homeBubble .nm ruby');return !!r&&r.textContent.startsWith('高陽猫')&&r.querySelector('rt').textContent==='こねねこ';}),'漢字読み: 이름표 高陽猫(こねねこ)');
  ok(await p2.evaluate(()=>!/[가-힣]/.test(msLine(1000)+msLine(2500)+paceFill(PACE_LINES.regular.daily[0],{R:paceRange(3,5,true),T:'N4'}))),'漢字読み: 돌파·진도 대사도 일본어');
  ok(await p2.evaluate(()=>{const b=document.querySelector('#homeBubble');return b.scrollWidth<=b.clientWidth+1;}),'漢字読み: 말풍선이 넘치지 않는다');
  ok(await p2.evaluate(()=>state.lessons.every(L=>L.exercises.every(e=>e.words.every(w=>/[\u3400-\u9fff々]/.test(w.jw))))),'漢字読み: 모든 카드에 한자');
  await p2.evaluate(()=>{openLesson(0);startExercise(0);});await p2.waitForTimeout(3000);
  const y=await p2.evaluate(()=>{const s=state.session;return s.words[s.currentId]});
  ok((await p2.innerText('#meaning')).includes(y.jw),'漢字読み: 문제에 한자');
  await p2.focus('#ainput');await p2.keyboard.type(y.jw);await p2.keyboard.press('Enter');await p2.waitForTimeout(400);
  ok(await p2.evaluate(()=>state.session.copyMode),'漢字読み: 한자를 그대로 치면 오답');
  await p2.keyboard.type(y.term);await p2.waitForTimeout(400);
  ok(await p2.evaluate(()=>!state.session.copyMode),'漢字読み: 따라쓰기는 가나로');
  await p2.evaluate(()=>showRoar(1));ok(!/[가-힣]/.test(await p2.innerText('#roar')),'漢字読み: 포효도 일본어');
  ok(errs.length===0,'페이지 오류 없음(漢字読み) '+errs.join(' | '));
  // 五十音
  const p3=await b.newPage({viewport:{width:390,height:844}});p3.on('pageerror',e=>errs.push(e.message));
  await p3.goto('file://'+path.resolve(__dirname,'../../tangogoyanggojuon.html'));await p3.waitForTimeout(600);
  ok(await p3.evaluate(()=>JP_MODE==='kana'&&STORAGE.startsWith('tangogoyang-kana-')),'五十音: 저장 키 따로');
  const kg=await p3.evaluate(()=>[['ti','ティ'],['ji','ぢ'],['zu','づ'],['o','を'],['ka','カ']].map(([r,a])=>{let v='';for(const ch of r)v=jpScriptLike(jpRomaToKana(v+ch,false,a),a);return jpScriptLike(jpRomaToKana(v,true,a),a)===a;}));
  ok(kg.every(Boolean),'五十音: ti=ティ, ji=ぢ, zu=づ, o=を, ka=カ');
  ok(await p3.evaluate(()=>jpTentative('ㄴ','ん')==='ん'&&jpTentative('파','ファ')==='ファ'&&jpTentative('오','を')==='を'),'五十音: 한글 ㄴ=ん, 파=ファ, 오=を');
  await p3.evaluate(()=>{openLesson(0);startExercise(0);});await p3.waitForTimeout(3000);
  const kw=await p3.evaluate(()=>state.session.words[state.session.currentId]);
  ok(await p3.evaluate(jw=>{const q=document.querySelector('#meaning .jp-q');return q&&(q.dataset.jw||q.innerText.trim())===jw&&!document.querySelector('#meaning .jp-kana');},kw.jw),'五十音: 문제는 쓰는 순서 그림 글자 하나');
  ok(await p3.evaluate(()=>document.querySelectorAll('#meaning .kp-print svg .live').length>0&&!!document.querySelector('#meaning svg.hand[data-fit] .hlive')&&!document.querySelector('#meaning svg.hand [mask]')),'五十音: 배우는 연습은 인쇄체 획순 옆에 손글씨(따라쓰기 없음)');
  ok(await p3.evaluate(async()=>Object.keys(KANA_STROKES).length>=150&&(await document.fonts.load('600 20px KanaHand','あ')).length>0),'五十音: 획 자료·손글씨 글꼴 실림');
  await p3.focus('#ainput');await p3.keyboard.type(kw.rm);await p3.waitForTimeout(400);
  ok(await p3.evaluate(()=>document.querySelector('#ainput').classList.contains('ok')),`五十音: ${kw.rm} 로 ${kw.jw} 정답`);
  ok((await p3.innerText('#reveal')).includes(kw.hg),'五十音: 공개에 한글 소리');
  ok(await p3.evaluate(()=>{const orders=[];for(let k=0;k<4;k++){openLesson(0);startExercise(5);orders.push(state.session.roundTargets.join(','));}const seq=state.session.words.map(w=>w.id).join(',');openLesson(0);startExercise(0);const inOrder=state.session.roundTargets.join(',')===state.session.words.map(w=>w.id).join(',');return state.lessons[0].exercises[5].words.length===46&&orders.some(o=>o!==seq)&&inOrder;}),'五十音: 행별은 순서대로, 46자 무작위는 1회독부터 섞임');
  await p3.evaluate(()=>{openLesson(0);startExercise(6);});await p3.waitForTimeout(3000);
  ok(await p3.evaluate(()=>!!document.querySelector('#meaning .jp-hand')&&!document.querySelector('#meaning .kana-strokes')),'五十音: 46자 무작위 · 손글씨는 손글씨 모양으로');
  await p3.focus('#ainput');await p3.keyboard.type('zz');await p3.keyboard.press('Enter');await p3.waitForTimeout(1500);
  ok(await p3.evaluate(()=>!!document.querySelector('#reveal .kp-print svg .live')&&!!document.querySelector('#reveal svg.hand[data-fit] .hlive')),'五十音: 손글씨 문제를 틀리면 인쇄체 획순·손글씨 공개');
  ok(await p3.evaluate(()=>{const w=state.session.words[state.session.currentId],ul=document.querySelector('#reveal .jp-pn');return Object.keys(KANA_HAND).length>=150&&(w.pn.length?!!ul&&ul.querySelectorAll('li').length===w.pn.length:!ul);}),'五十音: 손글씨 경로·발음 설명(한국어와 같은 소리는 없음)');
  ok(await p3.evaluate(()=>{const all=DATA.flatMap(L=>L.exercises.flatMap(e=>e.words));const f=c=>all.find(w=>w.w===c);return f('あ').pn.length===0&&f('つ').pn.some(x=>/한국어에 없다.*voiceless alveolar affricate/.test(x))&&f('が').pn.some(x=>/식으로 하면 안 된다.*voiced velar plosive.*주의/.test(x))&&f('を').pn.some(x=>/‘오’식으로 해도 된다.*차이/.test(x))&&!DATA.some(L=>L.exercises.some(e=>e.words.some(w=>w.pn.some(x=>/%/.test(x)))));}),'五十音: 같은 소리 생략·한국어식 허용과 차이·꼭 구별·영어 용어');
  // 五十音 발음: 정답 공개 뒤 글자를 누르면 탭 안에서 바로 읽는다(Safari). 답하기 전에는 소리 없음.
  const p5=await b.newPage();p5.on('pageerror',e=>errs.push(e.message));
  await p5.addInitScript(()=>{window.__said=[];Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak:u=>window.__said.push(u.text),cancel(){},getVoices:()=>[{name:'Kyoko',lang:'ja-JP'}],addEventListener(){},speaking:false,pending:false}});window.SpeechSynthesisUtterance=function(t){this.text=t;};});
  await p5.goto('file://'+path.resolve(__dirname,'../../tangogoyanggojuon.html'));await p5.waitForTimeout(400);
  await p5.evaluate(()=>{openLesson(0);startExercise(0);});await p5.waitForTimeout(2500);
  await p5.click('#meaning .kana-pair');await p5.waitForTimeout(400);const before=await p5.evaluate(()=>window.__said.length);
  const k5=await p5.evaluate(()=>state.session.words[state.session.currentId]);await p5.focus('#ainput');await p5.keyboard.type(k5.rm);await p5.waitForTimeout(800);
  const n5=await p5.evaluate(()=>window.__said.length);
  const now=await p5.evaluate(()=>{const n=window.__said.length;document.querySelector('#meaning .kana-pair').dispatchEvent(new MouseEvent('click',{bubbles:true}));return window.__said.length-n;});
  ok(before===0&&n5>=1&&now===1&&await p5.evaluate(()=>state.session.answered),'五十音: 공개 뒤 글자 탭 = 바로 발음(답하기 전엔 없음, 넘어가지 않음)');
  // 기록 옮기기(index)
  const p4=await b.newPage();p4.on('pageerror',e=>errs.push(e.message));await p4.goto('file://'+path.resolve(__dirname,'../../index.html'));
  ok(await p4.evaluate(()=>{const m=rtMerge({'tangogoyang-kana-seoul-v1':'{"a":{"x":{"completed":true}}}'},{'tangogoyang-kana-seoul-v1':'{"a":{"y":{"completed":true}}}','goyang-seoul-v1':'{}'});return !!document.getElementById('rtOpen')&&RT_PREFIX==='tangogoyang-'&&m.summary.exercises===1&&!('goyang-seoul-v1' in m.writes);}),'기록 옮기기: 탄고고양 키만, 합치기');
  await b.close();console.log(fail?`실패 ${fail}`:'모두 통과');process.exit(fail?1:0);
})();

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
  // 한글로 친 소리
  const hg=await p.evaluate(()=>[['타베루','たべる'],['갓코우','がっこう'],['가방','かばん'],['신분','しんぶん'],['쿄우','きょう'],['코-히-','コーヒー'],['츠쿠에','つくえ'],['파-티-','パーティー'],['깃푸','きっぷ']].map(([h,a])=>[h,a,jpScriptLike(jpRomaToKana(jpHangulToKana(h,a),true),a)]));
  for(const [h,a,r] of hg)ok(r===a,`한글 ${h} → ${r}`);
  const hpos=await p.evaluate(()=>{for(let li=0;li<state.lessons.length;li++){const L=state.lessons[li];for(let ei=0;ei<L.exercises.length;ei++){const i=L.exercises[ei].words.findIndex(w=>w.term==='おとな');if(i===0)return {li,ei};}}return null;});
  if(hpos){await p.evaluate(({li,ei})=>{openLesson(li);startExercise(ei);},hpos);await p.waitForTimeout(3000);
    await p.focus('#ainput');await p.keyboard.insertText('오토나');await p.waitForTimeout(400);
    ok(await p.evaluate(()=>document.querySelector('#ainput').classList.contains('ok')),'한글 오토나 로 おとな 정답');}
  ok(errs.length===0,'페이지 오류 없음 '+errs.join(' | '));
  await b.close();console.log(fail?`실패 ${fail}`:'모두 통과');process.exit(fail?1:0);
})();

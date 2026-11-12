// 이솝 검수 4: 발음 경로. 브라우저 음성(speechSynthesis)을 가짜로 바꿔, 언제 무엇을 읽히는지·언제 끊는지 적는다. 실제 소리는 듣지 못한다.
// 사용: node reviews/aesop-20261112/behavior/04-speech.cjs → out/speech.json
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
const R=[];const note=(id,ok,what,detail)=>{R.push({id,ok,what,detail});console.log((ok===true?'ok   ':ok===false?'FAIL ':'info ')+id+' '+what+(detail!==undefined?' :: '+JSON.stringify(detail):''));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const STUB=()=>{window.__sp=[];const log=(k,o)=>window.__sp.push({k,t:Math.round(performance.now()),...o});
  window.SpeechSynthesisUtterance=function(text){this.text=text;this.lang='';this.rate=1;this.volume=1;this.voice=null;};
  const voices=[{name:'Kyoko',lang:'ja-JP',localService:true,voiceURI:'Kyoko',default:false},{name:'Yuna',lang:'ko-KR',localService:true,voiceURI:'Yuna',default:true}];
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speaking:false,pending:false,paused:false,
    getVoices(){return window.__noVoices?[]:voices;},
    speak(u){log('speak',{text:u.text,lang:u.lang,rate:u.rate,volume:u.volume,voice:u.voice&&u.voice.name});
      // 흉내: 0.25초 뒤 시작, 1모라에 0.17초(느린 편, rate .9)로 읽는다고 본다. 끊기면 onend를 부르지 않는다.
      u.__alive=true;window.__cur=u;const dur=250+[...u.text].length*170;
      setTimeout(()=>{if(u.__alive&&u.onstart)u.onstart({});},250);
      setTimeout(()=>{if(u.__alive){log('end',{text:u.text});u.__alive=false;if(u.onend)u.onend({});}},dur);},
    cancel(){const u=window.__cur;if(u&&u.__alive){u.__alive=false;log('cut',{text:u.text});}else log('cancel',{});},
    pause(){},resume(){},addEventListener(){},removeEventListener(){}}});};
(async()=>{
  const b=await chromium.launch();
  const open=async(f,opt={})=>{const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.addInitScript(STUB);if(opt.noVoices)await ctx.addInitScript(()=>{window.__noVoices=true;});const p=await ctx.newPage();p.__errs=[];p.on('pageerror',e=>p.__errs.push(e.message));await p.goto('file://'+path.join(ROOT,f));await p.waitForTimeout(500);return p;};
  const sp=p=>p.evaluate(()=>window.__sp.splice(0));
  const S=p=>p.evaluate(()=>{const s=state.session;if(!s)return null;const w=s.currentId!==null?s.words[s.currentId]:null;return {cur:s.currentId,term:w&&w.term,jw:w&&w.jw,rm:w&&w.rm,hw:w&&w.hw,answered:s.answered,copy:s.copyMode,screen:Object.keys(screens).find(k=>screens[k].classList.contains('active'))};});
  const start=async(p,lessonId,title)=>{await p.evaluate(({lessonId,title})=>{const li=state.lessons.findIndex(L=>L.id===lessonId);openLesson(li);startExercise(visEx(state.lessons[li]).findIndex(e=>e.title===title));},{lessonId,title});await sleep(2800);await sp(p);};
  const right=async(p)=>{const s=await S(p);await p.focus('#ainput');await p.keyboard.insertText(s.term);await sleep(120);return s;};
  // 실제 손가락처럼 그 자리 좌표를 누른다(위에 다른 요소가 덮여 있으면 그 요소가 받는다)
  const tap=async(p,sel)=>{const r=await p.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const top=document.elementFromPoint(x,y);return {x,y,hit:top?(top.id?'#'+top.id:top.className||top.tagName):null};},sel);if(!r)return null;await p.mouse.click(r.x,r.y);return r;};
  const texts=l=>l.filter(x=>x.k==='speak').map(x=>x.text);

  // ---- 五十音: 배우는 연습(획순 그림 카드) ----
  const g=await open('tangogoyanggojuon.html');
  await start(g,'ひらがな ①','あ·か행');
  await tap(g,'#meaning .kana-pair');await sleep(200);let l=await sp(g);
  note('S01',texts(l).length===0,'답하기 전 글자(획순 그림)를 눌러도 소리가 없다',l);
  let s=await right(g);l=await sp(g);
  note('S02',texts(l).join()==='あ'&&l.find(x=>x.k==='speak').lang==='ja-JP'&&l.find(x=>x.k==='speak').rate===0.9,'맞히면 그 글자(가나)를 ja-JP 음성, 속도 0.9로 한 번 읽힌다',l);
  await tap(g,'#meaning .kana-pair');await sleep(150);l=await sp(g);let s2=await S(g);
  note('S03',texts(l).join()==='あ'&&s2.cur===s.cur,'공개 뒤 문제 칸 글자를 누르면 다시 읽고, 다음 카드로 넘어가지 않는다',{log:l,sameCard:s2.cur===s.cur});
  await tap(g,'#hoeCtx .answer-replay');await sleep(150);l=await sp(g);s2=await S(g);
  note('S04',texts(l).join()==='あ'&&s2.cur===s.cur,'공개 뒤 답 칸(밑줄 글자)을 눌러도 다시 읽는다',{log:l});
  await sleep(200);await tap(g,'#reveal');await sleep(150);l=await sp(g);s2=await S(g);
  note('S05',s2.cur!==s.cur,'카드의 다른 곳을 누르면 다음 카드로 넘어간다(읽던 소리는 끊는다)',{log:l,next:s2.term});
  // 틀렸을 때
  await g.focus('#ainput');await g.keyboard.type('zz');await g.keyboard.press('Enter');await sleep(200);l=await sp(g);s=await S(g);
  note('S06',texts(l).join()===s.term&&s.copy,'틀리면(따라쓰기 시작) 정답 글자를 읽힌다',l);
  await tap(g,'#meaning .kana-pair');await sleep(150);l=await sp(g);
  const tapCopyKana=texts(l).length;
  const hit=await tap(g,'#hoeCtx .blanks');await sleep(150);l=await sp(g);
  note('S07',tapCopyKana>0||texts(l).length>0,'따라쓰기 중에 글자·답 칸을 누르면 다시 읽어 주는가',{kanaTapUtterances:tapCopyKana,slotTapUtterances:texts(l).length,slotTapHits:hit&&hit.hit});
  await g.focus('#ainput');await g.keyboard.type(s.rm);await sleep(200);l=await sp(g);
  note('S08',texts(l).join()===s.term,'따라쓰기를 마치면 한 번 더 읽힌다',l);
  await g.evaluate(()=>document.querySelector('#exitBtn').click());

  // ---- 五十音: 손글씨 판(짧은 글자) ----
  await start(g,'ひらがな ①','46자 무작위 · 손글씨');
  s=await right(g);l=await sp(g);
  const hwq=await g.evaluate(()=>({q:document.querySelector('#meaning').innerHTML.slice(0,90),rvPair:!!document.querySelector('#reveal .kana-pair')}));
  await tap(g,'#reveal .kana-pair');await sleep(150);l=await sp(g);s2=await S(g);
  note('S09',texts(l).join()===s.term&&s2.cur===s.cur,'손글씨 판: 공개 칸의 획순 그림을 누르면 읽는다',{hwq,log:l});
  await sleep(200);await tap(g,'#meaning .jp-q');await sleep(150);l=await sp(g);s2=await S(g);
  note('S10',texts(l).length>0&&s2.cur===s.cur,'손글씨 판: 공개 뒤 문제 칸의 큰 글자(손글씨)를 누르면 읽는가, 넘어가는가',{utter:texts(l),advanced:s2.cur!==s.cur});
  await g.evaluate(()=>document.querySelector('#exitBtn').click());

  // ---- 五十音: 긴 단어(획순 그림 없음) ----
  await start(g,'ひらがな ⑤','단어 읽기 1 · 인쇄체');
  await g.evaluate(()=>{const s=state.session;const i=s.words.findIndex(w=>[...w.term].length>3);s.queue=s.queue.filter(x=>x!==i);s.queue.unshift(i);nextCard();});await sleep(100);await sp(g);
  s=await right(g);l=await sp(g);
  const lw={term:s.term,first:l};
  await sleep(200);await tap(g,'#meaning .jp-q');await sleep(150);l=await sp(g);s2=await S(g);
  note('S11',texts(l).length>0&&s2.cur===s.cur,'긴 단어 카드: 공개 뒤 문제 칸의 단어를 누르면 읽는가, 넘어가는가',{card:lw.term,spokenAtReveal:texts(lw.first),tapUtter:texts(l),advanced:s2.cur!==s.cur,pairInReveal:await g.evaluate(()=>!!document.querySelector('#reveal .kana-pair'))});
  await g.evaluate(()=>document.querySelector('#exitBtn').click());

  // ---- 五十音: 모든 카드에서 읽히는 글 = 카드 가나인가 ----
  const allKana=await g.evaluate(()=>{const bad=[];let n=0;for(const L of state.lessons)for(const e of L.exercises)for(const w of e.words){n++;const t=pronunciationEntry(w.term,w.meaning).speech||w.term;if(t!==w.term||!/^[ぁ-ゖァ-ヶー]+$/.test(t))bad.push([w.term,t]);}return {n,bad};});
  note('S12',allKana.bad.length===0,'五十音 모든 카드: 읽히는 글은 카드의 가나 그대로',allKana);

  // ---- 무음 ----
  await start(g,'ひらがな ①','あ·か행');await g.click('#muteBtn2');await sleep(100);await sp(g);
  await right(g);l=await sp(g);note('S13',texts(l).length===0,'무음이면 읽지 않는다',l);
  await g.click('#muteBtn2');await g.evaluate(()=>document.querySelector('#exitBtn').click());

  // ---- 결과 화면: 틀린 단어 누르기 ----
  await start(g,'ひらがな ①','あ·か행');
  await g.focus('#ainput');await g.keyboard.type('zz');await g.keyboard.press('Enter');await sleep(150);await g.keyboard.type('a');await sleep(350);await g.keyboard.press('Enter');
  for(let i=0;i<14;i++){const st=await S(g);if(!st||st.screen!=='game')break;await g.focus('#ainput');await g.keyboard.insertText(st.term);await sleep(340);await g.keyboard.press('Enter');await sleep(60);}
  await sleep(900);await sp(g);
  const hasRow=await g.evaluate(()=>!!document.querySelector('#sumWrong .wrow'));
  if(hasRow){await g.click('#sumWrong .wrow');await sleep(150);l=await sp(g);note('S14',texts(l).join()==='あ','결과 화면에서 틀린 단어를 누르면 읽힌다',l);}else note('S14',null,'결과 화면 틀린 단어 줄을 못 만들었다',await S(g));

  // ---- 日本語能力試験·漢字読み: 무엇을 읽히나, 언제 끊나 ----
  for(const [f,name] of [['tangogoyangjlpt.html','日本語能力試験'],['tangogoyangyomi.html','漢字読み']]){
    const p=await open(f);
    const all=await p.evaluate(()=>{const bad=[];let n=0;for(const L of state.lessons)for(const e of L.exercises)for(const w of e.words){n++;const t=pronunciationEntry(w.term,w.meaning).speech||w.term;if(t!==w.term||/[㐀-鿿]/.test(t))bad.push([w.term,t]);}return {n,bad:bad.length};});
    note('S20-'+name,all.bad===0,name+' 모든 카드: 읽히는 글은 가나 읽기(한자 표기 아님)',all);
    // 가나 수가 다른 카드 몇 장을 골라 맞힌 뒤 가만히 둔다 → 자동으로 넘어갈 때 읽던 소리가 끊기는지(흉내 길이 기준)
    const picks=await p.evaluate(()=>{const out=[];const want=[2,4,6,8,10,12];for(const n of want){let hit=null;for(let li=0;li<state.lessons.length&&!hit;li++){const ev=visEx(state.lessons[li]);for(let ei=0;ei<ev.length&&!hit;ei++){const i=ev[ei].words.findIndex(w=>[...w.term].length===n&&!w.note);if(i>=0)hit={li,ei,i,n,term:ev[ei].words[i].term};}}if(hit)out.push(hit);}return out;});
    const rows=[];
    for(const k of picks){
      await p.evaluate(({li,ei,i})=>{openLesson(li);startExercise(ei);const s=state.session;s.queue=s.queue.filter(x=>x!==i);s.queue.unshift(i);nextCard();},k);await sleep(2800);await sp(p);
      const st=await right(p);const t0=Date.now();
      let moved=null;for(let w=0;w<80;w++){await sleep(50);const c=await S(p);if(!c||c.cur!==st.cur||c.screen!=='game'){moved=Date.now()-t0;break;}}
      const lg=await sp(p);const spk=lg.find(x=>x.k==='speak'),cut=lg.find(x=>x.k==='cut'),end=lg.find(x=>x.k==='end');
      rows.push({term:st.term,kana:[...st.term].length,spoken:spk&&spk.text,autoNextMs:moved,speakToCutMs:cut&&spk?cut.t-spk.t:null,finished:!!end,cut:!!cut});
      await p.evaluate(()=>document.querySelector('#exitBtn').click());
    }
    note('S21-'+name,null,name+': 맞힌 뒤 자동으로 넘어가는 때와 읽기 끊김(가짜 음성: 0.25초 뒤 시작, 한 글자 0.17초로 흉내)',rows);
    // 답 칸 탭
    await p.evaluate(()=>{openLesson(0);startExercise(0);});await sleep(2800);await sp(p);
    const st=await right(p);await sp(p);await tap(p,'#hoeCtx .answer-replay');await sleep(150);l=await sp(p);
    note('S22-'+name,texts(l).join()===st.term,name+': 공개 뒤 답 칸을 누르면 가나 읽기를 다시 읽힌다',{term:st.term,jw:st.jw,log:l});
    const head=await p.evaluate(()=>{const h=document.querySelector('#reveal .jp-head');return h?{cls:h.className,replay:h.classList.contains('answer-replay')||!!h.closest('.answer-replay')}:null;});
    if(head){await sleep(250);const c0=await S(p);await tap(p,'#reveal .jp-head');await sleep(150);l=await sp(p);const c1=await S(p);
      note('S23-'+name,texts(l).length>0&&c1.cur===c0.cur,name+': 공개 칸의 한자+후리가나를 누르면 읽는가, 넘어가는가',{utter:texts(l),advanced:c1.cur!==c0.cur});}
    note('S29-'+name,p.__errs.length===0,name+' 페이지 오류',p.__errs);
  }
  // ---- 일본어 음성이 없는 기기 ----
  const nv=await open('tangogoyanggojuon.html',{noVoices:true});
  await start(nv,'ひらがな ①','あ·か행');await right(nv);await sleep(1600);l=await sp(nv);
  note('S30',null,'음성 목록이 비어 있는 기기: 무엇을 하는가',l);
  note('S39',g.__errs.length===0&&nv.__errs.length===0,'五十音 페이지 오류',[...g.__errs,...nv.__errs]);
  fs.writeFileSync(path.join(__dirname,'out','speech.json'),JSON.stringify(R,null,1));
  await b.close();
  console.log('\n실패 '+R.filter(r=>r.ok===false).length+'건 / 확인 '+R.filter(r=>r.ok===true).length+'건 / 참고 '+R.filter(r=>r.ok===null).length+'건');
})().catch(e=>{console.error(e);process.exit(1);});

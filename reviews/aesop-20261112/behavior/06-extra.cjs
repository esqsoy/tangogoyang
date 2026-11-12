// 이솝 검수: 그 밖의 확인. (1) 흉내 도구(page-helpers.js)가 실제 화면 입력과 같은 판정을 내는지 표본 대조 (2) 로마자로 칠 때 Enter가 꼭 필요한 카드 수
// (3) 힌트(첫 칸) (4) 연습 제목 잘림 (5) 전 과정 완료(엔딩)까지 오류 없는지 (6) 대문자·전각 로마자·띄어쓰기
// 사용: node reviews/aesop-20261112/behavior/06-extra.cjs → out/extra.json
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
const G=require('./gen-inputs.js');
const R=[];const note=(id,ok,what,detail)=>{R.push({id,ok,what,detail});console.log((ok===true?'ok   ':ok===false?'FAIL ':'info ')+id+' '+what+(detail!==undefined?' :: '+JSON.stringify(detail).slice(0,1400):''));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const FILES={meaning:'tangogoyangjlpt.html',yomi:'tangogoyangyomi.html',kana:'tangogoyanggojuon.html'};
(async()=>{
  const b=await chromium.launch();
  for(const [mode,f] of Object.entries(FILES)){
    const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+path.join(ROOT,f));await sleep(500);
    await p.addScriptTag({path:path.join(__dirname,'gen-inputs.js')});await p.addScriptTag({path:path.join(__dirname,'page-helpers.js')});
    // (2) 로마자: 다 쳐도 자동으로 안 넘어가는(Enter가 필요한) 카드
    const enter=await p.evaluate(()=>{const A=window.AE,G=window.GEN;let n=0,need=0,nEnd=0,needNotN=[];for(const L of state.lessons)for(const e of L.exercises)for(const w0 of e.words){const w={...w0,id:0};const r0=G.romaji(w.term,'hep');if(!r0)continue;n++;const r=A.typeAppend(w,[...r0]);if(r.ok&&!r.auto){need++;if(/[んン]$/.test(w.term))nEnd++;else needNotN.push(w.term+':'+r0);}}return {cards:n,needEnter:need,endsWithN:nEnd,others:needNotN.slice(0,20)};});
    note('X01-'+mode,null,'로마자(헵번식)로 정답을 다 쳐도 자동 판정이 안 되고 Enter를 눌러야 하는 카드',enter);
    // (1) 표본 대조: 실제 키 입력 vs 흉내
    const sample=await p.evaluate(()=>{const all=[];state.lessons.forEach((L,li)=>visEx(L).forEach((e,ei)=>e.words.forEach((w,i)=>all.push({li,ei,i,term:w.term,hg:w.hg,rm:w.rm}))));const out=[];let seed=12345;const rnd=()=>(seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;for(let k=0;k<24;k++)out.push(all[Math.floor(rnd()*all.length)]);return out;});
    let mism=[];
    for(const c of sample){
      for(const kind of ['roma','hangul','wrong']){
        const text=kind==='roma'?G.romaji(c.term,'hep'):kind==='hangul'?G.hangul(c.term):G.romaji(c.term,'hep').replace(/[aiueo]/,m=>m==='a'?'i':'a');
        if(!text)continue;
        const simr=await p.evaluate(({c,text,kind})=>{const w={...visEx(state.lessons[c.li])[c.ei].words[c.i],id:0};const r=kind==='hangul'?window.AE.typeHangul(w,text,'syl'):window.AE.typeAppend(w,[...text]);state.session=null;return {ok:r.ok,auto:r.auto,early:r.early};},{c,text,kind});
        await p.evaluate(({c})=>{state.muted=true;openLesson(c.li);startExercise(c.ei);const s=state.session;quizOpenEnd(s);s.queue=[c.i];nextCard();quizOpenEnd(s);},{c});
        await p.focus('#ainput');
        if(kind==='hangul'){for(const ch of text){await p.keyboard.insertText(ch);await sleep(5);}}else{for(const ch of text){const st=await p.evaluate(()=>state.session.answered);if(st)break;await p.keyboard.type(ch);}}
        await sleep(30);let st=await p.evaluate(()=>({answered:state.session.answered,copy:state.session.copyMode}));
        const autoReal=st.answered;if(!st.answered){await p.keyboard.press('Enter');await sleep(30);st=await p.evaluate(()=>({answered:state.session.answered,copy:state.session.copyMode}));}
        const realOk=st.answered&&!st.copy;
        if(realOk!==simr.ok||autoReal!==simr.auto)mism.push({term:c.term,kind,text,sim:simr,real:{ok:realOk,auto:autoReal}});
        await p.evaluate(()=>{cancelPendingAdvance();stopTicker();stopPronunciation();state.session=null;show('home');});
      }
    }
    note('X02-'+mode,mism.length===0,'흉내 도구와 실제 화면 입력의 판정이 같다(표본 24장 × 로마자·한글·틀린 로마자)',mism);
    // (6) 대문자·전각·띄어쓰기·앞뒤 공백
    const misc=await p.evaluate(()=>{const A=window.AE,G=window.GEN;const w0=visEx(state.lessons[0])[0].words[0];const w={...w0,id:0};const r=G.romaji(w.term,'hep');
      const full=r.replace(/[a-z]/g,c=>String.fromCharCode(c.charCodeAt(0)+0xfee0));
      return {term:w.term,upper:A.typeAppend(w,[...r.toUpperCase()]).ok,fullwidth:A.typeAppend(w,[...full]).ok,fullwidthGot:A.typeAppend(w,[...full]).final,leadingSpace:A.typeAppend(w,[' ',...r]).ok,kanaWithSpace:A.typeAppend(w,[w.term+' ']).ok};});
    note('X03-'+mode,null,'대문자·전각 로마자·공백이 섞인 입력',misc);
    // (3) 힌트
    await p.evaluate(()=>{state.muted=true;openLesson(0);startExercise(0);const s=state.session;quizOpenEnd(s);});await sleep(100);
    const hint=await p.evaluate(async()=>{const s=state.session,w=s.words[s.currentId];giveHint();const v=document.querySelector('#ainput').value;const ans=s.answered;submit();return {term:w.term,shown:w.jw,afterHint:v,autoSubmitted:ans,afterEnter:{answered:s.answered,copy:s.copyMode},firstCorrect:s.firstCorrect,hints:s.hints};});
    note('X04-'+mode,null,'첫 칸 힌트를 누른 뒤 그대로 Enter',hint);
    await p.evaluate(()=>{cancelPendingAdvance();stopTicker();state.session=null;show('home');});
    // (4) 연습 제목 잘림(게임 화면 아래 줄)
    const trunc=await p.evaluate(()=>{const out=[];const seen=new Set();state.lessons.forEach((L,li)=>visEx(L).forEach((e,ei)=>{if(seen.has(L.id+e.title.replace(/\d+/g,'#')))return;seen.add(L.id+e.title.replace(/\d+/g,'#'));state.muted=true;openLesson(li);startExercise(ei);stopTicker();const t=document.querySelector('#gTitle');if(t.scrollWidth>t.clientWidth+1)out.push({lesson:L.id,title:e.title,shownPx:t.clientWidth,needPx:t.scrollWidth});cancelPendingAdvance();state.session=null;}));show('home');return out;});
    note('X05-'+mode,trunc.length===0,'게임 화면의 연습 제목이 잘리는 것(390px, 제목 꼴마다 하나씩)',{n:trunc.length,sample:trunc.slice(0,8)});
    // (5) 전 과정 완료: 마지막 연습만 남기고 다 클리어한 것으로 해 두고 마지막 연습을 끝낸다
    const end=await p.evaluate(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));const prog={};state.lessons.forEach(L=>visEx(L).forEach(e=>{(prog[L.id]=prog[L.id]||{})[e.title]={completed:true,bestMs:1000,lastMs:1000,attempts:1,errors:0,first:100};}));
      const lastL=state.lessons[state.lessons.length-1],lastE=visEx(lastL).slice(-1)[0];delete prog[lastL.id][lastE.title];state.progress=prog;
      state.muted=true;openLesson(state.lessons.length-1);startExercise(visEx(lastL).length-1);const s=state.session;quizOpenEnd(s);
      let guard=0;while(state.session===s&&screens.game.classList.contains('active')&&guard++<200){const w=s.words[s.currentId];document.querySelector('#ainput').value=w.term;submit();await wait(5);cancelPendingAdvance();nextCard();await wait(5);}
      await wait(1500);
      const r={screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),sumTitle:document.querySelector('#sumTitle').textContent,ending:!!document.querySelector('#ending.show'),endingText:(document.querySelector('#ending')||{}).innerText,cleared:clearedExercises()+'/'+totalExercises(),nextDisabled:document.querySelector('#nextEx').disabled};
      return r;});
    await sleep(1500);
    const endText=await p.evaluate(()=>{const e=document.querySelector('#ending');return e?{show:e.classList.contains('show'),text:e.innerText.replace(/\s+/g,' ').slice(0,200)}:null;});
    note('X06-'+mode,errs.length===0&&end.screen==='sum','마지막 연습까지 끝냈을 때(전 과정 완료)',{end,endText,errs});
    // 이 검사는 진도를 가짜로 채웠다 → 이 페이지의 저장소는 버린다(file:// 임시 프로필)
    await p.close();
  }
  fs.writeFileSync(path.join(__dirname,'out','extra.json'),JSON.stringify(R,null,1));
  await b.close();
  console.log('\n실패 '+R.filter(r=>r.ok===false).length+'건 / 확인 '+R.filter(r=>r.ok===true).length+'건 / 참고 '+R.filter(r=>r.ok===null).length+'건');
})().catch(e=>{console.error(e);process.exit(1);});

// 이솝 검수 3: 화면. 390px·360px(그리고 320px 참고)에서 五十音 모든 카드의 문제·오답 따라쓰기·정답 공개 상태를 실제로 그려,
// 가로로 넘치거나 잘리는 것, 카드 높이(따라쓰기 때 입력 칸과 해설이 한 화면에 들어오는지)를 잰다. JLPT·漢字読み는 긴 카드만 골라 본다.
// 사용: node reviews/aesop-20261112/behavior/05-layout.cjs → out/layout.json, shots/*.png
// 주의: 이 기계의 일본어 글꼴은 IPAGothic이다. 실제 기기(Hiragino·Noto Sans JP)와 글자 폭이 조금 다를 수 있다.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MEASURE=()=>{ // 지금 화면에서 넘침·잘림을 잰다
  const vw=document.documentElement.clientWidth,vh=window.innerHeight,card=document.querySelector('#quizCard'),cr=card.getBoundingClientRect();
  const out={pageScrollX:document.scrollingElement.scrollWidth-vw,cardH:Math.round(cr.height),cardTop:Math.round(cr.top+window.scrollY),docH:document.scrollingElement.scrollHeight,over:[],clip:[]};
  const vis=e=>{const st=getComputedStyle(e);return st.display!=='none'&&st.visibility!=='hidden'&&parseFloat(st.opacity)>0.01;};
  for(const e of card.querySelectorAll('*')){
    if(e.closest('svg')&&e.tagName.toLowerCase()!=='svg')continue;
    if(e.closest('#fxLayer,.fx,.burst,[aria-hidden="true"]'))continue;
    const r=e.getBoundingClientRect();if(!r.width||!r.height||!vis(e))continue;
    let hidden=false;for(let a=e.parentElement;a&&a!==card.parentElement;a=a.parentElement){if(!vis(a)){hidden=true;break;}}if(hidden)continue;
    const name=(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).join('.'):'')||e.tagName.toLowerCase();
    if(r.right>vw+1||r.left<-1)out.over.push({el:name,left:Math.round(r.left),right:Math.round(r.right),vw,kind:'화면 밖'});
    else if(r.right>cr.right+1||r.left<cr.left-1)out.over.push({el:name,left:Math.round(r.left),right:Math.round(r.right),cardL:Math.round(cr.left),cardR:Math.round(cr.right),kind:'카드 밖'});
    const st=getComputedStyle(e);
    if((st.overflowX!=='visible'||st.textOverflow==='ellipsis')&&e.scrollWidth>e.clientWidth+1&&e.id!=='ainput')out.clip.push({el:name,scrollW:e.scrollWidth,clientW:e.clientWidth,kind:'가로 잘림'});
    if(st.overflowY==='hidden'&&e.scrollHeight>e.clientHeight+2&&e.id!=='ainput'&&e!==card)out.clip.push({el:name,scrollH:e.scrollHeight,clientH:e.clientHeight,kind:'세로 잘림'});
  }
  const q=document.querySelector('#meaning'),qr=q.getBoundingClientRect();out.qW=Math.round(qr.width);out.qH=Math.round(qr.height);
  const inner=q.querySelector('.jp-q');if(inner){out.qScrollW=inner.scrollWidth;out.qClientW=inner.clientWidth;const ir=inner.getBoundingClientRect();out.qLeft=Math.round(ir.left);out.qRight=Math.round(ir.right);
    // 글자 자체의 폭(nowrap 글자가 상자 밖으로 삐져나가는지)
    const rg=document.createRange();rg.selectNodeContents(inner);const tr=rg.getBoundingClientRect();out.textLeft=Math.round(tr.left);out.textRight=Math.round(tr.right);}
  const bl=document.querySelector('#hoeCtx .blanks');if(bl){const b=bl.getBoundingClientRect();out.blanksTop=Math.round(b.top+window.scrollY);out.blanksBottom=Math.round(b.bottom+window.scrollY);out.blanksLines=Math.round(b.height);}
  const rv=document.querySelector('#reveal');if(rv){const b=rv.getBoundingClientRect();out.revealH=Math.round(b.height);out.revealBottom=Math.round(b.bottom+window.scrollY);}
  out.vh=vh;return out;
};
(async()=>{
  const b=await chromium.launch();const results={};const errs=[];
  for(const width of [390,360,320]){
    const ctx=await b.newContext({viewport:{width,height:width===390?844:width===360?740:568},deviceScaleFactor:2,isMobile:true,hasTouch:true});
    const p=await ctx.newPage();p.on('pageerror',e=>errs.push(width+' pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(width+' console: '+m.text());});
    await p.goto('file://'+path.join(ROOT,'tangogoyanggojuon.html'));await sleep(600);
    const font=await p.evaluate(async()=>{try{await document.fonts.load('600 40px KanaHand','あ');}catch(e){}return {kanaHand:document.fonts.check('600 40px KanaHand','あ'),homeScrollX:document.scrollingElement.scrollWidth-document.documentElement.clientWidth};});
    // 홈·연습 목록 가로 넘침
    const lists=await p.evaluate(()=>{const o=[];const chk=n=>{const vw=document.documentElement.clientWidth;o.push({screen:n,scrollX:document.scrollingElement.scrollWidth-vw,wide:[...document.querySelectorAll('.screen.active *,#'+n+'Screen *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>vw+1;}).slice(0,5).map(e=>(e.className||e.tagName)+'')});};chk('home');for(let i=0;i<state.lessons.length;i++){openLesson(i);chk('lesson');}document.querySelector('#backHome').click();return o;});
    const rows=[];
    const nEx=await p.evaluate(()=>state.lessons.map(L=>visEx(L).length));
    for(let li=0;li<nEx.length;li++)for(let ei=0;ei<nEx[li];ei++){
      const part=await p.evaluate(async({li,ei,M})=>{
        const measure=new Function('return ('+M+')()');const wait=ms=>new Promise(r=>setTimeout(r,ms));
        state.muted=true;openLesson(li);startExercise(ei);const s=state.session;quizOpenEnd(s);stopTicker();
        const out=[];const ex=s.exercise.title,lesson=s.lesson.id;
        // 무작위 판도 자료 순서로 본다
        s.queue=s.words.map(w=>w.id);
        for(let k=0;k<s.words.length;k++){
          nextCard();const w=s.words[s.currentId];quizOpenEnd(s);
          await wait(30);const q=measure();
          submit({forced:true});const card=document.querySelector('#quizCard');card.style.transition='none';card.style.height='';await wait(30);
          const c=measure();
          document.querySelector('#ainput').value=w.term;submitCopy();cancelPendingAdvance();await wait(30);
          const r=measure();
          out.push({lesson,ex,i:k,term:w.term,hw:w.hw,len:[...w.term].length,pnChars:(w.pn||[]).join('').length,noteChars:(w.note||'').length,q,c,r});
        }
        cancelPendingAdvance();stopTicker();state.session=null;return out;
      },{li,ei,M:MEASURE.toString()});
      rows.push(...part);
    }
    results[width]={font,lists,rows};
    // 요약
    const bad=rows.filter(r=>['q','c','r'].some(k=>r[k].pageScrollX>0||r[k].over.length||r[k].clip.length));
    console.log(`\n== 五十音 ${width}px: ${rows.length}카드 × 3상태. 손글씨 글꼴 실림=${font.kanaHand}. 넘치거나 잘린 카드 ${bad.length}장`);
    const kinds={};for(const r of bad)for(const k of ['q','c','r'])for(const o of [...r[k].over,...r[k].clip]){const key=({q:'문제',c:'따라쓰기',r:'공개'})[k]+' / '+o.kind+' / '+o.el;(kinds[key]=kinds[key]||new Set()).add(r.term+(r.hw?'(손)':''));}
    for(const [k,v] of Object.entries(kinds))console.log('  '+k+': '+v.size+'종 — '+[...v].slice(0,12).join(' '));
    const tall=rows.map(r=>({term:r.term,hw:r.hw,ex:r.ex,lesson:r.lesson,cardH:r.c.cardH,revealH:r.c.revealH,docH:r.c.docH,vh:r.c.vh,blanksBottom:r.c.blanksBottom,pn:r.pnChars})).sort((a,b)=>b.docH-a.docH);
    const over1=tall.filter(t=>t.docH>t.vh).length;
    console.log(`  따라쓰기 상태에서 화면 높이(${tall[0].vh}px)를 넘겨 스크롤이 생기는 카드: ${over1}장. 가장 긴 것: ${tall.slice(0,5).map(t=>t.term+(t.hw?'(손)':'')+' 문서 '+t.docH+'px/카드 '+t.cardH+'px').join(', ')}`);
    console.log('  목록 화면 가로 넘침:',lists.filter(x=>x.scrollX>0||x.wide.length).length,'건');
    // 스크린샷: 넘친 카드 몇 장 + 가장 긴 카드
    const shotList=[];const pick=(r,state,tag)=>shotList.push({li:null,r,state,tag});
    const seenKinds=new Set();
    for(const r of bad){for(const k of ['q','c','r']){const o=[...r[k].over,...r[k].clip][0];if(!o)continue;const key=k+o.kind+o.el;if(seenKinds.has(key))continue;seenKinds.add(key);pick(r,k,'overflow');}}
    const tallest=rows.slice().sort((a,b)=>b.c.docH-a.c.docH)[0];pick(tallest,'c','tallest');
    const longest=rows.filter(r=>!r.hw).sort((a,b)=>b.len-a.len)[0];pick(longest,'q','longest');pick(rows.filter(r=>r.hw).sort((a,b)=>b.len-a.len)[0],'q','longest-hand');
    const small=rows.find(r=>/[ゃゅょ]/.test(r.term)&&r.len===2&&!r.hw);if(small){pick(small,'q','small-kana');pick(small,'r','small-kana');}
    let n=0;for(const sh of shotList.slice(0,14)){
      await p.evaluate(async({lesson,ex,i,state:stt})=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));state.muted=true;const li=state.lessons.findIndex(L=>L.id===lesson);openLesson(li);startExercise(visEx(state.lessons[li]).findIndex(e=>e.title===ex));const s=state.session;quizOpenEnd(s);stopTicker();s.queue=[i];nextCard();quizOpenEnd(s);
        if(stt!=='q'){submit({forced:true});const card=document.querySelector('#quizCard');card.style.transition='none';card.style.height='';}
        if(stt==='r'){document.querySelector('#ainput').value=s.words[i].term;submitCopy();cancelPendingAdvance();}
        await wait(2500);},{lesson:sh.r.lesson,ex:sh.r.ex,i:sh.r.i,state:sh.state});
      const name=`gojuon-${width}-${sh.tag}-${sh.state}-${++n}.png`;await p.screenshot({path:path.join(__dirname,'shots',name),fullPage:true});sh.file=name;
      await p.evaluate(()=>{cancelPendingAdvance();stopTicker();state.session=null;});
    }
    results[width].shots=shotList.map(s=>({file:s.file,term:s.r.term,hw:s.r.hw,ex:s.r.ex,state:s.state,tag:s.tag}));
    console.log('  스크린샷:',results[width].shots.map(s=>s.file+'('+s.term+')').join(' '));

    // JLPT·漢字読み: 긴 카드만
    for(const f of ['tangogoyangjlpt.html','tangogoyangyomi.html']){
      const q=await ctx.newPage();q.on('pageerror',e=>errs.push(width+' '+f+' pageerror: '+e.message));
      await q.goto('file://'+path.join(ROOT,f));await sleep(600);
      const part=await q.evaluate(async({M})=>{
        const measure=new Function('return ('+M+')()');const wait=ms=>new Promise(r=>setTimeout(r,ms));state.muted=true;
        const all=[];state.lessons.forEach((L,li)=>visEx(L).forEach((e,ei)=>e.words.forEach((w,i)=>all.push({li,ei,i,w}))));
        const top=(f,n)=>all.slice().sort((a,b)=>f(b.w)-f(a.w)).slice(0,n);
        const picks=new Map();for(const x of [...top(w=>[...w.term].length,25),...top(w=>(w.meaning||'').length,25),...top(w=>(w.note||'').length,25),...top(w=>[...w.jw].length,25)])picks.set(x.li+'/'+x.ei+'/'+x.i,x);
        const out=[];
        for(const x of picks.values()){openLesson(x.li);startExercise(x.ei);const s=state.session;quizOpenEnd(s);stopTicker();s.queue=[x.i];nextCard();quizOpenEnd(s);await wait(30);const qm=measure();
          submit({forced:true});const card=document.querySelector('#quizCard');card.style.transition='none';card.style.height='';await wait(30);const c=measure();
          document.querySelector('#ainput').value=x.w.term;submitCopy();cancelPendingAdvance();await wait(30);const r=measure();
          out.push({lesson:s.lesson.id,ex:s.exercise.title,i:x.i,term:x.w.term,jw:x.w.jw,len:[...x.w.term].length,meaningChars:(x.w.meaning||'').length,noteChars:(x.w.note||'').length,q:qm,c,r});
          cancelPendingAdvance();stopTicker();state.session=null;}
        return out;},{M:MEASURE.toString()});
      const badJ=part.filter(r=>['q','c','r'].some(k=>r[k].pageScrollX>0||r[k].over.length||r[k].clip.length));
      console.log(`  ${f} ${width}px: 긴 카드 ${part.length}장 중 넘치거나 잘린 것 ${badJ.length}장`+(badJ.length?' — '+badJ.slice(0,8).map(r=>r.term+':'+['q','c','r'].flatMap(k=>[...r[k].over,...r[k].clip].map(o=>k+'/'+o.kind+'/'+o.el)).slice(0,2).join(',')).join(' | '):''));
      results[width][f]=part;
      if(badJ.length){const r=badJ[0];await q.evaluate(async({lesson,ex,i})=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));const li=state.lessons.findIndex(L=>L.id===lesson);openLesson(li);startExercise(visEx(state.lessons[li]).findIndex(e=>e.title===ex));const s=state.session;quizOpenEnd(s);stopTicker();s.queue=[i];nextCard();quizOpenEnd(s);submit({forced:true});await wait(1500);},r);
        await q.screenshot({path:path.join(__dirname,'shots',`${f.replace('.html','')}-${width}-overflow.png`),fullPage:true});}
      await q.close();
    }
    await ctx.close();
  }
  // 파일이 커지지 않게: 넘치거나 잘린 것이 없는 카드는 높이만 남긴다
  const slim=r=>{const bad=['q','c','r'].some(k=>r[k].pageScrollX>1||r[k].over.length||r[k].clip.length||(r[k].qScrollW||0)>(r[k].qClientW||0)+1);if(bad)return r;return {lesson:r.lesson,ex:r.ex,i:r.i,term:r.term,hw:r.hw,len:r.len,pnChars:r.pnChars,cardH:{q:r.q.cardH,c:r.c.cardH,r:r.r.cardH},docH:{c:r.c.docH},vh:r.c.vh};};
  for(const w of Object.keys(results)){results[w].rows=results[w].rows.map(slim);for(const f of ['tangogoyangjlpt.html','tangogoyangyomi.html'])if(results[w][f])results[w][f]=results[w][f].map(slim);}
  results.errors=errs;console.log('\n콘솔·페이지 오류:',errs.length,errs.slice(0,5));
  fs.writeFileSync(path.join(__dirname,'out','layout.json'),JSON.stringify(results));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});

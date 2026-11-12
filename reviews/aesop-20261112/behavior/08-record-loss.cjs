// 이솝 검수 2-2: 기록이 사라질 수 있는 길. (a) 같은 게임을 두 탭에서 (b) 게임 탭을 열어 둔 채 기록 옮기기로 합친 뒤 (c) 뒤로 가기(bfcache) (d) 저장이 실패할 때
// 사용: node reviews/aesop-20261112/behavior/08-record-loss.cjs → out/record-loss.json
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const http=require('http');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
const R=[];const note=(id,ok,what,detail)=>{R.push({id,ok,what,detail});console.log((ok===true?'ok   ':ok===false?'FAIL ':'info ')+id+' '+what+(detail!==undefined?' :: '+JSON.stringify(detail).slice(0,1200):''));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const srv=http.createServer((q,s)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);s.end();return;}s.writeHead(200,{'content-type':'text/html; charset=utf-8'});fs.createReadStream(f).pipe(s);});
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port+'/';
  const b=await chromium.launch();
  const KEY='tangogoyang-kana-seoul-v1';
  // 한 연습을 실제 입력으로 끝낸다
  const play=async(p,title)=>{await p.evaluate(t=>{state.muted=true;openLesson(0);startExercise(visEx(state.lessons[0]).findIndex(e=>e.title===t));},title);await sleep(2700);
    for(let i=0;i<60;i++){const st=await p.evaluate(()=>{const s=state.session;return s&&screens.game.classList.contains('active')?s.words[s.currentId].term:null;});if(!st)break;await p.focus('#ainput');await p.keyboard.insertText(st);await sleep(330);await p.keyboard.press('Enter');await sleep(50);}
    await sleep(300);return p.evaluate(()=>Object.keys(screens).find(k=>screens[k].classList.contains('active')));};
  const stored=p=>p.evaluate(K=>{const o=JSON.parse(localStorage.getItem(K)||'{}');return Object.entries(o).flatMap(([l,v])=>Object.keys(v).map(t=>l+'/'+t));},KEY);

  // (a) 두 탭
  let ctx=await b.newContext({viewport:{width:390,height:844}});
  const A=await ctx.newPage(),B=await ctx.newPage();await A.goto(base+'tangogoyanggojuon.html');await B.goto(base+'tangogoyanggojuon.html');await sleep(500);
  await play(A,'あ·か행');const afterA=await stored(A);
  await play(B,'さ·た행');const afterB=await stored(B);
  note('L01',afterB.length===2,'같은 게임을 두 탭에 열어 두고 탭마다 다른 연습을 끝내면 둘 다 남는가',{afterTabA:afterA,afterTabB:afterB});
  await ctx.close();

  // (b) 게임 탭을 열어 둔 채, 교재 선택 화면(다른 탭)에서 기록 파일을 합친 뒤, 게임 탭에서 한 판
  ctx=await b.newContext({viewport:{width:390,height:844}});
  const Gm=await ctx.newPage();await Gm.goto(base+'tangogoyanggojuon.html');await sleep(500);
  const file=path.join(__dirname,'out','import-sample.json');
  fs.writeFileSync(file,JSON.stringify({app:'tangogoyang-records',v:1,exportedAt:new Date().toISOString(),data:{[KEY]:JSON.stringify({'ひらがな ①':{'な·は행':{completed:true,bestMs:9000,lastMs:9000,attempts:10,errors:0,first:100},'ま·や행':{completed:true,bestMs:9000,lastMs:9000,attempts:10,errors:0,first:100}}})}}));
  const Ix=await ctx.newPage();await Ix.goto(base+'index.html#records');await sleep(300);await Ix.setInputFiles('#rtFile',file);await sleep(300);await Ix.click('#rtMerge');await sleep(200);
  const msg=await Ix.innerText('#rtStatus');const afterMerge=await stored(Ix);
  const homeMetaBefore=await Gm.innerText('#homeMeta');
  await play(Gm,'あ·か행');const afterPlay=await stored(Gm);
  note('L02',afterPlay.length===3,'게임 탭이 열린 채로 기록 파일을 합치고, 그 게임 탭에서 새로고침 없이 한 판을 끝내면 합친 기록이 남는가',{mergeMessage:msg,afterMerge,gameTabHomeStillShows:homeMetaBefore,afterPlayInOldTab:afterPlay});
  await ctx.close();

  // (c) 게임 → ⌂ 교재 선택 → 합치기 → 브라우저 뒤로 가기
  ctx=await b.newContext({viewport:{width:390,height:844}});
  const P=await ctx.newPage();await P.goto(base+'tangogoyanggojuon.html');await sleep(500);
  await P.evaluate(()=>{window.__mark='same-document';});
  await P.click('a.course-home');await P.waitForURL(/index\.html/);await sleep(300);
  await P.click('#rtOpen');await P.setInputFiles('#rtFile',file);await sleep(300);await P.click('#rtMerge');await sleep(200);
  await P.goBack();await sleep(700);
  const back=await P.evaluate(()=>({restoredFromCache:window.__mark==='same-document',homeMeta:document.querySelector('#homeMeta').textContent,inMemory:Object.keys(state.progress['ひらがな ①']||{})}));
  await play(P,'あ·か행');const afterBack=await stored(P);
  note('L03',afterBack.length===3,'게임 → ⌂ → 기록 합치기 → 뒤로 가기 → 한 판: 합친 기록이 남는가(이 브라우저가 뒤로 가기에서 페이지를 되살렸는지도 적는다)',{back,afterPlay:afterBack});
  await ctx.close();

  // (d) 저장이 실패하는 브라우저(저장 공간 없음)
  ctx=await b.newContext({viewport:{width:390,height:844}});
  const Q=await ctx.newPage();const errs=[];Q.on('pageerror',e=>errs.push(e.message));await Q.goto(base+'tangogoyanggojuon.html');await sleep(500);
  await Q.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError');};});
  const scr=await play(Q,'あ·か행');
  const stuck=await Q.evaluate(()=>({screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),answered:state.session&&state.session.answered,ticker:!!state.ticker,inputDisabled:document.querySelector('#ainput').disabled,catSays:document.querySelector('#catSpeech').textContent}));
  note('L04',scr==='sum','저장이 실패할 때(setItem이 예외): 연습을 끝내면 결과 화면이 뜨는가, 알려 주는가',{screenAfterLastCard:scr,stuck,pageErrors:errs.slice(0,3)});
  await ctx.close();
  fs.writeFileSync(path.join(__dirname,'out','record-loss.json'),JSON.stringify(R,null,1));
  await b.close();srv.close();
})().catch(e=>{console.error(e);process.exit(1);});

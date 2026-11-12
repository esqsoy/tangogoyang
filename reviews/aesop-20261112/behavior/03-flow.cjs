// 이솝 검수 2: 판 흐름(실제 키 입력으로). 1회독→2회독→완료, 오답 따라쓰기, 무작위 판, 시간 초과, 저장 키, 이어하기, 모아둔 카드, 기록 옮기기.
// 사용: node reviews/aesop-20261112/behavior/03-flow.cjs → out/flow.json  (같은 주소에서 세 게임을 열어야 하므로 읽기 전용 정적 서버를 잠깐 띄운다)
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const http=require('http');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
const R=[];const note=(id,ok,what,detail)=>{R.push({id,ok,what,detail});console.log((ok===true?'ok   ':ok===false?'FAIL ':'info ')+id+' '+what+(detail!==undefined?' :: '+(typeof detail==='string'?detail:JSON.stringify(detail)):''));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const srv=http.createServer((q,s)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0].split('#')[0]));
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);s.end();return;}
    s.writeHead(200,{'content-type':f.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'});fs.createReadStream(f).pipe(s);});
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port+'/';
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});
  const errs=[];
  const open=async(f)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(f+' pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(f+' console: '+m.text());});await p.goto(base+f);await p.waitForTimeout(500);return p;};
  const S=p=>p.evaluate(()=>{const s=state.session;if(!s)return null;const w=s.currentId!==null?s.words[s.currentId]:null;return {round:s.round,roundName:s.roundName,cur:s.currentId,term:w&&w.term,jw:w&&w.jw,rm:w&&w.rm,hg:w&&w.hg,answered:s.answered,copy:s.copyMode,queue:[...s.queue],targets:[...s.roundTargets],errors:s.errors,n:s.words.length,screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),input:document.querySelector('#ainput').value};});
  const typeKeys=async(p,str)=>{await p.focus('#ainput');for(const ch of str){await p.keyboard.type(ch);await sleep(8);}};
  const advance=async(p)=>{await sleep(330);await p.keyboard.press('Enter');await sleep(60);};
  const openEx=async(p,lessonId,title)=>{await p.evaluate(({lessonId,title})=>{const li=state.lessons.findIndex(L=>L.id===lessonId);openLesson(li);const ei=visEx(state.lessons[li]).findIndex(e=>e.title===title);startExercise(ei);},{lessonId,title});await sleep(2800);};
  // 정답을 그 카드의 가나로 한 번에 넣는다(일본어 자판에서 확정한 것과 같은 input 이벤트 하나)
  const answerRight=async(p)=>{const s=await S(p);await p.focus('#ainput');await p.keyboard.insertText(s.term);await sleep(80);return s;};

  // 보카고양 키를 미리 심어 둔다(같은 주소를 쓰는 다른 게임 흉내)
  const seed=await open('index.html');
  await seed.evaluate(()=>{localStorage.setItem('goyang-seoul-v1','{"01강":{"Exercise 1":{"completed":true,"bestMs":1000}}}');localStorage.setItem('goyang-hoe-seoul-v1','{"x":1}');localStorage.setItem('zerotwo_test','1');});
  await seed.close();

  // ---------- A. 五十音 순서 판: 1회독 → 2회독(틀린 것만) → 완료 ----------
  const g=await open('tangogoyanggojuon.html');
  await openEx(g,'ひらがな ①','あ·か행');
  let s=await S(g);
  note('A01',JSON.stringify(s.targets)===JSON.stringify([0,1,2,3,4,5,6,7,8,9])&&s.cur===0&&s.roundName==='1회독','순서 판 1회독은 자료 순서대로',{targets:s.targets,first:s.term});
  // 1번 카드: 일부러 틀린다(い)
  await typeKeys(g,'i');await sleep(150);s=await S(g);
  note('A02',s.copy===true&&s.errors===1,'틀리면 오답 따라쓰기로',{copy:s.copy,errors:s.errors});
  const rv1=await g.innerText('#reveal');note('A03',/a/.test(rv1)&&rv1.includes('아'),'따라쓰기 때 공개 칸에 소리(rm·hg)',rv1.replace(/\s+/g,' ').slice(0,80));
  await typeKeys(g,'u');await sleep(100);await g.keyboard.press('Enter');await sleep(100);s=await S(g);
  note('A04',s.copy===true,'따라쓰기에서 틀린 글자(u)는 넘어가지 않는다',{copy:s.copy,input:s.input,shake:await g.evaluate(()=>document.querySelector('#quizCard').classList.contains('wrong'))});
  await g.evaluate(()=>{document.querySelector('#ainput').value='';});await typeKeys(g,'a');await sleep(150);s=await S(g);
  note('A05',s.copy===false&&s.answered===true,'따라쓰기에서 맞게 치면 받아들인다',{copy:s.copy});
  await advance(g);
  // 2~10번: 맞힌다. 3번(う)은 한글로, 4번(え)은 로마자로
  const seen=[];
  for(let i=1;i<10;i++){s=await S(g);seen.push(s.term);
    if(i===2){await g.focus('#ainput');await g.keyboard.insertText('우');await sleep(100);}
    else await typeKeys(g,s.rm);
    await sleep(120);const a=await S(g);if(!(a.answered&&!a.copy))note('A06-'+i,false,'정답 입력이 정답 처리 안 됨',{card:s.term,rm:s.rm,after:a});
    await advance(g);}
  note('A06',seen.join('')==='いうえおかきくけこ','1회독 카드 차례',seen.join(''));
  s=await S(g);
  note('A07',s.round===2&&JSON.stringify(s.targets)===JSON.stringify([0])&&s.term==='あ','2회독은 틀린 카드만',{round:s.round,targets:s.targets,term:s.term});
  await typeKeys(g,'a');await sleep(150);await advance(g);s=await S(g);
  note('A08',s.screen==='game'&&s.round===2&&s.term==='あ','2회독은 한 번 더(두 번 이어 맞혀야 통과)',{screen:s.screen,term:s.term});
  await typeKeys(g,'a');await sleep(150);await advance(g);await sleep(300);s=await S(g);
  const sum=await g.evaluate(()=>({screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),title:document.querySelector('#sumTitle').textContent,wrong:document.querySelector('#sumWrong').innerText,err:document.querySelector('#sumErr').textContent,first:document.querySelector('#sumFirst').textContent,rec:JSON.parse(localStorage.getItem('tangogoyang-kana-seoul-v1')||'{}')}));
  note('A09',sum.screen==='sum'&&sum.rec['ひらがな ①']&&sum.rec['ひらがな ①']['あ·か행'].completed===true,'완료 → 결과 화면, 진도 저장',{title:sum.title,err:sum.err,first:sum.first,wrong:sum.wrong.replace(/\s+/g,' '),rec:sum.rec});
  // 3회독에 닿을 수 있는가: 2회독에서 또 틀려 본다
  await openEx(g,'ひらがな ①','あ·か행');
  let maxRound=1,guard=0;const orderR2=[];
  for(let i=0;i<10;i++){s=await S(g);if(i<3){await typeKeys(g,'zz');await g.keyboard.press('Enter');await sleep(120);await typeKeys(g,s.rm);await sleep(120);}else{await typeKeys(g,s.rm);await sleep(120);}await advance(g);}
  s=await S(g);note('A10',s.round===2&&JSON.stringify(s.targets)===JSON.stringify([0,1,2]),'세 장 틀리면 2회독 대상 3장(차례 그대로)',{targets:s.targets});
  // 2회독: 첫 장을 또 틀리고, 그 뒤로는 다 맞힌다
  await typeKeys(g,'zz');await g.keyboard.press('Enter');await sleep(120);s=await S(g);await typeKeys(g,s.rm);await sleep(120);await advance(g);
  while(guard++<40){s=await S(g);if(!s||s.screen!=='game')break;maxRound=Math.max(maxRound,s.round);orderR2.push(s.term);await typeKeys(g,s.rm);await sleep(120);await advance(g);await sleep(60);}
  note('A11',null,'2회독에서 또 틀려도 회독 번호는 '+maxRound+'까지만 간다(3회독부터 섞는다는 코드에 닿는지)',{maxRound,orderAfterMiss:orderR2.join(' ')});

  // ---------- B. 무작위 판 ----------
  const orders=[];for(let k=0;k<4;k++){await g.evaluate(()=>{openLesson(0);startExercise(visEx(state.lessons[0]).findIndex(e=>e.title==='46자 무작위 · 인쇄체'));});await sleep(200);s=await S(g);orders.push(s.targets);}
  const ident=orders.map(o=>o.every((v,i)=>v===i));const allPerm=orders.every(o=>[...o].sort((a,b)=>a-b).every((v,i)=>v===i)&&o.length===46);
  note('B01',!ident.some(Boolean)&&allPerm&&new Set(orders.map(o=>o.join())).size===4,'46자 무작위는 1회독부터 섞이고 46장이 한 번씩',{firstFive:orders.map(o=>o.slice(0,5))});
  const rndFlags=await g.evaluate(()=>state.lessons.map(L=>L.id+': '+L.exercises.map(e=>(e.rnd?'R':'-')).join('')));
  note('B02',null,'강마다 무작위(R) 판 자리',rndFlags);
  const rndSame=await g.evaluate(()=>{const out=[];for(const L of state.lessons){const learn=new Set();L.exercises.filter(e=>!e.rnd).forEach(e=>e.words.forEach(w=>learn.add(w.term)));
    L.exercises.filter(e=>e.rnd).forEach(e=>{const t=new Set(e.words.map(w=>w.term));const miss=[...learn].filter(x=>!t.has(x)),extra=[...t].filter(x=>!learn.has(x));out.push({lesson:L.id,ex:e.title,n:e.words.length,hw:e.words.every(w=>w.hw)?1:e.words.some(w=>w.hw)?'mixed':0,notInRandom:miss,notLearned:extra});});}return out;});
  note('B03',null,'무작위 판 카드 = 그 강에서 배운 카드인가',rndSame.map(x=>`${x.lesson}/${x.ex}: ${x.n}장 hw=${x.hw} 빠짐[${x.notInRandom.join(' ')}] 안배운것[${x.notLearned.join(' ')}]`));

  // ---------- C. 시간 초과: 로마자로 ん으로 끝나는 답을 다 쳐 두고 기다리면? ----------
  await g.evaluate(()=>{openLesson(0);startExercise(visEx(state.lessons[0]).findIndex(e=>e.title==='ら·わ행·ん'));});await sleep(2800);
  for(let i=0;i<7;i++){s=await S(g);await typeKeys(g,s.rm);await sleep(120);await advance(g);}
  s=await S(g);const limit=await g.evaluate(()=>state.session.cardLimit);
  await typeKeys(g,'n');await sleep(300);const mid=await S(g);
  await g.evaluate(()=>{state.session.cardStart-=60000;});await sleep(500);const after=await S(g);
  note('C01',!(after.copy&&after.errors>0),'ん 카드에 로마자 n을 치고 기다리면(시간 초과) 오답 처리되는가',{card:s.term,limitSec:limit,typed:'n',beforeTimeout:{input:mid.input,answered:mid.answered},afterTimeout:{copy:after.copy,errors:after.errors,input:after.input}});
  await g.evaluate(()=>{document.querySelector('#exitBtn').click();});
  // 한글 조합이 열린 채 시간 초과
  await openEx(g,'ひらがな ①','あ·か행');
  await g.focus('#ainput');
  await g.evaluate(()=>{const el=document.querySelector('#ainput');el.dispatchEvent(new CompositionEvent('compositionstart'));el.value='아';el.dispatchEvent(new InputEvent('input',{isComposing:true}));});
  await sleep(200);const comp=await S(g);
  await g.evaluate(()=>{state.session.cardStart-=60000;});await sleep(500);const compAfter=await S(g);
  note('C02',!(compAfter.copy&&compAfter.errors>0),'한글 조합 중(아) 시간이 끝나면 오답 처리되는가(조합 중에는 자동 판정이 없다)',{during:{answered:comp.answered,input:comp.input},afterTimeout:{copy:compAfter.copy,errors:compAfter.errors}});
  await g.evaluate(()=>{document.querySelector('#exitBtn').click();});

  // ---------- D. 히라가나 장음 단어: 공개 칸에 보이는 소리(hg·rm)를 그대로 치면? ----------
  await g.evaluate(()=>{const li=state.lessons.findIndex(L=>L.id==='ひらがな ④');openLesson(li);startExercise(0);});await sleep(2800);
  for(let i=0;i<12;i++){s=await S(g);if(s.term==='がっこう')break;await g.focus('#ainput');await g.keyboard.insertText(s.term);await sleep(100);await advance(g);}
  s=await S(g);const dres={card:s.term,rm:s.rm,hg:s.hg};
  await typeKeys(g,'zz');await g.keyboard.press('Enter');await sleep(150);
  dres.reveal=(await g.innerText('#reveal')).replace(/\s+/g,' ').slice(0,60);
  for(const [label,txt,isH] of [['hg 그대로',s.hg,true],['rm의 ō를 o-로',s.rm.replace(/ō/g,'o-').replace(/ā/g,'a-'),false],['rm의 ō를 oo로',s.rm.replace(/ō/g,'oo').replace(/ā/g,'aa'),false]]){
    await g.evaluate(()=>{const el=document.querySelector('#ainput');el.value='';el.dispatchEvent(new Event('input'));});
    if(isH){for(const ch of txt){await g.keyboard.insertText(ch);await sleep(15);}}else await typeKeys(g,txt);
    await sleep(100);await g.keyboard.press('Enter');await sleep(120);const a=await S(g);dres[label]={typed:txt,inputAfter:a.input,accepted:!a.copy};
    if(!a.copy)break;}
  let dOk=dres['hg 그대로']&&dres['hg 그대로'].accepted;
  note('D01',!!dOk,'히라가나 장음 단어를 틀린 뒤, 공개 칸의 한글 소리·로마자대로 따라 치면 받아들이는가',dres);
  if((await S(g)).copy){await g.evaluate(()=>{const el=document.querySelector('#ainput');el.value='';el.dispatchEvent(new Event('input'));});await typeKeys(g,'gakkou');await sleep(150);note('D02',!(await S(g)).copy,'같은 카드: 가나 철자대로(gakkou)는 받아들인다',(await S(g)).input);}
  await g.evaluate(()=>{document.querySelector('#exitBtn').click();});

  // ---------- E. 모아둔 카드(五十音은 같은 글자가 여러 판에 나온다) ----------
  await openEx(g,'ひらがな ①','あ·か행');
  await g.click('#catSubmit');await sleep(200);
  const savedRaw=await g.evaluate(()=>localStorage.getItem('tangogoyang-kana-seoul-v1-saved-cards-v1'));
  await g.evaluate(()=>{document.querySelector('#exitBtn').click();document.querySelector('#backHome').click();});await sleep(200);
  const savedInfo=await g.evaluate(()=>{savedOpen();const L=state.savedLesson;const w=L.exercises[0]&&L.exercises[0].words[0];const item=savedItems()[0];return {exercises:L.exercises.map(e=>e.title+':'+e.words.length),hw:w&&w.hw,source:item&&item.source,term:w&&w.term};});
  note('E01',savedInfo.hw===0&&/あ·か행/.test(savedInfo.source||''),'あ·か행(인쇄체 획순 판)에서 담은 あ가 모아둔 카드에서도 같은 모양·출처로 나오는가',{savedRaw,savedInfo});
  await g.evaluate(()=>{startExercise(0);});await sleep(2800);const sv=await S(g);
  const svQ=await g.evaluate(()=>document.querySelector('#meaning').innerHTML.slice(0,120));
  await answerRight(g);await sleep(120);await advance(g);await sleep(300);
  const svAfter=await g.evaluate(()=>({screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),title:document.querySelector('#sumTitle').textContent,rec:Object.keys(JSON.parse(localStorage.getItem('tangogoyang-kana-seoul-v1')||'{}'))}));
  note('E02',svAfter.screen==='sum'&&!svAfter.rec.includes('모아둔 카드'),'모아둔 카드 복습은 진도에 안 섞인다',{q:svQ,svAfter});
  await g.evaluate(()=>{document.querySelector('#sumList').click();document.querySelector('#backHome').click();});

  // ---------- F. 이어하기·새로고침 ----------
  await g.reload();await sleep(600);
  const home=await g.evaluate(()=>({meta:document.querySelector('#homeMeta').textContent,resumeHidden:document.querySelector('#resumeBtn').hidden,resume:document.querySelector('#resumeSub').textContent,last:localStorage.getItem('tangogoyang-kana-seoul-last-v1')}));
  note('F01',/클리어 1\//.test(home.meta)&&!home.resumeHidden,'새로고침 뒤 진도·이어하기가 남는다',home);

  // ---------- G. 다른 두 게임에서 한 판씩 → 저장 키 ----------
  const playOne=async(f)=>{const p=await open(f);await p.evaluate(()=>{openLesson(0);startExercise(0);});await sleep(2800);
    let n=0,first=null,g2=0;while(g2++<60){const st=await S(p);if(!st||st.screen!=='game')break;if(!first)first=st;
      if(n===0&&st.round===1&&st.cur===0&&!st.copy&&!st.answered){await typeKeys(p,'zz');await p.keyboard.press('Enter');await sleep(120);n++;continue;}
      await p.focus('#ainput');await p.keyboard.insertText(st.term);await sleep(100);await advance(p);await sleep(40);}
    const r=await p.evaluate(()=>({screen:Object.keys(screens).find(k=>screens[k].classList.contains('active')),title:document.querySelector('#sumTitle').textContent,storage:STORAGE}));return {p,r};};
  const j=await playOne('tangogoyangjlpt.html');note('G01',j.r.screen==='sum','日本語能力試験 한 판 완료',j.r);
  const y=await playOne('tangogoyangyomi.html');note('G02',y.r.screen==='sum','漢字読み 한 판 완료',y.r);
  const keys=await g.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k).length])));
  const kn=Object.keys(keys);const cls=k=>k.startsWith('tangogoyang-kana-')?'kana':k.startsWith('tangogoyang-yomi-')?'yomi':k.startsWith('tangogoyang-')?'jlpt':'other';
  note('G03',null,'세 게임을 한 뒤 저장 키 전체(값 길이)',keys);
  const goy=await g.evaluate(()=>[localStorage.getItem('goyang-seoul-v1'),localStorage.getItem('goyang-hoe-seoul-v1'),localStorage.getItem('zerotwo_test')]);
  note('G04',goy[0]==='{"01강":{"Exercise 1":{"completed":true,"bestMs":1000}}}'&&goy[1]==='{"x":1}'&&goy[2]==='1'&&kn.filter(k=>/^goyang-/.test(k)).length===2,'보카고양(goyang-)·다른 게임 키는 그대로, 새로 생기지도 않는다',goy);
  const per={};kn.forEach(k=>{(per[cls(k)]=per[cls(k)]||[]).push(k);});
  const strip=(a,pre)=>a.map(k=>k.replace(pre,'')).sort().join('|');
  note('G05',strip((per.kana||[]).filter(k=>!/saved-cards/.test(k)),'tangogoyang-kana-')===strip(per.yomi||[],'tangogoyang-yomi-')&&strip(per.yomi||[],'tangogoyang-yomi-')===strip(per.jlpt||[],'tangogoyang-'),'세 게임이 같은 종류의 키를 저마다 자기 접두어로만 쓴다',per);
  const prog=await g.evaluate(()=>({kana:Object.keys(JSON.parse(localStorage.getItem('tangogoyang-kana-seoul-v1'))),yomi:Object.keys(JSON.parse(localStorage.getItem('tangogoyang-yomi-seoul-v1'))),jlpt:Object.keys(JSON.parse(localStorage.getItem('tangogoyang-seoul-v1')))}));
  note('G06',prog.kana.join()==='ひらがな ①'&&prog.yomi.join()==='N5'&&prog.jlpt.join()==='N5 ①','진도는 게임마다 따로 쌓인다(게임마다 자기 첫 강만 기록됨)',prog);
  // 한 게임의 진도가 다른 게임 화면에 보이는가
  const jHome=await j.p.evaluate(()=>{renderHome();return document.querySelector('#homeMeta').textContent;});
  const yHome=await y.p.evaluate(()=>{renderHome();return document.querySelector('#homeMeta').textContent;});
  note('G07',/클리어 1\//.test(jHome)&&/클리어 1\//.test(yHome),'각 게임 홈의 클리어 수는 자기 것만',{jHome,yHome});

  // ---------- H. 기록 옮기기(index.html) ----------
  const ix=await open('index.html#records');
  note('H01',await ix.evaluate(()=>!document.querySelector('#rtSheet').hidden),'index.html#records로 열면 창이 바로 뜬다');
  const [dl]=await Promise.all([ix.waitForEvent('download'),ix.click('#rtMake')]);
  const tmp=path.join(__dirname,'out','exported-records.json');await dl.saveAs(tmp);
  const pack=JSON.parse(fs.readFileSync(tmp,'utf8'));
  const pk=Object.keys(pack.data).sort();
  note('H02',pack.app==='tangogoyang-records'&&pk.every(k=>k.startsWith('tangogoyang-'))&&pk.length===kn.filter(k=>k.startsWith('tangogoyang-')).length,'내보낸 파일: 탄고고양 키만, 세 게임 것 전부',{name:dl.suggestedFilename(),keys:pk.length,status:await ix.innerText('#rtStatus')});
  const kinds=await ix.evaluate(ks=>Object.fromEntries(ks.map(k=>[k,rtKind(k)])),pk);
  note('H03',null,'키마다 합치는 법(rtKind)',kinds);
  // 다른 기기: 빈 저장소 + 그 기기에서 따로 한 기록
  const ctx2=await b.newContext({viewport:{width:390,height:844}});const ix2=await ctx2.newPage();ix2.on('pageerror',e=>errs.push('index(2) pageerror: '+e.message));
  await ix2.goto(base+'index.html');
  await ix2.evaluate(()=>{localStorage.setItem('tangogoyang-kana-seoul-v1',JSON.stringify({'ひらがな ①':{'あ·か행':{completed:true,bestMs:999999,lastMs:999999,attempts:10,errors:0,first:100},'さ·た행':{completed:true,bestMs:5000,lastMs:5000,attempts:10,errors:0,first:100}}}));
    localStorage.setItem('tangogoyang-kana-seoul-last-v1',JSON.stringify({lid:'ひらがな ①',title:'さ·た행'}));localStorage.setItem('goyang-seoul-v1','{"keep":1}');});
  await ix2.click('#rtOpen');await ix2.setInputFiles('#rtFile',tmp);await sleep(300);
  const st1=await ix2.innerText('#rtStatus');const conf=await ix2.evaluate(()=>!document.querySelector('#rtConfirm').hidden);
  await ix2.click('#rtMerge');await sleep(200);
  const merged=await ix2.evaluate(()=>({kana:JSON.parse(localStorage.getItem('tangogoyang-kana-seoul-v1')),last:localStorage.getItem('tangogoyang-kana-seoul-last-v1'),jl:!!localStorage.getItem('tangogoyang-seoul-v1'),yo:!!localStorage.getItem('tangogoyang-yomi-seoul-v1'),saved:localStorage.getItem('tangogoyang-kana-seoul-v1-saved-cards-v1'),goy:localStorage.getItem('goyang-seoul-v1'),status:document.querySelector('#rtStatus').textContent}));
  const mk=merged.kana['ひらがな ①'];
  note('H04',conf&&mk['さ·た행']&&mk['さ·た행'].bestMs===5000&&mk['あ·か행'].completed&&mk['あ·か행'].bestMs<999999&&merged.jl&&merged.yo&&merged.goy==='{"keep":1}'&&JSON.parse(merged.last).title==='さ·た행','합치기: 이 기기 기록은 남고, 최고 시간은 빠른 쪽, 다른 게임 기록이 들어오고, 이어하기 자리는 이 기기 것, 보카고양 키는 그대로',{before:st1,after:merged.status,kana:mk,last:merged.last,saved:merged.saved});
  await ix2.setInputFiles('#rtFile',tmp);await sleep(300);
  note('H05',/합칠 게 없다/.test(await ix2.innerText('#rtStatus')),'같은 파일을 두 번 합치면 할 일이 없다',await ix2.innerText('#rtStatus'));
  const bad1=path.join(__dirname,'out','bad-broken.json');fs.writeFileSync(bad1,'{"app":"tangogoyang-records","v":1,"data":{');
  const bad2=path.join(__dirname,'out','bad-vocagoyang.json');fs.writeFileSync(bad2,JSON.stringify({app:'vocagoyang-records',v:1,exportedAt:new Date().toISOString(),data:{'goyang-seoul-v1':'{"a":1}'}}));
  const bad3=path.join(__dirname,'out','bad-foreign-keys.json');fs.writeFileSync(bad3,JSON.stringify({app:'tangogoyang-records',v:1,data:{'goyang-seoul-v1':'{"hacked":1}','tangogoyang-kana-seoul-v1':'not json','tangogoyang-seoul-v1':'{"N5 ①":"oops"}'}}));
  const before3=await ix2.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))));
  await ix2.setInputFiles('#rtFile',bad1);await sleep(200);const m1=await ix2.innerText('#rtStatus');
  await ix2.setInputFiles('#rtFile',bad2);await sleep(200);const m2=await ix2.innerText('#rtStatus');
  await ix2.setInputFiles('#rtFile',bad3);await sleep(200);const m3=await ix2.innerText('#rtStatus');const conf3=await ix2.evaluate(()=>!document.querySelector('#rtConfirm').hidden);
  if(conf3){await ix2.click('#rtMerge');await sleep(150);}
  const after3=await ix2.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))));
  note('H06',/깨졌다/.test(m1)&&/기록 파일이 아니/.test(m2)&&before3===after3,'깨진 파일·보카고양 파일·이상한 값이 든 파일은 기록을 바꾸지 않는다',{broken:m1,vocagoyang:m2,weird:m3,confirmShown:conf3,changed:before3!==after3});
  // 합친 뒤 게임에서 그대로 보이는가
  const g2=await ctx2.newPage();await g2.goto(base+'tangogoyanggojuon.html');await sleep(500);
  note('H07',/클리어 2\//.test(await g2.innerText('#homeMeta')),'합친 기록이 五十音 홈에 보인다',await g2.innerText('#homeMeta'));
  // 게임 홈에서 교재 선택·기록 옮기기로 가는 길
  const links=await g2.evaluate(()=>[...document.querySelectorAll('a[href*="index.html"],a[href="./"],a[href$="#records"]')].map(a=>({href:a.getAttribute('href'),text:a.textContent.trim().slice(0,20),label:a.getAttribute('aria-label')||a.title||''})));
  note('H08',links.length>0,'게임 홈에서 교재 선택 화면으로 가는 링크',links);

  note('Z01',errs.length===0,'콘솔·페이지 오류',errs);
  fs.writeFileSync(path.join(__dirname,'out','flow.json'),JSON.stringify(R,null,1));
  await b.close();srv.close();
  console.log('\n실패 '+R.filter(r=>r.ok===false).length+'건 / 확인 '+R.filter(r=>r.ok===true).length+'건 / 참고 '+R.filter(r=>r.ok===null).length+'건');
})().catch(e=>{console.error(e);process.exit(1);});

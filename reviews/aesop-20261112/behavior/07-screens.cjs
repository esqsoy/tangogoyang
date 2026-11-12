// 이솝 검수: 홈·연습 목록·결과 화면을 390px로 찍어 둔다(눈으로 볼 자료). 사용: node reviews/aesop-20261112/behavior/07-screens.cjs → shots/screen-*.png
const {chromium}=require('playwright');const path=require('path');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();
  for(const [n,f] of [['gojuon','tangogoyanggojuon.html'],['jlpt','tangogoyangjlpt.html'],['yomi','tangogoyangyomi.html'],['index','index.html']]){
    const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
    await p.goto('file://'+path.join(ROOT,f));await sleep(700);
    await p.screenshot({path:path.join(__dirname,'shots','screen-'+n+'-home.png')});
    if(n!=='index'){
      const vis=await p.evaluate(()=>{const v=id=>{const e=document.getElementById(id);if(!e)return null;const r=e.getBoundingClientRect();const st=getComputedStyle(e);return {shown:r.width>0&&st.display!=='none'&&st.visibility!=='hidden',text:e.textContent.trim().slice(0,30)};};return {prevBtn:v('prevBtn'),routePct:v('routePct'),homeMeta:v('homeMeta'),scrollX:document.scrollingElement.scrollWidth-document.documentElement.clientWidth};});
      await p.evaluate(()=>{openLesson(0);});await sleep(300);await p.screenshot({path:path.join(__dirname,'shots','screen-'+n+'-lesson.png')});
      console.log(n,JSON.stringify(vis),'errors',errs.length);
    }else{await p.click('#rtOpen');await sleep(300);await p.screenshot({path:path.join(__dirname,'shots','screen-index-records.png')});
      const o=await p.evaluate(()=>{const c=document.querySelector('.rt-card').getBoundingClientRect();return {cardLeft:c.left,cardRight:c.right,cardBottom:c.bottom,vh:innerHeight,scrollX:document.scrollingElement.scrollWidth-document.documentElement.clientWidth};});console.log('index records sheet',JSON.stringify(o),'errors',errs.length);
      const p2=await b.newPage({viewport:{width:360,height:640}});await p2.goto('file://'+path.join(ROOT,f)+'#records');await sleep(400);const o2=await p2.evaluate(()=>{const c=document.querySelector('.rt-card').getBoundingClientRect();const s=document.querySelector('#rtSheet');return {cardTop:c.top,cardBottom:c.bottom,vh:innerHeight,sheetScrollable:s.scrollHeight>s.clientHeight,overflowY:getComputedStyle(s).overflowY,closeVisible:document.querySelector('#rtClose').getBoundingClientRect().top>=0};});console.log('index records 360x640',JSON.stringify(o2));}
    await p.close();}
  await b.close();})();

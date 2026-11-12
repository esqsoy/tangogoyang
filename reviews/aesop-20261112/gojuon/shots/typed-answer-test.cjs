const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
  await p.goto('file:///home/user/nihongoyang/tangogoyanggojuon.html');await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{
    const seen=new Set(),bad={rm:[],hg:[]};let n=0;
    const chk=(x,ans)=>{state.session={words:[{term:ans,jw:ans,alt:[],ar:[]}],currentId:0};const t=jpTentative(x,ans);return [isCorrect(t,ans),t];};
    for(const L of state.lessons)for(const e of L.exercises)for(const w of e.words){if(seen.has(w.term))continue;seen.add(w.term);n++;
      const [a,ta]=chk(w.rm,w.term);if(!a)bad.rm.push(w.term+' '+w.rm+'→'+ta);
      const [c,tc]=chk(w.hg,w.term);if(!c)bad.hg.push(w.term+' '+w.hg+'→'+tc);}
    state.session=null;return {n,bad};});
  console.log(r.n,'cards');console.log('rm fails',r.bad.rm.length,r.bad.rm.join(' | '));console.log('hg fails',r.bad.hg.length,r.bad.hg.join(' | '));
  await b.close();
})();

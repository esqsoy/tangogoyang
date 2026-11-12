// 이솝 검수 1-3: 五十音 카드마다 '공개 칸에 보여 주는 소리(rm·hg)'를 그대로 치면 받아들이는지. 첫 입력(문제 상태)과 오답 따라쓰기 상태를 따로 본다.
// 그리고 ん으로 끝나는 답의 로마자 끝 처리(hon / honn / hon')를 본다. 사용: node reviews/aesop-20261112/behavior/09-kana-reveal-vs-input.cjs → out/kana-reveal-vs-input.json
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+path.join(ROOT,'tangogoyanggojuon.html'));await p.waitForTimeout(500);
  await p.addScriptTag({path:path.join(__dirname,'gen-inputs.js')});await p.addScriptTag({path:path.join(__dirname,'page-helpers.js')});
  const r=await p.evaluate(()=>{const A=window.AE;const el=document.querySelector('#ainput');const seen=new Map();
    const copyOk=(w,text,hangul)=>{ // handleCopyInput + submitCopy와 같은 판정(따라쓰기에는 は→わ 봐주기가 없다)
      state.composing=false;state.session={words:[w],currentId:0,copyMode:true,copyAns:w.term,answered:true,round:1};el.value=text;jpConvertInput(true);
      let v=el.value;if(hasHangul(v))v=jpTentative(v,w.term);return isCorrect(v,w.term);};
    for(const L of state.lessons)for(const e of L.exercises)for(const w0 of e.words){const k=w0.term;if(seen.has(k)){seen.get(k).places++;continue;}
      const w={...w0,id:0};const M={ā:'a-',ī:'i-',ū:'u-',ē:'e-',ō:'o-'};
      const rmTyped=w.rm.replace(/[āīūēō]/g,c=>M[c]); // 장음 기호는 칠 수 없으니 '-'로(README: -는 ー)
      const hgTyped=w.hg.replace(/\(.*?\)/g,'').replace(/ 받침/,'').split('·')[0];
      const first={rm:A.typeAppend(w,[...rmTyped]),hg:A.typeHangul(w,hgTyped,'syl')};
      seen.set(k,{term:k,rm:w.rm,hg:w.hg,rmTyped,hgTyped,lesson:L.id,ex:e.title,places:1,firstRm:first.rm.ok,firstRmVariant:!!first.rm.variant,firstHg:first.hg.ok,firstHgVariant:!!first.hg.variant,copyRm:copyOk(w,rmTyped,false),copyHg:copyOk(w,hgTyped,true)});}
    state.session=null;
    const w={term:'ほん',meaning:'',jw:'ほん',alt:[],ar:[],id:0};
    const tail=Object.fromEntries(['hon','honn',"hon'",'ほん'].map(s=>{const x=A.typeAppend(w,[...s]);return [s,{auto:x.auto,ok:x.ok,shownBeforeEnter:(()=>{A.setCard(w);el.value='';for(const c of s){el.value+=c;jpConvertInput();}return el.value;})()}];}));
    return {cards:[...seen.values()],tail};});
  fs.writeFileSync(path.join(__dirname,'out','kana-reveal-vs-input.json'),JSON.stringify(r,null,1));
  const c=r.cards;const f=(k)=>c.filter(x=>!x[k]);
  console.log('五十音 서로 다른 카드',c.length);
  console.log('첫 입력에서 rm대로 쳐서 통과 못 함:',f('firstRm').length,'종 /',f('firstRm').reduce((a,x)=>a+x.places,0),'자리:',f('firstRm').map(x=>x.term+'('+x.rmTyped+')').join(' '));
  console.log('첫 입력에서 hg대로 쳐서 통과 못 함:',f('firstHg').length,'종 /',f('firstHg').reduce((a,x)=>a+x.places,0),'자리:',f('firstHg').map(x=>x.term+'('+x.hgTyped+')').join(' '));
  console.log('따라쓰기에서 rm대로 통과 못 함:',f('copyRm').length,'종:',f('copyRm').filter(x=>x.firstRm).map(x=>x.term+'('+x.rmTyped+')').join(' '),'(첫 입력에서는 통과하는 것만 적음)');
  console.log('따라쓰기에서 hg대로 통과 못 함:',f('copyHg').length,'종:',f('copyHg').filter(x=>x.firstHg).map(x=>x.term+'('+x.hgTyped+')').join(' '),'(첫 입력에서는 통과하는 것만 적음)');
  console.log('は→わ 봐주기로 통과:',c.filter(x=>x.firstRmVariant||x.firstHgVariant).map(x=>x.term).join(' '));
  console.log('ん 끝 처리:',JSON.stringify(r.tail));
  await b.close();})();

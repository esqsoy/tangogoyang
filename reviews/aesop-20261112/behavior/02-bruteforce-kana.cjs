// 이솝 검수 1-2: 五十音 글자 카드(가나 1~2자)마다 '모든 한글 음절 11,172개'와 '로마자 1~3자 전부(+앱 표의 4자)'를 쳐 보고,
// 정답으로 통과하는 입력을 전부 모은다. 카드에 적힌 소리(rm·hg)와 다른데 통과하는 것, 카드의 소리인데 통과 못 하는 것을 가린다.
// 사용: node reviews/aesop-20261112/behavior/02-bruteforce-kana.cjs → out/bruteforce-kana.json
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=path.resolve(__dirname,'../../..');
(async()=>{
  const b=await chromium.launch();const p=await b.newPage();
  await p.goto('file://'+path.join(ROOT,'tangogoyanggojuon.html'));await p.waitForTimeout(500);
  await p.addScriptTag({path:path.join(__dirname,'gen-inputs.js')});await p.addScriptTag({path:path.join(__dirname,'page-helpers.js')});
  const res=await p.evaluate(()=>{
    const A=window.AE;const cards=new Map();
    for(const L of state.lessons)for(const e of L.exercises)for(const w of e.words){if([...w.term].length<=2&&!cards.has(w.term))cards.set(w.term,{w:{...w,id:0},lesson:L.id,ex:e.title});}
    const letters='abcdefghijklmnopqrstuvwxyz';const romas=[];
    for(const a of letters){romas.push(a);for(const c of letters){romas.push(a+c);for(const d of letters)romas.push(a+c+d);}}
    for(const k of Object.keys(JP_ROMA))if(k.length>=4)romas.push(k);
    const out=[];
    for(const [term,{w,lesson,ex}] of cards){
      const hgOk=[],rmOk=[];
      for(let c=0xac00;c<=0xd7a3;c++){const s=String.fromCharCode(c);const r=A.typeHangul(w,s,'syl');if(r.ok)hgOk.push(s);}
      for(const s of ['ㄴ','ㅇ','ㅁ','ㅅ','ㄱ'])if(A.typeHangul(w,s,'syl').ok)hgOk.push(s);
      for(const s of romas){const r=A.typeAppend(w,[...s]);if(r.ok&&!r.early)rmOk.push(s);}
      out.push({term,rm:w.rm,hg:w.hg,lesson,ex,hgOk,rmOk});
    }
    return out;
  });
  fs.writeFileSync(path.join(__dirname,'out','bruteforce-kana.json'),JSON.stringify(res));
  // 요약: 받침 없는 음절만 보고(받침 ㄹ 계열이 무시되는 것은 따로 센다), 카드 hg와 다른 것
  const dec=c=>{const n=c.charCodeAt(0)-0xac00;return [Math.floor(n/588),Math.floor(n%588/28),n%28];};
  let lines=[];let ignoredT=new Set();
  for(const c of res){
    const plain=c.hgOk.filter(s=>s>='가'&&dec(s)[2]===0);const withT=c.hgOk.filter(s=>s>='가'&&dec(s)[2]!==0);
    withT.forEach(s=>ignoredT.add(dec(s)[2]));
    const hgSelf=c.hgOk.includes(c.hg),rmSelf=c.rmOk.includes(c.rm);
    lines.push(`${c.term}\trm=${c.rm}${rmSelf?'':' (통과 못 함!)'}\thg=${c.hg}${hgSelf?'':' (통과 못 함!)'}\t통과 로마자: ${c.rmOk.join(' ')}\t통과 한글(받침 없는 것): ${plain.join(' ')}\t받침 붙여도 통과: ${withT.length}개`);
  }
  fs.writeFileSync(path.join(__dirname,'out','bruteforce-kana.tsv'),lines.join('\n')+'\n');
  console.log(lines.join('\n'));
  const Ts=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  console.log('\n무시되는(있어도 없어도 같은) 받침:',[...ignoredT].sort((a,b)=>a-b).map(t=>Ts[t]).join(' '));
  await b.close();
})();

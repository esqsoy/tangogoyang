// 이솝 검수 1: 모의 학습(입력·판정). 세 HTML의 모든 연습·모든 카드를 로마자·한글·가나로 쳐 본다.
// 사용: node reviews/aesop-20261112/behavior/01-input-sim.cjs   → out/input-<mode>.json
// 키 입력 대신 앱 함수(jpConvertInput·jpTentative·isCorrect…)를 그대로 부른다(page-helpers.js). 앱 파일은 읽기만 한다.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=process.env.AESOP_ROOT||path.resolve(__dirname,'../../..'); // AESOP_ROOT: 다른 곳에 조립한 HTML을 볼 때(template.html로 다시 조립한 사본 등)
const SUF=process.env.AESOP_SUFFIX||'';
const FILES={meaning:'tangogoyangjlpt.html',yomi:'tangogoyangyomi.html',kana:'tangogoyanggojuon.html'};
(async()=>{
  const b=await chromium.launch();
  for(const [mode,f] of Object.entries(FILES)){
    const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
    p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
    await p.goto('file://'+path.join(ROOT,f));await p.waitForTimeout(500);
    await p.addScriptTag({path:path.join(__dirname,'gen-inputs.js')});await p.addScriptTag({path:path.join(__dirname,'page-helpers.js')});
    const res=await p.evaluate(()=>{
      const G=window.GEN,A=window.AE;const kata=s=>s.replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60));
      const out={mode:JP_MODE,lessons:state.lessons.length,exercises:0,cards:0,tests:{},fails:[],falseAccepts:[],designAccepts:{},noInput:[]};
      const T=(name,ok)=>{const t=out.tests[name]=out.tests[name]||{n:0,fail:0};t.n++;if(!ok)t.fail++;};
      const where=(L,e,i,w)=>({lesson:L.id,ex:e.title,i,term:w.term,jw:w.jw,rm:w.rm||undefined,hg:w.hg||undefined});
      const VOW={a:'あかさたなはまやらわがざだばぱゃ',i:'いきしちにひみりぎじぢびぴ',u:'うくすつぬふむゆるぐずづぶぷゅ',e:'えけせてねへめれげぜでべぺ',o:'おこそとのほもよろをごぞどぼぽょ'};
      const vowelOf=c=>{for(const k in VOW)if(VOW[k].includes(c))return k;return '';};
      const DAK={か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ'};
      const UND=Object.fromEntries(Object.entries(DAK).map(([a,b])=>[b,a]));const HAN={は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ',ば:'ぱ',び:'ぴ',ぶ:'ぷ',べ:'ぺ',ぼ:'ぽ',ぱ:'ば',ぴ:'び',ぷ:'ぶ',ぺ:'べ',ぽ:'ぼ'};
      const BIG={ゃ:'や',ゅ:'ゆ',ょ:'よ',っ:'つ',ぁ:'あ',ぃ:'い',ぅ:'う',ぇ:'え',ぉ:'お'};const SMALL=Object.fromEntries(Object.entries(BIG).map(([a,b])=>[b,a]));
      const SIM={し:['ち','つ'],ち:['し','さ'],す:['つ'],つ:['す','し'],ず:['づ'],づ:['ず'],じ:['ぢ'],ぢ:['じ'],お:['を','あ'],を:['お'],え:['へ'],へ:['え'],わ:['は','れ','ね'],は:['わ','ほ'],ほ:['は'],ぬ:['め'],め:['ぬ'],ね:['れ','わ'],れ:['ね','わ'],る:['ろ'],ろ:['る'],さ:['き','ち'],き:['さ'],ら:['ち'],い:['り'],り:['い'],そ:['ん'],ん:['そ'],の:['め'],う:['ら'],こ:['い'],た:['な'],な:['た'],く:['へ'],ま:['も'],も:['ま']};
      const mutations=(term)=>{ // 일부러 틀린 가나. [종류, 글자열]
        const h=G.hira(term),isKata=/[ァ-ヶ]/.test(term)&&!/[ぁ-ゖ]/.test(term);const m=[];const ch=[...h];
        const back=s=>isKata?kata(s):s;
        ch.forEach((c,i)=>{const pre=ch.slice(0,i).join(''),post=ch.slice(i+1).join('');const pv=i>0?vowelOf(ch[i-1]):'';
          if(c==='ー')m.push(['장음 빠짐',back(pre+post)]);
          if(i>0&&'あいうえお'.includes(c)){const v=vowelOf(c);
            if(v===pv||(c==='う'&&pv==='o')||(c==='い'&&pv==='e')){m.push(['장음 빠짐',back(pre+post)]);if(!isKata)m.push(['히라가나 말에 ー',pre+'ー'+post]);}
            if(c==='う'&&pv==='o')m.push(['おう를 おお로',back(pre+'お'+post)]);
            if(c==='お'&&pv==='o')m.push(['おお를 おう로',back(pre+'う'+post)]);
            if(c==='い'&&pv==='e')m.push(['えい를 ええ로',back(pre+'え'+post)]);}
          if(c==='っ')m.push(['っ 빠짐',back(pre+post)]);
          if(c==='ん')m.push(['ん 빠짐',back(pre+post)]);
          if(DAK[c])m.push(['탁점 더함',back(pre+DAK[c]+post)]);
          if(UND[c])m.push(['탁점 뺌',back(pre+UND[c]+post)]);
          if(HAN[c])m.push(['ば/ぱ/は 바꿈',back(pre+HAN[c]+post)]);
          if(BIG[c])m.push(['작은 글자를 크게',back(pre+BIG[c]+post)]);
          if(SMALL[c]&&i>0)m.push(['큰 글자를 작게',back(pre+SMALL[c]+post)]);
          for(const s of SIM[c]||[])m.push(['비슷한 글자',back(pre+s+post)]);
          if(i<ch.length-1&&ch[i]!==ch[i+1])m.push(['두 글자 순서 바꿈',back(pre+ch[i+1]+ch[i]+ch.slice(i+2).join(''))]);
        });
        m.push(['끝 글자 빠짐',back(ch.slice(0,-1).join(''))]);m.push(['끝에 う 더함',back(h+'う')]);
        return m.filter(([k,s])=>s&&s!==term);
      };
      const dec=c=>{const n=c.charCodeAt(0)-0xac00;return [Math.floor(n/588),Math.floor(n%588/28),n%28];};
      const com=(L,V,T)=>String.fromCharCode(0xac00+L*588+V*28+T);const isSyl=c=>c>='가'&&c<='힣';
      const hgMut=(hg)=>{ // 일부러 틀린 한글. [종류, 글자열, 설계상 허용인가]
        const m=[];const ch=[...hg];
        ch.forEach((c,i)=>{const rep=x=>ch.slice(0,i).join('')+x+ch.slice(i+1).join('');
          if(c==='-')m.push(['한글: 장음(-) 빠짐',rep('')]);
          if(!isSyl(c))return;const [L,V,T]=dec(c);
          if(T===19)m.push(['한글: 받침 ㅅ(っ) 빠짐',rep(com(L,V,0))]);
          if(T===4)m.push(['한글: 받침 ㄴ(ん) 빠짐',rep(com(L,V,0))]);
          if(T===0)m.push(['한글: 받침 ㄹ 더함',rep(com(L,V,8))]);
          if(c==='우'&&i>0)m.push(['한글: 장음 우 빠짐',rep('')]);
          const LS={15:0,16:3,17:7}; // ㅋ→ㄱ, ㅌ→ㄷ, ㅍ→ㅂ
          if(L in LS)m.push(['한글: 거센소리를 예사소리로(카→가·타→다·파→바)',rep(com(LS[L],V,T)),true]);
          const LA={0:15,3:16,7:17};
          if(L in LA)m.push(['한글: 예사소리를 거센소리로(가→카·다→타·바→파)',rep(com(LA[L],V,T))]);
          if(L===14)m.push(['한글: ㅊ을 ㅈ으로(치→지·츠→즈·차→자)',rep(com(12,V,T))]);
          if(L===12)m.push(['한글: ㅈ을 ㅊ으로(지→치·자→차)',rep(com(14,V,T))]);
          if(L===17)m.push(['한글: ㅍ을 ㅎ으로(파→하)',rep(com(18,V,T))]);
          if(L===18)m.push(['한글: ㅎ을 ㅍ으로(하→파)',rep(com(17,V,T))]);
          if(L===9)m.push(['한글: ㅅ을 ㅆ으로(스→쓰)',rep(com(10,V,T))]);
          if(V===8)m.push(['한글: ㅗ를 ㅓ로(오→어)',rep(com(L,4,T))]);
          if(V===13)m.push(['한글: ㅜ를 ㅡ로(우→으)',rep(com(L,18,T))]);
          if(V===5)m.push(['한글: ㅔ를 ㅐ로(에→애)',rep(com(L,1,T))]);
          if(V===12)m.push(['한글: ㅛ를 ㅕ로(요→여)',rep(com(L,6,T))]);
          if(V===0)m.push(['한글: ㅏ를 ㅓ로(아→어)',rep(com(L,4,T))]);
          if(V===20)m.push(['한글: ㅣ를 ㅢ로(이→의)',rep(com(L,20===V?20:V,T)).replace(c,com(L,19+1,T))]);
        });
        return m.filter(([k,s])=>s&&s!==hg);
      };
      const seen=new Map(); // 같은 카드(뜻·표기까지 같은)는 한 번만 깊이 본다. 자리 목록은 남긴다.
      for(const L of state.lessons){for(const e of L.exercises){out.exercises++;e.words.forEach((w0,i)=>{out.cards++;
        const w={...w0,id:0};const key=JSON.stringify([w.term,w.jw,w.alt,w.ar,w.rm,w.hg]);
        if(seen.has(key)){seen.get(key).push(where(L,e,i,w));return;}
        const places=[where(L,e,i,w)];seen.set(key,places);
        const fail=(test,input,r)=>out.fails.push({test,input,got:r.final,auto:r.auto,early:r.early,simError:r.simError,places});
        const run=(test,input,chunks)=>{const r=A.typeAppend(w,chunks);T(test,r.ok);if(!r.ok)fail(test,input,r);return r;};
        // (a) 로마자
        const hep=G.romaji(w.term,'hep');
        if(hep==null)out.noInput.push({kind:'로마자 생성 못 함',places});
        else{
          run('a1 헵번식(한 자씩)',hep,[...hep]);
          const nn=G.romaji(w.term,'hep-nn');if(nn!==hep)run('a2 ん을 nn으로(한 자씩)',nn,[...nn]);
          const vv=G.romaji(w.term,'hep-vv');if(vv!==hep)run('a3 ー를 모음 되풀이로',vv,[...vv]);
          const wap=G.romaji(w.term,'wap');if(wap!==hep)run('a4 와프로식(du·di·wo·thi)',wap,[...wap]);
          run('a5 헵번식 통째로 붙여넣기',hep,[hep]);
        }
        if(JP_MODE==='kana'&&w.rm){
          const raw=w.rm;const r0=A.typeAppend(w,[...raw]);T('a6 五十音 카드 rm 그대로',r0.ok);if(!r0.ok)fail('a6 五十音 카드 rm 그대로',raw,r0);
          if(/[āīūēō]/.test(raw)){const M={ā:'a',ī:'i',ū:'u',ē:'e',ō:'o'};
            const dbl=raw.replace(/[āīūēō]/g,c=>M[c]+M[c]);run('a7 rm 장음을 모음 두 번으로(ō→oo)',dbl,[...dbl]);
            const dash=raw.replace(/[āīūēō]/g,c=>M[c]+'-');run('a8 rm 장음을 -로(ō→o-)',dash,[...dash]);
            const short=raw.replace(/[āīūēō]/g,c=>M[c]);const r=A.typeAppend(w,[...short]);T('x 五十音 rm 장음 빼고(틀려야)',!(r.ok&&!r.early));if(r.ok&&!r.early)out.falseAccepts.push({kind:'로마자: 장음 빠짐',input:short,got:r.final,places});}
        }
        // (b) 한글
        const hgs=[];const h1=G.hangul(w.term,false),h2=G.hangul(w.term,true);
        if(h1==null)out.noInput.push({kind:'한글 생성 못 함',places});else{hgs.push(['b1 한글 소리',h1]);if(h2&&h2!==h1)hgs.push(['b2 한글 소리(챠·쓰 식)',h2]);}
        if(JP_MODE==='kana'&&w.hg)hgs.push(['b3 五十音 카드 hg 그대로',w.hg]);
        for(const [name,hg] of hgs){
          for(const m of ['jamo','syl']){const r=A.typeHangul(w,hg,m);const t=name+(m==='jamo'?'(자모 단위)':'(음절 단위)');T(t,r.ok);if(!r.ok)fail(t,hg,r);}
        }
        // (c) 가나 직접
        run('c1 가나 한 자씩',w.term,[...w.term]);run('c2 가나 통째로',w.term,[w.term]);
        const other=/[ァ-ヶ]/.test(w.term)?G.hira(w.term):kata(w.term);if(other!==w.term)run('c3 다른 가나 글자로(ひら↔カタ)',other,[other]);
        if(JP_MODE==='meaning'){for(const f of new Set([w.jw,...(w.alt||[])]))if(f&&f!==w.term)run('c4 한자·별표기(w·alt)',f,[f]);}
        if(JP_MODE==='yomi'){const r=A.typeAppend(w,[w.jw]);T('x 漢字読み: 한자 그대로(틀려야)',!r.ok);if(r.ok)out.falseAccepts.push({kind:'漢字読み에서 한자 그대로',input:w.jw,places});}
        for(const f of w.ar||[])run('c5 다른 표준 읽기(ar)',f,[f]);
        // 일부러 틀린 입력
        A.setCard(w);const okSet=new Set([w.term,...(w.ar||[]),...(JP_MODE==='yomi'?[]:[w.jw,...(w.alt||[])])].map(x=>normalize(x)));
        for(const [kind,s] of mutations(w.term)){
          A.setCard(w);const pass=isCorrect(s,w.term)||isSpellingVariant(s,w.term);const legit=okSet.has(normalize(s))&&!/ー/.test(s);
          T('x 가나: '+kind+'(틀려야)',!pass||legit);
          if(pass&&!legit)out.falseAccepts.push({kind:'가나: '+kind,input:s,places});
          // 같은 틀린 가나를 로마자로 쳐도 틀려야 한다
          const rr=G.romaji(s,'hep');if(rr&&rr!==hep){const r=A.typeAppend(w,[...rr]);
            const bad=r.ok&&!r.early&&!okSet.has(normalize(s));T('x 로마자: '+kind+'(틀려야)',!bad);
            if(bad)out.falseAccepts.push({kind:'로마자: '+kind,input:rr,got:r.final,places});}
        }
        const baseHg=(JP_MODE==='kana'&&w.hg&&!/[^가-힣\-ㄴㅅ]/.test(w.hg))?w.hg:h1;
        if(baseHg)for(const [kind,s,design] of hgMut(baseHg)){
          const r=A.typeHangul(w,s,'jamo');
          if(design){const d=out.designAccepts[kind]=out.designAccepts[kind]||{n:0,pass:0};d.n++;if(r.ok&&!r.early)d.pass++;continue;}
          const badH=r.ok&&!r.early;T('x '+kind+'(틀려야)',!badH);
          if(badH)out.falseAccepts.push({kind,input:s,base:baseHg,got:r.final,places});
        }
      });}}
      out.unique=seen.size;return out;
    });
    res.pageErrors=errs;
    fs.writeFileSync(path.join(__dirname,'out','input-'+mode+SUF+'.json'),JSON.stringify(res,null,1));
    console.log(`\n== ${f} (${res.mode}) ${res.lessons}강 ${res.exercises}연습 ${res.cards}카드(서로 다른 카드 ${res.unique}) 오류 ${errs.length}`);
    for(const [k,v] of Object.entries(res.tests))console.log(`  ${v.fail?'FAIL':'ok  '} ${k}: ${v.n}번 중 ${v.fail}번 실패`);
    console.log('  설계상 허용:',JSON.stringify(res.designAccepts));console.log('  입력 못 만든 카드:',res.noInput.length,' 통과 못 한 것:',res.fails.length,' 틀렸는데 통과:',res.falseAccepts.length);
    await p.close();
  }
  await b.close();
})();

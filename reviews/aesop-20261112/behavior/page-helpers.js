// 이솝 검수용: 페이지 안에 넣는 흉내 도구. 앱 코드는 고치지 않고, 앱 함수(jpConvertInput·isCorrect·jpTentative·normalize·isSpellingVariant)를 그대로 부른다.
// mirrorTyped()/submit()의 판정 흐름을 화면 그리기만 빼고 그대로 옮겼다(template.html 2851~2910행 기준).
window.AE=(()=>{
  const el=document.getElementById('ainput');
  function setCard(w){state.composing=false;state.session={words:[w],currentId:0,copyMode:false,copyAns:'',answered:false,round:1};}
  function judgeFinal(w){jpConvertInput(true);const typed=el.value;let ok=isCorrect(typed,w.term),variant=false;
    if(!ok&&typed.trim()&&isSpellingVariant(typed,w.term)){ok=true;variant=true;}return {ok,variant,final:typed};}
  // 한 '입력 이벤트' 뒤 mirrorTyped가 하는 일. 반환: null(계속) 또는 판정
  function afterInput(w){
    jpConvertInput();const raw=el.value;
    if(hasHangul(raw)){const t=jpTentative(raw,w.term);if(isCorrect(t,w.term)){el.value=t;return {...judgeFinal(w),auto:true};}return null;}
    const entered=normalize(raw).replace(/\s/g,''),target=normalize(w.term).replace(/\s/g,'');
    const ready=isCorrect(raw,w.term)||(!jpPending(raw)&&entered.length>=target.length&&target.length>0);
    if(ready)return {...judgeFinal(w),auto:true};
    return null;
  }
  // values: 입력칸에 차례로 '덧붙일' 조각들(로마자·가나). 한 조각 = 입력 이벤트 하나.
  function typeAppend(w,chunks){setCard(w);el.value='';
    for(let i=0;i<chunks.length;i++){el.value+=chunks[i];const r=afterInput(w);if(r)return {...r,at:i+1,of:chunks.length,early:i+1<chunks.length};}
    return {...judgeFinal(w),auto:false,at:chunks.length,of:chunks.length,early:false};}
  // 한글: 조합 이벤트 없이 자모가 합쳐져 들어오는 자판(iOS 등) 흉내. states = 아직 가나로 안 바뀐 '한글 꼬리'의 차례 상태.
  // 두벌식 자동기계: 음절 목록 → 화면에 보이는 한글 문자열의 변화. 앱이 앞부분을 가나로 바꾸면 그 길이만큼 앞을 가나로 둔 채 꼬리만 바꾼다.
  const Ls='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',Ts=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const dec=c=>{const n=c.charCodeAt(0)-0xac00;return [Math.floor(n/588),Math.floor(n%588/28),n%28];};
  const com=(L,V,T)=>String.fromCharCode(0xac00+L*588+V*28+T);
  function hangulStates(text){ // text: 한글 음절·자모·'-' 섞인 문자열 → 치는 동안 보이는 전체 문자열들의 차례
    const out=[];let done='';const chars=[...text];
    for(let i=0;i<chars.length;i++){const c=chars[i],code=c.charCodeAt(0);
      if(code<0xac00||code>0xd7a3){done+=c;out.push(done);continue;}
      const [L,V,T]=dec(c);
      // 앞 글자가 받침 없는 음절이고 이 글자의 초성이 받침이 될 수 있으면: 먼저 앞 글자의 받침으로 붙는다
      const prev=done.slice(-1),pc=prev.charCodeAt(0);
      const tIdx=Ts.indexOf(Ls[L]);
      if(prev&&pc>=0xac00&&pc<=0xd7a3&&dec(prev)[2]===0&&tIdx>0){const [pl,pv]=dec(prev);out.push(done.slice(0,-1)+com(pl,pv,tIdx));}
      else out.push(done+Ls[L]);
      out.push(done+com(L,V,0));
      if(T){out.push(done+com(L,V,T));}
      done+=c;
    }
    return out;
  }
  function typeHangul(w,text,mode){ // mode 'jamo' = 자모 단위 상태, 'syl' = 음절 단위(조합 이벤트 있는 자판: 음절이 확정될 때만 본다)
    setCard(w);el.value='';
    const states=mode==='syl'?[...text].map((_,i)=>[...text].slice(0,i+1).join('')):hangulStates(text);
    // 앱이 앞부분을 가나로 바꿔 두므로, '원문 한글 상태'와 '입력칸 값'의 대응을 유지한다: 입력칸 값 = (이전에 바뀐 가나 접두) + 아직 안 바뀐 한글 꼬리.
    let rawPrev='';let conv='';// conv: 입력칸 현재 값
    for(let i=0;i<states.length;i++){const st=states[i];
      // 이전 상태와 공통 접두를 뺀 꼬리만큼 입력칸 끝을 갈아 끼운다
      let k=0;while(k<rawPrev.length&&k<st.length&&rawPrev[k]===st[k])k++;
      const del=rawPrev.length-k;const add=st.slice(k);
      // 입력칸 값 끝에서 del 글자를 지운다(가나로 이미 바뀐 글자는 지우지 않는다고 가정: 꼬리 한글만 남아 있어야 한다)
      const cur=el.value;const tail=cur.slice(cur.length-del);
      if(del&&tail!==rawPrev.slice(k)){return {ok:false,simError:'꼬리 불일치',cur,rawPrev,st};}
      el.value=cur.slice(0,cur.length-del)+add;rawPrev=st;
      const r=afterInput(w);if(r)return {...r,at:i+1,of:states.length,early:i+1<states.length};
      // 앱이 앞을 가나로 바꿨다. rawPrev는 그대로 두되, 다음 비교에서 지울 꼬리는 한글 끝 글자뿐이다.
    }
    return {...judgeFinal(w),auto:false,at:states.length,of:states.length,early:false};
  }
  return {setCard,typeAppend,typeHangul,hangulStates,judgeFinal};
})();

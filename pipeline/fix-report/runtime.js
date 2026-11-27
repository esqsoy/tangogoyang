/* 고칠 점 남기기(fix-report). 고양 단어 게임끼리 같이 쓰는 파일이다. 게임 값은 config.json(→ FIX_REPORT_CONFIG),
   게임과의 연결은 게임 쪽이 window.FIX_REPORT_HOST로 준다:
     storageKey() 저장 키, course() 과정 이름, current() 지금 카드 {id, front, answer, place} 또는 null,
     pause() 저절로 넘어가기 멈춤, resume() 다시 넘어가기, card() 단추를 붙일 카드 요소.
   카드 id는 그 게임의 '모아둔 카드' id를 그대로 쓴다(받은 글로 카드를 정확히 찾으려고). 26.11.28 */
var fixReportCore=(function(){
  function clean(s,n){return String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n||400);}
  function read(raw){try{const a=JSON.parse(raw||'[]');return Array.isArray(a)?a.filter(r=>r&&typeof r.id==='string'&&typeof r.kind==='string'):[];}catch(e){return [];}}
  /* 같은 카드·같은 종류는 하나로(메모는 새 것으로, 보낸 표시는 지움). */
  function add(list,item,now){
    const it={id:clean(item.id,300),kind:clean(item.kind,30),memo:clean(item.memo,400),course:clean(item.course,60),front:clean(item.front,120),answer:clean(item.answer,120),place:clean(item.place,120),at:now};
    const out=list.filter(r=>!(r.id===it.id&&r.kind===it.kind&&r.course===it.course));
    out.push(it);return out;
  }
  function unsent(list){return list.filter(r=>!r.sent);}
  function day(ms){const d=new Date(ms);return String(d.getFullYear()%100).padStart(2,'0')+'.'+(d.getMonth()+1)+'.'+d.getDate();}
  /* 사람이 읽는 줄 + 끝에 기계가 읽는 한 줄(#고칠점 v1). 카톡·대화에 그대로 붙여도 된다. */
  function text(game,list,now){
    const rows=unsent(list);
    const lines=['⚑ '+game+' 고칠 점 '+rows.length+'개 ('+day(now)+')'];
    rows.forEach((r,i)=>lines.push((i+1)+'. '+[r.course,r.place].filter(Boolean).join(' · ')+' · '+r.answer+(r.front?'('+r.front+')':'')+' — '+r.kind+(r.memo?': '+r.memo:'')));
    lines.push('#고칠점 v1 '+JSON.stringify(rows.map(r=>[r.course,r.id,r.kind,r.memo])));
    return lines.join('\n');
  }
  function markSent(list,now){return list.map(r=>r.sent?r:Object.assign({},r,{sent:now}));}
  return {read,add,unsent,text,markSent,day};
})();
if(typeof module!=='undefined')module.exports=fixReportCore;

var fixReport=(function(){
  if(typeof document==='undefined')return null;
  const C=(typeof FIX_REPORT_CONFIG!=='undefined'&&FIX_REPORT_CONFIG)||{};
  const H=()=>window.FIX_REPORT_HOST||{};
  const key=()=>H().storageKey?H().storageKey():'fix-reports';
  function load(){try{return fixReportCore.read(localStorage.getItem(key()));}catch(e){return [];}}
  function save(list){try{localStorage.setItem(key(),JSON.stringify(list));return true;}catch(e){return false;}}
  function toast(msg){const t=document.createElement('div');t.className='fx-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);}
  function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
  let flag=null,sheet=null;
  function offReveal(){if(flag){const c=flag.parentElement;flag.remove();flag=null;if(c)c.classList.remove('fx-has-flag');}}
  function onReveal(){
    offReveal();const h=H(),cur=h.current&&h.current(),card=h.card&&h.card();
    if(!cur||!card)return;
    flag=el('button','fx-flag');flag.type='button';flag.setAttribute('aria-label','이 카드의 고칠 점 남기기');
    const has=load().some(r=>r.id===cur.id&&!r.sent);if(has)flag.classList.add('on');
    flag.innerHTML='⚑ <span>고칠 점</span>';
    flag.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();open(cur);});
    if(getComputedStyle(card).position==='static')card.style.position='relative';
    card.classList.add('fx-has-flag');card.appendChild(flag);
  }
  function close(resume){if(sheet){sheet.bg.remove();sheet.box.remove();sheet=null;}if(resume){const h=H();if(h.resume)h.resume();}}
  function open(cur){
    const h=H();if(h.pause)h.pause();close(false);
    const bg=el('div','fx-bg'),box=el('div','fx-sheet');box.setAttribute('role','dialog');box.setAttribute('aria-label','고칠 점 남기기');
    box.appendChild(el('h3',null,'⚑ 이 카드에서 이상한 곳'));
    box.appendChild(el('p','fx-sub','고른 것과 메모가 이 기기에 모인다. 처음 화면에서 한꺼번에 복사해 보낸다.'));
    const cd=el('div','fx-card');cd.appendChild(document.createTextNode((cur.front||'')+' '));cd.appendChild(el('span','fx-ans',cur.answer||''));
    cd.appendChild(el('div','fx-place',[h.course&&h.course(),cur.place].filter(Boolean).join(' · ')));box.appendChild(cd);
    const chips=el('div','fx-chips');let kind=null;const go=el('button','fx-btn fx-main','남기기');go.type='button';go.disabled=true;
    (C.kinds||['기타']).forEach(k=>{const b=el('button','fx-chip',k);b.type='button';b.setAttribute('aria-pressed','false');
      b.onclick=()=>{kind=k;chips.querySelectorAll('.fx-chip').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));go.disabled=false;};chips.appendChild(b);});
    box.appendChild(chips);
    const memo=el('textarea','fx-memo');memo.placeholder='메모(안 써도 된다)';memo.maxLength=400;box.appendChild(memo);
    const row=el('div','fx-row'),no=el('button','fx-btn','취소');no.type='button';row.appendChild(no);row.appendChild(go);box.appendChild(row);
    no.onclick=()=>close(true);bg.onclick=()=>close(true);
    go.onclick=()=>{if(!kind)return;const ok=save(fixReportCore.add(load(),{id:cur.id,kind,memo:memo.value,course:h.course&&h.course(),front:cur.front,answer:cur.answer,place:cur.place},Date.now()));
      close(true);if(flag)flag.classList.add('on');toast(ok?'고칠 점을 남겼다고양 ✦':'저장 공간이 꽉 차서 못 남겼다고양');};
    box.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')close(true);});
    document.body.appendChild(bg);document.body.appendChild(box);sheet={bg,box};
  }
  async function copy(txt){
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(txt);return true;}}catch(e){}
    try{const t=document.createElement('textarea');t.value=txt;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();if(ok)return true;}catch(e){}
    return false;
  }
  function showText(txt){ /* 복사가 막힌 브라우저: 글을 보여 주고 손으로 고르게 한다 */
    close(false);const bg=el('div','fx-bg'),box=el('div','fx-sheet');box.appendChild(el('h3',null,'⚑ 고칠 점'));
    box.appendChild(el('p','fx-sub','복사가 안 돼서 글을 보여 준다고양. 길게 눌러 전부 골라 복사해 보내 줘.'));
    const ta=el('textarea','fx-copybox');ta.value=txt;ta.readOnly=true;box.appendChild(ta);
    const b=el('button','fx-btn fx-main','닫기');b.type='button';b.onclick=()=>close(false);box.appendChild(b);bg.onclick=()=>close(false);
    document.body.appendChild(bg);document.body.appendChild(box);sheet={bg,box};ta.focus();ta.select();
  }
  function renderHome(parent,before){
    const list=load(),n=fixReportCore.unsent(list).length;if(!n||!parent)return null;
    const row=el('div','fx-home'),t=el('div','fx-t');t.appendChild(el('b',null,'⚑ 고칠 점 '+n+'개'));t.appendChild(document.createElement('br'));
    t.appendChild(document.createTextNode('복사해서 보내 주면 고친다고양'));row.appendChild(t);
    const b=el('button','fx-c','복사');b.type='button';row.appendChild(b);
    b.onclick=async()=>{const now=Date.now(),txt=fixReportCore.text(C.game||'',load(),now);
      if(await copy(txt)){save(fixReportCore.markSent(load(),now));row.remove();toast('고칠 점 '+n+'개를 복사했다고양 ✦ 붙여서 보내 줘');}
      else{save(fixReportCore.markSent(load(),now));row.remove();showText(txt);}};
    parent.insertBefore(row,before||null);return row;
  }
  return {onReveal,offReveal,renderHome,open,load,isOpen:()=>!!sheet};
})();

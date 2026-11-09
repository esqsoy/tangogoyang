(function(){
  const $=id=>document.getElementById(id);
  const sheet=$('rtSheet'),status=$('rtStatus'),file=$('rtFile'),confirmBox=$('rtConfirm');
  if(!sheet)return;
  let pending=null;
  function say(text,kind){status.textContent=text;status.className='rt-status'+(kind?' '+kind:'');}
  function open(){sheet.hidden=false;document.body.classList.add('rt-lock');say('');confirmBox.hidden=true;pending=null;$('rtMake').focus();}
  function close(){sheet.hidden=true;document.body.classList.remove('rt-lock');pending=null;if(location.hash==='#records')history.replaceState(null,'',location.pathname+location.search);}
  function store(){try{return window.localStorage;}catch(e){return null;}}
  function today(){const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
  $('rtOpen').addEventListener('click',open);
  $('rtClose').addEventListener('click',close);
  sheet.addEventListener('click',e=>{if(e.target===sheet)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)close();});
  if(location.hash==='#records')open();

  // ① 기록 파일 만들기: 폰이면 공유 시트(카톡 '나와의 채팅' 등), 아니면 파일로 저장.
  $('rtMake').addEventListener('click',async()=>{
    const s=store();if(!s){say('이 브라우저는 기록을 저장하지 못한다고양.','bad');return;}
    const data=rtCollect(s);
    if(!Object.keys(data).length){say('아직 옮길 기록이 없다고양. 한 판이라도 하고 오라고양.','bad');return;}
    const text=JSON.stringify(rtPack(data,Date.now())),name=RT_GAME+'-기록-'+today()+'.json';
    const blob=new Blob([text],{type:'application/json'});
    try{
      const f=new File([blob],name,{type:'application/json'});
      if(navigator.canShare&&navigator.canShare({files:[f]})&&matchMedia('(pointer:coarse)').matches){
        await navigator.share({files:[f],title:RT_GAME+' 기록'});
        say('보냈다고양. 다른 기기에서 그 파일을 열면 된다고양.','ok');return;
      }
    }catch(e){if(e&&e.name==='AbortError'){say('');return;}}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);
    say('‘'+name+'’을 저장했다고양. 이 파일을 다른 기기로 보내라고양.','ok');
  });

  // ② 기록 파일 열기: 읽고, 무엇이 늘어나는지 보여 준 뒤 합친다.
  file.addEventListener('change',()=>{
    const f=file.files&&file.files[0];file.value='';if(!f)return;
    const s=store();if(!s){say('이 브라우저는 기록을 저장하지 못한다고양.','bad');return;}
    const r=new FileReader();
    r.onerror=()=>say('파일을 못 읽었다고양.','bad');
    r.onload=()=>{
      let got;try{got=rtParse(String(r.result||''));}catch(e){say(e.message,'bad');confirmBox.hidden=true;return;}
      const m=rtMerge(rtCollect(s),got.data),keys=Object.keys(m.writes);
      if(!keys.length){say('이미 이 기기에 다 있는 기록이라고양. 합칠 게 없다고양.','ok');confirmBox.hidden=true;return;}
      pending=m;
      const parts=[];
      if(m.summary.exercises)parts.push('클리어한 연습 '+m.summary.exercises+'개');
      if(m.summary.stamps)parts.push('세트 도장 '+m.summary.stamps+'개');
      if(m.summary.saved)parts.push('모아둔 카드 '+m.summary.saved+'장');
      say((parts.length?parts.join(' · ')+'이 늘어난다고양.':'자잘한 기록이 더해진다고양.')+' 이 기기 기록은 지우지 않고 합친다고양.');
      confirmBox.hidden=false;$('rtMerge').focus();
    };
    r.readAsText(f);
  });
  $('rtMerge').addEventListener('click',()=>{
    const s=store();if(!pending||!s)return;
    const w=pending.writes;
    try{Object.keys(w).forEach(k=>s.setItem(k,w[k]));}
    catch(e){say('저장 공간이 모자라서 다 못 합쳤다고양. 브라우저 저장 공간을 확인하라고양.','bad');return;}
    pending=null;confirmBox.hidden=true;
    say('합쳤다고양! 이제 교재를 열면 이어서 할 수 있다고양. 다른 탭에 게임이 열려 있으면 새로고침하라고양.','ok');
  });
  $('rtCancel').addEventListener('click',()=>{pending=null;confirmBox.hidden=true;say('안 합쳤다고양.');});
})();

'use strict';
/* 기록 옮기기 공통 검사(SHARED.md '같이 쓰는 파일'). 분가도 그대로 복사해 `node pipeline/record-transfer/test.cjs`로 돌린다.
   - 합치기 규칙: 게임과 상관없는 시험용 설정(testgoyang-)으로 본다. 규칙은 merge.js에만 있으니 어느 게임에서 돌려도 같아야 한다.
   - 이 게임 설정: config.json을 읽어 접두어·옮기지 않을 키·키 종류 패턴·넣을 HTML을 본다.
   게임마다 실제 키 이름이 맞는 종류로 가는지는 각 저장소의 자기 검사에서 본다(보카고양은 pipeline/tests/record-transfer.test.cjs).
   26.11.12 탄고고양 요청(AL '[보카고양] 기록 옮기기 검사 파일이 goyang- 키에 묶여 있어 분가가 못 돌림')으로 나눴다. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname,root=path.join(dir,'..','..');
const code=fs.readFileSync(path.join(dir,'merge.js'),'utf8');
const cfg=JSON.parse(fs.readFileSync(path.join(dir,'config.json'),'utf8'));
const J=JSON.stringify,P=s=>JSON.parse(s),R=x=>JSON.parse(JSON.stringify(x));   // R: vm 쪽 객체를 이쪽 객체로
function load(config){const ctx={RT_CONFIG:config};vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;}
function fakeStore(obj){const keys=Object.keys(obj);return {length:keys.length,key:i=>keys[i],getItem:k=>obj[k]??null};}

/* ── 1. 합치기 규칙(시험용 설정) ── */
const T={game:'시험고양',app:'testgoyang-records',prefix:'testgoyang-',skip:['testgoyang-unlock-v1'],kinds:{
  progress:'^testgoyang-progress-v1$',saved:'-saved-v1$',learned:'^testgoyang-learned-v1$',missed:'^testgoyang-missed-v1$',
  milestone:'^testgoyang-milestone-v1$',stamps:'^testgoyang-stamps-v1$',paceMeta:'^testgoyang-pace-meta-',pace:'^testgoyang-pace-'}};
const rt=load(T);
const K={prog:'testgoyang-progress-v1',saved:'testgoyang-progress-v1-saved-v1',learned:'testgoyang-learned-v1',missed:'testgoyang-missed-v1',
  ms:'testgoyang-milestone-v1',stamps:'testgoyang-stamps-v1',pace:'testgoyang-pace-a-v1',paceMeta:'testgoyang-pace-meta-a-v1'};

// 모으기: 접두어 키만, 옮기지 않을 키는 뺀다. 같은 주소의 다른 게임 키는 건드리지 않는다.
assert.deepEqual(Object.keys(rt.rtCollect(fakeStore({[K.prog]:'{}','testgoyang-unlock-v1':'1','goyang-seoul-v1':'x','xtestgoyang-a':'y','zerotwo_save_v1':'z'}))),[K.prog]);
// 파일 형식
const packed=J(rt.rtPack({'testgoyang-uni-v1':'서울대'},Date.UTC(2026,10,4)));
assert.deepEqual(R(rt.rtParse(packed).data),{'testgoyang-uni-v1':'서울대'});
assert.throws(()=>rt.rtParse('not json'),/깨졌다/);
assert.throws(()=>rt.rtParse(J({app:'other',v:1,data:{}})),/시험고양 기록 파일이 아니라고양/);
assert.throws(()=>rt.rtParse(J({app:T.app,v:rt.RT_VERSION+1,data:{}})),/새 판/);
assert.deepEqual(R(rt.rtParse(J({app:T.app,v:1,data:{'testgoyang-a':'1','evil':'x','testgoyang-b':5,'testgoyang-unlock-v1':'1'}})).data),{'testgoyang-a':'1'});
// 종류: 위에서부터 처음 맞는 것, 없으면 keep
assert.equal(rt.rtKind(K.prog),'progress');assert.equal(rt.rtKind(K.saved),'saved');
assert.equal(rt.rtKind(K.paceMeta),'paceMeta');assert.equal(rt.rtKind(K.pace),'pace');assert.equal(rt.rtKind('testgoyang-last-v1'),'keep');
// 진도: 한쪽이라도 클리어면 클리어, 둘 다면 이 기기 것 + 더 빠른 최고 시간
{
  const m=rt.rtMerge({[K.prog]:J({a:{e1:{completed:true,bestMs:5000,lastMs:6000},e2:{tries:1}}})},
    {[K.prog]:J({a:{e1:{completed:true,bestMs:4000,lastMs:9000},e2:{completed:true,bestMs:7000},e3:{completed:true}},b:{x:{completed:true}}})});
  const o=P(m.writes[K.prog]);
  assert.deepEqual(o.a.e1,{completed:true,bestMs:4000,lastMs:6000});
  assert.equal(o.a.e2.completed,true);assert.equal(o.a.e3.completed,true);assert.equal(o.b.x.completed,true);
  assert.equal(m.summary.exercises,3);
  assert.deepEqual(R(rt.rtMerge({[K.prog]:J({a:{e1:{completed:true,bestMs:3000}}})},{[K.prog]:J({a:{e1:{completed:true,bestMs:4000}}})}).writes),{});
  assert.equal(rt.rtMerge({},{[K.prog]:J({s0:{a:{completed:true},b:{completed:true}},s1:{c:{}}})}).summary.exercises,2);
}
// 모아둔 카드: 합집합, 이 기기 순서 먼저, 담은 때는 이른 쪽
{
  const m=rt.rtMerge({[K.saved]:J([{id:'a',addedAt:10},{id:'b',addedAt:20}])},{[K.saved]:J([{id:'c',addedAt:40},{id:'a',addedAt:5},{id:'d',addedAt:30},{nope:1}])});
  assert.deepEqual(P(m.writes[K.saved]),[{id:'a',addedAt:5},{id:'b',addedAt:20},{id:'d',addedAt:30},{id:'c',addedAt:40}]);
  assert.equal(m.summary.saved,2);
}
// 익힌 단어(교재마다 합집합)·틀린 단어(큰 횟수)·돌파(큰 쪽)
{
  const m=rt.rtMerge({[K.learned]:J({c1:['a','b']}),[K.missed]:J({a:2,b:1}),[K.ms]:J({seen:1000})},
    {[K.learned]:J({c1:['b','c'],c2:['z']}),[K.missed]:J({a:1,b:3,c:1}),[K.ms]:J({seen:0})});
  assert.deepEqual(P(m.writes[K.learned]),{c1:['a','b','c'],c2:['z']});
  assert.deepEqual(P(m.writes[K.missed]),{a:2,b:3,c:1});
  assert.equal(m.writes[K.ms],undefined);
  assert.equal(rt.rtMerge({[K.ms]:J({seen:0})},{[K.ms]:J({seen:2000})}).writes[K.ms],J({seen:2000}));
}
// 도장: 받은 도장은 다 남기고, 둘 다 있으면 이 기기 날짜
{
  const m=rt.rtMerge({[K.stamps]:J({s0:0,s1:111})},{[K.stamps]:J({s1:222,s2:333})});
  assert.deepEqual(P(m.writes[K.stamps]),{s0:0,s1:111,s2:333});assert.equal(m.summary.stamps,1);
}
// 진행 속도: 합쳐 시간순, 600판. 메타는 판 수 큰 쪽, 나머지는 없을 때만
{
  const r=(at)=>({at,ms:1000,u:3,k:'n'});
  assert.deepEqual(P(rt.rtMerge({[K.pace]:J([r(1),r(3)])},{[K.pace]:J([r(2),r(3)])}).writes[K.pace]).map(x=>x.at),[1,2,3]);
  const got=P(rt.rtMerge({[K.pace]:J(Array.from({length:500},(_,i)=>r(i*2+1)))},{[K.pace]:J(Array.from({length:500},(_,i)=>r(i*2+2)))}).writes[K.pace]);
  assert.equal(got.length,600);assert.equal(got[0].at,401);assert.equal(got.at(-1).at,1000);
  assert.deepEqual(P(rt.rtMerge({[K.paceMeta]:J({total:4,target:'B1'})},{[K.paceMeta]:J({total:9,target:'C1',extra:1})}).writes[K.paceMeta]),{total:9,target:'B1',extra:1});
}
// 설정·이어하기 자리: 이 기기에 있으면 그대로, 없을 때만
assert.deepEqual(R(rt.rtMerge({'testgoyang-last-v1':'L','testgoyang-level-v1':'B1'},{'testgoyang-last-v1':'I','testgoyang-level-v1':'C1','testgoyang-uni-v1':'연세대'}).writes),{'testgoyang-uni-v1':'연세대'});
// 전체 성질: 지우지 않는다, 같은 파일을 두 번 합치면 할 일이 없다, 반대로 합쳐도 같은 내용, 남의 키는 안 쓴다
{
  const L={[K.prog]:J({a:{e1:{completed:true}}}),[K.saved]:J([{id:'a',addedAt:1}]),[K.stamps]:J({s0:0}),[K.pace]:J([{at:5,ms:1,u:1}])};
  const I={[K.prog]:J({a:{e2:{completed:true}}}),[K.saved]:J([{id:'b',addedAt:2}]),[K.stamps]:J({s1:9}),[K.pace]:J([{at:6,ms:1,u:1}]),[K.ms]:J({seen:1000}),'goyang-seoul-v1':'{}'};
  const w=R(rt.rtMerge(L,I).writes);
  assert.ok(Object.keys(w).every(k=>k.startsWith(T.prefix)),'only own keys are written');
  const once=Object.assign({},L,w);
  assert.equal(P(once[K.prog]).a.e1.completed,true);
  assert.deepEqual(P(once[K.saved]).map(x=>x.id),['a','b']);
  assert.deepEqual(R(rt.rtMerge(once,I).writes),{});
  const other=Object.assign({},I,R(rt.rtMerge(I,L).writes));
  assert.deepEqual(Object.keys(P(other[K.prog]).a).sort(),['e1','e2']);
}

/* ── 2. 이 게임 설정(config.json) ── */
const KINDS=['progress','saved','learned','missed','milestone','stamps','paceMeta','pace'];
assert.ok(typeof cfg.game==='string'&&cfg.game.length>0,'config.game');
assert.ok(typeof cfg.app==='string'&&/^[a-z0-9]+-records$/.test(cfg.app),'config.app is <저장소이름>-records');
assert.ok(typeof cfg.prefix==='string'&&/^[a-z0-9]+-$/.test(cfg.prefix),'config.prefix is <소문자>- (예: tangogoyang-)');
(cfg.skip||[]).forEach(k=>assert.ok(k.startsWith(cfg.prefix),'skip key starts with prefix: '+k));
Object.keys(cfg.kinds||{}).forEach(k=>{assert.ok(KINDS.includes(k),'unknown kind '+k);assert.doesNotThrow(()=>new RegExp(cfg.kinds[k]),'kind pattern '+k);});
const me=load(cfg);
{
  // 같은 주소(esqsoy.github.io)의 다른 게임 키는 모으지도, 받지도, 쓰지도 않는다
  const own=cfg.prefix+'probe-v1';
  const others=['goyang-seoul-v1','tangogoyang-seoul-v1','palagoyang-seoul-v1','lawgoyang-progress-v1','ipagoyang-seoul-v1','zerotwo_save_v1','x'+cfg.prefix+'a'].filter(k=>!k.startsWith(cfg.prefix));
  const store={[own]:'1'};others.forEach(k=>store[k]='{}');(cfg.skip||[]).forEach(k=>store[k]='1');
  assert.deepEqual(Object.keys(me.rtCollect(fakeStore(store))),[own]);
  const inc={};others.forEach(k=>inc[k]='{}');
  assert.deepEqual(R(me.rtMerge({},inc).writes),{});
  assert.throws(()=>me.rtParse(J({app:'other',v:1,data:{}})),new RegExp(cfg.game+' 기록 파일이 아니라고양'));
}
// 넣을 HTML에 빌드 결과가 들어 있다(자세한 비교는 build.cjs --check)
const html=fs.readFileSync(path.join(root,cfg.target),'utf8');
assert.ok(html.includes('/* RECORD_TRANSFER_START */')&&html.includes('id="rtSheet"'),cfg.target+' has record transfer');
console.log('record-transfer shared: rules OK, '+cfg.game+' config OK');

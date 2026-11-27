#!/usr/bin/env node
/* 고칠 점 남기기 공통 검사(게임 값은 config.json에서 읽는다). */
const assert=require('assert'),fs=require('fs'),path=require('path');
const core=require('./runtime.js');
const cfg=JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'),'utf8'));
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
ok(Array.isArray(cfg.kinds)&&cfg.kinds.length>=2&&cfg.kinds.includes('기타'),'종류 목록에 기타가 있다');
ok(typeof cfg.game==='string'&&cfg.game,'게임 이름');
ok(/^-[a-z0-9-]+-v\d+$/.test(cfg.storageSuffix),'저장 키 꼬리 꼴');
const t0=Date.UTC(2026,10,28,3);
let L=[];
L=core.add(L,{id:'card1',kind:'뜻',memo:' 먼저  감사합니다 ',course:'과정',front:'고맙습니다',answer:'ありがとう',place:'N5 ① 1'},t0);
L=core.add(L,{id:'card1',kind:'뜻',memo:'바꾼 메모',course:'과정'},t0+1);
ok(L.length===1&&L[0].memo==='바꾼 메모','같은 카드·종류는 하나로, 메모는 새 것');
L=core.add(L,{id:'card1',kind:'소리',course:'과정'},t0+2);
L=core.add(L,{id:'card2',kind:'기타',memo:'x'.repeat(900),course:'과정'},t0+3);
ok(L.length===3&&L[2].memo.length===400,'메모는 400자에서 자른다');
const txt=core.text('게임',L,t0);
ok(txt.split('\n')[0].startsWith('⚑ 게임 고칠 점 3개'),'머리줄');
const m=txt.match(/^#고칠점 v1 (.*)$/m);ok(m,'기계 줄');
const rows=JSON.parse(m[1]);ok(rows.length===3&&rows[0][1]==='card1'&&rows[0][2]==='소리'||rows.some(r=>r[1]==='card1'&&r[2]==='소리'),'기계 줄에 카드 id·종류');
L=core.markSent(L,t0+9);ok(core.unsent(L).length===0,'복사하면 보낸 것으로');
L=core.add(L,{id:'card1',kind:'뜻',memo:'다시',course:'과정'},t0+10);ok(core.unsent(L).length===1,'같은 카드에 다시 남기면 새로 보냄');
ok(core.read('nope').length===0&&core.read('[{"id":1}]').length===0,'깨진 저장값은 버린다');
console.log('fix-report shared: '+n+' checks OK, '+cfg.game+' config OK');

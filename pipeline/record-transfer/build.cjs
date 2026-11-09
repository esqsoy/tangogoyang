'use strict';
// 기록 옮기기를 교재 선택 화면에 넣는다. 원본: merge.js(합치기 규칙), runtime.js(화면), ui.html, style.css는 단어장끼리 같이 쓰고,
// 이 게임만의 값(이름, 저장 키, 넣을 파일)은 config.json에 둔다(SHARED.md).
// 사용: node pipeline/record-transfer/build.cjs [--check]
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),check=process.argv.includes('--check');
const readText=file=>fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const src=name=>readText(path.join(__dirname,name)).trim();
const config=JSON.parse(readText(path.join(__dirname,'config.json')));
const target=path.join(root,config.target),before=readText(target);let html=before;

const css='<style id="record-transfer-style">\n'+src('style.css')+'\n</style>';
if(html.includes('<style id="record-transfer-style">'))html=html.replace(/<style id="record-transfer-style">[\s\S]*?<\/style>/,()=>css);
else html=html.replace('</head>',css+'\n</head>');

const ui='<!-- RECORD_TRANSFER_UI_START -->\n'+src('ui.html')+'\n  <!-- RECORD_TRANSFER_UI_END -->';
if(html.includes('<!-- RECORD_TRANSFER_UI_START -->'))html=html.replace(/<!-- RECORD_TRANSFER_UI_START -->[\s\S]*?<!-- RECORD_TRANSFER_UI_END -->/,()=>ui);
else{const at=html.indexOf('  <div class="foot">');assert(at>=0,'index.html foot');html=html.slice(0,at)+'  '+ui+'\n\n'+html.slice(at);}

const {about,...cfg}=config;
const js='<script id="record-transfer">\n/* RECORD_TRANSFER_START */\nvar RT_CONFIG='+JSON.stringify(cfg)+';\n'+src('merge.js').replace(/\nif\(typeof module[^\n]*$/,'')+'\n'+src('runtime.js')+'\n/* RECORD_TRANSFER_END */\n</script>';
if(html.includes('<script id="record-transfer">'))html=html.replace(/<script id="record-transfer">[\s\S]*?<\/script>/,()=>js);
else html=html.replace('</body>',js+'\n</body>');

if(check)assert.equal(before,html,config.target+' has stale record-transfer code');else fs.writeFileSync(target,html);
console.log((check?'Verified ':'Updated ')+config.target);

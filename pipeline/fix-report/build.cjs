#!/usr/bin/env node
/* 고칠 점 남기기: 같이 쓰는 파일(runtime.js·style.css)과 이 게임 config.json을 대상 파일의 표시 사이에 넣는다.
   --check: 대상 파일이 지금 파일들과 같은지만 본다(고치지 않음). */
const fs=require('fs'),path=require('path');
const here=__dirname,root=path.resolve(here,'../..');
const cfg=JSON.parse(fs.readFileSync(path.join(here,'config.json'),'utf8'));
const target=path.join(root,cfg.target);
const css=fs.readFileSync(path.join(here,'style.css'),'utf8').trim();
const js=fs.readFileSync(path.join(here,'runtime.js'),'utf8').trim();
const conf={game:cfg.game,kinds:cfg.kinds,storageSuffix:cfg.storageSuffix};
const blocks=[
  ['/*FIX_REPORT_STYLE_START*/','/*FIX_REPORT_STYLE_END*/','\n'+css+'\n'],
  ['/*FIX_REPORT_JS_START*/','/*FIX_REPORT_JS_END*/','\nvar FIX_REPORT_CONFIG='+JSON.stringify(conf)+';\n'+js+'\n'],
];
let html=fs.readFileSync(target,'utf8'),out=html;
for(const [a,b,body] of blocks){
  const i=out.indexOf(a),j=out.indexOf(b);
  if(i<0||j<0||j<i||out.indexOf(a,i+1)>=0)throw new Error('표시가 없거나 둘 이상: '+a+' '+b+' in '+cfg.target);
  out=out.slice(0,i+a.length)+body+out.slice(j);
}
if(process.argv.includes('--check')){
  if(out!==html){console.error('fix-report: '+cfg.target+'가 공용 파일과 다르다. node pipeline/fix-report/build.cjs 로 다시 넣어라');process.exit(1);}
  console.log('fix-report: '+cfg.target+' 공용 파일과 같음');
}else{fs.writeFileSync(target,out);console.log('fix-report: '+cfg.target+'에 넣음');}

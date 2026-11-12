// 이솝 검수용: 가나 → (a) 헵번식 로마자 (b) 한글 소리. 앱의 변환표와 독립으로 쓴 것(앱 표를 뒤집어 만들면 앱의 빈틈이 안 보인다).
// 브라우저(window.GEN)와 node(module.exports) 양쪽에서 쓴다.
(function(root){
  const hira=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
  const BASE={あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',
    た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
    ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',
    が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',
    ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',ゔ:'vu',ゐ:'i',ゑ:'e'};
  const Y={き:'ky',し:'sh',ち:'ch',に:'ny',ひ:'hy',み:'my',り:'ry',ぎ:'gy',じ:'j',ぢ:'j',び:'by',ぴ:'py'};
  const SM={ゃ:'a',ゅ:'u',ょ:'o'};
  // 외래어 소리(헵번식 확장 표기)
  const EXT={てぃ:'ti',でぃ:'di',とぅ:'tu',どぅ:'du',でゅ:'dyu',てゅ:'tyu',ふぁ:'fa',ふぃ:'fi',ふぇ:'fe',ふぉ:'fo',ふゅ:'fyu',
    うぃ:'wi',うぇ:'we',うぉ:'wo',しぇ:'she',じぇ:'je',ちぇ:'che',つぁ:'tsa',つぃ:'tsi',つぇ:'tse',つぉ:'tso',いぇ:'ye',
    ゔぁ:'va',ゔぃ:'vi',ゔぇ:'ve',ゔぉ:'vo',くぁ:'kwa',くぃ:'kwi',くぇ:'kwe',くぉ:'kwo',ぐぁ:'gwa'};
  // 와프로(일본어 자판 로마자 입력) 표기: 헵번식과 다른 것만
  const WAP={を:'wo',ぢ:'di',づ:'du',てぃ:'thi',でぃ:'dhi',とぅ:'twu',どぅ:'dwu',でゅ:'dhu',うぉ:'who',ぢゃ:'dya',ぢゅ:'dyu',ぢょ:'dyo'};
  function units(kana){const h=hira(kana),out=[];let i=0;
    while(i<h.length){const two=h.slice(i,i+2);
      if(two.length===2&&/[ぁぃぅぇぉゃゅょゎ]/.test(two[1])){out.push(two);i+=2;}else{out.push(h[i]);i++;}}
    return out;}
  function unitRoma(u,style){
    if(style==='wap'&&WAP[u])return WAP[u];
    if(EXT[u])return EXT[u];
    if(u.length===2&&Y[u[0]]&&SM[u[1]])return Y[u[0]]+SM[u[1]];
    if(u.length===2)return null; // 표에 없는 작은 글자 조합
    return BASE[u]||null;}
  // style: 'hep'(헵번식, ん은 n/n', ー는 -), 'hep-nn'(ん을 늘 nn), 'hep-vv'(ー를 앞 모음 되풀이), 'wap'
  function romaji(kana,style){style=style||'hep';const us=units(kana);let out='';
    for(let i=0;i<us.length;i++){const u=us[i];
      if(u==='ー'){if(style==='hep-vv'){const v=out.slice(-1);out+=/[aiueo]/.test(v)?v:'-';}else out+='-';continue;}
      if(u==='ん'){const nx=us[i+1];const r=nx&&nx!=='ー'&&nx!=='っ'?unitRoma(nx,style==='wap'?'wap':'hep'):'';
        if(style==='hep-nn'){out+='nn';continue;}
        out+=(r&&/^[aiueoy]/.test(r))?"n'":'n';continue;}
      if(u==='っ'){const nx=us[i+1];const r=nx?unitRoma(nx,style==='wap'?'wap':'hep'):'';
        if(!r||/^[aiueon]/.test(r)){out+='xtsu';continue;}
        out+=(r.startsWith('ch')&&style!=='wap')?'t':r[0];continue;}
      const r=unitRoma(u,style==='wap'?'wap':'hep');if(r==null)return null;out+=r;}
    return out;}
  // 한글 소리. README 예(타베루·갓코우·가방·신분·쿄우·츠쿠에·파-티-·깃푸)와 같은 관행: 청음 か·た·ぱ=카·타·파, 탁음=가·다·바, つ=츠, ん=받침 ㄴ, っ=받침 ㅅ, ー='-'
  const HG={あ:'아',い:'이',う:'우',え:'에',お:'오',か:'카',き:'키',く:'쿠',け:'케',こ:'코',さ:'사',し:'시',す:'스',せ:'세',そ:'소',
    た:'타',ち:'치',つ:'츠',て:'테',と:'토',な:'나',に:'니',ぬ:'누',ね:'네',の:'노',は:'하',ひ:'히',ふ:'후',へ:'헤',ほ:'호',
    ま:'마',み:'미',む:'무',め:'메',も:'모',や:'야',ゆ:'유',よ:'요',ら:'라',り:'리',る:'루',れ:'레',ろ:'로',わ:'와',を:'오',
    が:'가',ぎ:'기',ぐ:'구',げ:'게',ご:'고',ざ:'자',じ:'지',ず:'즈',ぜ:'제',ぞ:'조',だ:'다',ぢ:'지',づ:'즈',で:'데',ど:'도',
    ば:'바',び:'비',ぶ:'부',べ:'베',ぼ:'보',ぱ:'파',ぴ:'피',ぷ:'푸',ぺ:'페',ぽ:'포',ゔ:'부',
    きゃ:'캬',きゅ:'큐',きょ:'쿄',しゃ:'샤',しゅ:'슈',しょ:'쇼',ちゃ:'차',ちゅ:'추',ちょ:'초',にゃ:'냐',にゅ:'뉴',にょ:'뇨',
    ひゃ:'햐',ひゅ:'휴',ひょ:'효',みゃ:'먀',みゅ:'뮤',みょ:'묘',りゃ:'랴',りゅ:'류',りょ:'료',ぎゃ:'갸',ぎゅ:'규',ぎょ:'교',
    じゃ:'자',じゅ:'주',じょ:'조',ぢゃ:'자',ぢゅ:'주',ぢょ:'조',びゃ:'뱌',びゅ:'뷰',びょ:'뵤',ぴゃ:'퍄',ぴゅ:'퓨',ぴょ:'표',
    てぃ:'티',でぃ:'디',とぅ:'투',どぅ:'두',でゅ:'듀',ふぁ:'파',ふぃ:'피',ふぇ:'페',ふぉ:'포',ふゅ:'퓨',うぃ:'위',うぇ:'웨',うぉ:'워',
    しぇ:'셰',じぇ:'제',ちぇ:'체',つぁ:'차',いぇ:'예',ゔぁ:'바',ゔぃ:'비',ゔぇ:'베',ゔぉ:'보'};
  const HG2={ちゃ:'챠',ちゅ:'츄',ちょ:'쵸',じゃ:'쟈',じゅ:'쥬',じょ:'죠',つ:'쓰',しぇ:'쉐'}; // 흔한 다른 적기
  const addT=(syl,t)=>{const n=syl.charCodeAt(0)-0xac00;return n%28===0?String.fromCharCode(syl.charCodeAt(0)+t):null;};
  function hangul(kana,alt){const us=units(kana);let out='';
    for(const u of us){
      if(u==='ー'){out+='-';continue;}
      if(u==='ん'||u==='っ'){const last=out.slice(-1),code=last?last.charCodeAt(0):0;
        const withT=code>=0xac00&&code<=0xd7a3?addT(last,u==='ん'?4:19):null;
        if(withT)out=out.slice(0,-1)+withT;else out+=(u==='ん'?'ㄴ':'ㅅ');continue;}
      const h=(alt&&HG2[u])||HG[u];if(!h)return null;out+=h;}
    return out;}
  const G={units,romaji,hangul,hira};
  if(typeof module!=='undefined'&&module.exports)module.exports=G;else root.GEN=G;
})(typeof window!=='undefined'?window:globalThis);

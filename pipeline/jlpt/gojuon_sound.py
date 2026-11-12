"""五十音 소리 자료: 가나 → 발음기호(IPA)·로마자·한글, 발음기호 설명.

26.11.06 영신: "발음이 한국어와 일치하지 않는 경우는 발음에 관한 설명이 반드시 있어야해",
"발음기호도 병기해줘. 발음기호에는 반탁음같은 그 발음의 설명과 함께 어떻게 발음하는지에 대한 설명도",
"문자를 배울때마다 이걸 거침으로서 발음기호를 익히는 효과".
IPA는 표준 일본어(도쿄) 간략 표기(국제음성학회 일본어 설명·일반 음운론 교재의 관례): う=[ɯ], ら행=[ɾ], ふ=[ɸ], し=[ɕ], ち=[tɕ], つ=[ts], ひ=[ç], じ·ぢ=[dʑ], わ=[ɰa], ん=[ɴ](뒤 소리에 따라 바뀜).
"""
import re

# 한 박(모라) 소리: 가나 → (IPA, 로마자, 한글)
MORA = {}
def _add(rows):
    for k, ipa, rm, hg in rows:
        MORA[k] = (ipa, rm, hg)
_add([('あ','a','a','아'),('い','i','i','이'),('う','ɯ','u','우'),('え','e','e','에'),('お','o','o','오'),
      ('か','ka','ka','카'),('き','kʲi','ki','키'),('く','kɯ','ku','쿠'),('け','ke','ke','케'),('こ','ko','ko','코'),
      ('さ','sa','sa','사'),('し','ɕi','shi','시'),('す','sɯ','su','스'),('せ','se','se','세'),('そ','so','so','소'),
      ('た','ta','ta','타'),('ち','tɕi','chi','치'),('つ','tsɯ','tsu','츠'),('て','te','te','테'),('と','to','to','토'),
      ('な','na','na','나'),('に','ɲi','ni','니'),('ぬ','nɯ','nu','누'),('ね','ne','ne','네'),('の','no','no','노'),
      ('は','ha','ha','하'),('ひ','çi','hi','히'),('ふ','ɸɯ','fu','후'),('へ','he','he','헤'),('ほ','ho','ho','호'),
      ('ま','ma','ma','마'),('み','mʲi','mi','미'),('む','mɯ','mu','무'),('め','me','me','메'),('も','mo','mo','모'),
      ('や','ja','ya','야'),('ゆ','jɯ','yu','유'),('よ','jo','yo','요'),
      ('ら','ɾa','ra','라'),('り','ɾʲi','ri','리'),('る','ɾɯ','ru','루'),('れ','ɾe','re','레'),('ろ','ɾo','ro','로'),
      ('わ','ɰa','wa','와'),('を','o','wo','오'),('ん','ɴ','n','ㄴ·ㅇ 받침'),
      ('が','ɡa','ga','가'),('ぎ','ɡʲi','gi','기'),('ぐ','ɡɯ','gu','구'),('げ','ɡe','ge','게'),('ご','ɡo','go','고'),
      ('ざ','za','za','자'),('じ','dʑi','ji','지'),('ず','zɯ','zu','즈'),('ぜ','ze','ze','제'),('ぞ','zo','zo','조'),
      ('だ','da','da','다'),('ぢ','dʑi','ji','지'),('づ','zɯ','zu','즈'),('で','de','de','데'),('ど','do','do','도'),
      ('ば','ba','ba','바'),('び','bʲi','bi','비'),('ぶ','bɯ','bu','부'),('べ','be','be','베'),('ぼ','bo','bo','보'),
      ('ぱ','pa','pa','파'),('ぴ','pʲi','pi','피'),('ぷ','pɯ','pu','푸'),('ぺ','pe','pe','페'),('ぽ','po','po','포')])
for base, c_ipa, c_rm, hgs in [('き','kʲ','ky','캬큐쿄'),('し','ɕ','sh','샤슈쇼'),('ち','tɕ','ch','차추초'),('に','ɲ','ny','냐뉴뇨'),
                              ('ひ','ç','hy','햐휴효'),('み','mʲ','my','먀뮤묘'),('り','ɾʲ','ry','랴류료'),('ぎ','ɡʲ','gy','갸규교'),
                              ('じ','dʑ','j','자주조'),('び','bʲ','by','뱌뷰뵤'),('ぴ','pʲ','py','퍄퓨표')]:
    for sm, v_ipa, v_rm, h in zip('ゃゅょ', 'aɯo', 'auo', hgs):
        MORA[base + sm] = (c_ipa + v_ipa, c_rm + v_rm, h)
_GAI = [('てぃ','ti','ti','티'),('でぃ','di','di','디'),('とぅ','tɯ','tu','투'),('どぅ','dɯ','du','두'),
        ('ふぁ','ɸa','fa','파(f)'),('ふぃ','ɸi','fi','피(f)'),('ふぇ','ɸe','fe','페(f)'),('ふぉ','ɸo','fo','포(f)'),
        ('うぃ','wi','wi','위'),('うぇ','we','we','웨'),('うぉ','wo','wo','워'),
        ('しぇ','ɕe','she','셰'),('じぇ','dʑe','je','제'),('ちぇ','tɕe','che','체'),('ゔ','vɯ','vu','부(v)')]
_add(_GAI)

def hira(s):
    return re.sub(r'[ァ-ヶ]', lambda m: chr(ord(m.group()) - 0x60), s)

VOW = {'a': 'a', 'i': 'i', 'ɯ': 'u', 'e': 'e', 'o': 'o'}
MAC = {'a': 'ā', 'i': 'ī', 'u': 'ū', 'e': 'ē', 'o': 'ō'}
CHO = 'ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'

def _batchim(syl, jong):  # 한글 음절에 받침을 단다(jong: 종성 번호)
    c = ord(syl[-1]) - 0xAC00
    if c < 0 or c >= 11172 or c % 28:
        return syl
    return syl[:-1] + chr(0xAC00 + c + jong)

READ = {'こんにちは': 'こんにちわ', 'こんばんは': 'こんばんわ'}  # 인사말 끝 は는 조사라 [ɰa]


def sound(word):
    """가나 낱말 → (IPA, 로마자, 한글). 장음: ー, 같은 모음 겹침, えい·おう(낱말 끝 동사 제외는 쓰는 쪽이 확인)."""
    h = hira(READ.get(word, word))
    toks, i = [], 0
    while i < len(h):
        two = h[i:i + 2]
        if two in MORA and len(two) == 2:
            toks.append(two); i += 2
        else:
            toks.append(h[i]); i += 1
    ipa, rm, hg = [], [], []
    prev_v = None
    for j, t in enumerate(toks):
        nxt = MORA.get(toks[j + 1]) if j + 1 < len(toks) else None
        if t == 'っ':
            c = re.match(r'[^aeiouɯ]+', nxt[0]).group() if nxt else ''
            ipa.append(c[0] if c else 'ʔ'); rm.append('t' if nxt and nxt[1].startswith('ch') else (nxt[1][0] if nxt else ''))
            if hg: hg[-1] = _batchim(hg[-1], 19)  # ㅅ
            prev_v = None; continue
        if t == 'ん':
            n0 = nxt[0] if nxt else ''
            ipa.append('m' if re.match(r'[pbm]', n0) else 'ŋ' if re.match(r'[kɡ]', n0) else 'ɲ' if re.match(r'(tɕ|dʑ|ɲ)', n0) else 'n' if re.match(r'(t|d|n|ɾ|ts|dz|z)', n0) else 'ɴ')  # tɕ·dʑ를 t·d보다 먼저(26.11.12 Fable 검수)
            rm.append("n'" if nxt and (nxt[1][0] in 'aiueoy') else 'n')
            if hg and hg[-1] == '-':
                hg.append('ㄴ')
            elif hg:
                hg[-1] = _batchim(hg[-1], 4)  # 한글은 ㄴ 하나로(실제 소리는 IPA가 보인다)
            prev_v = None; continue
        if t == 'ー' or (prev_v and t in 'あいうえお' and (MORA[t][0] == prev_v or (prev_v, MORA[t][0]) in (('e', 'i'), ('o', 'ɯ')))):
            v = prev_v
            ipa.append('ː'); hg.append('-')
            if t == 'ー' or (v, MORA[t][0]) == ('o', 'ɯ') or (t != 'い' and MORA[t][0] == v):
                rm[-1] = rm[-1][:-1] + MAC[VOW[v]]
            else:
                rm.append(MORA[t][1])
            prev_v = None; continue
        a, r, g = MORA[t]
        ipa.append(a); rm.append(r); hg.append(g)
        prev_v = a[-1] if a[-1] in VOW else None
    g = ''.join(hg)
    if len(toks) > 1:
        g = re.sub(r'\([fv]\)', '', g)
    return ''.join(ipa), ''.join(rm), g

# 발음기호 설명. 기호: (한국어 대응, 판정, 조음 용어, 요령, 차이·주의)
#   판정 same: 한국어와 같다 → 설명을 뺀다(26.11.06 영신 "한국어와 동일발음이라면 설명을 생략하자").
#        ok: 같지는 않지만 한국어식으로 해도 통한다 → 그렇게 알려 주고 차이를 강조한다(영신 "한국어식으로 발음해도 무방한것은 그렇게 알려주고 다만 어떤 차이가 있는지를 강조").
#        must: 한국어식으로 하면 일본 사람에게 다른 소리(다른 말)로 들린다 → 요령과 주의.
#        none: 한국어에 없는 소리.
#   유사도 %는 쓰지 않는다(영신 제안이었으나 측정 근거 없는 어림이라 정확해 보이기만 한다. 위 판정이 학습자에게 더 쓸모 있다, Claude 26.11.06).
SYM = {
    'a': ('아', 'same'), 'i': ('이', 'same'), 'e': ('에', 'same'), 'm': ('ㅁ', 'same'), 'n': ('ㄴ', 'same'), 'h': ('ㅎ', 'same'),
    'ɕ': ('‘시’의 ㅅ', 'same'), 'ç': ('‘히’의 ㅎ', 'same'), 'ɲ': ('‘니’의 ㄴ', 'same'), 'j': ('‘야·유·요’의 ㅣ', 'same'), 'w': ('‘워·위’의 ㅜ', 'same'), 'ŋ': ('받침 ㅇ', 'same'),
    'o': ('오', 'ok', '', '', '입술을 한국어 ‘오’보다 덜 내민다'),
    's': ('ㅅ', 'ok', '무성 치경 마찰음', '', '한국어 ‘ㅅ’보다 바람을 덜 섞어 또렷하게'),
    'ɾ': ('ㄹ', 'ok', '치경 탄음', '혀끝으로 윗잇몸을 한 번 튕긴다', '영어 r·l이 아니다. 낱말 첫머리에서도 튕긴다'),
    'ɯ': ('우', 'ok', '', '', '입술을 내밀지 않는다. ‘우’와 ‘으’ 사이'),
    'ɰ': ('와', 'ok', '연구개 접근음', '', '‘와’보다 입술을 덜 둥글게 내민다'),
    'k': ('ㅋ', 'ok', '무성 연구개 파열음', '', '첫머리는 ‘ㅋ’보다 바람이 약하고, 낱말 가운데에선 ‘ㄲ’처럼 들린다'),
    't': ('ㅌ', 'ok', '무성 치경 파열음', '', '첫머리는 ‘ㅌ’보다 바람이 약하고, 낱말 가운데에선 ‘ㄸ’처럼 들린다'),
    'p': ('ㅍ', 'ok', '무성 양순 파열음', '', '첫머리는 ‘ㅍ’보다 바람이 약하고, 낱말 가운데에선 ‘ㅃ’처럼 들린다'),
    'tɕ': ('ㅊ', 'ok', '무성 치경구개 파찰음', '', '첫머리는 ‘ㅊ’보다 바람이 약하고, 낱말 가운데에선 ‘ㅉ’처럼 들린다'),
    'ɴ': ('ㅇ·ㄴ 받침', 'ok', '구개수 비음', '', 'ん은 혼자 한 박자다. 받침처럼 짧게 삼키지 말고 한 박자를 채운다'),
    'ɸ': ('후', 'ok', '무성 양순 마찰음', '두 입술을 살짝 모아 그 틈으로 바람을 낸다', '한국어 ‘후’를 입술을 덜 내밀고 하면 거의 같다(‘후’의 ㅎ도 흔히 두 입술 사이에서 난다). 윗니를 입술에 대는 [f]가 아니다'),
    'v': ('ブ', 'ok', '유성 순치 마찰음', '', '윗니를 아랫입술에 대는 소리지만 일본 사람도 대개 ブ[bɯ]로 읽는다. 다만 [b]처럼 목은 울려야 한다(첫머리 ‘ㅂ’은 ぷ로 들린다)'),
    'ɡ': ('ㄱ', 'must', '유성 연구개 파열음', '목을 울리며 낸다. 목에 손을 대고 떨리는지 본다', '한국어 첫머리 ‘ㄱ’은 목이 안 울려 か[k]로 들린다(ぎん 은 → きん 금). 낱말 가운데의 ‘ㄱ’은 저절로 울린다'),
    'd': ('ㄷ', 'must', '유성 치경 파열음', '목을 울리며 낸다', '한국어 첫머리 ‘ㄷ’은 목이 안 울려 た[t]로 들린다'),
    'b': ('ㅂ', 'must', '유성 양순 파열음', '목을 울리며 낸다', '한국어 첫머리 ‘ㅂ’은 목이 안 울려 ぱ[p]로 들린다'),
    'dʑ': ('ㅈ', 'must', '유성 치경구개 파찰음', '목을 울리며 낸다', '한국어 첫머리 ‘지’는 목이 안 울려 ち[tɕi]로 들린다'),
    'ts': (None, 'none', '무성 치경 파찰음', '혀끝을 윗잇몸에 댔다 떼며 [t]에서 [s]로 넘어간다', '한국어 ‘츠’로 하면 ちゅ에 가깝게 들린다. ‘쓰’도 아니다'),
    'z': (None, 'none', '유성 치경 마찰음', '[s]를 목을 울리며 낸다', '‘ㅈ’으로 하면 じゃ행처럼 들린다. 낱말 첫머리에선 [dz]로도 난다'),
}
MARK = {  # 소리가 아니라 기호 읽기(한국어와 같아도 기호를 익히게 남긴다)
    'ʲ': '[ʲ] 앞 자음에 ‘이’ 입 모양을 섞는다는 표시(구개음화)',
    'ː': '[ː] 앞 모음을 한 박자 더 길게. 짧게 하면 다른 말이 된다',
    'Q': '겹친 자음([kk]·[tt]·[pp]·[ss]…)은 작은 っ: 그 자리에서 한 박자 멈췄다가 다음 소리를 낸다',
}
# 조음 용어에는 영어를 함께 적는다(26.11.06 영신: "ipa 용어를 적는경우에는 영어도 병기해줘")
EN = {'무성 연구개 파열음': 'voiceless velar plosive', '유성 연구개 파열음': 'voiced velar plosive',
      '무성 치경 마찰음': 'voiceless alveolar fricative', '유성 치경 마찰음': 'voiced alveolar fricative', '유성 치경구개 파찰음': 'voiced alveolo-palatal affricate',
      '무성 치경 파열음': 'voiceless alveolar plosive', '유성 치경 파열음': 'voiced alveolar plosive',
      '무성 치경구개 파찰음': 'voiceless alveolo-palatal affricate', '무성 치경 파찰음': 'voiceless alveolar affricate',
      '무성 양순 마찰음': 'voiceless bilabial fricative', '유성 양순 파열음': 'voiced bilabial plosive', '무성 양순 파열음': 'voiceless bilabial plosive',
      '치경 탄음': 'alveolar tap', '연구개 접근음': 'velar approximant', '유성 순치 마찰음': 'voiced labiodental fricative', '구개수 비음': 'uvular nasal', '구개음화': 'palatalization'}

def _gwa(ko):
    """‘…’ 뒤 조사 과/와: 마지막이 받침 있는 음절이거나 자음 자모(ㅋ=키읔…)면 과."""
    c = ko[-1]
    if 'ㄱ' <= c <= 'ㅎ':
        return '과'
    if '가' <= c <= '힣':
        return '과' if (ord(c) - 0xAC00) % 28 else '와'
    return '와'


def sym_line(s):
    """한 기호 설명 줄: '머리 — 요령 · 주의: 차이'. 한국어와 같으면 None."""
    if s in MARK:
        return re.sub(r'\(([^()]+)\)', lambda m: '(' + m.group(1) + ', ' + EN[m.group(1)] + ')' if m.group(1) in EN else m.group(0), MARK[s])
    e = SYM.get(s)
    if not e or e[1] == 'same':
        return None
    ko, v, term, how, care = e
    head = '[' + s + '] ' + {'ok': '한국어 ‘' + str(ko) + '’식으로 해도 된다', 'must': '한국어 ‘' + str(ko) + '’' + ('과' if True else '') + ' 꼭 구별', 'none': '한국어에 없다'}[v]
    if v == 'must':
        head = '[' + s + '] 한국어 ‘' + ko + '’식으로 하면 안 된다'
    if v == 'ok' and s == 'ɸ':
        head = '[ɸ] 한국어 ‘후’식으로 해도 된다'
    if s == 'v':
        head = '[v] 한국어에 없지만 ブ[bɯ]로 읽어도 된다'
        care = care.replace('윗니를 아랫입술에 대는 소리지만 일본 사람도 대개 ブ[bɯ]로 읽는다. 다만 ', '윗니를 아랫입술에 대는 소리다. 일본 사람도 대개 ブ로 읽는다. ')
    term_s = ' (' + term + ', ' + EN[term] + ')' if term else ''
    body = ' · '.join(x for x in [how, (('차이: ' if v == 'ok' else '주의: ') + care) if care else ''] if x)
    return head + term_s + (' — ' + body if body else '')


for _s in list(SYM) + list(MARK):
    sym_line(_s)  # 용어의 영어가 빠지면 여기서 멈춘다

ORDER = ['tɕ', 'dʑ', 'ts', 'ɕ', 'ɲ', 'ç', 'ɸ', 'ɾ', 'ɰ', 'ɴ', 'ŋ', 'ɡ', 'ɯ', 'ʲ', 'ː'] + list('kgsztdnhbpmjwvaieo')

def symbols(ipa, geminate=True):
    out, i = [], 0
    while i < len(ipa):
        for s in ORDER:
            if ipa.startswith(s, i):
                if i + len(s) < len(ipa) and ipa[i] == ipa[i + len(s)] and s not in VOW and s not in ('ː',) and geminate and 'Q' not in out:
                    out.append('Q')
                if s not in out:
                    out.append(s)
                i += len(s); break
        else:
            i += 1
    return out

def explain(kana, ipa, word=False):
    """카드 발음 설명 줄들. 한국어와 같은 소리는 뺀다(기호 표시 ʲ·ː·っ는 남김)."""
    h = hira(kana)
    lines = []
    if not word:
        if any(c in 'がぎぐげござじずぜぞだぢづでどばびぶべぼゔ' for c in h):
            lines.append('탁음(゛): 오른쪽 위 두 점. 같은 행의 소리를 목을 울려 낸다(か[k]→が[ɡ])')
        if any(c in 'ぱぴぷぺぽ' for c in h):
            lines.append('반탁음(゜): は행 오른쪽 위 동그라미. [h] 대신 두 입술을 터뜨리는 [p]가 된다')
        if len(h) == 2 and h[1] in 'ゃゅょ':
            lines.append('작은 ' + kana[1] + ': 앞 글자와 합쳐 한 박자로 읽는다')
        elif len(h) == 2 and h[1] in 'ぁぃぅぇぉ':
            lines.append('작은 ' + kana[1] + ': 외래어 소리를 적는 법. 앞 글자와 합쳐 한 박자')
    for s in symbols(ipa, 'っ' in h):
        line = sym_line(s)
        if line and not (word and s == 'ʲ'):  # 낱말 카드에서는 [ʲ] 기호 읽기까지는 되풀이하지 않는다
            lines.append(line)
    return lines

#!/usr/bin/env python3
"""五十音(가나 과정) 카드 만들기 → gojuon-data.json. build.py가 읽어 tangogoyanggojuon.html을 만든다.

26.11.06 영신: "히라가나 가타가나 등을 익히는것 따로". 고양공유 '자체 문자가 있는 언어는 문자 학습 단계를 맨 처음'(PRINCIPLES 0).
방식(Claude 안, 영신 이견 없음): 글자를 보고 소리를 친다(か → ka / 카). 로마자·한글로 친 소리를 가나로 바꿔 화면 글자와 같으면 정답.
카드: en=정답 가나, w=화면 글자, rm=로마자(헵번식), hg=한글 소리, ko=뜻(단어 카드만), c=헷갈리는 글자 해설.
"""
import json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gojuon_sound import sound, explain, MORA, hira, ALT_HG  # 발음기호·발음 설명(26.11.06 영신)

HERE = Path(__file__).resolve().parent

BASIC = [  # (가나, 로마자, 한글)
    ('あ', 'a', '아'), ('い', 'i', '이'), ('う', 'u', '우'), ('え', 'e', '에'), ('お', 'o', '오'),
    ('か', 'ka', '카'), ('き', 'ki', '키'), ('く', 'ku', '쿠'), ('け', 'ke', '케'), ('こ', 'ko', '코'),
    ('さ', 'sa', '사'), ('し', 'shi', '시'), ('す', 'su', '스'), ('せ', 'se', '세'), ('そ', 'so', '소'),
    ('た', 'ta', '타'), ('ち', 'chi', '치'), ('つ', 'tsu', '츠'), ('て', 'te', '테'), ('と', 'to', '토'),
    ('な', 'na', '나'), ('に', 'ni', '니'), ('ぬ', 'nu', '누'), ('ね', 'ne', '네'), ('の', 'no', '노'),
    ('は', 'ha', '하'), ('ひ', 'hi', '히'), ('ふ', 'fu', '후'), ('へ', 'he', '헤'), ('ほ', 'ho', '호'),
    ('ま', 'ma', '마'), ('み', 'mi', '미'), ('む', 'mu', '무'), ('め', 'me', '메'), ('も', 'mo', '모'),
    ('や', 'ya', '야'), ('ゆ', 'yu', '유'), ('よ', 'yo', '요'),
    ('ら', 'ra', '라'), ('り', 'ri', '리'), ('る', 'ru', '루'), ('れ', 're', '레'), ('ろ', 'ro', '로'),
    ('わ', 'wa', '와'), ('を', 'wo', '오'), ('ん', 'n', 'ㄴ·ㅇ 받침'),
]
DAKU = [
    ('が', 'ga', '가'), ('ぎ', 'gi', '기'), ('ぐ', 'gu', '구'), ('げ', 'ge', '게'), ('ご', 'go', '고'),
    ('ざ', 'za', '자'), ('じ', 'ji', '지'), ('ず', 'zu', '즈'), ('ぜ', 'ze', '제'), ('ぞ', 'zo', '조'),
    ('だ', 'da', '다'), ('ぢ', 'ji', '지'), ('づ', 'zu', '즈'), ('で', 'de', '데'), ('ど', 'do', '도'),
    ('ば', 'ba', '바'), ('び', 'bi', '비'), ('ぶ', 'bu', '부'), ('べ', 'be', '베'), ('ぼ', 'bo', '보'),
    ('ぱ', 'pa', '파'), ('ぴ', 'pi', '피'), ('ぷ', 'pu', '푸'), ('ぺ', 'pe', '페'), ('ぽ', 'po', '포'),
]
YOON = []
for base, rm, hg in [('き', 'k', '캬큐쿄'), ('し', 'sh', '샤슈쇼'), ('ち', 'ch', '차추초'), ('に', 'n', '냐뉴뇨'),
                     ('ひ', 'h', '햐휴효'), ('み', 'm', '먀뮤묘'), ('り', 'r', '랴류료'), ('ぎ', 'g', '갸규교'),
                     ('じ', 'j', '자주조'), ('び', 'b', '뱌뷰뵤'), ('ぴ', 'p', '퍄퓨표')]:
    for small, v, h in zip('ゃゅょ', ['a', 'u', 'o'], hg):
        YOON.append((base + small, (rm + v) if rm in ('sh', 'ch', 'j') else (rm + 'y' + v), h))

# 작은 っ·장음 단어(히라가나): (단어, 로마자, 한글, 뜻)
SOKU_H = [
    ('きって', 'kitte', '킷테', '우표'), ('がっこう', 'gakkō', '갓코-', '학교'), ('ざっし', 'zasshi', '잣시', '잡지'),
    ('いっぱい', 'ippai', '잇파이', '가득'), ('ちょっと', 'chotto', '춋토', '조금'), ('みっつ', 'mittsu', '밋츠', '세 개'),
    ('おかあさん', 'okāsan', '오카-상', '어머니'), ('おとうさん', 'otōsan', '오토-상', '아버지'), ('おにいさん', 'onīsan', '오니-상', '형, 오빠'),
    ('おねえさん', 'onēsan', '오네-상', '누나, 언니'), ('せんせい', 'sensei', '센세-', '선생님'), ('くうき', 'kūki', '쿠-키', '공기'),
    ('ちいさい', 'chiisai', '치-사이', '작다'), ('とけい', 'tokei', '토케-', '시계'), ('きょう', 'kyō', '쿄-', '오늘'),
    ('りょこう', 'ryokō', '료코-', '여행'),
]
# 가타카나 외래어 소리
GAIRAI = [
    ('ティ', 'ti', '티'), ('ディ', 'di', '디'), ('トゥ', 'tu', '투'), ('ドゥ', 'du', '두'),
    ('ファ', 'fa', '파(f)'), ('フィ', 'fi', '피(f)'), ('フェ', 'fe', '페(f)'), ('フォ', 'fo', '포(f)'),
    ('ウィ', 'wi', '위'), ('ウェ', 'we', '웨'), ('ウォ', 'wo', '워'),
    ('シェ', 'she', '셰'), ('ジェ', 'je', '제'), ('チェ', 'che', '체'), ('ヴ', 'vu', '부(v)'),
]
SOKU_K = [
    ('コーヒー', 'kōhī', '코-히-', '커피'), ('ケーキ', 'kēki', '케-키', '케이크'), ('ノート', 'nōto', '노-토', '공책'),
    ('ベッド', 'beddo', '벳도', '침대'), ('カップ', 'kappu', '캇푸', '컵'), ('サッカー', 'sakkā', '삿카-', '축구'),
    ('チーズ', 'chīzu', '치-즈', '치즈'), ('スーパー', 'sūpā', '스-파-', '슈퍼마켓'), ('ニュース', 'nyūsu', '뉴-스', '뉴스'),
    ('パーティー', 'pātī', '파-티-', '파티'), ('シャツ', 'shatsu', '샤츠', '셔츠'), ('ジュース', 'jūsu', '주-스', '주스'),
]
CONFUSE = {  # 헷갈리는 글자 해설(꼭 필요한 것만, PRINCIPLES 4)
    'さ': 'ち와 좌우가 반대다', 'ち': 'さ와 좌우가 반대다', 'き': 'さ보다 가로획이 하나 더', 'ぬ': 'め와 비슷. 끝이 동그랗게 말린다',
    'め': 'ぬ와 비슷. 끝이 말리지 않는다', 'ね': 'れ·わ와 비슷. 끝이 동그랗게 말린다', 'れ': 'ね·わ와 비슷. 끝이 바깥으로 꺾인다',
    'わ': 'ね·れ와 비슷. 끝이 안쪽으로 둥글게 휘고 고리가 없다', 'る': 'ろ와 비슷. 끝이 동그랗게 말린다', 'ろ': 'る와 비슷. 끝이 말리지 않는다',
    'は': 'ほ와 비슷. 가로획이 하나. 조사 「~은/는」일 때는 わ로 읽는다', 'ほ': 'は와 비슷. 가로획이 둘', 'い': 'り와 비슷. 왼쪽 획이 더 길다',
    'り': 'い와 비슷. 오른쪽 획이 더 길다', 'を': '조사 「~을/를」에만 쓴다. 소리는 お와 같다', 'ん': '뒤 소리에 따라 ㄴ·ㅇ·ㅁ처럼 난다',
    'へ': '조사 「~에/로」일 때는 え로 읽는다. 가타카나 ヘ와 모양이 거의 같다', 'ぢ': 'じ와 소리가 같다. 거의 안 쓴다', 'づ': 'ず와 소리가 같다. つづく처럼 쓸 때만',
    'シ': 'ツ와 비슷. 점이 왼쪽에 세로로, 마지막 획은 아래에서 위로', 'ツ': 'シ와 비슷. 점이 위에 가로로, 마지막 획은 위에서 아래로',
    'ソ': 'ン과 비슷. 마지막 획은 위에서 아래로', 'ン': 'ソ와 비슷. 마지막 획은 아래에서 위로',
    'ク': 'ケ·タ와 비슷', 'ケ': 'ク와 비슷. 가로획이 튀어나온다', 'ウ': 'ワ·フ와 비슷. 위에 점이 있다', 'ワ': 'ウ와 비슷. 위에 점이 없다',
    'フ': 'ワ와 비슷. 왼쪽 세로획이 없다', 'ヌ': 'ス와 비슷. 둘째 획이 첫 획을 가로지른다', 'ス': 'ヌ와 비슷. 둘째 획이 첫 획을 가로지르지 않는다',
    'コ': 'ユ와 비슷. 아래 가로획이 튀어나오지 않는다', 'ユ': 'コ와 비슷. 아래 가로획이 길게 오른쪽으로 튀어나온다', 'チ': 'テ와 비슷. 위가 비스듬하다', 'テ': 'チ와 비슷. 위가 반듯하다',
    'ー': '장음. 앞 소리를 길게',
    'ヲ': '조사 「~을/를」에만 쓴다. 가타카나로는 거의 안 쓴다', 'ヂ': 'ジ와 소리가 같다. 거의 안 쓴다', 'ヅ': 'ズ와 소리가 같다. 거의 안 쓴다',  # 26.11.12 이솝 G07
}
# 손글씨 메모(26.11.06, 조사: 일본어 모어 화자 손글씨 연구·학습 자료. 확인된 것만. PRINCIPLES 0-1 五十音)
HAND = {'き': '인쇄체는 아래가 이어져 보이지만 손으로는 떼어 쓴다', 'さ': '인쇄체는 아래가 이어져 보이지만 손으로는 떼어 쓴다',
        'り': '인쇄체는 이어져 보이지만 손으로는 두 획으로 떼어 쓴다', 'も': '세로획(し 모양)이 먼저, 가로 둘이 나중. モ는 가로가 먼저라 헷갈리기 쉽다'}
for k, v in HAND.items():
    CONFUSE[k] = CONFUSE[k] + '. ' + v if k in CONFUSE else v


# 짝 단어 판(26.11.13 영신 "짝 단어판과 히라가나 전체 누적복습 좋은거같아. 카타가나도 마찬가지고", 이솝 G12): 한 박자·점·작은 글자 차이로 뜻이 갈리는 짝
PAIRS_H = [('おばさん', '아주머니', 'おばあさん', '할머니'), ('おじさん', '아저씨', 'おじいさん', '할아버지'),
           ('ゆき', '눈(雪)', 'ゆうき', '용기'), ('ここ', '여기', 'こうこう', '고등학교'),
           ('きて', '와 (와 줘)', 'きって', '우표'), ('さか', '언덕', 'さっか', '작가'),
           ('かこ', '과거', 'かっこ', '괄호'), ('びょういん', '병원', 'びよういん', '미용실'),
           ('じゆう', '자유', 'じゅう', '열(10)'), ('きねん', '기념', 'きんえん', '금연')]
PAIRS_K = [('ビル', '빌딩', 'ビール', '맥주'), ('ハート', '하트', 'ハット', '모자'),
           ('シーツ', '침대 시트', 'シャツ', '셔츠'), ('コート', '코트', 'コード', '전선, 코드'),
           ('バッグ', '가방', 'バグ', '버그(프로그램 오류)'), ('バス', '버스', 'パス', '패스, 통행증'),
           ('ベッド', '침대', 'ペット', '반려동물')]


def pair_cards(pairs, script):
    out = []
    for a, am, b, bm in pairs:
        ca = card(a, '', '', ko=am, script=script, word=True)
        cb = card(b, '', '', ko=bm, script=script, word=True)
        ca['c'] = '짝: ' + b + ' = ' + bm + ('. ' + ca['c'] if ca.get('c') else '')
        cb['c'] = '짝: ' + a + ' = ' + am + ('. ' + cb['c'] if cb.get('c') else '')
        out += [ca, cb]
    return out


def kata(s):
    return re.sub(r'[ぁ-ゖ]', lambda m: chr(ord(m.group()) + 0x60), s)


def card(kana, rm, hg, ko='', script='h', word=False):
    if word:  # 낱말: 로마자·한글·IPA를 한 규칙으로 만든다
        ipa, rm, hg = sound(kana)
    else:
        ipa = MORA[hira(kana)][0]
    c = {'id': f'kana-{script}-{kana}', 'en': kana, 'w': kana, 'ko': ko, 'rm': rm, 'hg': hg, 'ipa': ipa,
         'pn': explain(kana, ipa, word), 'lv': 'かな'}
    # 한글로 쳤을 때 받는 꼴(26.11.12 이솝 B01·G01·G04): 보인 소리(hg)와, (f)(v) 표시를 뺀 꼴, 장음을 안 늘인 꼴(갓코우), ん은 ㄴ·ㅇ·ㅁ
    hgs = {hg, re.sub(r'\([fv]\)', '', hg)}
    if word:
        hgs |= {sound(kana, merge=False)[2], sound(kana, alt=True)[2], sound(kana, merge=False, alt=True)[2]}
    if hira(kana) == 'ん':
        hgs |= {'ㄴ', 'ㅇ', 'ㅁ'}
    # 한국에서 흔히 쓰는 다른 표기(다른 카드의 소리와 겹치지 않는 것만, 26.11.13)
    hgs |= {ALT_HG[hira(kana)]} if hira(kana) in ALT_HG else set()
    hgs.discard(hg)
    if hgs:
        c['hgs'] = sorted(hgs)
    note = CONFUSE.get(kana)
    if note:
        c['c'] = note
    elif word and 'ː' in ipa and re.search(r'[ぁ-ゖ]', kana):  # 히라가나 장음 쓰는 법(26.11.12 이솝 G16)
        c['c'] = '장음: お단+う·え단+い·같은 모음 겹침은 한 박자 길게 읽고, う·い를 따로 읽지 않는다'
    return c


def ex(title, cards, rnd=False, hw=False):
    # hw: 문제를 손글씨 모양으로(26.11.06 영신: 외국인은 손글씨가 판이해서 못 알아본다). 치는 건 그대로.
    # rnd: 1회독부터 섞는다(26.11.06 영신: "순서대로 내면 그냥 아이우에오로 무지성으로 칠 수 있어").
    if hw:
        cards = [{**c, 'hw': 1} for c in cards]
    e = {'scope': '2026', 'title': title, 'words': cards}
    if rnd:
        e['rnd'] = 1
    return e


def cumulative(name, cards, script):
    """전체 누적 복습: 104자를 고정된 순서로 한 번 섞어 52자씩 두 판으로(26.11.13 영신 "두판으로 나눕시다 길면 질림").
    두 판 모두 기본·탁음·요음이 섞이게 하고, 판마다 인쇄체·손글씨."""
    import random
    pool = cards[:]
    random.Random('gojuon-cumulative-' + script).shuffle(pool)
    half = len(pool) // 2
    out = []
    for i, part in enumerate([pool[:half], pool[half:]]):
        out += mixed(f'{name} 전체 {i + 1}/2', part)
    return out


def mixed(name, cards):
    """강 끝: 강 전체 글자를 한 판에 섞어 인쇄체로 한 번, 손글씨로 한 번(영신: "무작위로는 그냥 히라가나 전체를 한판으로 해서 완전히 섞이게", "같은걸 인쇄판, 필기판따로")."""
    return [ex(name + ' 무작위 · 인쇄체', cards, rnd=True), ex(name + ' 무작위 · 손글씨', cards, rnd=True, hw=True)]


def chunks(cards, size):
    k = max(1, round(len(cards) / size))
    return [cards[i * len(cards) // k:(i + 1) * len(cards) // k] for i in range(k)]


def lessons(script):
    conv = (lambda s: s) if script == 'h' else kata
    pfx = 'ひらがな' if script == 'h' else 'カタカナ'
    basic = [card(conv(k), r, h, script=script) for k, r, h in BASIC]
    out = []
    # ① 기본: 두 행씩
    groups = [basic[0:10], basic[10:20], basic[20:30], basic[30:38], basic[38:46]]
    names = [f'{conv("あ")}·{conv("か")}행', f'{conv("さ")}·{conv("た")}행', f'{conv("な")}·{conv("は")}행', f'{conv("ま")}·{conv("や")}행', f'{conv("ら")}·{conv("わ")}행·{conv("ん")}']
    exs = [ex(n, g) for n, g in zip(names, groups)] + mixed('46자', basic)
    # 헷갈리는 글자 판(26.11.13 영신 "다 추천대로", 이솝 G13): 모양이 비슷한 글자만 두 번씩 섞어 가려 본다
    look = 'ぬめねれわるろはほさきちいりあお' if script == 'h' else 'シツソンクタケウワフコユスヌチテ'
    by = {c['w']: c for c in basic}
    exs.append(ex('헷갈리는 글자', [by[k] for k in look] * 2, rnd=True))
    out.append({'id': f'{pfx} ①', 'name': '기본 글자', 'exercises': exs})
    daku = [card(conv(k), r, h, script=script) for k, r, h in DAKU]
    d = daku  # 10장 안팎으로: が·ざ / だ·ば / ぱ + 앞 행 첫 글자 복습
    out.append({'id': f'{pfx} ②', 'name': '탁음·반탁음', 'exercises': [ex(f'{conv("が")}·{conv("ざ")}행', d[0:10]), ex(f'{conv("だ")}·{conv("ば")}행', d[10:20]), ex(f'{conv("ぱ")}행 + 복습', d[20:25] + d[0:20:5])] + mixed('25자', daku)
                + [ex('청탁 섞기', basic[5:20] + basic[25:30] + daku, rnd=True)]})  # か·さ·た·は행과 탁음·반탁음을 한 판에(26.11.13 영신 "다 추천대로", 이솝 G12)
    yoon = [card(conv(k), r, h, script=script) for k, r, h in YOON]
    out.append({'id': f'{pfx} ③', 'name': '작은 ' + '·'.join(conv(x) for x in 'ゃゅょ'), 'exercises': [ex('합친 소리 ' + str(i + 1), g) for i, g in enumerate([yoon[0:12], yoon[12:24], yoon[24:33]])] + mixed('33자', yoon)
                + cumulative(('히라가나' if script == 'h' else '가타카나'), basic + daku + yoon, script)})  # 누적 복습(26.11.13 영신, 이솝 G17)  # 행(3장)을 끊지 않게 4·4·3행(26.11.12 이솝 G06)
    if script == 'h':
        words = [card(k, r, h, ko=m, script='h', word=True) for k, r, h, m in SOKU_H]
        out.append({'id': f'{pfx} ④', 'name': '작은 っ·장음', 'exercises': [ex('っ·장음 단어 ' + str(i + 1), g) for i, g in enumerate(chunks(words, 8))] + mixed('단어 ' + str(len(words)) + '개', words) + [ex('짝 단어', pair_cards(PAIRS_H, 'h'), rnd=True)]})
    else:
        gai = [card(k, r, h, script='k') for k, r, h in GAIRAI]
        words = [card(k, r, h, ko=m, script='k', word=True) for k, r, h, m in SOKU_K]
        out.append({'id': f'{pfx} ④', 'name': '외래어 소리·ー·ッ', 'exercises': [ex('외래어 소리', gai), ex('ー·ッ 단어', words)] + mixed(str(len(gai) + len(words)) + '개', gai + words) + [ex('짝 단어', pair_cards(PAIRS_K, 'k'), rnd=True)]})
    return out


# ⑤ 단어 뜻 고침(五十音에서만. 日本語能力試験 원본은 완성본이라 그대로, 26.11.12 Fable 검수)
KO_FIX = {'アパート': '연립 주택(한국의 고층 아파트와 다름)'}


def kana_words(script):
    """⑤ 가나로만 쓴 쉬운 단어 읽기: 日本語能力試験 N5·N4 카드 가운데 화면 표기가 그 가나 그대로인 것."""
    s = (ROOT / 'tangogoyangjlpt.html').read_text()
    d = json.loads(re.search(r'^const DATA = (\[.*\]);\s*$', s, re.M).group(1))
    pat = r'^[ぁ-ゖー]+$' if script == 'h' else r'^[ァ-ヶー]+$'
    seen, out = set(), []
    for L in d:
        for e in L['exercises']:
            for w in e['words']:
                if w['lv'] in ('N5', 'N4') and re.match(pat, w['w']) and w['en'] == w['w'] and 2 <= len(w['en']) <= 6 and w['en'] not in seen:
                    seen.add(w['en'])
                    c = card(w['en'], '', '', ko=KO_FIX.get(w['en'], w['ko']), word=True)
                    out.append({**c, 'id': f'kana-w-{w["id"]}'})
    # 48개를 앞에서 자르지 않고, 아직 안 나온 글자(가나)를 가장 많이 새로 덮는 말부터 고른다(26.11.12 이솝 G14: 앞 48개는 N5 앞 강뿐이라 ぬ·の·ひ… 가 0번)
    picked, covered = [], set()
    pool = out[:]
    while pool and len(picked) < 48:
        best = max(pool, key=lambda c: (len(set(hira(c['en'])) - covered), -pool.index(c)))
        pool.remove(best); picked.append(best); covered |= set(hira(best['en']))
    order = {id(c): i for i, c in enumerate(out)}
    return sorted(picked, key=lambda c: order[id(c)])


ROOT = HERE.parents[1]
data, n = [], 0
for script in ('h', 'k'):
    for L in lessons(script):
        data.append(L)
    words = kana_words(script)
    pfx = 'ひらがな' if script == 'h' else 'カタカナ'
    exs = []
    for i, g in enumerate(chunks(words, 12)):
        exs += [ex(f'단어 읽기 {i + 1} · 인쇄체', g, rnd=True), ex(f'단어 읽기 {i + 1} · 손글씨', g, rnd=True, hw=True)]
    data.append({'id': f'{pfx} ⑤', 'name': '단어 읽기', 'exercises': exs})
for i, L in enumerate(data):
    L['lesson'] = i + 1
    for j, e in enumerate(L['exercises']):
        e['ex'] = j + 1
(HERE / 'gojuon-data.json').write_text(json.dumps(data, ensure_ascii=False, indent=0))
cards = sum(len(e['words']) for L in data for e in L['exercises'])
print('五十音', len(data), '강', sum(len(L['exercises']) for L in data), '연습', cards, '카드(복습 포함)')

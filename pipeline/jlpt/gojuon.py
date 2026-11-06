#!/usr/bin/env python3
"""五十音(가나 과정) 카드 만들기 → gojuon-data.json. build.py가 읽어 tangogoyanggojuon.html을 만든다.

26.11.06 영신: "히라가나 가타가나 등을 익히는것 따로". 고양공유 '자체 문자가 있는 언어는 문자 학습 단계를 맨 처음'(PRINCIPLES 0).
방식(Claude 안, 영신 이견 없음): 글자를 보고 소리를 친다(か → ka / 카). 로마자·한글로 친 소리를 가나로 바꿔 화면 글자와 같으면 정답.
카드: en=정답 가나, w=화면 글자, rm=로마자(헵번식), hg=한글 소리, ko=뜻(단어 카드만), c=헷갈리는 글자 해설.
"""
import json, re
from pathlib import Path

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
    'わ': 'ね·れ와 비슷. 끝이 둥글게 닫힌다', 'る': 'ろ와 비슷. 끝이 동그랗게 말린다', 'ろ': 'る와 비슷. 끝이 말리지 않는다',
    'は': 'ほ와 비슷. 가로획이 하나', 'ほ': 'は와 비슷. 가로획이 둘', 'い': 'り와 비슷. 왼쪽 획이 더 길다',
    'り': 'い와 비슷. 오른쪽 획이 더 길다', 'を': '조사 「~을/를」에만 쓴다. 소리는 お와 같다', 'ん': '뒤 소리에 따라 ㄴ·ㅇ·ㅁ처럼 난다',
    'ぢ': 'じ와 소리가 같다. 거의 안 쓴다', 'づ': 'ず와 소리가 같다. つづく처럼 쓸 때만',
    'シ': 'ツ와 비슷. 점이 왼쪽에 세로로, 마지막 획은 아래에서 위로', 'ツ': 'シ와 비슷. 점이 위에 가로로, 마지막 획은 위에서 아래로',
    'ソ': 'ン과 비슷. 마지막 획은 위에서 아래로', 'ン': 'ソ와 비슷. 마지막 획은 아래에서 위로',
    'ク': 'ケ·タ와 비슷', 'ケ': 'ク와 비슷. 가로획이 튀어나온다', 'ウ': 'ワ·フ와 비슷. 위에 점이 있다', 'ワ': 'ウ와 비슷. 위에 점이 없다',
    'フ': 'ワ와 비슷. 왼쪽 세로획이 없다', 'ヌ': 'ス와 비슷. 가운데 점획이 있다', 'ス': 'ヌ와 비슷. 가운데 점획이 없다',
    'コ': 'ユ와 비슷. 오른쪽이 막혔다', 'ユ': 'コ와 비슷. 왼쪽이 막히고 아래가 길다', 'チ': 'テ와 비슷. 위가 비스듬하다', 'テ': 'チ와 비슷. 위가 반듯하다',
    'ー': '장음. 앞 소리를 길게',
}


def kata(s):
    return re.sub(r'[ぁ-ゖ]', lambda m: chr(ord(m.group()) + 0x60), s)


def card(kana, rm, hg, ko='', script='h'):
    c = {'id': f'kana-{script}-{kana}', 'en': kana, 'w': kana, 'ko': ko, 'rm': rm, 'hg': hg, 'lv': 'かな'}
    note = CONFUSE.get(kana)
    if note:
        c['c'] = note
    return c


def ex(title, cards):
    return {'scope': '2026', 'title': title, 'words': cards}


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
    exs = [ex(n, g) for n, g in zip(names, groups)] + [ex('기본 전체 복습 ' + str(i + 1), g) for i, g in enumerate(chunks(basic, 12))]
    out.append({'id': f'{pfx} ①', 'name': '기본 글자', 'exercises': exs})
    daku = [card(conv(k), r, h, script=script) for k, r, h in DAKU]
    d = daku  # 10장 안팎으로: が·ざ / だ·ば / ぱ + 앞 행 첫 글자 복습
    out.append({'id': f'{pfx} ②', 'name': '탁음·반탁음', 'exercises': [ex(f'{conv("が")}·{conv("ざ")}행', d[0:10]), ex(f'{conv("だ")}·{conv("ば")}행', d[10:20]), ex(f'{conv("ぱ")}행 + 복습', d[20:25] + d[0:20:5])]})
    yoon = [card(conv(k), r, h, script=script) for k, r, h in YOON]
    out.append({'id': f'{pfx} ③', 'name': '작은 ' + '·'.join(conv(x) for x in 'ゃゅょ'), 'exercises': [ex('합친 소리 ' + str(i + 1), g) for i, g in enumerate(chunks(yoon, 11))]})
    if script == 'h':
        words = [card(k, r, h, ko=m, script='h') for k, r, h, m in SOKU_H]
        out.append({'id': f'{pfx} ④', 'name': '작은 っ·장음', 'exercises': [ex('っ·장음 단어 ' + str(i + 1), g) for i, g in enumerate(chunks(words, 8))]})
    else:
        gai = [card(k, r, h, script='k') for k, r, h in GAIRAI]
        words = [card(k, r, h, ko=m, script='k') for k, r, h, m in SOKU_K]
        out.append({'id': f'{pfx} ④', 'name': '외래어 소리·ー·ッ', 'exercises': [ex('외래어 소리', gai), ex('ー·ッ 단어', words)]})
    return out


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
                    out.append({'id': f'kana-w-{w["id"]}', 'en': w['en'], 'w': w['w'], 'ko': w['ko'], 'rm': '', 'hg': '', 'lv': 'かな'})
    return out[:48]


ROOT = HERE.parents[1]
data, n = [], 0
for script in ('h', 'k'):
    for L in lessons(script):
        data.append(L)
    words = kana_words(script)
    pfx = 'ひらがな' if script == 'h' else 'カタカナ'
    data.append({'id': f'{pfx} ⑤', 'name': '단어 읽기', 'exercises': [ex('단어 읽기 ' + str(i + 1), g) for i, g in enumerate(chunks(words, 12))]})
for i, L in enumerate(data):
    L['lesson'] = i + 1
    for j, e in enumerate(L['exercises']):
        e['ex'] = j + 1
(HERE / 'gojuon-data.json').write_text(json.dumps(data, ensure_ascii=False, indent=0))
cards = sum(len(e['words']) for L in data for e in L['exercises'])
print('五十音', len(data), '강', sum(len(L['exercises']) for L in data), '연습', cards, '카드(복습 포함)')

#!/usr/bin/env python3
"""日本語能力試験 과정 조립: source/vocab.json + ko/batch-*.json → tangogoyangjlpt.html

- 원본: source/vocab.json(OpenJLPT, CC BY-SA 4.0), ko/batch-NN.json(한국어 뜻·주제·uk·해설), template.html(화면).
- 묶음: 급수(N5→N1) → 주제(TOPICS 순서) → 연습(약 12카드). 한 급수를 약 400카드씩 강으로 나눈다.
- 카드: en=정답 가나(읽기), w=화면 표기(uk면 가나), alt=정답으로 받는 다른 표기, ko, c, lv, id(OpenJLPT id, 모아둔 카드 키).
사용: python3 pipeline/jlpt/build.py [--allow-missing]
"""
import json, math, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / 'tangogoyangjlpt.html'
LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
TOPICS = ['인사·표현', '사람·가족', '몸·건강', '음식', '집·생활', '옷·물건', '학교·공부', '일·직장', '돈·경제',
          '교통·여행', '장소·지역', '자연·날씨', '시간·때', '수·양', '감정·성격', '생각·말', '사회·제도',
          '문화·취미', '과학·기술', '동작', '상태·성질', '부사·접속', '문법어']
LESSON_SIZE = 400
EX_SIZE = 12
CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩'

src = json.loads((HERE / 'source' / 'vocab.json').read_text())['vocab']
ko = {}
for f in sorted((HERE / 'ko').glob('batch-*.json')):
    for r in json.loads(f.read_text()):
        ko[r['id']] = r
missing = [w['id'] for w in src if w['id'] not in ko]
if missing and '--allow-missing' not in sys.argv:
    sys.exit(f'한국어 뜻이 없는 카드 {len(missing)}개. 시험 조립이면 --allow-missing')
# 덧붙이는 고침: 이상 항목 판정(review-decisions.json: keep/drop/fix)과 같은 뜻 줄 갈라 쓰기(ko-fixes.json).
# 원본 batch 파일은 그대로 두고 여기서 덮는다. drop은 영신 확인 전까지 '빼 둔' 상태다(HANDOFF).
DROP, FIXWORD = set(), {}
dec_f = HERE / 'review-decisions.json'
if dec_f.exists():
    for d in json.loads(dec_f.read_text()):
        if d['action'] == 'drop':
            DROP.add(d['id'])
        elif d['action'] == 'fix':
            FIXWORD[d['id']] = {k: d[k] for k in ('word', 'reading') if d.get(k)}
        if d['id'] in ko:
            if d.get('ko'):
                ko[d['id']] = {**ko[d['id']], 'ko': d['ko']}
            if 'c' in d:
                ko[d['id']] = {**ko[d['id']], 'c': d['c']}
fix_f = HERE / 'ko-fixes.json'
if fix_f.exists():
    for i, f in json.loads(fix_f.read_text()).items():
        if i in ko:
            ko[i] = {**ko[i], **{k: v for k, v in f.items() if k in ('ko', 'c')}}
# Fable 독립 검수(26.11.06)에서 Claude가 받아들인 고침: {id: {ko, c, shown, reading, drop}}
FABLE = {}
ff = HERE / 'fable-review' / 'accepted.json'
if ff.exists():
    FABLE = json.loads(ff.read_text())
    for i, f in FABLE.items():
        if f.get('drop'):
            DROP.add(i)
        if i in ko:
            ko[i] = {**ko[i], **{k: f[k] for k in ('ko', 'c', 'readings') if k in f}}
            if 'shown' in f:
                ko[i]['shown'] = f['shown']
        if f.get('reading'):
            FIXWORD.setdefault(i, {})['reading'] = f['reading']
# 마지막 고침(fixes.json): 최종 검수·학생 리포트. 다른 모든 고침 뒤에 덮으므로 여기 적은 것이 이긴다.
# {id: {ko, c, shown, reading, readings, drop}}. 26.11.06.
LATE = {}
lf = HERE / 'fixes.json'
if lf.exists():
    LATE = {k: v for k, v in json.loads(lf.read_text()).items() if not k.startswith('_')}
    for i, f in LATE.items():
        if f.get('drop'):
            DROP.add(i)
        elif f.get('restore'):
            DROP.discard(i)
        if i in ko:
            ko[i] = {**ko[i], **{k: f[k] for k in ('ko', 'c', 'readings') if k in f}}
            if 'shown' in f:
                ko[i]['shown'] = f['shown']
            if 'alt' in f:
                ko[i]['alt_extra'] = f['alt']
        if f.get('reading'):
            FIXWORD.setdefault(i, {})['reading'] = f['reading']
src = [w for w in src if w['id'] not in DROP]
for w in src:
    if w['id'] in FIXWORD:
        w.update(FIXWORD[w['id']])
bad_topic = {r['topic'] for r in ko.values()} - set(TOPICS)
assert not bad_topic, bad_topic


def card(w):
    k = ko[w['id']]
    word, reading = w['word'], w['reading']
    uk = bool(k.get('uk'))
    shown = k.get('shown') or (reading if uk else word)
    alt = sorted(({word, reading} | set(k.get('alt_extra', []))) - {shown, reading})
    c = {'id': w['id'], 'en': reading, 'ko': k['ko'].strip(), 'w': shown, 'lv': w['level']}
    if alt:
        c['alt'] = alt
    if k.get('c'):
        c['c'] = k['c'].strip()
    if k.get('readings'):
        c['ar'] = k['readings']
    return c, k['topic']


MIN_EX = 6  # 이보다 작은 주제는 다음 주제와 한 연습으로 묶는다(최종 검수 26.11.06: 1~3장짜리 연습이 있었다)


def make_data(keep):
    """급수 → 주제 순서로 연습(약 12장)을 만들고, 그 연습들을 카드 수가 고르게 강으로 나눈다."""
    data, lesson_no, stats = [], 0, {}
    for lv in LEVELS:
        by_topic = {t: [] for t in TOPICS}
        for w in src:
            if w['level'] == lv and w['id'] in ko:
                c, t = card(w)
                if keep(c):
                    by_topic[t].append(c)
        total = sum(len(v) for v in by_topic.values())
        stats[lv] = total
        # 1) 작은 주제는 다음 주제와 합친다
        blocks, carry_t, carry_w = [], [], []
        for t in TOPICS:
            if not by_topic[t]:
                continue
            carry_t.append(t); carry_w += by_topic[t]
            if len(carry_w) >= MIN_EX:
                blocks.append((carry_t, carry_w)); carry_t, carry_w = [], []
        if carry_w:
            if blocks:
                bt, bw = blocks.pop()
                blocks.append((bt + carry_t, bw + carry_w))
            else:
                blocks.append((carry_t, carry_w))
        # 2) 묶음마다 약 12장씩 연습으로
        exercises, seen = [], {}
        for ts, words in blocks:
            label = ' · '.join(ts)
            k = max(1, round(len(words) / EX_SIZE))
            for j in range(k):
                part = words[j * len(words) // k:(j + 1) * len(words) // k]  # 고르게 나눈다(끝에 1장만 남지 않게)
                if not part:
                    continue
                seen[label] = seen.get(label, 0) + 1
                title = label if k == 1 else f'{label} {seen[label]}'
                exercises.append({'scope': '2026', 'title': title, 'words': part, '_t': ts})
        # 3) 연습들을 카드 수가 고르게 강으로 나눈다
        n_lessons = max(1, round(total / LESSON_SIZE))
        groups, cur, done = [], [], 0
        for x in exercises:
            cur.append(x); done += len(x['words'])
            if len(groups) < n_lessons - 1 and done >= total * (len(groups) + 1) / n_lessons:
                groups.append(cur); cur = []
        if cur:
            groups.append(cur)
        for gi, g in enumerate(groups):
            lesson_no += 1
            for n, x in enumerate(g):
                x['ex'] = n + 1
            first, last = g[0]['_t'][0], g[-1]['_t'][-1]
            for x in g:
                x.pop('_t')
            name = first if first == last else f'{first} ~ {last}'
            lid = lv + (f' {CIRCLED[gi]}' if len(groups) > 1 else '')
            data.append({'lesson': lesson_no, 'id': lid, 'name': name, 'exercises': g})
    return data, stats


KANJI = re.compile(r'[\u3400-\u9fff々〆]')
tpl = (HERE / 'template.html').read_text()
marker = 'const DATA = /*__DATA__*/[];'
mode_marker = 'const JP_MODE=/*__MODE__*/"meaning";'
assert tpl.count(marker) == 1 and tpl.count(mode_marker) == 1


def write(out, data, mode):
    html = tpl.replace(marker, 'const DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';')
    if mode == 'yomi':
        # 漢字読み: 따로 진도를 쌓는다(저장 키 tangogoyang-yomi-). 제목도 바꾼다.
        html = html.replace(mode_marker, 'const JP_MODE="yomi";')
        # 고양이 이름표도 한자로: 高陽猫, 읽기는 こねねこ. 26.11.06 영신 "고양고양이는 한자로 고양네코로 하자", "이름의 읽는 법은 마음대로 … 코네네코"
        html = html.replace('<span class="nm">고양고양이</span>', '<span class="nm" lang="ja"><ruby>高陽猫<rt>こねねこ</rt></ruby></span>').replace('alt="고양고양이"', 'alt="高陽猫"')
        lines = json.loads((HERE / 'lines-yomi.json').read_text())
        lm = 'const LINES_YOMI=/*__LINES_YOMI__*/null;'
        assert html.count(lm) == 1
        html = html.replace(lm, 'const LINES_YOMI=' + json.dumps(lines, ensure_ascii=False) + ';')
        html = re.sub(r'(["\'`])tangogoyang-', r'\1tangogoyang-yomi-', html)
        for old, new in [('<title>日本語能力試験 · 単語高陽</title>', '<title>漢字読み · 単語高陽</title>'),
                         ('<h2>日本語能力試験 N5–N1</h2>', '<h2>日本語能力試験 漢字読み N5–N1</h2>'),
                         ('<h1 lang="ja"><b>単語高陽</b> · 日本語能力試験</h1>', '<h1 lang="ja"><b>単語高陽</b> · 漢字読み</h1>'),
                         ('const SAVED_COURSE="日本語能力試験";', 'const SAVED_COURSE="漢字読み";'),
                         ("'日本語能力試験 완주'", "'漢字読み完走'")]:
            assert html.count(old) == 1, old
            html = html.replace(old, new)
    out.write_text(html)
    return sum(len(e['words']) for L in data for e in L['exercises'])


data, stats = make_data(lambda c: True)
n_all = write(OUT, data, 'meaning')
ydata, ystats = make_data(lambda c: bool(KANJI.search(c['w'])))
n_yomi = write(ROOT / 'tangogoyangyomi.html', ydata, 'yomi')
idx = ROOT / 'index.html'
it = idx.read_text()
it = re.sub(r'<!-- VOCAB_STATS:jlpt:START -->.*?<!-- VOCAB_STATS:jlpt:END -->', lambda m: f'<!-- VOCAB_STATS:jlpt:START --><b>{n_all:,}단어</b> · 한국어 뜻을 보고 가나로<!-- VOCAB_STATS:jlpt:END -->', it, flags=re.S)
it = re.sub(r'<!-- VOCAB_STATS:yomi:START -->.*?<!-- VOCAB_STATS:yomi:END -->', lambda m: f'<!-- VOCAB_STATS:yomi:START --><b>{n_yomi:,}단어</b> · 한자를 보고 읽기를 가나로<!-- VOCAB_STATS:yomi:END -->', it, flags=re.S)
idx.write_text(it)
print(OUT.name, f'{len(data)}강 · {sum(len(L["exercises"]) for L in data)}연습 · {n_all}카드', stats, f'뜻 없음 {len(missing)}', f'뺀 카드 {len(DROP)}', f'표기 고침 {len(FIXWORD)}')
print('tangogoyangyomi.html', f'{len(ydata)}강 · {sum(len(L["exercises"]) for L in ydata)}연습 · {n_yomi}카드', ystats)

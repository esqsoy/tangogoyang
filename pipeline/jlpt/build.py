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
    shown = reading if uk else word
    alt = sorted({word, reading} - {shown, reading})
    c = {'id': w['id'], 'en': reading, 'ko': k['ko'].strip(), 'w': shown, 'lv': w['level']}
    if alt:
        c['alt'] = alt
    if k.get('c'):
        c['c'] = k['c'].strip()
    return c, k['topic']


data, lesson_no, stats = [], 0, {}
for lv in LEVELS:
    by_topic = {t: [] for t in TOPICS}
    for w in src:
        if w['level'] == lv and w['id'] in ko:
            c, t = card(w)
            by_topic[t].append(c)
    total = sum(len(v) for v in by_topic.values())
    stats[lv] = total
    n_lessons = max(1, round(total / LESSON_SIZE))
    target = total / n_lessons
    groups, cur, cur_n = [], [], 0
    for t in TOPICS:
        if not by_topic[t]:
            continue
        if cur and cur_n + len(by_topic[t]) / 2 > target * (len(groups) + 1) - sum(sum(len(by_topic[x]) for x in g) for g in groups) and len(groups) < n_lessons - 1:
            groups.append(cur); cur = []
        cur.append(t); cur_n += len(by_topic[t])
    if cur:
        groups.append(cur)
    for gi, g in enumerate(groups):
        lesson_no += 1
        exercises, seen = [], {}
        for t in g:
            words = by_topic[t]
            k = max(1, math.ceil(len(words) / EX_SIZE))
            size = math.ceil(len(words) / k)
            for j in range(k):
                part = words[j * size:(j + 1) * size]
                if not part:
                    continue
                seen[t] = seen.get(t, 0) + 1
                title = t if k == 1 else f'{t} {seen[t]}'
                exercises.append({'ex': len(exercises) + 1, 'scope': '2026', 'title': title, 'words': part})
        name = g[0] if len(g) == 1 else f'{g[0]} ~ {g[-1]}'
        lid = lv + (f' {CIRCLED[gi]}' if len(groups) > 1 else '')
        data.append({'lesson': lesson_no, 'id': lid, 'name': name, 'exercises': exercises})

tpl = (HERE / 'template.html').read_text()
marker = 'const DATA = /*__DATA__*/[];'
assert tpl.count(marker) == 1
html = tpl.replace(marker, 'const DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';')
OUT.write_text(html)
idx = ROOT / 'index.html'
it = idx.read_text()
it = re.sub(r'<!-- VOCAB_STATS:jlpt:START -->.*?<!-- VOCAB_STATS:jlpt:END -->', lambda m: f'<!-- VOCAB_STATS:jlpt:START --><b>{sum(len(e["words"]) for L in data for e in L["exercises"]):,}단어</b> · 한국어 뜻을 보고 가나로<!-- VOCAB_STATS:jlpt:END -->', it, flags=re.S)
idx.write_text(it)
cards = sum(len(e['words']) for L in data for e in L['exercises'])
print(OUT.name, f'{len(data)}강 · {sum(len(L["exercises"]) for L in data)}연습 · {cards}카드', stats, f'뜻 없음 {len(missing)}', f'뺀 카드 {len(DROP)}', f'표기 고침 {len(FIXWORD)}')

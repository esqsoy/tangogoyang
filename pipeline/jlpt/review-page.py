#!/usr/bin/env python3
"""日本語能力試験 과정을 영신 직검수 페이지(Artifact용 HTML)로 뽑는다.

카드마다 한 줄이라 댓글이 그 카드에 붙는다(올릴 때 capabilities: {comments: {}}).
맨 위에 원본 오류로 뺀 카드·바로잡은 카드를 따로 보인다(영신 확인 대기).
사용: python3 pipeline/jlpt/review-page.py [--out 파일]   (build.py 뒤에)
"""
import html, json, re, sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
out = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else HERE / 'out' / 'jlpt-review.html'
e = html.escape

data = json.loads(re.search(r'^const DATA = (\[.*\]);\s*$', (ROOT / 'tangogoyangjlpt.html').read_text(), re.M).group(1))
src = {w['id']: w for w in json.loads((HERE / 'source' / 'vocab.json').read_text())['vocab']}
dec = json.loads((HERE / 'review-decisions.json').read_text())
ko = {}
for f in sorted((HERE / 'ko').glob('batch-*.json')):
    for r in json.loads(f.read_text()):
        ko[r['id']] = r


def ruby(word, reading):
    if not re.search(r'[㐀-鿿々〆]', word) or word == reading:
        return e(word)
    a = 0
    while a < min(len(word), len(reading)) and word[a] == reading[a] and re.match(r'[぀-ヿ]', word[a]):
        a += 1
    b = 0
    while b < min(len(word), len(reading)) - a and word[-1 - b] == reading[-1 - b] and re.match(r'[぀-ヿ]', word[-1 - b]):
        b += 1
    mid, rmid = word[a:len(word) - b], reading[a:len(reading) - b]
    return e(word[:a]) + f'<ruby>{e(mid)}<rt>{e(rmid)}</rt></ruby>' + e(word[len(word) - b:])


css = """
:root{--bg:#f7f6f2;--fg:#20211f;--mute:#62645e;--line:#dcdcd4;--card:#fff;--accent:#8a3b2e;--soft:#f1e6df;--warn:#8a5a00;--warnbg:#fbf0d9;
--jp:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",sans-serif;--body:"Pretendard","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171816;--fg:#e8e8e2;--mute:#a3a59c;--line:#30322d;--card:#1f201d;--accent:#e49a87;--soft:#2c2320;--warn:#e6b766;--warnbg:#2a2316;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171816;--fg:#e8e8e2;--mute:#a3a59c;--line:#30322d;--card:#1f201d;--accent:#e49a87;--soft:#2c2320;--warn:#e6b766;--warnbg:#2a2316;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--body);line-height:1.5}
.wrap{max-width:820px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 64px}
h1{font-size:1.6rem;margin:0 0 6px;text-wrap:balance} h1 span{font-family:var(--jp)}
.lead{color:var(--mute);margin:0 0 14px;font-size:.93rem}
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 22px}
.toc a{font-size:.8rem;padding:3px 9px;border:1px solid var(--line);border-radius:99px;color:var(--fg);text-decoration:none;background:var(--card)}
h2{font-size:1.15rem;margin:30px 0 4px;padding-bottom:6px;border-bottom:2px solid var(--accent)}
h3{font-size:.92rem;margin:16px 0 2px;color:var(--accent)}
.row{padding:7px 4px;border-bottom:1px dashed var(--line)}
.w{font-family:var(--jp);font-size:1.12rem;font-weight:700} .w rt{font-size:.55em;font-weight:500;color:var(--mute)}
.r{font-family:var(--jp);font-size:.8rem;color:var(--mute);margin-left:8px;font-weight:400}
.ko{font-size:.98rem} .c{display:block;font-size:.82rem;color:var(--mute);margin-top:1px}
.tag{font-size:.7rem;padding:0 6px;border-radius:4px;margin-left:6px;vertical-align:1px;background:var(--soft);color:var(--accent)}
.drop .ko{text-decoration:line-through;color:var(--mute)} .why{display:block;font-size:.8rem;color:var(--warn);background:var(--warnbg);border-radius:4px;padding:1px 6px;margin-top:2px;justify-self:start}
.row>div{margin-top:1px}
"""
parts = [f'<title>日本語能力試験 직검수</title><meta name="claude:viewport-fit-sides" content="cover"><style>{css}</style><div class="wrap">']
cards = sum(len(x['words']) for L in data for x in L['exercises'])
drops = [d for d in dec if d['action'] == 'drop']
fixes = [d for d in dec if d['action'] == 'fix']
parts.append(f'<h1><span lang="ja">単語高陽 · 日本語能力試験</span> 직검수</h1>')
parts.append(f'<p class="lead">{date.today().isoformat()} · 공개본과 같은 데이터 · {len(data)}강 · {cards:,}카드. 줄을 눌러 댓글을 달아 주세요. '
             '한국어 뜻이 어색한 것, 해설이 필요 없거나 모자란 것, 빼거나 더할 단어. 일본어 표기·읽기는 원본 OpenJLPT와 Claude 판정을 따랐습니다.</p>')
toc = ['<a href="#review-dec">뺀 것·고친 것</a>'] + [f'<a href="#L{L["lesson"]}">{e(L["id"])}</a>' for L in data]
parts.append('<nav class="toc">' + ''.join(toc) + '</nav>')

parts.append(f'<h2 id="review-dec">원본 오류: 뺀 {len(drops)}개 · 바로잡은 {len(fixes)}개 <span class="tag">영신 확인 대기</span></h2>')
parts.append('<p class="lead">원본 목록에서 한자와 읽기가 엉뚱하게 짝지어졌거나 옛말 읽기인 항목입니다. 되살릴 것이 있으면 댓글로 알려 주세요.</p>')
for d in sorted(drops + fixes, key=lambda d: (d['action'], src[d['id']]['level'], src[d['id']]['reading'])):
    w = src[d['id']]
    after = ''
    if d['action'] == 'fix':
        nw, nr = d.get('word', w['word']), d.get('reading', w['reading'])
        after = f' → <span lang="ja">{e(nw)}（{e(nr)}）</span>'
    k = d.get('ko') or ko[d['id']]['ko']
    cls = 'row drop' if d['action'] == 'drop' else 'row'
    lab = '뺌' if d['action'] == 'drop' else '고침'
    parts.append(f'<div class="{cls}" id="d-{e(d["id"])}"><span class="w" lang="ja">{e(w["word"])}<span class="r">{e(w["reading"])} · {e(w["level"])}</span></span>'
                 f'<div><span class="ko">{e(k)}</span><span class="tag">{lab}</span>{after}<span class="why">{e(d.get("why", ""))}</span></div></div>')

for L in data:
    parts.append(f'<h2 id="L{L["lesson"]}">{e(L["id"])} · {e(L["name"])}</h2>')
    for x in L['exercises']:
        parts.append(f'<h3>{e(x["title"])} · {len(x["words"])}</h3>')
        for w in x['words']:
            c = f'<span class="c">{e(w["c"])}</span>' if w.get('c') else ''
            alt = f' · 한자 {e(", ".join(w["alt"]))}' if w.get('alt') else ''
            parts.append(f'<div class="row" id="c-{e(w["id"])}"><span class="w" lang="ja">{ruby(w["w"], w["en"])}'+
                         (f'<span class="r">{e(w["en"])}{alt}</span>' if (w["en"]!=w["w"] or alt) else '')+'</span>'+f'<div><span class="ko">{e(w["ko"])}</span>{c}</div></div>')
parts.append('</div>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text('\n'.join(parts))
print(out, out.stat().st_size)

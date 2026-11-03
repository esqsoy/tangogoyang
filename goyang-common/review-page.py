#!/usr/bin/env python3
"""언어불문 필수 표현 원장을 영신 직검수 페이지(Artifact용 HTML)로 뽑는다.

사용: python3 goyang-common/review-page.py [--out 파일]
항목마다 한 블록이라 댓글이 그 항목에 붙는다. 올릴 때 capabilities: {comments: {}}.
"""
import html, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
doc = json.loads((HERE / 'expressions.json').read_text())
out = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else HERE / 'out' / 'expressions-review.html'
e = html.escape
from collections import Counter
n_by = Counter(i['added'] for i in doc['items'] if i.get('added'))
n_added = sum(n_by.values())
SRC = {'0.2': 'Threshold 1990·Vantage·JF Can-do', '0.3': 'PCIC'}

css = """
:root{--bg:#f6f7f4;--fg:#1d2420;--mute:#5d6a62;--line:#d7ddd6;--card:#ffffff;--accent:#2f6b4f;--warn:#9a5b12;--warnbg:#fbf1e2;--newbg:#eef6f0;
--display:"Gowun Batang",Georgia,serif;--body:"Pretendard","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#151a17;--fg:#e4ebe6;--mute:#9aa8a0;--line:#2c352f;--card:#1c2320;--accent:#7cc4a0;--warn:#e3b46e;--warnbg:#2b2418;--newbg:#18261e;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#151a17;--fg:#e4ebe6;--mute:#9aa8a0;--line:#2c352f;--card:#1c2320;--accent:#7cc4a0;--warn:#e3b46e;--warnbg:#2b2418;--newbg:#18261e;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--body);line-height:1.55}
.wrap{max-width:760px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}
h1{font-family:var(--display);font-size:1.7rem;margin:0 0 6px;text-wrap:balance}
.lead{color:var(--mute);margin:0 0 18px;font-size:.95rem}
.kinds{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin:0 0 26px}
.kinds div{border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--card);font-size:.88rem}
.kinds b{display:block;color:var(--accent);font-family:ui-monospace,monospace;font-size:.82rem}
h2{font-family:var(--display);font-size:1.2rem;margin:30px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--line)}
h2 small{font-family:var(--body);color:var(--mute);font-size:.8rem;font-weight:400;margin-left:6px}
.row{display:grid;grid-template-columns:62px 34px 1fr;gap:4px 10px;align-items:baseline;padding:9px 4px;border-bottom:1px dashed var(--line)}
.id{font-family:ui-monospace,monospace;font-size:.78rem;color:var(--mute);font-variant-numeric:tabular-nums}
.lv{font-family:ui-monospace,monospace;font-size:.75rem;color:var(--accent);font-weight:600}
.task{font-size:.82rem;color:var(--mute)}
.ko{font-size:1.05rem}
.tags{grid-column:3;display:flex;flex-wrap:wrap;gap:4px 6px;align-items:baseline}
.hint{font-size:.78rem;color:var(--warn);background:var(--warnbg);border-radius:4px;padding:1px 6px}
.new{font-size:.75rem;font-weight:600;color:var(--accent);border:1px solid var(--accent);border-radius:4px;padding:0 5px}
.ref{font-size:.74rem;color:var(--mute);font-family:ui-monospace,monospace;overflow-wrap:anywhere}
.row.added{background:var(--newbg)}
@media (max-width:420px){.row{grid-template-columns:54px 30px 1fr}}
"""
parts = [f'<title>언어불문 필수 표현</title><meta name="claude:viewport-fit-sides" content="cover">',
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&display=swap">',
         f'<style>{css}</style><div class="wrap">',
         f'<h1>언어불문 필수 표현 원장</h1>',
         f'<p class="lead">초안 {e(doc["version"])} · {e(doc["date"])} · {len(doc["items"])}항목. 할 일과 공통 내용 문장(한국어)입니다. 줄을 눌러 댓글을 달아 주세요. 빼거나 더할 항목, 문장 고칠 것, 수준이 어긋난 것.</p>',
         (f'<p class="lead">원문과 대조해 더한 항목에는 판 표시가 붙어 있습니다: '
          + ', '.join(f'<span class="new">{e(v)} 추가</span> {n}항목({e(SRC.get(v, "원문"))})' for v, n in sorted(n_by.items()))
          + '. 회색 글씨가 근거 위치예요.</p>' if n_added else ''),
         '<div class="kinds"><div><b>same</b>거의 번역으로 통한다</div><div><b>counterpart</b>같은 상황, 다른 표현</div><div><b>none</b>그 언어에 해당 표현 없음</div></div>']
groups = doc['groups']
for g, name in groups.items():
    rows = [i for i in doc['items'] if i['group'] == g]
    parts.append(f'<h2>{e(name)}<small>{e(g)} · {len(rows)}</small></h2>')
    for i in rows:
        tags = []
        if i.get('added'):
            tags.append(f'<span class="new">{e(i["added"])} 추가</span>')
        if i.get('hint'):
            tags.append('<span class="hint">대응 가능성 큼</span>')
        if i.get('ref'):
            tags.append(f'<span class="ref">{e(" · ".join(i["ref"]))}</span>')
        tag_html = f'<div class="tags">{"".join(tags)}</div>' if tags else ''
        cls = 'row added' if i.get('added') else 'row'
        parts.append(f'<div class="{cls}" id="{e(i["id"])}"><span class="id">{e(i["id"])}</span><span class="lv">{e(i["level"])}</span>'
                     f'<div><div class="task">{e(i["task"])}</div><div class="ko">{e(i["ko"])}</div></div>{tag_html}</div>')
parts.append('</div>')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text('\n'.join(parts))
print(out)

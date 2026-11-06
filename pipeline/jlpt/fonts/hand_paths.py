#!/usr/bin/env python3
"""손글씨 글꼴(klee-kana.woff2) 글자 모양을 SVG 경로로 뽑는다 → klee-kana-paths.json. build.py가 五十音에 넣는다.
화면에서 이 경로를 KanjiVG 획 자리에 맞춰 놓고, 획순대로 가림막을 걷어 손글씨가 써지게 한다(26.11.06 영신).
좌표: 글꼴 단위(units per em)를 em=100으로 줄이고 y를 뒤집었다(위가 0). 다시 만들 때만 fontTools가 필요하다."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = Path(__file__).resolve().parent
f = TTFont(HERE / 'klee-kana.woff2')
upm, cmap, gs = f['head'].unitsPerEm, f.getBestCmap(), f.getGlyphSet()
k = 100 / upm
asc = f['hhea'].ascent
chars = json.loads((HERE.parent / 'kanjivg' / 'kana-strokes.json').read_text())
out = {}
for c in chars:
    g = cmap.get(ord(c))
    if not g:
        continue
    pen = SVGPathPen(gs, ntos=lambda v: ('%.1f' % v).rstrip('0').rstrip('.'))
    gs[g].draw(TransformPen(pen, (k, 0, 0, -k, 0, asc * k)))
    out[c] = pen.getCommands()
(HERE / 'klee-kana-paths.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
print(len(out), '글자', sum(len(v) for v in out.values()), '바이트')

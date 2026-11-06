#!/usr/bin/env python3
"""보카고양 마더텅 화면(vocagoyangksat2027.html)에서 日本語能力試験 화면 틀(template.html)을 한 번 뽑는다.

26.11.06 이 저장소에서 영어판 HTML을 지웠다(같은 주소의 보카고양 기록과 섞이지 않게). 다시 돌리려면
esqsoy/vocagoyang main 398c448의 vocagoyangksat2027.html을 이 저장소 맨 위에 잠시 두고 돌린다.

26.11.06 영신 결정(JLPT 과정 먼저, 1단계는 예문 없는 마더텅 방식)으로 만든 일회용 기록이다.
뽑은 뒤에는 template.html이 원본이다. 이 스크립트를 다시 돌리면 template.html의 손 수정이 사라진다.
사용: python3 pipeline/jlpt/derive-template.py --force
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'vocagoyangksat2027.html'
OUT = Path(__file__).resolve().parent / 'template.html'
if OUT.exists() and '--force' not in sys.argv:
    sys.exit('template.html이 이미 있다. 손 수정을 지우려면 --force')

lines = SRC.read_text().split('\n')
def setline(prefix, new):
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    lines[hits[0]] = new
setline('const IPA_EFFECT_MAPS = ', 'const IPA_EFFECT_MAPS = {};')
setline('const PRONUNCIATION_AUDIO_MAP = ', 'const PRONUNCIATION_AUDIO_MAP = {};')
setline('const DATA = ', 'const DATA = /*__DATA__*/[];')
setline('const MT_PRONUNCIATIONS = ', 'const MT_PRONUNCIATIONS = {};')
setline('const MT_CONTEXTS=', 'const MT_CONTEXTS={};')
s = '\n'.join(lines)

def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, (old[:60], n)
    s = s.replace(old, new)

# 저장 키: 같은 esqsoy.github.io에 있는 보카고양과 절대 겹치지 않게(PRINCIPLES 0-1)
s = re.sub(r'(["\'`])goyang-', r'\1tangogoyang-', s)
assert not re.search(r'(["\'`])goyang-', s)

rep('<title>마더텅 · 벗어나고양!</title>', '<title>日本語能力試験 · 単語高陽</title>')
rep('<h2>2027 마더텅 영어 독해</h2>', '<h2>日本語能力試験 N5–N1</h2>')
rep('aria-label="영어 정답"', 'aria-label="일본어 정답"')
rep('const SAVED_COURSE="마더텅";', 'const SAVED_COURSE="日本語能力試験";')
rep("PACE_COURSE==='ksat'?'마더텅 완주'", "PACE_COURSE==='ksat'?'日本語能力試験 완주'")
OUT.write_text(s)
print(OUT, len(s))

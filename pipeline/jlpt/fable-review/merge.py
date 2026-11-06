#!/usr/bin/env python3
"""Fable 독립 검수 결과(out-NN.json)를 받아들일 것만 골라 accepted.json으로 모은다. build.py가 읽는다.

받아들이는 기준(Claude, 26.11.06):
- ko·c·readings(漢字読み에서 함께 받는 읽기) 고침: high·medium 모두. 뜻을 좁히거나 해설을 더하는 쪽이라 틀린 것을 가르칠 위험이 작다.
- shown(화면 표기) 고침: high·medium 모두. 표준 오쿠리가나·가나 표기로 맞추는 것이고, 원래 표기는 별표기(alt)로 계속 정답이다.
- reading(정답 읽기) 바꿈: high만. 정답이 바뀌는 고침이라 확신이 높을 때만.
- drop(빼기): high만, 그리고 '단어 삭제는 영신 의견 먼저' 규칙 때문에 HANDOFF에 따로 적는다. medium drop은 받지 않는다.
받지 않은 것은 rejected.json에 남긴다.
"""
import json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
KANA = re.compile(r'^[぀-ヿー]+$')
acc, rej = {}, []
for f in sorted(HERE.glob('out-*.json')):
    for x in json.loads(f.read_text()):
        fx, conf, i = x.get('fix') or {}, x.get('confidence'), x['id']
        take = {}
        for k in ('ko', 'c', 'shown'):
            if k in fx and isinstance(fx[k], str):
                if k == 'ko' and not fx[k].strip():
                    continue
                take[k] = fx[k].strip()
        if fx.get('readings'):
            rs = [r for r in fx['readings'] if isinstance(r, str) and KANA.match(r)]
            if rs:
                take['readings'] = rs
        if fx.get('reading'):
            if conf == 'high' and KANA.match(fx['reading']):
                take['reading'] = fx['reading']
            else:
                rej.append({**x, 'reason': 'reading 바꿈은 high만'})
        if fx.get('drop'):
            if conf == 'high':
                take = {'drop': True}
            else:
                rej.append({**x, 'reason': 'medium drop은 받지 않음'})
                continue
        if take:
            prev = acc.get(i, {})
            if 'readings' in prev and 'readings' in take:
                take['readings'] = sorted(set(prev['readings']) | set(take['readings']))
            acc[i] = {**prev, **take}
(HERE / 'accepted.json').write_text(json.dumps(acc, ensure_ascii=False, indent=0))
(HERE / 'rejected.json').write_text(json.dumps(rej, ensure_ascii=False, indent=0))
n = lambda k: sum(1 for v in acc.values() if k in v)
print(f'받음 {len(acc)}카드 · ko {n("ko")} · c {n("c")} · 표기 {n("shown")} · 읽기 {n("reading")} · 함께 받는 읽기 {n("readings")} · 뺌 {n("drop")} · 안 받음 {len(rej)}')

#!/usr/bin/env python3
"""out/input-*.json을 읽어 통과 못 한 카드와 틀렸는데 통과한 입력을 종류별로 묶어 보여 준다."""
import json,sys,collections,pathlib
H=pathlib.Path(__file__).parent/'out'
full='--full' in sys.argv
for mode in ['meaning','yomi','kana']:
    d=json.load(open(H/f'input-{mode}.json'))
    print(f"\n===== {mode}: {d['cards']}카드({d['unique']}종) =====")
    by=collections.defaultdict(list)
    for f in d['fails']: by[f['test']].append(f)
    for t,fs in by.items():
        print(f"\n-- 통과 못 함 [{t}] {len(fs)}종")
        for f in fs[: None if full else 60]:
            p=f['places'][0]
            print(f"   {p['term']}({p['jw']}) 입력 {f['input']!r} → 앱이 본 것 {f['got']!r} {'(다 치기 전에 오답 처리)' if f.get('early') else ''} [{p['lesson']} / {p['ex']} #{p['i']+1}{' 외 '+str(len(f['places'])-1)+'곳' if len(f['places'])>1 else ''}]")
    by=collections.defaultdict(list)
    for f in d['falseAccepts']: by[f['kind']].append(f)
    for t,fs in by.items():
        print(f"\n-- 틀렸는데 통과 [{t}] {d.get('falseAcceptCounts',{}).get(t,len(fs))}건(예시 {len(fs)}건)")
        for f in fs[: None if full else 12]:
            p=f['places'][0]
            print(f"   정답 {p['term']}({p['jw']}) ← 입력 {f['input']!r} (앱이 본 것 {f.get('got')!r}) [{p['lesson']} / {p['ex']} #{p['i']+1}]")

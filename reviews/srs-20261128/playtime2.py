import random
T_OK,T_BAD=6.0,16.0
def sim(p,p90,back='reset',r2=2,with90=True,n=200000,seed=1):
    rnd=random.Random(seed);tot_t=0;tot_a=0
    boxes=len(p)
    for _ in range(n):
        i=0;stage='chain';t=0;a=0
        while True:
            q=p[i] if stage=='chain' else p90
            a+=1
            if rnd.random()<q:
                t+=T_OK
                if stage=='chain':
                    i+=1
                    if i==boxes:
                        if with90: stage='p90'
                        else: break
                else: break
            else:
                t+=T_BAD+r2*T_OK
                if stage=='p90': stage='chain';i=0;with90_local=False
                else: i=0 if back=='reset' else max(0,i-1)
        tot_t+=t;tot_a+=a
    return tot_a/n,tot_t/n
base_p=[.75,.75,.75,.70];p90=.75
def show(name,**kw):
    out=[]
    for e in [.2,.3]:
        a,t=sim(base_p,p90,**kw);base=12*((1-e)*T_OK+e*(T_BAD+2*T_OK))
        out.append(f'{int(e*100)}%: +{12*e*t/60:.1f}분(+{12*e*t/base*100:.0f}%)')
    a,t=sim(base_p,p90,**kw)
    print(f'| {name} | {a:.1f}번 | '+' | '.join(out)+' |')
print('| 규칙(중간 가정: 복습 때 75%) | 틀린 카드 1장당 복습 시도 | 처음 오답률 20% | 30% |')
print('|---|---|---|---|')
show('안 2판 그대로(다시 틀리면 1일, 복습도 2연속)')
show('다시 틀리면 한 칸만 뒤로',back='step')
show('복습 카드는 그날 한 번만 맞히면 통과',r2=1)
show('둘 다',back='step',r2=1)
show('둘 다 + 90일 점검 뺌',back='step',r2=1,with90=False)
print()
for name,p in [('칸 셋(1·7·30일), 한 칸 뒤로, 그날 한 번',[.75,.70,.70]),('칸 둘(3·30일), 한 칸 뒤로, 그날 한 번',[.72,.70])]:
    a,t=sim(p,.75,back='step',r2=1,with90=False)
    for e in [.2,.3]:
        base=12*((1-e)*T_OK+e*(T_BAD+2*T_OK));print(name,f'{a:.1f}번',f'{int(e*100)}%: +{12*e*t/60:.1f}분(+{12*e*t/base*100:.0f}%)')

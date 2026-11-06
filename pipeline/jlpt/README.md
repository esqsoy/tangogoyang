# 日本語能力試験 과정 (탄고고양 · 1단계)

JLPT N5→N1 단어를 **예문 없는 마더텅 방식**으로 담은 과정이다. 한국어 뜻과 가나 글자 수를 보고 일본어(가나)를 친다. 결정과 이유는 [PRINCIPLES 0-1](../../PRINCIPLES.md#0-1-니혼고양-기본-설계-2026-11-03)과 HANDOFF 26.11.06 절.

## 원본과 조립

| 파일 | 무엇 | 원본인가 |
|---|---|---|
| `source/vocab.json` | OpenJLPT 0.3.0 N5~N1 7,811어(표제어·읽기·영어 뜻·품사). Tatoeba 예문은 뺐다 | 원본(CC BY-SA 4.0, `source/LICENSE-OpenJLPT`·`NOTICE-OpenJLPT.md`) |
| `ko/batch-01~10.json` | 한국어 뜻(ko)·주제·uk(보통 가나로 씀)·해설(c). 규격은 [KO_SPEC.md](KO_SPEC.md) | 원본 |
| `review-decisions.json` | 원본 목록의 이상 항목 336개 판정: keep / drop(뺌) / fix(표기·읽기 바로잡음) | 원본(덮어쓰기) |
| `ko-fixes.json` | 뜻 줄이 똑같은 카드를 갈라 쓴 것 | 원본(덮어쓰기) |
| `fable-review/accepted.json` | Fable 독립 검수에서 받아들인 고침(merge.py가 만든다) | 원본(덮어쓰기) |
| `fixes.json` | **마지막 고침**: 최종 검수와 학생 리포트. 다른 모든 고침 뒤에 덮는다 | 원본(덮어쓰기) |
| `template.html` | 화면. 보카고양 마더텅 화면에서 [derive-template.py](derive-template.py)로 한 번 뽑은 뒤 손으로 고친다 | 원본 |
| `../../tangogoyangjlpt.html` | 조립 결과 | **생성물. 직접 고치지 않는다** |

```
python3 pipeline/jlpt/build.py      # tangogoyangjlpt.html, index.html 단어 수
node pipeline/jlpt/test-jlpt.cjs    # 로마자→가나·판정·화면 흐름 검사
```

## 세 과정

- `tangogoyanggojuon.html` 五十音: 가나를 보고 소리를 로마자·한글로 친다. 원본 [gojuon.py](gojuon.py) → `gojuon-data.json`. 10강·42연습·447카드(복습 포함). 진도·저장 키 `tangogoyang-kana-`. 고양이는 한국어. 만들 때 `python3 pipeline/jlpt/gojuon.py && python3 pipeline/jlpt/build.py --only gojuon`(완성된 두 게임은 다시 만들지 않는다).


- `tangogoyangjlpt.html` 日本語能力試験: 한국어 뜻을 보고 읽기를 친다. 7,743카드.
- `tangogoyangyomi.html` 漢字読み: 한자 표기와 뜻을 보고 읽기를 친다(JLPT 문자·어휘의 漢字読み 대비, 26.11.06 영신). 한자가 든 카드만, 같은 묶는 법. 한자를 그대로 치면 답이 아니다. 진도·저장 키는 따로(`tangogoyang-yomi-`). 같은 표기·같은 뜻의 다른 표준 읽기는 카드의 `ar`로 받는다.
- 두 파일은 같은 template.html에서 `JP_MODE`만 바꿔 조립한다. 교재 선택 화면에서 고른다.

## 묶는 법

급수(N5→N1) → 주제 23갈래(`build.py`의 `TOPICS` 순서) → 연습(약 12카드, 6장 안 되는 주제는 다음 주제와 묶는다). 연습들을 카드 수가 고르게 약 400카드씩 강으로 나눈다(N5 ①②…). 26.11.06 최종 검수 때 묶음을 다시 짰다(1~3장짜리 연습, 51~1,474장 강이 있었다). 진도는 강 이름+연습 제목으로, 모아둔 카드는 OpenJLPT id로 저장한다. 그래서 묶음을 바꾸면 진도 기록은 이어지지 않는다.

## 입력·판정 (template.html)

- 로마자로 치면 그 자리에서 가나로 바뀐다(`jpRomaToKana`). 카드가 가타카나 말이면 가타카나로 보인다. `-`는 ー. `nn`·`n'`은 ん.
- 한글로 친 소리도 가나로 바뀐다(`jpHangulToKana`, 26.11.06 영신 요청). 한글이 가르지 못하는 か/が·た/だ·ぱ/ば·ざ/じゃ/ちゃ는 그 카드 정답의 같은 자리 가나로 읽는다. 받침 ㅅ·ㄷ·ㄱ·ㅂ = っ, ㄴ·ㅁ·ㅇ = ん, 장음은 '우'나 '-'. 티·디 = てぃ·でぃ(ち·じ는 치·지).
- 일본어 자판으로 친 가나·한자도 받는다. 한자는 그 카드 표기(`w`)나 별표기(`alt`)와 같을 때만 맞다.
- 판정은 히라가나로 맞춘 뒤 비교한다. 장음 ー는 앞 모음과 같게 본다(コーヒー = こおひい).
- こんにちは·こんばんは를 소리대로 わ로 치면 맞다고 하되 쓰는 법을 알려 준다.
- 일본어 자판 변환 중(composition)에는 판정·넘김을 하지 않는다.
- 발음은 브라우저 ja-JP 음성으로 가나 읽기를 읽힌다(한자를 넘기면 잘못 읽을 수 있다). IPA 효과는 없다.

## 저장 키

모두 `tangogoyang-`로 시작한다. 같은 esqsoy.github.io의 보카고양(`goyang-`)과 겹치지 않는다.

## 남은 것

- 2단계: 예문(FABLE 방식)·고양이 대사. 영신: JLPT 기출이 있으면 분석해서 예문으로 쓰자(저작권 때문에 그대로 옮기지 않고 분석해 새로 쓴다는 안은 HANDOFF 참고).
- 뜻이 일부 겹치는 카드(뜻 조각만 같은 것) 정리, 일본어 사람 검수.

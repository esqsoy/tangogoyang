# 탄고고양 작업 지침

탄고고양(単語高陽, 일본어 단어 게임, 옛 니혼고양)의 작업 지침이다. 본가 보카고양(esqsoy/vocagoyang)의 지침을 26.11.12에 이 저장소에 맞게 고쳐 썼다(이솝 검수 P07). 본가에서 그대로 가져온 원칙의 이유는 [PRINCIPLES.md](PRINCIPLES.md)에 있다.

## 시작할 때

0. **[PRINCIPLES.md](PRINCIPLES.md)를 먼저 읽는다.** 탄고고양 결정은 0-1절, 고양이 말투는 1절, 기록하는 법은 10절.
1. `git status --short`로 진행 중인 변경을 확인한다. 기존 변경을 덮어쓰거나 정리하지 않는다.
2. [HANDOFF.md](HANDOFF.md) 맨 위 '지금 상태'에서 숫자·공개 상태·대기 항목을 확인한다.
3. AL 장부(esqsoy/AL)의 `[탄고고양]`(옛 `[니혼고양]`) 이슈를 확인한다. 본가가 공통 기능을 고치면 이 이슈로 알려 온다([SHARED.md](SHARED.md)).
4. 화면·입력·발음은 [UI_STANDARD.md](UI_STANDARD.md)와 [pipeline/jlpt/README.md](pipeline/jlpt/README.md) '입력·판정'을, 구성은 [WORK_PLAN.md](WORK_PLAN.md)를 읽는다. [WORK_LOG.md](WORK_LOG.md)는 경위 확인용이다.

최신 사용자 지시를 우선한다. 현재 기준 문서와 날짜가 붙은 과거 기록이 충돌하면 현재 기준을 적용한다.

## 유지할 기준

- **원본과 생성물을 구분한다.** 세 게임 HTML은 `pipeline/jlpt/template.html`과 데이터에서 `python3 pipeline/jlpt/build.py`로 조립한다. 생성된 HTML만 고치지 않는다.
- **세 게임 모두 계속 고친다**(26.11.13 영신 "일능검판 포함 완성본이라고 해도 지속 업그레이드를 하는걸로 해줘". 26.11.06 "두게임파일은 완성이니 건드릴게 없고"는 대체됨). template.html을 고치면 세 게임을 다 다시 조립하고(`python3 pipeline/jlpt/gojuon.py && python3 pipeline/jlpt/build.py`), 전 카드 입력 흉내(`reviews/aesop-20261112/behavior/01-input-sim.cjs` + `01b-summarize.py`)로 '통과 못 함'이 새로 생기지 않았는지 본다.
- **고침의 자리:** 학생 리포트·검수로 고칠 뜻·해설·표기·읽기·빼기·되살리기는 `pipeline/jlpt/fixes.json`(마지막에 덮는 고침). 五十音은 `gojuon.py`·`gojuon_sound.py`.
- **공통 기능(기록 옮기기)은 본가 파일을 그대로 쓰고 `config.json`만 고친다.** 같이 쓰는 파일을 고쳐야 하면 AL `[보카고양]` 이슈로 부탁한다([SHARED.md](SHARED.md)).
- **저장 키는 `tangogoyang-`로 시작한다**(五十音 `tangogoyang-kana-`, 漢字読み `tangogoyang-yomi-`). 같은 주소의 보카고양 `goyang-`과 겹치면 안 된다.
- 단어 추가·삭제는 먼저 의견을 제시한다. 새로운 게임 방식은 먼저 논의한다. 이미 승인된 범위의 구현·수정에는 재승인을 요구하지 않는다.
- 교재·기출 원문을 데이터로 그대로 넣지 않는다(분석해 새로 쓴다). 漢字読み 고양이는 프리저 패러디이되 이름·그림·원문 대사는 쓰지 않는다(PRINCIPLES 1).
- **검수:** 독립 검수는 이솝(= Fable 5.2) 서브에이전트. `reviews/aesop-YYYYMMDD/`에 README·review.json(P1~P3). 이솝은 지적만 하고, Claude가 하나하나 대조해 반영하고 받지 않은 것은 이유를 남긴다. 완성본 두 게임의 고침은 목록으로 영신에게 묻는다.
- 미리보기·로컬 수정·커밋·푸시·공개 배포를 구분한다. 배포 뒤 공개 파일이 로컬 조립과 같은지(SHA-256) 확인하고 실제 확인한 상태만 보고한다.
- 영신에게는 한국어 반말, 소연에게는 존댓말. 주요 결과는 대화 안에서도 알린다. 영신이 답하지 않은 결정은 다음 메시지에 다시 꺼낸다.
- 영신의 개별 제안도 원칙과 부딪치면 반대 의견과 대안을 먼저 낸다(PRINCIPLES 10). 영신: "내가 제안한것들은 모두 제안이니 네가 더 낫다고 생각하는건 그렇게 해줘"(26.11.12).
- 저장소 파일에 모델 이름을 쓰지 않는다(검수자 별칭 '이솝'은 쓴다).

## 검사

```
node pipeline/jlpt/test-jlpt.cjs                 # 입력·판정·세 과정 화면·저장 키·기록 옮기기
node pipeline/record-transfer/build.cjs --check  # 교재 선택 화면의 기록 옮기기가 공용 파일과 같은지
node pipeline/record-transfer/test.cjs           # 기록 옮기기 공통 검사(본가 파일)
```

이솝 검수의 재현 스크립트(전 카드 입력 흉내, 화면 넘침 등)는 `reviews/aesop-20261112/behavior/`에 있다.

## 작업을 마칠 때

- 의미 있는 변경이나 결정이 생기면 [WORK_LOG.md](WORK_LOG.md)에 날짜, 요청·결정(영신 원문), 변경 파일, 실제 검증, 남은 일과 배포 상태를 추가한다.
- [HANDOFF.md](HANDOFF.md) '지금 상태'를 갱신한다. 대기 중인 일을 완료로 표시하지 않는다. 숫자는 build.py 출력을 옮긴다.
- 원칙이 바뀌거나 새로 생기면 이유와 결정자·날짜를 [PRINCIPLES.md](PRINCIPLES.md)에 남긴다. 표시 원칙은 [UI_STANDARD.md](UI_STANDARD.md)에도.
- 배포한 경우에만 [DEPLOYMENT.md](DEPLOYMENT.md)에 커밋과 확인한 공개 상태를 기록한다.
- AL 담당 파일(`axes/01_학원/탄고고양.md`)의 지금 상태와 작업 로그를 고친다.

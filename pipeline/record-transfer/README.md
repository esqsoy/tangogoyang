# 기록 옮기기

교재 선택 화면(index.html) 맨 아래 ‘⇄ 다른 기기로 기록 옮기기’. 세 교재 기록을 한 파일로 내보내고, 다른 기기에서 그 파일을 합친다. 각 교재 홈의 ⌂(교재 선택)로 들어오면 된다. `index.html#records`로 열면 창이 바로 뜬다.

- 결정: 26.11.04 영신. 어느 기기에서 하든 기록이 같게 할 방법으로 Claude가 두 길을 냈다. 하나는 파일로 옮기기(서버·로그인 없음), 다른 하나는 클라우드 자동 동기화(로그인, 외부 저장, 미성년자 개인정보, 유지보수)다. 영신이 "1번이면 충분해!"라고 해서 파일로 옮기기를 만들었다. 이유와 원칙은 [PRINCIPLES 14](../../PRINCIPLES.md#14-fable-세트는-차례로-연다) 아래 '기록 옮기기'에 있다.
- 보카고양 기록은 모두 `goyang-`으로 시작하는 localStorage 키다. 세 교재가 같은 주소(esqsoy.github.io)라 저장 공간을 함께 쓰므로 한 화면에서 다 옮긴다. 같은 주소의 다른 게임 키(주기율표 `zerotwo_…`, 탄고고양 같은 다른 언어판)는 건드리지 않는다. 검사용 전체 열기 `goyang-fable-unlock-v1`은 옮기지 않는다.

## 파일

`{app: "vocagoyang-records", v: 1, exportedAt, data: {키: 저장된 문자열}}`. 이름은 `보카고양-기록-YYYY-MM-DD.json`이다. 터치 기기에서 공유 기능이 되면 공유 시트(카톡 ‘나와의 채팅’ 등)를 띄우고, 안 되면 파일로 저장한다.

## 합치기 규칙(`merge.js`)

지우지 않는다. 어느 기기에서 한 것이든 남는다. 같은 파일을 두 번 합치면 두 번째는 할 일이 없다.

| 키 | 합치는 법 |
|---|---|
| 진도 `goyang-hoe-seoul-v1`·`goyang-seoul-v1`·`goyang-ebs-seoul-v1` | 한쪽이라도 클리어했으면 클리어. 둘 다면 이 기기 것을 두고 최고 시간(bestMs)만 더 빠른 쪽 |
| 모아둔 카드 `…-saved-cards-v1` | 합집합. 이 기기 순서 먼저, 새 카드는 담은 순서로 뒤에. 담은 때는 이른 쪽 |
| 익힌 단어 `goyang-learned-words-v1` | 교재마다 합집합. 교재를 열면 진도로 다시 맞춘다 |
| 틀렸던 단어 `goyang-missed-words-v1` | 단어마다 큰 횟수. 더하면 같은 파일을 두 번 합칠 때 부풀어 오른다 |
| 돌파 축하 `goyang-milestone-v1` | 큰 쪽(본 축하를 다시 띄우지 않는다) |
| 세트 도장 `goyang-fable-stamps-v1` | 받은 도장은 다 남기고, 둘 다 있으면 이 기기 날짜 |
| 진행 속도 `goyang-pace-…`·`goyang-pace-meta-…` | 기록은 합쳐 시간순 최근 600판, 판 수는 큰 쪽 |
| 그 밖(이어하기 자리, 범위 B1/C1, 2026/전체, 대학 이름) | 이 기기에 있으면 그대로, 없을 때만 가져온다 |

모아둔 카드를 한 기기에서 빼도, 다른 기기 파일을 합치면 다시 들어온다. 뺀 기록을 따로 남기지 않기 때문이다. 받아들인 한계다.

## 단어장끼리 같이 쓰기

이 폴더는 공통 기능이다([SHARED.md](../../SHARED.md)). 게임마다 다른 값은 `config.json`에만 둔다. 이름(`game`), 파일 표시(`app`), 저장 키 접두어(`prefix`), 옮기지 않을 키(`skip`), 키 종류 패턴(`kinds`, 위에서부터 처음 맞는 것), 넣을 HTML(`target`)이다. 빌드가 이 값을 `RT_CONFIG`로 넣는다. 키 종류에 없는 키는 '이 기기에 없을 때만 가져오기'로 합친다. 다른 언어판은 merge.js 등을 그대로 복사하고 config.json만 자기 값으로 바꾼다.

## 원본과 빌드

`merge.js`(규칙), `runtime.js`(화면 동작), `ui.html`(버튼·창), `style.css`를 `node pipeline/record-transfer/build.cjs`로 index.html의 `record-transfer-style`, `RECORD_TRANSFER_UI_START/END`, `<script id="record-transfer">` 자리에 넣는다. 검사 모드는 `--check`다. index.html의 이 구간을 직접 고치지 않는다.

## 검증

검사는 둘로 나뉜다(26.11.12, 탄고고양 요청: 검사가 보카고양 키에 묶여 있어 분가가 못 돌렸다).

- `node pipeline/record-transfer/test.cjs`(같이 쓰는 파일, 분가도 그대로 돌린다): 합치기 규칙은 게임과 상관없는 시험용 설정(`testgoyang-`)으로 본다. 키 모으기, 파일 형식·잘못된 파일, 종류별 합치기, 600판 자르기, 지우지 않음, 두 번 합쳐도 그대로, 남의 키를 쓰지 않음. 이어서 이 게임 `config.json`을 본다: 접두어 꼴(`소문자-`), `app` 꼴(`저장소이름-records`), 옮기지 않을 키, 키 종류 이름·패턴, 같은 주소의 다른 게임 키를 모으지도 쓰지도 않음, 넣을 HTML 반영.
- `node pipeline/tests/record-transfer.test.cjs`(보카고양만): 위 공통 검사를 돌리고, 세 교재의 실제 저장 키가 맞는 종류로 가는지 본다. 분가는 자기 키로 같은 꼴의 검사를 따로 둔다.

# 漢字読み 추가·Fable 검수 반영 공개 · 2026-11-06

- main `cd5a65e`(+ HANDOFF 정리 커밋) 공개. 한글 입력(`cb0a9b0`), 漢字読み 과정(`f689e75`), Fable 독립 검수 455카드 반영이 들어 있다.
- 공개 주소: https://esqsoy.github.io/tangogoyang/ (교재 선택: 日本語能力試験 7,741단어 · 漢字読み 6,483단어), …/tangogoyangjlpt.html, …/tangogoyangyomi.html.
- 확인(새로 실행): 공개 두 게임 파일 SHA-1이 로컬 조립 결과와 같다(`78b044e…`·`6f20aec…`). 공개 페이지에 test-jlpt.cjs와 같은 검사 42개를 돌려 모두 통과(Chromium). 교재 선택 화면의 단어 수가 새 값으로 보인다.
- 영신 Safari 확인(26.11.06): "사파리로 잘 돼". Android 실기기는 미확인.

# 탄고고양 첫 공개 (日本語能力試験 1단계) · 2026-11-06

- 영신이 저장소 Settings → Pages에서 main을 켬. Pages 빌드 `42221181627`(main `a42eb37`)가 끝난 뒤 공개됨.
- 공개 주소: https://esqsoy.github.io/tangogoyang/ (교재 선택), https://esqsoy.github.io/tangogoyang/tangogoyangjlpt.html (日本語能力試験 N5–N1, 7,743카드).
- 확인(새로 실행): 공개 `index.html`·`tangogoyangjlpt.html`의 SHA-1이 로컬 조립 결과와 같다(`8e00a1c…`·`eb0cf1a…`). 공개 페이지에 `pipeline/jlpt/test-jlpt.cjs`와 같은 검사를 돌려 모두 통과(Chromium). 지운 영어판 주소(vocagoyangfable·ksat2027)는 404.
- 미확인: iPhone Safari·Android 실기기, 일본어 음성 실제 소리.

# like ① 고양이 대사(I Really Like You) 배포 · 2026-11-02

- 커밋 [b7d6650](https://github.com/esqsoy/vocagoyang/commit/b7d6650)를 origin/main에 fast-forward로 푸시했다. [Pages 41386718957](https://github.com/esqsoy/vocagoyang/actions/runs/41386718957) 성공(2026-11-02 04:08:34 UTC 완료 확인).
- 그 앞의 두 배포: [0dcf3d3](https://github.com/esqsoy/vocagoyang/commit/0dcf3d3)(like ① 해설 비움, Claude가 요청을 잘못 읽음, [Pages 41385809142](https://github.com/esqsoy/vocagoyang/actions/runs/41385809142) 성공)는 [e563c90](https://github.com/esqsoy/vocagoyang/commit/e563c90)으로 되돌렸다([Pages 41386204615](https://github.com/esqsoy/vocagoyang/actions/runs/41386204615) 성공, FABLE이 e710c63으로 돌아옴). 0dcf3d3 판은 약 6분 공개됐다.
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 72e9b31, 수능 1f15fae, EBS 7a0eb08, index 6c557dd). github.io는 이 세션에서 열지 않았다.
- 포함: 1세트 like ① 고양이 대사 "‘I Really Like You’… 츄르한테 부르는 노래라고양. 착각 말라고양.", 해설을 읽기량 12초 안으로 줄임(원장 like-song-20261102).
- 배포 전 검사(b7d6650와 같은 내용에서 새로 실행): 검사 45개 통과, deepcheck A6 16·A8 1(전부터), 원장 되감기 해시 일치. Chromium 360·390px에서 대사 말풍선 두 줄, 페이지 오류 0.

---

# iPhone 힌트 칸 화면 튐 수정 배포 · 2026-10-27

- 커밋 [9d41f37](https://github.com/esqsoy/vocagoyang/commit/9d41f37)를 origin/main에 fast-forward로 푸시했다(35bf16f 다음, 그 사이 04b7905·35bf16f는 기록 문서만). [Pages 40521055847](https://github.com/esqsoy/vocagoyang/actions/runs/40521055847) 성공(2026-10-27 14:26:59 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE e710c63, 수능 1f15fae, EBS 7a0eb08, index 6c557dd). github.io는 이 세션에서 열지 않았다.
- 포함: 세 교재 첫 글자 힌트에서 커서가 끝이 아닐 때만 `setSelectionRange`, 힌트 버튼이 누르기 전 스크롤 자리를 지킴(학생이 직접 스크롤하면 손대지 않음).
- 배포 전 검사(9d41f37와 같은 내용에서 새로 실행): 검사 45개 통과, 세 HTML 스크립트 구문 검사. Chromium 390×560 터치 모드에서 iOS식 끌어내림을 흉내 내 전 판은 40→940에서 멈추고 고친 판은 40으로 돌아오며 힌트가 열리는 것 확인, 페이지 오류 0. **실제 iPhone 확인은 영신 대기.**

---

# FABLE 대체 정답(ALT) 12곳 정리 배포 · 2026-10-26

- 커밋 [13cfe47](https://github.com/esqsoy/vocagoyang/commit/13cfe47)를 origin/main에 fast-forward로 푸시했다(434f0a7 다음). [Pages 40264351175](https://github.com/esqsoy/vocagoyang/actions/runs/40264351175) 성공(2026-10-26 03:30:38 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE db94d3a, 수능 51008be, EBS 729838d, index 6c557dd). github.io는 이 세션에서 열지 않았다.
- 포함: FABLE `const ALT`에서 카드 예문에 맞지 않는 별칭 12곳 삭제(post② mail, further② farther, hall① hallway, machinery① machines, attorney① lawyer, candy① sweet, flu① influenza, vet① veterinary, caption② subtitle, cooker① stove·range, lorry① truck, outward① outwards). 카드 데이터·마더텅·EBS는 그대로.
- 배포 전 검사(13cfe47와 같은 내용에서 새로 실행): 검사 45개 통과. Chromium에서 판정 함수로 바뀐 별칭 오답·남은 별칭 정답 확인, 페이지 오류 0. Safari 실기기는 보지 않았다.

---

# 연습 목록 화면 학원 소개 줄 배포 · 2026-10-26

- 커밋 [434f0a7](https://github.com/esqsoy/vocagoyang/commit/434f0a7)를 origin/main에 fast-forward로 푸시했다(0b6bcd2 다음). [Pages 40263817300](https://github.com/esqsoy/vocagoyang/actions/runs/40263817300) 성공(2026-10-26 03:23:55 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE ee5f5d2, 수능 51008be, EBS 729838d, index 6c557dd). github.io는 이 세션에서 열지 않았다.
- 포함: 세 과정 연습 목록 화면(`#lessonScreen`) 맨 아래 "STUDY1 국어 블로그 ›".
- 배포 전 검사(434f0a7와 같은 내용에서 새로 실행): 검사 45개 통과. Chromium 360px에서 세 과정 첫 세트·강의 연습 목록 맨 아래 표시, 누르면 새 탭에 블로그 주소, 원래 화면 그대로, 가로 넘침 0, 페이지 오류 0.

---

# 학원 소개 줄 "STUDY1 국어 블로그 ›" 배포 · 2026-10-25

- 커밋 [e948083](https://github.com/esqsoy/vocagoyang/commit/e948083)를 origin/main에 fast-forward로 푸시했다(394d44c 다음). [Pages 40216998101](https://github.com/esqsoy/vocagoyang/actions/runs/40216998101) 성공(2026-10-25 17:33:39 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 158dbfb, 수능 d8320cb, EBS 7d9811f, index 6c557dd). github.io와 블로그는 이 세션에서 열지 않았다(프록시가 naver 차단).
- 포함: "STUDY1 국어 제작 · 블로그 ›" → "STUDY1 국어 블로그 ›"(영신: 제작자 표기 빼고 학원 소개로), 줄 전체가 블로그 링크(새 탭).
- 배포 전 검사(e948083와 같은 내용에서 새로 실행): 검사 45개 통과. Chromium 360px 터치로 네 화면 모두 새 탭에 블로그 주소, 원래 화면·주소 그대로, 페이지 오류 0. Safari 실기기는 보지 않았다.

---

# 제작 표기에 STUDY1 블로그 링크 배포 · 2026-10-24

- 커밋 [5ba456f](https://github.com/esqsoy/vocagoyang/commit/5ba456f)(m.blog 주소로 링크 추가, [Pages 40106839214](https://github.com/esqsoy/vocagoyang/actions/runs/40106839214) 성공)에 이어 [2c4453c](https://github.com/esqsoy/vocagoyang/commit/2c4453c)(영신이 준 PC 주소 https://blog.naver.com/study1study 로 바꿈)를 origin/main에 fast-forward로 푸시했다. [Pages 40107157236](https://github.com/esqsoy/vocagoyang/actions/runs/40107157236) 성공(2026-10-24 15:29:47 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 2b4f62b, 수능 68b9a83, EBS 4dcda5e, index 66d2930). github.io와 블로그 주소는 이 세션에서 열지 않았다(프록시가 naver 차단).
- 포함: 교재 선택 화면과 세 과정 홈의 "STUDY1 국어 제작" 줄에 "블로그 ›"(새 탭, rel="noopener").
- 배포 전 검사(2c4453c와 같은 내용에서 새로 실행): 검사 45개 통과. Chromium 360px 터치로 네 화면 모두 새 탭에 블로그 주소가 열리고 원래 화면·주소가 그대로, 페이지 오류 0. Safari 실기기는 보지 않았다.

---

# 제작 표기 "STUDY1 국어 제작" · 모비 딕 해석 배포 · 2026-10-24

- 커밋 [f0a9c14](https://github.com/esqsoy/vocagoyang/commit/f0a9c14)를 origin/main에 fast-forward로 푸시했다(6ae28fb 옛 파일 보관 다음). [Pages 40101836437](https://github.com/esqsoy/vocagoyang/actions/runs/40101836437) 성공(2026-10-24 14:18:18 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 52d77cb, 수능 b6b2fcc, EBS d2d4d47, index 73ad91d). github.io는 이 세션에서 열지 않았다.
- 포함: 교재 선택 화면 맨 아래와 세 과정 홈 맨 아래 "STUDY1 국어 제작"(블로그 링크는 주소 대기), 2세트 call ① 해석 "이스마엘이라고 해."와 9세트 hide ① 해설 이름(원장 ishmael-20261024). 6ae28fb(history/·EBS 갱신 자료, 게임 HTML 변화 없음)도 이 앞에 main에 들어갔다.
- 배포 전 검사(f0a9c14와 같은 내용에서 새로 실행): 검사 45개 통과, deepcheck A6 16·A8 1(전부터), ordercheck 앞당김 둘 이상 0, 원장 되감기 해시 일치. Chromium 360·390px에서 인덱스·세 홈의 표기 위치, 가로 넘침 0, 페이지 오류 0. Safari 실기기는 보지 않았다.

---

# 고양고양이 숨은 설정(공부의 신의 저주) 대사 배포 · 2026-10-17

- 커밋 [b2c6efe](https://github.com/esqsoy/vocagoyang/commit/b2c6efe)를 origin/main에 fast-forward로 푸시했다(e301a29 다음). [Pages 38947270153](https://github.com/esqsoy/vocagoyang/actions/runs/38947270153) 성공(2026-10-16 18:26:34 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 274b1e8, 수능 9c2440b, EBS e143546, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: FABLE 엔딩 "내 정체는… Youngs…" → "…아니, 왜 갑자기 혀가… 흠흠!"(드론 Youngs), 마더텅·EBS 엔딩의 같은 대사와 "네가 대학 가면 저주가 한 명만큼 풀린다고양…", 세 과정 1,000단어 돌파 대사, 3세트 human ②·8세트 sleep ① 카드 대사(원장 cat-curse-20261017).
- 배포 전 검사(b2c6efe와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과. deepcheck A6 16·A8 1(전부터 있던 것, 새 대사 없음), ordercheck 앞당김 둘 이상 0. Chromium: FABLE 엔딩 Youngs 드론·흩어짐, 마더텅·EBS 엔딩 두 대사, 360px 1,000단어 돌파 말풍선(4줄), 페이지 오류 0. Safari 실기기 확인은 영신이 실제 플레이로(대기).

---

# FABLE 엔딩 '03학번' 대사 + 아스트라 10/17 리뷰 4건 수정 배포 · 2026-10-17

- 커밋 [fad1fd7](https://github.com/esqsoy/vocagoyang/commit/fad1fd7)를 origin/main에 fast-forward로 푸시했다(0e996b9 아스트라 리뷰 다음). [Pages 38941933814](https://github.com/esqsoy/vocagoyang/actions/runs/38941933814) 성공(2026-10-16 17:44:46 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE ceb12ba, 수능 894255f, EBS d5728a1, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: b28eb58 FABLE 전체 엔딩 "나도 인간일 때는 대학 갔었다고양… 03학번…"(드론 03)과 "…흠흠, 아니다고양", fad1fd7 R17-01 작은 화면 드론 잘림·R17-02 날아오는 단어 합성 모드(이제 세트 색)·R17-03 판 중 미리보기 미룸·R17-04 동작 줄이기 큰 도장.
- 배포 전 검사(fad1fd7와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과. Chromium 드론 화면 위 밖 0대(4개 화면 크기), 판 중 미리보기 미룸·겹침 방지, 동작 줄이기 계산값, 전체 엔딩 실제 시간 재생, 페이지 오류 0. Safari 실기기 확인은 영신이 실제 플레이로(대기).
- 실수: fad1fd7에 내 검사 도구가 출력 폴더 인자 없이 만든 `undefined/` 화면 캡처 6장(엔딩 스크린샷, 비밀 정보 없음)이 `git add -A`로 함께 들어가 공개 경로에도 올라갔다. 다음 커밋에서 지우고 `.gitignore`에 넣었다(faca268에 이어 두 번째). 게임 HTML은 그 커밋에서 바뀌지 않았다.

---

# FABLE B1 엔딩 첫 대사 배포 · 2026-10-16

- 커밋 [0d0f516](https://github.com/esqsoy/vocagoyang/commit/0d0f516)를 origin/main에 fast-forward로 푸시했다(bac6bfa 다음). [Pages 38909479287](https://github.com/esqsoy/vocagoyang/actions/runs/38909479287) 성공(2026-10-16 13:40:00 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE ad15d21, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: B1 엔딩 첫 대사 "시작이 반이라고양. 어느새 진짜 절반을 쌓았다고양."
- 배포 전 검사(0d0f516와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium B1 실제 흐름·동작 줄이기, 콘솔 오류 0. Safari 실기기 확인은 영신이 실제 플레이로(대기).

---

# FABLE 엔딩 메시지 단어 32개 배포 · 2026-10-16

- 커밋 [e076a64](https://github.com/esqsoy/vocagoyang/commit/e076a64)를 origin/main에 fast-forward로 푸시했다(9cfe73a 다음). [Pages 38874071187](https://github.com/esqsoy/vocagoyang/actions/runs/38874071187) 성공(2026-10-16 08:30:45 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE c5a3689, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 메시지 단어 32개(B1 20개), 마지막 간격 1.2초가 되게 줄어드는 비율을 단어 수에서 풂.
- 배포 전 검사(e076a64와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 메시지 시간표·장면·흐름·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 산 틈·메시지 간격 배포 · 2026-10-16

- 커밋 [9cfe73a](https://github.com/esqsoy/vocagoyang/commit/9cfe73a)를 origin/main에 fast-forward로 푸시했다(e6ffc6a 다음). [Pages 38872970710](https://github.com/esqsoy/vocagoyang/actions/runs/38872970710) 성공(2026-10-16 08:20:45 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE ef4a50a, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 층마다 맞는 가장 큰 글자 배율로 꽉 채워 산의 검은 띠 제거, 메시지 간격이 갈수록 짧아지는 시간표.
- 배포 전 검사(9cfe73a와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 정지 화면·메시지 시간표·흐름·B1 드론·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 메시지 단어 배포 · 2026-10-16

- 커밋 [e6ffc6a](https://github.com/esqsoy/vocagoyang/commit/e6ffc6a)를 origin/main에 fast-forward로 푸시했다(f0382a1 다음). [Pages 38864755762](https://github.com/esqsoy/vocagoyang/actions/runs/38864755762) 성공(2026-10-16 07:03:50 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 3e836b9, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 메시지 단어 14개(`FE_MSG`)가 차례가 오면 위쪽에 아주 크게 멈췄다가 제자리로, 검사에 목록 단어 존재 확인 추가.
- 배포 전 검사(e6ffc6a와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 메시지 장면·흐름·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 불꽃 축제 국룰 배포 · 2026-10-16

- 커밋 [f0382a1](https://github.com/esqsoy/vocagoyang/commit/f0382a1)를 origin/main에 fast-forward로 푸시했다(3519aa6 다음). [Pages 38862619864](https://github.com/esqsoy/vocagoyang/actions/runs/38862619864) 성공(2026-10-16 06:42:10 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE c2f6814, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 모양 가중치(모란·국화·변화국 중심, 데이지·고리 아주 드물게), 스타마인·혜성 부채꼴·교차·나이아가라, 축제 차례 피날레 약 8초.
- 배포 전 검사(f0382a1과 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 피날레·개막 스타마인·흐름·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 드론 영어·필기체·STUDY1·단어 광원 배포 · 2026-10-16

- 커밋 [3519aa6](https://github.com/esqsoy/vocagoyang/commit/3519aa6)를 origin/main에 fast-forward로 푸시했다(cb35e73 다음). [Pages 38861470319](https://github.com/esqsoy/vocagoyang/actions/runs/38861470319) 성공(2026-10-16 06:30:03 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 4d82935, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 노란 설명 '한뫼 → 큰 산 → 一山 → 일산', 드론 BIG MOUNTAIN·필기체 Ilsan·STUDY1 간판, 날아드는 단어 빛 번짐·혜성 꼬리.
- 배포 전 검사(3519aa6과 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 드론 장면·흐름·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 드론 쇼 배포 · 2026-10-16

- 커밋 [cb35e73](https://github.com/esqsoy/vocagoyang/commit/cb35e73)를 origin/main에 fast-forward로 푸시했다(dff366b 다음). [Pages 38860019462](https://github.com/esqsoy/vocagoyang/actions/runs/38860019462) 성공(2026-10-16 06:14:28 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 67f0cf3, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 대사에 맞춘 드론 650대(一山 → 일산 → 고양이 얼굴 → ㅇㅅㅊ → 흩어짐 → 착륙, B1 점선 윤곽 → '?'), 다 쌓은 뒤 불꽃 타이머가 따로 돌던 버그 수정.
- 배포 전 검사(cb35e73와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 드론 장면·흐름·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 둥근 봉우리·깃발 배포 · 2026-10-16

- 커밋 [dff366b](https://github.com/esqsoy/vocagoyang/commit/dff366b)를 origin/main에 fast-forward로 푸시했다(1fb094c 다음). [Pages 38857908153](https://github.com/esqsoy/vocagoyang/actions/runs/38857908153) 성공(2026-10-16 05:51:39 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 67abe0a, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 둥근 봉우리, 다 쌓이면 산 몸통을 꼭대기까지 그리고 깃발을 그 윗선에(B1은 쌓인 데 위).
- 배포 전 검사(dff366b와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 정지 화면(전체·B1)·쌓는 중·실제 흐름, 콘솔 오류 0.

---

# FABLE 엔딩 오중심 불꽃·쌓는 동안 대사 뺌 배포 · 2026-10-16

- 커밋 [1fb094c](https://github.com/esqsoy/vocagoyang/commit/1fb094c)를 origin/main에 fast-forward로 푸시했다(a1feecd 다음). [Pages 38857104755](https://github.com/esqsoy/vocagoyang/actions/runs/38857104755) 성공(2026-10-16 05:42:31 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 216d683, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 오중심(바깥 국화 + 芯 동심원 넷) 불꽃, 겹국화 芯을 동심원으로, 피날레 가운데 오중심 한 발, 쌓는 동안 말풍선 비움.
- 배포 전 검사(1fb094c와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 한 발씩·피날레·흐름(전체·B1)·동작 줄이기, 콘솔 오류 0.

---

# FABLE 엔딩 전통 불꽃·겹겹이 배포 · 2026-10-16

- 커밋 [a1feecd](https://github.com/esqsoy/vocagoyang/commit/a1feecd)를 origin/main에 fast-forward로 푸시했다(db5f9ee 다음, 배포 기록 95a2c3e 포함). [Pages 38856259389](https://github.com/esqsoy/vocagoyang/actions/runs/38856259389) 성공(2026-10-16 05:34:08 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 3ec0060, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열지 않았다.
- 포함: 전통 불꽃(국화·모란·겹국화·버드나무) 열에 일곱, 같은 자리 두 번 터짐, 더 잦은 일제 사격, 약 6초 쉰 발 남짓 피날레, 알갱이 상한 6,500/9,000.
- 배포 전 검사(a1feecd와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 전체·B1 흐름, Q=1 고정 피날레 스크린샷, 동작 줄이기, 콘솔 오류 0. 실기기는 영신 확인 대기.

---

# FABLE 엔딩 불꽃 아낌없이 배포 · 2026-10-16

- 커밋 [db5f9ee](https://github.com/esqsoy/vocagoyang/commit/db5f9ee)를 origin/main에 fast-forward로 푸시했다(1db57d5 다음, 배포 기록 00d16dd 포함). [Pages 38841915836](https://github.com/esqsoy/vocagoyang/actions/runs/38841915836) 성공(2026-10-16 02:44:33 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 07bf62b, 수능 010e44e, EBS 1e87323, index f7665dc). 바뀐 공개 파일은 FABLE 하나다. github.io는 이 세션에서 열지 않았다.
- 포함: 엔딩 불꽃을 화면 밖까지 크게, 여섯 모양(장미·꽃·국화·황금 버드나무·고리·갈라지는 별)과 반짝이, 일제 사격, 약 4초 서른 발 남짓 피날레, 대사·배지 동안에도. 번쩍임은 작고 짧게, 기기가 버거우면 알갱이 수 자동 축소.
- 배포 전 검사(db5f9ee와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 전체·B1 시간대별 스크린샷, 실제 흐름(전체·B1), 동작 줄이기, 콘솔 오류 0. 헤드리스 피날레 28~44fps(자동 축소 작동). 실기기 Safari는 확인하지 않았다.

---

# FABLE 엔딩 날아오는 단어 최종 색 배포 · 2026-10-16

- 커밋 [1db57d5](https://github.com/esqsoy/vocagoyang/commit/1db57d5)를 origin/main에 fast-forward로 푸시했다(e81788a 다음, 배포 기록 52d13be 포함). [Pages 38840448763](https://github.com/esqsoy/vocagoyang/actions/runs/38840448763) 성공(2026-10-16 02:27:35 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 7301199, 수능 010e44e, EBS 1e87323, index f7665dc). 바뀐 공개 파일은 FABLE 하나다. github.io는 이 세션에서 열지 않았다.
- 포함: 엔딩에서 크게 뜨는 단어를 흰색 대신 산에 앉을 세트 색으로(틀렸던 단어는 금빛), 같은 색 빛 번짐 조금 줄임.
- 배포 전 검사(1db57d5와 같은 내용에서 새로 실행): 검사 45개, 발음 browser-stamp·stamp 통과, Chromium 전체·B1 스크린샷과 실제 흐름(복습 → 도장 → 엔딩 → 배지) 콘솔 오류 0. 실기기 Safari는 확인하지 않았다.

---

# FABLE 엔딩 단어의 주마등·일산 불꽃놀이 배포 · 2026-10-15

- 커밋 [e81788a](https://github.com/esqsoy/vocagoyang/commit/e81788a)를 origin/main에 fast-forward로 푸시했다. [Pages 38789117812](https://github.com/esqsoy/vocagoyang/actions/runs/38789117812) 성공(2026-10-15 18:52:27 UTC 완료 확인).
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 0d7192b, 수능 010e44e, EBS 1e87323, index f7665dc). 바뀐 공개 파일은 FABLE 하나다. github.io는 이 세션에서 열지 않았다.
- 포함: 엔딩 산 장면을 단어 단위 주마등으로(모든 단어가 하나씩 크게 떴다가 쌓임, 끝 초당 8단어, 전체 약 60초·B1 약 30초), 빛살·섬광 대신 호수에서 쏘는 장미·꽃·국화 불꽃(수면 반사·피날레·대사와 배지 동안), 대사 '천릿길도 한 단어부터'·'티끌 모아 태산'(B1 '반 태산'), 금빛 이름표 화면 안으로, PC 스크롤바 띠·가로 넘침 막음.
- 배포 전 검사(e81788a와 같은 내용에서 새로 실행): 검사 45개, set-stamp, 발음 browser·browser-stamp·build·host·runtime·stamp 통과. Chromium 390×844: 전체·B1 시간대별 스크린샷, 실제 흐름(복습 → 도장 → 엔딩 → 건너뛰기 → 대사 → 배지·큰 도장), 동작 줄이기, 콘솔 오류 0. 실기기 Safari는 확인하지 않았다.

---

# FABLE 엔딩 빛·천천히·B1 큰 도장·미리보기 주소 배포 · 2026-10-15

- 커밋 [23daa73](https://github.com/esqsoy/vocagoyang/commit/23daa73)를 origin/main에 fast-forward로 푸시했다. [Pages 38783532458](https://github.com/esqsoy/vocagoyang/actions/runs/38783532458) 성공.
- 확인 방법: GitHub API로 main의 네 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 33a3f6d, 수능 010e44e, EBS 1e87323, index f7665dc). github.io는 이 세션에서 열 수 없어 실제 공개 화면은 보지 못했다.
- 포함: 엔딩 단어 산 천천히 쌓기·빛(빛살·불티·섬광, 산 몸통 어둡게), B1 1부 완결은 큰 도장, 미리보기 주소(#ending·#ending=b1·#stamp·#milestone) 열린 페이지에 붙여도 바로·대소문자 무관(세 교재 돌파 축하 포함), 발음 브라우저 검사 select 경합 해결.
- 배포 전 검사(23daa73과 같은 내용에서 실행): 검사 45개, 발음 stamp·runtime·host·build·browser·browser-stamp 통과, Chromium 도장 흐름·미리보기 주소·엔딩 시간표 확인, 콘솔 오류 0. 실기기 Safari는 확인하지 않았다.

---

# 예외 발음 음원 + Opus 최신 변경 통합 배포 · 2026-10-15

- 통합 커밋 [416be73](https://github.com/esqsoy/vocagoyang/commit/416be73)을 origin/main에 fast-forward로 푸시했다. 부모는 예외 음원 구현 `2115de7`과 Opus 최신 `ee47230`이다. [Pages 38713118742](https://github.com/esqsoy/vocagoyang/actions/runs/38713118742) 성공(2026-10-15 09:28:41 UTC 완료 확인).
- **공개 확인 완료:** index와 FABLE·마더텅·EBS HTML 모두 로컬 검증본과 일치. 공개 manifest와 175개 MP3의 크기·SHA256도 전부 일치(2,201,300바이트). 이번에는 github.io에 직접 접근해 확인했다.
- **공개 Chromium 실제 플레이:** 새 프로필에서 실제 클릭·키 입력으로 세 과정의 MP3 재생 시작/종료, IPA 효과, 다시 듣기, 무음, 음원 차단 시 TTS 복구를 확인했다. 콘솔 오류 없음. [공개 검증 결과](reviews/codex-20261015/evidence/pronunciation-public.json).
- **포함:** Heart 예외 음원 305카드 연결(FABLE 183 / 마더텅 97 / EBS 25), 뜻·품사별 음원 선택, 현재 카드만 선행 로딩, 실패·취소 처리. Opus의 내용 32장, 도장·엔딩·리뷰 결함 수정 보존. 새 세트 복습의 발음 연결과 닫기/지연 타이머 안전성, `in sise` 오자 판정 및 도장 전 엔딩 우회 추가 수정. [통합 검토](reviews/codex-20261015/INTEGRATION.md).
- **배포 전 검사:** 최종 51개 Node 검사, 교재 발음 조립 2개, 로컬 실제 Chromium 세 과정 및 도장 복습/취소/자동·수동 이동 경합 검사 통과. 5개 빌더 LF/CRLF 동일 출력과 멱등성 확인.
- **구분:** 공개 검사 첫 시도는 `fill()`로 답을 넣어 실제 사용자의 음성 재생 활성화를 재현하지 못했다. 실제 클릭·키 입력으로 검사 방식을 고친 뒤 통과했다. 이 때문에 제품 코드를 바꾸지는 않았다. 실제 학생 iPhone Safari와 전체 음원의 사람 청취는 여전히 미확인이다.

---

# 아스트라 리뷰 카드 내용 32장 배포 · 2026-10-15

- 커밋 [ee47230](https://github.com/esqsoy/vocagoyang/commit/ee47230)를 origin/main에 fast-forward로 푸시했다(b6f0896 다음, 배포 기록 4a22f14 포함). [Pages 38698857667](https://github.com/esqsoy/vocagoyang/actions/runs/38698857667) 성공.
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 2c83188, 수능 bca774f, EBS 6d78b22, index f7665dc). github.io는 이 세션에서 열 수 없어 실제 공개 화면은 보지 못했다.
- 포함: 아스트라 리뷰 카드 내용 32장(원장 `astra-content-20261015`, 필드 51곳). 동의어 안내 9장, 사실·뜻 정정 12장, 예문 정돈 11장. 받지 않은 3장(species·seller·insulting)과 아스트라 안과 다르게 한 곳은 WORK_LOG. 게임 코드는 바뀌지 않았다.
- 배포 전 검사(ee47230에서 실행):
  - 검사 45개(테스트 38 + 빌드 확인 7) 통과.
  - ordercheck 앞당김 둘 이상 0, deepcheck A1~A5·A7 0·A8 1(전부터 있던 kinda), linecheck 360·390px 초과 0, exaudit 7장(전부터 있던 것).
  - 실기기 Safari는 확인하지 않았다.

---

# 세트 완주 도장 · FABLE 엔딩 · 아스트라 리뷰 동작 결함 수정 배포 · 2026-10-15

- 커밋 [b6f0896](https://github.com/esqsoy/vocagoyang/commit/b6f0896)를 origin/main에 fast-forward로 푸시했다(Codex 리뷰 b49e90d 다음, 069702f·229e46c·8a4f6d5·431b9cc 포함). [Pages 38671449637](https://github.com/esqsoy/vocagoyang/actions/runs/38671449637) 성공.
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 3503c1c, 수능 bca774f, EBS 6d78b22, index f7665dc). github.io는 이 세션에서 열 수 없어 실제 공개 화면은 보지 못했다.
- 포함:
  - FABLE 세트 완주 도장(틀렸던 단어 복습 → 도장 → 다음 세트 문), 홈 스탬프북·도장 받기, FABLE 엔딩(단어의 산·계약·한뫼·정체·완주 배지), B1 1부 완결, 세트 대사 51개, 미리보기 주소 `#stamp=N`·`#ending`·`#ending=b1`. [PRINCIPLES 15](PRINCIPLES.md#15-세트-완주-도장과-fable-엔딩).
  - 아스트라 리뷰 T01(세 교재 철자 판정), T02(B1 조기 엔딩), T03(옛 기록 세트 잠김), T04(마지막 오답 뒤 연습 건너뜀), T05(세 교재 진행 속도 600판 주기), T06(세트 대사).
  - 인덱스 '수능 지문 약 95%'(M01, 영신).
  - 어휘 데이터(카드)는 바뀌지 않았다. 아스트라 카드 내용 제안은 아직 적용 전이다.
- 배포 전 검사(b6f0896에서 실행):
  - 검사 45개(테스트 38 + 빌드 확인 7) 통과.
  - Chromium 390px: 도장 흐름(키보드·마우스·홈 이어 받기), 전체 엔딩·B1 1부 완결, 미리보기 주소 셋(저장 안 함), smoke 콘솔 오류 없음.
  - 아스트라 재현: 브라우저 재현(엔딩 판정만 새 구조에 맞춘 사본)과 잠금 감사(잠김 0건).
  - 실기기 Safari는 확인하지 않았다.

---

# 0세트 ten 카드 배포 · 2026-10-14

- 커밋 [74a6ddc](https://github.com/esqsoy/vocagoyang/commit/74a6ddc)를 origin/main에 fast-forward로 푸시했다(9acff62 다음, 배포 기록 b445356 포함). [Pages 38558861671](https://github.com/esqsoy/vocagoyang/actions/runs/38558861671) 성공(11:45:46~11:46:55 UTC). 영신: "배포할까?"에 "완벽해...완벽하다"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 9ee4272, 수능 0b2f8c0, EBS b73efb2, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 0세트 ten 카드(원장 `ten-20261014`). 게임 코드는 바뀌지 않았다.
  - 예문: "Every STUDY1 student is a ten out of ten!"
  - 해석: "스터디원 학생들은 모두 10점 만점에 10점!"
  - 해설: "서수는 tenth. ten o'clock은 10시."
- 배포 전 검사(74a6ddc에서 실행):
  - 검사 42개 통과.
  - ordercheck 앞당김 둘 이상 0, deepcheck A5 0·A8 1(전부터 있던 kinda), linecheck 360px 초과 0.
  - Chromium smoke에서 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# 결과 화면 Enter·Space, it·its·boss 예문 배포 · 2026-10-14

- 커밋 [9acff62](https://github.com/esqsoy/vocagoyang/commit/9acff62)를 origin/main에 fast-forward로 푸시했다(60a3bd6 다음, 배포 기록 fca16eb와 a70bfc2 포함). [Pages 38552572509](https://github.com/esqsoy/vocagoyang/actions/runs/38552572509) 성공(10:52:11~10:52:57 UTC). 영신: "이것도 작업하고 배포하자"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 1fe118a, 수능 0b2f8c0, EBS b73efb2, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함:
  - 세 과정 게임 코드: 결과 화면에서 Enter·Space를 누르면 다음 연습으로 넘어간다(UI_STANDARD).
  - FABLE 내용(원장 `pet-it-20261014`, PRINCIPLES 2-12): it ①을 물건 it 예문으로, 그 농담을 boss ①로 옮겼다. its ①은 고양이 일반으로 바꿨다.
- 배포 전 검사(9acff62과 같은 내용에서 실행):
  - 검사 42개 통과.
  - ordercheck 앞당김 둘 이상 0, deepcheck A5 0, linecheck 360px 초과 0.
  - Chromium으로 세 과정 결과 화면 키를 확인했다(직후 무시, Enter·Space 다음, Tab 버튼 우선). smoke에서 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# 0세트 lunch 카드 배포 · 2026-10-13

- 커밋 [60a3bd6](https://github.com/esqsoy/vocagoyang/commit/60a3bd6)을 origin/main에 fast-forward로 푸시했다(9b61211 다음, 배포 기록 37b3961 포함). [Pages 38459793044](https://github.com/esqsoy/vocagoyang/actions/runs/38459793044) 성공(20:03:38~20:04:42 UTC). 영신: "좋아"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 0c282cf, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 0세트 lunch 카드(원장 `lunch-20261013`). 게임 코드는 바뀌지 않았다.
  - 예문: "There's no such thing as a free lunch."
  - 해석: "세상에 공짜 점심은 없어."
  - 해설: 관사 규칙. 보통은 관사 없이 have lunch, 형용사가 붙으면 a free lunch.
- 배포 전 검사(60a3bd6에서 실행):
  - 검사 42개 통과.
  - ordercheck 앞당김 둘 이상 0, deepcheck A5 0, linecheck 360px 초과 0.
  - Chromium smoke에서 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# 0세트 not 카드 예문 배포 · 2026-10-13

- 커밋 [9b61211](https://github.com/esqsoy/vocagoyang/commit/9b61211)을 origin/main에 fast-forward로 푸시했다(dd6b8d0 다음, 배포 기록 d49b8f7과 a1a335b 포함). [Pages 38443494822](https://github.com/esqsoy/vocagoyang/actions/runs/38443494822) 성공(18:02:13~18:03:42 UTC). 영신: "배포합시다!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE facb397, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 0세트 not 카드(원장 `not-cat-20261013`). 게임 코드는 바뀌지 않았다.
  - 예문: "My cat is not fat. She is just big."
  - 해석: "우리 고양이는 뚱뚱한 게 아니야. 그냥 덩치가 큰 거야."
  - 대사: "살찐 거 아니라고양. 뼈가 굵은 거라고양!"
- 배포 전 검사:
  - a1a335b에서 실행: 검사 42개 통과, ordercheck 앞당김 둘 이상 0, deepcheck A5 0, linecheck 360px 초과 0.
  - 9b61211에서 다시 실행: Chromium smoke에서 콘솔 오류가 없다. 그 사이 바뀐 것은 기록 문서뿐이다.
  - 실기기 Safari는 확인하지 않았다.

---

# 0세트 I 카드 소세키 문장 배포 · 2026-10-13

- 커밋 [dd6b8d0](https://github.com/esqsoy/vocagoyang/commit/dd6b8d0)을 origin/main에 fast-forward로 푸시했다(399cada 다음, 배포 기록 1222634와 c4918ca 포함). [Pages 38388786959](https://github.com/esqsoy/vocagoyang/actions/runs/38388786959) 성공(11:13:57~11:14:55 UTC). 영신: "쓰고 배포해줘"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 81fc97d, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 0세트 I 카드(원장 `soseki-i-20261013`, PRINCIPLES 2-11 예외).
  - 예문: "I am a cat, but I don't have a name yet."
  - 해석: "나는 고양이다. 이름은 아직 없다."
  - 해설: "I는 항상 대문자로 쓴다. 나쓰메 소세키 『나는 고양이로소이다』 첫 문장을 옮긴 것."
  - 게임 코드는 바뀌지 않았다.
- 배포 전 검사(dd6b8d0과 같은 내용에서 실행):
  - 검사 42개 통과.
  - linecheck 360px 초과 0.
  - ordercheck 앞당김 둘 이상 0(c4918ca에서 실행).
  - Chromium smoke에서 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# 해설 속 예문 반복 걷기 배포 · 2026-10-13

- 커밋 [399cada](https://github.com/esqsoy/vocagoyang/commit/399cada)를 origin/main에 fast-forward로 푸시했다(6d56207 다음, 배포 기록 51dbeb1·잠금 칸 원칙 02cce48 포함). [Pages 38361654891](https://github.com/esqsoy/vocagoyang/actions/runs/38361654891) 성공(07:16:43~07:17:31 UTC). 영신: "배포합시다!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 21faca2, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: FABLE 해설 36장에서 카드 예문과 같은 쓰임의 예문을 뺐다. 그중 be ②·available 2장은 해설을 비웠다. 원장은 `c-example-20261013`, 기준은 PRINCIPLES 4. 게임 코드는 바뀌지 않았다.
- 배포 전 검사(399cada에서 실행):
  - 검사 42개 통과.
  - deepcheck A1·A2·A3·A5·A7 0. A6 16과 A8 1은 전부터 있던 것이다.
  - linecheck 360px 초과 0.
  - Chromium smoke에서 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# FABLE 세트 차례로 열기 배포 · 2026-10-13

- 커밋 [6d56207](https://github.com/esqsoy/vocagoyang/commit/6d56207)을 origin/main에 fast-forward로 푸시했다(1480093 다음, 배포 기록 fa20948 포함). [Pages 38355102763](https://github.com/esqsoy/vocagoyang/actions/runs/38355102763) 성공(06:08:53~06:09:47 UTC). 영신: "아이디어 좋다 배포합시다!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 1036564, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: FABLE은 앞 세트를 다 클리어해야 다음 세트가 보인다(PRINCIPLES 14).
  - 직접 클리어한 세트는 열려 있다. 다음 잠금 칸 하나를 보여 준다(영신이 그대로 두기로 함).
  - 이어 하기·다음 강은 잠긴 세트로 가지 않는다. 다음 세트가 잠겼으면 '남은 연습 ▶'이 나온다.
  - `#unlock`/`#lock`. 마더텅·EBS는 바뀌지 않았다.
- 배포 전 검사(6d56207에서 실행):
  - 검사 42개: 테스트 36개(set-unlock 추가)와 빌드 `--check` 6종.
  - Chromium 390px에서 처음 화면, 일부 진도, 이어 하기, 남은 연습·다음 강, #unlock·#lock을 확인했다. 콘솔 오류가 없다.
  - 실기기 Safari는 확인하지 않았다.

---

# 26~45세트 색 확정·맨 밑 알림 없앰·진행 속도 예측 배포 · 2026-10-13

- 커밋 [1480093](https://github.com/esqsoy/vocagoyang/commit/1480093)을 origin/main에 fast-forward로 푸시했다(faca268 다음, 배포 기록 8b93b64 포함). [Pages 38352096656](https://github.com/esqsoy/vocagoyang/actions/runs/38352096656) 성공(05:34:36~05:35:23 UTC). 영신: "다 되면 배포해주십쇼!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE df6c40d, 수능 9779fea, EBS 575b2d9, index a5c2ba2). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함:
  - FABLE 세트 색: 0~25세트 라벤더 번호, 26~45세트 로즈 타일·분홍 번호. 26~50세트 완료 금색 테두리 고침.
  - 세 과정: 맨 밑 알림을 없애고 고양이 대사를 그 화면 고양이 말풍선으로 옮겼다. 시작 대사가 떠 있는 동안 첫 카드 시간은 멈춘다. 모아둔 카드 목록 복사 결과는 버튼 글자로 보여 준다.
  - 세 과정: 진행 속도 예측(`pipeline/pace/`)을 넣었다. 판마다 날짜·시각·실제 시간을 이 브라우저에 적고, 10판 뒤부터 결과 화면에 예측을 보여 준다.
- 배포 전 검사(1480093과 같은 내용에서 실행):
  - 검사 41개: 테스트 35개(pace 추가)와 빌드 `--check` 6종.
  - Chromium 390·360px에서 세 과정 시작 대사·카드 담기·예측 시나리오 6종을 확인했다. 콘솔 오류가 없다.
  - FABLE smoke와 B1/C1 확인.
  - 실기기 Safari는 확인하지 않았다.

---

# 인덱스 마더텅 카드 문구 빼기 배포 · 2026-10-13

- 커밋 [2582be2](https://github.com/esqsoy/vocagoyang/commit/2582be2)를 origin/main에 fast-forward로 푸시했다(aafcf99 다음, 배포 기록 0f3b5dc 포함). [Pages 38345811877](https://github.com/esqsoy/vocagoyang/actions/runs/38345811877) 성공(04:18:31~04:19:16 UTC). 영신: "마더텅 버튼에서는 fable이하는 삭제"
- 이어서 [faca268](https://github.com/esqsoy/vocagoyang/commit/faca268)을 푸시했다. [Pages 38345933428](https://github.com/esqsoy/vocagoyang/actions/runs/38345933428) 성공(04:20:03~04:20:45 UTC).
  - 0f3b5dc에 Claude의 검사 도구가 찍은 화면 캡처 10장(`undefined/*.png`, 게임·인덱스 화면)이 잘못 커밋돼 2582be2와 함께 공개됐다. faca268에서 지웠다.
  - 도구는 저장소 밖에 저장하게 고쳤다.
- 확인 방법: GitHub API로 main 최상위를 확인했다. `undefined`가 없고, 네 HTML blob SHA가 로컬 검증본과 같다(index a5c2ba2, FABLE 1a56e50, 수능 fd5a1d5, EBS 333fa17). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: `index.html` 마더텅 카드 숫자 줄의 ' · FABLE과 합쳐 지문 98%' 삭제. 게임 HTML은 바뀌지 않았다.
- 배포 전 검사(이번에 실행): `index-stats.cjs --check` 통과. Chromium 390·360px에서 세 카드 숫자 줄이 모두 한 줄이고 콘솔 오류가 없다.

---

# FABLE 범위 구별·이름·3000급 채우기·Oxford 5000 보강 배포 · 2026-10-13

- 커밋 [aafcf99](https://github.com/esqsoy/vocagoyang/commit/aafcf99)를 origin/main에 fast-forward로 푸시했다(5a66345 다음). [Pages 38344322581](https://github.com/esqsoy/vocagoyang/actions/runs/38344322581) 성공(03:59:54~04:00:48 UTC). 영신: "배포 가자!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 1a56e50, 수능 fd5a1d5, EBS 333fa17, index 0f3d05f). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함(5a66345 뒤 전부):
  - FABLE 게임 코드: 26~45세트 메뉴 색, 헤더 B1/C1 버튼, 세트·연습 이름의 단어 번호 다시 매기기, 3000급 채우기로 카드가 빠진 연습의 기록·이어하기 잇기(`deployedLayout`, 저장 표시 "20261013").
  - 세 과정 공통: 모아둔 카드 출처에 다시 매긴 연습 이름(`pipeline/saved-cards/runtime.js`). 세 HTML을 다시 빌드했다.
  - 이름 FABLE(인덱스 꼬리표 '기초~C1'), 인덱스 지문 % 문구와 측정 기준.
  - 내용: 3000급 채우기 293장 이동·예문 11장(원장 `pull-20261013`), Oxford 5000 보강 923장·넣은 뒤 5장(`oxford5000-20261013`), sex 해설 2장(`sex-gender-20261013`).
- 배포 전 검사(aafcf99에서 실행): 검사 38개(테스트 34개와 빌드 `--check` 4종, level-scope·pull 포함), deepcheck A1·A2·A3·A5·A7 0(A6 16·A8 1은 전부터 있던 것), linecheck 390·360px 초과 0, ordercheck 앞당김 둘 이상 0, exaudit 6장. Chromium 390·360px smoke(콘솔 오류 없음), B1/C1 버튼 전환·새로고침 유지, 인덱스와 게임 제목. 실기기 Safari는 확인하지 않았다.

---

# Fable 독립 검토 반영(23장) 배포 · 2026-10-13

- 커밋 [5a66345](https://github.com/esqsoy/vocagoyang/commit/5a66345)를 origin/main에 fast-forward로 푸시했다(a8bbbd3 다음). [Pages 38285588472](https://github.com/esqsoy/vocagoyang/actions/runs/38285588472) 성공(17:38:48~17:39:43 UTC).
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 94c3479, 수능 24280bb, EBS cfd1871, index 31cef6d). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: Fable 독립 검토 반영 23장(원장 `fable-review-20261013`), 검토 기록 `reviews/fable-20261013`, PRINCIPLES 2-2 한정어 원칙과 BRIEF. 게임 코드는 바뀌지 않았다.
- 배포 전 검사(5a66345와 같은 내용에서 실행): Codex 검사 35개 + set5.test 36/36, Chromium 390px smoke 콘솔 오류 없음(배포 커밋에서 다시 실행), ordercheck 2개 이상 0, linecheck 390·360px 초과 0, deepcheck A5·A7 0.

---

# 아스트라 리뷰 반영(23장)·발췌 원칙 배포 · 2026-10-13

- 커밋 [a8bbbd3](https://github.com/esqsoy/vocagoyang/commit/a8bbbd3)를 origin/main에 fast-forward로 푸시했다(아스트라 리뷰 문서 55def39 다음). [Pages 38277052029](https://github.com/esqsoy/vocagoyang/actions/runs/38277052029) 성공(16:23:26~16:24:11 UTC).
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 950a720, 수능 24280bb, EBS cfd1871, index 31cef6d). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 아스트라 리뷰([reviews/codex-20261013](reviews/codex-20261013/README.md)) 수정안 23장(원장 `astra-review-20261013`), deepcheck A7 불규칙 어미 보강, PRINCIPLES 2-11 연속 구절 발췌 허용(영신 승인), 리뷰 요청서와 기록 문서. 게임 코드는 바뀌지 않았다.
- 배포 전 검사(반영 커밋 04f857d에서 실행, 그 뒤는 문서만): Codex 검사 35개 + set5.test 36/36(배포 커밋 a8bbbd3에서 다시 36/36), Chromium 390px smoke(콘솔 오류 없음), ordercheck 2개 이상 0, linecheck 390·360px 초과 0, deepcheck A7 0.

---

# 6~45세트 작업 배포 · 2026-10-12

- 커밋 [921e8ff](https://github.com/esqsoy/vocagoyang/commit/921e8ff)를 origin/main에 fast-forward로 푸시했다(5dad972 다음). [Pages 38247492624](https://github.com/esqsoy/vocagoyang/actions/runs/38247492624) 성공(12:11:41~12:12:31 UTC).
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 5aaaa1e, 수능 24280bb, EBS cfd1871, index 31cef6d). github.io는 이 세션에서 열리지 않아 공개 화면은 직접 보지 못했다.
- 포함: 6~45세트 예문·해설·대사 1,384곳(원장 `set6-20261012`~`set45-20261012`, `set45b-20261012`), 소설 명문장 90장, 호스트 훅 테스트 표본 수정, exaudit 규칙 2곳, 기록 문서. 게임 코드는 바뀌지 않았다.
- 배포 전 검사: Codex 검사 35개 + set5.test 36/36(43세트 커밋 2a16301에서 실행, 배포 커밋 921e8ff에서 다시 36/36). 이번에 실행: Chromium 390px 실기 확인(smoke5: 콘솔 오류 없음, 5세트 연습 이름, 14세트 새 연습 타일, 배포판 이어하기). ordercheck 0~45세트 앞당김 2개 이상 0, linecheck 390·360px 초과 0, deepcheck A8 화면 카드 0.
- 직검수 페이지: 6~15·16~25·26~35·36~45세트(HANDOFF). 영신은 아스트라에게 리뷰를 맡긴다.

---

# 1~4세트 작업 배포 · 2026-10-12

- 커밋 [5dad972](https://github.com/esqsoy/vocagoyang/commit/5dad972)를 origin/main에 fast-forward로 푸시했다(5fdf148 다음). [Pages 38218741083](https://github.com/esqsoy/vocagoyang/actions/runs/38218741083): completed/success. 영신: "바로 배포하고 일단 전세트를 작업하자"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE 8cb80c6). github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함: 1~4세트 예문·해설·대사 121곳(원장 `set1-20261012`~`set4-20261012`). 게임 코드는 바뀌지 않았다.
- 배포 전 검사: 세트마다 Codex 검사 35개 + set5.test 36/36(4세트 커밋에서 마지막으로 실행). 이번에 다시 실행: Chromium 390px 콘솔 오류 없음. 앞선 작업 때 실행: ordercheck 2개 이상 28, exaudit 10, deepcheck A5 0·A8 305, linecheck 390·360px 초과 0, collide 906. 실기기 Safari는 확인하지 않았다.

---

# 5세트 작업(문법 뜻 분산·예문 39곳) 배포 · 2026-10-12

- 커밋 [5fdf148](https://github.com/esqsoy/vocagoyang/commit/5fdf148)을 origin/main에 fast-forward로 푸시했다(acfe20e 다음). [Pages 38211241299](https://github.com/esqsoy/vocagoyang/actions/runs/38211241299): completed/success. 영신: "나도 동의해 계속 진행하고 바로 배포하자"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다(FABLE cd4814b). github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(acfe20e 뒤 전부):
  - 0세트 영신 직검수 반영과 재조정(원장 `set0-review-20261011`·`set0-review2-20261011`·`set0-rebalance-20261012`), 41세트 prime ② 새 카드.
  - 소설 명문장 42장(`novel-quotes-20261012`).
  - 5세트 작업(`set5-20261012`): 문법 뜻 카드 11장을 14·17·21·25세트 끝 새 연습으로, 예문·해설·대사 39곳. FABLE 게임 코드: 두 번째로 카드를 뺀 연습의 배포판 기록·이어하기를 잇는 `deployedWords`, 저장 표시 "20261012".
- 배포 전 검사(이번에 실행): Codex 검사 35개 + set5.test 36/36. Chromium 390px에서 콘솔 오류 없음, 14세트 새 연습 타일, 배포판 저장(prune "20261010")의 5세트 1-1 이어하기가 이름을 바꾼 판으로 돌아옴. 앞선 5세트 작업 때 실행: ordercheck 2개 이상 75, exaudit 11, deepcheck A1~A5·A7 0(A6 85, A8 331), linecheck 390·360px 초과 0, collide 906. 실기기 Safari는 확인하지 않았다.

---

# Codex 리뷰 반영(실행 문제 2곳·내용 88장) 배포 · 2026-10-11

- 커밋 [acfe20e](https://github.com/esqsoy/vocagoyang/commit/acfe20e)를 origin/main에 fast-forward로 푸시했다(d0b616d 다음). [Pages 38121357882](https://github.com/esqsoy/vocagoyang/actions/runs/38121357882): completed/success. 영신: "합쳐도 돼. 다 반영하고 배포해줘"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함:
  - 세 과정 공통: 돌파 축하가 돌고 있는 판 위에 뜨지 않고, 게임 밖 화면으로 나올 때 뜬다(R1).
  - FABLE 게임 코드: 표제어 정리로 합쳐진 판의 옛 판 이름 이어하기가 합쳐진 연습으로 돌아간다(R2).
  - FABLE 내용 88장: 내용 정확성 17·문법 해설 범위 7·같은 칸 수 대체어 안내 64. 원장 `codex-review-20261011`. 판정과 전후 대조 https://claude.ai/artifact/29Ebjy3QV8qr36Pkspb6iz
  - Codex 리뷰 묶음 `reviews/codex-20261011/`(Codex가 main에 올린 d0b616d를 합침).
- 배포 전 검사(이번에 실행): Codex 검사 35/35(테스트 31개와 빌드 `--check` 4종, R1·R2 확인 추가), milestones 빌드 `--check`, deepcheck A1~A5·A7 0(A6 89), linecheck 390·360px 초과 0, exaudit 11, ordercheck 2개 이상 78, collide 907. Chromium 390px에서 R1 재현 장면과 republic 정답 공개 화면. 실기기 Safari는 확인하지 않았다.

---

# 해설 읽을 시간 늘림 배포 · 2026-10-11

- 커밋 [e9c178d](https://github.com/esqsoy/vocagoyang/commit/e9c178d)를 origin/main에 fast-forward로 푸시했다(365a798 다음 3커밋, 앱 변경은 e9c178d뿐). [Pages 38108882858](https://github.com/esqsoy/vocagoyang/actions/runs/38108882858): completed/success. 영신: "배포해줘!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(FABLE 게임 코드만 바뀜. DATA·진도·마더텅·EBS는 그대로): 정답 공개 뒤 대기 = 2초 + 예문 1단어당 250ms + 해석·해설 1자당 110ms, 최대 20초(전에는 해설만 1자당 75ms + 1.9초). 0세트 한가운데 카드 4.8초 → 9.7초. 터치·Enter로 바로 넘김은 그대로. 문서: PRINCIPLES 5, UI_STANDARD. 수능 어법 훈련 결정 기록(문서만)도 함께 올라갔다.
- 배포 전 검사(같은 내용으로 앞선 작업에서 실행): Codex 검사 35/35(테스트 31개와 빌드 `--check` 4종, host-hooks에 예산 전 넘김 없음 확인 추가). Chromium 390px에서 예산 8.86초 카드가 8.86초 뒤 넘어가고 터치로는 0.1초에 넘어감. 실기기 Safari는 확인하지 않았다.

---

# 표제어 정리·Oxford 보강·0세트 재구성 배포 · 2026-10-10

- 커밋 [365a798](https://github.com/esqsoy/vocagoyang/commit/365a798)을 origin/main에 fast-forward로 푸시했다(a8a68c2 다음 22커밋). [Pages 38066295231](https://github.com/esqsoy/vocagoyang/actions/runs/38066295231): completed/success. 영신: "우선 배포합시다. 검수는 배포후에 계속해나갈게."
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(FABLE 페이지와 인덱스 수치만 바뀜. 마더텅·EBS 화면은 그대로):
  - 표제어 정리 71개(78장), roach→cockroach, 뺀 다른 꼴·좁은 말을 관련 카드 해설에(PRINCIPLES 2-8).
  - Oxford 3000 보강 443개(508장), 6~44세트 끝 새 연습 36개.
  - 0세트 재구성: 문법 순서 23연습·234장(5세트 38장·1세트 no 이동, 새 카드 3장, 68장 내용 수정, PRINCIPLES 12). 타일 제목의 짧은 영어 묶음 줄바꿈.
  - FABLE 7,573장·표제어 5,362·화면 연습 675, 세 교재 합집합 8,260.
  - 진도: 정리·재구성 전에 저장한 완료·모아둔 카드·이어하기는 이어진다(prune.test·set0.test). 새 카드가 든 0세트 연습 5·11·17은 다 했던 학생도 새로 해야 한다. 이번 배포부터 이어하기 저장에 `prune: "20261010"` 표시가 붙는다.
  - 원장 prune·cockroach·variant-notes·oxford·narrow-notes·set0-20261010(복원 체인 맨 위).
- 배포 전 검사: 이번에 실행 — Codex 검사 35/35(테스트 31개와 빌드 `--check` 4종). 앞선 작업(같은 내용)에서 실행 — deepcheck A1~A5·A7 0(A6 90), linecheck 390·360px 초과 0, exaudit 11, ordercheck 2개 이상 78, collide 새 결함 없음, Chromium 390px 0세트 타일·입력. 실기기 Safari는 확인하지 않았다.

---

# 재검토 반영(15·16묶음) 배포 · 2026-10-10

- 커밋 [a8a68c2](https://github.com/esqsoy/vocagoyang/commit/a8a68c2)를 origin/main에 fast-forward로 푸시했다(b46b84a 다음). [Pages 38012568319](https://github.com/esqsoy/vocagoyang/actions/runs/38012568319): completed/success. 영신: "다 반영하고"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(FABLE DATA만 바뀜): communism 해설(옥스퍼드의 대문자 구분), colony 'colonys' 결함 수정, 재검토 개선안 8건(antibiotic·poison·railway·wage·socialism 해설, evolution 예문, fossil·perfect 해석). deepcheck A7(빈칸 어미) 추가. 원장 knowledge-15·16.
- 배포 전 검사(이번에 실행): Codex 검사 33/33, exaudit 25, linecheck 390·360px 초과 0, deepcheck A1~A5·A7 0(A6 93→91), collide 새 후보 없음. 실기기 Safari는 확인하지 않았다.

---

# 영신 검토 반영(13·14묶음) 배포 · 2026-10-09

- 커밋 [b46b84a](https://github.com/esqsoy/vocagoyang/commit/b46b84a)를 origin/main에 fast-forward로 푸시했다(adc9399 다음). [Pages 38005718422](https://github.com/esqsoy/vocagoyang/actions/runs/38005718422): completed/success. 영신: "일단 배포하자"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(FABLE DATA만 바뀜):
  - 13묶음: wall ① "China began building a long wall in the 600s BC to keep out enemies.", Chinese ① "Chinese characters have been written for more than 3,000 years."
  - 14묶음: communism "Communism aims at a society without classes, where factories belong to all."(브리태니커식 사상 정의)
  - 문서: PRINCIPLES 2-5(사상 단어는 목표로 정의), 2-6(문명권 이름). 원장 knowledge-13·14.
- 배포 전 검사(이번에 실행): Codex 검사 33/33, exaudit 25, linecheck 390·360px 문장·화면 초과 0, deepcheck A1~A5 0, collide 새 후보 없음. 실기기 Safari는 확인하지 않았다.

---

# 지식 예문 5~12묶음·새 표제어 8개 배포 · 2026-10-09

- 앱 커밋 [adc9399](https://github.com/esqsoy/vocagoyang/commit/adc9399)를 origin/main에 fast-forward로 푸시했다(a7299ad 다음). [Pages 37935985157](https://github.com/esqsoy/vocagoyang/actions/runs/37935985157): completed/success. 영신: "먼저 배포해놓고 계속 검토후 개정의견낼게"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(FABLE DATA와 인덱스 수치. 마더텅·EBS 화면은 그대로):
  - 지식 예문 5~10묶음 174장(지도 6~14장과 지도 밖 F 판정 14장), 11묶음(새 표제어 8개와 그 단어를 쓰는 카드 8장), 12묶음(영신 검토 1차 5장: corn·academy·silk·plantation·communism).
  - FABLE 7,140카드·표제어 4,987, 세 교재 합집합 8,311. 새 카드는 지식 어휘 Ⅰ~Ⅳ 연습에 붙어 기존 진도 키를 쓴다.
  - 원장 knowledge-05~12. 문서: PRINCIPLES 2-5·2-6·4, 리뷰 README, `pipeline/knowledge-map/BRIEF.md`.
- 배포 전 검사(이번에 실행): Codex 검사 33/33, exaudit 25, linecheck 390·360px 문장·화면 초과 0, deepcheck A1~A5 0, collide 새 결함 없음. 실기기 Safari는 확인하지 않았다.

---

# 지식 4묶음·monarchy·해설 규칙·돌파 축하 폭죽 배포 · 2026-10-08

- 앱 커밋 [a7299ad](https://github.com/esqsoy/vocagoyang/commit/a7299ad)를 origin/main에 fast-forward로 푸시했다(430928f 다음 6커밋). [Pages 37832018030](https://github.com/esqsoy/vocagoyang/actions/runs/37832018030): completed/success. 영신: "시원하다! 완벽합니다! 배포하고"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함:
  - FABLE: 지식 예문 4묶음 21장, 새 표제어 monarchy(42세트 지식 어휘 Ⅳ), 지식 카드 해설 12장 정리(해설은 단어에 관한 것만). FABLE 7,132카드·표제어 4,979, 세 교재 합집합 8,310. 새 카드는 기존 연습에 붙어 그 연습의 진도 키를 그대로 쓴다.
  - 세 과정 공통 `milestones`: 2,000부터 앞선 단어는 천 개씩 화면 전체로 터지는 폭죽, 최근 천 단어만 날아와 벽. '익힌 단어' 머리말 삭제.
  - 문서: PRINCIPLES 2-7·4·11, UI_STANDARD, `pipeline/milestones/README.md`. 원장 knowledge-04, word-notes.
- 배포 전 검사(이번에 실행): Codex 검사 33/33(milestones 포함), 빌드 `--check` 4종. 앞선 작업에서 실행: exaudit 26, linecheck 390·360px 초과 0, deepcheck A1~A5 0, collide 새 경쟁어 없음, 393px 3,000·5,000 녹화(프레임 간격 16.7ms), 320px 건너뛰기. 실기기 Safari는 확인하지 않았다.

[FABLE 미리 보기(3,000)](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html#milestone=3000)

---

# 익힌 단어 돌파 축하 배포 · 2026-10-08

- 앱 커밋 [430928f](https://github.com/esqsoy/vocagoyang/commit/430928f)를 origin/main에 fast-forward로 푸시했다(c56d036 다음). [Pages 37819892553](https://github.com/esqsoy/vocagoyang/actions/runs/37819892553): completed/success. 영신: "미쳤다 마음에 듭니다 배포갑시다!"
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io 접속은 이 세션에서 막혀 공개 페이지는 직접 열어 보지 못했다.
- 포함(세 과정 공통 생성 구간 `milestones` 추가. DATA·진도·저장 키·게임 코드는 그대로):
  - 익힌 단어(클리어한 연습의 표제어, 세 교재 합집합·중복 제외)가 1,000 단위를 넘은 판의 결과 화면에서 축하를 한 번 띄운다. 업데이트 전에 이미 넘은 학생은 첫 클리어 때 가장 큰 문턱 하나만.
  - 연출: 익힌 단어가 배운 순서대로 저 멀리서 날아온다. 그때마다 화면 가득한 단어 벽에 제자리 불이 켜진다. 문턱에서 빛 폭발이 터지고 벽 전체로 반짝임이 번진 뒤 고양이가 나온다.
  - 틀린 단어 기록(`goyang-missed-words-v1`)을 이번 배포부터 시작한다. 그 단어는 금빛이다.
  - 미리 보기: 주소 끝에 `#milestone=1000`(저장 안 함).
  - 문서: PRINCIPLES 11, UI_STANDARD, `pipeline/milestones/README.md`.
- 배포 전 검사(430928f 내용 그대로, 앞선 작업에서 실행): Codex 검사 32/32, milestones.test PASS, milestones·saved-cards 빌드 `--check`. 393px Chromium 녹화(중앙 프레임 간격 16.7ms), 마더텅·EBS 320px·동작 줄이기 화면을 확인했다. 실기기 Safari는 확인하지 않았다.

[FABLE 미리 보기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html#milestone=1000)

---

# 지식 예문 1~3묶음·새 표제어 50개·고유명사 빈칸 배포 · 2026-10-08

- 앱 커밋 [c56d036](https://github.com/esqsoy/vocagoyang/commit/c56d036)을 origin/main에 fast-forward로 푸시했다(c702b05 다음 8커밋). [Pages 37789424808](https://github.com/esqsoy/vocagoyang/actions/runs/37789424808): completed/success. 영신: "일단 지금까지 된 건 배포를 하면 될 것 같고".
- 확인 방법: GitHub API로 main의 `index.html`과 세 과정 HTML blob SHA가 로컬 검증본과 같은 것을 확인했다. github.io는 이 세션에서 접속이 막혀 공개 페이지의 HTTP 200·해시 대조는 **하지 못했다**.
- 포함(FABLE DATA와 인덱스 수치만 바뀜. 마더텅·EBS HTML은 그대로):
  - 지식 예문 1묶음 25장(연표 척추, 인류의 시작), 3묶음 26장(고대 제국과 사상, 중세와 교류).
  - 새 표제어 50개: 16·26·34·42세트 끝 '지식 어휘 Ⅰ~Ⅳ'. burial 예문(21세트).
  - 고유명사 안 빈칸 5장(empire·pyramid·pole②·hemisphere·lunar).
  - FABLE 7,081→7,131카드, 624→628연습, 표제어 4,928→4,978. 새 연습은 새 진도 키를 쓰고, 기존 연습의 진도·저장 키는 그대로다.
  - 문서: PRINCIPLES 2-6(지도 먼저, 막히는 어휘는 더한다), 2-7(고유명사 안 빈칸). 원장 knowledge-01·02·03, proper-nouns.
- 배포 전 검사(c56d036 내용 그대로, 앞선 작업에서 실행): Codex 검사 32/32, exaudit 26, linecheck 390·360px 문장·화면 초과 0, deepcheck A1~A5 0, collide 새 경쟁어 없음, 원장 역적용 해시 일치, IPA 빌드 검사. 393px 화면에서 16세트 '지식 어휘 Ⅰ' 타일·문제 화면을 확인했다. 실기기 Safari는 확인하지 않았다.

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=c56d036)

---

# 담김 하트 위치 조정 배포 · 2026-10-08

- 앱 커밋 [79291eb](https://github.com/esqsoy/vocagoyang/commit/79291eb)를 origin/main에 fast-forward로 푸시했다. [Pages 37746779315](https://github.com/esqsoy/vocagoyang/actions/runs/37746779315): completed/success. main의 세 과정 HTML blob이 로컬 검증본과 같다. github.io 직접 확인은 이 세션에서 할 수 없다.
- 변경: 담김 하트를 고양이 칸 안 목 왼쪽으로 옮겼다. 시간 막대·말풍선 폭은 담기 전후로 같다(영신 지적: 하트가 시간 진행 바를 줄였다). `pipeline/saved-cards/style.css`만 바뀌었다.
- 검사: Codex 검사 32/32, saved build --check, 393·320px 막대 폭 전후 동일, 확대 캡처로 겹침 없음 확인. 실기기 Safari는 확인하지 않았다.

---

# 연습 타일·담김 하트·학문 용어 2장·country 배포 · 2026-10-08

- 앱 커밋 [3ade2f7](https://github.com/esqsoy/vocagoyang/commit/3ade2f7)을 origin/main에 fast-forward로 푸시했다(7368e82 다음 2커밋). [Pages 37745476960](https://github.com/esqsoy/vocagoyang/actions/runs/37745476960): completed/success.
- 확인 방법: 이 세션은 github.io 접속이 막혀 공개 페이지의 HTTP 200·해시 대조는 **하지 못했다**. GitHub API로 main의 `index.html`과 세 과정 HTML의 blob SHA가 로컬 검증본과 같은 것을 확인했다.
- 포함:
  - 세 교재 연습·세트 타일. 두 칸은 같은 폭으로, 제목 줄바꿈을 정리했다(구분점·번호 묶기, "·" 뒤 줄바꿈 자리). 클리어 별은 제목 앞으로 옮겼다. 영신의 iPhone Safari 제보에서 나온 수정이다.
  - 담김 표시: 담은 뒤에만 고양이 왼쪽에 ♥가 뜨고, 담기 전에는 표시가 없다. 홈 '♥ 모아둔 카드', 검색 '♥ 담김'.
  - 48세트 anthropology·geography 예문(정의를 예문 안에서 완결)과 43 country ① 바티칸 문장.
- 배포 전 검사(같은 내용으로 실행): Codex 검사 32/32, linecheck 390px 초과 0, exaudit 27, deepcheck A1~A5 0, 원장 역적용 해시 일치. Chromium 393·360px로 51세트 타일을 검사했다(Safari식 줄바꿈 흉내 포함). 담김 하트는 문제·담은 뒤·정답 공개 화면을 캡처로 봤다. 실기기 Safari는 확인하지 않았다.
- 카드 수·표제어·정답 범위·IPA·진도·저장 키는 그대로다. 마더텅·EBS는 화면 코드(타일·하트)만 바뀌었고 DATA는 그대로다.

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=3ade2f7)

---

# 긴 예문 다시 쓰기·학문 용어 예문·긴 정답 칸 배포 · 2026-10-08

- 앱 커밋 [0d2d1ab](https://github.com/esqsoy/vocagoyang/commit/0d2d1ab)를 origin/main에 fast-forward로 푸시했다(3790f5c 다음 3커밋). [Pages 37742755620](https://github.com/esqsoy/vocagoyang/actions/runs/37742755620): completed/success.
- 확인 방법: 이 세션은 github.io 접속이 막혀 있다. 그래서 공개 페이지의 HTTP 200과 해시 대조는 **하지 못했다**. 대신 GitHub API로 main의 `index.html`과 세 과정 HTML의 blob SHA가 로컬 검증본과 같은 것을 확인했다.
- 포함:
  - 예문 22장(ex·tr, 일부 c): 폰에서 정답을 채운 문장이 3줄을 넘던 예문, political, eleventh·practice, power·democracy(24)·government·interaction·거시/미시경제학. 승인된 역사 예문은 뜻·시기 표시를 지켰다.
  - 세 교재 공통 빈칸 CSS: 한 단어의 칸이 한 줄에 안 들어가면 그 단어 칸만 함께 좁힌다(13자 이상 정답 72장의 "12칸 + 1칸" 갈라짐 해소).
  - 문서: PRINCIPLES 2-2(문장 3줄·화면 4줄), 2-4 사례, 2-5(학문 용어) 신설. linecheck·collide 도구 수정.
- 배포 전 검사(앞선 작업에서 이 내용 그대로 실행): Codex 검사 32/32, linecheck 390·360px 문장 초과 0·화면 초과 0, 세 교재 320~390px 칸 갈라짐 0, exaudit 27, deepcheck A1~A5 0, 원장 역적용 해시 일치, 390px 실제 게임 화면 캡처(긴 정답 입력·공개·오답). 실기기 Safari는 확인하지 않았다.
- 카드 수·표제어·정답 범위·IPA·진도·저장 키는 그대로다(FABLE 7,081카드·624연습·표제어 4,928). 마더텅·EBS는 빈칸 CSS만 바뀌었고 DATA는 그대로다.

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=0d2d1ab)

---

# Claude 리뷰 후속 일괄 배포 · 2026-10-08

- 앱 커밋 [fdd33ee](https://github.com/esqsoy/vocagoyang/commit/fdd33ee)를 origin/main에 fast-forward로 푸시했다(59aaf81 다음 6커밋). [Pages 37721488700](https://github.com/esqsoy/vocagoyang/actions/runs/37721488700)은 completed/success다.
- 확인 방법: 이 세션은 github.io 접속이 막혀 있다. 그래서 공개 페이지의 HTTP 200과 해시 대조는 **하지 못했다**. 대신 GitHub API로 main의 `vocagoyangfable.html`·`index.html` blob이 로컬 검증본과 같은 것을 확인했다. 공개 화면은 영신이 열어 확인한다.
- 포함:
  - FABLE 해설 읽을 시간 원값 복원(75ms/자), 마더텅·EBS 1.5초 복원
  - 세 과정 한국어 낱말 단위 줄바꿈
  - 결함 62건(중의성 52 등)과 meow 12개, 동의어 대사 4종
  - in fifteen minutes의 after 허용 제거
  - 48세트 그림 법칙 사촌 쌍 14카드
  - PRINCIPLES.md 신설, linecheck/exaudit 도구
- 배포 전 검사: Codex 검사 32/32 통과(session 624연습·7,488회 포함). 두 변경 원장 역적용 해시 일치. 세 과정 × 320/360/390px 넘침 0. 390px 플레이(정답·오답·따라쓰기·사촌 쌍 연습·검색)와 콘솔 오류 0. 실기기 Safari는 확인하지 않았다.
- 카드 수: FABLE 7,067 → 7,081, 연습 623 → 624, 표제어 4,916 → 4,928. 인덱스는 자동 집계다(누적 8,292).
- 진도: 48세트는 새 연습 하나만 늘었고 기존 22연습의 기록 키는 그대로다. 저장 키·다른 세트 진도도 변화 없다.

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=fdd33ee)

---

# 기억할 예문 두 번째 묶음 배포 · 2026-10-08

- 앱 [cba570b](https://github.com/esqsoy/vocagoyang/commit/cba570b4db3e2ca99f50593ea3c801cedc6e8e72)를 origin/main에 푸시했고 [Pages 37666526957](https://github.com/esqsoy/vocagoyang/actions/runs/37666526957) completed/success, 공개 인덱스·세 과정 HTTP 200 및 로컬 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- 43 country 제외 25안 + 공유 원본 May 1장: 26카드·54필드. 원본 6파일과 조립 DATA만 학습 내용 변경. 단어 수·정답 범위·IPA·진도·저장 ID·UI 유지. 마더텅/EBS/인덱스 불변.
- session 7,476회, placement-regrouping, morphology-content, IPA conservation, index-stats --check, DATA/원본 변경 범위 및 diff 검사 통과. 새 브라우저/실기기 검사는 하지 않았다.
- [검증 원장](pipeline/history-review-20261007/release-02.json). country 재제안과 남은 전체 개정은 이번 배포에 포함하지 않았다.

---

# 역사 예문·난도 조정 배포 · 2026-10-07

- 앱 커밋 [1d0f859](https://github.com/esqsoy/vocagoyang/commit/1d0f8593ca083db4c6a30e8739ffb4f692cce7d7)을 origin/main에 푸시했고 [GitHub Pages 37608852000](https://github.com/esqsoy/vocagoyang/actions/runs/37608852000) completed/success 및 공개 인덱스·세 과정 HTTP 200, 로컬 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- 승인된 FABLE 30카드의 예문·해석·해설 64필드를 변경했다. 역사적 시기를 명시하고 표제어보다 주변 표현이 과도하게 어려운 문장을 단순화했다.
- 표제어·정답 범위·IPA·카드 수·진도·UI와 마더텅/EBS/인덱스는 유지했다. 새 전체 개정 초안은 아직 앱에 포함하지 않았다.
- 배포 요청 후 session(7,476회), placement-regrouping, morphology-content, IPA conservation, index-stats --check, diff 검사와 독립 범위 검수 통과. 공개 네 페이지 HTTP 200 및 정규화 해시 일치 확인. 새 브라우저/실기기 검사는 하지 않았다.

| 파일 | 공개 UTF-8 텍스트의 LF 정규화 SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 0bdce99daabf3b41aa553c080dbab21acfb9a7b86c3c46b5fd53a6ae0337002f |
| vocagoyangksat2027.html | 5ff5df3dc4cb719da03ef594a658d545606e014e344981ab2df62e426090eda8 |
| vocagoyangebs2027.html | 9e0e797b7f3c7a83a7b5da056a5a9a459f398cbb3dec96f7e826c62f9f41b97e |

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=1d0f859)

---

# FABLE 보강 제목 + 표시 배포 · 2026-10-07

- 앱 커밋 [0bae266](https://github.com/esqsoy/vocagoyang/commit/0bae2665416dcb0728e32248cfe425f156a435dd)을 origin/main에 푸시했다. [GitHub Pages 37514294209](https://github.com/esqsoy/vocagoyang/actions/runs/37514294209) completed/success와 공개 인덱스·세 과정 HTTP 200 및 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- 4세트는 ‘301~400+’, 45세트는 ‘4384~4460+’로 표시한다. 보강 설명 때문에 발생하는 추가 줄바꿈을 줄였다. 46세트 이후의 주제 제목은 유지한다.
- 어휘·카드·진도·이어하기는 바뀌지 않았다. 배포 전 diff 검사와 독립 범위 검수를 통과했다. 구현 단계의 390/320px 브라우저에서 주변 숫자 세트와 제목 행 높이 일치, 가로 넘침 없음과 세트 안 제목을 확인했다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 47cf5cde8df50c7a3eea25a1276d15d489425e30a54b9ab40857ae1b1274ad04 |
| vocagoyangksat2027.html | 5ff5df3dc4cb719da03ef594a658d545606e014e344981ab2df62e426090eda8 |
| vocagoyangebs2027.html | 9e0e797b7f3c7a83a7b5da056a5a9a459f398cbb3dec96f7e826c62f9f41b97e |

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=0bae266)

---

# 홈 제목·이어하기 UI 통합 배포 · 2026-10-07

- 앱 커밋 [fe71060](https://github.com/esqsoy/vocagoyang/commit/fe710608e73e02029e91edd95535071f8594b424)을 origin/main에 푸시했고 [GitHub Pages 37507350892](https://github.com/esqsoy/vocagoyang/actions/runs/37507350892) completed/success와 공개 인덱스·세 과정 HTTP 200, 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- FABLE 4/45의 제목을 ‘기초 보강’/‘핵심 보강’으로, 마더텅 14/16/17을 ‘문장 위치’/‘장문 - 단일 지문’/‘장문 - 복합 지문’으로 줄였다.
- 세 과정 이어하기를 목록 전체 너비로 넓히고 윗줄에 동작명·다음 연습, 아랫줄에 세트/강·카드 수·클리어 현황을 통합했다. 이어하기가 없는 첫 방문에는 제목 아래 통계를 유지한다. 마더텅 통계는 출제 범위를 따른다.
- 어휘·게임·진도·저장 키와 이어갈 대상 계산을 유지했다. MW12/ODE 비교는 미확정 문서만 포함한다.
- 배포 요청 후 card-search, saved-cards, textbook-ui, IPA conservation, saved build --check, index-stats --check, git diff --check 통과. 독립 검수에서도 DATA와 진행 관련 코드 보존을 확인했다.
- 구현 단계의 기본/390/320px 브라우저 및 일회성 harness에서 첫 방문·일부/전체 완료·통계 이동·범위 전환·실제 이어하기·개인 복습 후 진도 보존을 확인했다. 실제 iPhone Safari 검사는 아니다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 2e58f255e92dedd3d9d61443d030a0a3b594593259b9467616615f01d079578f |
| vocagoyangksat2027.html | 5ff5df3dc4cb719da03ef594a658d545606e014e344981ab2df62e426090eda8 |
| vocagoyangebs2027.html | 9e0e797b7f3c7a83a7b5da056a5a9a459f398cbb3dec96f7e826c62f9f41b97e |

[교재 선택](https://esqsoy.github.io/vocagoyang/?release=fe71060) · [FABLE](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=fe71060)

---

# 단어·뜻 검색과 카드 저장 통합 배포 · 2026-10-06

- 앱 커밋: [571900c](https://github.com/esqsoy/vocagoyang/commit/571900c8a9ea9830cd465827c6631334a8eddb16), origin/main 푸시 완료.
- [GitHub Pages 37424922011](https://github.com/esqsoy/vocagoyang/actions/runs/37424922011): completed / success. 공개 인덱스·세 과정 HTTP 200 및 로컬 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- FABLE·마더텅·EBS 홈의 단어·뜻 검색, 예문/해석/해설/출처 펼치기, 기존 ‘모아둔 카드’ 저장/해제를 배포했다. 영어 표제어·표시형과 한국어 뜻을 검색하며 마더텅의 이전 기출·원래 뜻도 포함한다. 정확한 단어 우선, 결과 24장씩 더 보기를 지원한다.
- 기존 단어 데이터·정답·게임·진도·저장 카드 ID와 집계 수치는 유지했다. plausible은 현행 유지, ODE 목표/로드맵은 문서로만 반영했다.
- 배포 요청 후 card-search, saved-cards, saved 빌드 --check, IPA conservation, textbook-ui, answer-replay, index-stats --check, git diff --check 통과. 독립 코드 검수에서 세 HTML의 공통 생성 CSS/runtime 외 부분과 DATA가 이전 HEAD와 동일함을 확인했다.
- 구현 단계의 내장 브라우저에서 세 과정 검색·카드 저장·상세와 FABLE 개인 복습, 390/320px 표시를 확인했다. 실제 iPhone Safari 검사는 아니다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | c14666cb9f1a9f6519e615fd686737e3accabc3d8c74279793658293dc3badc4 |
| vocagoyangksat2027.html | 4606030c61b1876600befebd89a20486bc06c1e775626b6aa10d83e8e61e7ad5 |
| vocagoyangebs2027.html | af3ca244d101d6075550585cf89ba32113411454ab083acc79cf0edda867f0d2 |

[교재 선택](https://esqsoy.github.io/vocagoyang/?release=571900c) · [FABLE](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=571900c)

---

# 모아둔 카드·학습 배치 조정 통합 배포 · 2026-10-03

- 앱 커밋: [843b189c54593731fcb2b799d600579679b302fd](https://github.com/esqsoy/vocagoyang/commit/843b189c54593731fcb2b799d600579679b302fd), origin/main 푸시 완료.
- [GitHub Pages 37124186893](https://github.com/esqsoy/vocagoyang/actions/runs/37124186893): completed / success. 공개 인덱스·세 과정 HTTP 200, 로컬 검증본과 LF 정규화 SHA-256 일치를 확인했다.
- 세 과정의 고양이 저장/해제, 번호 없는 ‘모아둔 카드’, 개인 복습·목록 펼치기·개별 해제·목록 복사를 배포했다. 기기·브라우저별 저장이며 정규 진도·이어하기·엔딩·콤보와 분리한다.
- FABLE 독해 핵심 77카드 0→45, 기초 핵심 36카드 0→4, 서수 30카드→1, 방위 10카드→3, a/an·좌우파 대비쌍 결합, 45 잔여 두 연습 결합. 총 7,067카드·4,916표제어는 그대로, 연습은 620→623이다. 0세트는 305→192카드다.
- qualification/certification의 사용자 확정 해설 3카드도 함께 반영했다. 정답 범위는 유지한다.
- 배포 요청 후 검사: placement-regrouping(7,067 저장 ID, 74 부분 완료 조건, 이전 3,250/현재 623 이어하기), saved-cards 세 과정, 선행 lesson-placement, reading-core, session 7,476회, morphology-content, 교재 UI·6,498/597카드 입력·6,422발췌, answer-replay, IPA conservation·host-hooks, IPA·원문·saved 빌드 --check, index-stats --check. 조립 재현성·disassemble 보호·diff --check도 통과했다.
- 공개 브라우저에서 ‘모아둔 카드’와 최종 세트·연습 수치 표시를 확인했다. 실제 iPhone Safari 검사는 아니다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | cc651be0a9c6682e2fbb253c1406c27c22bb53bb06be540b2de38615a0800466 |
| vocagoyangksat2027.html | e7ac85d7aac94f7f29c64f3f4cbb4d251fd299ff9c9ae701a15c7b12cfb4512c |
| vocagoyangebs2027.html | 317cbf3aa01fe22689fe117b2d9f842aa8c3185453709750f81256ea0bbc0d09 |

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=843b189)

---

# 동의어 해설·공통 고양이 대사 수정 · 2026-10-02

- 앱 커밋: [91a1b15ebbba72a2e3affd67724a2731b109a3bb](https://github.com/esqsoy/vocagoyang/commit/91a1b15ebbba72a2e3affd67724a2731b109a3bb), origin/main 푸시 완료.
- [GitHub Pages 36912696092](https://github.com/esqsoy/vocagoyang/actions/runs/36912696092): completed / success. 공개 인덱스·세 과정 HTTP 200과 검증본의 일치를 확인했다.
- FABLE implication·consequence의 해설 3개와 복습 3개를 보완했다. ‘영향·결과’ 뜻의 대체 가능성과 ‘암시’ 뜻의 차이를 명시했다.
- FABLE·마더텅·EBS 공통 유사어 오답 대사를 “이번에 익힐 단어는 이거라고양!”으로 바꿨다. 한국어 뜻 중복만으로 영어의 쓰임이 다르다고 단정하지 않는다.
- 단어·예문·정답 범위·진도는 유지했다. 동의어 검수 원칙은 문서에 확정했으며 기존 ALT·acceptedAnswers 개별 예외의 재검수는 후속 작업이다.
- 배포 요청 후 검사 5개 통과: morphology-content, session(620연습·7,440회), IPA conservation, textbook-ui, IPA build --check.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 73b6137b6312d5a538c3207df389399d32a443cd2f0ff3ca6abd33b1a703a0a6 |
| vocagoyangksat2027.html | 5fa45291af74556c71ec7dce737563d576857802b3e5d5ee8d063e101991bbe3 |
| vocagoyangebs2027.html | e5f88c6fe629466d21c94e9ab5797511170b5b4569382c954ccf9ad2b838a027 |

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=91a1b15)

---

# 뜻의 정답 노출 정리·figure·qualify 수정 · 2026-10-02

- 앱 커밋: [1764496dfcba928e382e6a69d57ec82634f969f5](https://github.com/esqsoy/vocagoyang/commit/1764496dfcba928e382e6a69d57ec82634f969f5), origin/main 푸시 완료.
- [GitHub Pages 36904196964](https://github.com/esqsoy/vocagoyang/actions/runs/36904196964): completed / success. 인덱스·세 과정 HTTP 200과 로컬 검증본의 일치를 확인했다.
- 뜻의 정답 노출 119곳을 정리했다. figure의 six-figure salary 예문과 한국의 ‘억대 연봉’ 비유 한 문장, qualify의 only in this case 예문을 반영했다. 원본·복습 포함 123카드·131필드다.
- 단어 수·순서·정답 판정·진도·UI·IPA는 유지한다. 인덱스·마더텅·EBS 파일은 이전 공개본과 동일하다.
- 배포 요청 후 검사 5개 재실행 통과: morphology-content, reading-core, session(620연습·7,440회), IPA conservation, IPA build --check. 변경 원장의 최초 보존 해시는 유지했다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 0870a31258bd736557f71c7509a9ea883249b14cbe02dea46497f2db17185ea6 |
| vocagoyangksat2027.html | 9c9dee92b4bb4de5c5329d44ae9ee751c5f5cd27a3b844963891ff78ba20757f |
| vocagoyangebs2027.html | 855c51369c700524d4780ecb5b3dbfd723bcc31def2009dea075732da14d311f |

[FABLE 열기](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=1764496)

---

# 모바일 Safari 발음기호 위치 보정 · 2026-10-01

- 앱 커밋: [7032122a2be6b670f03f325fa23ff4b4398cfef2](https://github.com/esqsoy/vocagoyang/commit/7032122a2be6b670f03f325fa23ff4b4398cfef2), origin/main 푸시 완료.
- [GitHub Pages 36873498316](https://github.com/esqsoy/vocagoyang/actions/runs/36873498316): completed / success. 2026-10-01 23:05 KST 인덱스·세 과정 HTTP 200 및 검증본과의 일치를 확인했다.
- FABLE·마더텅·EBS 공통 IPA가 고정 레이어의 실제 원점을 기준으로 배치되고 visualViewport의 resize/scroll을 따라간다. 위치 갱신을 한 프레임으로 묶고 효과 종료 시 예약을 취소한다. 스타일·발음 속도·단어 데이터·진도는 유지한다.
- 배포 요청 후 검사 8개 재실행·통과: IPA layout, completion, advance, stress, host-hooks, conservation, answer-replay, build --check. 구현 단계에서 Chromium 일반 화면과 390px도 확인했다.
- 학생의 iPhone Safari 실기기에서 해결됐는지는 아직 미확인이다. 모의 원점 이동에서 기존 분리 현상이 재현되고 보정 후 통과한 결과와 실기기 검증을 구분한다.

공개 UTF-8 텍스트를 LF로 정규화한 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | 2458c9339bb762e1b7dce96a7ff5bf97f66dadeaed6cbfae7b01df994d32ee0d |
| vocagoyangksat2027.html | 9c9dee92b4bb4de5c5329d44ae9ee751c5f5cd27a3b844963891ff78ba20757f |
| vocagoyangebs2027.html | 855c51369c700524d4780ecb5b3dbfd723bcc31def2009dea075732da14d311f |

[교재 선택](https://esqsoy.github.io/vocagoyang/?release=7032122) · [FABLE](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=7032122)

---

# 어원·접미사 보강과 인덱스 자동 집계 · 2026-10-01

- 앱 커밋: [cadd4fbb9f4c24a05b6d9565db308ffba50eb4a4](https://github.com/esqsoy/vocagoyang/commit/cadd4fbb9f4c24a05b6d9565db308ffba50eb4a4). origin/main 푸시 완료.
- [GitHub Pages 36754934684](https://github.com/esqsoy/vocagoyang/actions/runs/36754934684): completed / success. 2026-10-01 02:57 KST에 인덱스·세 과정 공개 파일 HTTP 200과 로컬 검증본의 일치를 확인했다.
- 어원·접미사 358카드·141개 개념 단위. 새 표제어 43개와 기존 어휘의 대비·복습을 추가했다. 전체 FABLE 7,067카드·620연습. awesome/troublesome의 일반 -some과 ribosome의 -some, microbiome 등의 -ome을 구별하고 word family 표기를 통일했다.
- 월 해설을 정리하고 숫자 어원을 반영했다. 세 과정에서 음성이 일찍 끝날 때 일부 IPA가 누락되는 경로를 수정했다.
- 인덱스는 데이터 빌드 때 자동 갱신한다. FABLE 4,916, 마더텅 추가 3,238·누적 8,154, EBS 추가 129·최종 8,283. 등록 표제어·구 표현·이전 기출 기준이다.
- 개편한 47·48세트 진도는 새 구성으로 시작한다. 저장 기록을 삭제하지 않으며 다른 세트·과정의 진도는 유지한다. 47세트 Exercise 11은 troublesome 추가를 반영한 별도 키를 쓴다.
- 배포 전 검사 19개 통과: [검사 목록·범위](HANDOFF.md#이번-배포-검사--2026-10-01). FABLE 7,440회 모의 플레이, 마더텅·EBS 입력, 발음·재생·내용 및 기록 보존을 확인했다. 보류한 흰색 밝기 실험과 관계없는 로컬 임시 파일은 포함하지 않았다.

UTF-8 텍스트의 줄바꿈을 LF로 통일한 공개 파일 SHA-256:

| 파일 | SHA-256 |
| --- | --- |
| index.html | c89abf0834676d0ec708a66babaae82ddfd9e5c9025c1f1f1e5f1c5057de42cb |
| vocagoyangfable.html | d066f6b03ed0a462f72cd9af5f82ac166d950d50fa0f428f2d6536c773686bd2 |
| vocagoyangksat2027.html | 0dece91a0587737b127c2a616a687e6510a8bb03bf67f2e8dbe599c82a1b63b8 |
| vocagoyangebs2027.html | 172f9984d2b339797832ad2749a9289a8e642b298b60c6786460f4a07475723b |

[교재 선택](https://esqsoy.github.io/vocagoyang/?release=cadd4fb) · [FABLE](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=cadd4fb)

아래는 이전 배포 기록이다.

---

# 마더텅 원문 발췌·문장 안 입력과 공통 발음 재생 · 2026-09-29

- 배포 커밋: [`b72f72376848a42c72229b66b1bd60c76f8e5a26`](https://github.com/esqsoy/vocagoyang/commit/b72f72376848a42c72229b66b1bd60c76f8e5a26). `origin/main`에 푸시 완료.
- [GitHub Pages 실행 36531512560](https://github.com/esqsoy/vocagoyang/actions/runs/36531512560): `completed / success`, 2026-09-29 15:32 KST 확인.
- 마더텅 6,498카드 중 6,422카드에 원문 발췌를 연결하고 문장 안에 입력칸을 배치했다. 입력은 표제어 기준이고 공개 시 원문 어형을 복원한다. 나머지 76카드는 단어형으로 유지한다. 227개 필수 주석은 고양이 대사에 표시한다.
- FABLE·마더텅·EBS에서 공개된 정답 단어를 누르면 음성과 IPA 효과를 다시 재생한다. 해설칸의 정적 IPA는 제거하고 기존 FABLE 해설은 유지했다.
- UI 표준, 작업 지침, 최신 인수인계와 누적 작업 기록을 저장소에 포함했다. 흰색 밝기 실험·후속 디자인·PDF 전체·OCR·로컬 점검 도구는 포함하지 않았다.
- 빌드 일치, 발췌·입력·발음·재생·데이터 및 기록 보존, EBS 입력, FABLE 7,344회 모의 플레이까지 관련 검사 10개 명령 통과. [검사 목록](HANDOFF.md).
- 공개 인덱스와 세 게임 파일을 HTTP 200으로 받아 로컬 검증본과 비교했다. 아래 SHA-256은 UTF-8 텍스트의 줄바꿈을 LF로 통일해 계산했다.

| 파일 | 공개 내용 SHA-256 |
| --- | --- |
| `index.html` | `f45e4e3549829f8e0ac77d394c8808b9cfe8451561e8d89d20391a4591151372` |
| `vocagoyangfable.html` | `c20fee7d8cc89c7ad9cf69c99ead83acf39095b2f8be72ff5131c6fbd0fea858` |
| `vocagoyangksat2027.html` | `9c6185bf930f71a8537c2f386d408b42af280d326c88339833c406a0826be4fa` |
| `vocagoyangebs2027.html` | `c3405c6fc29b34f7bb7f5ce8a66a00ed1996fac80c8c029ae2e794c99df1a098` |

공개 페이지: [교재 선택](https://esqsoy.github.io/vocagoyang/), [마더텅](https://esqsoy.github.io/vocagoyang/vocagoyangksat2027.html?release=b72f723), [FABLE](https://esqsoy.github.io/vocagoyang/vocagoyangfable.html?release=b72f723), [EBS](https://esqsoy.github.io/vocagoyang/vocagoyangebs2027.html?release=b72f723).

아래는 이전 배포 기록이다.

---

# 세 과정 예문을 흰색으로 조정 · 2026-09-29

- FABLE·마더텅·EBS의 영어 예문 `.hoectx .ex`를 연분홍 `#f6e2ec`에서 흰색 `#ffffff`로 변경했다.
- 해설 본문은 원래 흰색이며 그대로 유지했다. 번역·발음·정답 강조·배경·크기는 변경하지 않았다.
- 브라우저에서 예문과 상위 요소의 opacity 1, filter none을 확인하고 변경 후 흰색 표시를 검증했다.
- 어휘 데이터·진도·음성 보존, IPA 빌드 동기화, 두 내용 검수의 회귀검사 통과. 과거 UI 해시는 기록된 이번 색 변경만 역변환해 보존한다.
- 배포 전 기준은 `689d1d0`다.

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 동의어 안내 명확화 · 2026-09-29

- 해설 221개에서 같은 뜻으로 바꿔 쓰는 관계를 분명히 밝혔다. 의미가 다른 경우에는 차이를 설명한다.
- 새 대체 정답을 추가하지 않았다. 익숙한 동의어 대신 해당 표제어를 익히는 학습 목적을 작업 기준에 기록했다.
- 예문·번역·어휘 구성·IPA·UI·진도·기존 정답 규칙은 동일하다. 11개 검사 명령 통과.
- 배포 전 기준은 `de20aad`. [수정 결과](pipeline/synonym-wording-20260929/REPORT.md), [전체 변경](pipeline/synonym-wording-20260929/findings.json).

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 유의어·예문 전수 검수 · 2026-09-29

- 51세트·6,876카드 전량 재독해. 441카드의 예문 40개·번역 43개·해설 407개를 교정했다.
- 새 대체어는 해설에만 안내한다. 기존 정답·단어·뜻·카드 순서·612연습·UI·IPA·완료/이어하기 기록은 동일하다.
- 11개 검사 명령 통과. 7,344회 모의 플레이·1,336개 결합 입력 경로와 원본/HTML 동기화·과거 기준 보존 확인.
- 마더텅·EBS는 수정하지 않았다. 배포 전 기준은 `09ce564`다.
- [검수 보고서](pipeline/synonym-review-20260929/REPORT.md), [전체 변경 기록](pipeline/synonym-review-20260929/findings.json).

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 학생 이스터에그 · 2026-09-28

- corner 고양이 대사: “꼭 자습실 corner에서 공부하는 사람이 있다고양!”
- artist 예문: “Painters, writers, and pianists are all artists.” 번역: “화가도, 작가도, 피아니스트도 모두 예술가야.”
- 두 카드의 세 필드만 수정했다. 전체 6,876카드와 UI·게임 코드·기존 기록은 유지한다. 발음 효과 시제품은 별도 로컬 작업이다.
- reading-core, pool-expansion, session, keyboard 검사 통과. 원본과 생성 DATA의 일치 및 기록된 변경 외 불변을 확인했다.
- 변경 기록: [player-feedback-20260928.json](pipeline/player-feedback-20260928.json). 배포 전 기준은 ab2f0461233b4dcc08c7955d3f55e94a07139363이다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# 마더텅·EBS 최종 Fable UI 적용 · 2026-09-28

- 마더텅과 EBS의 입력칸·첫 글자 힌트·고양이 대사 위치·시간 막대·정답 공개·클리어 효과를 완성된 Fable UI에 맞췄다.
- 마더텅 상단 제목·2026/전체 선택과 기존 발음 자료를 유지한다. EBS에 새로운 발음 자료는 추가하지 않았다.
- 교재 원본 DATA와 저장 기록 주소를 유지했다. 마더텅 521연습·6,498카드, EBS 48연습·597카드. 지문별 연습을 쪼개거나 재배열하지 않았다.
- 검사 4종 통과. 두 교재 7,095카드의 문자 입력과 IME·따라쓰기·저장 기록·힌트·콤보를 확인했다. 브라우저에서 작은 화면 줄바꿈·정답 위치·장미 효과를 확인했다.
- 원본 백업 두 개를 남겼다. Fable과 교재 선택 파일은 변경하지 않았다. PDF 예문 발췌 작업은 후속으로 진행한다.
- [변경·검증 상세](pipeline/textbook-ui-20260928/README.md). 배포 전 기준은 c0e5b5e5fec3ac094c0f87c1b417080a55ff0f56다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangksat2027.html 및 https://esqsoy.github.io/vocagoyang/vocagoyangebs2027.html

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 해설 문장·군더더기 전수 검수 · 2026-09-27

- 51세트·6,876카드 전체를 확인했다. 해설 481곳을 수정했으며 앞선 topic/subject 3곳을 포함해 총 484카드가 바뀐다.
- 독립된 내용을 단문으로 나누고 막연한 동의어 연결·학습 독려·무관한 설명을 줄였다. 7카드는 해설만 지웠다. 어원 원문과 실제 쓰임의 차이는 유지한다.
- 해설 필드만 바뀌었다. 단어·예문·순서·51세트·612연습·6,876카드·UI·게임 코드·기존 완료/이어하기 키는 그대로다.
- 기존 검사 8종 통과: 모의 플레이 7,344회, 결합 입력 1,336경로, 과거 진도 승계 및 현재 원본 동기화 확인.
- [검수 결과](pipeline/explanation-clarity-20260927/REPORT.md), [전체 전후 문구](pipeline/explanation-clarity-20260927/findings.json), [검증 결과](pipeline/explanation-clarity-20260927/validation.json).
- 배포 전 기준은 b99dd9bfdb39806a1319d5c71448723bf03df324다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 HTML 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 장미·하트 효과와 퍼펙트 연습 콤보 · 2026-09-27

- 본문 하트는 약 20% 크게, 재생 시간은 8% 짧게 조정했다.
- 클리어 후 오답을 누르면 빨간 장미 한 송이와 넓어진 네 가지 꽃비가 순환한다. 중앙 장미 뒤에는 짧고 옅은 비너스 실루엣이 나타난다.
- 연습을 연속 퍼펙트로 완료하면 색이 바뀌고 PERFECT ×N과 한 글자씩 길어지는 울음소리가 나타난다. 일반 완료·중도 포기 시 초기화하며 페이지를 열어 둔 동안만 유지한다.
- 검사 8종 통과. 모의 플레이 7,344회와 결합 표현 입력 1,336경로, 신규 퍼펙트 콤보 상태 전환을 확인했다. 51세트/612연습/6,876카드와 기존 저장 기록은 유지한다.
- [변경·검증 상세](pipeline/effects-ui-20260927/README.md). 체험용 UI는 제외했고 마더텅·EBS·교재 선택 페이지는 수정하지 않았다.
- 되돌리기 기준: 1f1e947198cb99d56ac424d85925f298bb2ef883. 새 '장미의 탄생' 구상은 향후 본문 클리어 효과를 위한 별도 과제로 남겼다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 전체 내용 검수·어휘 풀 보완 · 2026-09-27

- 앞선 전수 검수의 175카드·195필드 교정을 반영했다. 뜻·예문·번역·해설과 대표 카드 43장의 어원 풀이를 보완했다.
- 승인된 17카드를 추가하고 tyre/tire, 법적 의미 proceedings/proceeding의 중복 2카드를 통합했다. tempt 두 카드는 유지했다.
- 51세트 / 612연습 / 6,876카드. 기존 표제어 옆에 새 뜻을 넣고 뜻 번호를 보존했다. 새 대조 표현도 같은 실제 연습에 모았다.
- 구성이 바뀐 원본 16묶음(22개 플레이 연습)만 새 완료 키를 쓴다. 이전 완료만으로 새 내용을 건너뛰지 않으며 저장 데이터를 지우지 않는다. 나머지 기록은 유지한다.
- 검사 8종 통과: 모의 플레이 7,344회, 기존 결합 입력 1,336경로, 신규 어휘·입력·기록 승계와 과거 기준 복원 검사. UI·게임 코드와 마더텅·EBS·교재 선택 화면은 그대로다.
- [전체 변경 내용](pipeline/pool-expansion-20260927/REPORT.md), [검증 결과](pipeline/pool-expansion-20260927/validation.json). 배포 전 공개 기준은 7f38a095f1556dc6f2a4b506e8d1bbcc72dacacd다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 시간바·주제별 연습·해설 정리 · 2026-09-27

- 위 시간바의 기본색과 중간 경고색을 연보라색 `#b8a2d4`로 통일했다. 남은 시간 25% 미만에서는 탁한 빨간색 `#b97882`로 바뀐다. 노란색 단계는 없애고 기존 시간 계산·전환 속도와 아래 진도바·대사 색은 유지했다.
- 0세트의 6개 주제 묶음, 13개 연습 경계를 조정했다. 요일 7개와 월 12개를 각각 묶고 수사·가족/직업·읽기/쓰기·음식·감정/성질의 경계를 정리했다. 10~12카드는 기본 목표이며 의미 있는 묶음은 최대 15카드로 유지한다.
- 기존 March·May의 달 의미를 0세트 복습용으로 보충했다. 원래 3·5세트의 다의어 카드는 그대로다. 전체 51세트 / 612연습 / 6,861카드다.
- 기존 완료·이어하기 기록은 카드 범위에 맞춰 이어받는다. 새 월 연습에는 March·May가 추가됐으므로 예전 완료 기록만으로 자동 완료되지 않는다. 저장 기록은 삭제하지 않는다.
- 해설 전수조사의 341개 편집과 후속 강세 해설 63개 편집을 포함했다. 불필요한 학습 지시·빈도 강조를 줄이고, 단순 강세 안내는 짧게, 의미·품사별 강세 차이는 구체적으로 남겼다. 두 편집 건수는 겹치는 카드를 포함한 작업 이력이다.
- 기존 검사 7종 통과: 모의 플레이 7,344회, 결합 표현 입력 1,336경로, 기존 기록 조합 3,050건·혼합 기록 16,294건, 새 주제 경계 완료 64조합·이어하기 13위치. 별도 검토에서도 카드 누락·표제어 분할은 발견되지 않았다.
- 마더텅·EBS·교재 선택 화면은 변경하지 않았다. 되돌리기 기준은 `4c993cca763be5f8deb688e06337352aa800fcb9`다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 결과와 공개 파일로 확인한다. 아래는 이전 배포 기록이다.

---

# Fable 입력·피드백 UI 개선 · 2026-09-27

- 사용자가 승인한 로컬 시험판의 기본 레이아웃을 반영했다. 상단에 작은 여백을 두고, 고양이 대사와 정답 공개 전후의 글자·뜻 위치를 유지한다. 시험용 제목 비교와 테스트 조작 화면은 배포 파일에서 제외했다.
- 정답을 별도로 크게 반복하지 않고 본문의 입력칸에 채운다. 발음기호는 해설 문단 앞에 이어 쓰며, 발음기호를 누르거나 키보드로 선택해 발음을 다시 들을 수 있다.
- 모든 입력칸은 넓은 글자 W 기준으로 같은 폭을 쓴다. 글자별 폭 측정이나 확대·축소 계산은 없다. 공백과 문장부호, 따라쓰기 및 IME 입력 처리는 유지한다.
- 별도 힌트 버튼 대신 첫 입력칸을 누르면 첫 글자만 한 번 공개한다. 추가 클릭으로 단어 절반이 열리던 두 번째 힌트를 제거했다. 힌트만으로 자동 제출하지 않으며 기존 힌트 사용 기록은 유지한다.
- 51세트 / 612연습 / 6,859카드 및 기존 저장 키는 그대로다. 마더텅·EBS·교재 선택 화면은 변경하지 않았다.
- 기존 검사 7종 통과: 키보드·공백·전치사 결합 입력 1,336경로, 모의 플레이 7,344회, 내용·어근·기록 이전 검사. 입력 테스트의 HTML 파서와 DOM 스텁만 새 칸 구조에 맞췄다. 브라우저에서 320/390px의 위치 유지, 첫 칸 힌트, 정답 및 따라쓰기 입력을 확인했다. nineteen 재클릭은 n만 유지하고 나머지 입력으로 정상 채점한다.
- 되돌리기 기준: 이전 공개 커밋 `4b6807f059c179784135148438a8ff2ef422b8fc`. 로컬 시험판에도 원본과 각 단계별 백업을 보관했다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

실제 공개 상태는 GitHub Pages 배포 결과와 공개 URL에서 확인해야 한다.


## Fable beach 예문 구분 · 2026-09-25

- beach 예문을 `We played {{BLANK}} volleyball on the sand.`로 교체했다. 번역은 '우리는 모래 위에서 비치발리볼을 했어.'다.
- shore 허용 답을 제거했다. [beach volleyball](https://dictionary.cambridge.org/dictionary/english/beach-volleyball)이라는 종목명으로 두 단어를 구분하고, 차이는 해설로 설명한다.
- shore는 18세트 Exercise 2 · 1711~1720에 독립 표제어로 유지한다. 연습 구성과 기록 키는 동일하다.

## Fable beach / shore 허용 답 · 2026-09-25 (아래 변경은 위 예문 교체로 대체됨)

- 0세트 beach의 `We swam at the {{BLANK}} all day.`에서 shore도 정답으로 인정한다. 해당 카드의 acceptedAnswers로 한정한다.
- 예문은 유지하고, beach는 모래·자갈이 있는 해변이고 shore는 바다·호수 등의 물가를 넓게 가리킨다는 차이를 해설에 넣었다. [Cambridge beach](https://dictionary.cambridge.org/dictionary/english/beach), [Cambridge shore](https://dictionary.cambridge.org/dictionary/english/shore).
- beach·shore 입력 검사 통과. 기존 배포와 비교해 이 카드의 해설·허용 답만 변경한 것을 확인했다. 연습 구성과 기록 키는 동일하다.

## Fable 11카드 중심 연습 · 2026-09-25

- 51세트 / 613연습 / 6,886카드. 평균 11.2카드, 575연습(약 94%)이 8~15카드다. 짧은 주제·표제어 경계에 따른 38연습은 4~7카드로 유지한다.
- 11카드를 중심으로 하되 같은 표제어는 나누지 않는다. 14~15장은 한 판으로 유지하고 22장은 11+11, 24장은 12+12로 구성한다. get의 6뜻은 like·no·time과 함께 12카드로 유지한다.
- 원본 520묶음 중 91개만 분할한다. 카드 내용·순서·별도 주제에서의 재학습 구성은 유지한다.
- 원래 큰 묶음의 완료 기록은 그대로 인정한다. short-v1과 heads-v2의 완료 카드 범위도 합쳐서 이어받으며, 새 연습 전체를 덮어야 완료로 표시한다. 기록 초기화는 하지 않는다. 미완료 카드가 함께 합쳐진 연습은 다시 완료해야 한다.
- 모의 플레이 7,356회, short-v1 완료 조합 3,054건, 두 분할판의 기록 조합 15,622건, 이전 3종 위치와 새 위치의 이어하기를 검사했다. 7종 내용·입력·진도 검사도 통과했다. 브라우저에서 613연습 표시, 첫 연습의 11카드 구성, 정답 입력 후 1/11 진행과 다음 카드 이동을 확인했다.
- 마더텅·EBS·교재 선택 페이지는 변경하지 않았다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

아래는 이전 분할 방식의 배포 기록이다.

## Fable 표제어를 보존하는 짧은 연습 · 2026-09-25

- 51세트 / 931연습 / 6,886카드. 한 주제 안에서 같은 표제어의 뜻을 여러 연습에 나누던 170곳을 해결했다.
- 8카드는 권장 분량이며 다의어를 모으는 조건이 우선한다. 6~8카드가 721연습이며, 전체 범위는 4~13카드다. 12카드 3연습·13카드 1연습 외에는 모두 11카드 이하다.
- get 6뜻은 like·no·time과 함께 1세트 Exercise 1-1의 12카드에 모았다. subject 8뜻은 다른 표제어와 함께 13카드에 배치했다. 한 답안만 반복하기 쉬운 조각도 줄인다.
- 원본 카드·순서·기존 주제별 재학습 구성은 그대로다. 520개 원본 묶음 중 386개를 나누고 134개는 유지한다.
- 기존 큰 묶음의 클리어는 유지한다. 첫 분할판의 기록은 새 연습을 이루는 모든 옛 부분이 완료됐을 때만 인정한다. 기록은 삭제하지 않으며, 카드가 추가로 합쳐진 일부 연습은 미완료로 표시될 수 있다. 첫 분할판 이어하기는 카드가 겹치는 위치로 연결한다.
- 11,172회 모의 플레이, 표제어 분할 금지, 첫 분할판 완료 조합 4,490건, 과거 위치 536개·첫 분할판 위치 1,079개·새 위치 931개의 이어하기를 검사했다. 브라우저에서 get 연습의 12카드 표시·실제 정답 입력을 확인했다.
- 마더텅·EBS·교재 선택 페이지는 변경하지 않았다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

아래는 이전 분할 방식의 배포 기록이다.

## Fable 짧은 연습 첫 분할판 · 2026-09-25

- 51세트 / 1,079연습 / 6,886카드. 기존 520개 주제 묶음 중 489개를 나누고 31개는 유지했다.
- 한 연습 4~8카드. 분포: 4카드 13개, 5카드 159개, 6카드 438개, 7카드 341개, 8카드 128개.
- 원본 카드·주제·순서는 유지한다. 같은 주제 안에서 부분별 분량 차이가 최대 1카드가 되도록 나눈다.
- 기존 클리어는 해당 묶음의 모든 부분에 적용하며 새 클리어는 부분별로 저장한다. 기록 초기화는 없다. 예전 이어하기는 해당 묶음의 첫 미완료 부분으로 연결된다.
- 12,948회 모의 플레이, 원본 520묶음의 완료 상속, 과거 위치 536개와 새 위치 1,079개의 이어하기, 부분별 저장·다음 연습·전체 완료를 검사했다. 기존 내용·키보드·공백·전치사 입력 검사도 통과했다.
- 375px 브라우저에서 목록의 분할 번호·카드 수, 8카드 플레이의 정답 입력·다음 카드 전환을 확인했다.
- 마더텅·EBS·교재 선택 페이지는 변경하지 않았다.

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

아래는 이전 최초 공개 업데이트의 기록이다.

## Fable 공개 업데이트 · 2026-09-19

배포 대상: https://esqsoy.github.io/vocagoyang/vocagoyangfable.html

- 51세트 / 521연습 / 6,907카드.
- 기존 어휘 뜻·예문·해설 검수, 후반 46~50세트 재구성.
- 출제 순서, 입력 포커스, IME 보호, 공백 표시 보완.
- 공백 포함·생략 답안을 모두 인정.
- Mother Tongue·EBS·교재 선택 화면은 이번 배포 대상에 포함되지 않음.

검사 7종 결과는 pipeline/tests/release-20260919.json에 보관한다. 해당 검사를 모두 통과한 앱을 배포 대상으로 삼았다. 원본 및 후속 작업은 WORK_PLAN.md를 참고한다.

Git 저장 내용(LF)의 HTML SHA-256: 4aa6e2905205ff812d1e3225e5e228aa1729e45c09e550efcacb7fac38fb2823

실제 공개 상태는 GitHub Pages 배포 결과와 공개 URL에서 확인해야 한다. 이 문서 자체는 호스팅 성공을 보장하지 않는다.

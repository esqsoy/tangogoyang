# 공통 기능 표 (탄고고양 = 분가)

보카고양(esqsoy/vocagoyang)이 본가, 탄고고양(옛 니혼고양)이 분가다. 공통 기능은 본가에서 만들고 고친다. 분가는 '같이 쓰는 파일'을 그대로 가져오고 '게임별 설정'만 자기 값으로 둔다. 같이 쓰는 파일을 고쳐야 하면 여기서 고치지 않고 AL에 `[보카고양]` 이슈로 부탁한다. 규칙 전문은 보카고양 `SHARED.md`(26.11.06 영신 "전부 그렇게 하자").

| 기능 | 폴더 | 같이 쓰는 파일 | 게임별 설정 | 가져간 버전 | 빌드·검사 |
|---|---|---|---|---|---|
| 기록 옮기기 | `pipeline/record-transfer/` | `merge.js` `runtime.js` `ui.html` `style.css` `build.cjs` `README.md` `test.cjs` | `config.json`: 이름 탄고고양, `app` tangogoyang-records, 접두어 `tangogoyang-`, 키 종류(五十音 `kana-`·漢字読み `yomi-` 포함), 넣을 파일 `index.html`. 세트 도장 없음 | `64d6d0e` (26.11.12: 공통 검사 `test.cjs` 포함. 화면 동작은 `69e8d5e`와 같음) | `node pipeline/record-transfer/build.cjs` (`--check`로 확인), 검사 `node pipeline/record-transfer/test.cjs`와 `pipeline/jlpt/test-jlpt.cjs`의 '기록 옮기기' |

- 본가 검사 `pipeline/tests/record-transfer.test.cjs`는 보카고양 저장 키(`goyang-`)가 박혀 있어 여기서는 그대로 못 돌린다. 설정을 읽게 해 달라고 `[보카고양]` 이슈로 부탁했다(26.11.09).
- 26.11.06에는 보카고양 공개 화면에서 손으로 옮겨 넣었고, 26.11.09에 본가 빌드 방식으로 바꿨다. 결과 코드는 같다(주석 한 줄만 다름).

- 26.11.12: index.html에 UI 끝 표시(`RECORD_TRANSFER_UI_END`)가 빠져 있어 26.11.09부터 build.cjs가 화면 블록을 넣지 못했고 `--check`가 헛돌았다(이솝 검수 P01). 끝 표시를 넣고 다시 빌드했다. 그래서 안내 문구가 본가 것('진도·도장·모아둔 카드')이 되었다. 탄고고양엔 도장이 없어 문구를 설정으로 빼 달라고 `[보카고양]` 이슈로 부탁했다.

## 가져왔지만 갈라진(포크한) 기능 (26.11.12 이솝 검수 P22)

본가가 아직 '공유 준비가 안 된 기능'으로 둔 것들이 template.html 안에 손으로 고친 사본으로 들어 있다(본가 기준은 이 저장소 첫 갈래 `398c448` 무렵). 바꾼 곳은 주로 저장 키 접두어(`tangogoyang-`)·JP_MODE별 대사·목표 이름이다. 본가가 설정을 빼서 공유 기능으로 올리면 그때 모듈로 되돌린다.

| 기능 | template.html 위치(26.11.12) |
|---|---|
| 모아둔 카드·검색 | `savedStoreKey` 근처 |
| 돌파 축하 | `msLearnedKey` 근처 |
| 진행 속도 예측 | `paceKey` 근처 |
| 발음·IPA 효과, 예외 음원 재생 | `ipaEffect*`, `exceptionAudio*` (영어판 기능, 일본어에선 효과 정보가 없어 쓰이지 않음) |

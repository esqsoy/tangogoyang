# 공통 기능 표 (탄고고양 = 분가)

보카고양(esqsoy/vocagoyang)이 본가, 탄고고양(옛 니혼고양)이 분가다. 공통 기능은 본가에서 만들고 고친다. 분가는 '같이 쓰는 파일'을 그대로 가져오고 '게임별 설정'만 자기 값으로 둔다. 같이 쓰는 파일을 고쳐야 하면 여기서 고치지 않고 AL에 `[보카고양]` 이슈로 부탁한다. 규칙 전문은 보카고양 `SHARED.md`(26.11.06 영신 "전부 그렇게 하자").

| 기능 | 폴더 | 같이 쓰는 파일 | 게임별 설정 | 가져간 버전 | 빌드·검사 |
|---|---|---|---|---|---|
| 기록 옮기기 | `pipeline/record-transfer/` | `merge.js` `runtime.js` `ui.html` `style.css` `build.cjs` `README.md` | `config.json`: 이름 탄고고양, `app` tangogoyang-records, 접두어 `tangogoyang-`, 키 종류(五十音 `kana-`·漢字読み `yomi-` 포함), 넣을 파일 `index.html`. 세트 도장 없음 | `69e8d5e` (26.11.09 가져옴, 본가 `aa95d0e`까지 공용 파일 바뀐 것 없음) | `node pipeline/record-transfer/build.cjs` (`--check`로 확인), 검사는 `pipeline/jlpt/test-jlpt.cjs`의 '기록 옮기기' |

- 본가 검사 `pipeline/tests/record-transfer.test.cjs`는 보카고양 저장 키(`goyang-`)가 박혀 있어 여기서는 그대로 못 돌린다. 설정을 읽게 해 달라고 `[보카고양]` 이슈로 부탁했다(26.11.09).
- 26.11.06에는 보카고양 공개 화면에서 손으로 옮겨 넣었고, 26.11.09에 본가 빌드 방식으로 바꿨다. 결과 코드는 같다(주석 한 줄만 다름).

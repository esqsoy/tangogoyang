# 五十音 가나 사람 녹음

- 결정: 영신 26.11.28 "요음만 다른 화자껄로 쓰고 후쿠진주케 음성을 일단 쓰자 문제생기면 말할게". 조사는 [reviews/kana-audio-20261128](../../../reviews/kana-audio-20261128/README.md).
- 소리: Lingua Libre 화자 **Fukujinzuke**(Wikimedia Commons, **CC BY 4.0**), 기본 46·탁음·반탁음 25·ちゃ(72개). 화자는 성별·지역·원어민 여부를 밝히지 않았다. 요음(ちゃ 빼고 32개)은 다른 화자 낱자 녹음이 없어(옛 commons りゅ 하나뿐, 목소리 섞기는 안 함) 기기 음성(TTS) 그대로.
- 파일: `audio/kana/<코드포인트>-<내용 해시 8>.mp3`(24kHz 모노 48kbps, 앞뒤 무음 그대로, 하나 약 5KB). 원본 WAV는 저장소에 넣지 않고 SHA-1을 [sources.json](sources.json)에 남긴다. 게임은 [manifest.json](manifest.json)을 build.py가 五十音 HTML에 넣고, 글자를 누를 때만 그 파일을 받는다(첫 화면 용량은 표 몇 KB). 실패하면 TTS.
- 만들기: commons에서 원본을 받아(429가 잦아 천천히) `python3 pipeline/jlpt/kana-audio/convert.py <wav 폴더> <urls.json>` → `python3 pipeline/jlpt/build.py`.
- 출처 표기: 五十音 화면 아래 줄('글자 소리: Fukujinzuke(Lingua Libre, CC BY 4.0), mp3로 바꿈').
- 확인 안 한 것: 사람 귀로 들어 본 것 0(`listened: null`), 아이폰 실기기 재생.

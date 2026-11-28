"""五十音 가나 사람 녹음: 받은 원본(WAV)을 mp3로 바꾸고 장부를 쓴다(26.11.28).

영신 "요음만 다른 화자껄로 쓰고 후쿠진주케 음성을 일단 쓰자 문제생기면 말할게"(26.11.28). 요음은 다른 화자 낱자 녹음이 없어(りゅ 하나뿐) TTS 그대로.
원본: Wikimedia Commons / Lingua Libre, 화자 Fukujinzuke, CC BY 4.0. 원본 WAV는 저장소에 넣지 않고 SHA-1만 장부에 남긴다.
쓰기: python3 pipeline/jlpt/kana-audio/convert.py <wav 폴더> <urls.json>
"""
import hashlib, json, subprocess, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT = ROOT / 'audio' / 'kana'
wav_dir, urls = Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text())
OUT.mkdir(parents=True, exist_ok=True)
manifest, sources = {}, {}
for kana, url, sha in urls:
    src = wav_dir / f'{kana}.wav'
    if not src.exists() or hashlib.sha1(src.read_bytes()).hexdigest() != sha:
        continue
    tmp = OUT / '_tmp.mp3'
    # 24kHz 모노 48kbps. 앞뒤 무음은 자르지 않는다(아이폰에서 첫소리가 먹히지 않게, 원본에 약 0.2초씩 있음).
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-ac', '1', '-ar', '24000', '-b:a', '48k', '-map_metadata', '-1', str(tmp)], check=True)
    data = tmp.read_bytes(); h8 = hashlib.sha256(data).hexdigest()[:8]
    name = f'{ord(kana):04x}-{h8}.mp3'
    for old in OUT.glob(f'{ord(kana):04x}-*.mp3'):
        if old.name != name: old.unlink()
    (OUT / name).write_bytes(data); tmp.unlink()
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(OUT / name)], capture_output=True, text=True).stdout.strip() or 0)
    manifest[kana] = {'src': f'audio/kana/{name}', 'duration': round(dur, 2)}
    sources[kana] = {'file': f'audio/kana/{name}', 'source': url.replace('https://upload.wikimedia.org/wikipedia/commons/', 'https://commons.wikimedia.org/wiki/File:').split('/')[-1] and 'https://commons.wikimedia.org/wiki/File:' + url.split('/')[-1],
                     'wav_sha1': sha, 'license': 'CC BY 4.0', 'author': 'Fukujinzuke (Lingua Libre)', 'speaker': '성별·지역·원어민 여부 밝히지 않음(26.11.28 확인)',
                     'converted': 'ffmpeg mp3 24kHz 모노 48kbps, 앞뒤 무음 그대로', 'listened': None}
(HERE / 'manifest.json').write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=1) + '\n')
(HERE / 'sources.json').write_text(json.dumps(dict(sorted(sources.items())), ensure_ascii=False, indent=1) + '\n')
print(len(manifest), '개', sum((ROOT / v['src']).stat().st_size for v in manifest.values()), '바이트')

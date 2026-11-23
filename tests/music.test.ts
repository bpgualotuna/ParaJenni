import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getMusicEmbed } from '../src/lib/music';

test('unconfigured and unsupported music never create an embed', () => {
  for (const value of ['', 'pendiente', 'javascript:alert(1)', 'http://youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ', 'https://evil.example/track/abc', 'https://open.spotify.com/track/invalid']) assert.equal(getMusicEmbed(value), null, value);
});

test('official YouTube links resolve to privacy enhanced embed with canonical original', () => {
  for (const url of ['https://youtu.be/dQw4w9WgXcQ?si=tracking', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=ignored', 'https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'https://music.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com/shorts/dQw4w9WgXcQ', 'https://youtube.com/embed/dQw4w9WgXcQ']) {
    assert.deepEqual(getMusicEmbed(url), { embed: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1', original: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', platform: 'YouTube' });
  }
});

test('Spotify track links strip tracking and optional locale path', () => {
  const id = '4cOdK2wGLETKBW3PvgPWqT';
  for (const url of [`https://open.spotify.com/track/${id}?si=tracking`, `https://open.spotify.com/intl-es/track/${id}`]) assert.deepEqual(getMusicEmbed(url), { embed: `https://open.spotify.com/embed/track/${id}`, original: `https://open.spotify.com/track/${id}`, platform: 'Spotify' });
});

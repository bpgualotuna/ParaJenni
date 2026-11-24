import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { photoDedications, voiceNoteConfig } from '../src/content/personal-touches';
import { getAlbum, getChapter, getUniverseState } from '../src/lib/server/content';
import { getVoiceNoteAsset } from '../src/lib/server/voice-note';
import { GET, HEAD } from '../src/app/api/voice-note/route';

async function recordingFixture(t: TestContext, extension = 'm4a') {
  const original = { ...voiceNoteConfig };
  const filename = `voice-test-${process.pid}.${extension}`;
  const filePath = path.join(process.cwd(), 'private-media', filename);
  const bytes = Buffer.from(Array.from({ length: 150_000 }, (_, index) => index % 256));
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, bytes);
  Object.assign(voiceNoteConfig, { filename, transcript: 'Texto de prueba; no es una nota personal.' });
  t.after(async () => { Object.assign(voiceNoteConfig, original); await unlink(filePath); });
  return bytes;
}

function privateHeaders(response: Response) {
  assert.match(response.headers.get('cache-control') ?? '', /private.*no-store/);
  assert.equal(response.headers.get('cdn-cache-control'), 'no-store');
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
}

test('no supplied recording means no voice player data, even on the birthday', (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T12:00:00-05:00'));
  assert.equal(voiceNoteConfig.filename, null);
  assert.equal(getChapter(5)?.voiceNote, undefined);
  assert.equal(getVoiceNoteAsset(), null);
});

test('a recording and its transcript stay private until birthday midnight, then only belong to chapter 5', async (t) => {
  await recordingFixture(t);
  const midnight = Date.parse('2026-11-27T00:00:00-05:00');
  let now = midnight - 1;
  t.mock.method(Date, 'now', () => now);
  assert.equal(getVoiceNoteAsset(), null);
  const denied = await GET(new Request('http://localhost/api/voice-note?DEV_NOW=2030-01-01', { headers: { cookie: 'unlocked=5', range: 'bytes=0-1' } }));
  assert.equal(denied.status, 404);
  privateHeaders(denied);
  assert.equal((await denied.text()).includes(voiceNoteConfig.transcript!), false);
  now = midnight;
  assert.deepEqual(getChapter(5)?.voiceNote, { src: '/api/voice-note', mimeType: 'audio/mp4', transcript: voiceNoteConfig.transcript });
  for (let id = 1; id <= 4; id++) {
    assert.equal(getChapter(id)?.voiceNote, undefined);
    assert.equal(JSON.stringify(getChapter(id)).includes(voiceNoteConfig.transcript!), false);
  }
  assert.equal(JSON.stringify(getUniverseState()).includes(voiceNoteConfig.transcript!), false);
});

test('missing, unsupported and path-like configured recordings produce a quiet 404', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T12:00:00-05:00'));
  const original = { ...voiceNoteConfig };
  t.after(() => Object.assign(voiceNoteConfig, original));
  for (const filename of [null, 'missing-recording.m4a', '../package.json', '..\\recording.mp3', '/tmp/voice.mp3', 'C:\\voice.mp3', 'audio.svg', '']) {
    voiceNoteConfig.filename = filename;
    assert.equal(getVoiceNoteAsset(), null, String(filename));
    assert.equal(getChapter(5)?.voiceNote, undefined);
    const response = await GET(new Request('http://localhost/api/voice-note?filename=welcome.webp'));
    assert.equal(response.status, 404);
    privateHeaders(response);
    assert.equal((await response.text()).includes('private-media'), false);
  }
});

test('all supported recording extensions select an audio MIME type and never expose the filename', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T12:00:00-05:00'));
  for (const [extension, mimeType] of [['m4a', 'audio/mp4'], ['mp3', 'audio/mpeg'], ['ogg', 'audio/ogg'], ['webm', 'audio/webm'], ['wav', 'audio/wav']] as const) {
    await t.test(extension, async (child) => {
      await recordingFixture(child, extension);
      const note = getChapter(5)?.voiceNote;
      assert.equal(note?.mimeType, mimeType);
      assert.equal(note?.src, '/api/voice-note');
      assert.equal(JSON.stringify(note).includes(voiceNoteConfig.filename!), false);
      const response = await HEAD(new Request('http://localhost/api/voice-note', { method: 'HEAD' }));
      assert.equal(response.headers.get('content-type'), mimeType);
      assert.equal(response.status, 200);
      privateHeaders(response);
    });
  }
});

test('authorized audio supports full response, HEAD and bounded byte ranges for seeking', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T12:00:00-05:00'));
  const bytes = await recordingFixture(t);
  const full = await GET(new Request('http://localhost/api/voice-note'));
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('content-type'), 'audio/mp4');
  assert.equal(full.headers.get('accept-ranges'), 'bytes');
  assert.equal(full.headers.get('content-length'), String(bytes.length));
  privateHeaders(full);
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), bytes);
  const head = await HEAD(new Request('http://localhost/api/voice-note', { method: 'HEAD' }));
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), String(bytes.length));
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  for (const [header, start, end] of [
    ['bytes=0-1', 0, 1], ['bytes=65530-65550', 65530, 65550],
    ['bytes=149990-', 149990, bytes.length - 1], ['bytes=-5', bytes.length - 5, bytes.length - 1],
    ['bytes=149995-999999', 149995, bytes.length - 1],
  ] as const) {
    const response = await GET(new Request('http://localhost/api/voice-note', { headers: { range: header } }));
    assert.equal(response.status, 206, header);
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${bytes.length}`);
    assert.equal(response.headers.get('content-length'), String(end - start + 1));
    privateHeaders(response);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(start, end + 1));
  }
});

test('malformed or unsatisfiable ranges return private 416 responses without serving audio', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T12:00:00-05:00'));
  const bytes = await recordingFixture(t);
  for (const range of ['bytes=', 'bytes=-', 'bytes=-0', 'bytes=10-9', 'bytes=150000-', 'bytes=0-1,4-5', 'items=0-1', 'bytes=99999999999999999999-', 'bytes=0-1junk']) {
    const response = await GET(new Request('http://localhost/api/voice-note', { headers: { range } }));
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('content-range'), `bytes */${bytes.length}`);
    assert.equal((await response.arrayBuffer()).byteLength, 0);
    privateHeaders(response);
  }
});

test('production ignores DEV_NOW and browser spoofing for voice authorization', async (t) => {
  await recordingFixture(t, 'mp3');
  const oldEnv = process.env.NODE_ENV;
  const oldDate = process.env.DEV_NOW;
  Object.assign(process.env, { NODE_ENV: 'production', DEV_NOW: '2030-01-01T00:00:00Z' });
  t.after(() => {
    if (oldEnv === undefined) Reflect.deleteProperty(process.env, 'NODE_ENV'); else Object.assign(process.env, { NODE_ENV: oldEnv });
    if (oldDate === undefined) delete process.env.DEV_NOW; else process.env.DEV_NOW = oldDate;
  });
  t.mock.method(Date, 'now', () => Date.parse('2026-11-24T12:00:00-05:00'));
  assert.equal(getChapter(5), null);
  const response = await GET(new Request('http://localhost/api/voice-note?date=2030-01-01&filename=voice.mp3', { headers: { cookie: 'DEV_NOW=2030-01-01; unlocked=5', 'x-client-time': '2030-01-01', range: 'bytes=0-1' } }));
  assert.equal(response.status, 404);
  privateHeaders(response);
});

test('dedications override only authorized existing photos and blank values retain original captions', (t) => {
  const original = { ...photoDedications };
  t.after(() => { for (const key of Object.keys(photoDedications)) delete photoDedications[key]; Object.assign(photoDedications, original); });
  Object.assign(photoDedications, { 'memory-01': 'Dedicatoria de prueba.', 'memory-02': '  ', 'memory-03': null, 'unknown-id': 'No debe aparecer.' });
  let now = Date.parse('2026-11-24T23:59:59.999-05:00');
  t.mock.method(Date, 'now', () => now);
  assert.equal(getAlbum(), null);
  assert.equal(getChapter(3), null);
  assert.equal(JSON.stringify(getChapter(2)).includes('Dedicatoria de prueba.'), false);
  now++;
  const album = getAlbum()!;
  assert.equal(album.find((photo) => photo.id === 'memory-01')?.caption, 'Dedicatoria de prueba.');
  assert.notEqual(album.find((photo) => photo.id === 'memory-02')?.caption, '  ');
  assert.ok(album.find((photo) => photo.id === 'memory-03')?.caption);
  assert.equal(album.some((photo) => photo.id === 'unknown-id'), false);
  assert.deepEqual(getChapter(3)?.photos, album);
});

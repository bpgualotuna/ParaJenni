import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { birthdayCopy, chapters } from '../src/content/chapters';
import { photoManifest } from '../src/content/photo-manifest';
import { getServerNow, isUnlocked } from '../src/lib/server/clock';
import { getAlbum, getChapter, getPhotoAsset, getUniverseState } from '../src/lib/server/content';
import { GET as chapterGET } from '../src/app/api/chapters/[id]/route';
import { GET as photoGET } from '../src/app/api/photos/[id]/route';
import { GET as universeGET } from '../src/app/api/universe/route';
import { GET as albumGET } from '../src/app/api/album/route';

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
}

test('all five Ecuador midnights: locked one millisecond before, available at and after', () => {
  for (const chapter of chapters) {
    const midnight = Date.parse(chapter.unlockAt);
    assert.equal(new Date(midnight).getUTCHours(), 5);
    assert.equal(isUnlocked(chapter.unlockAt, midnight - 1), false, chapter.date);
    assert.equal(isUnlocked(chapter.unlockAt, midnight), true, chapter.date);
    assert.equal(isUnlocked(chapter.unlockAt, midnight + 1), true, chapter.date);
  }
});

test('invalid unlock dates fail closed', () => {
  assert.equal(isUnlocked('not a date', Date.now()), false);
});

test('each day reveals exactly its chapter count and keeps previous chapters available', (t) => {
  const env = process.env.NODE_ENV;
  Object.assign(process.env, { NODE_ENV: 'test' });
  t.after(() => { restoreEnv('NODE_ENV', env); });
  for (let day = 0; day <= 5; day++) {
    const clock = t.mock.method(Date, 'now', () => Date.parse(`2026-11-${22 + day}T12:00:00-05:00`));
    const state = getUniverseState();
    assert.equal(state.chapters.filter((chapter) => chapter.available).length, day);
    for (let id = 1; id <= 5; id++) assert.equal(!!getChapter(id), id <= day);
    assert.equal(!!getAlbum(), day >= 3);
    assert.equal(!!getPhotoAsset('birthday'), day === 5);
    clock.mock.restore();
  }
});

test('all chapters remain available long after the birthday', (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2030-01-01T00:00:00Z'));
  assert.equal(getUniverseState().nextUnlockAt, null);
  assert.equal(getUniverseState().chapters.every((chapter) => chapter.available), true);
});

test('universe serialization contains metadata only, no letters, songs, photo paths or gift message', (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-23T12:00:00-05:00'));
  const state = getUniverseState();
  const serialized = JSON.stringify(state);
  assert.equal(serialized.includes('letter'), false);
  assert.equal(serialized.includes('photoIds'), false);
  assert.equal(serialized.includes('giftMessage'), false);
  assert.equal(serialized.includes('birthdayCopy'), false);
  assert.equal(serialized.includes(birthdayCopy.couponTitle), false);
  for (const chapter of chapters) {
    const marker = chapter.letter.split(/\n\s*\n/).find((paragraph) => paragraph.length >= 80)!;
    assert.equal(serialized.includes(marker.slice(0, 80)), false);
  }
  assert.equal(getChapter(2), null);
  assert.equal(getChapter(1)?.giftMessage, undefined);
  assert.equal(getChapter(1)?.birthdayCopy, undefined);
  assert.equal(JSON.stringify(getChapter(1)).includes(birthdayCopy.couponTitle), false);
});

test('birthday, puzzle and coupon narrative are returned only with the unlocked final chapter', (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-27T00:00:00-05:00'));
  const finalChapter = getChapter(5);
  assert.deepEqual(finalChapter?.birthdayCopy, birthdayCopy);
  for (let id = 1; id < 5; id++) {
    assert.equal(getChapter(id)?.birthdayCopy, undefined);
    assert.equal(JSON.stringify(getChapter(id)).includes(birthdayCopy.couponDescription), false);
  }
});

test('future APIs refuse spoofed client dates, query parameters and cookies without leaking content', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-23T12:00:00-05:00'));
  const request = new Request('http://localhost/api/chapters/5?date=2030-01-01&DEV_NOW=2030-01-01T00:00:00Z', {
    headers: { cookie: 'DEV_NOW=2030-01-01T00:00:00Z; unlocked=5', 'x-client-time': '2030-01-01T00:00:00Z' },
  });
  const response = await chapterGET(request, { params: Promise.resolve({ id: '5' }) });
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.equal(body.includes(chapters[4].letter.split(/\n\s*\n/).find((paragraph) => paragraph.length >= 80)!.slice(0, 80)), false);
  assert.match(response.headers.get('cache-control') ?? '', /private.*no-store/);
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
});

test('photo allowlist denies future photos, path traversal and unknown IDs', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-23T12:00:00-05:00'));
  assert.ok(getPhotoAsset('welcome'));
  assert.ok(getPhotoAsset('first-moments'));
  for (const id of ['birthday', 'gift', 'memory-01', '../package.json', '%2e%2e', 'first-moments.webp', 'unknown']) {
    assert.equal(getPhotoAsset(id), null, id);
    const response = await photoGET(new Request('http://localhost/api/photos/' + encodeURIComponent(id)), { params: Promise.resolve({ id }) });
    assert.equal(response.status, 404);
    assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  }
});

test('album is inaccessible before Wednesday and dynamic APIs prohibit caching', (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-24T23:59:59.999-05:00'));
  assert.equal(albumGET().status, 404);
  for (const response of [albumGET(), universeGET()]) {
    assert.match(response.headers.get('cache-control') ?? '', /private.*no-store/);
    assert.equal(response.headers.get('cdn-cache-control'), 'no-store');
  }
});

test('production and test ignore DEV_NOW even when an environment override is present', (t) => {
  const oldEnv = process.env.NODE_ENV;
  const oldDate = process.env.DEV_NOW;
  const real = Date.parse('2026-11-22T00:00:00-05:00');
  t.mock.method(Date, 'now', () => real);
  t.after(() => {
    restoreEnv('NODE_ENV', oldEnv);
    if (oldDate === undefined) delete process.env.DEV_NOW; else process.env.DEV_NOW = oldDate;
  });
  for (const env of ['production', 'test']) {
    Object.assign(process.env, { NODE_ENV: env, DEV_NOW: '2030-01-01T00:00:00Z' });
    assert.equal(getServerNow(), real);
    assert.equal(getChapter(5), null);
    assert.equal(getUniverseState().devMode, false);
  }
});

test('development date override rejects timezone-ambiguous and invalid dates', (t) => {
  const oldEnv = process.env.NODE_ENV;
  const oldDate = process.env.DEV_NOW;
  t.after(() => {
    restoreEnv('NODE_ENV', oldEnv);
    if (oldDate === undefined) delete process.env.DEV_NOW; else process.env.DEV_NOW = oldDate;
  });
  Object.assign(process.env, { NODE_ENV: 'development', DEV_NOW: '2026-11-27T12:00:00' });
  assert.throws(getServerNow, /zona horaria/);
  process.env.DEV_NOW = 'badZ';
  assert.throws(getServerNow, /inválida/);
});

test('chapter API validates IDs strictly, without numeric coercion', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2030-01-01T00:00:00Z'));
  for (const id of ['0', '6', '1.0', '01', '1foo', '-1', '../1']) {
    const response = await chapterGET(new Request('http://localhost/api/chapters/' + encodeURIComponent(id)), { params: Promise.resolve({ id }) });
    assert.equal(response.status, 404);
  }
});

test('a missing configured photograph returns a neutral 404 without filesystem details', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-23T12:00:00-05:00'));
  const photo = photoManifest.find((item) => item.id === 'first-moments')!;
  const originalFile = photo.file;
  photo.file = '__intentionally_missing_photo__.webp';
  t.after(() => { photo.file = originalFile; });
  const response = await photoGET(new Request('http://localhost/api/photos/first-moments'), { params: Promise.resolve({ id: 'first-moments' }) });
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.equal(body.includes('private-media'), false);
  assert.equal(body.includes('__intentionally_missing'), false);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
});

test('authorized image delivery resizes a real image, strips metadata and stays private', async (t) => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-23T12:00:00-05:00'));
  const photo = photoManifest.find((item) => item.id === 'first-moments')!;
  const originalFile = photo.file;
  photo.file = `__image_test_${process.pid}.webp`;
  const filename = path.join(process.cwd(), 'private-media', photo.file);
  await mkdir(path.dirname(filename), { recursive: true });
  const image = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#D990BD' } }).webp().toBuffer();
  await writeFile(filename, image);
  t.after(async () => { photo.file = originalFile; await unlink(filename); });
  const response = await photoGET(new Request('http://localhost/api/photos/first-moments?w=640'), { params: Promise.resolve({ id: 'first-moments' }) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/webp');
  assert.match(response.headers.get('cache-control') ?? '', /private.*no-store/);
  const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
  assert.equal(metadata.width, 640);
  assert.equal(metadata.height, 427);
  assert.equal(metadata.exif, undefined);
});

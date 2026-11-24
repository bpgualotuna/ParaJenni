import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.argv[2] || 'http://localhost:3000';
const source = await readFile(new URL('../src/content/chapters.ts', import.meta.url), 'utf8');
const letters = [...source.matchAll(/"letter": ("(?:[^"\\]|\\.)*")/g)].map((match) => JSON.parse(match[1]));
const giftMatch = source.match(/export const giftMessage = ("(?:[^"\\]|\\.)*");/);
const gift = giftMatch ? JSON.parse(giftMatch[1]) : '';
const birthdayMatch = source.match(/export const birthdayCopy: BirthdayCopy = (\{[\s\S]*?\});/);
const birthdayCopy = birthdayMatch ? JSON.parse(birthdayMatch[1]) : null;
const surpriseMarkers = birthdayCopy ? [birthdayCopy.prelude, birthdayCopy.wish, birthdayCopy.invitationDescription, birthdayCopy.puzzleTitle, birthdayCopy.couponTitle, birthdayCopy.couponDescription, birthdayCopy.couponDedication, birthdayCopy.giftFooter, birthdayCopy.puzzleComplete, birthdayCopy.puzzleOpened, birthdayCopy.keyInvitation] : [];
let checked = 0;
let voiceNote = null;

async function check(url, status, { privateCache = true, inspectText = true, requestHeaders = {} } = {}) {
  const response = await fetch(new URL(url, base), { headers: { cookie: 'DEV_NOW=2030-01-01T00:00:00Z; unlocked=5', 'x-client-time': '2030-01-01T00:00:00Z', ...requestHeaders } });
  assert.equal(response.status, status, url);
  if (privateCache) assert.match(response.headers.get('cache-control') ?? '', /no-store/, url);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (inspectText) {
    const body = bytes.toString('utf8');
    for (const chapter of state.chapters.filter((chapter) => !chapter.available)) {
      const marker = letters[chapter.id - 1].split(/\n\s*\n/).find((paragraph) => paragraph.length >= 80).slice(0, 80);
      assert.equal(body.includes(marker), false, `Future letter leaked: ${url}`);
    }
    if (!state.chapters[4].available) {
      const giftMarker = gift.split(/\n\s*\n/).find((paragraph) => paragraph.length >= 80).slice(0, 80);
      assert.equal(body.includes(giftMarker), false, `Future gift leaked: ${url}`);
      for (const marker of surpriseMarkers) assert.equal(body.includes(marker), false, `Future birthday narrative leaked: ${url}`);
    }
  }
  checked++;
  console.log(`PASS ${response.status} ${url}`);
  return { response, bytes };
}

const snapshot = await fetch(new URL('/api/universe?DEV_NOW=2030-01-01T00:00:00Z', base));
assert.equal(snapshot.status, 200);
assert.match(snapshot.headers.get('cache-control') ?? '', /no-store/);
const state = await snapshot.json();
console.log(`Server time: ${state.serverNow}; available chapters: ${state.chapters.filter((chapter) => chapter.available).length}`);
assert.equal(state.chapters.length, 5);
assert.equal(JSON.stringify(state).includes('letter'), false);
assert.equal(JSON.stringify(state).includes('giftMessage'), false);

await check('/', 200);
for (const chapter of state.chapters) {
  const expected = chapter.available ? 200 : 404;
  const api = await check(`/api/chapters/${chapter.id}?date=2030-01-01`, expected);
  if (chapter.id === 5 && chapter.available) voiceNote = JSON.parse(api.bytes.toString('utf8')).voiceNote ?? null;
  const page = await check(`/capitulo/${chapter.id}?date=2030-01-01`, 200);
  if (!chapter.available) assert.ok(page.bytes.toString('utf8').includes('Esta estrella está guardando su sorpresa'));
}
await check('/api/album', state.chapters[2].available ? 200 : 404);
const albumPage = await check('/album', 200);
if (!state.chapters[2].available) assert.ok(albumPage.bytes.toString('utf8').includes('Nuestro álbum está guardando sus recuerdos'));
await check('/api/photos/birthday?w=640', state.chapters[4].available ? 200 : 404, { inspectText: !state.chapters[4].available });
await check('/api/photos/memory-01?w=640', state.chapters[2].available ? 200 : 404, { inspectText: !state.chapters[2].available });
await check('/api/photos/unknown', 404);
await check('/api/photos/%2e%2e%2fpackage.json', 404);
await check('/_next/image?url=%2Fapi%2Fphotos%2Fbirthday&w=640&q=75', 404, { privateCache: false });
await check('/private-media/birthday.webp', 404, { privateCache: false });
await check('/Imagenes/20251127_102031.jpg', 404, { privateCache: false });
await check('/api/voice-note?filename=birthday-message.m4a&date=2030-01-01', voiceNote ? 206 : 404, { inspectText: !voiceNote, requestHeaders: { range: 'bytes=0-1' } });
const welcome = await check('/api/photos/welcome?w=320', 200, { inspectText: false });
assert.equal(welcome.response.headers.get('content-type'), 'image/webp');
const metadata = await sharp(welcome.bytes).metadata();
assert.ok(metadata.width <= 320);
assert.equal(metadata.exif, undefined);
console.log(`${checked + 1} HTTP privacy checks passed. No future letters or gift text in inspected responses.`);

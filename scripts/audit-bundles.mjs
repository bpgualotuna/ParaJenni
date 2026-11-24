import assert from 'node:assert/strict';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = await readFile(path.join(root, 'src/content/chapters.ts'), 'utf8');
const letters = [...source.matchAll(/"letter": ("(?:[^"\\]|\\.)*")/g)].map((match) => JSON.parse(match[1]));
const gift = JSON.parse(source.match(/export const giftMessage = ("(?:[^"\\]|\\.)*");/)[1]);
const copy = JSON.parse(source.match(/export const birthdayCopy: BirthdayCopy = (\{[\s\S]*?\});/)[1]);
const markers = [...letters, gift].flatMap((letter) => letter.split(/\n\s*\n/).filter((paragraph) => paragraph.length >= 80).map((paragraph) => paragraph.slice(0, 80)));
markers.push(...Object.entries(copy).filter(([key, value]) => key !== 'name' && typeof value === 'string').map(([, value]) => value));
markers.push(JSON.stringify(copy.words));

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const lists = await Promise.all(entries.map((entry) => entry.isDirectory() ? filesIn(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return lists.flat();
}

const scripts = (await filesIn(path.join(root, '.next/static'))).filter((filename) => filename.endsWith('.js'));
assert.ok(scripts.length > 0, 'Build production before auditing public bundles.');
for (const filename of scripts) {
  const script = await readFile(filename, 'utf8');
  for (const marker of markers) {
    const encoded = JSON.stringify(marker).slice(1, -1);
    assert.equal(script.includes(marker) || script.includes(encoded), false, `Protected narrative found in ${path.relative(root, filename)}`);
  }
}
console.log(`PASS: ${scripts.length} production public JavaScript files contain no private letters, gift message, birthday, puzzle or coupon narrative.`);

const tracePath = path.join(root, '.next/server/app/api/photos/[id]/route.js.nft.json');
const trace = JSON.parse(await readFile(tracePath, 'utf8'));
const media = trace.files.filter((filename) => filename.includes('private-media') && filename.endsWith('.webp'));
const expected = (await readdir(path.join(root, 'private-media'))).filter((filename) => filename.endsWith('.webp'));
assert.equal(media.length, expected.length, 'Every private photo must be included in the server function trace.');
for (const filename of expected) assert.ok(media.some((entry) => entry.endsWith(`/${filename}`) || entry.endsWith(`\\${filename}`)), filename);
console.log(`PASS: all ${expected.length} private WebP photos are traced into the server photo function for deployment.`);

const personalSource = await readFile(path.join(root, 'src/content/personal-touches.ts'), 'utf8');
const filenameMatch = personalSource.match(/\bfilename:\s*(?:'([^']*)'|"([^"]*)"|(null))/);
const voiceFilename = filenameMatch?.[1] ?? filenameMatch?.[2] ?? null;
if (voiceFilename && /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(voiceFilename) && /\.(m4a|mp3|ogg|webm|wav)$/i.test(voiceFilename)) {
  const recording = await lstat(path.join(root, 'private-media', voiceFilename)).catch(() => null);
  if (recording?.isFile() && recording.size > 0) {
    const voiceTracePath = path.join(root, '.next/server/app/api/voice-note/route.js.nft.json');
    const voiceTrace = JSON.parse(await readFile(voiceTracePath, 'utf8'));
    assert.ok(voiceTrace.files.some((entry) => entry.endsWith(`/${voiceFilename}`) || entry.endsWith(`\\${voiceFilename}`)), 'Configured voice note must be included in the voice function trace.');
    console.log('PASS: the configured private recording is traced into the voice function for deployment.');
  }
}

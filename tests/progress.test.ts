import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dailyProgressKey, normalizeDailyProgress, parseDailyProgress, readDailyProgress, writeDailyProgress, type ProgressStorage } from '../src/lib/progress';

test('local daily progress rejects malformed, out-of-range and future-version values', () => {
  for (const raw of [null, '', '{broken', 'true', '123', '"[0]"', '{"revealed":"0"}', '{"version":2,"revealed":[0]}']) assert.deepEqual(parseDailyProgress(raw, 5), { revealed: [], chosenWish: null });
  assert.deepEqual(normalizeDailyProgress({ revealed: [4, 0, 4, -1, 5, 1.5, '2', null, 2], chosenWish: 4 }, 5), { revealed: [4, 0, 2], chosenWish: null });
});

test('legacy arrays preserve discovered hearts without changing existing universe preference keys', () => {
  assert.deepEqual(parseDailyProgress('[3,0,1,3]', 5), { revealed: [3, 0, 1], chosenWish: null });
  assert.equal(dailyProgressKey(2), 'universe-daily-2');
  assert.equal(dailyProgressKey(4), 'universe-daily-4');
  for (const invalid of [0, 6, 1.5, NaN]) assert.throws(() => dailyProgressKey(invalid), RangeError);
});

test('a chosen wish requires all messages, remains changeable and survives a fresh storage read', () => {
  const entries = new Map<string, string>([['universe-visited', '[1,2]'], ['universe-welcome', 'yes']]);
  const storage: ProgressStorage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => { entries.set(key, value); } };
  assert.deepEqual(normalizeDailyProgress({ revealed: [0, 1], chosenWish: 1 }, 5), { revealed: [0, 1], chosenWish: null });
  const completed = { revealed: [0, 1, 2, 3, 4], chosenWish: 2 };
  assert.equal(writeDailyProgress(storage, 4, completed, 5), true);
  assert.deepEqual(readDailyProgress(storage, 4, 5), completed);
  assert.equal(writeDailyProgress(storage, 4, { ...completed, chosenWish: 4 }, 5), true);
  assert.equal(readDailyProgress(storage, 4, 5).chosenWish, 4);
  assert.deepEqual(readDailyProgress(storage, 2, 5), { revealed: [], chosenWish: null });
  assert.equal(entries.get('universe-visited'), '[1,2]');
  assert.equal(entries.get('universe-welcome'), 'yes');
});

test('denied browser storage is a safe session fallback and never throws', () => {
  const denied: ProgressStorage = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); } };
  assert.deepEqual(readDailyProgress(denied, 2, 5), { revealed: [], chosenWish: null });
  assert.equal(writeDailyProgress(denied, 4, { revealed: [0], chosenWish: null }, 5), false);
  assert.equal(writeDailyProgress(null, 2, { revealed: [0], chosenWish: null }, 5), false);
  assert.deepEqual(normalizeDailyProgress({ revealed: [0], chosenWish: 0 }, 0), { revealed: [], chosenWish: null });
});

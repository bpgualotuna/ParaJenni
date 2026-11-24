/** Local souvenirs only. These values never authorize a chapter, photograph or API request. */
export interface DailyProgress { revealed: number[]; chosenWish: number | null }
export interface ProgressStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }

export function dailyProgressKey(chapterId: number): string {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 5) throw new RangeError('Invalid chapter progress ID');
  return `universe-daily-${chapterId}`;
}

export function normalizeDailyProgress(value: unknown, messageCount: number): DailyProgress {
  const count = Number.isSafeInteger(messageCount) && messageCount > 0 ? messageCount : 0;
  const empty: DailyProgress = { revealed: [], chosenWish: null };
  if (!value || typeof value !== 'object') return empty;
  // Arrays are accepted for early local-only versions that stored revealed indices alone.
  const record = Array.isArray(value) ? { revealed: value, chosenWish: null } : value as Record<string, unknown>;
  if ('version' in record && record.version !== 1) return empty;
  if (!Array.isArray(record.revealed)) return empty;
  const revealed = [...new Set(record.revealed.filter((index): index is number => typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < count))];
  const choice = record.chosenWish;
  const chosenWish = revealed.length === count && typeof choice === 'number' && Number.isInteger(choice) && revealed.includes(choice) ? choice : null;
  return { revealed, chosenWish };
}

export function parseDailyProgress(raw: string | null, messageCount: number): DailyProgress {
  try { return normalizeDailyProgress(raw ? JSON.parse(raw) : null, messageCount); }
  catch { return { revealed: [], chosenWish: null }; }
}

export function readDailyProgress(storage: Pick<ProgressStorage, 'getItem'> | null, chapterId: number, messageCount: number): DailyProgress {
  try { return parseDailyProgress(storage?.getItem(dailyProgressKey(chapterId)) ?? null, messageCount); }
  catch { return { revealed: [], chosenWish: null }; }
}

/** False means storage is unavailable; the caller keeps session state instead. */
export function writeDailyProgress(storage: Pick<ProgressStorage, 'setItem'> | null, chapterId: number, value: DailyProgress, messageCount: number): boolean {
  try {
    if (!storage) return false;
    storage.setItem(dailyProgressKey(chapterId), JSON.stringify({ version: 1, ...normalizeDailyProgress(value, messageCount) }));
    return true;
  } catch { return false; }
}

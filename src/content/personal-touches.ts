import 'server-only';

/** Leave null until a real recording is supplied. Never synthesize a personal voice. */
export const voiceNoteConfig: { filename: string | null; transcript: string | null } = {
  filename: null,
  transcript: null,
};

/** Optional real dedications by existing photo ID. Null or blank keeps the original caption. */
export const photoDedications: Record<string, string | null> = {
  'memory-01': null,
  'memory-02': null,
  'memory-03': null,
  'memory-04': null,
  'memory-05': null,
  'memory-06': null,
};

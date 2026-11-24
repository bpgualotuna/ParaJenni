import 'server-only';
import { lstatSync } from 'node:fs';
import path from 'node:path';
import { chapters } from '@/content/chapters';
import { voiceNoteConfig } from '@/content/personal-touches';
import type { VoiceNote } from '@/lib/types';
import { isUnlocked } from './clock';

const MIME_TYPES: Record<string, string> = {
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.webm': 'audio/webm',
  '.wav': 'audio/wav',
};

export interface VoiceNoteAsset { filePath: string; mimeType: string; note: VoiceNote }

/** The request never supplies a filename. One configured basename is the entire allowlist. */
export function getVoiceNoteAsset(): VoiceNoteAsset | null {
  const finalChapter = chapters.find((chapter) => chapter.id === 5);
  if (!finalChapter || !isUnlocked(finalChapter.unlockAt)) return null;
  const filename = voiceNoteConfig.filename;
  if (!filename || filename.length > 128 || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(filename)) return null;
  const mimeType = MIME_TYPES[path.extname(filename).toLowerCase()];
  if (!mimeType) return null;
  const filePath = path.join(process.cwd(), 'private-media', filename);
  try {
    const file = lstatSync(filePath);
    if (!file.isFile() || file.size === 0) return null;
  } catch { return null; }
  return {
    filePath,
    mimeType,
    note: { src: '/api/voice-note', mimeType, transcript: voiceNoteConfig.transcript?.trim() || null },
  };
}

export interface AudioByteRange { start: number; end: number }

/** A single byte range is enough for browser audio seeking; reject multipart requests. */
export function parseAudioRange(header: string | null, size: number): AudioByteRange | null | 'invalid' {
  if (header === null) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return 'invalid';
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return 'invalid';
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }
  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= size || requestedEnd < start) return 'invalid';
  return { start, end: Math.min(requestedEnd, size - 1) };
}

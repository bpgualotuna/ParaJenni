import 'server-only';
import path from 'node:path';
import { birthdayCopy, chapters, giftMessage } from '@/content/chapters';
import { photoManifest as photos, type PrivatePhoto } from '@/content/photo-manifest';
import { photoDedications } from '@/content/personal-touches';
import type { ChapterContent, ChapterSummary, Photo, UniverseState } from '@/lib/types';
import { getServerNow, isUnlocked } from './clock';
import { getVoiceNoteAsset } from './voice-note';

function summary(chapter: (typeof chapters)[number], now: number): ChapterSummary {
  return {
    id: chapter.id, date: chapter.date, unlockAt: chapter.unlockAt,
    title: chapter.title, starName: chapter.starName,
    available: isUnlocked(chapter.unlockAt, now),
  };
}

function photoView(photo: PrivatePhoto): Photo {
  const caption = photoDedications[photo.id]?.trim() || photo.caption;
  return { id: photo.id, src: `/api/photos/${photo.id}`, alt: photo.alt, caption };
}

function photoUnlocked(photo: PrivatePhoto, now: number): boolean {
  if (photo.chapter === 0) return true;
  const chapter = chapters.find((item) => item.id === photo.chapter);
  return !!chapter && isUnlocked(chapter.unlockAt, now);
}

export function getUniverseState(): UniverseState {
  const now = getServerNow();
  return {
    chapters: chapters.map((chapter) => summary(chapter, now)),
    serverNow: new Date(now).toISOString(),
    nextUnlockAt: chapters.find((chapter) => !isUnlocked(chapter.unlockAt, now))?.unlockAt ?? null,
    devMode: process.env.NODE_ENV === 'development' && !!process.env.DEV_NOW,
  };
}

export function getChapter(id: number): ChapterContent | null {
  const chapter = chapters.find((item) => item.id === id);
  const now = getServerNow();
  if (!chapter || !isUnlocked(chapter.unlockAt, now)) return null;
  const voiceNote = chapter.id === 5 ? getVoiceNoteAsset()?.note : undefined;
  return {
    ...summary(chapter, now), introduction: chapter.introduction,
    letter: chapter.letter, song: { ...chapter.song },
    photos: chapter.photoIds.flatMap((photoId) => {
      const photo = photos.find((item) => item.id === photoId);
      return photo && photoUnlocked(photo, now) ? [photoView(photo)] : [];
    }),
    interaction: { ...chapter.interaction, messages: [...chapter.interaction.messages] },
    ...(chapter.id === 5 ? { giftMessage, birthdayCopy: { ...birthdayCopy, words: [...birthdayCopy.words] } } : {}),
    ...(voiceNote ? { voiceNote } : {}),
  };
}

export function getAlbum(): Photo[] | null {
  const now = getServerNow();
  const albumChapter = chapters.find((chapter) => chapter.id === 3);
  if (!albumChapter || !isUnlocked(albumChapter.unlockAt, now)) return null;
  return photos.filter((photo) => photo.id.startsWith('memory-') && photoUnlocked(photo, now)).map(photoView);
}

export function getPhotoAsset(id: string): { filePath: string; mimeType: string } | null {
  const photo = photos.find((item) => item.id === id);
  if (!photo || !photoUnlocked(photo, getServerNow())) return null;
  return { filePath: path.join(process.cwd(), 'private-media', photo.file), mimeType: 'image/webp' };
}

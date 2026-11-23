export type InteractionType = 'envelope' | 'hearts' | 'memories' | 'wishes' | 'birthday';
export interface ChapterSummary {
  id: number;
  date: string;
  unlockAt: string;
  title: string;
  starName: string;
  available: boolean;
}
export interface Photo { id: string; src: string; alt: string; caption: string }
export interface Song { title: string; artist: string; url: string }
export interface BirthdayCopy {
  prelude: string;
  heading: string;
  name: string;
  wish: string;
  invitationTitle: string;
  invitationDescription: string;
  puzzleTitle: string;
  puzzleDescription: string;
  words: string[];
  couponTitle: string;
  couponDescription: string;
  couponDedication: string;
  giftFooter: string;
  puzzleComplete: string;
  puzzleOpened: string;
  keyInvitation: string;
  keyOpening: string;
}
export interface ChapterContent extends ChapterSummary {
  introduction: string;
  letter: string;
  song: Song;
  photos: Photo[];
  interaction: { type: InteractionType; messages: string[] };
  giftMessage?: string;
  birthdayCopy?: BirthdayCopy;
}
export interface UniverseState {
  chapters: ChapterSummary[];
  serverNow: string;
  nextUnlockAt: string | null;
  devMode: boolean;
}

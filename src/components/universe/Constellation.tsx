'use client';
import Link from 'next/link';
import { Check, LockKeyhole } from 'lucide-react';
import type { ChapterSummary } from '@/lib/types';
import { StarGlyph } from './Atmosphere';
const shortNames = ['El comienzo', 'Tu sonrisa', 'Los recuerdos', 'Nuestros sueños', 'Tu cumpleaños'];

export function Constellation({ chapters, visited }: { chapters: ChapterSummary[]; visited: number[] }) {
  return <div className="constellation" aria-label="Las cinco estrellas de nuestra historia"><svg className="constellation-lines" viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true"><path d="M105 204 300 84 492 184 692 64 897 164" /><path className="constellation-faint-line" d="M105 204 492 184 897 164" /></svg><svg className="constellation-lines-mobile" viewBox="0 0 340 720" preserveAspectRatio="none" aria-hidden="true"><path d="M80 65 258 203 85 350 258 490 100 642" /></svg>{chapters.map((chapter, i) => <ChapterStar key={chapter.id} chapter={chapter} index={i} visited={visited.includes(chapter.id)} />)}<span className="constellation-whisper">Cada estrella guarda un pedacito de nosotros.</span></div>;
}
export function ChapterStar({ chapter, index, visited }: { chapter: ChapterSummary; index: number; visited: boolean }) {
  const className = `chapter-star star-${index + 1} ${chapter.available ? 'is-available' : 'is-locked'} ${visited ? 'is-visited' : ''}`;
  const contents = <><div className="star-light"><span className="star-orbit" /><StarGlyph /><span className="star-state">{!chapter.available ? <LockKeyhole size={12} /> : visited ? <Check size={12} /> : null}</span></div><div className="star-caption"><span className="star-date">{23 + index} NOV</span><strong>{shortNames[index]}</strong><span className="star-status">{chapter.available ? visited ? 'Volver a este recuerdo' : 'Descubre tu estrella' : 'Un poquito de paciencia'}</span></div></>;
  return chapter.available ? <Link className={className} href={`/capitulo/${chapter.id}`} aria-label={`${chapter.starName}: ${chapter.title}. ${visited ? 'Visitada' : 'Disponible'}`}>{contents}</Link> : <div className={className} aria-label={`${chapter.starName}, bloqueada hasta el ${23 + index} de noviembre`}>{contents}</div>;
}

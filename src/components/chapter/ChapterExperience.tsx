'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, Gift, Heart, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { ChapterContent } from '@/lib/types';
import { EnvelopeAnimation, LoveLetter } from './LoveLetter';
import { MusicPlayer } from './MusicPlayer';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { PolaroidCard } from './PolaroidCard';
import { DistanceThread, FloatingHearts } from './DailyInteraction';
import { MemoriesGallery } from '@/components/album/MemoriesGallery';
import { BirthdayCelebration } from '@/components/celebration/BirthdayCelebration';
import { HiddenStarPuzzle } from '@/components/celebration/HiddenStarPuzzle';
import './chapter.css';
import './chapter-polish.css';

const subscribeProgress = (callback: () => void) => { window.addEventListener('universe-storage', callback); window.addEventListener('storage', callback); return () => { window.removeEventListener('universe-storage', callback); window.removeEventListener('storage', callback); }; };
const readLetterProgress = () => { try { return localStorage.getItem('universe-birthday-letter-read') === 'yes'; } catch { return false; } };

export function ChapterExperience({ chapter }: { chapter: ChapterContent & { giftMessage?: string } }) {
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftAvailable, setGiftAvailable] = useState(false);
  const letterPreviouslyRead = useSyncExternalStore(subscribeProgress, readLetterProgress, () => false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    try { const visited = JSON.parse(localStorage.getItem('universe-visited') || '[]'); localStorage.setItem('universe-visited', JSON.stringify([...new Set([...(Array.isArray(visited) ? visited : []), chapter.id]) ])); window.dispatchEvent(new Event('universe-storage')); } catch { /* Progress is optional, availability is enforced by the server. */ }
  }, [chapter.id]);
  const birthday = chapter.interaction.type === 'birthday' && !!chapter.birthdayCopy;
  const finishLetter = () => { setGiftAvailable(true); try { localStorage.setItem('universe-birthday-letter-read', 'yes'); window.dispatchEvent(new Event('universe-storage')); } catch { /* Session progress still works. */ } };
  const date = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', timeZone: 'America/Guayaquil' }).format(new Date(chapter.unlockAt));
  return <main id="main" className={`chapter-experience ${birthday ? 'birthday-chapter' : ''}`}>
    <div className="chapter-navigation"><Link href="/" className="back-link"><ArrowLeft size={17} />Volver a nuestro universo</Link><span>{date}</span></div>
    {!birthday && <header className="chapter-heading"><div className="chapter-number"><Star size={17} fill="currentColor" /><span>Estrella {chapter.id} de 5</span></div><h1>{chapter.title}</h1><p className="chapter-star-name">{chapter.starName}</p><p className="chapter-introduction">{chapter.introduction}</p></header>}
    {birthday && chapter.birthdayCopy && <BirthdayCelebration photo={chapter.photos[0]} copy={chapter.birthdayCopy} />}
    {chapter.id > 1 && <MusicPlayer song={chapter.song} invitation="Pon nuestra canción y abre estas palabras." />}
    {birthday && chapter.voiceNote && <VoiceNotePlayer note={chapter.voiceNote} />}
    <section className="letter-section" aria-label="Carta de este capítulo">
      {!letterOpen ? <EnvelopeAnimation onOpen={() => setLetterOpen(true)} /> : <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><LoveLetter text={chapter.letter} onFinished={birthday ? finishLetter : undefined} /></motion.div>}
    </section>
    {chapter.id === 1 && <MusicPlayer song={chapter.song} />}
    {!birthday && chapter.interaction.type === 'envelope' && chapter.photos.length > 0 && <section className="chapter-photo-section" aria-label="Un recuerdo nuestro"><div className="chapter-single-photo"><PolaroidCard photo={chapter.photos[0]} /></div><Heart className="photo-heart" size={24} strokeWidth={1} /></section>}
    {!birthday && chapter.interaction.type === 'wishes' && chapter.photos.length > 0 && <section className="chapter-photo-section" aria-label="Un recuerdo nuestro"><div className="chapter-single-photo"><PolaroidCard photo={chapter.photos[0]} /></div><Heart className="photo-heart" size={24} strokeWidth={1} /></section>}
    {chapter.interaction.type === 'hearts' && <FloatingHearts messages={chapter.interaction.messages} photo={chapter.photos[0]} chapterId={chapter.id} />}
    {chapter.interaction.type === 'wishes' && <FloatingHearts messages={chapter.interaction.messages} wishes chapterId={chapter.id} />}
    {chapter.interaction.type === 'memories' && <><DistanceThread /><section className="chapter-memories"><h2>Pedacitos de nosotros</h2><p>Hay momentos que siempre se sienten como un abrazo.</p><MemoriesGallery photos={chapter.photos} /><Link className="text-control" href="/album">Abrir nuestro álbum completo</Link></section></>}
    {birthday && chapter.birthdayCopy && (giftAvailable || letterPreviouslyRead) && chapter.giftMessage && <><div className="gift-invitation"><Gift size={28} /><h2>{chapter.birthdayCopy.invitationTitle}</h2><p>{chapter.birthdayCopy.invitationDescription}</p><a className="button" href="#regalo">Descubrir mi sorpresa</a></div><HiddenStarPuzzle giftMessage={chapter.giftMessage} copy={chapter.birthdayCopy} /></>}
    <footer className="chapter-footer"><Star size={16} /><p>{birthday && chapter.birthdayCopy ? chapter.birthdayCopy.giftFooter : 'Un pedacito de nuestra historia. Una estrella que ya es tuya.'}</p><Link className="back-link" href="/"><ArrowLeft size={16} />Volver a nuestro universo</Link></footer>
  </main>;
}

'use client';

import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { Check, Heart, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Photo } from '@/lib/types';
import { dailyProgressKey, parseDailyProgress, writeDailyProgress, type DailyProgress, type ProgressStorage } from '@/lib/progress';
import { PolaroidCard } from './PolaroidCard';
import './daily-interactions.css';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('universe-storage', callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('universe-storage', callback); };
};
function storage(): ProgressStorage | null { try { return window.localStorage; } catch { return null; } }
function snapshot(key: string): string | null { try { return storage()?.getItem(key) ?? null; } catch { return null; } }
const portraitPoints = [[300, 27], [552, 146], [522, 454], [78, 454], [48, 146]];

export function FloatingHearts({ messages, wishes = false, photo, chapterId = wishes ? 4 : 2 }: { messages: string[]; wishes?: boolean; photo?: Photo; chapterId?: number }) {
  const safeChapter = Number.isInteger(chapterId) && chapterId >= 1 && chapterId <= 5 ? chapterId : wishes ? 4 : 2;
  const key = dailyProgressKey(safeChapter);
  const raw = useSyncExternalStore(subscribe, () => snapshot(key), () => null);
  const remembered = parseDailyProgress(raw, messages.length);
  const [sessionProgress, setSessionProgress] = useState<DailyProgress | null>(null);
  const [sessionOnly, setSessionOnly] = useState(false);
  const [activeHeart, setActiveHeart] = useState<number | null>(null);
  const progress = sessionProgress ?? remembered;
  const { revealed, chosenWish } = progress;
  const allRevealed = messages.length > 0 && revealed.length === messages.length;
  const reduceMotion = useReducedMotion();
  const id = useId();
  const choiceTitle = useRef<HTMLLegendElement>(null);
  const activeIndex = activeHeart !== null && revealed.includes(activeHeart) ? activeHeart : revealed.at(-1) ?? null;
  const save = (next: DailyProgress) => {
    const saved = writeDailyProgress(storage(), safeChapter, next, messages.length);
    setSessionOnly(!saved);
    setSessionProgress(saved ? null : next);
    window.dispatchEvent(new Event('universe-storage'));
  };
  const reveal = (index: number) => {
    setActiveHeart(index);
    if (revealed.includes(index)) return;
    const next = [...revealed, index];
    save({ ...progress, revealed: next });
    if (wishes && next.length === messages.length) window.requestAnimationFrame(() => choiceTitle.current?.focus({ preventScroll: true }));
  };
  const portrait = photo ?? { id: 'pending-portrait', src: '', alt: 'Una fotografía especial de Jenni', caption: 'Un lugar para tu fotografía' };

  return <section className={`daily-interaction daily-interaction-new ${wishes ? 'wishes-interaction' : 'hearts-interaction'}`} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>{wishes ? 'Un cielo de cosas por construir' : 'Cinco cositas que me encantan de ti'}</h2>
    <p>{wishes ? 'Toca cada estrella. Dentro hay un deseo para nosotros.' : 'Cada corazón guarda algo que quiero recordarte. Tócalos y mira cómo se enciende tu cielo.'}</p>
    {!messages.length ? <p className="daily-empty">Este cielo está esperando sus palabras.</p> : wishes ? <>
      {!allRevealed ? <div className="wish-discovery">{messages.map((message, index) => <div className="wish-discovery-item" key={index}>
        <motion.button className={`wish-discovery-star ${revealed.includes(index) ? 'is-revealed' : ''}`} whileTap={reduceMotion ? undefined : { scale: 0.94 }} onClick={() => reveal(index)} aria-label={`Revelar deseo ${index + 1}`} aria-expanded={revealed.includes(index)} aria-controls={`${id}-wish-${index}`}><Star size={29} fill={revealed.includes(index) ? 'currentColor' : 'none'} /></motion.button>
        <p id={`${id}-wish-${index}`} className={revealed.includes(index) ? 'wish-message-revealed' : 'wish-message-hidden'}>{revealed.includes(index) ? message : 'Un deseo por descubrir'}</p>
      </div>)}</div> : <div className="wish-selection">
        <div className="wishes-complete-stars" aria-hidden="true">{messages.map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
        <fieldset className="wish-choice"><legend tabIndex={-1} ref={choiceTitle}>¿Cuál encendemos primero?</legend><p className="wish-choice-description">Elige un deseo para cuidar juntos. Puedes cambiarlo cuando quieras.</p>
          {messages.map((message, index) => <label className={`wish-choice-option ${chosenWish === index ? 'is-chosen' : ''}`} key={index}><input type="radio" name={`${id}-chosen-wish`} value={index} checked={chosenWish === index} onChange={() => save({ ...progress, chosenWish: index })} /><span className="wish-choice-light" aria-hidden="true">{chosenWish === index ? <Star size={23} fill="currentColor" /> : <Star size={23} />}</span><span>{message}</span>{chosenWish === index && <Check className="wish-choice-check" size={18} aria-hidden="true" />}</label>)}
        </fieldset>
        <p className="wish-remembered" role="status">{chosenWish === null ? 'Todavía puedes elegir tu primera estrella.' : sessionOnly ? 'Este deseo se queda encendido durante esta visita.' : 'Este deseo se queda encendido. Lo recordaré cuando vuelvas desde este teléfono.'}</p>
      </div>}
    </> : <>
      <div className={`heart-portrait-scene ${allRevealed ? 'heart-portrait-complete' : ''}`}>
        <svg className="heart-portrait-lines" viewBox="0 0 600 540" preserveAspectRatio="none" aria-hidden="true"><path className="heart-line-guide" d="M300 27 552 146 522 454 78 454 48 146Z" />{portraitPoints.map(([x, y], index) => { const next = (index + 1) % portraitPoints.length; return <line className={revealed.includes(index) && revealed.includes(next) && !allRevealed ? 'heart-line-seen' : 'heart-line-unseen'} x1={x} y1={y} x2={portraitPoints[next][0]} y2={portraitPoints[next][1]} key={index} />; })}<motion.path className="heart-line-complete" d="M300 27 552 146 522 454 78 454 48 146Z" initial={false} animate={{ pathLength: allRevealed ? 1 : 0, opacity: allRevealed ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }} /></svg>
        <div className="heart-portrait-photo"><PolaroidCard photo={portrait} /></div>
        {messages.map((_, index) => <button className={`portrait-heart portrait-heart-${index + 1} ${revealed.includes(index) ? 'is-revealed' : ''} ${activeIndex === index ? 'is-active' : ''}`} key={index} onClick={() => reveal(index)} aria-label={`${revealed.includes(index) ? 'Volver a leer' : 'Revelar'} corazón ${index + 1}`} aria-pressed={activeIndex === index} aria-controls={`${id}-compliment`}>{allRevealed ? <Star size={28} fill="currentColor" /> : <Heart size={28} fill={revealed.includes(index) ? 'currentColor' : 'none'} />}</button>)}
      </div>
      <div className="portrait-compliment" id={`${id}-compliment`} role="status"><Heart size={18} strokeWidth={1.2} aria-hidden="true" /><p>{activeIndex === null ? 'Hay cinco maneras de recordarte lo especial que eres.' : messages[activeIndex]}</p></div>
      {allRevealed && <motion.p className="portrait-constellation-message" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>Tus cinco corazones ya son una constelación.</motion.p>}
    </>}
    {messages.length > 0 && <span className="interaction-progress" aria-live="polite">{revealed.length} de {messages.length} {wishes ? 'deseos descubiertos' : 'corazones abiertos'}</span>}
  </section>;
}

export function DistanceThread() {
  const saved = useSyncExternalStore(subscribe, () => snapshot('universe-distance-connected'), () => null) === 'yes';
  const [sessionConnected, setSessionConnected] = useState(false);
  const connected = sessionConnected || saved;
  const connect = () => {
    setSessionConnected(true);
    try { storage()?.setItem('universe-distance-connected', 'yes'); window.dispatchEvent(new Event('universe-storage')); } catch { /* The connection stays lit for this visit if storage is denied. */ }
  };
  return <section className={`distance-thread ${connected ? 'connected' : ''}`}><h2>Un mismo cielo, estés donde estés</h2><p>Toca para acercar nuestras estrellas.</p><button className="thread-scene" aria-label="Conectar nuestras dos estrellas" aria-pressed={connected} onClick={connect}><Star className="thread-star" fill="currentColor" size={32} /><span className="thread-line" /><Heart className="thread-heart" size={23} fill="currentColor" /><Star className="thread-star" fill="currentColor" size={32} /></button><p className="thread-dedication" aria-live="polite">{connected ? 'La distancia no borra todo lo que hemos vivido.' : 'Dos estrellas. El mismo deseo de estar cerquita.'}</p></section>;
}

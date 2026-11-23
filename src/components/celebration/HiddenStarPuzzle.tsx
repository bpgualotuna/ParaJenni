'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Gift, Heart, KeyRound, RotateCcw, Sparkles, Star } from 'lucide-react';
import type { BirthdayCopy } from '@/lib/types';

const positions = [[13, 15], [76, 11], [43, 29], [10, 63], [78, 66]];

export function MagicalGiftChest({ opened }: { opened: boolean }) {
  return <div className={`magical-chest ${opened ? 'chest-open' : ''}`} aria-label={opened ? 'Cofre abierto' : 'Cofre cerrado'}><div className="chest-light" /><div className="chest-lid"><span /></div><div className="chest-body"><span className="chest-band band-left" /><span className="chest-band band-right" /><span className="chest-lock"><Heart size={18} fill="currentColor" /></span></div></div>;
}

export function GiftReveal({ message, copy }: { message: string; copy: BirthdayCopy }) {
  return <div className="gift-reveal"><span className="gift-reveal-icon" aria-hidden="true"><Gift size={30} /></span><div className="gift-message">{message.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="gift-coupon"><Heart size={23} strokeWidth={1} /><h3>{copy.couponTitle}</h3><p>{copy.couponDescription}</p><span>{copy.couponDedication}</span></div></div>;
}

export function HiddenStarPuzzle({ giftMessage, copy }: { giftMessage: string; copy: BirthdayCopy }) {
  const [found, setFound] = useState<number[]>([]);
  const [opened, setOpened] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const unlockTimer = useRef<number | null>(null);
  useEffect(() => () => { if (unlockTimer.current !== null) clearTimeout(unlockTimer.current); }, []);
  const reduceMotion = useReducedMotion();
  const words = copy.words;
  const complete = found.length === words.length;
  return <section className="gift-puzzle" id="regalo"><h2>{copy.puzzleTitle}</h2><p style={{ whiteSpace: 'pre-line' }}>{copy.puzzleDescription}</p>
    <div className="puzzle-words" aria-live="polite">{words.map((word, index) => <span className={found.includes(index) ? 'word-found' : ''} key={word}>{found.includes(index) ? word : <Star size={13} />}</span>)}</div>
    <div className="puzzle-scene">
      <div className="puzzle-orbit orbit-one" /><div className="puzzle-orbit orbit-two" /><div className="puzzle-moon" aria-hidden="true" />
      {positions.map(([left, top], index) => <motion.button key={index} className={`hidden-star ${found.includes(index) ? 'star-found' : ''}`} style={{ left: `${left}%`, top: `${top}%` }} aria-label={found.includes(index) ? `Estrella ${index + 1}: ${words[index]}, encontrada` : `Encontrar estrella ${index + 1}`} disabled={found.includes(index)} onClick={() => setFound(values => values.includes(index) ? values : [...values, index])} whileTap={reduceMotion ? undefined : { scale: 1.2 }}><Star fill="currentColor" size={25} />{found.includes(index) && <span>{words[index]}</span>}</motion.button>)}
      <div className="chest-position"><MagicalGiftChest opened={opened} /></div>
      <AnimatePresence>{complete && !opened && <motion.button className={`magical-key ${unlocking ? 'key-unlocking' : ''}`} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => { setUnlocking(true); unlockTimer.current = window.setTimeout(() => setOpened(true), reduceMotion ? 0 : 750); }} disabled={unlocking} aria-label="Abrir el cofre con la llave"><KeyRound size={30} /><span>{unlocking ? copy.keyOpening : copy.keyInvitation}</span></motion.button>}</AnimatePresence>
    </div>
    <p className="puzzle-progress" aria-live="polite">{opened ? copy.puzzleOpened : complete ? copy.puzzleComplete : `${found.length} de 5 estrellas encontradas`}</p>
    {opened && <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><GiftReveal message={giftMessage} copy={copy} /></motion.div>}
    <div className="puzzle-actions"><button className="text-control" onClick={() => { if (unlockTimer.current !== null) clearTimeout(unlockTimer.current); setFound([]); setOpened(false); setUnlocking(false); }}><RotateCcw size={16} />Volver a jugar</button>{complete && !opened && <button className="text-control" onClick={() => setOpened(true)}><Sparkles size={16} />Ver mi sorpresa</button>}</div>
  </section>;
}

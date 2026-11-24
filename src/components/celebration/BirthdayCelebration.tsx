'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart, RotateCcw, Sparkles, Star } from 'lucide-react';
import type { BirthdayCopy, Photo } from '@/lib/types';
import { PolaroidCard } from '@/components/chapter/PolaroidCard';
import './celebration-polish.css';

const subscribeSeen = (callback: () => void) => {
  window.addEventListener('universe-birthday-progress', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('universe-birthday-progress', callback);
    window.removeEventListener('storage', callback);
  };
};
const readSeen = () => {
  try { return localStorage.getItem('universe-birthday-seen') === 'yes'; } catch { return false; }
};

export function ConfettiEffect({ run }: { run: number }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!run || reduceMotion) return;
    let alive = true;
    let secondBurst: number | undefined;
    import('canvas-confetti').then(({ default: confetti }) => {
      if (!alive) return;
      const colors = ['#F7CF88', '#D990BD', '#F7E9DB', '#9573ba'];
      void confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
      secondBurst = window.setTimeout(() => {
        if (alive) void confetti({ particleCount: 65, spread: 110, origin: { y: 0.45 }, colors, disableForReducedMotion: true });
      }, 600);
    }).catch(() => { /* The illuminated hero remains the celebration without canvas support. */ });
    return () => { alive = false; if (secondBurst !== undefined) clearTimeout(secondBurst); };
  }, [run, reduceMotion]);
  return null;
}

export function BirthdayCelebration({ photo, copy }: { photo?: Photo; copy: BirthdayCopy }) {
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => false);
  // The curtain exists in the server render, so the surprise cannot flash before hydration.
  const [step, setStep] = useState(4);
  const [confettiRun, setConfettiRun] = useState(0);
  const [replay, setReplay] = useState(0);
  const [replaying, setReplaying] = useState(false);
  const sequenceTimers = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();
  const curtainVisible = !reduceMotion && step > 0 && (!seen || replaying);

  const completeCelebration = useCallback(() => {
    sequenceTimers.current.forEach(clearTimeout);
    sequenceTimers.current = [];
    setStep(0);
    setReplaying(false);
    setConfettiRun(value => value + 1);
    try {
      localStorage.setItem('universe-birthday-seen', 'yes');
      window.dispatchEvent(new Event('universe-birthday-progress'));
    } catch { /* Session progress still works when local storage is unavailable. */ }
  }, []);

  useEffect(() => {
    if (readSeen() && !replay) return;
    const timers: number[] = [];
    sequenceTimers.current = timers;
    if (reduceMotion) {
      timers.push(window.setTimeout(completeCelebration, 0));
    } else {
      [3, 2, 1].forEach((value, index) => timers.push(window.setTimeout(() => setStep(value), 1200 + index * 950)));
      timers.push(window.setTimeout(completeCelebration, 4050));
    }
    return () => timers.forEach(clearTimeout);
  }, [replay, reduceMotion, completeCelebration]);

  return <section className={`birthday-celebration birthday-hero ${curtainVisible ? 'birthday-awaiting' : 'birthday-revealed'}`} aria-label="Tu celebración de cumpleaños">
    <ConfettiEffect run={confettiRun} />
    <AnimatePresence>{curtainVisible && <motion.div className="birthday-curtain" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }}>
      <div className="birthday-countdown-stage" role="status" aria-live="polite" aria-atomic="true">
        <Star className="countdown-star" size={30} strokeWidth={1} aria-hidden="true" />
        <AnimatePresence mode="wait"><motion.p className={step === 4 ? 'birthday-prelude' : 'birthday-countdown-number'} key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{step === 4 ? copy.prelude : step}</motion.p></AnimatePresence>
      </div>
      <button className="birthday-skip" onClick={completeCelebration}>Ir a mi celebración</button>
    </motion.div>}</AnimatePresence>
    <div className="birthday-balloons" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="birthday-hero-layout">
      <div className="birthday-hero-copy">
        <div className="heart-constellation" aria-hidden="true"><svg viewBox="0 0 240 160"><path d="M120 140 24 60 64 20 120 49 176 20 216 60 120 140" /></svg>{[[10, 38], [27, 13], [50, 31], [73, 13], [90, 38]].map(([x, y], index) => <Star key={index} size={18} fill="currentColor" style={{ left: `${x}%`, top: `${y}%` }} />)}<Heart size={27} className="birthday-heart" /></div>
        <h1 className="birthday-greeting" style={{ whiteSpace: 'pre-line' }}>{copy.heading}</h1>
        <div className="birthday-name">{copy.name}</div>
        <p className="birthday-wish">{copy.wish}</p>
        <button className="text-control birthday-replay" onClick={() => { setStep(4); setReplaying(true); setReplay(value => value + 1); }}><RotateCcw size={16} />Volver a celebrar</button>
      </div>
      {photo && <div className="birthday-photo birthday-hero-portrait"><span className="birthday-photo-tape" aria-hidden="true" /><PolaroidCard photo={photo} /><Sparkles className="birthday-photo-spark" size={25} strokeWidth={1} aria-hidden="true" /></div>}
    </div>
  </section>;
}

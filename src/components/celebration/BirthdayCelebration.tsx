'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart, RotateCcw, Sparkles, Star } from 'lucide-react';
import type { BirthdayCopy, Photo } from '@/lib/types';
import { PolaroidCard } from '@/components/chapter/PolaroidCard';

export function ConfettiEffect({ run }: { run: number }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!run || reduceMotion) return;
    let alive = true;
    import('canvas-confetti').then(({ default: confetti }) => {
      if (!alive) return;
      const colors = ['#F7CF88', '#D990BD', '#F7E9DB', '#9573ba'];
      void confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
      window.setTimeout(() => { if (alive) void confetti({ particleCount: 65, spread: 110, origin: { y: 0.45 }, colors, disableForReducedMotion: true }); }, 600);
    });
    return () => { alive = false; };
  }, [run, reduceMotion]);
  return null;
}

export function BirthdayCelebration({ photo, copy }: { photo?: Photo; copy: BirthdayCopy }) {
  const [step, setStep] = useState<number | null>(null);
  const [confettiRun, setConfettiRun] = useState(0);
  const [replay, setReplay] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem('universe-birthday-seen') === 'yes'; } catch { /* Private browsing still permits the celebration. */ }
    if (seen && !replay) return;
    const sequence = reduceMotion ? [0] : [4, 3, 2, 1, 0];
    const timers = sequence.map((value, index) => window.setTimeout(() => {
      setStep(value);
      if (value === 0) { setConfettiRun(run => run + 1); try { localStorage.setItem('universe-birthday-seen', 'yes'); } catch {} }
    }, index * 1050));
    timers.push(window.setTimeout(() => setStep(null), sequence.length * 1050 + 300));
    return () => timers.forEach(clearTimeout);
  }, [replay, reduceMotion]);
  return <section className="birthday-celebration">
    <ConfettiEffect run={confettiRun} />
    <AnimatePresence>{step !== null && step > 0 && <motion.div className="birthday-curtain" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AnimatePresence mode="wait"><motion.div key={step} initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><p>{step === 4 ? copy.prelude : step}</p></motion.div></AnimatePresence></motion.div>}</AnimatePresence>
    <div className="birthday-balloons" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="heart-constellation" aria-hidden="true"><svg viewBox="0 0 240 160"><path d="M120 140 24 60 64 20 120 49 176 20 216 60 120 140" /></svg>{[[10, 38], [27, 13], [50, 31], [73, 13], [90, 38]].map(([x, y], index) => <Star key={index} size={18} fill="currentColor" style={{ left: `${x}%`, top: `${y}%` }} />)}<Heart size={27} className="birthday-heart" /></div>
    <h2 style={{ whiteSpace: 'pre-line' }}>{copy.heading}</h2><div className="birthday-name">{copy.name}</div><p className="birthday-wish">{copy.wish}</p>
    {photo && <div className="birthday-photo"><PolaroidCard photo={photo} /></div>}
    <button className="text-control" onClick={() => setReplay(value => value + 1)}><RotateCcw size={16} />Volver a celebrar</button><span className="birthday-sparkle" aria-hidden="true"><Sparkles size={22} /></span>
  </section>;
}

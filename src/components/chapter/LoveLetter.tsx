'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function EnvelopeAnimation({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduceMotion = useReducedMotion();
  return <div className="envelope-wrap"><button className={`envelope ${opening ? 'envelope-opening' : ''}`} onClick={() => { if (opening) return; setOpening(true); window.setTimeout(onOpen, reduceMotion ? 0 : 650); }} aria-label="Abrir mi carta de amor" disabled={opening}>
    <span className="envelope-note">Para mi Princesita</span><span className="envelope-flap" /><span className="envelope-fold" /><span className="wax-seal"><Heart size={25} fill="currentColor" strokeWidth={1.2} /></span>
  </button><p>Hay palabras que solo son para ti.</p><span className="envelope-instruction">Toca el sobre para abrirlo</span></div>;
}

export function LoveLetter({ text, onFinished }: { text: string; onFinished?: () => void }) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(1);
  const letterRef = useRef<HTMLElement>(null);
  useEffect(() => { letterRef.current?.focus({ preventScroll: true }); }, []);
  const allVisible = reduceMotion || visibleCount >= paragraphs.length;
  useEffect(() => {
    if (allVisible) return;
    const timer = window.setInterval(() => setVisibleCount(value => Math.min(value + 1, paragraphs.length)), 1100);
    return () => clearInterval(timer);
  }, [allVisible, paragraphs.length]);
  return <article className="love-letter" aria-label="Tu carta de amor" tabIndex={-1} ref={letterRef}>
    <div className="letter-ornament" aria-hidden="true"><span /><Sparkles size={20} /><span /></div>
    {!allVisible && <button className="letter-skip" onClick={() => setVisibleCount(paragraphs.length)}>Mostrar la carta completa</button>}
    <div className="letter-text">{paragraphs.slice(0, allVisible ? paragraphs.length : visibleCount).map((paragraph, index) => <motion.p key={index} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>{paragraph}</motion.p>)}</div>
    {allVisible && <div className="letter-signoff"><Heart size={22} strokeWidth={1} /> <span>Con todo mi amor, siempre.</span></div>}
    {allVisible && onFinished && <button className="button letter-finished" onClick={onFinished}>Terminé de leer mi carta</button>}
  </article>;
}

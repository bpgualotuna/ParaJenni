'use client';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { StarGlyph } from './Atmosphere';

export function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close(); }, []);
  return <dialog ref={dialog} className="welcome-dialog" aria-labelledby="welcome-title" onCancel={e => { e.preventDefault(); onBegin(); }}><motion.div className="welcome-inner" initial={{ opacity: 0, y: reduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduce ? 1 : 1.04 }} transition={{ duration: reduce ? .1 : .8 }}><div className="welcome-emblem"><div /><StarGlyph /></div><h1 id="welcome-title">Hola,<br /><em>Mi Princesita</em><Heart className="welcome-heart" size={28} strokeWidth={1.2} /></h1><p>Preparé un pequeño universo especialmente para ti. Durante estos días quiero regalarte pedacitos de nuestra historia, hasta llegar a un día muy especial...</p><button autoFocus className="button button-gold" onClick={onBegin}>Comenzar nuestro viaje <Sparkles size={17} /></button><span className="welcome-signature">hecho con todo mi amor, para Jenni</span></motion.div></dialog>;
}

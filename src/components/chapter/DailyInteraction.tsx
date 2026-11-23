'use client';

import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function FloatingHearts({ messages, wishes = false }: { messages: string[]; wishes?: boolean }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const reduceMotion = useReducedMotion();
  return <section className="daily-interaction"><h2>{wishes ? 'Un cielo de cosas por construir' : 'Cinco cositas que me encantan de ti'}</h2><p>{wishes ? 'Toca cada estrella. Dentro hay un deseo para nosotros.' : 'Cada corazón guarda algo que quiero recordarte.'}</p>
    <div className={`message-tokens ${wishes ? 'wish-tokens' : ''}`}>{messages.map((message, index) => <div className="message-token" key={message}>
      <motion.button whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.92 }} className={`token-button ${revealed.includes(index) ? 'revealed' : ''}`} onClick={() => setRevealed(values => values.includes(index) ? values : [...values, index])} aria-label={`${wishes ? 'Revelar deseo' : 'Revelar corazón'} ${index + 1}`} aria-expanded={revealed.includes(index)}>{wishes ? <Star size={32} fill={revealed.includes(index) ? 'currentColor' : 'none'} /> : <Heart size={32} fill={revealed.includes(index) ? 'currentColor' : 'none'} />}</motion.button>
      {revealed.includes(index) && <motion.p initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{message}</motion.p>}
    </div>)}</div><span className="interaction-progress" aria-live="polite">{revealed.length} de {messages.length} {wishes ? 'deseos descubiertos' : 'corazones abiertos'}</span>
  </section>;
}

export function DistanceThread() {
  const [connected, setConnected] = useState(false);
  return <section className={`distance-thread ${connected ? 'connected' : ''}`}><h2>Un mismo cielo, estés donde estés</h2><p>Toca para acercar nuestras estrellas.</p><button className="thread-scene" aria-label="Conectar nuestras dos estrellas" aria-pressed={connected} onClick={() => setConnected(true)}><Star className="thread-star" fill="currentColor" size={32} /><span className="thread-line" /><Heart className="thread-heart" size={23} fill="currentColor" /><Star className="thread-star" fill="currentColor" size={32} /></button><p className="thread-dedication" aria-live="polite">{connected ? 'La distancia no borra todo lo que hemos vivido.' : 'Dos estrellas. El mismo deseo de estar cerquita.'}</p></section>;
}

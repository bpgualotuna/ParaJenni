'use client';
import { useEffect, useState } from 'react';
export function CountdownTimer({ serverNow, nextUnlockAt, sampledAt }: { serverNow: string; nextUnlockAt: string | null; sampledAt: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setElapsed(Math.max(0, performance.now() - sampledAt)), 1000); return () => clearInterval(timer); }, [sampledAt]);
  if (!nextUnlockAt) return <div className="journey-complete"><span>Las cinco estrellas ya son tuyas.</span><p>Este cielo siempre tendrá un lugar para nosotros.</p></div>;
  const seconds = Math.max(0, Math.ceil((Date.parse(nextUnlockAt) - Date.parse(serverNow) - elapsed) / 1000));
  const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <div className="countdown"><div className="countdown-label">{seconds === 0 ? 'Una nueva estrella está llegando…' : 'La próxima estrella se enciende en'}</div><div className="countdown-digits" role="timer" aria-label={`${parts[0]} días, ${parts[1]} horas, ${parts[2]} minutos y ${parts[3]} segundos`}>{parts.map((part, i) => <div key={i}><strong>{String(part).padStart(2, '0')}</strong><span>{['días', 'horas', 'min', 'seg'][i]}</span></div>)}</div><span className="countdown-footnote">Cada día, a medianoche en Ecuador</span></div>;
}

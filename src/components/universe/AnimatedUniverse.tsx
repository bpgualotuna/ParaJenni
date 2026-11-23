'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Heart, Mail, RotateCcw, Sparkles } from 'lucide-react';
import type { UniverseState } from '@/lib/types';
import { StarField, StarGlyph } from './Atmosphere';
import { SiteHeader } from './Header';
import { Constellation } from './Constellation';
import { CountdownTimer } from './CountdownTimer';
import { WelcomeScreen } from './WelcomeScreen';

const subscribe = (cb: () => void) => { window.addEventListener('universe-storage', cb); window.addEventListener('storage', cb); return () => { window.removeEventListener('universe-storage', cb); window.removeEventListener('storage', cb); }; };
const readSeen = () => { try { return localStorage.getItem('universe-welcome') === 'yes'; } catch { return false; } };
const readVisits = () => { try { return localStorage.getItem('universe-visited') || '[]'; } catch { return '[]'; } };
const clientReady = () => true;
const serverPending = () => false;

export function AnimatedUniverse({ initialState }: { initialState: UniverseState }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState({ data: initialState, at: 0 });
  const [syncError, setSyncError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [sessionSeen, setSessionSeen] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverPending);
  const seen = useSyncExternalStore(subscribe, readSeen, serverPending) || sessionSeen;
  const visitJson = useSyncExternalStore(subscribe, readVisits, () => '[]');
  let visited: number[] = [];
  try { const parsed: unknown = JSON.parse(visitJson); if (Array.isArray(parsed)) visited = parsed.filter((v): v is number => typeof v === 'number'); } catch { /* Invalid local progress never affects access. */ }
  const reduce = useReducedMotion();
  const { chapters, serverNow, nextUnlockAt, devMode } = snapshot.data;
  const available = chapters.filter(c => c.available);
  const latest = available.at(-1);

  useEffect(() => {
    if (!hydrated || !seen || !chapters[4]?.available) return;
    try { if (localStorage.getItem('universe-birthday-seen') !== 'yes') router.push('/capitulo/5'); } catch { /* The fifth star remains available without browser storage. */ }
  }, [hydrated, seen, chapters, router]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const sync = async () => {
      try {
        const response = await fetch('/api/universe', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('sync');
        const data = await response.json() as UniverseState;
        if (alive) { setSnapshot({ data, at: performance.now() }); setSyncError(false); }
      } catch { if (alive) setSyncError(true); }
    };
    void sync();
    const timer = window.setInterval(sync, 15000);
    const onVisible = () => { if (document.visibilityState === 'visible') void sync(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', sync);
    return () => { alive = false; controller.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('online', sync); };
  }, []);
  const begin = () => { try { localStorage.setItem('universe-welcome', 'yes'); window.dispatchEvent(new Event('universe-storage')); } catch { /* Session fallback below. */ } setSessionSeen(true); };
  const replay = () => { try { localStorage.removeItem('universe-welcome'); window.dispatchEvent(new Event('universe-storage')); } catch { /* Session state handles unavailable storage. */ } setSessionSeen(false); };

  return <div className="night-page universe-page"><StarField /><SiteHeader albumAvailable={chapters[2]?.available ?? false} /><motion.main id="main" className="universe-main" initial={{ opacity: .4 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? .1 : 1.2 }}><div className="universe-heading"><h1>Nuestro pequeño<br /><em>universo</em><span className="heading-spark"><StarGlyph /></span></h1><div className="universe-subtitle"><span />Cinco estrellas, un mismo amor<span /></div><p>Mi Princesita, hay historias que merecen su propio cielo.<br className="desktop-break" /> Este es el nuestro. Y cada estrella es para ti.</p></div><div className="sky-map"><Constellation chapters={chapters} visited={visited} /><div className="handwritten sky-dedication">Nosotros,<br /><span>en cualquier universo.</span><Heart size={21} strokeWidth={1} /></div><aside className="sky-polaroid" aria-label="Un recuerdo nuestro"><div className="photo-tape" />{photoError ? <div className="welcome-photo-fallback"><Heart size={42} strokeWidth={1} /><span>Un lugar para nosotros</span></div> : <Image src="/api/photos/welcome" alt="Un recuerdo especial de Jenni y de nuestra historia" width={400} height={470} unoptimized onError={() => setPhotoError(true)} priority />}<span className="handwritten">mi lugar favorito: contigo</span></aside></div><div className="universe-bottom"><div className="today-invitation">{latest ? <><div className="tiny-envelope"><Mail size={25} strokeWidth={1} /></div><div><span>{latest.id === 5 ? 'Hoy el universo está de fiesta' : 'Hay una carta esperando por ti'}</span><Link href={`/capitulo/${latest.id}`}>{latest.id === 5 ? 'Celebrar tu cumpleaños' : latest.title}<Sparkles size={15} /></Link></div></> : <><div className="tiny-envelope"><Mail size={25} /></div><div><span>Estamos a punto de comenzar</span><p>La primera carta llega el 23 de noviembre.</p></div></>}</div><CountdownTimer serverNow={serverNow} nextUnlockAt={nextUnlockAt} sampledAt={snapshot.at} /></div>{syncError && <p className="sync-message" role="status">No pudimos actualizar el cielo. Reintentaremos al recuperar la conexión.</p>}{devMode && <p className="dev-notice">Vista de desarrollo · fecha del servidor: {new Intl.DateTimeFormat('es-EC', { timeZone: 'America/Guayaquil', dateStyle: 'long' }).format(new Date(serverNow))}</p>}</motion.main><footer className="universe-footer"><span>Con todo mi amor <Heart size={12} /></span><button className="text-button" onClick={replay}><RotateCcw size={13} />Volver al comienzo</button><span>23 — 27 noviembre, 2026</span></footer><AnimatePresence>{hydrated && !seen && <WelcomeScreen onBegin={begin} />}</AnimatePresence></div>;
}


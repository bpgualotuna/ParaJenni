'use client';

import { useState } from 'react';
import { Mic, Heart } from 'lucide-react';
import type { VoiceNote } from '@/lib/types';

export function VoiceNotePlayer({ note }: { note: VoiceNote }) {
  const [failed, setFailed] = useState(false);
  return <section className="voice-note" aria-labelledby="voice-note-title">
    <div className="voice-note-heading"><Mic size={21} strokeWidth={1.4} /><h2 id="voice-note-title">Unas palabras, con mi voz</h2><Heart size={17} strokeWidth={1.2} /></div>
    <p>Este pedacito de mí también es para ti.</p>
    <audio controls preload="none" onError={() => setFailed(true)} aria-label="Escuchar mi mensaje de voz"><source src={note.src} type={note.mimeType} />Tu navegador no puede reproducir este audio.</audio>
    {failed && <p className="voice-note-error" role="status">No se pudo reproducir el mensaje. <a href={note.src}>Abrir el audio</a></p>}
    {note.transcript && <details><summary>Leer el mensaje de voz</summary><p className="voice-note-transcript">{note.transcript}</p></details>}
  </section>;
}

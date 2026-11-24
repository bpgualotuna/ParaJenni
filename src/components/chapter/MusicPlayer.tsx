'use client';

import { useState } from 'react';
import { ExternalLink, Music2, Play, X } from 'lucide-react';
import type { Song } from '@/lib/types';
import { getMusicEmbed } from '@/lib/music';

export function MusicPlayer({ song, invitation }: { song: Song; invitation?: string }) {
  const [opened, setOpened] = useState(false);
  const integration = getMusicEmbed(song.url);
  return <section className="music-player" aria-label={`Nuestra canción: ${song.title}`}>
    {invitation && <p className="music-invitation">{invitation}</p>}
    <div className="music-summary">
      <span className="record-art" aria-hidden="true"><Music2 size={24} /></span>
      <div className="song-info"><span className="song-label">Una canción para este momento</span><h3>{song.title}</h3><p>{song.artist}</p></div>
      {integration && <button className="round-control" onClick={() => setOpened(!opened)} aria-label={opened ? 'Cerrar y detener reproductor' : `Escuchar ${song.title}`} aria-expanded={opened}>{opened ? <X size={20} /> : <Play size={20} fill="currentColor" />}</button>}
    </div>
    {integration ? <>
      {opened && <div className="music-embed"><iframe src={integration.embed} title={`${song.title} — ${song.artist}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /><p>Reproduce y pausa desde los controles de {integration.platform}.</p></div>}
      <a className="music-link" href={integration.original} target="_blank" rel="noopener noreferrer">Abrir en {integration.platform}<ExternalLink size={14} /></a>
    </> : <p className="music-pending">Esta canción ya tiene un lugar aquí. Su enlace está por llegar.</p>}
  </section>;
}

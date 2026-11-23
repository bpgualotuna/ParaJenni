'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import type { Photo } from '@/lib/types';

export function PhotoImage({ photo, priority = false }: { photo: Photo; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className="photo-image">
    {failed || !photo.src ? <div className="photo-placeholder"><ImageIcon size={28} /><span>Aquí guardaremos un recuerdo</span><small>Fotografía pendiente</small></div> : <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 90vw, 560px" unoptimized priority={priority} onError={() => setFailed(true)} />}
  </div>;
}

export function PolaroidCard({ photo, index = 0, onOpen }: { photo: Photo; index?: number; onOpen?: () => void }) {
  const content = <><PhotoImage photo={photo} /><span className="polaroid-caption">{photo.caption}</span>{onOpen && <span className="polaroid-hint">Toca para mirar de cerquita</span>}</>;
  return onOpen ? <button className={`polaroid polaroid-${index % 3}`} onClick={onOpen} aria-label={`Ampliar fotografía: ${photo.alt}`}>{content}</button> : <figure className={`polaroid polaroid-${index % 3}`}>{content}</figure>;
}

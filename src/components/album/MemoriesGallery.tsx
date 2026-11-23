'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Photo } from '@/lib/types';
import { PhotoImage, PolaroidCard } from '@/components/chapter/PolaroidCard';

export function MemoriesGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isOpen = selected !== null;
  const close = () => setSelected(null);
  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected(index => index === null ? null : (index + 1) % photos.length);
      if (event.key === 'ArrowLeft') setSelected(index => index === null ? null : (index + photos.length - 1) % photos.length);
      if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
        if (!controls?.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [isOpen, photos.length]);
  if (!photos.length) return <p className="gallery-empty">Este álbum espera nuestras fotografías.</p>;
  return <>
    <div className="memories-grid">{photos.map((photo, index) => <motion.div key={photo.id} initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }}><PolaroidCard photo={photo} index={index} onOpen={() => setSelected(index)} /></motion.div>)}</div>
    {selected !== null && <div className="photo-lightbox" onClick={close}>
      <div className="lightbox-content" role="dialog" aria-modal="true" aria-label="Álbum de recuerdos" ref={dialogRef} onClick={event => event.stopPropagation()}>
        <button className="round-control lightbox-close" onClick={close} aria-label="Cerrar fotografía"><X /></button>
        <PhotoImage key={photos[selected].id} photo={photos[selected]} priority />
        <p className="lightbox-caption" aria-live="polite">{photos[selected].caption}</p>
        <div className="lightbox-nav"><button className="round-control" aria-label="Fotografía anterior" onClick={() => setSelected((selected + photos.length - 1) % photos.length)}><ChevronLeft /></button><span>{selected + 1} de {photos.length}</span><button className="round-control" aria-label="Fotografía siguiente" onClick={() => setSelected((selected + 1) % photos.length)}><ChevronRight /></button></div>
      </div>
    </div>}
  </>;
}

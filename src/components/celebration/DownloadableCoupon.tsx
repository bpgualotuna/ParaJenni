'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, LoaderCircle } from 'lucide-react';
import type { BirthdayCopy } from '@/lib/types';
import { createCouponPng } from './coupon-image';

export function DownloadableCoupon({ copy }: { copy: BirthdayCopy }) {
  const [imageUrl, setImageUrl] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const urlRef = useRef('');
  const activeRef = useRef(true);
  useEffect(() => {
    activeRef.current = true;
    return () => { activeRef.current = false; if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, []);
  const download = async () => {
    if (preparing) return;
    setPreparing(true);
    setError('');
    try {
      let url = urlRef.current;
      if (!url) {
        const blob = await createCouponPng(copy);
        if (!activeRef.current) return;
        url = URL.createObjectURL(blob);
        urlRef.current = url;
        setImageUrl(url);
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vale-para-jenni.png';
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      if (activeRef.current) setError('No pudimos preparar el vale. Inténtalo otra vez; tu sorpresa sigue aquí.');
    } finally { if (activeRef.current) setPreparing(false); }
  };
  return <div className="coupon-download">
    <button className="coupon-download-button" onClick={download} disabled={preparing} aria-busy={preparing}>
      {preparing ? <LoaderCircle size={18} className="coupon-loading" /> : <Download size={18} />}
      {preparing ? 'Preparando tu vale…' : imageUrl ? 'Descargar de nuevo' : 'Descargar mi vale'}
    </button>
    <p className="coupon-download-status" role="status" aria-live="polite">{error || (imageUrl ? 'Tu vale está listo para guardarlo como recuerdo.' : 'Un recuerdo para guardar en tu teléfono.')}</p>
    {imageUrl && <div className="coupon-image-preview">
      <Image src={imageUrl} alt={`${copy.couponTitle}. ${copy.couponDescription}`} width={1080} height={1340} unoptimized />
      <div className="coupon-save-links"><a href={imageUrl} download="vale-para-jenni.png"><Download size={16} />Guardar PNG</a><a href={imageUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Abrir imagen</a></div>
      <p>En iPhone, también puedes mantener presionada la imagen y elegir «Guardar en Fotos».</p>
    </div>}
  </div>;
}

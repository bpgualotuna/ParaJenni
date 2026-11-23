import Link from 'next/link';
import { ArrowLeft, Heart, LockKeyhole } from 'lucide-react';
import { getAlbum, getUniverseState } from '@/lib/server/content';
import { MemoriesGallery } from '@/components/album/MemoriesGallery';
import { UnlockRefresh } from '@/components/chapter/UnlockRefresh';
import { StarField } from '@/components/universe/Atmosphere';
import { SiteHeader } from '@/components/universe/Header';
import '@/components/chapter/chapter.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AlbumPage() {
  const photos = getAlbum();
  const universe = getUniverseState();
  return <div className="night-page"><StarField /><SiteHeader active="album" albumAvailable={universe.chapters[2].available} />{photos ? <main id="main" className="album-page"><Link href="/" className="back-link"><ArrowLeft size={16} />Volver a nuestro universo</Link><header className="album-heading"><h1>Los recuerdos<br />que son nuestros</h1><p>Pequeños instantes que guardan algo enorme.<br />Toca una fotografía y quédate un ratito.</p></header><MemoriesGallery photos={photos} /><div className="album-bottom"><Heart size={20} /><p>Y todos los recuerdos que todavía nos faltan.</p></div></main> : <main id="main" className="locked-chapter"><UnlockRefresh chapterId={3} /><LockKeyhole size={30} strokeWidth={1} /><h1>Nuestro álbum está guardando sus recuerdos</h1><p>Podrás abrirlo desde el 25 de noviembre de 2026, a las 00:00 de Ecuador.</p><Link href="/" className="back-link"><ArrowLeft size={16} />Volver a nuestro universo</Link></main>}</div>;
}

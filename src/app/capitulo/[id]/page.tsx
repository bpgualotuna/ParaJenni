import Link from 'next/link';
import { ArrowLeft, LockKeyhole, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getChapter, getUniverseState } from '@/lib/server/content';
import { ChapterExperience } from '@/components/chapter/ChapterExperience';
import { UnlockRefresh } from '@/components/chapter/UnlockRefresh';
import { StarField } from '@/components/universe/Atmosphere';
import { SiteHeader } from '@/components/universe/Header';
import '@/components/chapter/chapter.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-5]$/.test(id)) notFound();
  const chapter = getChapter(Number(id));
  const universe = getUniverseState();
  return <div className="night-page"><StarField /><SiteHeader albumAvailable={universe.chapters[2].available} />{chapter ? <ChapterExperience chapter={chapter} /> : <main id="main" className="locked-chapter"><UnlockRefresh chapterId={Number(id)} /><LockKeyhole size={30} strokeWidth={1} /><h1>Esta estrella está guardando su sorpresa</h1><p>Se encenderá el {new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', timeZone: 'America/Guayaquil' }).format(new Date(universe.chapters[Number(id) - 1].unlockAt))}, a las 00:00 de Ecuador. Hay cosas bonitas que merecen su momento.</p><Star size={16} /><Link href="/" className="back-link"><ArrowLeft size={16} />Volver a nuestro universo</Link></main>}</div>;
}

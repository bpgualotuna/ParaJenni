'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UniverseState } from '@/lib/types';

/** A locked deep link can safely open itself at midnight using fresh server authorization. */
export function UnlockRefresh({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  useEffect(() => {
    const controller = new AbortController();
    const sync = async () => {
      try {
        const response = await fetch('/api/universe', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const universe = await response.json() as UniverseState;
        if (universe.chapters.find(chapter => chapter.id === chapterId)?.available) router.refresh();
      } catch { /* The locked state remains safe while offline; the next tick retries. */ }
    };
    const interval = window.setInterval(sync, 15000);
    const visible = () => { if (document.visibilityState === 'visible') void sync(); };
    document.addEventListener('visibilitychange', visible);
    window.addEventListener('online', sync);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener('visibilitychange', visible); window.removeEventListener('online', sync); };
  }, [chapterId, router]);
  return null;
}

import { getUniverseState } from '@/lib/server/content';
import { AnimatedUniverse } from '@/components/universe/AnimatedUniverse';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return <AnimatedUniverse initialState={getUniverseState()} />;
}

import { getUniverseState } from '@/lib/server/content';
import { privateJson } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export function GET() { return privateJson(getUniverseState()); }

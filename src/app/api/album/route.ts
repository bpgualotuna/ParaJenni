import { getAlbum } from '@/lib/server/content';
import { lockedResponse, privateJson } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export function GET() {
  const album = getAlbum();
  return album ? privateJson(album) : lockedResponse();
}

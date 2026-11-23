import { getChapter } from '@/lib/server/content';
import { lockedResponse, privateJson } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[1-5]$/.test(id)) return lockedResponse();
  const chapter = getChapter(Number(id));
  return chapter ? privateJson(chapter) : lockedResponse();
}

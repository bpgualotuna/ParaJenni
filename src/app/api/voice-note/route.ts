import { open } from 'node:fs/promises';
import { getVoiceNoteAsset, parseAudioRange } from '@/lib/server/voice-note';
import { lockedResponse, PRIVATE_HEADERS } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function serve(request: Request, headOnly: boolean) {
  const asset = getVoiceNoteAsset();
  if (!asset) return lockedResponse();
  const handle = await open(asset.filePath, 'r').catch(() => null);
  if (!handle) return lockedResponse();
  let closed = false;
  const close = async () => { if (!closed) { closed = true; await handle.close(); } };
  try {
    const { size } = await handle.stat();
    if (!size) { await close(); return lockedResponse(); }
    const range = parseAudioRange(headOnly ? null : request.headers.get('range'), size);
    const headers = { ...PRIVATE_HEADERS, 'Content-Type': asset.mimeType, 'Accept-Ranges': 'bytes' };
    if (range === 'invalid') {
      await close();
      return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${size}`, 'Content-Length': '0' } });
    }
    const start = range?.start ?? 0;
    const end = range?.end ?? size - 1;
    const responseHeaders = {
      ...headers,
      'Content-Length': String(end - start + 1),
      ...(range ? { 'Content-Range': `bytes ${start}-${end}/${size}` } : {}),
    };
    if (headOnly) { await close(); return new Response(null, { headers: responseHeaders }); }
    let position = start;
    const body = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          if (position > end) { await close(); controller.close(); return; }
          // Read only the requested range, at most 64 KiB per pull. Large recordings
          // are never copied wholesale into a serverless function's memory.
          const chunk = Buffer.alloc(Math.min(64 * 1024, end - position + 1));
          const { bytesRead } = await handle.read(chunk, 0, chunk.length, position);
          if (!bytesRead) { await close(); controller.close(); return; }
          position += bytesRead;
          controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, bytesRead));
        } catch (error) { await close(); controller.error(error); }
      },
      cancel: close,
    });
    return new Response(body, { status: range ? 206 : 200, headers: responseHeaders });
  } catch {
    await close();
    return lockedResponse();
  }
}

export function GET(request: Request) { return serve(request, false); }
export function HEAD(request: Request) { return serve(request, true); }

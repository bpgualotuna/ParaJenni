import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { getPhotoAsset } from '@/lib/server/content';
import { lockedResponse, PRIVATE_HEADERS } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const asset = getPhotoAsset(id);
  if (!asset) return lockedResponse();
  try {
    const source = await readFile(asset.filePath);
    const rawWidth = new URL(request.url).searchParams.get('w');
    const allowedWidths = [320, 640, 960, 1280, 1600];
    const requestedWidth = rawWidth && /^\d{1,4}$/.test(rawWidth) ? Number(rawWidth) : 1280;
    const width = allowedWidths.find((value) => value >= requestedWidth) ?? 1600;
    const output = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    return new Response(new Uint8Array(output), {
      headers: { ...PRIVATE_HEADERS, 'Content-Type': asset.mimeType, 'Content-Length': String(output.length) },
    });
  } catch (error) {
    // Missing/unsupported files use the same neutral response; no filesystem details escape.
    if (process.env.NODE_ENV === 'development') console.warn('No se pudo servir la fotografía configurada:', id, error instanceof Error ? error.name : 'error');
    return lockedResponse();
  }
}

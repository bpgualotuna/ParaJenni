import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

// Originales privados. Solo estas asociaciones se procesan; no se publica Imagenes.
export const sources = {
  welcome: 'Screenshot_20260507_170828_WhatsApp.jpg',
  'first-moments': '20250516_165933.jpg',
  'jenni-smile': 'Screenshot_20260507_170828_WhatsApp.jpg',
  'memory-01': '20250518_102716.jpg',
  'memory-02': '20250608_172637.jpg',
  'memory-03': '20251019_180908.jpg',
  'memory-04': '20260115_121023.jpg',
  'memory-05': '20260126_180609.jpg',
  'memory-06': 'IMG_20240801_162328_785.jpg',
  together: '20250518_131935.jpg',
  birthday: '20251127_102031.jpg',
  gift: 'VideoCapture_20240901-182259.jpg',
};

await mkdir('private-media', { recursive: true });
let failed = false;
for (const [id, source] of Object.entries(sources)) {
  try {
    const output = join('private-media', `${id}.webp`);
    await sharp(join('Imagenes', source))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(output);
    const { size } = await stat(output);
    console.log(`${id}.webp: ${Math.round(size / 1024)} KB`);
  } catch (error) {
    failed = true;
    console.error(`No se pudo preparar ${source}: ${error.message}`);
  }
}
if (failed) process.exitCode = 1;

import type { BirthdayCopy } from '@/lib/types';

function drawStar(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.beginPath();
  for (let index = 0; index < 8; index++) {
    const angle = index * Math.PI / 4 - Math.PI / 2;
    const length = index % 2 === 0 ? radius : radius * 0.28;
    const pointX = x + Math.cos(angle) * length;
    const pointY = y + Math.sin(angle) * length;
    if (index === 0) context.moveTo(pointX, pointY); else context.lineTo(pointX, pointY);
  }
  context.closePath();
  context.fill();
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const result: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const proposed = line ? `${line} ${word}` : word;
      if (line && context.measureText(proposed).width > maxWidth) { result.push(line); line = word; }
      else line = proposed;
    }
    if (line) result.push(line);
  }
  return result;
}

/** Draws an original PNG using only the authorized server copy, without reading private photos. */
export async function createCouponPng(copy: BirthdayCopy): Promise<Blob> {
  if (document.fonts) await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1340;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Tu navegador no pudo preparar la imagen.');
  const styles = getComputedStyle(document.documentElement);
  const display = styles.getPropertyValue('--font-display').trim() || 'Georgia, serif';
  const body = styles.getPropertyValue('--font-body').trim() || 'Arial, sans-serif';
  if (document.fonts) await Promise.all([
    document.fonts.load(`400 66px ${display}`, copy.couponTitle),
    document.fonts.load(`400 34px ${body}`, copy.couponDescription),
  ]);

  const navy = '#171326';
  const gold = '#F7CF88';
  const cream = '#F7E9DB';
  const plum = '#68475C';
  context.fillStyle = navy;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#5C465F';
  context.lineWidth = 2;
  context.strokeRect(30, 30, 1020, 1280);
  context.fillStyle = gold;
  [[175, 135, 13], [340, 122, 18], [540, 107, 26], [740, 122, 18], [905, 135, 13]].forEach(([x, y, radius]) => drawStar(context, x, y, radius));
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `italic 400 126px ${display}`;
  context.fillText(copy.name, 540, 260, 800);
  context.fillStyle = cream;
  context.beginPath();
  context.roundRect(75, 390, 930, 825, 8);
  context.fill();
  context.strokeStyle = '#B98B85';
  context.lineWidth = 2;
  context.setLineDash([8, 10]);
  context.strokeRect(110, 425, 860, 755);
  context.setLineDash([]);
  context.fillStyle = navy;
  context.beginPath(); context.arc(75, 985, 26, 0, Math.PI * 2); context.fill();
  context.beginPath(); context.arc(1005, 985, 26, 0, Math.PI * 2); context.fill();
  context.strokeStyle = '#C4A297';
  context.setLineDash([6, 10]);
  context.beginPath(); context.moveTo(125, 985); context.lineTo(955, 985); context.stroke();
  context.setLineDash([]);
  context.fillStyle = plum;
  drawStar(context, 540, 480, 20);
  context.font = `400 69px ${display}`;
  const titleLines = wrapText(context, copy.couponTitle, 740);
  const titleHeight = titleLines.length * 79;
  titleLines.forEach((line, index) => context.fillText(line, 540, 625 - titleHeight / 2 + index * 79));
  context.font = `400 34px ${body}`;
  const descriptionLines = wrapText(context, copy.couponDescription, 720);
  descriptionLines.forEach((line, index) => context.fillText(line, 540, 830 - (descriptionLines.length - 1) * 26 + index * 52));
  context.font = `italic 400 41px ${display}`;
  const dedicationLines = wrapText(context, copy.couponDedication, 730);
  dedicationLines.forEach((line, index) => context.fillText(line, 540, 1095 - (dedicationLines.length - 1) * 25 + index * 50));
  context.fillStyle = gold;
  drawStar(context, 540, 1270, 14);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No se pudo crear el archivo PNG.')), 'image/png'));
}

# Guía para personalizar el universo

Todo el contenido se edita en el servidor. No pegues cartas futuras en componentes cliente ni pongas imágenes personales en `public`.

## Cartas y capítulos

`src/content/chapters.ts` contiene la configuración de los cinco capítulos: fecha, título, estrella, introducción, carta, canción, fotos e interacción. Conserva las cartas originales salvo que quieras cambiarlas deliberadamente. Los párrafos separados por una línea en blanco se muestran como párrafos de lectura.

Las fechas usan un offset explícito `-05:00` y el calendario de Ecuador. El capítulo 1 se abre el **23 de noviembre de 2026**; el 5, el **27 de noviembre**. No cambies las fechas en la interfaz: el servidor es la fuente de verdad. Las dedicatorias iniciales son frases generales; no afirman lugares ni anécdotas que no se proporcionaron.

## Canciones configuradas

En cada capítulo de `src/content/chapters.ts`, actualiza `song.url` con un enlace oficial compatible:

| Capítulo | Canción | Artista | Pendiente |
| --- | --- | --- | --- |
| 1 | Eres | Café Tacvba | URL oficial |
| 2 | El Embrujo | Morat | URL oficial |
| 3 | Arroyito | Fonseca | URL oficial |
| 4 | Amor del bueno | Reyli Barba | URL oficial |
| 5 | Ángel | Elefante | URL oficial |

Usa una URL de canción de Spotify (`https://open.spotify.com/track/ID`) o de vídeo de YouTube (`https://www.youtube.com/watch?v=ID` o `https://youtu.be/ID`). No uses enlaces de descarga MP3 ni enlaces acortados ajenos a la plataforma. El reproductor se abre mediante una acción de Jenni; los controles reales pertenecen a la integración oficial. Con una URL vacía se muestra un estado pendiente.

## Fotografías

`scripts/prepare-photos.mjs` relaciona cada ID con un original de `Imagenes`. `src/content/photo-manifest.ts` relaciona ese ID con su archivo WebP, día de apertura, texto alternativo y dedicatoria. `chapter: 0` significa disponible en la bienvenida; 1–5 exige que el capítulo correspondiente ya esté abierto.

| ID / archivo en private-media | Original inicial en Imagenes | Disponible |
| --- | --- | --- |
| `welcome.webp` | `Screenshot_20260507_170828_WhatsApp.jpg` | Bienvenida |
| `first-moments.webp` | `20250516_165933.jpg` | Día 1 |
| `jenni-smile.webp` | `Screenshot_20260507_170828_WhatsApp.jpg` | Día 2 |
| `memory-01.webp` | `20250518_102716.jpg` | Día 3 |
| `memory-02.webp` | `20250608_172637.jpg` | Día 3 |
| `memory-03.webp` | `20251019_180908.jpg` | Día 3 |
| `memory-04.webp` | `20260115_121023.jpg` | Día 3 |
| `memory-05.webp` | `20260126_180609.jpg` | Día 3 |
| `memory-06.webp` | `IMG_20240801_162328_785.jpg` | Día 3 |
| `together.webp` | `20250518_131935.jpg` | Día 4 |
| `birthday.webp` | `20251127_102031.jpg` | Día 5 |
| `gift.webp` | `VideoCapture_20240901-182259.jpg` | Día 5 |

La bienvenida y el capítulo 2 reutilizan intencionalmente la misma fotografía. La del cumpleaños se mantiene reservada hasta el viernes. Estas asociaciones no pretenden afirmar la fecha real de ningún recuerdo. Puedes sustituirlas por las que prefieras.

Para cambiar una fotografía:

1. Coloca el nuevo original en `Imagenes`.
2. Cambia su nombre en el mapa `sources` de `scripts/prepare-photos.mjs`.
3. Ejecuta `node scripts/prepare-photos.mjs`.
4. Actualiza `alt` y `caption` en `src/content/photo-manifest.ts`.
5. Revisa el resultado en teléfono y en una simulación del día correspondiente.

Para añadir otra, crea un ID nuevo en ambos mapas y añádelo a `photoIds` en el capítulo. Los IDs solo pueden resolver archivos incluidos en la lista del servidor; no se aceptan rutas arbitrarias. Si falta un archivo, la interfaz muestra un marco temporal y la aplicación sigue funcionando.

## Dedicatorias personales del álbum

`src/content/personal-touches.ts` contiene `photoDedications`, un mapa opcional por ID de fotografía. Los seis recuerdos comienzan con `null`: conservan las frases actuales del álbum. Puedes sustituir cada `null` por tus propias palabras, sin tocar la galería ni duplicar la configuración de fotografías. Una cadena vacía o solo con espacios también mantiene la dedicatoria original.

```ts
export const photoDedications: Record<string, string | null> = {
  'memory-01': null,
  'memory-02': null,
  'memory-03': null,
  'memory-04': null,
  'memory-05': null,
  'memory-06': null,
};
```

Escribe únicamente recuerdos o detalles que conozcas. No hay lugares, fechas ni historias nuevas inventadas. La misma dedicatoria se utiliza en el capítulo y en el álbum ampliado. Los IDs desconocidos no añaden fotografías ni hacen aparecer contenido. Las dedicatorias siguen la fecha de autorización de su fotografía.

## Nota de voz privada del cumpleaños

La nota es opcional y permanece desactivada: no se ha generado ni imitado tu voz, y no se muestra un reproductor vacío. Para añadir una grabación real:

1. Graba tu mensaje con el teléfono y guarda el archivo en `private-media/birthday-message.m4a`.
2. En `src/content/personal-touches.ts`, cambia `voiceNoteConfig.filename` de `null` a `'birthday-message.m4a'`.
3. Si deseas una alternativa de lectura, sustituye `transcript: null` por la transcripción real del mensaje. Es opcional y no se inventa automáticamente.
4. Prueba el día 5 con `npm run dev:day -- 5` y escucha la grabación en el teléfono desde el que se usará la sorpresa.

```ts
export const voiceNoteConfig = {
  filename: 'birthday-message.m4a',
  transcript: null,
};
```

También se aceptan archivos `.mp3`, `.ogg`, `.webm` y `.wav`; la reproducción depende del códec y del navegador. Usa únicamente el nombre del archivo, sin carpetas ni URL. El nombre configurado es la única grabación permitida: los parámetros de URL no seleccionan otros archivos. No se aceptan enlaces simbólicos. Si el archivo falta, está vacío o su extensión no está admitida, no aparece la sección; para desactivarla deliberadamente vuelve a `filename: null`.

El mensaje y su transcripción solo se entregan desde el 27 de noviembre de 2026 a las 00:00 de Ecuador. `/api/voice-note` aplica la misma comprobación del servidor, permite solicitudes de rangos para avanzar en el audio y responde sin caché compartida. No pongas la grabación en `public` ni la subas a un servicio externo. La reproducción empieza únicamente cuando Jenni la solicita.

En Vercel, conserva el archivo en `private-media` antes del build y despliegue. `next.config.ts` incluye esta carpeta en el trace de `/api/voice-note`; `.vercelignore` permite subirla mediante CLI. Con Git, sigue la misma precaución documentada para las fotografías: solo repositorio privado o preparación privada antes del build. Después ejecuta `node scripts/audit-bundles.mjs` para verificar también el empaquetado de la grabación configurada.

## Regalo y pruebas

El mensaje final conserva el regalo físico en secreto. Puedes modificar las palabras y el texto del cupón sin revelar qué vas a entregar. No introduzcas datos familiares o anécdotas no confirmadas.

Usa `npm run dev:day -- 0` antes del estreno y los números 1–5 para recorrer cada capítulo. El minijuego y la celebración corresponden al día 5. Para una comprobación completa, ejecuta `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` después de editar.

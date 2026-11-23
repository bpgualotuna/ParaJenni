# Guía para personalizar el universo

Todo el contenido se edita en el servidor. No pegues cartas futuras en componentes cliente ni pongas imágenes personales en `public`.

## Cartas y capítulos

`src/content/chapters.ts` contiene la configuración de los cinco capítulos: fecha, título, estrella, introducción, carta, canción, fotos e interacción. Conserva las cartas originales salvo que quieras cambiarlas deliberadamente. Los párrafos separados por una línea en blanco se muestran como párrafos de lectura.

Las fechas usan un offset explícito `-05:00` y el calendario de Ecuador. El capítulo 1 se abre el **23 de noviembre de 2026**; el 5, el **27 de noviembre**. No cambies las fechas en la interfaz: el servidor es la fuente de verdad. Las dedicatorias iniciales son frases generales; no afirman lugares ni anécdotas que no se proporcionaron.

## Canciones pendientes

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

## Regalo y pruebas

El mensaje final conserva el regalo físico en secreto. Puedes modificar las palabras y el texto del cupón sin revelar qué vas a entregar. No introduzcas datos familiares o anécdotas no confirmadas.

Usa `npm run dev:day -- 0` antes del estreno y los números 1–5 para recorrer cada capítulo. El minijuego y la celebración corresponden al día 5. Para una comprobación completa, ejecuta `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` después de editar.

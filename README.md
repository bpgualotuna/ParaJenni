# Nuestro pequeño universo

**Cinco estrellas, un mismo amor.** Una sorpresa de cumpleaños para Jenni: cinco capítulos del 23 al 27 de noviembre de 2026, con cartas, fotos reales, canciones voluntarias y un regalo secreto. Cada capítulo se abre a las 00:00 de Ecuador (`America/Guayaquil`, UTC−05:00). Después del cumpleaños todos permanecen disponibles.

## Ejecutar

Requiere Node.js 20.9 o superior (se recomienda una versión LTS vigente) y npm.

```powershell
npm install
npm run dev
```

Abre la dirección local que indique Next.js, normalmente `http://localhost:3000`. Para probar el servidor de producción:

```powershell
npm run build
npm start
```

Next.js App Router, React y TypeScript; Tailwind CSS, Motion, canvas-confetti, Lucide, Next/Image y Sharp. `package-lock.json` fija las versiones instaladas. No requiere base de datos.

## Arquitectura

```text
src/app/                  Rutas, páginas de servidor y endpoints
src/components/universe/ Bienvenida, cielo y constelación
src/components/chapter/  Sobre, carta, música e interacciones diarias
src/components/album/    Polaroids y galería ampliada
src/components/celebration/ Cumpleaños, minijuego, cofre y cupón
src/content/              Cartas, canciones y asociaciones de fotografías
src/lib/server/           Reloj autorizado, desbloqueos y acceso a contenido
src/lib/types.ts          Contratos compartidos sin contenido personal
private-media/            WebP privados preparados (fuera de public)
Imagenes/                 Originales privados proporcionados
scripts/                  Preparación de fotos y simulación de días
tests/                    Pruebas de fechas y privacidad
```

Las cartas y fotografías futuras no se incluyen en las respuestas del servidor. Las rutas y los endpoints usan la misma lógica de autorización; cambiar el reloj del teléfono no abre un capítulo. Las respuestas personales se entregan sin caché compartida. El progreso local solo guarda bienvenida, visitas e interacciones; nunca decide qué contenido puede verse.

La bienvenida puede repetirse. La constelación muestra las cinco estrellas y cuenta hasta la próxima apertura; el estado se vuelve a consultar automáticamente. Desde el miércoles se abre el álbum. El viernes incluye celebración repetible, carta y cinco estrellas que permiten abrir el cofre.

## Personalizar

Consulta [CONTENT_GUIDE.md](CONTENT_GUIDE.md) para la tabla completa de imágenes y cambios de música/texto. Las fotografías proporcionadas ya tienen una asociación inicial editable; no se han usado fotos de otras personas. Las cinco canciones ya tienen los enlaces de YouTube proporcionados. El reproductor se carga solo cuando Jenni decide escucharlo.

Para regenerar las imágenes optimizadas después de cambiar los originales:

```powershell
node scripts/prepare-photos.mjs
```

El script respeta la orientación, limita el tamaño a 1600 px, convierte a WebP y elimina metadatos EXIF. No recorta rostros. Mantén `Imagenes` y `private-media` fuera de `public`.

## Probar los cinco días

Detén el servidor de desarrollo anterior y elige una simulación:

```powershell
npm run dev:day -- 0
npm run dev:day -- 1
npm run dev:day -- 2
npm run dev:day -- 3
npm run dev:day -- 4
npm run dev:day -- 5
```

Ejecuta **un comando a la vez**. El día 0 es anterior al estreno; los días 1–5 corresponden al 23–27 de noviembre. El script configura `DEV_NOW` exclusivamente en el proceso de desarrollo. Para volver a la fecha real, detén ese proceso y ejecuta `npm run dev`. No cambies el reloj del equipo.

También puedes definir una hora concreta de prueba en `.env.local`, por ejemplo `DEV_NOW=2026-11-24T00:00:00-05:00`, y reiniciar `next dev`. `DEV_NOW` se ignora siempre en producción, aunque exista allí por error. Ninguna URL ni cookie activa la simulación. Para repetir la primera visita utiliza el botón de bienvenida o borra los datos locales del sitio.

## Validación

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Las pruebas cubren los límites de medianoche, la disponibilidad acumulada, el reloj autorizado y la protección del contenido. Los resultados de la ejecución de entrega se informan en el resumen final; este archivo no presupone que un comando haya pasado.

## Publicar en Vercel

Este proyecto necesita servidor Node.js: **no uses una exportación estática**, porque expondría cartas futuras o impediría los desbloqueos. No hace falta PostgreSQL ni almacenamiento externo para esta versión.

La vía más directa conserva las imágenes fuera de Git y publica el directorio local mediante Vercel CLI:

```powershell
npx vercel login
npx vercel
```

Elige el proyecto y acepta la detección de Next.js. La primera publicación es de vista previa; revisa el resultado y luego publica producción:

```powershell
npx vercel --prod
```

`.vercelignore` excluye originales, capturas y archivos locales; permite incluir `private-media`. Comprueba antes del despliegue que contiene los 12 `.webp`. `next.config.ts` incluye expresamente esta carpeta en el trazado de la función `/api/photos/*`, para que los archivos existan en Vercel y no solo en tu equipo. Más información: [archivos en Vercel Functions](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) y [exclusiones con .vercelignore](https://vercel.com/docs/deployments/vercel-ignore).

Si prefieres integración con Git, crea **un repositorio privado**. Las fotografías están ignoradas para impedir subirlas por accidente: incorpóralas explícitamente solo a ese repositorio privado o añádelas durante un paso privado previo al build. No publiques un repositorio que contenga cartas y fotografías personales. Las fuentes musicales se cargan desde plataformas externas solo tras la interacción prevista.

No se ha creado una cuenta, repositorio remoto ni despliegue en tu nombre. Necesitarás acceso a tu cuenta de Vercel para obtener el enlace compartible.

## Privacidad y límites

Los metadatos `noindex` y la cabecera `X-Robots-Tag` desaconsejan la indexación, pero **no sustituyen una contraseña**. La versión inicial no tiene autenticación: cualquiera que tenga el enlace puede ver el contenido ya desbloqueado. Antes de compartirlo, decide si basta con mantener el enlace privado o si quieres añadir una contraseña de acceso. El desbloqueo por fecha protege las sorpresas futuras, no el contenido que ya se ha abierto. Las fotos y cartas descargadas o capturadas por una visitante no pueden revocarse.

No hay analítica ni rastreadores propios. Los reproductores oficiales pueden comunicarse con Spotify o YouTube al abrirse. Los proveedores y tu cuenta de alojamiento tienen acceso operativo a los archivos desplegados. Conserva una copia privada de este directorio para guardar el recuerdo a largo plazo.


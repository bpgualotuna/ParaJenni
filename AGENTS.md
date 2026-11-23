# Reglas del proyecto para Codex

## Propósito y contenido

Experiencia de cumpleaños para Jenni, «Mi Princesita», titulada «Nuestro pequeño universo — Cinco estrellas, un mismo amor». Respeta el texto proporcionado y el contexto de una relación de 2 años y 5 meses, casi a distancia. No inventes fechas, lugares, hijos, recuerdos ni detalles familiares. Habla de respeto y aprendizaje mutuo; no romantices las dificultades. Nunca reveles el regalo físico.

## Identidad visual

Lee `PRODUCT.md`, `DESIGN.md` y la implementación antes de cambiar el diseño. Mantén noche azul/violeta, estrellas doradas, acentos rosa, papel crema y fotografías reales estilo polaroid. La constelación es la navegación, no un dashboard. Las cartas necesitan excelente contraste, ancho cómodo y tipografía legible. El cumpleaños tiene una celebración propia. Evita saturar todas las pantallas con efectos.

## Arquitectura y seguridad

- Next.js App Router, React, TypeScript estricto y componentes propios reutilizables.
- Configuración personal centralizada en `src/content`; módulos de contenido marcados `server-only`.
- Reloj y autorización exclusivamente del servidor, calendario `America/Guayaquil`, del 23 al 27 de noviembre de 2026 a las 00:00.
- Toda página y endpoint aplica la misma validación. Jamás envíes cartas o fotografías bloqueadas a HTML, RSC, JSON, metadatos o bundles del navegador.
- `localStorage` solo conserva preferencias y progreso. No autoriza accesos ni sustituye la comprobación de fecha.
- `DEV_NOW` solo funciona cuando `NODE_ENV === 'development'`. No implementes simulación en producción mediante cookies, parámetros, encabezados o datos del cliente.
- Mantén respuestas personales sin caché compartida y evita exposición por Next/Image: las imágenes privadas se sirven desde el endpoint protegido y no desde la caché pública del optimizador.
- Fotos solo en `private-media`, nunca en `public`; ID de lista permitida, sin lecturas de rutas arbitrarias. Preserva `outputFileTracingIncludes` para el empaquetado de Vercel.
- Repositorio privado. No publiques originales, metadatos EXIF, secretos ni capturas privadas. No añadas analítica o servicios externos para imágenes.
- Noindex no es autenticación. Documenta esta limitación con claridad; cualquier autenticación futura debe proteger también los endpoints.

## Componentes y experiencia

Separa contenido, comportamiento y presentación. Antes de crear un componente, busca si existe uno reutilizable para sobres, cartas, fotos, música, estrellas o celebraciones. No dupliques cartas ni fuentes de verdad. Música solo con enlaces oficiales Spotify/YouTube, tras interacción, sin reproducción falsa ni descargas no autorizadas. Fotos ausentes y enlaces vacíos deben tener una alternativa cuidada.

Prioriza teléfono: áreas táctiles de al menos 44 px, sin desbordamiento horizontal, navegación con teclado, foco visible, textos alternativos útiles, cierre de diálogos y respeto a `prefers-reduced-motion`. La animación nunca debe impedir leer o completar una interacción. Evita cortes de rostros y conserva orientación de las fotos.

## Validación de cambios

Ejecuta los checks apropiados: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Prueba límites de medianoche de cada día, acumulación de capítulos disponibles y ausencia de contenido futuro en respuestas y bundles públicos. Verifica rutas directas y fotografías bloqueadas. Revisa móvil y escritorio en navegador cuando esté disponible; no declares un check como aprobado si no lo ejecutaste.

Para cambios de contenido o fotos, mantén `CONTENT_GUIDE.md` actualizado. No realices despliegues o cambios de audiencia si no están autorizados en la conversación. Usa ramas `feature/descripcion` y Conventional Commits en inglés si trabajas con Git; no crees un remoto público para este material.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

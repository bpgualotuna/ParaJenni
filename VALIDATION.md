# Verificación de entrega

Ejecutada el 23 de noviembre de 2026. Este registro diferencia pruebas reales de compatibilidad prevista.

## Comprobaciones automatizadas

- `npm run lint`: sin errores ni advertencias.
- `npm run typecheck`: correcto.
- `npm test`: 17 pruebas de fechas, contenido privado, fotos y enlaces musicales aprobadas.
- `npm run build`: compilación de producción correcta; todas las páginas de contenido son dinámicas.
- `node scripts/audit-http.mjs http://localhost:3001`: 22 comprobaciones aprobadas contra el servidor de producción.
- `node scripts/audit-bundles.mjs`: 18 archivos públicos sin cartas completas, mensaje del regalo ni narrativa futura del cumpleaños, juego o cupón.
- La traza `.nft.json` de la ruta de fotos incluye los 12 WebP privados.
- Producción ignora una variable `DEV_NOW` con fecha futura y conserva la fecha real del servidor.

Las pruebas cubren el milisegundo anterior, el instante exacto y el posterior a las cinco medianoches de Ecuador; acceso acumulado; fechas posteriores al cumpleaños; manipulación de consultas/cookies; identificadores de fotos permitidos; archivos ausentes; redimensionado y eliminación de EXIF; respuestas sin caché; enlaces oficiales de YouTube y Spotify.

## Navegador

Revisado en el navegador Chromium disponible, con escritorio y pantalla de 390 × 844:

- Bienvenida, inicio del viaje, persistencia y repetición.
- Constelación, cinco estados, primera carta disponible y regreso al universo.
- Sobre, carta progresiva y opción de mostrarla completa; fotografía real legible.
- Los cinco corazones del martes y los cinco deseos del jueves.
- Unión de las dos estrellas del miércoles.
- Álbum de seis fotos; ampliación, siguiente, Escape y retorno del foco.
- Celebración del viernes y repetición de su cuenta regresiva.
- Carta final, habilitación del regalo, cinco estrellas, llave, cofre y cupón; reinicio del juego.
- Fotografías cargadas y ausencia de desplazamiento horizontal en los recorridos revisados.

## Límites reales

No se ha publicado la aplicación ni probado en un iPhone/Safari físico. Las cinco canciones esperan sus URLs: el parser y el estado pendiente están probados, pero la reproducción de esas canciones concretas requiere enlaces válidos y disponibilidad de sus plataformas.

El calendario protege contenido futuro; no hay autenticación de visitantes. Cualquier persona con el enlace puede consultar el contenido que ya esté desbloqueado. `noindex` no equivale a una contraseña. La publicación debe conservar las imágenes fuera de rutas estáticas y el repositorio privado.

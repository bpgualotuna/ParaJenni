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

## Mejoras verificadas el 24 de noviembre de 2026

- Lint y TypeScript sin errores ni advertencias; build de producción correcto.
- 34 pruebas aprobadas: fechas, privacidad, personalización, rangos de audio, enlaces y progreso local validado.
- Auditoría de bundles: 18 archivos públicos sin cartas ni narrativa privada del cumpleaños; los 12 WebP siguen incluidos en la función de fotos.
- Producción: 23 comprobaciones HTTP aprobadas, con solo los capítulos 1 y 2 disponibles. `DEV_NOW=2030` se ignoró. La nota de voz continúa inaccesible antes del cumpleaños.
- Navegador: reproducción real de «El Embrujo» dentro de YouTube, cierre que detiene el reproductor y música antes del sobre en los días 2–5.
- Cinco corazones alrededor de la fotografía: constelación completa y progreso conservado tras recarga.
- Cinco deseos: elección y cambio mediante controles nativos; selección conservada tras recarga.
- Revisados móvil de 390 × 844, controles de 44 px en 320 px y cumpleaños de escritorio en 1440 × 900. Sin desbordamiento horizontal en los recorridos comprobados.
- Cupón real generado, guardado y abierto como PNG de 1080 × 1340. La vista previa y los enlaces alternativos permiten conservarlo en el teléfono.
- Las dedicatorias originales continúan hasta recibir textos personales. La nota de voz permanece oculta mientras no haya una grabación real configurada. La reproducción de una grabación personal y el guardado en Safari/iPhone físico quedan pendientes de ese recurso y dispositivo.

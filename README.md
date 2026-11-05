# Entrega y comprobaciones

Web estática en español, cuatro páginas: inicio, carta, opiniones e información. Ejecutar `npm run build`, `npm run check` y `npm start` dentro de web. El resultado desplegable está en dist.

## Contenido
57 platos y 6 extras transcritos de fotografías públicas de la carta. Los precios requieren confirmación del restaurante; un precio ilegible figura como Consultar. Horarios, teléfono y ubicación contrastados con Google Maps el 05/11/2026. Las reseñas son tres extractos atribuidos a Google en directorios públicos, con acceso al listado de Google; no existe sincronización automática. Fuentes y limitaciones están visibles en informacion.html.

Cinco imágenes recreadas con IA a partir de fotografías del negocio: fachada, terraza, ibéricos, croquetas y carnes. Se preservaron los platos de barro, alimentos, mobiliario y colores del local, mejorando iluminación, encuadre y detalle. Se muestran como recreaciones, no como fotografías originales. WebP en dos resoluciones. No hay imágenes pendientes ni contenido vacío.

## Diseño y validación
Paleta crema y oliva, Literata y Figtree, hero fotográfico place, navegación split, cierre tipográfico y columnas. Entradas finitas, hover de fotos y tarjetas, transiciones entre páginas, menú móvil y control de movimiento reducido.

- Comprobación propia: PASS, 4 páginas, 95 enlaces/recursos locales, 63 filas de carta, atributos accesibles, datos estructurados.
- Chrome: revisados anchos 1440, 1024, 820, 768 y 390. Capturas del inicio y carta móvil. Sin texto cortado, recursos rotos ni desbordamientos en comprobación de consistencia.
- Rendimiento: 0 FAIL, 5 WARN. Transferencia completa 1,79 MiB escritorio y 533 KiB móvil, 0 saltos de layout. Advertencias por peso de fotografía de portada y CPU del entorno. Una muestra local por tamaño; no es una medición de usuarios reales.
- Los controles de la skill no pasan íntegramente. Excepciones intencionadas: español no reconocido por su heurística de textos; contacto real solicitado por el usuario; fotografías IA y animaciones por petición expresa; secciones móviles crecen según contenido; reseñas sin fotografía; bloques de texto alineados a columnas interiores. El stress test altera el título y avisa de una tercera línea, aunque el título real cabe en dos. Los controles de cuadrícula confunden columnas interiores con bordes exteriores. Se corrigieron el pie de página y la selección de resolución de imágenes en tableta.

Las capturas y resultados detallados están en shots y qa-report, excluidos de publicación. No se han probado reservas telefónicas reales ni la vigencia comercial de los precios.

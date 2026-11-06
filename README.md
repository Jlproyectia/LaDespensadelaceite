# La Despensa del Aceite — web

## Idiomas

El selector superior SN / EN abre la misma página en español o inglés. Las seis páginas tienen versiones estáticas en ambos idiomas, disponibles incluso sin JavaScript. Las versiones inglesas usan el sufijo `.en.html` y mantienen el idioma en la navegación.

`build-languages.mjs` genera las versiones inglesas con `data/ui-en.json` y `data/attributes-en.json`. `data/reviews-es.txt` contiene los 143 extractos traducidos al español, en el mismo orden que los textos conservados en `data/google-five-star.tsv`. `src/i18n.js` traduce los mensajes dinámicos y define el idioma del calendario. La compilación detecta textos sin traducción; `npm run check` comprueba las doce páginas, los enlaces de idioma y las reseñas.

Sitio estático de cuatro páginas, en español. `npm run build` genera dist; `npm run check` valida enlaces, datos e imágenes; `npm start` abre el servidor local en el puerto 4173.

## Edición
- `redesign.mjs`: estructura y textos de las páginas.
- `src/site.css`: diseño responsive, tipografías y movimiento.
- `src/site.js`: navegación, buscador, galería, horarios y preferencias de movimiento.
- `data/menu.json`: 57 platos y 6 extras. Los precios provienen de fotografías públicas y necesitan confirmación del restaurante. El precio ilegible se muestra como Consultar.
- `src/information.html`: fuentes, créditos y privacidad.
- `data/images-v2.json` y manifiesto de categorías: referencias y prompts de imágenes. Los originales se conservan en source-images, fuera de la publicación; los WebP en dist/images son los archivos usados por la web.

## Dirección visual
Portada gastronómica, Cormorant Garamond y DM Sans, papel cálido y oliva, composición asimétrica, fotografías ampliables, reseñas compactas y contacto legible. Las categorías de la carta tienen fotografías diferentes, con encuadres amplios. Se mantienen los datos del restaurante y enlaces a Google. La selección de reseñas no se sincroniza automáticamente.

Las imágenes se recrean con IA a partir de referencias fotográficas y descripciones de la carta. Las categorías sin foto directa son interpretaciones ilustrativas; no se garantiza la presentación real. Esta información figura también en el sitio.

## Comportamiento
Entradas escalonadas, transición entre páginas, desplazamiento fotográfico suave y efectos de interacción. Se respetan las preferencias de movimiento reducido y existe un botón para pausar las animaciones. El contenido permanece visible sin JavaScript.

La carta admite búsqueda sin distinguir tildes, estado sin resultados, borrado y navegación por categorías. Imprimir restaura antes la carta completa. Las fotografías se abren en un diálogo accesible y devuelven el foco al cerrar.

## Comprobaciones
Búsqueda de croquetas: 3 resultados. Consulta inexistente: aviso específico. Borrar: 63 elementos restaurados. Galería: apertura/cierre comprobados. Navegación móvil: abre, navega y cierra. Control de animaciones: activa/desactiva. Sin desbordamiento horizontal en la comprobación móvil. Capturas y mediciones locales se conservan en shots y qa-report, excluidos de publicación.

Datos contrastados el 05/11/2026. Horarios sujetos a festivos. Las reservas enlazan al teléfono real; no hay formulario ficticio ni analítica.

Validación final: 15 fotografías únicas, 11 fotos distintas de categoría, 104 enlaces y recursos locales comprobados, 63 filas de carta. Capturas finales en shots/final-home-1440.png y shots/final-carta-390.png. Referencias fotográficas finales en data/local-category-images.json.

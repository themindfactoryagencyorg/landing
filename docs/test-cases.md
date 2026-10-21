# Team profiles

Automated behavior checks: `node --test tests/team.test.cjs`.
These checks cover state and markup; they do not certify browser rendering.

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| TEAM-M01 | En móvil, al entrar en `#equipo`, solo se muestran nombre, apellidos, profesión e indicador de apertura de las siete personas. | Estado automático; render pendiente a 320, 390 y 650 px. |
| TEAM-M02 | Al tocar el encabezado se muestran foto y descripción; al volver a tocarlo se cierran. Cada ficha funciona de forma independiente. | Estado automático; interacción táctil pendiente. |
| TEAM-M03 | El control se alcanza con Tab, tiene nombre accesible con nombre y profesión, se activa con Enter/Espacio y anuncia expandido/contraído. | Marcado automático; teclado y lector de pantalla pendientes. |
| TEAM-M04 | Todas las fichas se cargan cerradas en móvil, también al refrescar con un enlace directo a una persona. Cambiar el fragmento de la URL no abre fichas; solo se abren al tocar su encabezado. | Regresión automática de carga, fragmento y recarga. |
| TEAM-R01 | En escritorio se muestran todas las fichas, con tres personas arriba y cuatro abajo. Al volver a móvil se conserva la selección anterior. | Estado automático; render pendiente a 651, 1100 y 1440 px. |
| TEAM-I01 | Español e inglés conservan nombres, fotos y descripciones; el control usa la profesión traducida como parte de su nombre accesible. | Relaciones de marcado automáticas; cambio de idioma visual pendiente. |
| TEAM-A01 | Con movimiento reducido el despliegue funciona sin animación. Sin JavaScript, el contenido completo continúa disponible. | Revisión de código; navegador pendiente. |
| TEAM-P01 | Las siete fotos mantienen proporción y calidad; los apellidos largos no desbordan la pantalla. | Recursos y dimensiones automáticos; render pendiente. |

La revisión manual anterior del usuario corresponde a la presentación anterior;
no valida este nuevo desplegable. La automatización del navegador permanece pendiente
por el fallo al verificar permisos de Browser Use para el origen local.

# SEO técnico (seo/minor-fixes-2026-10)

Comprobaciones automáticas: `node --test tests/seo.test.cjs`.

| ID | Criterio de aceptación | Verificación |
| --- | --- | --- |
| SEO-01 | `/robots.txt` permite el sitio, bloquea `/docs/`, `/tests/` y `/CLAUDE.md`, deja rastrear `/acceso.html` (para que se lea su `noindex`) y declara el sitemap. | Automática; tras desplegar, `curl -sI https://themindfactory.es/robots.txt` debe dar `text/plain`. |
| SEO-02 | `/sitemap.xml` contiene exactamente la portada y las tres páginas legales; ninguna lleva `noindex`. | Automática; tras desplegar, `content-type` XML. |
| SEO-03 | Portada y páginas legales tienen canonical, Open Graph y Twitter Card, con la imagen `og-tmf-1200x630.jpg` existente. | Automática; tras desplegar, inspector de publicaciones de LinkedIn. |
| SEO-04 | Título y descripción de la portada coinciden entre `index.html` y `js/i18n.js`, incluyen "software a medida" y no usan rayas. | Automática. |
| SEO-05 | El JSON-LD se analiza sin errores y contiene `Organization` (con zona de servicio, temas, contacto y catálogo de servicios) y `WebSite`; sin `LocalBusiness`. | Automática; Rich Results Test y validator.schema.org pendientes tras desplegar. |
| SEO-06 | Los siete retratos describen persona y rol; el botón "Hablemos de tu negocio" abre el correo con asunto y preguntas guía (sector, tamaño, gestión de pedidos o partes). | Automática; apertura real en un cliente de correo pendiente. |
| SEO-07 | `assets/logo-white.png` ya no se publica y ningún retrato supera 250 KB. | Automática. |

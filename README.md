# TheMindFactory · Landing principal · 27 octubre 2026

## Estado actual

Publicación principal autorizada expresamente por Juan el 27 de octubre, tras
aprobar el resultado de la revisión. La nueva landing se publica en
https://themindfactory.es/ mediante PR a `main` y el workflow existente
[`Deploy landing`](https://github.com/themindfactoryagencyorg/landing/actions/workflows/deploy.yml).
Los archivos públicos corresponden al snapshot aprobado `a7339737aed508e605216510c5df97219f291190`;
los commits posteriores solo documentan la entrega. No se modifica el workflow.

Antes de integrar se ha conservado y verificado una copia de la web anterior:
`/home/tmf/backups/landing/20261027-before-new-landing/site-582e922.tar.gz`.
Base anterior: `582e92299f7ee7070dfae9318413e89d672620f7`. Para revertir por el
procedimiento habitual, revertir el merge mediante PR a `main`; la copia permite
recuperar además los archivos exactos del servidor. El resultado de GitHub Actions
y la comprobación HTTP y visual posterior identifican la versión efectivamente publicada.
Evidencias locales: `artifacts/production-20261027/` (excluido de Git).

Revisión en un worktree independiente, rama `codex/landing-review-20261026`.
Parte de `b1780c8` e incluye los nueve archivos con cambios locales de
`codex/landing-historia-casos`. La copia anterior sigue intacta.

- Revisión: `http://127.0.0.1:8089/`. Versión anterior: `http://127.0.0.1:8088/`.
- Orden: portada, oferta a medida, tres ejemplos de proyectos, agente, equipo y contacto.
- Equipo con siete perfiles, retratos circulares, biografías más breves y LinkedIn como icono.
- En móvil, los siete nombres completos ocupan una línea. LinkedIn pasa a la
  fila del cargo y las tarjetas cerradas mantienen la misma altura desde 320 px.
- Agente dentro de un iPhone con tonos cálidos y reloj local. Los tres ejemplos usan datos ficticios.
- Un solo roadmap resumido en Contacto, con botón y correo antes de los pasos.
  Se retiraron el método duplicado y el explorador interno de MindHub.
- Navegación móvil con teclado y alternativa sin scripts; foco visible en fondos
  claros, imágenes traducidas y visor ajustado también a pantallas horizontales.
- Acceso deja de ser una página vacía y orienta al cliente hacia el enlace de su aplicación.
- El fondo respeta movimiento reducido y queda atenuado tras el texto de las secciones de lectura.
- Capturas con lupa: en móvil se abren ocupando la altura disponible y se recorren
  lateralmente; en horizontal aprovechan el ancho. Cierre fijo, vista completa
  opcional y arrastre con ratón en escritorio. Los gestos táctiles desplazan la
  página; la ampliación de capturas se controla en el visor.

Sin instalación ni build: `node --test tests/*.test.cjs` y un servidor HTTP
desde la raíz. Inventario y límites de la revisión en `docs/test-cases.md`.
Evidencia, copia inicial y registro del servidor en `artifacts/review-20261026/`
(archivos locales excluidos de Git). La demo privada conserva la versión aprobada,
como se detalla a continuación.

El resto de este documento conserva el historial de las revisiones y despliegues
anteriores; sus referencias de versión describen aquel momento.

### Historial: actualización privada · 27 octubre 2026

Publicada, por petición de Juan, en https://demos.themindfactory.es/d/landing-preview/.
Incluye la revisión aprobada, el nuevo visor y los nombres del equipo en una fila móvil.
Fuente: `a7339737aed508e605216510c5df97219f291190`, preparada con
`preview/prepare.mjs`. Release privada:
`/home/tmf/apps/tmf-landing-preview/releases/20261027-team-names-a733973/`.
Se conserva `20261027-captures-fc96535` para revertir con el mismo proyecto Compose
`tmf-landing-preview` y su `compose.yaml`.

Los 52 archivos servidos coinciden por SHA-256 con el paquete aprobado.
El contenedor mantiene montajes de solo lectura, la red `tmf-prod-network`,
ningún puerto publicado y cabeceras `noindex, nofollow` y `private, no-store`.
Sin sesión, página, JavaScript y foto redirigen a TMF Auth. La landing pública
conserva el mismo SHA-256 antes y después; no se modifica `main`, el portal,
TMF Auth ni sus permisos. El navegador de este ordenador llega al login:
queda pendiente comprobar visualmente esta publicación con una sesión autenticada.
La revisión funcional y responsive local corresponde a los mismos archivos fuente.

Paquete, manifiesto, estado anterior, hashes servidos y comprobaciones HTTP en
`artifacts/team-names-20261027/` (local, excluido de Git). Suite 19/19 y 84
comprobaciones de nombres en seis anchos y ES/EN. La evidencia del visor anterior
se conserva en `artifacts/capture-20261027/`. El gesto nativo de doble toque en un iPhone físico
queda pendiente; no se confunde con dobles clics en el navegador de escritorio.
Esto actualiza la demo de
revisión; no acredita los gates DEV/PRELIVE/PROD de una publicación principal.

## Contexto anterior · 22 octubre 2026

**Para continuar en otro ordenador:** [traspaso del 26 de octubre](docs/handoff-20261026.md).

Rama `codex/landing-historia-casos`, sobre `origin/main` (`582e922`).
Vista local: `http://127.0.0.1:8088/`. No se ha publicado en el dominio principal.
La revisión privada actual usa TMF Auth en el portal de demos (ver más abajo).

## Ajustes del equipo · 22 octubre 2026

- Siete LinkedIn contrastados en los contactos de Juan en Chrome; enlaces personales en cada ficha.
- Nombre visible: Víctor Manuel Ramírez. Fichas móviles con fondo opaco.
- Contactar permanece visible en la cabecera fija, también en móvil y con el menú abierto.
- Capturas en diálogo nativo: ajuste a pantalla, tamaño real con desplazamiento, cierre con botón/Escape y devolución del foco. Sin JavaScript se conserva el enlace al archivo original.
- La simulación usa tonos azules, mensajes diferenciados y confirmaciones delineadas; el menta identifica los CTA de la web.

Comprobación: 11 pruebas locales aprobadas, sintaxis JS y recursos verificados.
La política del navegador bloqueó la inspección de la landing en esta sesión;
no se ha sorteado el bloqueo ni certificado responsive o el visor en navegador.
El refresco completo del baúl se ejecutó, con fuentes degradadas (Wiki, Jira y
WhatsApp); estos cambios dependen del código local y de los perfiles confirmados.
La incidencia de acceso al enlace queda aparcada por indicación de Juan.
La copia privada se ha actualizado desde `54b66f245bb0fef571047889dda0f360688d0481`.
Los cinco archivos modificados servidos coinciden con el snapshot por SHA-256;
página, JavaScript y foto siguen redirigiendo a TMF Auth sin sesión.
Evidencia local: `artifacts/team-feedback-20261022/`.

La portada presenta la oferta de software a medida. A continuación explica
aplicaciones, integraciones y automatizaciones, muestra tres casos del documento
de referencia y destaca el agente de IA con tres ejemplos ilustrativos.
MindHub y el explorador existente quedan dentro de un desplegable opcional.
Se conservan las siete fichas del equipo, ES/EN y las páginas legales.
El contacto explica diagnóstico, propuesta y estimación de alcance, coste y plazos.

Se ha contrastado el contenido con la web anterior (`582e922`): recuperamos
los problemas de WhatsApp, Excel e información dispersa y la oferta para equipos
en campo. Inventario y decisiones en `docs/content-check-20261022.md`.

- `story.css`: composición de las nuevas secciones y ajustes responsive.
- `js/agent.js`: simulación local; no usa APIs ni ejecuta acciones reales.
- `assets/cases/`: capturas extraídas del HTML v9 facilitado por el usuario.
- `PRODUCT.md`: contexto de diseño para esta revisión.
- Pruebas: `node --test tests/*.test.cjs`. Inventario en `docs/test-cases.md`.

Revisión de navegador realizada en Windows a 320, 390, 650, 651, 1100 y 1440 px.
Evidencias locales en `artifacts/landing-historia-casos/` (fuera del commit).
No se ha certificado el gate de release: faltan el harness de TMF en este
equipo, movimiento reducido en navegador, lector de pantalla y dispositivos reales.
El baúl no está inicializado; el instalador canónico importa `fcntl`, que
no está disponible en el Python de este Windows. No se ha usado el baúl como fuente.
DEV, PRELIVE y PROD quedan pendientes y fuera del alcance de esta propuesta local.
Antes de publicación, revisar la autorización de uso público de nombres y capturas.

Actualización local del 22 de octubre: Laura, Juan y Agustín usan recortes
transparentes `*-cutout.webp` sobre un único `patio-common.webp`, todos a
1122 × 1402. La posición y escala del fondo son idénticas en los tres retratos.
ImageGen prepara el fondo y los recortes; la web reutiliza el mismo recurso.
Se conservan las fotografías anteriores. Los PNG y prompts de edición se
guardan en `../output/team-patio-20261022/`.

## Revisión actual con TMF Auth · 22 octubre 2026

URL: https://demos.themindfactory.es/d/landing-preview/

Reutiliza el login habitual de TMF Auth y el proxy autorizado del portal de demos.
Los siete miembros activos de Matrix tienen permiso para `landing-preview`;
no se les han concedido permisos nuevos sobre otras demos. Las dos concesiones
comodín preexistentes pertenecen también a miembros de ese equipo.

- Portal: `tmf-demos` commit `4e91cbfb483d6eedf12692961b551c9734c37abb`, PR #7 integrada.
- Copia estática: `54b66f245bb0fef571047889dda0f360688d0481` de esta rama.
- Servicio privado: `tmf-landing-preview`, sin puertos publicados.
- Release: `/home/tmf/apps/tmf-landing-preview/releases/20261022-feedback/`.
- `preview/prepare.mjs` copia solo los archivos públicos, adapta HTML/CSS al prefijo protegido, añade noindex y valida recursos. Los JavaScript se conservan byte a byte y pasan comprobación de sintaxis.
- `preview/compose.yaml` fija la imagen estática por digest y monta los archivos en solo lectura.

Para preparar otra copia, confirma primero los cambios públicos en Git y ejecuta
`node preview/prepare.mjs <directorio-absoluto-nuevo>/site`. La salida debe ser
nueva; no sobrescribe snapshots. Copia `preview/Caddyfile` y `preview/compose.yaml`
al directorio padre de `site` y publica esa release en el mismo servicio privado.
El portal solo requiere otro despliegue si cambia su catálogo o su código.
Esta publicación no sincroniza automáticamente cambios futuros de la landing.

Validación anterior (`20261022-v3`): las 10 pruebas de la landing y las 11 del gate HTTP del portal pasan;
backend/frontend compilan. En remoto, login real completado por Juan, vuelta a
la landing, ES/EN, casos, confirmación local del agente, detalle MindHub y equipo
móvil a 390 px; escritorio a 1202 px. Sin errores nuevos en consola ni imágenes
rotas tras corregir el paquete. Sin sesión, página, foto y script redirigen a
TMF Auth. No se han probado las cuentas de las otras seis personas.
Evidencia: `artifacts/landing-tmf-auth-20261022/`.

El despliegue del portal conserva una imagen de rollback y una copia de su fuente
anterior en el VPS; no incluyen cambios en TMF Auth, Caddy del host ni la landing
principal. El portal tiene un único entorno; esto no certifica la escalera
LOCAL/DEV/PRELIVE/PROD de la web principal. El refresco del baúl sigue degradado
por las fuentes documentadas en la revisión anterior.

El build mostró avisos de dependencias ya presentes en el portal. El audit de
runtime del backend cuenta 8 (3 moderados, 4 altos, 1 crítico en `proxy-addr`,
GHSA-jqcg-44mw-7w3h). Los manifests de dependencias y sus locks no se han
actualizado en esta entrega; esta integración no corrige esos avisos.

## Revisión anterior en Sites · 22 octubre 2026

URL: https://tmf-landing-equipo-20261022.darksky27.chatgpt.site

- Site: `appgprj_6ad944cd7dd88191a85488d8a9f78b21`.
- Copia de la landing: `f48d131988575301e9bd95d8b0716d501824501a`.
- Fuente desplegada en Sites: `9cc869319b460e2841c37b431db2bbbfc587d341`.
- Checkout independiente: `../output/landing-team-preview-20261022/`.
- Solo HTML/CSS/JS y recursos estáticos; no se copia el repositorio ni sus documentos a la raíz pública.
- Todos los HTML llevan `noindex, nofollow` y `robots.txt` impide el rastreo.
- Acceso mediante ChatGPT y lista de personas autorizadas. Los siete miembros activos de Matrix están incluidos: propietario y seis lectores. Cada uno debe entrar con el mismo correo registrado en Matrix.

La publicación y la lista de acceso fueron confirmadas por Sites (política
`custom`, revisión 2, siete personas y ningún grupo). Se consultó el directorio
activo de Matrix en modo de solo lectura para resolver los correos autorizados.
El navegador confirmó el requisito de login y, con la sesión del propietario,
la carga de la landing, sus recursos, ES/EN, casos, simulación del agente y menú
móvil a 390 px. Sin desbordamiento ni errores de consola. La landing local
mantiene las 10 pruebas aprobadas. No se ha entrado con las cuentas del resto
del equipo. Evidencia en `artifacts/landing-private-preview-20261022/`. El refresco del baúl quedó
incompleto (Wiki sin API key, Jira sin configuración, WhatsApp sin lector Windows
y repos con actualizaciones pendientes); esta copia se obtiene del commit indicado.

No modifica DNS, el despliegue de la landing principal ni su rama `main`.
Es una copia congelada: los siguientes cambios locales requieren actualizarla
y publicarla de nuevo en el mismo Site. No se habilita sincronización automática.

## Revisión publicada anterior · 14 septiembre 2026

Propuesta revisada en local y aprobada por el usuario para publicación.

Cambios: oferta concreta y contacto en portada, problemas separados de solución,
selector antes del diagrama y estado Conectado inicial, comparación manual sin pin
al scroll, explicación propuesta de MindHub y del servicio a medida, ejemplo
ilustrativo de IA, contacto móvil y ajustes de lectura.

Definición de MindHub y ejemplo ilustrativo de IA incluidos en la propuesta aprobada.
No se han añadido casos reales, resultados, fotos ni nombres del equipo sin material
validado. WhatsApp pendiente de número y forma de atención.

## Estructura

- `index.html`: contenido ES/EN, navegación, soluciones y contacto.
- `styles.css`: identidad visual, layouts y adaptación responsive.
- `js/main.js`: inicialización, reloj, progreso de lectura y transiciones.
- `js/navigation.js`: menú móvil, teclado y foco al elegir destino.
- `js/i18n.js`: idioma, metadatos y preferencia local `tmf-lang`.
- `js/network.js`: diagrama de red proyectado en 3D sobre Canvas 2D.
- `assets/brand/`: B1 vectorial, favicon SVG/ICO e icono Apple.
- `assets/brand/og-tmf-1200x630.jpg`: imagen para compartir (Open Graph y Twitter).
- `robots.txt` y `sitemap.xml`: rastreo e indexación. Al añadir una página indexable, incluirla en el sitemap.
- `assets/vendor/`: GSAP 3.12.5 y ScrollTrigger 3.12.5, servidos localmente.

Las fuentes DM Sans e IBM Plex Mono se sirven desde `assets/fonts/`, con fuentes
de respaldo. La página permanece legible si las fuentes o GSAP no están disponibles.
El Canvas se pausa fuera de pantalla y respeta `prefers-reduced-motion`.
La red atrae e ilumina nodos próximos al cursor. Un clic, toque o activación por
teclado envía un impulso por sus conexiones hasta B1, que responde con luz.
Los gestos verticales y el zoom siguen disponibles en móvil; con movimiento
reducido, la respuesta es una iluminación estática breve, sin recorrido animado.
El explorador de etapas se retiró en la revisión del 26 de octubre.

Los datos de los paneles son ilustrativos. La simulación modifica únicamente el
DOM local: no contacta con APIs ni registra ventas. El contacto abre el programa
de correo del visitante, sin enviar nada automáticamente.

## Publicación existente

`main` es la rama publicada. Un push a `main` dispara `.github/workflows/deploy.yml`.
GitHub Actions copia los archivos por SSH/rsync a
`/home/tmf/apps/tmf-prod/tmf-landing`. Caddy sirve la raíz de `themindfactory.es`.
La configuración de Caddy pertenece a `tmf-infra`; `/app/` redirige a Qrema.

La propuesta actual sigue en `codex/landing-historia-casos`. El traspaso no
autoriza integrarla en `main` ni publicarla en el dominio principal.
El workflow existente no se ha modificado.

## Decisiones editoriales para la revisión

- Los casos presentan Qrema, BodaMúsica y Grupo Madatuta como una selección del
  trabajo, con el material facilitado para la propuesta. El uso público de nombres
  y capturas mantiene la revisión pendiente documentada en el traspaso.
- No se publican estadísticas de mercado, comparaciones de precios o plazos
  garantizados sin respaldo adicional.
- Dirección de contacto confirmada: `info@themindfactory.es`.
- Se omiten cifras de fundadores y empleadores mientras existan diferencias
  entre el brief y la web anterior.

Los CSS y módulos JS incluyen una versión en la URL para evitar mezclar archivos
antiguos en navegadores que ya visitaron la web. Al modificarlos, actualizar la
versión tanto en `index.html` como en los imports de `js/main.js`.

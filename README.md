# TheMindFactory · Propuesta local · 22 octubre 2026

Rama `codex/landing-historia-casos`, sobre `origin/main` (`582e922`).
Vista local: `http://127.0.0.1:8088/`. No se ha publicado en el dominio principal.
La revisión privada actual usa TMF Auth en el portal de demos (ver más abajo).

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
- Copia estática: `9dcac5490a804cb772a65d1fde027e01623a5e98` de esta rama.
- Servicio privado: `tmf-landing-preview`, sin puertos publicados.
- Release: `/home/tmf/apps/tmf-landing-preview/releases/20261022-v3/`.
- `preview/prepare.mjs` copia solo los archivos públicos, adapta HTML/CSS al prefijo protegido, añade noindex y valida recursos. Los JavaScript se conservan byte a byte y pasan comprobación de sintaxis.
- `preview/compose.yaml` fija la imagen estática por digest y monta los archivos en solo lectura.

Para preparar otra copia, confirma primero los cambios públicos en Git y ejecuta
`node preview/prepare.mjs <directorio-absoluto-nuevo>/site`. La salida debe ser
nueva; no sobrescribe snapshots. Copia `preview/Caddyfile` y `preview/compose.yaml`
al directorio padre de `site` y publica esa release en el mismo servicio privado.
El portal solo requiere otro despliegue si cambia su catálogo o su código.
Esta publicación no sincroniza automáticamente cambios futuros de la landing.

Validado: las 10 pruebas de la landing y las 11 del gate HTTP del portal pasan;
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
- `js/main.js`: explorador de Minds, demo local de venta, navegación y transiciones.
- `js/i18n.js`: idioma, metadatos y preferencia local `tmf-lang`.
- `js/network.js`: diagrama de red proyectado en 3D sobre Canvas 2D.
- `assets/brand/`: B1 vectorial, favicon SVG/ICO e icono Apple.
- `assets/logo-white.png`: archivo del logo anterior, conservado pero no utilizado.
- `assets/vendor/`: GSAP 3.12.5 y ScrollTrigger 3.12.5, servidos localmente.

Las fuentes DM Sans e IBM Plex Mono se cargan desde Google Fonts con fuentes de
respaldo. La página permanece legible si las fuentes o GSAP no están disponibles.
El Canvas se pausa fuera de pantalla y respeta `prefers-reduced-motion`.
La red atrae e ilumina nodos próximos al cursor. Un clic, toque o activación por
teclado envía un impulso por sus conexiones hasta B1, que responde con luz.
Los gestos verticales y el zoom siguen disponibles en móvil; con movimiento
reducido, la respuesta es una iluminación estática breve, sin recorrido animado.
En esta propuesta, el selector cambia las tres etapas directamente en todas las
pantallas. La escena no se fija al scroll y empieza en Conectado.

Los datos de los paneles son ilustrativos. La simulación modifica únicamente el
DOM local: no contacta con APIs ni registra ventas. El contacto abre el programa
de correo del visitante, sin enviar nada automáticamente.

## Publicación existente

`main` es la rama publicada. Un push a `main` dispara `.github/workflows/deploy.yml`.
GitHub Actions copia los archivos por SSH/rsync a
`/home/tmf/apps/tmf-prod/tmf-landing`. Caddy sirve la raíz de `themindfactory.es`.
La configuración de Caddy pertenece a `tmf-infra`; `/app/` redirige a Qrema.

El usuario ha aprobado esta revisión para integrarla en `main` y publicarla.
El workflow existente no se ha modificado.

## Decisiones editoriales para la revisión

- La sección 03 presenta soluciones por necesidad (ventas y gestión, proyectos
  y coordinación, equipos y operaciones). No identifica clientes ni sectores
  concretos ni presenta estas posibilidades como casos de éxito entregados.
- No se publican estadísticas de mercado, comparaciones de precios o plazos
  garantizados sin respaldo adicional.
- Dirección de contacto confirmada: `info@themindfactory.es`.
- Se omiten cifras de fundadores y empleadores mientras existan diferencias
  entre el brief y la web anterior.

Los CSS y módulos JS incluyen una versión en la URL para evitar mezclar archivos
antiguos en navegadores que ya visitaron la web. Al modificarlos, actualizar la
versión tanto en `index.html` como en los imports de `js/main.js`.

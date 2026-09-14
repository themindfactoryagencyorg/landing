# TheMindFactory · Feedback del equipo · 14 septiembre 2026

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

# TheMindFactory · Landing

Web institucional de TMF: software a medida con inteligencia integrada para pymes.
HTML, CSS y módulos JavaScript, sin compilación ni dependencias de desarrollo.

## Rediseño aprobado

Rediseño aprobado para publicación el 12 de septiembre de 2026.
Incorpora el logo vectorial B1 y el lema «When AI meets humanity.», fijo en ambos
idiomas. Mantiene el acceso a la aplicación de producción.

```sh
python3 -m http.server 8018 --bind 127.0.0.1
# http://127.0.0.1:8018
```

Hay que servirla por HTTP: los módulos JavaScript y las rutas absolutas no están
pensados para abrir `index.html` mediante `file://`.

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
La escena central se fija al scroll solo en pantallas de al menos 901 × 820 px;
en móvil y movimiento reducido, los controles cambian sus tres etapas.

Los datos de los paneles son ilustrativos. La simulación modifica únicamente el
DOM local: no contacta con APIs ni registra ventas. El contacto abre el programa
de correo del visitante, sin enviar nada automáticamente.

## Publicación existente

`main` es la rama publicada. Un push a `main` dispara `.github/workflows/deploy.yml`.
GitHub Actions copia los archivos por SSH/rsync a
`/home/tmf/apps/tmf-prod/tmf-landing`. Caddy sirve la raíz de `themindfactory.es`.
La configuración de Caddy pertenece a `tmf-infra`; `/app/` redirige a Qrema.

El usuario ha autorizado integrar este rediseño en `main` y publicarlo.
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

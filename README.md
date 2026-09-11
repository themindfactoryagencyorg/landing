# TheMindFactory · Landing

Web institucional de TMF: software a medida con inteligencia integrada para pymes.
HTML, CSS y módulos JavaScript, sin compilación ni dependencias de desarrollo.

## Rediseño en revisión local

La rama `redesign/connected-minds` contiene la propuesta nueva. No está publicada.
Mantiene el logo original y el acceso a la aplicación de producción.

```sh
python3 -m http.server 8018 --bind 127.0.0.1
# http://127.0.0.1:8018
```

Hay que servirla por HTTP: los módulos JavaScript y las rutas absolutas no están
pensados para abrir `index.html` mediante `file://`.

## Estructura

- `index.html`: contenido ES/EN, navegación, casos y contacto.
- `styles.css`: identidad visual, layouts y adaptación responsive.
- `js/main.js`: explorador de Minds, demo local de venta, navegación y transiciones.
- `js/i18n.js`: idioma, metadatos y preferencia local `tmf-lang`.
- `js/network.js`: diagrama de red proyectado en 3D sobre Canvas 2D.
- `assets/logo-white.png`: logo original, sin modificaciones.
- `assets/vendor/`: GSAP 3.12.5 y ScrollTrigger 3.12.5, servidos localmente.

Las fuentes DM Sans e IBM Plex Mono se cargan desde Google Fonts con fuentes de
respaldo. La página permanece legible si las fuentes o GSAP no están disponibles.
El Canvas se pausa fuera de pantalla y respeta `prefers-reduced-motion`.
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

**Este rediseño requiere la aprobación del usuario antes de integrarlo en `main`
o de publicar.** El workflow existente no se ha modificado.

## Decisiones editoriales para la revisión

- Casos anonimizados, basados en el brief recibido. Las próximas fases están
  separadas de las funciones ya descritas como entregadas.
- No se publican estadísticas de mercado, comparaciones de precios o plazos
  garantizados sin respaldo adicional.
- Se mantiene `hola@themindfactory.es`, presente en producción; el brief indica
  `info@themindfactory.es`. Confirmar la dirección elegida antes de publicar.
- Se omiten cifras de fundadores y empleadores mientras existan diferencias
  entre el brief y la web anterior.

# Landing narrative · 21 octubre 2026

## Gestos y visor de capturas · 27 octubre 2026

Run ID: `capture-20261027`. Corrección sobre la revisión publicada `6d3f96f`.
Se conserva el worktree de revisión y la copia de trabajo original.
Publicada en Demos desde `fc965352448f58e5ce6c7d61d7865e5b695a9233`, release
`20261027-captures-fc96535`. Sus 52 archivos servidos coinciden por SHA-256;
página, JS y foto siguen redirigiendo a TMF Auth sin sesión. Se conserva la
release anterior, sin cambios en main ni en el HTML de la web principal.

| ID | Comprobación | Resultado |
| --- | --- | --- |
| CAPTURE-01 | Suite completa, incluida geometría, giro, arrastre de ratón y gestos táctiles sin interceptar. | 19/19 tests, 0 fallos, cancelados u omitidos; sintaxis de los nueve JS y diff check correctos. |
| CAPTURE-02 | Tres casos, ES/EN, 320×640, 390×844, 844×390 y 1440×900. | 24 combinaciones: captura cargada, cierre y controles dentro de la pantalla, vista completa ajustada y sin desbordamiento de la página. |
| CAPTURE-03 | Detalle móvil y giro. | Inicio ampliado a la altura disponible en vertical, desplazamiento lateral; en horizontal aprovecha el ancho y permite desplazamiento vertical. Un solo eje de desplazamiento en móvil. |
| CAPTURE-04 | Cierre por botón/Escape, bloqueo de fondo y devolución de foco. | Foco en el enlace original, fondo desbloqueado y posición de lectura conservada. Gutter estable evita saltos por la barra de scroll de escritorio. |
| CAPTURE-05 | Doble clic repetido en siete perfiles y tres casos. | Controles operativos, escala del viewport 1; política táctil de la página `pan-x pan-y`, sin bloqueo de zoom en el meta viewport. |
| CAPTURE-06 | Ampliación y arrastre de escritorio. | Vista completa inicial, tamaño real bajo demanda y arrastre en los dos ejes con el ratón; cierre siempre disponible. |

Evidencia: `artifacts/capture-20261027/` (local y excluido de Git), matriz JSON,
logs y capturas inspeccionadas. El navegador de escritorio comprueba tamaños
y dobles clics; no reproduce el gesto nativo de Safari en un iPhone físico.
La verificación final del doble toque en ese dispositivo sigue pendiente.
La matriz espera explícitamente la liberación del fondo tras el evento nativo
`close`, evitando medir el estado intermedio de su entrega asíncrona.
LOCAL: pruebas disponibles anteriores. DEV/PRELIVE/PROD principal: no ejecutados;
estos cambios continúan el alcance autorizado de la demo privada.

## Actualización de Demos aprobada · 26 octubre 2026

Run ID: `demos-20261026`. Fuente `6d3f96f68359385dac9457fa5e54c04b1bfbb3b0`.
Release `20261026-review-6d3f96f`; rollback conservado: `20261022-feedback`.
Autorización de Juan para actualizar exclusivamente la demo privada existente.

| ID | Comprobación | Resultado |
| --- | --- | --- |
| DEMOS-01 | Paquete preparado desde el commit aprobado y manifiesto SHA-256. | Preparador exit 0, 52 archivos públicos; JS conservado y sintaxis validada. |
| DEMOS-02 | Identidad SSH, servicio previo y configuración de la nueva release. | Host contrastado con clave pública facilitada por conexión confiable; mismo proyecto e imagen. Compose/Caddy iguales salvo finales de línea Windows/Linux. |
| DEMOS-03 | Activación y contenido servido por HTTP desde el contenedor. | Compose exit 0; contenedor en ejecución; 52/52 respuestas coinciden con sus hashes. |
| DEMOS-04 | Aislamiento y cabeceras. | Sin puertos publicados, red privada existente, montajes y raíz de solo lectura; noindex y private/no-store. |
| DEMOS-05 | Gate HTTP externo, antes y después. | Página, nuevo JS de navegación y foto devuelven 302 a TMF Auth, sin sesión. Navegador también llega al login. |
| DEMOS-06 | Preservación de la web principal. | HTML público con idéntico SHA-256 antes y después; sin cambios en main, portal o autorización. |

Evidencia local: `artifacts/demos-20261026/`. El primer preflight detuvo la
activación por diferencias CRLF/LF en la configuración; se comprobó igualdad
del texto normalizando solo los finales de línea y se ejecutó Compose después.
No se modificó el servicio durante ese primer intento.

La suite y el navegador locales de la sección siguiente validan los archivos
fuente publicados. No hay sesión TMF Auth en el navegador actual: la revisión
visual autenticada de esta publicación queda pendiente. No se ha creado una
sesión ni cambiado permisos para probarla. LOCAL: validación disponible
documentada abajo; DEV/PRELIVE/PROD de la web principal: no ejecutados.

## Revisión completa en worktree · 26 octubre 2026

Run ID: `review-20261026`. Rama `codex/landing-review-20261026`, base `b1780c8`
más los nueve archivos de WIP que había en `codex/landing-historia-casos`.
El original conserva esos nueve archivos byte a byte. Revisión local en 8089;
original en 8088. Versión exacta de HTML/CSS/JS en el manifiesto SHA-256
`artifacts/review-20261026/review-version.json`.

Cambios: textos ES/EN más concretos, biografías resumidas y filas alineadas;
fondo atenuado tras el texto; contacto antes del roadmap; página de Acceso con
orientación; menú con teclado y alternativa sin scripts; cabecera ajustada a
320 px; foco contrastado; alt de capturas traducido; visor que ajusta también
por altura; fondo estático con movimiento reducido. Se conservan las decisiones
de diseño, los siete perfiles, los casos y las tres simulaciones.

| ID | Comprobación | Resultado |
| --- | --- | --- |
| REVIEW-01 | Suite completa disponible, sintaxis de los nueve JS y whitespace del diff. | 16/16 tests aprobados, 0 fallos/errores/omisiones; comandos con exit 0. |
| REVIEW-02 | Navegación, Contactar y contenido a 320, 390, 650, 651, 900, 902, 1024, 1100 y 1440 px, ES/EN. | 18 combinaciones sin desbordamiento ni controles recortados. 901 solicitado corresponde a 902 px efectivos en el navegador. |
| REVIEW-03 | Menú móvil: Tab/Shift+Tab, Escape, página inerte al abrir, navegación a Contacto y cambio a escritorio. | Foco y desplazamiento restaurados; Contactar accesible con el menú abierto. Regresiones automáticas y navegador. |
| REVIEW-04 | Siete fichas con Enter/Espacio, foto, biografía y LinkedIn independiente; cambio móvil/escritorio. | Comportamiento conservado. Subgrid alinea el cuerpo de las fichas por fila sin altura fija; fallback flex. |
| REVIEW-05 | Tres casos y tres capturas: abrir, exclusividad, zoom, ajuste y Escape. | Visor probado a 844×390; las imágenes caben también por altura y el foco vuelve al enlace. |
| REVIEW-06 | Alimentación, Proyectos y Eventos; confirmación, cambio de escenario e idioma. | Ninguna acción confirmada inicialmente; las tres confirmaciones locales se conservan en ES/EN. Hora coincidente con el reloj local. |
| REVIEW-07 | Fallback sin JavaScript. | Copia del HTML sin scripts: navegación visible, siete perfiles y tres conversaciones disponibles, confirmaciones ocultas y casos nativos. |
| REVIEW-08 | Movimiento reducido. | Test del scheduler: sin bucle continuo, sin respuesta animada al ratón, reanudación controlada. Fixture en navegador con preferencia forzada y CSS equivalente: scroll inmediato y desplegable sin transición. No sustituye una prueba de la preferencia nativa del SO. |
| REVIEW-09 | Acceso, aviso legal, privacidad y cookies, ES/EN. | Contenido visible y enlaces locales resueltos. Acceso ya no tiene un main vacío. No se modificó el texto legal. |
| REVIEW-10 | Recursos, consola y preservación. | 43 rutas locales revisadas; sin errores/avisos nuevos en la pestaña principal. Original conservado por SHA-256. |

Evidencia local: `artifacts/review-20261026/`, con logs de comandos, JSON de
responsive, páginas, consola, interacciones y capturas inspeccionadas de equipo,
contacto, agente y fixture estática. El primer sondeo de tamaños con otra pestaña
activa queda identificado como `responsive-inactive-tab.json`; no cuenta como
validación. `responsive.json` verifica el tamaño efectivo de cada muestra.

LOCAL: pruebas disponibles y revisión de navegador completadas; no se certifica
el gate completo de release TMF. No se ha probado Safari, un lector de pantalla
ni dispositivos físicos. DEV / PRELIVE / PROD: no ejecutados, fuera de esta
revisión local. Al cerrar la revisión aún no había commit, push, merge ni despliegue
nuevos. La preparación posterior de la demo privada se recoge en `README.md`.

Baúl: refresco completo al inicio y al cierre, exit 1 por fuentes internas no
disponibles. Wiki, Jira local, Flow y Kanban fallan; WhatsApp carece de lector
Windows; el log de Matrix falla por DNS aunque el recolector lo marca como ok.
No se usan esos estados como información fresca ni se publican avisos.

El worktree y el servidor 8089 se conservan para revisión con el usuario;
registro y cierre por identidad de sesión en `local-resources.json`. Los registros
históricos de abajo describen sus versiones; los casos del explorador retirado
ya no forman parte del producto actual.

## Retirada del explorador «Por dentro» · 26 octubre 2026

Por decisión del usuario, se retira el desplegable completo (diagrama, etapas,
catálogo de Minds, simulación de venta y bloque del modelo de servicio).
La oferta, los casos, el agente y el roadmap ya explican el valor y el proceso.
El agente enlaza visualmente con el equipo. Se elimina su lógica exclusiva
de main.js y sus reglas del desplegable en story.css; URLs versionadas.

Navegador: ausencia del desplegable y continuidad agente→equipo verificadas,
reloj activo, ES/EN y confirmación de Proyectos funcionales. Recarga sin nuevos
avisos o errores. Menú móvil a Equipo cierra al navegar, sin desbordamiento a
390 px. Suite 11/11, sin fallos ni omitidas, sintaxis JS y diff check limpios.
Alcance local, sin publicación.

## Paleta cálida del iPhone · 26 octubre 2026

Se sustituye el azul por fondo crema, mensaje en piedra, respuesta marfil y
acentos tostados. Tokens específicos del agente; menta de la web conservado.
Contraste calculado de texto principal, secundario y acentos sobre sus fondos:
10,40:1, 5,29:1, 6,71:1 y 5,13:1. Escritorio y 390 px inspeccionados;
sin desbordamiento, confirmación de Proyectos funcional. Suite 11/11 y diff
check limpio. Evidencia `artifacts/warm-phone-20261026/desktop.png`, `mobile.png`.
Solo revisión local.

## Un solo roadmap e iconos del equipo · 26 octubre 2026

Se retira la sección de método repetida; formación, alojamiento y mantenimiento
quedan en el último paso del roadmap. El bloque del modelo de servicio se
conserva dentro del detalle opcional de MindHub. Se elimina la animación GSAP
asociada a los pasos retirados. Orden de contenido actualizado en la prueba.

Los siete LinkedIn se muestran como iconos al lado del nombre, con nombre
accesible y destinos conservados. No quedan enlaces separados al pie de cada
biografía. Se retira la altura mínima del rol y se acorta la frase de Alejandro
a «Primero, entender el propósito.» en ES y su equivalente EN.

Revisión a 320/390/650/651/1440 px sin desbordamiento. A 1440 px la frase de
Alejandro ocupa una línea; a 390 px su ficha abre y el icono recibe el clic
sin interferencia del desplegable (hit test DOM). EN verificado; bloque del
modelo visible al abrir MindHub. Recarga final sin nuevos avisos ni errores.
Suite 11/11, sin fallos ni omitidas; diff check limpio. Evidencia local:
`artifacts/team-icons-20261026/desktop.png`, `mobile.png`. Sin publicación.

## Roadmap resumido en contacto · 26 octubre 2026

Por indicación del usuario, se simplifica la propuesta anterior: cinco pasos
breves, conectados horizontalmente en escritorio y en vertical en móvil.
Se retiran condiciones de pago, descuentos y preguntas entre fases; se conserva
la decisión del cliente de avanzar. ES/EN. Revisión a 320/390/900/1440 px sin
desbordamiento; suite 11/11 aprobada, sin omitidas. Captura local en
`artifacts/roadmap-short-20261026/desktop.png`. Sin publicación.

## Recorrido comercial en contacto · 26 octubre 2026

La sección «Tu siguiente paso empieza aquí» sustituye diagnóstico/propuesta/
estimación por cinco pasos en ES/EN, a partir de la referencia del usuario:
vídeo sin coste; demo pagada con requisitos y una ronda de ajustes (precio y
estimación previa, descontable del desarrollo); presupuesto cerrado por escrito;
desarrollo con validación y pagos por hitos; puesta en marcha y mantenimiento
por TMF o el equipo IT del cliente. Cada transición depende de la decisión del
cliente. Se conserva el contacto por correo.

CONTACT-JOURNEY-01: cinco pasos presentes en navegador en ambos idiomas.
CONTACT-JOURNEY-02: 320/390/650/651/1440 px sin desbordamiento; composición
de escritorio ES y tarjetas móviles EN inspeccionadas. Sin errores de consola.
Suite existente 11/11 aprobada, sin fallos ni omitidas; diff check limpio.
Evidencia: `artifacts/contact-journey-20261026/desktop-es.png`, `mobile-en.png`.
Alcance local, sin publicación ni certificación de release.

## Equipo más compacto · 26 octubre 2026

Separación de fichas reducida a 24 × 20 px en escritorio y 8 px en móvil;
menor espacio interior y entre retrato, nombre, biografía y LinkedIn.
Revisión a 1440 y 390 px sin desbordamiento; apertura móvil de Laura funcional.
Suite existente 11/11, sin fallos ni omitidas. Evidencia local:
`artifacts/compact-team-20261026/desktop.png`. Sin despliegue.

## Qremoso completo en la captura · 26 octubre 2026

Se retira la animación del SVG incrustado en `assets/cases/qrema.svg`:
el render anidado retenía el primer fotograma y ocultaba la crema.
La mascota conserva su dibujo completo en estado estático. URL versionada
en enlace e imagen. Navegador: visor Qrema inspeccionado con crema y terrina
visibles. Evidencia `artifacts/qremoso-20261026/qremoso-complete.png`.
Suite existente 11/11 aprobada, sin fallos ni omitidas. Solo cambios locales.

## Revisión del marco de iPhone · 26 octubre 2026

Propuesta local sobre los cambios de dispositivo anteriores. Marco de proporción
393:852, bisel, isla frontal, barra de estado, botones laterales y barra inferior.
La conversación se desplaza dentro de la pantalla y no modifica la proporción.
Validación en navegador a 320/390/650/651/1440 px: sin desbordamiento del
documento, proporción medida estable (0,4613). Confirmación de Proyectos
conservada al cambiar a EN y confirmación de Eventos comprobada; consola sin
errores ni avisos. Suite existente 11/11, sin fallos ni omitidas; diff check limpio.
Evidencia: `artifacts/iphone-20261026/desktop.png`.
No cambia el alcance local ni los gates de release pendientes.

## Propuesta local de dispositivo y retratos · 26 octubre 2026

Sobre `b1780c8`, cambios locales en HTML/CSS, sin despliegue.
Run `device-team-20261026`: suite existente 11/11, sin fallos ni omitidas.
Dispositivo simulado en CSS con marca TMF; conserva los tres escenarios y
sus confirmaciones locales. Retratos circulares de 112 px en escritorio y
88 px en móvil, sin filtros de color o brillo al entrar o pasar el cursor.
Se conservan las imágenes existentes, las siete biografías y sus enlaces;
esto no sustituye la selección pendiente de fotografías reales de TMF-51.

- DEVICE-01: navegador a 320/390/650/651/1440 px, sin desbordamiento horizontal.
- DEVICE-02: Proyectos y Eventos confirmados; estado conservado al pasar a EN.
  Cabecera del dispositivo traducida; cero errores o avisos en consola.
- PORTRAIT-01: composición de escritorio y ficha de Laura abierta a 390 px
  inspeccionadas; retrato circular y desplegable conservados.

Capturas en `artifacts/device-team-20261026/`: `team-desktop.png`,
`team-mobile.png`, `agent-device-desktop.png`. Sigue siendo revisión local;
no certifica la matriz completa de release ni DEV/PRELIVE/PROD.

## Continuación local en Windows · 26 octubre 2026

Versión comprobada: `b1780c8fe05b9875305b0ec5a7aa8ac864c00f3d`, rama
`codex/landing-historia-casos`. Sin cambios funcionales ni despliegue.
Run: `local-20261026`. Node 24.11.0: 11 descubiertas, ejecutadas y aprobadas,
0 fallos, 0 omitidas; `node --test tests/*.test.cjs`, exit 0.
`git diff --check`, exit 0.

Navegador integrado de Codex, servidor estático en `127.0.0.1:8088`:

- FEEDBACK-02: 320/390/650/651/1440 px, sin desbordamiento horizontal;
  Contactar dentro de la cabecera en todos esos anchos. Menú móvil a Equipo
  cierra al navegar; ficha de Laura con fondo opaco inspeccionada a 390 px.
- TEAM-M02/M03: las siete fichas responden a Enter/Espacio. Laura conserva
  su selección al pasar por 651 px (contenido visible y control deshabilitado)
  y volver a 390 px; cambio ES/EN conserva el estado.
- FEEDBACK-03: los tres casos abren su imagen en diálogo, permiten tamaño
  real y cierre; exclusividad de casos y devolución de foco verificadas.
  Qrema permite volver a ajustar y cerrar con Escape; Madatuta muestra
  barras de desplazamiento y responde a desplazamiento horizontal por teclado.
- FEEDBACK-04/STORY-03/04: los tres escenarios se seleccionan; confirmaciones
  realizadas en EN quedan deshabilitadas y traducidas al volver a ES.
  Mensajes azules y controles inspeccionados en móvil.
- STORY-05: tres etapas y seis pestañas activadas, venta ilustrativa iniciada.
  Consola consultada: cero errores o avisos. Ninguna imagen con URL asignada
  rota; el img vacío del visor cerrado no es un recurso fallido.

Evidencias locales, excluidas mediante `.git/info/exclude`, en
`artifacts/local-20261026/`: `mobile-es.png`, `desktop-en.png`,
`viewer-mobile.png`, `landing-local.png` y capturas auxiliares.
No se ha repetido toda la matriz histórica sin JS, movimiento reducido,
lector de pantalla ni dispositivos físicos. No se certifica LOCAL completo,
DEV, PRELIVE o PROD. No se ha modificado la revisión privada.

Arranque TMF: instalador canónico falla por `fcntl` en Windows. Refresco
completo ejecutado desde el checkout canónico con Python explícito: exit 1.
Wiki sin clave, Jira sin configuración, Flow sin datos, Kanban sin servidor,
WhatsApp sin lector Windows; descubrimiento GitHub limitado por falta de gh.
Matrix informa fallo SSH de `tmf-internal` aunque el colector lo etiqueta ok;
no se considera fresco. Estado en `../vault/_refresh/state.json`.
La revisión independiente usa únicamente los archivos de esta rama.

## Última versión funcional · ajustes del equipo del 22 de octubre

Versión: `54b66f245bb0fef571047889dda0f360688d0481`.
Suite disponible: 11/11 aprobadas, 0 fallos, 0 omitidas. Los resultados históricos
que aparecen después corresponden a sus versiones, no al render de esta última.

| ID | Criterio | Verificación de esta versión |
| --- | --- | --- |
| FEEDBACK-01 | Los siete LinkedIn corresponden a las personas del equipo; aparece Víctor Manuel. | Perfiles confirmados entre contactos de Juan; revisión del HTML. |
| FEEDBACK-02 | Contactar siempre visible y fichas móviles con fondo opaco. | CSS revisado; render en navegador pendiente a 320/390/650/651/1440 px. |
| FEEDBACK-03 | El visor abre la imagen correcta, conserva el prefijo de la copia privada, amplía, cambia idioma, cierra y devuelve el foco; clic modificado conserva el enlace. | `tests/preview.test.cjs` aprobado. Diálogo, Escape, zoom y desplazamiento nativos pendientes en navegador. |
| FEEDBACK-04 | La demo se distingue de los CTA y separa visualmente pregunta y respuesta. | Colores y contraste revisados; render e interacción en navegador pendientes. |
| FEEDBACK-05 | Los flujos anteriores conservan estado, recursos, orden y fondo compartido. | Suite completa disponible aprobada; regresión visual pendiente para los últimos cambios. |

La política del navegador bloqueó la inspección local. No se ha certificado el
gate completo de release. Pasos para continuar: `handoff-20261026.md`.

## Registro histórico

Run ID: `landing-story-20261021-local`. Base: `582e922`.
Suite completa existente y nueva: `node --test tests/*.test.cjs`,
9 pruebas aprobadas, 0 fallos y 0 omitidas. `git diff --check`: exit 0.

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| STORY-01 | La portada presenta software a medida y lleva a casos reales. | Navegador ES/EN; destinos y recursos en prueba automática. |
| STORY-02 | Los tres casos abren su contenido y muestran la captura correspondiente; abrir otro cierra el anterior. | Navegador; Qrema, BodaMúsica y Madatuta; también en la copia sin scripts. |
| STORY-03 | El agente muestra un ejemplo a la vez y ninguna acción queda confirmada antes de pulsar su botón. | Prueba automática y navegador en los tres ejemplos. |
| STORY-04 | La confirmación solo cambia la simulación local y se conserva al cambiar de ejemplo o idioma. | Prueba automática de estado; navegador ES/EN. Sin llamadas a servicios en el módulo. |
| STORY-05 | El detalle de MindHub conserva etapas, seis pestañas y simulación de venta. | Navegador: etapas 0/1/2, seis pestañas, flechas de teclado y venta hasta el estado final. |
| STORY-06 | La oferta incluye aplicaciones, integraciones y automatización, con agente o sin él. | Prueba automática de estructura y revisión visual. |
| STORY-07 | Contacto explica diagnóstico, propuesta y estimación; el botón apunta a info@themindfactory.es. | Revisión visual y del destino, sin enviar correo. |
| STORY-08 | Las nuevas secciones conservan lectura y recursos en móvil y escritorio. | Navegador a 320/390/650/651/1100/1440 px; sin desbordamiento del documento ni imágenes rotas. |
| STORY-09 | El contenido sigue disponible si no cargan los scripts. | Copia exacta sin etiquetas script: tres ejemplos visibles, confirmaciones ocultas, siete perfiles visibles y casos nativos funcionales. |
| STORY-10 | Se conservan las siete personas y su comportamiento móvil. | Suite existente; navegador a 320/390/650/651 px, activación con Enter/Espacio y conservación al redimensionar. |

Capturas inspeccionadas: `mobile.png`, `agent-desktop.png`,
`team-desktop.png`, `contact-desktop.png` y `desktop.png`, bajo
`artifacts/landing-historia-casos/`. Consola de navegador: sin errores ni avisos.
La emulación responsive no equivale a probar un dispositivo físico.
Movimiento reducido, lector de pantalla y Safari no se han ejecutado.
No se certifican los gates de release LOCAL/DEV/PRELIVE/PROD de TMF;
esta es una propuesta visual local con la suite disponible y flujos comprobados.

## Oferta antes de los casos y revisión de contenido · 22 octubre 2026

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| ORDER-01 | La oferta general aparece antes de los casos y el agente va después. Menú, flecha de portada y enlace posterior a los casos llevan al destino correspondiente. | Suite de estructura actualizada; navegador: menú móvil a la oferta y enlace de casos a contacto. |
| ORDER-02 | Los ejemplos recuperados de la web anterior aparecen en ES/EN. | Navegador en ambos idiomas: WhatsApp, Excel, información compartida y equipos en campo. |
| ORDER-03 | El cambio de orden conserva casos, agente y detalle opcional. | Navegador: abrir BodaMúsica cierra Qrema; ejemplo Proyectos exige confirmación; desplegable de MindHub abre, etapa IA seleccionable y pestaña Operaciones funcional. |
| ORDER-04 | El contenido anterior útil tiene ubicación identificada. | Comparación con `582e922`, inventario en `content-check-20261022.md`. Marcado de conexión y Minds idéntico; 25 traducciones de equipo conservadas en cada idioma; páginas legales/acceso y destinos de contacto sin cambios. |
| ORDER-05 | La oferta adelantada se lee en móvil y escritorio. | Capturas inspeccionadas a 390 y 1202 px. Documento sin desbordamiento a 320, 390 y 1202 px; menú móvil cerrado tras elegir destino y título visible bajo la cabecera. |

Suite: 10/10 aprobadas, sin fallos ni omitidas. `git diff --check`: exit 0.
Navegador: sin avisos ni errores de consola. Evidencia en
`artifacts/landing-order-20261022/`: `desktop.png`, `mobile.png`,
`content-validation.json` y `tests.log`. Se mantiene el alcance local y las
limitaciones de validación indicadas arriba; no se ha ejecutado un test A/B de
conversión ni se ha publicado la propuesta.

## Revisión con TMF Auth · 22 octubre 2026

| ID | Criterio | Verificación |
| --- | --- | --- |
| TMF-REVIEW-01 | La revisión usa la sesión compartida y los permisos del portal de demos. | Login real completado por el usuario; retorno a `/d/landing-preview/`. Siete grants específicos verificados y comodines anteriores sin ampliar. |
| TMF-REVIEW-02 | Página, imágenes y JS tienen el mismo control de acceso. | Live: las tres rutas sin cookie redirigen a TMF Auth con destino conservado. Fixtures HTTP del portal: sesión inválida, identidad sin grant (403), autorizado (200). |
| TMF-REVIEW-03 | La adaptación al prefijo no modifica JS ni deja recursos fuera del gate. | Preparador comprueba enlaces de HTML, fondo compartido, igualdad binaria de JS y sintaxis de todos los scripts. Revisión adicional de recursos CSS. |
| TMF-REVIEW-04 | La copia autenticada conserva comportamiento y presentación. | Navegador: ES/EN, caso Madatuta, agente Proyectos con confirmación deshabilitada tras pulsar, etapas y Operaciones de MindHub, menú y apertura de perfil móvil. 390/1202 px sin desbordamiento ni imágenes rotas; cero errores nuevos tras la última recarga. |

Versión estática `9dcac54`; portal `4e91cbf` (PR tmf-demos #7). Release v3.
Suite local landing: 10/10. Suite HTTP local del portal: 11/11. Sin omitidas.
Capturas y logs: `artifacts/landing-tmf-auth-20261022/`.
No se han usado las otras seis cuentas reales ni certificado entornos que el
portal no tiene. La web principal no se ha publicado ni modificado.

## Copia privada de revisión · 22 octubre 2026

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| PREVIEW-01 | La versión de revisión se publica en un origen independiente sin modificar la web principal. | Sites confirmó despliegue `appgdep_6ad9453b360c8191841227ef85fd9dea`, fuente `9cc8693`, copia de `f48d131`. Workflow y `main` sin cambios. |
| PREVIEW-02 | Solo el equipo autorizado puede abrirla. | Política `custom` revisión 2: propietario y seis lectores, correspondientes a los siete miembros activos consultados en Matrix. Navegador inicialmente exige login; sesión del propietario verificada. No se han suplantado ni probado las cuentas ajenas. |
| PREVIEW-03 | La copia mantiene contenido, recursos y navegación. | Navegador autenticado: recursos sin errores, ES/EN, exclusividad de casos, selección y confirmación de Eventos, menú móvil a 390 px. Sin desbordamiento ni avisos de consola. Capturas `desktop.png` y `mobile.png` en `artifacts/landing-private-preview-20261022/`. |
| PREVIEW-04 | La copia no se indexa y contiene solo archivos públicos de la web. | Comprobación de los 50 archivos estáticos: meta noindex/nofollow en todos los HTML, robots.txt y recursos locales resueltos; sin configuración privada ni documentación del repo en dist. |

La publicación no certifica la escalera de release de la web principal.
La revisión entre compañeros queda abierta; las próximas modificaciones deben
copiarse y desplegarse de nuevo en el mismo Site.

## Retratos · 22 octubre 2026

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| PHOTO-01 | Laura, Juan y Agustín reutilizan exactamente el mismo fondo; los otros cuatro retratos se conservan. | Prueba automática del recurso y clase comunes. Navegador: misma URL, posición 0px 0px y tamaño 100% 100% en los tres. |
| PHOTO-02 | Los nuevos WebP mantienen dimensiones y transparencia y cargan correctamente. | Comprobación de 1122 × 1402, alpha preservado en los tres recortes; recursos cargados en navegador. Suite: 10/10, sin fallos ni omitidas. |

Evidencia local en `artifacts/team-patio-20261022/`.

## Team profiles · inventario de la revisión anterior

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

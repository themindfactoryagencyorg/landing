# Landing narrative · 21 octubre 2026

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

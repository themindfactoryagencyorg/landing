# Landing narrative · 21 octubre 2026

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

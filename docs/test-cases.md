# Team profiles

Automated behavior checks: `node --test tests/team.test.cjs`.
These checks cover state and markup; they do not certify browser rendering.

| ID | Acceptance criteria | Verification |
| --- | --- | --- |
| TEAM-M01 | En móvil, al entrar en `#equipo`, solo se muestran nombre, apellidos, profesión e indicador de apertura de las siete personas. | Estado automático; render pendiente a 320, 390 y 650 px. |
| TEAM-M02 | Al tocar el encabezado se muestran foto y descripción; al volver a tocarlo se cierran. Cada ficha funciona de forma independiente. | Estado automático; interacción táctil pendiente. |
| TEAM-M03 | El control se alcanza con Tab, tiene nombre accesible con nombre y profesión, se activa con Enter/Espacio y anuncia expandido/contraído. | Marcado automático; teclado y lector de pantalla pendientes. |
| TEAM-M04 | Un enlace directo a una persona abre su ficha; `#equipo` no abre ninguna por defecto. | Estado automático. |
| TEAM-R01 | En escritorio se muestran todas las fichas, con tres personas arriba y cuatro abajo. Al volver a móvil se conserva la selección anterior. | Estado automático; render pendiente a 651, 1100 y 1440 px. |
| TEAM-I01 | Español e inglés conservan nombres, fotos y descripciones; el control usa la profesión traducida como parte de su nombre accesible. | Relaciones de marcado automáticas; cambio de idioma visual pendiente. |
| TEAM-A01 | Con movimiento reducido el despliegue funciona sin animación. Sin JavaScript, el contenido completo continúa disponible. | Revisión de código; navegador pendiente. |
| TEAM-P01 | Las siete fotos mantienen proporción y calidad; los apellidos largos no desbordan la pantalla. | Recursos y dimensiones automáticos; render pendiente. |

La revisión manual anterior del usuario corresponde a la presentación anterior;
no valida este nuevo desplegable. La automatización del navegador permanece pendiente
por el fallo al verificar permisos de Browser Use para el origen local.

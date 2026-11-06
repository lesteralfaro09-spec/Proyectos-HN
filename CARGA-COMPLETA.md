# Libro completo CA4

`carga.html` procesa localmente el libro refinado enviado por el usuario. El repositorio incluye el importador, no sus cifras ni el archivo financiero. Seleccionar el XLSX, revisar el resumen y confirmar reemplaza los dos módulos de este navegador. Antes se ofrece un respaldo completo de lo actual. Si falla el guardado se restauran los valores anteriores.

## Modelado y procedencia

- Histórico real julio–octubre: filas de `Anuncios HN/GT/SV` sin sumar resúmenes/subtotales; ventas de `Ventas HN/GT/SV`, con resultados de fórmulas USD guardados. Ventas web se agregan aparte, desde los resúmenes de país, sin adjudicarlas a categorías de producto.
- Las campañas y conjuntos ausentes se agrupan con nombres que indican expresamente esa ausencia. No se infieren nombres reales.
- Los resultados fuente solo tienen mes: la fecha interna es el primer día para compatibilidad con el filtro, pero se muestran como mes completo. No se presenta esa fecha como fecha real de un anuncio.
- El archivo no incluye estado de Meta. La actividad mensual se determina por inversión o resultados. Es una inferencia del histórico, no el estado actual de la plataforma. Se conservan registros de importe cero para la consulta de todo el histórico.
- Nicaragua: resúmenes mensuales de escolar/tiendas/RRHH, sin fabricar ventas ni repartir por mes el detalle de anuncios acumulado julio–octubre.
- Los montos de conjuntos históricos son inversión ejecutada y se etiquetan como base histórica; no se convierten en presupuestos originalmente aprobados.
- Planes separados: Lester noviembre; Claude noviembre/diciembre; Neno noviembre/diciembre. Los presupuestos se toman por componente/objetivo, no se suman los totales de categoría además de sus componentes. Se comprueban contra los totales guardados en el libro antes de aplicar la carga.
- No hay Lester diciembre aprobado en el libro ni Lester noviembre de NI completado. No se llenan con propuestas sin una decisión manual.
- Los fondos de marcas se almacenan una sola vez como aportes y se asignan a cada alternativa consultable. El selector impide sumar escenarios diferentes.
- Lester se mantiene editable: al guardar en análisis se actualizan los conjuntos del plan Lester y viceversa. Las propuestas del archivo no se modifican por esa edición.
- Todas las hojas originales, incluidas Apps y criterios, quedan disponibles en el visor paginado. Valores de fórmulas según resultados guardados; no se ejecutan macros ni fórmulas.

## Persistencia y respaldos

Los dos módulos leen JSON anterior o JSON comprimido con LZ-string 1.5.0, bundle local y licencia MIT en vendor. El tarball npm se verificó contra su integridad publicada. La compresión evita que el libro supere rápidamente la cuota de localStorage. El original normalizado se conserva en IndexedDB. Sin envío a servidores ni IA.

Un respaldo completo `ACOSA-FULL-1` incluye ambos módulos y el visor de originales; los respaldos individuales previos siguen siendo independientes. Las cargas del libro sustituyen el estado anterior solo tras la confirmación y la opción de descargar respaldo; no se fusionan silenciosamente datos de prueba con reales.

La carga se validó en Chromium con el archivo privado: meses, campañas/conjuntos/resultados, tres escenarios sin duplicar totales, ausencia de Lester diciembre, lectura posterior a recarga, edición de Lester y actualización operativa, ventas web separadas, visor de todas las hojas y respaldo completo. El fichero privado y las pruebas que lo contienen no se publican.

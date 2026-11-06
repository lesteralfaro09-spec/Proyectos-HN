# Análisis mensual y Presupuesto Lester

Acceso desde `index.html` a `analisis.html`. La navegación operativa existente se conserva. Sin backend, cuentas, envío a IA ni servicios externos; los archivos se leen en el navegador. El portal incluye una réplica pública del libro inicial en datos/ca4-inicial.json, a solicitud expresa del propietario. Las nuevas cargas y ediciones siguen siendo locales.

## Flujo

1. Seleccionar país, mes de datos históricos y mes a presupuestar.
2. Cargar reporte completo de anuncios/campañas en XLSX o CSV UTF-8. Elegir hoja, encabezados y columnas; revisar vista previa y confirmar. Las hojas `Anuncios HN/GT/SV` del archivo refinado se reconocen; SV corresponde a ESV en el panel. Categoría e inversión USD son obligatorias. Campaña/conjunto pueden estar vacíos porque algunas hojas fuente los omiten. No se infieren categorías a partir de nombres.
3. Repetir en Ventas: categoría, canal e importe requeridos. Se aceptan Call Center, Retail, Web y Otros. Los reembolsos negativos se admiten como ventas netas. Si el importe está en moneda local, introducir moneda por 1 USD; no se consultan tasas en vivo. Se prefiere la columna Venta (USD) si existe.
4. Revisar métricas por categoría y sugerencia orientativa. Ventas CC/Retail, web y otros canales van separadas. La relación venta total/inversión no se presenta como ROAS atribuido ni causalidad.
5. Registrar manualmente Presupuesto Lester por categoría y objetivo en el mes destino; editar su importe y criterio. Las sugerencias y cargas mensuales no reemplazan la decisión manual. Tras una carga del libro completo, las ediciones manuales Lester se sincronizan con sus conjuntos del plan Lester; las propuestas no cambian.

## Importaciones y almacenamiento

- Solo se confirma una carga sin errores. Las filas de otros meses se excluyen; si falta columna de mes se advierte la asignación de todas las filas al mes elegido. Los nombres de mes sin año usan el año seleccionado.
- Las fórmulas XLSX no se ejecutan; se leen sus resultados guardados. Si falta el resultado en una columna monetaria requerida, se rechaza esa fila y no se aplica la carga.
- Una carga reemplaza, con confirmación, la del mismo país/mes/tipo. Es un reporte completo, no una suma de archivos superpuestos. La misma carga normalizada no se duplica. Corrigiendo el mapeo o la conversión sí es posible reemplazarla.
- Límite de archivo: 15 MB; filas/columnas excesivas se rechazan. No se soporta XLS antiguo, XLSM ni CSV con codificación diferente de UTF-8.
- Datos normalizados en localStorage `acosa-analysis-v1` (JSON anterior o comprimido mediante almacenamiento.js); navegación en sessionStorage. Datos operativos anteriores intactos. Si falla el almacenamiento, no se confirma la mutación.
- Respaldos de este módulo son independientes de los del panel operativo. Exportar/restaurar JSON. Exportación agregada disponible para una futura integración de análisis.

## Sugerencia actual

No es IA ni una implementación de las reglas de Neno/Claude incluidas en el Excel. Es una regla explicable: repartir un límite editable según ventas netas positivas CC/Retail de categorías con inversión positiva, con tope del 150% del gasto histórico por categoría. Puede quedar dinero sin asignar; se muestra explícitamente. Sin datos comparables no se recomienda. No predice rendimiento ni aplica decisiones automáticamente. Una futura IA necesitará servicio de backend para mantener claves fuera del navegador, además de permisos de acceso antes de trabajar con datos compartidos.

## Dependencia

ExcelJS 4.4.0, bundle local `vendor/exceljs.min.js`, licencia MIT incluida. Tarball del registro npm oficial verificado contra su integridad SHA-512 al descargar. No se carga código desde CDN al usar el sitio.

## Validación

Prueba funcional en Chromium con el Excel refinado privado en la máquina: cargas mensuales de Anuncios HN y Ventas HN, verificadas contra los valores del archivo. Se probaron deduplicación, país equivocado, lectura de resultados guardados, conversiones de CSV, separación de ventas web, rechazo de errores, preservación del presupuesto manual, navegación y pantalla móvil. El archivo de prueba privado no se publica.

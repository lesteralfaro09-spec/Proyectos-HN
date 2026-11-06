# Informe original CA4 editable

`informe.html` presenta las 21 hojas del archivo original, empezando por Resumen CA4 y Apps pagadas · Estrategia Digital. Los accesos de país mantienen sus informes, campañas/conjuntos, fondos, anuncios y ventas. El selector completo también conserva Inicio, Listas y la hoja vacía del archivo.

`datos/informe-ca4.json` contiene valores originales, 19,835 fórmulas, formatos numéricos, cabeceras, bloques combinados y dimensiones. El diseño visual es neutral, sin alterar filas, columnas ni fórmulas. Los cuadros muy anchos tienen desplazamiento y accesos a las secciones Lester, Claude y Neno; las hojas grandes se paginan. El texto largo puede consultarse completo al seleccionar la celda.

Los datos de entrada se pueden corregir en un editor con tipo de dato. Las fórmulas son inspeccionables y protegidas. Al guardar una corrección se recalculan los cuadros relacionados; se rechaza si introduce errores de cálculo (por ejemplo, una tasa cero). Se puede deshacer, respaldar y restaurar correcciones. Los datos base no se sobrescriben: los cambios son locales bajo `acosa-report-edits-v1`.

El motor `formulas.js` interpreta las funciones existentes en este libro: SUM, SUMIFS, SUBTOTAL(9/109), IF, IFERROR, AND, N, TEXT y AVERAGE; además de referencias entre hojas, rangos, operadores, comparaciones y concatenación. No usa eval, no ejecuta macros y no pretende ser compatible con cualquier fórmula de Excel. Las referencias circulares y funciones no admitidas se señalan como error.

Se compararon todos los resultados calculados contra los valores guardados en el Excel: las 19,835 fórmulas coinciden dentro de una tolerancia numérica pequeña. `node tests/formulas.cjs` reproduce esa comprobación y casos de edición, errores y referencias circulares.

Exportar Excel conserva las 21 hojas, fórmulas, sus resultados actualizados, formatos numéricos y celdas combinadas. Se verificó el archivo exportado con un lector de XLSX independiente. El estilo de exportación es simplificado; no se replican todos los objetos y formatos condicionales de Excel.

Actualizar otros módulos desde el informe es una acción explícita con confirmación y respaldo previo descargable. Reconstruye los datos operativos y analíticos desde la copia corregida y sus fórmulas recalculadas, manteniendo separados Lester/Claude/Neno. Reemplaza las ediciones de esos módulos por la versión del informe; no hay sincronización silenciosa ni publicación de correcciones en GitHub. Los respaldos completos de los otros módulos no incluyen las correcciones de esta vista: usar Respaldar correcciones o Exportar Excel también.

Los datos base originales del informe son públicos, igual que la carga inicial ya autorizada. No se conectó una IA ni se consultaron servicios externos para recalcular cifras.

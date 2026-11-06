# Campañas e histórico mensual

- Cada campaña pertenece a un país y un mes (`YYYY-MM`). Sus conjuntos y resultados se vinculan por IDs propios.
- `active` es el estado de ese registro mensual. Los datos y respaldos anteriores sin estado se tratan como activos; no se borran ni se duplican al cargar.
- El filtro por defecto es Solo activas. Se puede elegir Solo inactivas o Todas · histórico. Los conjuntos, resultados y presupuestos calculados del mes siguen este filtro. Las fechas de resultados siguen estando limitadas al mes de la campaña.
- Activar/desactivar desde Campañas afecta solo ese registro mensual. Desactivar no elimina los resultados.
- Copiar a otro mes crea un ID de campaña y de conjuntos nuevos, conserva los presupuestos de conjuntos y activa la copia. No copia resultados ni registros de aportes de marcas. Rechaza la misma campaña por nombre/país/mes para evitar duplicados accidentales. Editar la copia no modifica el mes de origen.
- Histórico mensual, accesible desde ambos módulos, agrupa todos los meses y países guardados, incluidos los registros inactivos. Permite consultar campañas y resultados del mes completo. Estos totales incluyen todos los estados y por ello pueden diferir de una vista Solo activas.
- El histórico es consultable y editable, no es un registro de auditoría inmutable ni una instantánea congelada. Sigue siendo almacenamiento local del navegador y está incluido en los respaldos JSON del panel operativo. Las cargas del módulo Análisis permanecen separadas y no se cambian automáticamente por el estado de campañas operativas.

Se validaron en Chromium: compatibilidad con registros anteriores; copia mensual con conjuntos independientes y sin resultados; rechazo de duplicados; edición y estados aislados entre meses; filtros de resultados; totales históricos; navegación, recarga y pantalla móvil.

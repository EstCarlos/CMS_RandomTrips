## BLOQUE A — Sistema de diseño + Dashboard + Editor de Tour
 
### Dashboard (`/admin`)
 
**Top metrics — fila de 4 KPI cards:**
- Reservas del mes (con delta vs mes anterior)
- Ingresos del mes (en DOP, con delta)
- Saldos pendientes de cobrar (monto + cantidad de bookings)
- Próximos tours (próximos 7 días)
**Fila 2 — Dos paneles:**
- **Izquierda (grande):** gráfico de tendencia de reservas e ingresos últimos 6 meses (line chart dual axis)
- **Derecha:** alertas (saldos vencidos, cotizaciones sin responder hace >24h, fechas sin cupo abriendo en menos de 7 días)
**Fila 3 — Tabla "Últimas reservas":**
- Columnas: ID, Cliente, Tour, Fecha tour, Pax, Total, Estado, Acciones
- Botón "Ver todas" → /admin/reservas
**Fila 4 — Dos paneles:**
- **Izquierda:** "Próximos tours esta semana" con calendario semanal compacto
- **Derecha:** "Tours más vendidos del mes" con barras
### Editor de Tour (`/admin/catalogo/tours/{id}/edit`)
 
Esta es la pantalla más compleja del CMS. **Layout con tabs verticales o horizontales** según preferencia visual.
 
**Header de página:**
- Breadcrumb: Catálogo > Tours > [nombre del tour]
- Título editable inline
- Badge de estado (Borrador / Publicado / Archivado)
- Acciones derecha: Vista previa · Duplicar · Guardar borrador · Publicar
**Tabs:**
 
#### Tab 1 — Información básica
- BilingualField título (ES/EN)
- BilingualField descripción corta
- BilingualField descripción larga (rich text)
- Slug (autogenerado, editable)
- Tipo de tour (radio cards):
  - 🎯 **Fijo** — precio cerrado, sin opciones
  - 🔀 **Customizable** — itinerario con días swappeables
  - 📩 **Privado por solicitud** — solo formulario
- Categorías (multi-select chips)
- Tags
#### Tab 2 — Pricing
**El UI cambia según el modo seleccionado:**
 
- Selector de modo (radio):
  - `Precio fijo por persona`
  - `Tiers por volumen`
  - `Grupo cerrado (precio total)`
  - `Multi-día con tiers`
- Si **fijo por persona**: input "Precio por persona" + selector moneda base (DOP).
- Si **tiers**: tabla editable con filas `{Desde pax · Hasta pax · Precio por persona}`. Botón "Agregar tier". Visualización de cómo escala el precio.
- Si **grupo cerrado**: input "Precio total" + input "Máximo pax".
- Si **multi-día con tiers**: input "Duración en días" + tabla de tiers similar a B.
- Sección "Depósito":
  - Toggle "Requiere depósito"
  - Input % del depósito (default 25%)
- Sección "Vista previa de precio":
  - Calculadora interactiva: selector de pax → muestra cálculo en vivo en las 3 monedas
#### Tab 3 — Itinerario (solo si tipo = customizable)
 
- Botón "Agregar día"
- Lista vertical de días (drag & drop para reordenar):
```
┌──────────────────────────────────────────────────┐
│ ≡  Día 1                              [⋯ menú]  │
│   BilingualField título: "Día 1 — Bahía Águilas"│
│   BilingualField descripción corta              │
│   Experiencia default: [Bahía de las Águilas ▾] │
│   ☐ Cliente puede cambiar este día              │
└──────────────────────────────────────────────────┘
 
┌──────────────────────────────────────────────────┐
│ ≡  Día 3                              [⋯ menú]  │
│   ...                                            │
│   Experiencia default: [Playa Frontón ▾]        │
│   ☑ Cliente puede cambiar este día              │
│                                                  │
│   Alternativas permitidas:                       │
│   ┌────────────────────────────────────────┐    │
│   │ ✕ Playa Ermitaño    Delta: + RD$ 0/p  │    │
│   │ ✕ Playa Madama      Delta: + RD$ 300/p│    │
│   └────────────────────────────────────────┘    │
│   [+ Agregar alternativa]                       │
└──────────────────────────────────────────────────┘
```
 
#### Tab 4 — Experiencias incluidas
 
- Multi-select de experiencias del catálogo (con autocompletado)
- Cards horizontales mostrando las experiencias seleccionadas (con drag para reordenar)
#### Tab 5 — Destinos
 
- Multi-select de destinos
- Cada destino seleccionado se muestra como chip removible
#### Tab 6 — Servicios incluidos
 
- Tabla con todos los servicios del ServiceCatalog
- Columnas: Icono · Servicio · ¿Incluido? (toggle) · Nota personalizada (opcional input texto)
- Búsqueda y filtro por categoría
#### Tab 7 — Detalles (ficha)
 
Form con:
- Duración (texto libre: "Full day", "~8 horas")
- Idiomas del guía (multi-select chips: ES, EN)
- Cuándo reservar (texto: "Hasta 48h antes")
- Tipo de bono (Electrónico / Físico)
- Accesibilidad (radio: accesible silla ruedas / no accesible)
- Edad mínima (input numérico)
- Dificultad (select: Baja, Media, Alta)
- Mascotas permitidas (toggle)
- Nota de sostenibilidad (textarea)
#### Tab 8 — Galería
 
- Grid de imágenes asociadas al tour
- Botón "Agregar de biblioteca" → abre MediaPicker
- Botón "Subir nueva" → FileUploader
- Drag para reordenar
- Marcar imagen principal
#### Tab 9 — Operación
 
- Capacidad máxima por salida (input numérico)
- Operador asignado (select de operadores activos)
- Punto de encuentro (textarea)
- Notas internas (textarea solo visible en CMS)
#### Tab 10 — SEO
 
- BilingualField meta título
- BilingualField meta descripción
- OG image picker
- Slug visible
**Footer fijo del editor:**
- Botón "Descartar cambios" (izquierda, ghost)
- "Guardar borrador" (secundario)
- "Publicar" (primario)
- Estado de guardado: "Cambios guardados hace 12s" (auto-save)
### Listado de Tours (`/admin/catalogo/tours`)
 
**Header:**
- Título "Tours"
- Botón primario derecha: "+ Crear tour"
**FilterBar:**
- Búsqueda por nombre
- Filtro: Tipo (Fijo, Customizable, Privado)
- Filtro: Estado (Borrador, Publicado, Archivado)
- Filtro: Operador
- Filtro: Categoría
**DataTable:**
- Columnas: ✓ checkbox bulk · Imagen miniatura · Nombre · Tipo (badge) · Pricing (resumen: "Desde RD$ 3,500/p") · Operador · Estado (StatusBadge) · Reservas activas · Última actualización · Acciones (Editar, Duplicar, Archivar)
- Hover row: highlight sutil
- Bulk actions: Publicar seleccionados, Archivar, Cambiar operador
- Paginación abajo
---
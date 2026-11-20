# Research: Buscador y filtros en la carta

## Decision: Normalización sin dependencias

- **Decisión**: Comparar textos en minúsculas y sin marcas diacríticas usando
  `String.prototype.normalize('NFD')` y una expresión regular Unicode para diacríticos.
- **Rationale**: Cubre mayúsculas y tildes en español sin añadir librerías, compatible con los
  navegadores objetivo y con Node.js 26 (Jest).
- **Alternativas consideradas**: comparación exacta (no cumple FR-002); librerías de búsqueda
  difusa (añaden dependencia y sobrepasan el alcance).

## Decision: Filtros combinados con AND

- **Decisión**: Aplicar primero la categoría (cuando no esté vacía) y después el texto; el
  resultado es la intersección de ambas condiciones.
- **Rationale**: Es la interpretación más predecible para el cliente y satisface FR-004.
- **Alternativas consideradas**: OR (devuelve resultados que no cumplen lo que el cliente pidió).

## Decision: Estado y anuncios

- **Decisión**: Mantener `{ query, categoryId }` en el estado de `app.js`, recalcular la vista en
  cada evento de entrada/cambio y reutilizar `[data-announcer]` más un contador con `role=status`.
- **Rationale**: Evita duplicar renderizados y hace perceptible el cambio de resultados sin
  recorrer la carta (FR-010).
- **Alternativas consideradas**: recargar la página (pierde el foco y es lento); anunciar solo el
  contador sin estado vacío (no cumple FR-006).

## Decision: Sin cambios en los datos

- **Decisión**: No añadir campos de dietas/alérgenos ni etiquetas derivadas de descripciones.
- **Rationale**: No hay fuente verificada; derivarlas del texto libre podría dar información
  falsa (FR-008, FR-011).
- **Alternativas consideradas**: inventar etiquetas a partir de nombres de producto (rechazado).

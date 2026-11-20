# Tasks: Buscador y filtros en la carta

**Input**: Design documents from `/specs/002-buscador-filtros-carta/`

**Prerequisites**: plan.md (required), spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: Incluidas porque la constitución exige Test-First (NON-NEGOTIABLE). Escríbelas primero
y comprueba que fallan antes de implementar.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementación y prueba
independientes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la línea base sin tocar los datos verificados.

- [x] T001 Ejecutar `npm test` en la rama limpia y confirmar que la línea base pasa; verificar que `data/menu.json` no necesita cambios

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pruebas que fallan primero y módulo puro de filtrado, necesarios para todas las historias.

**⚠️ CRITICAL**: No iniciar trabajo de usuario hasta completar esta fase.

- [x] T002 [P] Escribir pruebas unitarias en `tests/unit/menu-search.test.js` para normalización (mayúsculas/tildes), búsqueda por nombre y descripción, filtro por categoría, combinación AND, texto vacío y sin coincidencias; ejecutarlas y confirmar que fallan
- [x] T003 [P] Escribir pruebas e2e en `tests/e2e/menu-filters.spec.js` para búsqueda, contador, categoría, estado vacío, limpieza de filtros y uso con teclado/lector de pantalla según `specs/002-buscador-filtros-carta/contracts/ui.md`; ejecutarlas y confirmar que fallan
- [x] T004 Crear `scripts/menu-search.js` con `normalizeSearchText`, `matchesQuery` y `filterProducts` puros, sin DOM ni dependencias, usando solo nombre, descripción y `categoryId` de `data/menu.json`

**Checkpoint**: Las pruebas nuevas ya existen y fallan por código ausente; el módulo puro está listo.

---

## Phase 3: User Story 1 - Encontrar un plato por texto (Priority: P1) 🎯 MVP

**Goal**: El cliente introduce texto y ve solo los platos cuyo nombre o descripción coinciden.

**Independent Test**: Escribir `carbonara` y comprobar que solo aparecen los platos relevantes; borrar el texto y comprobar que vuelve la carta completa.

- [x] T005 [US1] Añadir a `index.html` el campo de búsqueda etiquetado (`input[type=search]`) dentro de una nueva barra de filtros en `#menu`, delante de `[data-category-nav]`
- [x] T006 [US1] Conectar en `scripts/app.js` el evento de entrada del campo con `state.filters.query` y pasar los productos filtrados a `renderMenu`, manteniendo el orden original de categorías y productos
- [x] T007 [US1] Añadir estilos mínimos en `styles/site.css` para la barra de filtros y el campo de búsqueda, sin cambiar el diseño del resto de la carta

**Checkpoint**: La búsqueda por texto funciona de forma aislada y las pruebas unitarias/e2e correspondientes pasan.

---

## Phase 4: User Story 2 - Combinar búsqueda y filtros con resultados comprensibles (Priority: P2)

**Goal**: Filtrar por categoría, combinar con el texto, ver el contador y gestionar el estado vacío.

**Independent Test**: Elegir "Pizzas Medianas" y escribir `napoli`; después combinar "Postres Caseros" con `pizza` y usar "Limpiar filtros".

- [x] T008 [US2] Añadir a `index.html` el selector de categoría etiquetado con opción "Todas", el botón "Limpiar filtros" y el contador con `role=status`
- [x] T009 [US2] Poblar el selector desde `menu.categories` ordenadas y conectar sus eventos en `scripts/app.js` junto con el botón de limpieza, actualizando `state.filters.categoryId`
- [x] T010 [US2] Actualizar `renderMenu` en `scripts/app.js` para mostrar el contador, ocultar categorías sin resultados y mostrar el mensaje "No hay platos que coincidan" con acción de limpieza cuando no haya coincidencias
- [x] T011 [US2] Verificar la prueba e2e existente en `tests/e2e/menu.spec.js` que comprueba ausencia de `textbox`, confirmando que el campo de búsqueda usa el rol `searchbox` y no representa una pantalla de gestión

**Checkpoint**: Los filtros combinados, el contador y el estado vacío funcionan sin alterar la cesta.

---

## Phase 5: User Story 3 - Usar búsqueda y filtros con teclado y lector de pantalla (Priority: P3)

**Goal**: Los controles son utilizables y los cambios de resultados se anuncian.

**Independent Test**: Recorrer los controles con Tab, ver el foco, cambiar filtros y comprobar que el contador y el estado vacío se anuncian.

- [x] T012 [US3] Añadir `aria-live=polite`/`role=status` al contador y anunciar el número de resultados y el estado vacío a través de `[data-announcer]` en `scripts/app.js`
- [x] T013 [US3] Verificar en `styles/site.css` que los nuevos controles mantienen el indicador de foco visible y son utilizables a 360 px de ancho, ajustando solo lo necesario

**Checkpoint**: Las pruebas de accesibilidad de `tests/e2e/menu-filters.spec.js` pasan.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final y documentación de uso.

- [x] T014 [P] Documentar los nuevos controles en `README.md` y comprobar que `specs/002-buscador-filtros-carta/quickstart.md` refleja los comandos y escenarios reales
- [x] T015 Ejecutar `npm test` completo y corregir cualquier regresión en `tests/unit/` y `tests/e2e/`
- [x] T016 Revisar manualmente la web con `npm run start` en <http://127.0.0.1:3000> siguiendo `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias
- **User Stories (Phase 3+)**: dependen de Foundational; se ejecutan en orden P1 → P2 → P3
- **Polish (Phase 6)**: depende de todas las historias

### User Story Dependencies

- **US1 (P1)**: búsqueda por texto; MVP independiente
- **US2 (P2)**: reutiliza el módulo de filtrado y el renderizado de US1
- **US3 (P3)**: se apoya en los controles y el contador de US1 y US2

### Parallel Opportunities

- T002 y T003 pueden escribirse en paralelo (archivos distintos)
- T014 puede ejecutarse en paralelo con la verificación final de otras tareas

## Implementation Strategy

1. MVP: Phase 1 + Phase 2 + Phase 3 (búsqueda por texto).
2. Incremento 2: Phase 4 (categoría, contador y estado vacío).
3. Incremento 3: Phase 5 (accesibilidad) y Phase 6 (verificación y documentación).

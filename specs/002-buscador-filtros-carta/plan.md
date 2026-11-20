# Implementation Plan: Buscador y filtros en la carta

**Branch**: `issue/buscador-filtros-carta` | **Date**: 2026-11-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-buscador-filtros-carta/spec.md`

## Summary

Añadir una búsqueda de texto tolerante a mayúsculas y tildes, un filtro por categoría y un
contador/estado vacío a la carta existente. La lógica de filtrado será una función pura y
independiente del DOM; la interfaz reutilizará la renderización actual de categorías y productos
sin cambiar `data/menu.json` ni introducir dependencias.

## Technical Context

**Language/Version**: JavaScript (ES modules), Node.js 26.13.0 LTS (tooling)

**Primary Dependencies**: Ninguna nueva; `serve`, Jest y Playwright ya están en el proyecto

**Storage**: Sin almacenamiento nuevo; se reutiliza `data/menu.json` tal cual

**Testing**: Jest 30.5.2 (unit) + Playwright Test 1.65.0 con Chromium (e2e)

**Target Platform**: Navegadores modernos de escritorio y móvil; sin backend

**Project Type**: Web estática (single project)

**Performance Goals**: La carta sigue siendo usable en menos de 3 s en un PC de gama media/baja

**Constraints**: Sin frameworks, sin build, sin datos dietéticos no verificados, controles con
teclado y lector de pantalla, contenido en español

**Scale/Scope**: ~100 productos publicados en 5 categorías; una sola página de carta

## Constitution Check

- I. Lightweight, no-build stack: PASA; se mantiene HTML/CSS/JS sin framework ni build.
- II. Simplicity (YAGNI): PASA; un módulo puro pequeño y reutilización del renderizado actual.
- III. Test-first: PASA; se escriben pruebas unitarias y e2e que fallan antes de implementar.
- IV. Content in mock JSON: PASA; `data/menu.json` no cambia y no se inventan datos dietéticos.
- V. Operator-friendly & accessible: PASA; etiquetas, foco visible y anuncios de resultados.

No hay violaciones que justificar.

## Project Structure

### Documentation (this feature)

```text
specs/002-buscador-filtros-carta/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html                     Formulario de búsqueda/filtro y contador de resultados
scripts/menu-search.js         Funciones puras de normalización y filtrado (NUEVO)
scripts/app.js                 Estado de filtros, conexión de eventos y renderizado filtrado
styles/site.css                Estilos del formulario, contador y estado vacío
tests/unit/menu-search.test.js Pruebas unitarias del filtrado (NUEVO)
tests/e2e/menu-filters.spec.js Recorridos e2e de búsqueda y filtros (NUEVO)
data/menu.json                 Sin cambios
```

**Structure Decision**: Se conserva el proyecto único existente. La lógica de filtrado se aísla
en `scripts/menu-search.js` para poder probarla con Jest sin DOM; `scripts/app.js` sigue siendo el
único punto de conexión con la página.

## Complexity Tracking

Sin violaciones; esta sección no requiere contenido.

## Phases

### Phase 0: Outline & Research

Investigación mínima documentada en `research.md`: normalización sin dependencias, combinación de
filtros y patrón de anuncio accesible reutilizando `[data-announcer]`.

### Phase 1: Design & Contracts

- `data-model.md`: entidades Consulta de carta y Estado sin resultados derivadas de la spec.
- `contracts/ui.md`: contrato observable de los controles, contador y mensaje vacío.
- `quickstart.md`: escenarios ejecutables de validación manual y automática.

### Phase 2: Implementation (delegated to /speckit.tasks)

Tareas por historia de usuario, con pruebas primero y verificación final con `npm test`.

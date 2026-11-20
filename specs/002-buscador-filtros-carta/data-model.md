# Data Model: Buscador y filtros en la carta

"No se introduce persistencia nueva. La carta publicada sigue siendo la fuente; la consulta y el
estado sin resultados son conceptos temporales de la interfaz.

## Entities

### Producto (existente, sin cambios)

| Field | Uso en esta feature | Validation |
|---|---|---|
| `name` | Coincidencia de búsqueda | Texto publicado, sin normalizar en el dato |
| `description` | Coincidencia de búsqueda cuando existe | Texto publicado o ausente |
| `categoryId` | Coincidencia con la categoría elegida | Debe referirse a una categoría publicada |
| `available` | No altera la visibilidad del resultado | Se muestra igual que en la carta sin filtrar |

### Categoría (existente, sin cambios)

| Field | Uso en esta feature | Validation |
|---|---|---|
| `id` | Valor del filtro | Único dentro de la carta |
| `name` | Etiqueta visible de la opción | Texto no vacío |
| `order` | Orden de los resultados agrupados | Entero no negativo |

### Consulta de carta (nueva, en memoria)

| Field | Meaning | Validation |
|---|---|---|
| `query` | Texto introducido por el cliente | Se recorta; vacío equivale a sin búsqueda |
| `categoryId` | Categoría elegida | Vacío equivale a todas las categorías |

Reglas: `query` y `categoryId` se combinan con AND. El texto se normaliza solo para comparar,
nunca para modificar los datos publicados. Un producto coincide si el texto normalizado está
incluido en el nombre o en la descripción normalizados.

### Estado sin resultados (nuevo, en memoria)

| Field | Meaning | Validation |
|---|---|---|
| `message` | Explicación visible cuando no hay coincidencias | Texto en español |
| `resetAction` | Acción para limpiar texto y categoría | Debe restaurar la carta completa |

## State Transitions

```text
Carta completa
  ├─ introducir texto → Resultados filtrados
  ├─ elegir categoría → Resultados filtrados
  └─ combinar ambos → Resultados filtrados (AND)
Resultados filtrados
  ├─ cambiar texto o categoría → Resultados filtrados
  ├─ sin coincidencias → Estado sin resultados
  └─ limpiar filtros → Carta completa
```

Ninguna transición modifica `data/menu.json` ni la cesta de demostración.

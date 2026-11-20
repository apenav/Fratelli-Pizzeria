# UI Contract: Buscador y filtros en la carta

## Controls

| Element | Observable contract |
|---|---|
| Buscar platos (`input[type=search]`, etiqueta visible) | Acepta texto libre; al cambiar, actualiza resultados y contador |
| Categoría (`select`, etiqueta visible) | Opción vacía "Todas" + una opción por categoría publicada, en orden |
| Limpiar filtros (`button`) | Restaura texto vacío, categoría "Todas" y carta completa |
| Contador (`role=status`) | Muestra `N plato(s) encontrado(s)` y cambia con cada filtro |
| Sin resultados | Mensaje visible dentro de la carta + acción de limpieza |
| Navegación por categorías | Se construye solo con categorías que tienen resultados |

## Behavior

1. Con filtros vacíos se muestran todos los productos y el total de la carta.
2. El texto se compara con nombre y descripción, ignorando mayúsculas y tildes.
3. Texto y categoría se combinan con AND.
4. El orden de categorías y productos es el mismo que en la carta sin filtrar.
5. Los productos no disponibles siguen visibles y no se pueden añadir.
6. Cambiar los filtros no altera la cesta ni recarga la página.
7. El contador y el mensaje sin resultados son perceptibles por lectores de pantalla.

## Accessibility acceptance

- Todos los controles son alcanzables con Tab y muestran foco visible.
- Cada control tiene etiqueta asociada; la categoría seleccionada es identificable.
- El contador usa `role=status` y el mensaje sin resultados se anuncia sin recorrer la lista.

# Quickstart: Buscador y filtros en la carta

## Prerrequisitos

```sh
npm ci
npx playwright install chromium   # solo la primera vez
```

## Validación automática

```sh
npm run test:unit   # filtrado puro: normalización, categoría, AND, vacío
npm run test:e2e    # recorridos de búsqueda, filtros y accesibilidad
npm test            # ambos
```

## Escenarios manuales

1. Abrir <http://127.0.0.1:3000> con `npm run start`.
2. Escribir `carbonara`: deben aparecer solo platos con ese texto en nombre o descripción.
3. Escribir `BOLONESA` y `bolonesa`: deben coincidir los mismos productos.
4. Elegir categoría "Pizzas Medianas" junto con `napoli`: solo debe quedar la pizza napoli mediana.
5. Combinar "Postres Caseros" con `pizza`: debe aparecer el mensaje sin resultados y el botón
   "Limpiar filtros" debe restaurar la carta completa.
6. Recorrer los controles solo con Tab: foco visible, etiquetas claras y contador anunciado.
7. Añadir un producto filtrado a la cesta: el filtro no debe alterar la cesta.

## Resultado esperado

El contador coincide siempre con los productos visibles; no se muestran afirmaciones dietéticas;
la navegación y la cesta siguen funcionando como antes.

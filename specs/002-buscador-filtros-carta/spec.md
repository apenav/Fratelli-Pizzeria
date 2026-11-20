# Feature Specification: Buscador y filtros en la carta

**Feature Branch**: `002-buscador-filtros-carta`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Issue #4: permitir buscar platos por texto (nombre o descripción), filtrar por categoría y, si se considera oportuno, por características; mostrar cuántos resultados hay y qué ocurre cuando no hay ninguno; usar solo información fiable de alérgenos/dietas; garantizar uso con teclado y lector de pantalla; documentar cualquier cambio en la estructura de data/menu.json."

## Clarifications

### Session 2026-11-20

- Q: ¿Se incluyen filtros por dietas o alérgenos en esta versión, aunque `data/menu.json` no
  contenga datos verificados de ese tipo? → A: No. La búsqueda por texto y el filtro por
  categoría son el alcance de esta versión; no se muestran afirmaciones dietéticas sin una fuente
  verificada y documentada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Encontrar un plato por texto (Priority: P1)

Como cliente, quiero escribir parte del nombre o de la descripción de un plato para
encontrarlo rápidamente sin recorrer toda la carta.

**Why this priority**: Es la forma más directa de resolver el problema del issue: reducir el
tiempo de búsqueda cuando la carta es larga.

**Independent Test**: Escribir un término que aparece en un nombre o descripción (por ejemplo
"carbonara" o "mariscos") y comprobar que solo se muestran los platos relevantes.

**Acceptance Scenarios**:

1. **Given** que el cliente ve la carta completa, **When** escribe un término que coincide con
   el nombre o la descripción de uno o varios platos, **Then** solo se muestran esos platos.
2. **Given** que el cliente escribe el término con mayúsculas, minúsculas o tildes distintas a
   las del dato publicado, **When** busca, **Then** obtiene los mismos resultados que con la
   forma exacta del dato.
3. **Given** que el cliente borra el texto de búsqueda, **When** se actualiza la vista, **Then**
   vuelven a mostrarse todos los platos que se mostraban antes de buscar.

---

### User Story 2 - Combinar búsqueda y filtros con resultados comprensibles (Priority: P2)

Como cliente, quiero filtrar por categoría y combinar ese filtro con mi búsqueda, ver cuántos
resultados quedan y entender qué pasa cuando no hay ninguno.

**Why this priority**: Los filtros combinados y el contador evitan dudas sobre si la carta está
vacía o si la búsqueda fue demasiado estrecha.

**Independent Test**: Elegir una categoría, escribir un término, comprobar el contador y
comprobar el estado cuando la combinación no produce resultados.

**Acceptance Scenarios**:

1. **Given** que el cliente elige una categoría, **When** se actualiza la vista, **Then** solo
   se muestran los platos de esa categoría y el contador indica cuántos son.
2. **Given** que hay un término de búsqueda y una categoría elegidos, **When** se actualiza la
   vista, **Then** solo se muestran los platos que cumplen ambas condiciones a la vez.
3. **Given** que la combinación no produce resultados, **When** se actualiza la vista, **Then**
   se muestra un mensaje claro que indica que no hay platos que coincidan y se ofrece una acción
   para quitar los filtros.
4. **Given** que el cliente pulsa la acción para quitar los filtros, **When** se actualiza la
   vista, **Then** se restablece la carta completa y el contador vuelve al total inicial.
5. **Given** que un plato no está disponible, **When** aparece entre los resultados, **Then**
   conserva el mismo estado visual y las mismas limitaciones que en la carta sin filtrar.

---

### User Story 3 - Usar búsqueda y filtros con teclado y lector de pantalla (Priority: P3)

Como cliente que usa teclado o lector de pantalla, quiero utilizar la búsqueda y los filtros sin
perderme ni depender de la vista.

**Why this priority**: La experiencia debe ser utilizable por todos los clientes y no puede
depender de un dispositivo señalador.

**Independent Test**: Recorrer los controles con el teclado, aplicar y quitar filtros, y comprobar
que el número de resultados y el estado vacío se anuncian correctamente.

**Acceptance Scenarios**:

1. **Given** que el cliente navega con el teclado, **When** recorre la zona de búsqueda y
   filtros, **Then** puede llegar a todos los controles, ver cuál tiene el foco y activarlos.
2. **Given** que cambian los resultados, **When** un cliente usa lector de pantalla, **Then** el
   número de resultados y el mensaje de "sin resultados" se le comunican sin tener que recorrer
   toda la carta.
3. **Given** que el cliente elige una categoría, **When** usa lector de pantalla, **Then** la
   opción seleccionada y su etiqueta son comprensibles.

---

### Edge Cases

- Si el texto de búsqueda solo contiene espacios, se trata como si estuviera vacío.
- Si el texto incluye tildes, mayúsculas o caracteres especiales, la coincidencia no depende de
  esa forma concreta.
- Si un plato no tiene descripción, la búsqueda puede encontrarlo por su nombre sin mostrar
  campos vacíos.
- Si hay resultados en categorías distintas, se muestran agrupados con el mismo orden de
  categoría que la carta original.
- Si la combinación de filtros no produce resultados, la vista no queda en blanco ni muestra un
  contador de cero sin explicación.
- Si los datos de la carta cambian, el contador y los filtros reflejan los datos publicados en
  ese momento, sin valores obsoletos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La carta MUST permitir introducir texto libre para buscar platos por su nombre y,
  cuando exista, por su descripción.
- **FR-002**: La búsqueda MUST ignorar diferencias de mayúsculas/minúsculas y de tildes.
- **FR-003**: La carta MUST ofrecer un filtro por categoría con una opción que representa todas
  las categorías y MUST usar solo las categorías publicadas en la carta.
- **FR-004**: Cuando se usan a la vez texto y categoría, MUST mostrarse únicamente los platos que
  cumplen ambas condiciones.
- **FR-005**: La vista MUST mostrar el número de platos que coinciden con los filtros activos y
  MUST actualizarlo cada vez que cambian.
- **FR-006**: Cuando no hay coincidencias, la vista MUST mostrar un mensaje comprensible y una
  acción para limpiar texto y categoría.
- **FR-007**: Los resultados MUST respetar el mismo orden por categoría, la misma información
  visible y las mismas reglas de disponibilidad que la carta sin filtrar.
- **FR-008**: La vista MUST NOT mostrar etiquetas de dietas, alérgenos ni otras características
  que no estén documentadas como datos verificados en la fuente de la carta.
- **FR-009**: Todos los controles de búsqueda y filtrado MUST ser utilizables con teclado, tener
  etiquetas comprensibles y permitir conocer la opción seleccionada.
- **FR-010**: El cambio del número de resultados y el estado sin resultados MUST poder percibirse
  con un lector de pantalla sin recorrer toda la carta.
- **FR-011**: La estructura publicada de `data/menu.json` MUST permanecer sin cambios en esta
  versión; si se introduce algún campo nuevo, su origen y fiabilidad MUST documentarse antes de
  utilizarse como filtro.
- **FR-012**: La experiencia MUST permanecer en español y MUST NOT añadir pantallas de gestión
  ni servicios externos.

### Key Entities

- **Plato**: Producto publicado en la carta, con categoría, nombre, descripción opcional y
  disponibilidad; es la unidad que se busca y se filtra.
- **Categoría**: Agrupación publicada de platos, identificada por su nombre visible y su orden;
  se usa como filtro.
- **Consulta de carta**: Combinación del texto introducido y la categoría elegida; determina el
  conjunto de platos visibles y el número de resultados.
- **Estado sin resultados**: Situación en la que la consulta no coincide con ningún plato; debe
  explicarse y permitir volver a la carta completa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una prueba con cinco personas, al menos cuatro encuentran un plato concreto
  escribiendo una parte de su nombre en menos de 15 segundos y sin ayuda.
- **SC-002**: Al menos el 95 % de las búsquedas de prueba con variantes de mayúsculas y tildes
  devuelven exactamente los platos esperados.
- **SC-003**: El 100 % de las combinaciones probadas de texto y categoría muestran solo platos
  que cumplen ambas condiciones.
- **SC-004**: En todas las combinaciones probadas, el contador coincide con el número de platos
  visibles y el estado sin resultados aparece cuando el contador es cero.
- **SC-005**: Al menos cuatro de cinco personas pueden aplicar y quitar filtros usando solo el
  teclado, sin ayuda.
- **SC-006**: Ninguna vista muestra afirmaciones sobre dietas o alérgenos que falten en los datos
  verificados de la carta.

## Assumptions

- La carta de comida publicada mantiene sus cinco categorías actuales y no se incluye la carta de
  bebidas.
- `data/menu.json` no contiene datos verificados de dietas o alérgenos; por tanto, los filtros por
  características quedan fuera de esta versión y no se deduce esta información del texto libre.
- La búsqueda se aplica al contenido publicado en español; no se requieren sinónimos en otros
  idiomas ni corrección de errores de escritura.
- No se introduce backend ni servicio externo; la información disponible sigue siendo la misma
  carta local que ya consulta la web.
- El diseño existente de la página se conserva: los nuevos controles se integran en la vista de
  la carta sin sustituir la exploración por categorías.

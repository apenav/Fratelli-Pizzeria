import { filterProducts, normalizeSearchText } from '../../scripts/menu-search.js';

const products = [
  {
    id: 'lasana',
    name: 'LASAÑA BOLOÑESA',
    description: 'Bechamel, setas y trufas',
    categoryId: 'pastas',
  },
  {
    id: 'macarrones',
    name: 'MACARRONES NAPOLI',
    description: 'Con salsa de Tomate',
    categoryId: 'pastas',
  },
  {
    id: 'med-napoli',
    name: 'MED NAPOLI',
    description: 'Tomate y mozzarella',
    categoryId: 'pizzas',
  },
  {
    id: 'pan',
    name: 'PAN DE AJO',
    categoryId: 'entrantes',
  },
];

const idsFor = (filters) => filterProducts(products, filters).map(({ id }) => id);

describe('menu-search', () => {
  test('normaliza mayúsculas, tildes y espacios', () => {
    expect(normalizeSearchText('  LASAÑA BOLOÑESA  ')).toBe('lasana bolonesa');
  });

  test('encuentra coincidencias en el nombre ignorando tildes', () => {
    expect(idsFor({ query: 'bolonesa' })).toEqual(['lasana']);
    expect(idsFor({ query: 'BOLOÑESA' })).toEqual(['lasana']);
  });

  test('encuentra coincidencias en la descripción', () => {
    expect(idsFor({ query: 'setas' })).toEqual(['lasana']);
    expect(idsFor({ query: 'tomate' })).toEqual(['macarrones', 'med-napoli']);
  });

  test('filtra por categoría', () => {
    expect(idsFor({ categoryId: 'pizzas' })).toEqual(['med-napoli']);
  });

  test('combina texto y categoría con AND', () => {
    expect(idsFor({ query: 'napoli', categoryId: 'pizzas' })).toEqual(['med-napoli']);
    expect(idsFor({ query: 'napoli', categoryId: 'pastas' })).toEqual(['macarrones']);
  });

  test('devuelve todos los productos en orden si no hay filtros', () => {
    expect(idsFor({})).toEqual(['lasana', 'macarrones', 'med-napoli', 'pan']);
    expect(idsFor({ query: '   ', categoryId: '' })).toEqual(idsFor({}));
  });

  test('devuelve una lista vacía si no hay coincidencias', () => {
    expect(idsFor({ query: 'postre' })).toEqual([]);
    expect(idsFor({ query: 'napoli', categoryId: 'entrantes' })).toEqual([]);
  });

  test('tolera productos sin descripción', () => {
    expect(idsFor({ query: 'ajo' })).toEqual(['pan']);
  });
});

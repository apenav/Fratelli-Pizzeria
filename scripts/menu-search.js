const DIACRITICS = /[\u0300-\u036f]/g;

export function normalizeSearchText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(DIACRITICS, '');
}

export function matchesQuery(product, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return [product.name, product.description]
    .some((text) => normalizeSearchText(text).includes(normalizedQuery));
}

export function filterProducts(products, { query = '', categoryId = '' } = {}) {
  const selectedCategory = String(categoryId ?? '').trim();
  return products.filter((product) => (
    (!selectedCategory || product.categoryId === selectedCategory)
    && matchesQuery(product, query)
  ));
}

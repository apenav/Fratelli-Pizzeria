import { expect, test } from '@playwright/test';

const searchBox = (page) => page.getByRole('searchbox', { name: /buscar platos/i });
const categoryFilter = (page) => page.getByRole('combobox', { name: /categoría/i });
const resultCount = (page) => page.locator('[data-menu-results]');
const emptyState = (page) => page.getByText(/no hay platos que coincidan/i);
const resetButton = (page) => page.getByRole('button', { name: /limpiar filtros/i });
const card = (page, name) => page.locator('.product-card').filter({ hasText: name });

test.describe('Buscador y filtros de la carta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('busca por nombre sin distinguir mayúsculas ni tildes', async ({ page }) => {
    await searchBox(page).fill('lasana');
    await expect(card(page, 'LASAÑA BOLOÑESA')).toBeVisible();
    await expect(card(page, 'MACARRONES BOLOÑESA')).toHaveCount(0);
    await expect(card(page, 'MED NAPOLI')).toHaveCount(0);
    await expect(resultCount(page)).toHaveText(/1 plato encontrado/i);
  });

  test('busca en las descripciones publicadas', async ({ page }) => {
    await searchBox(page).fill('SETAS');
    await expect(card(page, 'CAPELLI DE FOIE')).toBeVisible();
    await expect(card(page, 'GIGANTI TORO')).toBeVisible();
    await expect(card(page, 'PAN DE AJO')).toHaveCount(0);
  });

  test('combina categoría y texto, y actualiza el contador', async ({ page }) => {
    await categoryFilter(page).selectOption('pizzas-medianas');
    await searchBox(page).fill('napoli');
    await expect(card(page, 'MED NAPOLI')).toBeVisible();
    await expect(card(page, 'MACARRONES NAPOLI')).toHaveCount(0);
    await expect(resultCount(page)).toHaveText(/1 plato encontrado/i);
    await expect(page.locator('[data-category-nav] a')).toHaveText(['Pizzas Medianas']);
  });

  test('muestra estado vacío y permite limpiar los filtros', async ({ page }) => {
    const total = await page.locator('.product-card').count();
    await categoryFilter(page).selectOption('postres-caseros');
    await searchBox(page).fill('napoli');
    await expect(emptyState(page)).toBeVisible();
    await expect(resetButton(page)).toBeVisible();
    await expect(resultCount(page)).toHaveText(/0 platos encontrados/i);
    await resetButton(page).click();
    await expect(searchBox(page)).toHaveValue('');
    await expect(categoryFilter(page)).toHaveValue('');
    await expect(page.locator('.product-card')).toHaveCount(total);
    await expect(resultCount(page)).toHaveText(new RegExp(`${total} platos encontrados`));
  });

  test('es usable con teclado y anuncia los resultados', async ({ page }) => {
    await searchBox(page).focus();
    await page.keyboard.type('napoli');
    await expect(resultCount(page)).toHaveAttribute('role', 'status');
    await expect(page.locator('[data-announcer]')).toContainText(/platos encontrados/i);
    await page.keyboard.press('Tab');
    await expect(categoryFilter(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(resetButton(page)).toBeFocused();
  });

  test('no ofrece filtros dietéticos sin datos verificados', async ({ page }) => {
    await expect(page.locator('[data-menu-filters]')).not.toContainText(/vegetariano|vegano|sin lactosa|picante/i);
  });

  test('filtrar no altera la cesta', async ({ page }) => {
    await card(page, 'PAN DE AJO').getByRole('button', { name: /añadir/i }).click();
    await expect(page.locator('[data-cart-count]')).toHaveText(/1 producto/i);
    await searchBox(page).fill('napoli');
    await expect(page.locator('[data-cart-count]')).toHaveText(/1 producto/i);
    await expect(page.locator('[data-cart-lines]')).toContainText('PAN DE AJO');
  });
});

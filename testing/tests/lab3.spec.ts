import { test, expect } from '@playwright/test';

test('Гость может открыть меню "Products" в шапке сайта', async ({ page }) => {
  // 1. Переходим на сайт
  await page.goto('https://github.com/', { waitUntil: 'domcontentloaded' });

  // 2. Ищем кнопку "Products" в верхнем меню
  const productsButton = page.getByRole('button', { name: 'Products' });

  // Ждем, пока она появится (на случай медленной загрузки)
  await expect(productsButton).toBeVisible({ timeout: 15000 });

  // 3. Кликаем по ней
  await productsButton.click();

  // 4. Проверяем, что открылось выпадающее меню с пунктом "Actions"
  // Используем getByRole('link'), так как внутри меню обычно ссылки
  const actionsLink = page.getByRole('link', { name: 'Actions' }).first();
  await expect(actionsLink).toBeVisible({ timeout: 5000 });

  // 5. Кликаем на "Actions" и проверяем переход
  await actionsLink.click();
  await expect(page).toHaveURL(/.*\/features\/actions/);
});

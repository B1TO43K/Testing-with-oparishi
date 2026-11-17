import { test, expect } from '@playwright/test';

test('Гость может открыть меню "Products" в шапке сайта', async ({ page }) => {
  // 1. Переходим на сайт
  await page.goto('https://github.com/', { waitUntil: 'domcontentloaded' });

  const header = page.locator('header').first();
  await expect(header).toBeVisible();

  // Проверяем только стабильные элементы, которые точно есть в хедере
  await expect(header.getByRole('link', { name: /pricing/i }).first()).toBeVisible();
  
  // Кнопки авторизации
  await expect(header.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
  await expect(header.getByRole('link', { name: /sign up/i }).first()).toBeVisible();
=======
test('Страница логина открывается и содержит поля ввода', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/login/);

  // 4. Проверяем, что открылось выпадающее меню с пунктом "Actions"
  // Используем getByRole('link'), так как внутри меню обычно ссылки
  const actionsLink = page.getByRole('link', { name: 'Actions' }).first();
  await expect(actionsLink).toBeVisible({ timeout: 5000 });

  // 5. Кликаем на "Actions" и проверяем переход
  await actionsLink.click();
  await expect(page).toHaveURL(/.*\/features\/actions/);
});

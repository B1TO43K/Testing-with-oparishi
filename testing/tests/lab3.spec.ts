

import { test, expect } from '@playwright/test';

// Увеличиваем таймаут для всего файла, так как GitHub тяжелый
test.describe.configure({ timeout: 60000 });

test('в хедере видны ключевые элементы навигации', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

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

  // Используем точные метки, которые использует GitHub
  await expect(page.getByLabel('Username or email address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  
  const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
  await expect(signInBtn).toBeVisible();

  // Проверяем валидацию пустой отправки (страница не должна уходить с /login)
  await signInBtn.click();
  await expect(page).toHaveURL(/login/);
});

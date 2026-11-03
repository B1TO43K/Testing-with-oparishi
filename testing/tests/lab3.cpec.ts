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
});

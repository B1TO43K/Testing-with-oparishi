import { test, expect } from '@playwright/test';

// Увеличиваем таймаут для всего файла, так как GitHub тяжелый
test.describe.configure({ timeout: 60000 });

test('главная страница GitHub загружается с корректным title и контентом', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/GitHub/i);
  
  // Проверяем наличие главного заголовка (h1)
  await expect(page.locator('h1').first()).toBeVisible();

  // Проверяем, что присутствует навигация (header)
  await expect(page.locator('header').first()).toBeVisible();

  // Проверяем кнопку "Sign in"
  await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
});

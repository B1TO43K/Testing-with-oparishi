import { test, expect } from '@playwright/test';

// Увеличиваем таймаут для всего файла, так как GitHub тяжелый
test.describe.configure({ timeout: 60000 });

test(' футер содержит ссылки на политики и продукты', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Футер на GitHub обычно в самом низу
  const footer = page.locator('footer').last();
  
  // Прокручиваем к футеру
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();

  // Проверяем ключевые ссылки футера
  await expect(footer.getByRole('link', { name: /privacy/i }).first()).toBeVisible();
  await expect(footer.getByRole('link', { name: /terms/i }).first()).toBeVisible();

  // Проверяем, что ссылка имеет href
  const href = await footer.getByRole('link', { name: /privacy/i }).first().getAttribute('href');
  expect(href).toBeTruthy();
});

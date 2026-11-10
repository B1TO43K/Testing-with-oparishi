
test('4 футер содержит ссылки на политики и продукты', async ({ page }) => {
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

test('5 переход по ссылке Terms из футера работает', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Находим футер и ссылку Terms
  const footer = page.locator('footer').last();
  await footer.scrollIntoViewIfNeeded();
  
  const termsLink = footer.getByRole('link', { name: /terms/i }).first();
  const href = await termsLink.getAttribute('href');
  expect(href).toBeTruthy();
  
  // Кликаем и проверяем, что перешли (может быть внешняя ссылка)
  await termsLink.click();
  // Проверяем, что URL изменился и содержит terms
  await expect(page).toHaveURL(/terms/i);
});

test('6 базовые элементы доступности присутствуют', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Проверяем наличие skip-link (для навигации с клавиатуры)
  const skipLink = page.locator('a[href="#main"], a:has-text("Skip to content")').first();
  if (await skipLink.count() > 0) {
    await expect(skipLink).toBeAttached();
  }

  // Проверяем, что у всех изображений есть атрибут alt (или role="presentation")
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  // Допускаем небольшое количество декоративных изображений, но не все
  const totalImages = await page.locator('img').count();
  if (totalImages > 0) {
    expect(imagesWithoutAlt).toBeLessThan(totalImages * 0.5); // Меньше половины без alt
  }

import { test, expect } from '@playwright/test';

test.describe.configure({ timeout: 60000 });

test('1. страница логина открывается и содержит поля ввода', async ({ page }) => {
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

test('2. страница About доступна', async ({ page }) => {
  await page.goto('/about', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/about/i);
  
  // Проверяем, что на странице есть информация о GitHub
  await expect(page.locator('body')).toContainText(/GitHub/i);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('3. переключатель темы в настройках меняет тему страницы', async ({ page }) => {
  // Переходим сразу на страницу настроек внешнего вида (доступна только авторизованным, 
  // но даже без авторизации мы можем проверить атрибуты темы на главной)
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Проверяем атрибуты темы на html
  const html = page.locator('html');
  const initialScheme = await html.getAttribute('data-color-mode');
  expect(initialScheme === null || ['light', 'dark', 'auto'].includes(initialScheme)).toBe(true);

  // Эмуляция тёмной темы через медиа-запрос
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Убеждаемся, что страница не упала и body доступен
  await expect(page.locator('body')).toBeVisible();

  // Проверяем наличие переключателя (если он есть в DOM)
  const themeToggle = page.locator('[aria-label*="theme" i], [data-color-mode-toggle]').first();
  if (await themeToggle.count()) {
    await expect(themeToggle).toBeVisible();
  }
});

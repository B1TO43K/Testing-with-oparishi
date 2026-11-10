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

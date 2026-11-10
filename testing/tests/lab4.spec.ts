test('8. поиск репозитория "playwright" возвращает результаты', async ({ page }) => {
  await page.goto('/search?q=playwright&type=repositories', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('body')).toContainText(/playwright/i);

  // Должен быть хотя бы один результат
  const repoLinks = page.locator('a[href*="/microsoft/playwright"], a[href*="/playwright"]');
  await expect(repoLinks.first()).toBeVisible();

  // Переход в репозиторий
  await repoLinks.first().click();
  await expect(page).toHaveURL(/\/[\w-]+\/[\w-]+/);
});

test('поиск репозитория через URL возвращает результаты', async ({ page }) => {
  // Идём сразу на страницу поиска с параметром запроса
  // Это быстрее и надёжнее, чем кликать по полю на главной
  await page.goto('https://github.com/search?q=playwright&type=repositories', {
    waitUntil: 'domcontentloaded',
  });

  // Проверяем, что на странице есть слово playwright (результаты поиска)
  await expect(page.locator('body')).toContainText(/playwright/i);

  // Ищем хотя бы одну ссылку на репозиторий (обычно ведёт на /owner/repo)
  const repoLink = page.locator('a[href*="/microsoft/playwright"], a[href*="/playwright"]').first();
  await expect(repoLink).toBeVisible();

  // Опционально: проверяем, что ссылка ведёт на страницу репозитория
  const href = await repoLink.getAttribute('href');
  expect(href).toMatch(/\/[\w-]+\/[\w-]+/);
});
test('13. страница содержит изображения из CDN Fandom', async ({ page }) => {
  const contentImages = page.locator(
    'img[src^="https://static.wikia.nocookie.net/"]',
  );

  expect(await contentImages.count()).toBeGreaterThan(0);
  await expect(contentImages.first()).toHaveAttribute('src', /^https:\/\//);
});

test('14. футер содержит основные информационные разделы', async ({ page }) => {
  const footer = page.locator('footer').last();
  await footer.scrollIntoViewIfNeeded();

  await expect(footer).toBeVisible();
  await expect(footer).toContainText(/Explore properties/i);
  await expect(footer).toContainText(/Overview/i);
  await expect(footer).toContainText(/Community/i);
});

test('15. в футере присутствуют ссылки About и Careers', async ({ page }) => {
  const footer = page.locator('footer').last();
  const aboutLink = footer.locator('a[href*="/about"]').first();
  const careersLink = footer.locator('a[href*="/careers"]').first();

  await footer.scrollIntoViewIfNeeded();
  await expect(aboutLink).toBeVisible();
  await expect(careersLink).toBeVisible();
});
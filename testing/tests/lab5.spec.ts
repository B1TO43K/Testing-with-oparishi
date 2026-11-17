test('16. в футере есть ссылки на соцсети и мобильные приложения', async ({ page }) => {
  const footer = page.locator('footer').last();
  await footer.scrollIntoViewIfNeeded();

  await expect(footer.locator('a[href*="facebook.com"]').first()).toBeVisible();
  await expect(footer.locator('a[href*="instagram.com"]').first()).toBeVisible();
  await expect(footer.locator('a[href*="youtube.com"]').first()).toBeVisible();
  await expect(footer.locator(
    'a[href*="itunes.apple.com"], a[href*="apps.apple.com"]',
  ).first()).toBeVisible();
  await expect(footer.locator('a[href*="play.google.com"]').first()).toBeVisible();
});

test('17. переход в раздел Games выполняется через меню', async ({ page }) => {
  const gamesLink = topicLink(page, '/topics/games');

  await gamesLink.click();

  await expect(page).toHaveURL(/\/topics\/games$/);
  await expect(page).toHaveTitle(/Games\s*\|\s*Fandom/i);
  await expect(page.getByRole('heading', {
    level: 1,
    name: 'Games',
    exact: true,
  }).first()).toBeVisible();
});

test('18. переход в раздел TV выполняется через меню', async ({ page }) => {
  const tvLink = topicLink(page, '/topics/tv');

  await tvLink.click();

  await expect(page).toHaveURL(/\/topics\/tv$/);
  await expect(page).toHaveTitle(/TV\s*\|\s*Fandom/i);
  await expect(page.getByRole('heading', {
    level: 1,
    name: 'TV',
    exact: true,
  }).first()).toBeVisible();
});

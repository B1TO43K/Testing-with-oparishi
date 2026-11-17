test('10. дополнительная навигация содержит Settings и More', async ({ page }) => {
  const navigation = page.getByRole('navigation', {
    name: 'Fandom navigation',
    exact: true,
  }).nth(1);
  const settingsButton = navigation.getByRole('button', {
    name: 'Settings',
    exact: true,
  });
  const moreButton = navigation.getByRole('button', {
    name: 'More',
    exact: true,
  });

  await expect(settingsButton).toBeVisible();
  await expect(moreButton).toBeVisible();
});

test('11. страница содержит ссылки на материалы Fandom', async ({ page }) => {
  const articleLinks = page.locator(
    'a[href*="/articles/"], a[href*="/curated/"]',
  );
  const linksWithText = await articleLinks.evaluateAll((links) =>
    links.filter((link) => link.textContent?.trim()).length,
  );

  expect(await articleLinks.count()).toBeGreaterThan(0);
  expect(linksWithText).toBeGreaterThan(0);
});

test('12. на странице отображается блок Top Wikis', async ({ page }) => {
  const heading = page.getByRole('heading', {
    name: 'Top Wikis',
    exact: true,
  }).first();

  await expect(heading).toBeVisible();
  expect(await page.locator('a[href*=".fandom.com"]').count()).toBeGreaterThan(3);
});
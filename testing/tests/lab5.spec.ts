test('7. ссылка Home ведет на главную страницу Fandom', async ({ page }) => {
  const navigation = page.getByRole('navigation', {
    name: 'Fandom navigation',
    exact: true,
  }).first();
  const homeLink = navigation.getByRole('link', {
    name: 'Home',
    exact: true,
  });

  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute('href', `${BASE_URL}/`);
});

test('8. ссылка Saved ведет в раздел сохраненных материалов', async ({ page }) => {
  const navigation = page.getByRole('navigation', {
    name: 'Fandom navigation',
    exact: true,
  }).first();
  const savedLink = navigation.getByRole('link', {
    name: 'Saved',
    exact: true,
  });

  await expect(savedLink).toBeVisible();
  await expect(savedLink).toHaveAttribute('href', `${BASE_URL}/saved`);
});

test('9. поле поиска позволяет ввести запрос', async ({ page }) => {
  const searchInput = page.getByRole('textbox', {
    name: 'Search',
    exact: true,
  }).first();

  await expect(searchInput).toBeVisible();
  await searchInput.fill('Star Wars');
  await expect(searchInput).toHaveValue('Star Wars');
});
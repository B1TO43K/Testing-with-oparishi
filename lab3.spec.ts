test('Страница логина открывается и содержит поля ввода', async ({ page }) => {
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

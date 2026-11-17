import { expect, test, type Page } from '@playwright/test';

const BASE_URL = 'https://www.fandom.com';
const START_PAGE = `${BASE_URL}/topics/movies`;

test.use({
  locale: 'en-US',
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
});

test.describe.configure({ timeout: 60_000 });

async function openMoviesPage(page: Page) {
  const response = await page.goto(START_PAGE, {
    waitUntil: 'domcontentloaded',
  });

  expect(response, 'Сервер должен вернуть ответ на запрос страницы').not.toBeNull();
  expect(response!.status(), 'Страница не должна возвращать HTTP-ошибку').toBeLessThan(400);
  await expect(page).not.toHaveTitle(/just a moment/i);
}

function topicLink(page: Page, path: string) {
  return page.locator(`a[href="${BASE_URL}${path}"]:visible`).first();
}

test.beforeEach(async ({ page }) => {
  await openMoviesPage(page);
});

test('1. страница Movies открывается с правильным URL и заголовком', async ({ page }) => {
  await expect(page).toHaveURL(START_PAGE);
  await expect(page).toHaveTitle(/Movies\s*\|\s*Fandom/i);
});

test('2. на странице отображается заголовок Movies первого уровня', async ({ page }) => {
  const heading = page.getByRole('heading', {
    level: 1,
    name: 'Movies',
    exact: true,
  }).first();

  await expect(heading).toBeVisible();
});

test('3. логотип Fandom ведет на главную страницу', async ({ page }) => {
  const logo = page.getByRole('link', {
    name: 'Fandom homepage',
    exact: true,
  }).first();

  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('href', `${BASE_URL}/`);
});

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
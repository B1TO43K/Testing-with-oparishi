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
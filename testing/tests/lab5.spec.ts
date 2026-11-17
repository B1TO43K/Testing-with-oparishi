
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

// import { expect, test, type Page } from '@playwright/test';

// const BASE_URL = 'https://www.fandom.com';
// const START_PAGE = `${BASE_URL}/topics/movies`;

// test.use({
//   locale: 'en-US',
//   viewport: { width: 1440, height: 900 },
//   userAgent:
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
//     '(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
// });

// test.describe.configure({ timeout: 60_000 });

// async function openMoviesPage(page: Page) {
//   const response = await page.goto(START_PAGE, {
//     waitUntil: 'domcontentloaded',
//   });

//   expect(response, 'Сервер должен вернуть ответ на запрос страницы').not.toBeNull();
//   expect(response!.status(), 'Страница не должна возвращать HTTP-ошибку').toBeLessThan(400);
//   await expect(page).not.toHaveTitle(/just a moment/i);
// }

// function topicLink(page: Page, path: string) {
//   return page.locator(`a[href="${BASE_URL}${path}"]:visible`).first();
// }

// test.beforeEach(async ({ page }) => {
//   await openMoviesPage(page);
// });

test('4. меню содержит основные тематические разделы', async ({ page }) => {
  const topics = [
    { name: 'Games', path: '/topics/games' },
    { name: 'Movies', path: '/topics/movies' },
    { name: 'TV', path: '/topics/tv' },
  ];

  for (const topic of topics) {
    const link = topicLink(page, topic.path);
    await expect(link).toBeVisible();
    await expect(link).toHaveText(topic.name);
    await expect(link).toHaveAttribute('href', `${BASE_URL}${topic.path}`);
  }
});

test('5. ссылка Sign In ведет на страницу авторизации', async ({ page }) => {
  const signInLink = page.getByRole('link', {
    name: 'Sign In',
    exact: true,
  }).first();

  await expect(signInLink).toBeVisible();
  await expect(signInLink).toHaveAttribute(
    'href',
    /^https:\/\/auth\.fandom\.com\/signin\?/,
  );
});

test('6. ссылка создания аккаунта ведет на регистрацию', async ({ page }) => {
  const registrationLink = page.getByRole('link', {
    name: 'Create a Free Account',
    exact: true,
  }).first();

  await expect(registrationLink).toBeVisible();
  await expect(registrationLink).toHaveAttribute(
    'href',
    /^https:\/\/auth\.fandom\.com\/register\?/,
  );
});
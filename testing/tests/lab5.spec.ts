
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
});test('13. страница содержит изображения из CDN Fandom', async ({ page }) => {
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
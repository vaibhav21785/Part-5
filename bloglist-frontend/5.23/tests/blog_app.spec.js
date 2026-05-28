import { test, expect, beforeEach, describe } from '@playwright/test'

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {

      await page.getByTestId('username').fill('testuser')

      await page.getByTestId('password').fill('password')

      await page.getByRole('button', { name: 'login' }).click()
    })

   test('blogs are ordered by likes with most liked first', async ({ page }) => {

  // CREATE BLOG 1
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByTestId('title').fill('first blog')
  await page.getByTestId('author').fill('author1')
  await page.getByTestId('url').fill('http://first.com')

  await page.getByRole('button', { name: 'create' }).click()

  // CREATE BLOG 2
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByTestId('title').fill('second blog')
  await page.getByTestId('author').fill('author2')
  await page.getByTestId('url').fill('http://second.com')

  await page.getByRole('button', { name: 'create' }).click()

  // CREATE BLOG 3
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByTestId('title').fill('third blog')
  await page.getByTestId('author').fill('author3')
  await page.getByTestId('url').fill('http://third.com')

  await page.getByRole('button', { name: 'create' }).click()

  // WAIT BLOGS
  await page.waitForTimeout(1000)

  // OPEN ALL BLOGS
  const viewButtons = page.getByRole('button', { name: 'view' })

  await viewButtons.nth(0).click()
  await viewButtons.nth(1).click()
  await viewButtons.nth(2).click()

  // LIKE SECOND BLOG 5 TIMES
  const secondBlog = page.locator('[data-testid="blog"]')
    .filter({ hasText: 'second blog' })

  for (let i = 0; i < 5; i++) {
    await secondBlog.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(300)
  }

  // LIKE THIRD BLOG 3 TIMES
  const thirdBlog = page.locator('[data-testid="blog"]')
    .filter({ hasText: 'third blog' })

  for (let i = 0; i < 3; i++) {
    await thirdBlog.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(300)
  }

  // LIKE FIRST BLOG 1 TIME
  const firstBlog = page.locator('[data-testid="blog"]')
    .filter({ hasText: 'first blog' })

  await firstBlog.getByRole('button', { name: 'like' }).click()

  await page.waitForTimeout(2000)

  // CHECK ORDER
  const blogs = await page.locator('[data-testid="blog"]').allTextContents()

  expect(blogs[0]).toContain('second blog')
  expect(blogs[1]).toContain('third blog')
  expect(blogs[2]).toContain('first blog')
})
  })
})
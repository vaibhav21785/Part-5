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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User 2',
        username: 'testuser2',
        password: 'password'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('a blog created by playwright')
      await page.getByTestId('author').fill('playwright')
      await page.getByTestId('url').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a blog created by playwright').first()).toBeVisible()
    })

    test('user who added blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('blog to be deleted')
      await page.getByTestId('author').fill('playwright')
      await page.getByTestId('url').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('blog to be deleted').first()).toBeVisible()

      // Expand the blog details
      await page.locator('div').filter({ hasText: 'blog to be deleted' }).first().getByRole('button', { name: 'view' }).first().click()

      // Handle window.confirm dialog automatically and accept it
      page.on('dialog', dialog => dialog.accept())

      // Click remove button
      await page.locator('div').filter({ hasText: 'blog to be deleted' }).first().getByRole('button', { name: 'remove' }).first().click()

      // Wait for the blog to be removed from the page
      await page.waitForTimeout(500)
    })

    test('only blog creator sees delete button', async ({ page }) => {
      // User 1 creates a blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('test blog for delete visibility')
      await page.getByTestId('author').fill('playwright')
      await page.getByTestId('url').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('test blog for delete visibility').first()).toBeVisible()

      // User 1 logs out
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

      // User 2 logs in
      await page.getByTestId('username').fill('testuser2')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

      // User 2 expands the blog and verifies remove button is NOT visible
      await page.locator('div').filter({ hasText: 'test blog for delete visibility' }).first().getByRole('button', { name: 'view' }).first().click()
      await expect(page.locator('div').filter({ hasText: 'test blog for delete visibility' }).first().getByRole('button', { name: 'remove' }).first()).not.toBeVisible()

      // User 2 logs out
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

      // User 1 logs back in
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

      // User 1 expands the blog and verifies remove button IS visible
      await page.locator('div').filter({ hasText: 'test blog for delete visibility' }).first().getByRole('button', { name: 'view' }).first().click()
      await expect(page.locator('div').filter({ hasText: 'test blog for delete visibility' }).first().getByRole('button', { name: 'remove' }).first()).toBeVisible()
    })
  })
})

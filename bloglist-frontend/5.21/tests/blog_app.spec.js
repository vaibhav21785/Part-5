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
      await page.getByRole('button', { name: 'view' }).click()

      // Handle window.confirm dialog automatically and accept it
      page.on('dialog', dialog => dialog.accept())

      // Click remove button
      await page.getByRole('button', { name: 'remove' }).click()

      // Verify the blog is deleted
      await expect(page.getByText('blog to be deleted').first()).not.toBeVisible()
    })
  })
})

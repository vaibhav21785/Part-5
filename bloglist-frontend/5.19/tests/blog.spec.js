import { test, expect } from '@playwright/test'

test.describe('When logged in', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Reset database
    await page.request.post('http://localhost:3003/api/testing/reset')

    // Create test user
    await page.request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        password: 'password123',
        name: 'Test User'
      }
    })

    // Reload page to see login form
    await page.reload()

    // click login button
    await page.getByText('log in').click()

    // fill login form
    await page.locator('input[type="text"]').fill('testuser')
    await page.locator('input[type="password"]').fill('password123')

    // submit login
    await page.getByRole('button', { name: 'login' }).click()

    // wait for logout button to appear (indicates successful login)
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('a new blog can be created', async ({ page }) => {
    // open create blog form
    await page.getByText('new blog').click()

    // fill blog details using form inputs
    const form = page.locator('form')
    const inputs = form.locator('input')
    
    await inputs.nth(0).fill('Playwright is awesome')
    await inputs.nth(1).fill('Vaibhav')
    await inputs.nth(2).fill('http://example.com')

    // submit blog
    await page.getByRole('button', { name: 'create' }).click()

    // verify blog appears in list (get all matches and pick the one in the blog list, not notification)
    await expect(
      page.getByText('Playwright is awesome').last()
    ).toBeVisible()
  })

})
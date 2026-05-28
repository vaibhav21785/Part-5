import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174')
  })

  test('Login form is shown', async ({ page }) => {

    await page.goto('http://localhost:5174/login')

    await expect(
      page.getByRole('heading', { name: 'login' })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })
})
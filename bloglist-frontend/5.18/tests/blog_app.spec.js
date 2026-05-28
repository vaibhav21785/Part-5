import { test, expect, beforeEach, describe } from '@playwright/test'

describe('Blog app', () => {

  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    const locator = await page.getByText(
      'Log in to application'
    )

    await expect(locator).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })
})

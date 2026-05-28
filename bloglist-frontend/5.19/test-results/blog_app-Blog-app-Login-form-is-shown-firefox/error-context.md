# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> Login form is shown
- Location: tests\blog_app.spec.js:9:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect, beforeEach, describe } from '@playwright/test'
  2  | 
  3  | describe('Blog app', () => {
  4  | 
  5  |   beforeEach(async ({ page }) => {
> 6  |     await page.goto('/')
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  |   })
  8  | 
  9  |   test('Login form is shown', async ({ page }) => {
  10 | 
  11 |     const locator = await page.getByText(
  12 |       'Log in to application'
  13 |     )
  14 | 
  15 |     await expect(locator).toBeVisible()
  16 | 
  17 |     await expect(
  18 |       page.getByRole('button', { name: 'login' })
  19 |     ).toBeVisible()
  20 |   })
  21 | })
  22 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog.spec.js >> When logged in >> a new blog can be created
- Location: tests\blog.spec.js:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'logout' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'logout' })

```

```yaml
- heading "Log in to application" [level=2]
- text: username
- textbox: testuser
- text: password
- textbox: password123
- button "login"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('When logged in', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/')
  7  | 
  8  |     // Reset database
  9  |     await page.request.post('http://localhost:3003/api/testing/reset')
  10 | 
  11 |     // Create test user
  12 |     await page.request.post('http://localhost:3003/api/users', {
  13 |       data: {
  14 |         username: 'testuser',
  15 |         password: 'password123',
  16 |         name: 'Test User'
  17 |       }
  18 |     })
  19 | 
  20 |     // Reload page to see login form
  21 |     await page.reload()
  22 | 
  23 |     // click login button
  24 |     await page.getByText('log in').click()
  25 | 
  26 |     // fill login form
  27 |     await page.locator('input[type="text"]').fill('testuser')
  28 |     await page.locator('input[type="password"]').fill('password123')
  29 | 
  30 |     // submit login
  31 |     await page.getByRole('button', { name: 'login' }).click()
  32 | 
  33 |     // wait for logout button to appear (indicates successful login)
> 34 |     await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  35 |   })
  36 | 
  37 |   test('a new blog can be created', async ({ page }) => {
  38 |     // open create blog form
  39 |     await page.getByText('new blog').click()
  40 | 
  41 |     // fill blog details using form inputs
  42 |     const form = page.locator('form')
  43 |     const inputs = form.locator('input')
  44 |     
  45 |     await inputs.nth(0).fill('Playwright is awesome')
  46 |     await inputs.nth(1).fill('Vaibhav')
  47 |     await inputs.nth(2).fill('http://example.com')
  48 | 
  49 |     // submit blog
  50 |     await page.getByRole('button', { name: 'create' }).click()
  51 | 
  52 |     // verify blog appears in list (get all matches and pick the one in the blog list, not notification)
  53 |     await expect(
  54 |       page.getByText('Playwright is awesome').last()
  55 |     ).toBeVisible()
  56 |   })
  57 | 
  58 | })
```
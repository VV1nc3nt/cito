import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('home page renders the stub heading', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/ЦИТО/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    await expect(page.locator('main#main h1')).toHaveText(
      'Цифровая инфраструктура для образования и науки',
    )
  })

  test('skip link is the first tab stop and targets main', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveText('Перейти к содержимому')
    await expect(focused).toHaveAttribute('href', '#main')
  })
})

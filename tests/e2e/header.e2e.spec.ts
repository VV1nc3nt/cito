import { expect, test, type Page } from '@playwright/test'

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const STORAGE_KEY = 'cito-a11y'

const desktop = { width: 1440, height: 900 }
const mobile = { width: 390, height: 844 }

const focusedName = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    return el?.getAttribute('aria-label') ?? el?.innerText.trim() ?? ''
  })

const tabSequence = async (page: Page, count: number) => {
  const names: string[] = []
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab')
    names.push(await focusedName(page))
  }
  return names
}

const lvAttributes = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      [...document.documentElement.attributes]
        .filter((attr) => attr.name.startsWith('data-lv'))
        .map((attr) => [attr.name, attr.value]),
    ),
  )

test.describe('Header', () => {
  test('tab order on desktop', async ({ page }) => {
    await page.setViewportSize(desktop)
    await page.goto(BASE_URL)
    expect(await tabSequence(page, 10)).toEqual([
      'Перейти к содержимому',
      'ЦИТО — на главную',
      'О центре',
      'Деятельность',
      'Проекты',
      'Новости',
      'Документы',
      'Контакты',
      'Версия для слабовидящих',
      'Обращение',
    ])
    await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toHaveCount(1)
  })

  test('tab order on mobile', async ({ page }) => {
    await page.setViewportSize(mobile)
    await page.goto(BASE_URL)
    expect(await tabSequence(page, 4)).toEqual([
      'Перейти к содержимому',
      'ЦИТО — на главную',
      'Версия для слабовидящих',
      'Меню',
    ])
    await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toHaveCount(0)
  })

  test('without JavaScript the navigation is available and the low-vision button is not', async ({
    browser,
  }) => {
    for (const viewport of [desktop, mobile]) {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport })
      const page = await context.newPage()
      await page.goto(BASE_URL)
      const nav = page.getByRole('navigation', { name: 'Основная навигация' })
      await expect(nav).toHaveCount(1)
      await expect(nav.getByRole('link')).toHaveCount(6)
      await expect(page.getByRole('button', { name: /слабовидящих/ })).toHaveCount(0)
      await context.close()
    }
  })
})

test.describe('Mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobile)
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  })

  const menuButton = (page: Page) => page.getByRole('button', { name: 'Меню' })
  const menu = (page: Page) => page.getByRole('dialog', { name: 'Меню' })

  test('opens, traps focus and closes with Esc', async ({ page }) => {
    await expect(menuButton(page)).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false')
    await menuButton(page).click()
    await expect(menu(page)).toBeVisible()
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('button', { name: 'Закрыть' })).toBeFocused()

    for (let i = 0; i < 26; i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(menu(page)).toBeHidden()
    await expect(menuButton(page)).toBeFocused()
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false')
  })

  test('locks page scrolling and keeps the position', async ({ page }) => {
    await page.evaluate(() => {
      document.body.style.minHeight = '3000px'
      window.scrollTo(0, 0)
    })
    await menuButton(page).click()
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      'hidden',
    )
    await page.mouse.wheel(0, 800)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    await page.getByRole('button', { name: 'Закрыть' }).click()
    await expect(menuButton(page)).toBeFocused()
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      'visible',
    )
  })

  test('closes when the window gets wider than the mobile layout', async ({ page }) => {
    await menuButton(page).click()
    await page.setViewportSize({ width: 900, height: 844 })
    await expect(menu(page)).toBeHidden()
  })

  test('opens without animation when reduced motion is preferred', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await menuButton(page).click()
    const dialog = page.locator('dialog[open]')
    await expect(dialog).not.toHaveAttribute('data-animate')
    expect(await dialog.evaluate((el) => el.getAnimations().length)).toBe(0)
  })

  test('focus after a link on the same page with an existing anchor', async ({ page }) => {
    await page.evaluate(() => {
      const target = document.createElement('section')
      target.id = 'contacts'
      target.textContent = 'Обращение'
      document.body.append(target)
    })
    await menuButton(page).click()
    await menu(page).getByRole('link', { name: 'Оставить обращение' }).click()
    await expect(menu(page)).toBeHidden()
    await expect(page.locator('#contacts')).toBeFocused()
    await expect(page.locator('#contacts')).toHaveAttribute('tabindex', '-1')
  })

  test('focus after a link on the same page without the anchor', async ({ page }) => {
    await menuButton(page).click()
    await menu(page).getByRole('link', { name: 'Оставить обращение' }).click()
    await expect(menu(page)).toBeHidden()
    await expect(menuButton(page)).toBeFocused()
  })

  test('focus after a same-page link without a hash', async ({ page }) => {
    // A tel: link keeps the page; the browser hands the number to the system.
    await menuButton(page).click()
    await menu(page)
      .getByRole('link', { name: /Позвонить/ })
      .evaluate((link) => link.addEventListener('click', (event) => event.preventDefault()))
    await menu(page)
      .getByRole('link', { name: /Позвонить/ })
      .click()
    await expect(menu(page)).toBeHidden()
    await expect(menuButton(page)).toBeFocused()
  })

  test('a link to another page closes the menu and navigates', async ({ page }) => {
    await menuButton(page).click()
    await menu(page).getByRole('link', { name: 'Новости' }).click()
    await expect(page).toHaveURL(/\/news$/)
  })
})

test.describe('Low-vision mode', () => {
  test('turns on, applies changes at once and survives a reload', async ({ page }) => {
    await page.setViewportSize(desktop)
    await page.goto(BASE_URL)
    expect(await lvAttributes(page)).toEqual({})

    await page.getByRole('button', { name: 'Версия для слабовидящих' }).click()
    const dialog = page.getByRole('dialog', { name: 'Версия для слабовидящих' })
    await expect(dialog).toBeVisible()
    expect(await lvAttributes(page)).toEqual({
      'data-lv': 'on',
      'data-lv-size': '2',
      'data-lv-scheme': 'bw',
      'data-lv-letter': '1',
      'data-lv-line': '1',
      'data-lv-images': 'on',
    })

    await dialog.getByRole('radio', { name: /Белым по чёрному/ }).check()
    await dialog.getByRole('radio', { name: 'Не показывать' }).check()
    await expect(page.locator('html')).toHaveAttribute('data-lv-scheme', 'wb')

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Настройки для слабовидящих' })).toBeFocused()

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-lv-scheme', 'wb')
    await expect(page.locator('html')).toHaveAttribute('data-lv-images', 'off')
  })

  test('reset and the normal version', async ({ page }) => {
    await page.setViewportSize(desktop)
    await page.goto(BASE_URL)
    await page.getByRole('button', { name: 'Версия для слабовидящих' }).click()
    const dialog = page.getByRole('dialog', { name: 'Версия для слабовидящих' })
    await dialog.getByRole('radio', { name: 'Очень крупный' }).check()
    await dialog.getByRole('button', { name: 'Сбросить настройки' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-lv-size', '2')

    await dialog.getByRole('button', { name: 'Обычная версия сайта' }).click()
    await expect(dialog).toBeHidden()
    expect(await lvAttributes(page)).toEqual({})
    await page.reload()
    expect(await lvAttributes(page)).toEqual({})
  })

  test('broken storage gives the normal version without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.addInitScript((key) => localStorage.setItem(key, '{garbage'), STORAGE_KEY)
    await page.goto(BASE_URL)
    expect(await lvAttributes(page)).toEqual({})
    expect(errors).toEqual([])
  })
})

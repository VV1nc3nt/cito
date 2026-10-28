import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MainNav } from '@/components/header/MainNav'
import { isCurrentSection, mainNav } from '@/config/navigation'

vi.mock('next/navigation', () => ({ usePathname: () => '/news/123' }))

const currentLabels = (pathname: string) =>
  mainNav.filter(({ href }) => isCurrentSection(pathname, href)).map(({ label }) => label)

afterEach(cleanup)

describe('isCurrentSection', () => {
  it.each([
    ['/about', ['О центре']],
    ['/news/123', ['Новости']],
    ['/newsletter', []],
    ['/', []],
  ])('%s → %j', (pathname, labels) => {
    expect(currentLabels(pathname)).toEqual(labels)
  })
})

describe('MainNav', () => {
  it('marks only the current section with aria-current', () => {
    render(createElement(MainNav, { variant: 'inline' }))
    for (const { label } of mainNav) {
      const link = screen.getByRole('link', { name: label })
      if (label === 'Новости') expect(link.getAttribute('aria-current')).toBe('page')
      else expect(link.hasAttribute('aria-current')).toBe(false)
    }
  })
})

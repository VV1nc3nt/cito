import type { ComponentType } from 'react'

import {
  BuildingIcon,
  ChartIcon,
  DocIcon,
  LayersIcon,
  NewsIcon,
  PhoneIcon,
  type IconProps,
} from '@/components/icons'

export type NavItem = {
  label: string
  href: string
  /** Shown in the mobile menu only. */
  icon: ComponentType<IconProps>
}

/** Main menu, approved by the client. Kept in code, not in the CMS. */
export const mainNav: readonly NavItem[] = [
  { label: 'О центре', href: '/about', icon: BuildingIcon },
  { label: 'Деятельность', href: '/activity', icon: ChartIcon },
  { label: 'Проекты', href: '/projects', icon: LayersIcon },
  { label: 'Новости', href: '/news', icon: NewsIcon },
  { label: 'Документы', href: '/documents', icon: DocIcon },
  { label: 'Контакты', href: '/contacts', icon: PhoneIcon },
]

/** «Обращение» / «Оставить обращение»: the form section on the home page. */
export const appealHref = '/#contacts'

export const contacts = {
  phone: { label: '+7 (495) 009-02-29', href: 'tel:+74950090229' },
  email: { label: 'info@digitalobr.ru', href: 'mailto:info@digitalobr.ru' },
} as const

/** True for the section itself and any page inside it (/news/... → /news). */
export function isCurrentSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

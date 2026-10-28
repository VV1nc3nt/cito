'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isCurrentSection, mainNav } from '@/config/navigation'

import styles from './MainNav.module.css'

type MainNavProps = {
  /** inline: one row next to the logo (desktop); row: full-width second row (tablet). */
  variant: 'inline' | 'row'
  className?: string
}

export function MainNav({ variant, className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Основная навигация"
      className={`${styles.nav} ${styles[variant]} ${className ?? ''}`}
    >
      {mainNav.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={styles.link}
          aria-current={isCurrentSection(pathname, href) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

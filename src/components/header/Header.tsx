import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { appealHref } from '@/config/navigation'

import { LogoMark } from './LogoMark'
import { MainNav } from './MainNav'
import styles from './Header.module.css'

/** Site header of the public pages. Not sticky. */
export function Header() {
  return (
    <header className={styles.header} data-surface="dark">
      <Container className={styles.inner}>
        <div className={styles.bar}>
          <Link href="/" className={styles.logo} aria-label="ЦИТО — на главную">
            <LogoMark />
            <span className={styles.logoText}>
              <span className={styles.logoName}>ЦИТО</span>
              <span className={styles.logoTag}>ФГБУ</span>
            </span>
          </Link>

          <MainNav variant="inline" className={styles.desktopNav} />

          <div className={styles.actions}>
            <Link href={appealHref} className={`${styles.appeal} ${styles.wideOnly}`}>
              Обращение
            </Link>
          </div>
        </div>

        <MainNav variant="row" className={styles.rowNav} />
      </Container>
    </header>
  )
}

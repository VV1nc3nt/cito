import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { LowVisionControl } from '@/components/low-vision/LowVisionControl'
import { appealHref } from '@/config/navigation'

import { LogoMark } from './LogoMark'
import { MainNav } from './MainNav'
import { MobileMenu } from './MobileMenu'
import styles from './Header.module.css'

/** Site header of the public pages. Not sticky. */
export function Header() {
  return (
    <header className={styles.header} data-surface="dark">
      <Container className={styles.inner}>
        <div className={styles.bar}>
          <Link href="/" className={styles.logo} aria-label="ЦИТО — на главную" data-plain>
            <LogoMark />
            <span className={styles.logoText}>
              <span className={styles.logoName}>ЦИТО</span>
              <span className={styles.logoTag}>ФГБУ</span>
            </span>
          </Link>

          <MainNav variant="inline" className={styles.desktopNav} />

          <div className={styles.actions}>
            <LowVisionControl wideClassName={styles.wideOnly} mobileClassName={styles.mobileOnly} />
            <Link href={appealHref} className={`${styles.appeal} ${styles.wideOnly}`} data-plain>
              Обращение
            </Link>
            <MobileMenu buttonClassName={styles.mobileOnly} />
          </div>
        </div>

        <MainNav variant="row" className={styles.rowNav} />
      </Container>
    </header>
  )
}

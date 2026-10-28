import { Image } from '@/components/ui/Image'

import styles from './LogoMark.module.css'

/** White 44×44 plate with the logo. Decorative: the name is given by the surrounding link. */
export function LogoMark() {
  return (
    <Image
      src="/images/logo-cito.png"
      alt=""
      width={34}
      height={34}
      className={styles.image}
      frameClassName={styles.plate}
    />
  )
}

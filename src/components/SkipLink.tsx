import styles from './SkipLink.module.css'

/** First tab stop on every page; jumps to <main id="main">. */
export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main">
      Перейти к содержимому
    </a>
  )
}

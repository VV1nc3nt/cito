import type { CSSProperties, ComponentPropsWithoutRef } from 'react'

import styles from './Grid.module.css'

type DesktopSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type TabletSpan = 1 | 2 | 3 | 4 | 5 | 6

const cx = (...names: (string | undefined)[]) => names.filter(Boolean).join(' ')

/** 12 / 6 / 1 columns with a 16 / 12 / 12px gap. */
export function Grid({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(styles.grid, className)} {...rest} />
}

type GridItemProps = ComponentPropsWithoutRef<'div'> & {
  /** Columns on desktop (of 12). Defaults to full width. */
  span?: DesktopSpan
  /** Columns on tablet (of 6). Defaults to full width. On mobile items are always full width. */
  tabletSpan?: TabletSpan
}

export function GridItem({ span, tabletSpan, className, style, ...rest }: GridItemProps) {
  const vars = {
    ...(span && { '--span': span }),
    ...(tabletSpan && { '--span-tablet': tabletSpan }),
    ...style,
  } as CSSProperties
  return <div className={cx(styles.item, className)} style={vars} {...rest} />
}

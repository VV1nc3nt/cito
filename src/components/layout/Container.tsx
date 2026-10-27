import type { ComponentPropsWithoutRef, ElementType } from 'react'

import styles from './Container.module.css'

type ContainerProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

/** Centred page column: max-width 1280px, side padding 32 / 24 / 16px. */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  ...rest
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return (
    <Tag className={className ? `${styles.container} ${className}` : styles.container} {...rest} />
  )
}

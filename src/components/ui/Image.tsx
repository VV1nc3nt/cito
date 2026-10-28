import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import type { CSSProperties } from 'react'

import styles from './Image.module.css'

type ImageProps = NextImageProps & {
  /** Wrapper around the image (a plate, a frame). Hidden together with a decorative image. */
  frameClassName?: string
}

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')

/**
 * next/image with the low-vision "images off" setting:
 * a meaningful image is replaced by a frame with its alt text, a decorative one (alt="") is hidden.
 * Both states are rendered and switched by CSS, so the markup does not depend on the mode.
 */
export function Image({ alt, frameClassName, className, ...rest }: ImageProps) {
  if (alt === '') {
    const image = (
      <NextImage alt="" className={cx(className, !frameClassName && styles.decorative)} {...rest} />
    )
    return frameClassName ? (
      <span className={cx(frameClassName, styles.decorative)}>{image}</span>
    ) : (
      image
    )
  }

  const { width, height } = rest
  const size =
    typeof width === 'number' && typeof height === 'number'
      ? ({ '--image-width': `${width}px`, aspectRatio: `${width} / ${height}` } as CSSProperties)
      : undefined

  const content = (
    <>
      <NextImage alt={alt} className={cx(className, styles.content)} {...rest} />
      <span className={styles.fallback} style={size}>
        {alt}
      </span>
    </>
  )
  return frameClassName ? <span className={frameClassName}>{content}</span> : content
}

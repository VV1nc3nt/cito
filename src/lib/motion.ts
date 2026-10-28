'use client'

import { useSyncExternalStore } from 'react'

import { ON_ATTR as LOW_VISION_ATTR } from './low-vision/settings'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Motion is allowed unless the user prefers reduced motion or the low-vision mode is on. */
export function isMotionAllowed(): boolean {
  if (typeof window === 'undefined') return false
  return (
    !window.matchMedia(REDUCED_MOTION).matches &&
    !document.documentElement.hasAttribute(LOW_VISION_ATTR)
  )
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: [LOW_VISION_ATTR] })
  return () => {
    query.removeEventListener('change', onChange)
    observer.disconnect()
  }
}

/** Reactive isMotionAllowed(). False during server rendering and hydration. */
export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribe, isMotionAllowed, () => false)
}

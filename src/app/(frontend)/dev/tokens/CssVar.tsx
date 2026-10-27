'use client'

import { useEffect, useState } from 'react'

// CSS minification shortens colours (#ffffff -> #fff); show the full six-digit form.
const formatHex = (value: string) =>
  /^#[0-9a-f]{3}$/i.test(value)
    ? `#${[...value.slice(1)].map((c) => c + c).join('')}`.toUpperCase()
    : value.toUpperCase()

/** Prints the computed value of a custom property, so labels always match tokens.css. */
export function CssVar({ name }: { name: `--${string}` }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const read = () =>
      setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [name])

  return <code className="nowrap">{value.startsWith('#') ? formatHex(value) : value}</code>
}

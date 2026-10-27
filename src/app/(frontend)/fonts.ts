import localFont from 'next/font/local'

// Self-hosted (src/fonts, OFL). Each file contains the latin and cyrillic subsets.
export const onest = localFont({
  src: [
    { path: '../../fonts/Onest-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/Onest-500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/Onest-600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/Onest-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-onest',
})

export const jetbrainsMono = localFont({
  src: [
    { path: '../../fonts/JetBrainsMono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/JetBrainsMono-500.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  // Used only for small labels; do not preload it on every page.
  preload: false,
})

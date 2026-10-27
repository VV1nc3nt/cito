import type { Metadata } from 'next'
import React from 'react'

import '@/styles/tokens.css'
import '@/styles/base.css'

import { SkipLink } from '@/components/SkipLink'

import { jetbrainsMono, onest } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ЦИТО',
  description: 'ФГБУ «Центр информационно-технического обеспечения»',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SkipLink />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}

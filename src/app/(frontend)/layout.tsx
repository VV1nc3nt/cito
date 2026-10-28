import type { Metadata } from 'next'
import React from 'react'

import '@/styles/tokens.css'
import '@/styles/base.css'

import { Header } from '@/components/header/Header'
import { InlineScript } from '@/components/InlineScript'
import { SkipLink } from '@/components/SkipLink'

import { jetbrainsMono, onest } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ЦИТО',
  description: 'ФГБУ «Центр информационно-технического обеспечения»',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JavaScript runs; CSS shows the no-JS navigation without it. */}
        <InlineScript html="document.documentElement.setAttribute('data-js','')" />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}

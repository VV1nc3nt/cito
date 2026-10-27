import type { Metadata } from 'next'
import React from 'react'

import '@/styles/tokens.css'

import { jetbrainsMono, onest } from './fonts'

export const metadata: Metadata = {
  title: 'ЦИТО',
  description: 'ФГБУ «Центр информационно-технического обеспечения»',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${jetbrainsMono.variable}`}>
      <body>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}

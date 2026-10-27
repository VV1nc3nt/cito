import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'ЦИТО',
  description: 'ФГБУ «Центр информационно-технического обеспечения»',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}

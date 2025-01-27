import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IPM Bio Calculator,
  description: 'Created by 0xKnowles',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

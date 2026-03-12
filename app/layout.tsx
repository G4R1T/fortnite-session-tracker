import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fortnite Tracker',
  description: 'Track your Fortnite sessions',
  manifest: '/manifest.json',
  themeColor: '#facc15',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FortTrack' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#facc15" />
      </head>
      <body>{children}</body>
    </html>
  )
}

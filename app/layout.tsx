import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fortnite Tracker",
  description: "Track your Fortnite sessions, stats, and tilt levels.",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

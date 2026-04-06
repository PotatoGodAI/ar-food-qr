import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AR Food QR - Restaurant 3D AR Management',
  description: 'Upload 3D food models, generate QR codes, and let customers view dishes in augmented reality.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _oswald = Oswald({ subsets: ["latin"], weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Lens - AI Research Engine',
  description: 'Multi-agent AI research engine powered by Exa, Apify and Groq. Get comprehensive research reports in seconds.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans antialiased dark bg-black">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

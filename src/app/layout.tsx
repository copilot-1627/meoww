import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'FreeDns - Free DNS Management Made Simple | Powered by Flaxa Technologies',
  description: 'Manage your DNS records with ease. Get 2 free subdomains and support for SRV, A, and CNAME records. Additional subdomain slots available for ₹8 each.',
  keywords: 'DNS, DNS management, free DNS, subdomain, SRV records, A records, CNAME records, DNS hosting, domain management',
  authors: [{ name: 'Flaxa Technologies' }],
  creator: 'Flaxa Technologies',
  publisher: 'Flaxa Technologies',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'FreeDns - Free DNS Management Made Simple',
    description: 'Manage your DNS records with ease. Get 2 free subdomains and support for SRV, A, and CNAME records.',
    siteName: 'FreeDns',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'FreeDns - Free DNS Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreeDns - Free DNS Management Made Simple',
    description: 'Manage your DNS records with ease. Get 2 free subdomains and support for SRV, A, and CNAME records.',
    images: ['/logo.svg'],
    creator: '@FlaxaTech',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
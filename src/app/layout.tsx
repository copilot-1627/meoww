import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'FreeDNS - Free DNS Services | Subdomain Management Platform',
    template: '%s | FreeDNS'
  },
  description: 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies with A, CNAME, and SRV record management.',
  keywords: ['free dns', 'subdomain', 'dns management', 'free subdomain', 'dns hosting', 'domain hosting', 'flaxa technologies'],
  authors: [{ name: 'Flaxa Technologies', url: 'https://flaxa.tech' }],
  creator: 'Flaxa Technologies',
  publisher: 'Flaxa Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://freedns.flaxa.tech'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freedns.flaxa.tech',
    title: 'FreeDNS - Free DNS Services | Subdomain Management Platform',
    description: 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies.',
    siteName: 'FreeDNS',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'FreeDNS - Professional DNS Services',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreeDNS - Free DNS Services',
    description: 'Create and manage free subdomains with advanced DNS record support.',
    images: ['/og-image.png'],
    creator: '@flaxatech',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-site-verification-code',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'FreeDNS',
              description: 'Create and manage free subdomains with advanced DNS record support.',
              url: 'https://freedns.flaxa.tech',
              applicationCategory: 'NetworkingApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                description: 'Free DNS subdomain management with premium options'
              },
              provider: {
                '@type': 'Organization',
                name: 'Flaxa Technologies',
                url: 'https://flaxa.tech'
              }
            })
          }}
        />
      </body>
    </html>
  )
}
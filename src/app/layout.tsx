import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import SessionProviderWrapper from '@/components/providers/session-provider'

// Use system fonts to avoid loading issues
const systemFonts = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export const metadata: Metadata = {
  metadataBase: new URL('https://freedns.flaxa.tech'),
  title: {
    default: 'FreeDNS - Free DNS Services | Professional Subdomain Management Platform',
    template: '%s | FreeDNS - Free DNS Services'
  },
  description: 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies with A, CNAME, and SRV record management. Get 2 free subdomain slots + purchase additional slots at ₹8 each.',
  keywords: [
    'free dns',
    'subdomain management',
    'free subdomain',
    'dns hosting',
    'domain hosting',
    'dns records',
    'A records',
    'CNAME records', 
    'SRV records',
    'cloudflare dns',
    'flaxa technologies',
    'free dns service',
    'subdomain creator',
    'dns manager',
    'free hosting',
    'domain name service',
    'dns provider',
    'free domain',
    'dns management platform',
    'professional dns'
  ],
  authors: [{ name: 'Flaxa Technologies', url: 'https://flaxa.tech' }],
  creator: 'Flaxa Technologies',
  publisher: 'Flaxa Technologies',
  category: 'Technology',
  classification: 'DNS Services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freedns.flaxa.tech',
    siteName: 'FreeDNS',
    title: 'FreeDNS - Free DNS Services | Professional Subdomain Management Platform',
    description: 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FreeDNS - Free DNS Services',
        type: 'image/png',
      },
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'FreeDNS Logo',
        type: 'image/svg+xml',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@flaxatech',
    creator: '@flaxatech',
    title: 'FreeDNS - Free DNS Services',
    description: 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  alternates: {
    canonical: 'https://freedns.flaxa.tech',
    languages: {
      'en-US': 'https://freedns.flaxa.tech',
      'en': 'https://freedns.flaxa.tech'
    }
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    shortcut: '/logo.svg',
    apple: [
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/logo.svg', color: '#3B82F6' }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FreeDNS',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  other: {
    'theme-color': '#3B82F6',
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
    'application-name': 'FreeDNS',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'FreeDNS',
    'format-detection': 'telephone=no, date=no, address=no, email=no, url=no'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.cloudflare.com" />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS */
            body { font-family: ${systemFonts}; }
            .loading-spinner { animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `
        }} />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Flaxa Technologies',
              url: 'https://flaxa.tech',
              logo: 'https://freedns.flaxa.tech/logo.svg',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'support@flaxa.tech',
                availableLanguage: 'English'
              },
              sameAs: [
                'https://twitter.com/flaxatech',
                'https://github.com/copilot-1627'
              ]
            })
          }}
        />
        
        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'FreeDNS',
              description: 'Professional DNS subdomain management platform with free and premium options.',
              url: 'https://freedns.flaxa.tech',
              applicationCategory: 'NetworkingApplication',
              operatingSystem: 'Web Browser',
              browserRequirements: 'Requires JavaScript. Works with modern web browsers.',
              softwareVersion: '1.0',
              releaseDate: '2024-01-01',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free Plan',
                  price: '0',
                  priceCurrency: 'INR',
                  description: '2 free subdomain slots with basic DNS management',
                  category: 'Free Tier'
                },
                {
                  '@type': 'Offer',
                  name: 'Additional Slots',
                  price: '8',
                  priceCurrency: 'INR',
                  description: 'Additional subdomain slots for premium users',
                  category: 'Premium Add-on'
                }
              ],
              provider: {
                '@type': 'Organization',
                name: 'Flaxa Technologies',
                url: 'https://flaxa.tech'
              },
              featureList: [
                'Free Subdomain Management',
                'A Record Support',
                'CNAME Record Support',
                'SRV Record Support',
                'Cloudflare Integration',
                'Real-time DNS Updates',
                'Admin Dashboard',
                'Payment Integration'
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'FreeDNS',
              url: 'https://freedns.flaxa.tech',
              description: 'Professional DNS subdomain management platform',
              inLanguage: 'en-US',
              copyrightYear: new Date().getFullYear(),
              copyrightHolder: {
                '@type': 'Organization',
                name: 'Flaxa Technologies'
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://freedns.flaxa.tech/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </head>
      <body 
        style={{ fontFamily: systemFonts }} 
        className="min-h-screen bg-gray-50 antialiased"
      >
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        
        {/* Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
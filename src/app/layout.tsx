"use client"

import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

// Use system fonts to avoid loading issues
const systemFonts = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>FreeDNS - Free DNS Services | Subdomain Management Platform</title>
        <meta name="description" content="Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies with A, CNAME, and SRV record management." />
        <meta name="keywords" content="free dns, subdomain, dns management, free subdomain, dns hosting, domain hosting, flaxa technologies" />
        <meta name="author" content="Flaxa Technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* Favicon using logo.svg */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/logo.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/logo.svg" />
        
        {/* Fallback PNG icons for browsers that don't support SVG favicons */}
        <link rel="alternate icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="alternate icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="alternate icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        
        {/* Apple Touch Icons fallback */}
        <link rel="alternate apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="alternate apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="alternate apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="alternate apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="alternate apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="alternate apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="alternate apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="alternate apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://freedns.flaxa.tech" />
        <meta property="og:title" content="FreeDNS - Free DNS Services | Subdomain Management Platform" />
        <meta property="og:description" content="Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:site_name" content="FreeDNS" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FreeDNS - Free DNS Services" />
        <meta name="twitter:description" content="Create and manage free subdomains with advanced DNS record support." />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:creator" content="@flaxatech" />
        
        {/* Preconnect for performance */}
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
      </head>
      <body style={{ fontFamily: systemFonts }} className="min-h-screen bg-gray-50">
        <SessionProvider>
          {children}
        </SessionProvider>
        
        {/* Structured Data */}
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
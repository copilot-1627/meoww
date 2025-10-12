import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - FreeDNS | Manage Your Subdomains & DNS Records',
  description: 'Manage your subdomains, DNS records, and account settings. View your current usage, create new subdomains, and purchase additional slots. Professional DNS management dashboard.',
  keywords: [
    'dns dashboard',
    'subdomain management',
    'dns records manager',
    'dns control panel',
    'subdomain dashboard',
    'dns hosting dashboard',
    'manage dns records',
    'subdomain creator dashboard',
    'dns management interface',
    'cloudflare dns dashboard'
  ],
  openGraph: {
    title: 'DNS Management Dashboard - FreeDNS',
    description: 'Professional DNS management dashboard. Create and manage subdomains, DNS records, and account settings.',
    type: 'website',
    url: 'https://freedns.flaxa.tech/dashboard',
    images: [
      {
        url: '/og-dashboard.png',
        width: 1200,
        height: 630,
        alt: 'FreeDNS Dashboard Interface',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNS Management Dashboard - FreeDNS',
    description: 'Professional DNS management dashboard for subdomain and DNS record management.',
    images: ['/og-dashboard.png'],
  },
  robots: {
    index: false, // Dashboard should not be indexed as it's user-specific
    follow: true,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: 'https://freedns.flaxa.tech/dashboard',
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Dashboard */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'DNS Management Dashboard',
            description: 'Professional DNS management interface for subdomain and DNS record management',
            url: 'https://freedns.flaxa.tech/dashboard',
            isPartOf: {
              '@type': 'WebSite',
              name: 'FreeDNS',
              url: 'https://freedns.flaxa.tech'
            },
            about: {
              '@type': 'Service',
              name: 'DNS Management',
              provider: {
                '@type': 'Organization',
                name: 'Flaxa Technologies'
              }
            }
          })
        }}
      />
      {children}
    </>
  )
}
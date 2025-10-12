import { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FreeDNS - Free DNS Services | Professional Subdomain Management Platform by Flaxa Technologies',
  description: 'Get 2 free subdomain slots with professional DNS management. Create A, CNAME, and SRV records instantly. Powered by Cloudflare with premium options starting at ₹8 per additional slot.',
  keywords: [
    'free dns service',
    'free subdomain',
    'dns management platform', 
    'cloudflare dns',
    'professional dns hosting',
    'A records',
    'CNAME records',
    'SRV records',
    'flaxa technologies dns',
    'free domain hosting',
    'dns provider india',
    'subdomain creator',
    'dns hosting service',
    'free dns hosting',
    'domain management'
  ],
  openGraph: {
    title: 'FreeDNS - Free Professional DNS Services | 2 Free Subdomain Slots',
    description: 'Professional DNS management platform with 2 free subdomain slots. Create A, CNAME, and SRV records instantly with Cloudflare integration.',
    type: 'website',
    url: 'https://freedns.flaxa.tech',
    images: [
      {
        url: '/og-image-home.png',
        width: 1200,
        height: 630,
        alt: 'FreeDNS - Free Professional DNS Services',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreeDNS - Free Professional DNS Services',
    description: 'Get 2 free subdomain slots with professional DNS management. Create DNS records instantly.',
    images: ['/og-image-home.png'],
  },
  alternates: {
    canonical: 'https://freedns.flaxa.tech',
  },
  other: {
    'article:author': 'Flaxa Technologies',
    'article:publisher': 'https://flaxa.tech',
  }
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data for HomePage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'FreeDNS - Professional DNS Services',
            description: 'Professional DNS subdomain management with free and premium tiers',
            provider: {
              '@type': 'Organization',
              name: 'Flaxa Technologies',
              url: 'https://flaxa.tech',
              logo: 'https://freedns.flaxa.tech/logo.svg'
            },
            areaServed: {
              '@type': 'Country',
              name: 'India'
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'DNS Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Free DNS Plan',
                    description: '2 free subdomain slots with basic DNS management'
                  },
                  price: '0',
                  priceCurrency: 'INR',
                  availability: 'https://schema.org/InStock'
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Additional Subdomain Slots',
                    description: 'Premium subdomain slots with advanced features'
                  },
                  price: '8',
                  priceCurrency: 'INR',
                  availability: 'https://schema.org/InStock'
                }
              ]
            },
            serviceType: 'DNS Management',
            url: 'https://freedns.flaxa.tech'
          })
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How many free subdomain slots do I get?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Every user gets 2 free subdomain slots when they sign up. You can purchase additional slots for ₹8 each if you need more.'
                }
              },
              {
                '@type': 'Question',
                name: 'What DNS record types are supported?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'FreeDNS supports A records (IPv4), CNAME records (aliases), and SRV records (service discovery) with real-time DNS propagation.'
                }
              },
              {
                '@type': 'Question',
                name: 'How fast is DNS propagation?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DNS changes propagate instantly through our Cloudflare integration, typically within seconds worldwide.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is there an admin dashboard?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, FreeDNS includes a comprehensive admin dashboard for managing domains, users, transactions, and analytics.'
                }
              }
            ]
          })
        }}
      />
      
      <main className="min-h-screen bg-white" role="main">
        <Header />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}
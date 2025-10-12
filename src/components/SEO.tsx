'use client'

import Head from 'next/head'
import { usePathname } from 'next/navigation'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noindex?: boolean
  canonical?: string
  structuredData?: any
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = '/og-image.png',
  noindex = false,
  canonical,
  structuredData,
  breadcrumbs = []
}: SEOProps) {
  const pathname = usePathname()
  const baseUrl = 'https://freedns.flaxa.tech'
  const currentUrl = canonical || `${baseUrl}${pathname}`
  
  const defaultTitle = 'FreeDNS - Free Professional DNS Services'
  const defaultDescription = 'Create and manage free subdomains with advanced DNS record support. Professional DNS services powered by Flaxa Technologies.'
  
  const seoTitle = title ? `${title} | FreeDNS` : defaultTitle
  const seoDescription = description || defaultDescription
  const seoKeywords = ['free dns', 'subdomain management', 'dns hosting', ...keywords].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:site_name" content="FreeDNS" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:site" content="@flaxatech" />
      <meta name="twitter:creator" content="@flaxatech" />
      
      {/* Additional Meta */}
      <meta name="author" content="Flaxa Technologies" />
      <meta name="publisher" content="Flaxa Technologies" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Flaxa Technologies`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Breadcrumbs Structured Data */}
      {breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: `${baseUrl}${crumb.url}`
              }))
            })
          }}
        />
      )}
    </Head>
  )
}

// Predefined structured data templates
export const StructuredData = {
  // Service page structured data
  service: (name: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'Flaxa Technologies',
      url: 'https://flaxa.tech'
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    serviceType: 'DNS Management'
  }),
  
  // Article structured data
  article: (title: string, description: string, publishedTime: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: 'Flaxa Technologies'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Flaxa Technologies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://freedns.flaxa.tech/logo.svg'
      }
    },
    datePublished: publishedTime,
    dateModified: publishedTime
  }),
  
  // FAQ structured data
  faq: (questions: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }),
  
  // Product structured data for pricing
  product: (name: string, price: number, currency: string = 'INR') => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Flaxa Technologies'
      }
    }
  })
}
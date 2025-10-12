/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
    serverComponentsExternalPackages: ['@vercel/analytics', '@vercel/speed-insights', 'mongodb'],
  },
  
  // Image optimization
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'cdn.flaxa.tech'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ]
      },
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400' // 24 hours
          }
        ]
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400' // 24 hours
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/dashboard',
        permanent: false,
      }
    ]
  },
  
  // URL rewrites for better SEO URLs
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: '/documentation'
      },
      {
        source: '/help',
        destination: '/documentation'
      },
      {
        source: '/support',
        destination: '/contact'
      }
    ]
  },
  
  // Static file optimization
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CDN_URL || '' : '',
  
  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  
  // Output optimization
  output: 'standalone',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Webpack customization for performance and MongoDB exclusion
  webpack: (config, { dev, isServer }) => {
    // Exclude MongoDB and other Node.js-only modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        'mongodb-client-encryption': false,
      }
      
      // Completely exclude MongoDB from client-side bundles
      config.externals = [
        ...config.externals || [],
        'mongodb',
        'mongodb-client-encryption',
      ]
    }
    
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      }
    }
    
    return config
  },
  
  // Environment variables for runtime
  env: {
    CUSTOM_KEY: 'freedns-platform',
  },
  
  // Generate trailing slashes for better SEO
  trailingSlash: false,
  
  // PWA and caching
  async generateBuildId() {
    // Generate a build ID for cache busting
    return `freedns-${Date.now()}`
  }
}

module.exports = nextConfig
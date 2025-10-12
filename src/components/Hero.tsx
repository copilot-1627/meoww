"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Globe2, CheckCircle } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

export default function Hero() {
  const { data: session } = useSession()

  const features = [
    'SRV Records',
    'A Records', 
    'CNAME Records',
    '2 Free Subdomains'
  ]

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Free DNS Management
              <span className="block gradient-text">Made Simple</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Manage your DNS records with ease. Get 2 free subdomains and expand with additional slots for just {formatPrice(8)} each.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {session ? (
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4">
                Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => signIn('google')}
                size="lg" 
                variant="gradient" 
                className="text-lg px-8 py-4"
              >
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <Zap className="w-12 h-12 text-flaxa-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">DNS propagation in under 60 seconds worldwide</p>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-flaxa-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">99.9% uptime with enterprise-grade security</p>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <Globe2 className="w-12 h-12 text-flaxa-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Global Network</h3>
            <p className="text-gray-600">Anycast DNS with worldwide coverage</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
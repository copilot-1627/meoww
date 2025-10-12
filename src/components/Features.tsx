"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Server, Zap, Shield, Users, BarChart3, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Features() {
  const features = [
    {
      icon: Server,
      title: "Multiple Record Types",
      description: "Support for SRV, A, and CNAME records with easy management interface."
    },
    {
      icon: Zap,
      title: "Instant Propagation",
      description: "DNS changes propagate globally in under 60 seconds with our anycast network."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced DDoS protection and DNSSEC support for maximum security."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share access with team members and manage permissions easily."
    },
    {
      icon: BarChart3,
      title: "Analytics & Monitoring",
      description: "Real-time DNS analytics and uptime monitoring for your domains."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Expert support team available around the clock to help you."
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Powerful DNS Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to manage your DNS infrastructure with confidence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-flaxa-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-flaxa-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
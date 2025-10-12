"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { signIn, useSession } from 'next-auth/react'

export default function Pricing() {
  const { data: session } = useSession()

  const plans = [
    {
      name: "Starter",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "2 Free Subdomains",
        "SRV Records",
        "A Records",
        "CNAME Records",
        "Basic Analytics",
        "Community Support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: 8,
      period: "per extra subdomain",
      description: "Scale as you grow",
      features: [
        "Everything in Starter",
        "Unlimited Extra Subdomains",
        "Advanced Analytics",
        "Priority Support",
        "Custom TTL Settings",
        "API Access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: null,
      period: "custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "White-label Solution",
        "Dedicated Support",
        "SLA Guarantee",
        "Custom Integration",
        "Volume Discounts"
      ],
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Start free and scale as you grow. Only pay for what you need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-flaxa-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" /> Most Popular
                  </span>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-flaxa-blue-600 shadow-xl' : ''}`}>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.price === null ? (
                      <div className="text-4xl font-bold text-gray-900">Custom</div>
                    ) : plan.price === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                        <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'gradient' : 'outline'}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        // Handle enterprise contact
                        window.location.href = '#contact'
                      } else if (session) {
                        // Redirect to dashboard
                        window.location.href = '/dashboard'
                      } else {
                        signIn('google')
                      }
                    }}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : session ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
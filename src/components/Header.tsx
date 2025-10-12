"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe, Crown } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.email === 'pn6009909@gmail.com'

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="FreeDns Logo"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-flaxa-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
                {isAdmin && (
                  <Button variant="gradient" size="sm" asChild>
                    <a href="/admin" className="flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Admin
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signIn('google')}
                variant="gradient" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Sign in with Google</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-flaxa-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2 border-t border-gray-200">
                {session ? (
                  <div className="px-3 py-2 space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Welcome, {session.user?.name}</p>
                    {isAdmin && (
                      <Button variant="gradient" size="sm" className="w-full mb-2" asChild>
                        <a href="/admin" className="flex items-center justify-center">
                          <Crown className="w-4 h-4 mr-2" />
                          Admin Panel
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/dashboard">Dashboard</a>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => signIn('google')}
                    variant="gradient" 
                    size="sm"
                    className="w-full mx-3 mb-2 flex items-center justify-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Sign in with Google</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
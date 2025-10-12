"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, BarChart3, Globe } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface DashboardStats {
  subdomainCount: number
  recordCount: number
  monthlyQueries: number
  currentPlan: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    subdomainCount: 0,
    recordCount: 0,
    monthlyQueries: 0,
    currentPlan: 'Free'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetchDashboardStats()
    }
  }, [session])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flaxa-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/')
  }

  const freeSubdomainsRemaining = Math.max(0, 2 - stats.subdomainCount)
  
  const dashboardStats = [
    { 
      label: "Active Subdomains", 
      value: stats.subdomainCount.toString(), 
      sublabel: `${freeSubdomainsRemaining} free remaining` 
    },
    { 
      label: "DNS Records", 
      value: stats.recordCount.toString(), 
      sublabel: "Total records" 
    },
    { 
      label: "Monthly Queries", 
      value: stats.monthlyQueries.toLocaleString(), 
      sublabel: "This month" 
    },
    { 
      label: "Current Plan", 
      value: stats.currentPlan, 
      sublabel: stats.currentPlan === 'Free' ? 'Starter plan' : 'Upgrade available' 
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.svg" alt="FreeDns" className="h-8" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.sublabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Subdomain */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Subdomain
              </CardTitle>
              <CardDescription>
                {freeSubdomainsRemaining > 0 
                  ? `You have ${freeSubdomainsRemaining} free subdomain slot${freeSubdomainsRemaining === 1 ? '' : 's'} available.`
                  : `Additional slots cost ${formatPrice(8)} each.`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="gradient"
                onClick={() => {
                  // TODO: Implement subdomain creation in Part 2
                  alert('Subdomain creation will be implemented in Part 2!')
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subdomain
              </Button>
            </CardContent>
          </Card>

          {/* DNS Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                DNS Analytics
              </CardTitle>
              <CardDescription>
                Monitor your DNS performance and query statistics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  // TODO: Implement analytics in Part 2
                  alert('Analytics dashboard will be implemented in Part 2!')
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest DNS management activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Start by creating your first subdomain!</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
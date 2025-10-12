"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Trash2, ExternalLink, Crown, CreditCard, Receipt, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DashboardStats {
  subdomainCount: number
  subdomainLimit: number
  currentPlan: string
}

interface Domain {
  id: string
  name: string
}

interface Subdomain {
  id: string
  name: string
  domainName: string
  recordType: string
  recordValue: string
  createdAt: string
}

interface Transaction {
  id: string
  orderId: string
  paymentId: string
  amount: number
  currency: string
  subdomainSlots: number
  status: 'created' | 'paid' | 'failed'
  createdAt: string
  paidAt?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    subdomainCount: 0,
    subdomainLimit: 2,
    currentPlan: 'Free'
  })
  const [subdomains, setSubdomains] = useState<Subdomain[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    domainId: '',
    recordType: 'A' as 'A' | 'CNAME' | 'SRV',
    recordValue: '',
    priority: 10,
    weight: 10,
    port: 80
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [creating, setCreating] = useState(false)
  
  // Payment state
  const [paymentData, setPaymentData] = useState({
    subdomainSlots: 1,
    amount: 8
  })
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      setIsAdmin(session.user.email === 'pn6009909@gmail.com')
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, subdomainsRes, domainsRes, transactionsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/subdomains'),
        fetch('/api/dashboard/domains'),
        fetch('/api/transactions')
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      if (subdomainsRes.ok) {
        const subdomainsData = await subdomainsRes.json()
        setSubdomains(subdomainsData)
      }
      
      if (domainsRes.ok) {
        const domainsData = await domainsRes.json()
        setDomains(domainsData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSubdomain = async () => {
    // Validate form
    const errors: Record<string, string> = {}
    if (!formData.name) errors.name = 'Subdomain name is required'
    if (!formData.domainId) errors.domainId = 'Please select a domain'
    if (!formData.recordValue) errors.recordValue = 'Record value is required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setCreating(true)
    try {
      const response = await fetch('/api/dashboard/subdomains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        fetchDashboardData()
        setCreateDialogOpen(false)
        setFormData({
          name: '',
          domainId: '',
          recordType: 'A',
          recordValue: '',
          priority: 10,
          weight: 10,
          port: 80
        })
        setFormErrors({})
      } else {
        const error = await response.json()
        setFormErrors({ submit: error.error || 'Failed to create subdomain' })
      }
    } catch (error) {
      setFormErrors({ submit: 'Failed to create subdomain' })
    } finally {
      setCreating(false)
    }
  }

  const deleteSubdomain = async (subdomainId: string) => {
    if (!confirm('Are you sure you want to delete this subdomain? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/dashboard/subdomains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomainId })
      })
      
      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error deleting subdomain:', error)
    }
  }

  const initializePayment = async () => {
    if (paymentData.subdomainSlots < 1) {
      alert('Please enter a valid number of subdomain slots')
      return
    }

    setProcessingPayment(true)
    try {
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomainSlots: paymentData.subdomainSlots })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FreeDns - Flaxa Technologies',
        description: `Purchase ${paymentData.subdomainSlots} extra subdomain slot${paymentData.subdomainSlots > 1 ? 's' : ''}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (verifyResponse.ok) {
              const result = await verifyResponse.json()
              alert(result.message)
              fetchDashboardData() // Refresh dashboard
              setPaymentDialogOpen(false)
            } else {
              alert('Payment verification failed')
            }
          } catch (error) {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: {
          color: '#3B82F6'
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      alert('Failed to initialize payment')
    } finally {
      setProcessingPayment(false)
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

  const freeSubdomainsRemaining = Math.max(0, stats.subdomainLimit - stats.subdomainCount)
  const canCreateSubdomain = stats.subdomainCount < stats.subdomainLimit

  return (
    <>
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      
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
                {isAdmin && (
                  <Button variant="gradient" size="sm" asChild>
                    <a href="/admin" className="flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Admin Panel
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Subdomain Usage</span>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-flaxa-blue-600">
                    {stats.subdomainCount}/{stats.subdomainLimit}
                  </span>
                  {!canCreateSubdomain && (
                    <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="gradient" size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Extra Slots
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Purchase Extra Subdomain Slots</DialogTitle>
                          <DialogDescription>
                            Get more subdomain slots for ₹8 each. Expand your DNS management capabilities.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="slots">Number of Extra Slots</Label>
                            <Input
                              id="slots"
                              type="number"
                              min="1"
                              max="50"
                              value={paymentData.subdomainSlots}
                              onChange={(e) => {
                                const slots = parseInt(e.target.value) || 1
                                setPaymentData({
                                  subdomainSlots: slots,
                                  amount: slots * 8
                                })
                              }}
                            />
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                              <span>Price per slot:</span>
                              <span>₹8</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Quantity:</span>
                              <span>{paymentData.subdomainSlots}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total Amount:</span>
                              <span>₹{paymentData.amount}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={initializePayment} 
                            disabled={processingPayment}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            {processingPayment ? 'Processing...' : `Pay ₹${paymentData.amount}`}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-flaxa-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.subdomainCount / stats.subdomainLimit) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>
                  {freeSubdomainsRemaining > 0 
                    ? `${freeSubdomainsRemaining} subdomain${freeSubdomainsRemaining === 1 ? '' : 's'} remaining`
                    : 'No subdomain slots remaining'
                  }
                </span>
                <span className="text-flaxa-blue-600 font-medium">
                  Plan: {stats.currentPlan}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="subdomains" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
              <TabsTrigger value="profile">Profile & Transactions</TabsTrigger>
            </TabsList>

            {/* Subdomains Tab */}
            <TabsContent value="subdomains">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Subdomains</span>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="gradient"
                          disabled={!canCreateSubdomain || domains.length === 0}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Subdomain
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Subdomain</DialogTitle>
                          <DialogDescription>
                            Create a new subdomain with DNS record configuration.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="subdomainName">Subdomain Name</Label>
                            <Input
                              id="subdomainName"
                              placeholder="myapp"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className={formErrors.name ? 'border-red-500' : ''}
                            />
                            {formErrors.name && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="domain">Domain</Label>
                            <Select 
                              value={formData.domainId} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, domainId: value }))}
                            >
                              <SelectTrigger className={formErrors.domainId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a domain" />
                              </SelectTrigger>
                              <SelectContent>
                                {domains.map((domain) => (
                                  <SelectItem key={domain.id} value={domain.id}>
                                    {domain.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.domainId && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.domainId}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="recordType">Record Type</Label>
                            <Select 
                              value={formData.recordType} 
                              onValueChange={(value: 'A' | 'CNAME' | 'SRV') => setFormData(prev => ({ ...prev, recordType: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A Record</SelectItem>
                                <SelectItem value="CNAME">CNAME Record</SelectItem>
                                <SelectItem value="SRV">SRV Record</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="recordValue">
                              {formData.recordType === 'A' ? 'IP Address' : 
                               formData.recordType === 'CNAME' ? 'Target Domain' : 'Target'}
                            </Label>
                            <Input
                              id="recordValue"
                              placeholder={
                                formData.recordType === 'A' ? '192.168.1.1' :
                                formData.recordType === 'CNAME' ? 'example.com' : 'target.example.com'
                              }
                              value={formData.recordValue}
                              onChange={(e) => setFormData(prev => ({ ...prev, recordValue: e.target.value }))}
                              className={formErrors.recordValue ? 'border-red-500' : ''}
                            />
                            {formErrors.recordValue && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.recordValue}</p>
                            )}
                          </div>
                          
                          {formData.recordType === 'SRV' && (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Input
                                  id="priority"
                                  type="number"
                                  value={formData.priority}
                                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 10 }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="weight">Weight</Label>
                                <Input
                                  id="weight"
                                  type="number"
                                  value={formData.weight}
                                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 10 }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="port">Port</Label>
                                <Input
                                  id="port"
                                  type="number"
                                  value={formData.port}
                                  onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) || 80 }))}
                                />
                              </div>
                            </div>
                          )}
                          
                          {formErrors.submit && (
                            <p className="text-red-500 text-sm">{formErrors.submit}</p>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={createSubdomain} disabled={creating}>
                            {creating ? 'Creating...' : 'Create Subdomain'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    {domains.length === 0 ? (
                      "No domains available. Contact admin to add domains."
                    ) : (
                      `Manage your subdomains across ${domains.length} available domain${domains.length === 1 ? '' : 's'}.`
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subdomains.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No subdomains created yet</p>
                      <p className="text-sm">Create your first subdomain to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subdomains.map((subdomain) => (
                        <div
                          key={subdomain.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">
                                {subdomain.name}.{subdomain.domainName}
                              </h3>
                              <Button variant="ghost" size="sm" asChild>
                                <a 
                                  href={`https://${subdomain.name}.${subdomain.domainName}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                              {subdomain.recordType} → {subdomain.recordValue}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created {new Date(subdomain.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSubdomain(subdomain.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile & Transactions Tab */}
            <TabsContent value="profile">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Receipt className="w-5 h-5 mr-2" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>
                      Your payment and subdomain purchase history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No transactions yet</p>
                        <p className="text-sm">Purchase extra subdomain slots to see your transaction history here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                            <div>
                              <p className="font-medium">{transaction.subdomainSlots} Extra Slot{transaction.subdomainSlots > 1 ? 's' : ''}</p>
                              <p className="text-sm text-gray-600">₹{transaction.amount}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.status === 'paid' ? 'bg-green-100 text-green-700' :
                              transaction.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {transaction.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Your account details and current plan information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm font-medium">{session?.user?.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{session?.user?.email}</p>
                    </div>
                    <div>
                      <Label>Current Plan</Label>
                      <p className="text-sm font-medium">{stats.currentPlan}</p>
                    </div>
                    <div>
                      <Label>Subdomain Limit</Label>
                      <p className="text-sm font-medium">{stats.subdomainLimit} slots</p>
                    </div>
                    <div>
                      <Label>Subdomains Used</Label>
                      <p className="text-sm font-medium">{stats.subdomainCount}/{stats.subdomainLimit}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  )
}
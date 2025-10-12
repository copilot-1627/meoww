"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Receipt, Download, Search, Filter, TrendingUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  id: string
  userId: string
  userEmail: string
  userName: string
  orderId: string
  paymentId: string
  amount: number
  currency: string
  subdomainSlots: number
  status: 'created' | 'paid' | 'failed'
  createdAt: string
  paidAt?: string
}

interface TransactionStats {
  totalTransactions: number
  totalRevenue: number
  paidTransactions: number
  failedTransactions: number
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalRevenue: 0,
    paidTransactions: 0,
    failedTransactions: 0
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?admin=true')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
        
        // Calculate stats
        const totalTransactions = data.length
        const paidTransactions = data.filter((t: Transaction) => t.status === 'paid')
        const failedTransactions = data.filter((t: Transaction) => t.status === 'failed')
        const totalRevenue = paidTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        
        setStats({
          totalTransactions,
          totalRevenue,
          paidTransactions: paidTransactions.length,
          failedTransactions: failedTransactions.length
        })
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200'
      case 'failed': return 'bg-red-100 text-red-700 border-red-200'
      case 'created': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'User Name', 'User Email', 'Order ID', 'Payment ID', 'Amount (₹)', 'Subdomain Slots', 'Status', 'Paid Date'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.createdAt).toLocaleDateString(),
        t.userName,
        t.userEmail,
        t.orderId,
        t.paymentId || 'N/A',
        t.amount,
        t.subdomainSlots,
        t.status.toUpperCase(),
        t.paidAt ? new Date(t.paidAt).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flaxa-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage all payment transactions</p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All payment attempts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">From successful payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {stats.paidTransactions}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTransactions > 0 ? Math.round((stats.paidTransactions / stats.totalTransactions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              {stats.failedTransactions}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTransactions > 0 ? Math.round((stats.failedTransactions / stats.totalTransactions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Failure rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name, email, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="created">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            Complete transaction history with user details and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions found</p>
              <p className="text-sm">Transactions will appear here when users make payments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">User</th>
                    <th className="text-left py-3 px-2">Order ID</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Slots</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium">{transaction.userName}</div>
                        <div className="text-xs text-gray-500">{transaction.userEmail}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-mono">{transaction.orderId}</div>
                        {transaction.paymentId && (
                          <div className="text-xs text-gray-500 font-mono">
                            {transaction.paymentId}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-semibold">₹{transaction.amount}</div>
                        <div className="text-xs text-gray-500">{transaction.currency}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium">{transaction.subdomainSlots}</div>
                        <div className="text-xs text-gray-500">
                          slot{transaction.subdomainSlots > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(transaction.status)}
                        >
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        {transaction.paidAt ? (
                          <div>
                            <div className="text-sm">
                              {new Date(transaction.paidAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.paidAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
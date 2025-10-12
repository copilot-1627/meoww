import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const EXTRA_SUBDOMAIN_PRICE = 8 // ₹8 per extra subdomain

export interface PaymentData {
  orderId: string
  amount: number
  currency: string
  userId: string
  email: string
  subdomainSlots: number
}

export interface Transaction {
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

export interface UserLimits {
  [userId: string]: number
}

// Client-side transaction service that makes API calls
export const TransactionService = {
  createTransaction: async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/transactions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create transaction')
    return response.json()
  },

  getTransaction: async (id: string) => {
    const response = await fetch(`/api/transactions/${encodeURIComponent(id)}`)
    if (!response.ok) throw new Error('Failed to get transaction')
    return response.json()
  },

  getTransactionByOrderId: async (orderId: string) => {
    const response = await fetch(`/api/transactions/order/${encodeURIComponent(orderId)}`)
    if (!response.ok) throw new Error('Failed to get transaction')
    return response.json()
  },

  getUserTransactions: async (userId: string) => {
    const response = await fetch(`/api/transactions/user/${encodeURIComponent(userId)}`)
    if (!response.ok) throw new Error('Failed to get user transactions')
    return response.json()
  },

  getAllTransactions: async () => {
    const response = await fetch('/api/transactions')
    if (!response.ok) throw new Error('Failed to get transactions')
    return response.json()
  },

  updateTransactionStatus: async (orderId: string, status: Transaction['status'], paymentId?: string) => {
    const response = await fetch('/api/transactions/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status, paymentId })
    })
    if (!response.ok) throw new Error('Failed to update transaction')
    return response.json()
  },

  getUserSubdomainLimit: async (userId: string) => {
    const response = await fetch(`/api/transactions/limit/${encodeURIComponent(userId)}`)
    if (!response.ok) throw new Error('Failed to get subdomain limit')
    const data = await response.json()
    return data.limit || 2
  },

  setUserSubdomainLimit: async (userId: string, limit: number) => {
    const response = await fetch('/api/transactions/limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, limit })
    })
    if (!response.ok) throw new Error('Failed to set subdomain limit')
    return response.json()
  },

  resetUserLimit: async (userId: string) => {
    const response = await fetch('/api/transactions/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    if (!response.ok) throw new Error('Failed to reset user limit')
    return response.json()
  },

  getTransactionStats: async () => {
    const response = await fetch('/api/transactions/stats')
    if (!response.ok) throw new Error('Failed to get transaction stats')
    return response.json()
  }
}
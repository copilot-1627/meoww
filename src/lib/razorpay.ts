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

// Mock database for transactions (in production, use a real database)
let transactions: Transaction[] = []
let userSubdomainLimits: Record<string, number> = {}

export const TransactionService = {
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    transactions.push(transaction)
    return transaction
  },

  getTransaction: (id: string) => {
    return transactions.find(t => t.id === id)
  },

  getTransactionByOrderId: (orderId: string) => {
    return transactions.find(t => t.orderId === orderId)
  },

  getUserTransactions: (userId: string) => {
    return transactions.filter(t => t.userId === userId)
  },

  getAllTransactions: () => {
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  updateTransactionStatus: (orderId: string, status: Transaction['status'], paymentId?: string) => {
    const transaction = transactions.find(t => t.orderId === orderId)
    if (transaction) {
      transaction.status = status
      if (paymentId) transaction.paymentId = paymentId
      if (status === 'paid') {
        transaction.paidAt = new Date().toISOString()
        // Add subdomain slots to user
        const currentLimit = userSubdomainLimits[transaction.userId] || 2
        userSubdomainLimits[transaction.userId] = currentLimit + transaction.subdomainSlots
      }
    }
    return transaction
  },

  getUserSubdomainLimit: (userId: string) => {
    return userSubdomainLimits[userId] || 2 // Default 2 free slots
  },

  setUserSubdomainLimit: (userId: string, limit: number) => {
    userSubdomainLimits[userId] = limit
  }
}
import fs from 'fs/promises'
import path from 'path'
import { Transaction, UserLimits } from './razorpay'

interface TransactionData {
  transactions: Transaction[]
  userSubdomainLimits: UserLimits
}

// File paths for persistent storage
const DATA_DIR = path.join(process.cwd(), 'data')
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read transaction data from file
async function readTransactionData(): Promise<TransactionData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      userSubdomainLimits: parsed.userSubdomainLimits || {}
    }
  } catch (error) {
    // If file doesn't exist or is corrupted, return empty data
    const initialData: TransactionData = {
      transactions: [],
      userSubdomainLimits: {}
    }
    await writeTransactionData(initialData)
    return initialData
  }
}

// Write transaction data to file
async function writeTransactionData(data: TransactionData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(data, null, 2))
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const ServerTransactionService = {
  createTransaction: async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transactionData = await readTransactionData()
    
    const transaction: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    
    transactionData.transactions.push(transaction)
    await writeTransactionData(transactionData)
    return transaction
  },

  getTransaction: async (id: string) => {
    const data = await readTransactionData()
    return data.transactions.find(t => t.id === id) || null
  },

  getTransactionByOrderId: async (orderId: string) => {
    const data = await readTransactionData()
    return data.transactions.find(t => t.orderId === orderId) || null
  },

  getUserTransactions: async (userId: string) => {
    const data = await readTransactionData()
    return data.transactions
      .filter(t => t.userId === userId || t.userEmail === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getAllTransactions: async () => {
    const data = await readTransactionData()
    return data.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  updateTransactionStatus: async (orderId: string, status: Transaction['status'], paymentId?: string) => {
    const data = await readTransactionData()
    const transactionIndex = data.transactions.findIndex(t => t.orderId === orderId)
    
    if (transactionIndex === -1) return null
    
    const transaction = data.transactions[transactionIndex]
    transaction.status = status
    if (paymentId) transaction.paymentId = paymentId
    if (status === 'paid') {
      transaction.paidAt = new Date().toISOString()
      // Add subdomain slots to user
      const userId = transaction.userEmail || transaction.userId
      const currentLimit = data.userSubdomainLimits[userId] || 2
      data.userSubdomainLimits[userId] = currentLimit + transaction.subdomainSlots
    }
    
    await writeTransactionData(data)
    return transaction
  },

  getUserSubdomainLimit: async (userId: string) => {
    const data = await readTransactionData()
    return data.userSubdomainLimits[userId] || 2 // Default 2 free slots
  },

  setUserSubdomainLimit: async (userId: string, limit: number) => {
    const data = await readTransactionData()
    data.userSubdomainLimits[userId] = limit
    await writeTransactionData(data)
  },

  // Admin function to reset user limits (for testing)
  resetUserLimit: async (userId: string) => {
    const data = await readTransactionData()
    data.userSubdomainLimits[userId] = 2
    await writeTransactionData(data)
  },

  // Get total statistics for admin
  getTransactionStats: async () => {
    const data = await readTransactionData()
    const totalTransactions = data.transactions.length
    const paidTransactions = data.transactions.filter(t => t.status === 'paid')
    const failedTransactions = data.transactions.filter(t => t.status === 'failed')
    const totalRevenue = paidTransactions.reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalTransactions,
      totalRevenue,
      paidTransactions: paidTransactions.length,
      failedTransactions: failedTransactions.length
    }
  }
}
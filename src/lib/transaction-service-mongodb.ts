import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from './mongodb'
import { Transaction, UserLimits } from './razorpay'

export interface MongoTransaction extends Omit<Transaction, 'id'> {
  _id?: ObjectId
  id: string
}

export interface MongoUserLimits {
  _id?: ObjectId
  userId: string
  limit: number
  updatedAt: string
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const ServerTransactionService = {
  async getTransactionCollection(): Promise<Collection<MongoTransaction>> {
    const db = await getDatabase()
    return db.collection<MongoTransaction>('transactions')
  },

  async getUserLimitsCollection(): Promise<Collection<MongoUserLimits>> {
    const db = await getDatabase()
    return db.collection<MongoUserLimits>('userLimits')
  },

  createTransaction: async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const collection = await ServerTransactionService.getTransactionCollection()
    
    const transaction: MongoTransaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    
    await collection.insertOne(transaction)
    return transaction
  },

  getTransaction: async (id: string) => {
    const collection = await ServerTransactionService.getTransactionCollection()
    const transaction = await collection.findOne({ id })
    return transaction
  },

  getTransactionByOrderId: async (orderId: string) => {
    const collection = await ServerTransactionService.getTransactionCollection()
    const transaction = await collection.findOne({ orderId })
    return transaction
  },

  getUserTransactions: async (userId: string) => {
    const collection = await ServerTransactionService.getTransactionCollection()
    const transactions = await collection
      .find({ 
        $or: [{ userId }, { userEmail: userId }] 
      })
      .sort({ createdAt: -1 })
      .toArray()
    return transactions
  },

  getAllTransactions: async () => {
    const collection = await ServerTransactionService.getTransactionCollection()
    const transactions = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return transactions
  },

  updateTransactionStatus: async (orderId: string, status: Transaction['status'], paymentId?: string) => {
    const collection = await ServerTransactionService.getTransactionCollection()
    const limitsCollection = await ServerTransactionService.getUserLimitsCollection()
    
    const transaction = await collection.findOne({ orderId })
    if (!transaction) return null
    
    const updateData: any = { status }
    if (paymentId) updateData.paymentId = paymentId
    if (status === 'paid') {
      updateData.paidAt = new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    // Add subdomain slots to user if payment is successful
    if (status === 'paid' && result) {
      const userId = transaction.userEmail || transaction.userId
      const currentLimit = await ServerTransactionService.getUserSubdomainLimit(userId)
      const newLimit = currentLimit + transaction.subdomainSlots
      
      await limitsCollection.findOneAndUpdate(
        { userId },
        { 
          $set: { 
            userId,
            limit: newLimit,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      )
    }
    
    return result
  },

  getUserSubdomainLimit: async (userId: string) => {
    const collection = await ServerTransactionService.getUserLimitsCollection()
    const userLimit = await collection.findOne({ userId })
    return userLimit?.limit || 2 // Default 2 free slots
  },

  setUserSubdomainLimit: async (userId: string, limit: number) => {
    const collection = await ServerTransactionService.getUserLimitsCollection()
    await collection.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          userId,
          limit,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    )
  },

  // Admin function to reset user limits (for testing)
  resetUserLimit: async (userId: string) => {
    const collection = await ServerTransactionService.getUserLimitsCollection()
    await collection.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          userId,
          limit: 2,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    )
  },

  // Get total statistics for admin
  getTransactionStats: async () => {
    const collection = await ServerTransactionService.getTransactionCollection()
    
    const allTransactions = await collection.find({}).toArray()
    const totalTransactions = allTransactions.length
    const paidTransactions = allTransactions.filter(t => t.status === 'paid')
    const failedTransactions = allTransactions.filter(t => t.status === 'failed')
    const totalRevenue = paidTransactions.reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalTransactions,
      totalRevenue,
      paidTransactions: paidTransactions.length,
      failedTransactions: failedTransactions.length
    }
  }
}
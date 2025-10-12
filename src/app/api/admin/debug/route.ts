import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TransactionService } from '@/lib/razorpay'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email || ''

    // Check if user is admin
    if (userEmail !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current transaction data
    const allTransactions = await TransactionService.getAllTransactions()
    const stats = await TransactionService.getTransactionStats()
    
    // Check if transaction file exists
    const DATA_DIR = path.join(process.cwd(), 'data')
    const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json')
    
    let fileExists = false
    let fileSize = 0
    try {
      const fileStat = await fs.stat(TRANSACTIONS_FILE)
      fileExists = true
      fileSize = fileStat.size
    } catch (error) {
      fileExists = false
    }

    // Get sample user limits
    const sampleUserLimits = {
      [userEmail]: await TransactionService.getUserSubdomainLimit(userEmail),
      'sample@example.com': await TransactionService.getUserSubdomainLimit('sample@example.com')
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      storage: {
        file_exists: fileExists,
        file_size_bytes: fileSize,
        file_path: TRANSACTIONS_FILE
      },
      statistics: stats,
      sample_user_limits: sampleUserLimits,
      recent_transactions: allTransactions.slice(0, 5), // Show last 5 transactions
      total_transactions: allTransactions.length,
      environment: {
        razorpay_key_configured: !!process.env.RAZORPAY_KEY_ID,
        razorpay_secret_configured: !!process.env.RAZORPAY_KEY_SECRET,
        public_key_configured: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
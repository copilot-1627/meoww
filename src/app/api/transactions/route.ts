import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TransactionService } from '@/lib/razorpay'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const isAdmin = url.searchParams.get('admin') === 'true'
    const userEmail = session.user.email || ''

    // Check if user is admin for admin requests
    if (isAdmin && userEmail !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    let transactions
    if (isAdmin) {
      // Admin gets all transactions
      transactions = await TransactionService.getAllTransactions()
      console.log(`Admin ${userEmail} fetched ${transactions.length} transactions`)
    } else {
      // User gets only their transactions
      transactions = await TransactionService.getUserTransactions(userEmail)
      console.log(`User ${userEmail} fetched ${transactions.length} transactions`)
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
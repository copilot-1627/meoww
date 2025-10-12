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
      transactions = TransactionService.getAllTransactions()
    } else {
      // User gets only their transactions
      transactions = TransactionService.getUserTransactions(userEmail)
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
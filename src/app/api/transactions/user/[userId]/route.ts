import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    
    // Users can only get their own transactions, admins can get any
    const userEmail = session.user.email || ''
    const isAdmin = userEmail === 'pn6009909@gmail.com'
    const isOwnRequest = userId === userEmail
    
    if (!isAdmin && !isOwnRequest) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const transactions = await ServerTransactionService.getUserTransactions(userId)
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
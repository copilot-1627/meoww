import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const transaction = await ServerTransactionService.getTransaction(id)
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check if user can access this transaction (admin or owner)
    const userEmail = session.user.email || ''
    const isAdmin = userEmail === 'pn6009909@gmail.com'
    const isOwner = transaction.userEmail === userEmail || transaction.userId === userEmail
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
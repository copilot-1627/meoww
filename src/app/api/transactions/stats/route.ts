import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access for stats
    const userEmail = session.user.email || ''
    if (userEmail !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const stats = await ServerTransactionService.getTransactionStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching transaction stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transaction stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
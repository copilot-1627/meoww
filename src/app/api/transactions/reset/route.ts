import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access for resetting limits
    const userEmail = session.user.email || ''
    if (userEmail !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    await ServerTransactionService.resetUserLimit(userId)
    
    return NextResponse.json({ success: true, userId, limit: 2 })
  } catch (error) {
    console.error('Error resetting user limit:', error)
    return NextResponse.json({ 
      error: 'Failed to reset user limit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
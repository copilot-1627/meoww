import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, limit } = await request.json()
    
    if (!userId || typeof limit !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    // Check admin access for setting limits
    const userEmail = session.user.email || ''
    if (userEmail !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await ServerTransactionService.setUserSubdomainLimit(userId, limit)
    
    return NextResponse.json({ success: true, userId, limit })
  } catch (error) {
    console.error('Error setting subdomain limit:', error)
    return NextResponse.json({ 
      error: 'Failed to set subdomain limit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
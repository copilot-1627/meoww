import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service-mongodb'

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    const decodedUserId = decodeURIComponent(userId)
    
    // Users can only get their own limit, admins can get any
    const userEmail = session.user.email || ''
    const isAdmin = userEmail === 'pn6009909@gmail.com'
    const isOwnRequest = decodedUserId === userEmail
    
    if (!isAdmin && !isOwnRequest) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const limit = await ServerTransactionService.getUserSubdomainLimit(decodedUserId)
    
    return NextResponse.json({ limit })
  } catch (error) {
    console.error('Error getting subdomain limit:', error)
    return NextResponse.json({ 
      error: 'Failed to get subdomain limit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
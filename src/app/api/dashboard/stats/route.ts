import { requireAuth } from "@/lib/auth-middleware"
import { SubdomainStorage } from "@/lib/storage"
import { TransactionService } from "@/lib/razorpay"
import { NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const subdomainCount = await SubdomainStorage.countByUserId(user.id)
    
    // Get user's current subdomain limit from transaction service (async)
    const subdomainLimit = await TransactionService.getUserSubdomainLimit(user.email || user.id)
    
    console.log(`User ${user.email} stats:`, {
      subdomainCount,
      subdomainLimit,
      userId: user.id
    })
    
    const stats = {
      subdomainCount,
      subdomainLimit,
      currentPlan: subdomainLimit > 2 ? 'PREMIUM' : 'FREE'
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
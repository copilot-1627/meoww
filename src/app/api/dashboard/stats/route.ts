import { requireAuth } from "@/lib/auth-middleware"
import { SubdomainStorage, DnsRecordStorage } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const subdomainCount = await SubdomainStorage.countByUserId(user.id)
    
    const stats = {
      subdomainCount,
      subdomainLimit: user.subdomainLimit,
      currentPlan: user.plan || 'FREE'
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
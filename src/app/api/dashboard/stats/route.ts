import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { UserStorage, SubdomainStorage, DnsRecordStorage } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Find user by email
    const user = await UserStorage.findByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Get user statistics
    const subdomainCount = await SubdomainStorage.countByUserId(user.id)
    const recordCount = await DnsRecordStorage.countByUserId(user.id)
    
    const stats = {
      subdomainCount,
      recordCount,
      monthlyQueries: Math.floor(Math.random() * 1000), // Mock data for now
      currentPlan: user.plan || 'Free'
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
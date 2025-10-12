import { requireAdmin } from "@/lib/auth-middleware"
import { UserStorage, SubdomainStorage } from "@/lib/storage"
import { getEffectiveSubdomainLimit, setEffectiveSubdomainLimit } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const users = await UserStorage.findAll()
    
    // Get subdomain count and effective limit for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const subdomainCount = await SubdomainStorage.countByUserId(user.id)
        const effectiveLimit = await getEffectiveSubdomainLimit(user.id, user.email)
        
        return {
          ...user,
          subdomainCount,
          subdomainLimit: effectiveLimit, // Show effective limit instead of base limit
          baseLimit: user.subdomainLimit, // Keep base limit for reference
        }
      })
    )

    return NextResponse.json(usersWithCounts)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { userId, subdomainLimit } = await request.json()
    
    if (!userId || typeof subdomainLimit !== 'number') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const user = await UserStorage.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Use the new function to set effective limit properly
    await setEffectiveSubdomainLimit(userId, subdomainLimit, user.email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const deleted = await UserStorage.delete(userId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
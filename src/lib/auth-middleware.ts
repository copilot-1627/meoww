import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { UserStorage, isAdminEmail } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const user = await UserStorage.findByEmail(session.user.email)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return { user, session }
}

export async function requireAdmin() {
  const authResult = await requireAuth()
  
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  const { user, session } = authResult
  
  if (!user.isAdmin || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  
  return { user, session }
}

export function isUserAdmin(email: string): boolean {
  return isAdminEmail(email)
}
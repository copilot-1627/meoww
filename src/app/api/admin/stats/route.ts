import { requireAdmin } from "@/lib/auth-middleware"
import { UserStorage, DomainStorage, SubdomainStorage, DnsRecordStorage } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const [users, domains, subdomains, records] = await Promise.all([
      UserStorage.findAll(),
      DomainStorage.findAll(),
      SubdomainStorage.findAll(),
      DnsRecordStorage.countByUserId('') // Get all records
    ])

    const stats = {
      totalUsers: users.filter(u => !u.isAdmin).length, // Exclude admin from count
      totalDomains: domains.length,
      totalSubdomains: subdomains.length,
      totalRecords: records
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
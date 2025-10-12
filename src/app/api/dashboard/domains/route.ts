import { requireAuth } from "@/lib/auth-middleware"
import { DomainStorage } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const domains = await DomainStorage.findAll()
    
    // Return only id and name for domain selection
    const simpleDomains = domains.map(domain => ({
      id: domain.id,
      name: domain.name
    }))

    return NextResponse.json(simpleDomains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
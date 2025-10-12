import { requireAdmin } from "@/lib/auth-middleware"
import { DomainStorage, SubdomainStorage } from "@/lib/storage"
import { testCloudflareConnection } from "@/lib/cloudflare"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const domains = await DomainStorage.findAll()
    
    // Get subdomain count for each domain
    const domainsWithCounts = await Promise.all(
      domains.map(async (domain) => {
        const subdomains = await SubdomainStorage.findAll()
        const subdomainCount = subdomains.filter(s => s.domainId === domain.id).length
        return {
          ...domain,
          subdomainCount
        }
      })
    )

    return NextResponse.json(domainsWithCounts)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { name, cloudflareZoneId, cloudflareApiKey } = await request.json()
    
    if (!name || !cloudflareZoneId || !cloudflareApiKey) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Test Cloudflare connection before adding
    const connectionValid = await testCloudflareConnection(cloudflareZoneId, cloudflareApiKey)
    if (!connectionValid) {
      return NextResponse.json({ error: 'Invalid Cloudflare credentials' }, { status: 400 })
    }

    const domain = await DomainStorage.create({
      name,
      cloudflareZoneId,
      cloudflareApiKey,
      active: true
    })

    return NextResponse.json(domain)
  } catch (error) {
    console.error('Error creating domain:', error)
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'Domain already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { domainId } = await request.json()
    
    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID required' }, { status: 400 })
    }

    const deleted = await DomainStorage.delete(domainId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting domain:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { requireAuth } from "@/lib/auth-middleware"
import { SubdomainStorage, DomainStorage, DnsRecordStorage } from "@/lib/storage"
import { createSubdomainRecord, deleteSubdomainRecord } from "@/lib/cloudflare"
import { getEffectiveSubdomainLimit } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const subdomains = await SubdomainStorage.findByUserId(user.id)
    
    // Get domain names and DNS records for each subdomain
    const subdomainsWithDetails = await Promise.all(
      subdomains.map(async (subdomain) => {
        const domain = await DomainStorage.findById(subdomain.domainId)
        const dnsRecords = await DnsRecordStorage.findBySubdomainId(subdomain.id)
        
        return {
          id: subdomain.id,
          name: subdomain.name,
          domainName: domain?.name || 'Unknown',
          recordType: dnsRecords[0]?.type || 'A',
          recordValue: dnsRecords[0]?.value || '',
          createdAt: subdomain.createdAt
        }
      })
    )

    return NextResponse.json(subdomainsWithDetails)
  } catch (error) {
    console.error('Error fetching subdomains:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const { name, domainId, recordType, recordValue, priority, weight, port } = await request.json()
    
    if (!name || !domainId || !recordType || !recordValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check subdomain limit using effective limit (base + purchased)
    const currentCount = await SubdomainStorage.countByUserId(user.id)
    const effectiveLimit = await getEffectiveSubdomainLimit(user.id, user.email)
    
    if (currentCount >= effectiveLimit) {
      return NextResponse.json({ 
        error: `Subdomain limit reached (${effectiveLimit}). Purchase additional slots to continue.` 
      }, { status: 400 })
    }

    // Get domain details
    const domain = await DomainStorage.findById(domainId)
    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    // Create subdomain record in Cloudflare
    let cloudflareRecordId: string | undefined
    try {
      cloudflareRecordId = await createSubdomainRecord(
        domain.name,
        name,
        recordType,
        recordValue,
        domain.cloudflareZoneId,
        domain.cloudflareApiKey,
        { priority, weight, port }
      )
    } catch (error) {
      return NextResponse.json({ 
        error: `Failed to create DNS record: ${error.message}` 
      }, { status: 400 })
    }

    // Create subdomain in storage
    const subdomain = await SubdomainStorage.create({
      name,
      domainId,
      userId: user.id,
      active: true,
      cloudflareRecordId
    })

    // Create DNS record in storage
    await DnsRecordStorage.create({
      type: recordType,
      name: '@', // Root record for the subdomain
      value: recordValue,
      ttl: 300,
      priority: recordType === 'SRV' ? priority : undefined,
      weight: recordType === 'SRV' ? weight : undefined,
      port: recordType === 'SRV' ? port : undefined,
      subdomainId: subdomain.id,
      userId: user.id,
      cloudflareRecordId
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating subdomain:', error)
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'Subdomain already exists for this domain' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const { subdomainId } = await request.json()
    
    if (!subdomainId) {
      return NextResponse.json({ error: 'Subdomain ID required' }, { status: 400 })
    }

    const subdomain = await SubdomainStorage.findById(subdomainId)
    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 })
    }

    // Check ownership
    if (subdomain.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete from Cloudflare if record exists
    if (subdomain.cloudflareRecordId) {
      const domain = await DomainStorage.findById(subdomain.domainId)
      if (domain) {
        try {
          await deleteSubdomainRecord(
            domain.cloudflareZoneId,
            domain.cloudflareApiKey,
            subdomain.cloudflareRecordId
          )
        } catch (error) {
          console.error('Failed to delete Cloudflare record:', error)
          // Continue with local deletion even if Cloudflare fails
        }
      }
    }

    // Delete from storage
    await SubdomainStorage.delete(subdomainId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subdomain:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
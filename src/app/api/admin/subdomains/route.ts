import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { SubdomainStorage, DomainStorage, UserStorage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.email !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('Admin fetching all subdomains...')

    // Fetch all subdomains from storage
    const subdomains = await SubdomainStorage.findAll()
    const domains = await DomainStorage.findAll()
    const users = await UserStorage.findAll()

    // Create lookup maps for efficiency
    const domainMap = new Map(domains.map(d => [d.id, d]))
    const userMap = new Map(users.map(u => [u.id, u]))

    // Combine subdomain data with domain and user information
    const enrichedSubdomains = await Promise.all(
      subdomains.map(async (subdomain) => {
        const domain = domainMap.get(subdomain.domainId)
        const user = userMap.get(subdomain.userId)
        
        // Get DNS records for this subdomain
        const dnsRecords = await import('@/lib/storage').then(({ DnsRecordStorage }) => 
          DnsRecordStorage.findBySubdomainId(subdomain.id)
        )
        
        const primaryRecord = dnsRecords.length > 0 ? dnsRecords[0] : null
        
        return {
          id: subdomain.id,
          name: subdomain.name,
          domainName: domain?.name || 'Unknown Domain',
          recordType: primaryRecord?.type || 'N/A',
          recordValue: primaryRecord?.value || 'N/A',
          createdAt: subdomain.createdAt,
          userId: subdomain.userId,
          userEmail: user?.email || 'Unknown User',
          userName: user?.name || 'Unknown User',
          active: subdomain.active
        }
      })
    )

    // Sort by creation date (newest first)
    enrichedSubdomains.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log(`Found ${enrichedSubdomains.length} subdomains for admin`)

    return NextResponse.json(enrichedSubdomains)
  } catch (error) {
    console.error('Error fetching admin subdomains:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch subdomains',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.email !== 'pn6009909@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { subdomainId } = await request.json()
    
    if (!subdomainId) {
      return NextResponse.json({ error: 'Subdomain ID required' }, { status: 400 })
    }

    console.log(`Admin deleting subdomain: ${subdomainId}`)

    // Delete from storage (this will also delete related DNS records)
    const success = await SubdomainStorage.delete(subdomainId)
    
    if (!success) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 })
    }
    
    console.log(`Successfully deleted subdomain: ${subdomainId}`)
    
    return NextResponse.json({ success: true, message: 'Subdomain deleted successfully' })
  } catch (error) {
    console.error('Error deleting subdomain:', error)
    return NextResponse.json({ 
      error: 'Failed to delete subdomain',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
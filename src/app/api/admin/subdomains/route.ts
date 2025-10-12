import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Mock data structure - in production, this would fetch from your database
let mockSubdomains = [
  {
    id: '1',
    name: 'api',
    domainName: 'freedns.tech',
    recordType: 'A',
    recordValue: '192.168.1.1',
    createdAt: '2024-01-15T10:30:00Z',
    userId: 'user1',
    userEmail: 'john@example.com',
    userName: 'John Doe'
  },
  {
    id: '2',
    name: 'blog',
    domainName: 'freedns.tech',
    recordType: 'CNAME',
    recordValue: 'blog.example.com',
    createdAt: '2024-01-16T14:20:00Z',
    userId: 'user2',
    userEmail: 'jane@example.com',
    userName: 'Jane Smith'
  },
  {
    id: '3',
    name: 'app',
    domainName: 'freedns.tech',
    recordType: 'A',
    recordValue: '203.0.113.1',
    createdAt: '2024-01-17T09:15:00Z',
    userId: 'user3',
    userEmail: 'pn6009909@gmail.com',
    userName: 'Prasad'
  }
]

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

    // In production, fetch from database:
    // const subdomains = await SubdomainStorage.getAllWithUsers()
    
    return NextResponse.json(mockSubdomains)
  } catch (error) {
    console.error('Error fetching admin subdomains:', error)
    return NextResponse.json({ error: 'Failed to fetch subdomains' }, { status: 500 })
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

    // Remove from mock data (in production, delete from database)
    mockSubdomains = mockSubdomains.filter(sub => sub.id !== subdomainId)
    
    // In production:
    // await SubdomainStorage.delete(subdomainId)
    
    return NextResponse.json({ success: true, message: 'Subdomain deleted successfully' })
  } catch (error) {
    console.error('Error deleting subdomain:', error)
    return NextResponse.json({ error: 'Failed to delete subdomain' }, { status: 500 })
  }
}
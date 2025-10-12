import { requireAdmin } from "@/lib/auth-middleware"
import { testCloudflareConnection } from "@/lib/cloudflare"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { cloudflareZoneId, cloudflareApiKey } = await request.json()
    
    if (!cloudflareZoneId || !cloudflareApiKey) {
      return NextResponse.json({ error: 'Zone ID and API key required' }, { status: 400 })
    }

    const isValid = await testCloudflareConnection(cloudflareZoneId, cloudflareApiKey)
    
    return NextResponse.json({ success: isValid, error: isValid ? null : 'Connection failed' })
  } catch (error) {
    console.error('Error testing connection:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
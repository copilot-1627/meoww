interface CloudflareRecord {
  id: string
  type: string
  name: string
  content: string
  ttl: number
  priority?: number
  proxied: boolean
}

interface CloudflareResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result?: any
}

export class CloudflareAPI {
  private zoneId: string
  private apiKey: string

  constructor(zoneId: string, apiKey: string) {
    this.zoneId = zoneId
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<CloudflareResponse> {
    const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}${endpoint}`
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)
      const result = await response.json() as CloudflareResponse
      
      if (!result.success) {
        throw new Error(`Cloudflare API Error: ${result.errors?.map(e => e.message).join(', ') || 'Unknown error'}`)
      }
      
      return result
    } catch (error) {
      throw new Error(`Failed to make Cloudflare API request: ${error.message}`)
    }
  }

  async createDNSRecord(type: 'A' | 'CNAME' | 'SRV', name: string, content: string, options: {
    ttl?: number
    priority?: number
    weight?: number
    port?: number
    proxied?: boolean
  } = {}): Promise<string> {
    const recordData: any = {
      type,
      name,
      content,
      ttl: options.ttl || 300,
      proxied: options.proxied || false,
    }

    // For SRV records, add priority, weight, and port
    if (type === 'SRV') {
      recordData.priority = options.priority || 10
      recordData.data = {
        priority: options.priority || 10,
        weight: options.weight || 10,
        port: options.port || 80,
        target: content
      }
      // For SRV records, content should be in the data field
      delete recordData.content
    }

    const response = await this.makeRequest('/dns_records', 'POST', recordData)
    return response.result?.id
  }

  async updateDNSRecord(recordId: string, updates: {
    type?: 'A' | 'CNAME' | 'SRV'
    name?: string
    content?: string
    ttl?: number
    priority?: number
    weight?: number
    port?: number
    proxied?: boolean
  }): Promise<boolean> {
    const recordData: any = { ...updates }
    
    if (updates.type === 'SRV' && updates.content) {
      recordData.data = {
        priority: updates.priority || 10,
        weight: updates.weight || 10,
        port: updates.port || 80,
        target: updates.content
      }
      delete recordData.content
    }

    const response = await this.makeRequest(`/dns_records/${recordId}`, 'PUT', recordData)
    return response.success
  }

  async deleteDNSRecord(recordId: string): Promise<boolean> {
    const response = await this.makeRequest(`/dns_records/${recordId}`, 'DELETE')
    return response.success
  }

  async getDNSRecord(recordId: string): Promise<CloudflareRecord | null> {
    try {
      const response = await this.makeRequest(`/dns_records/${recordId}`)
      return response.result
    } catch {
      return null
    }
  }

  async listDNSRecords(name?: string, type?: string): Promise<CloudflareRecord[]> {
    let endpoint = '/dns_records'
    const params = new URLSearchParams()
    
    if (name) params.append('name', name)
    if (type) params.append('type', type)
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const response = await this.makeRequest(endpoint)
    return response.result || []
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('')
      return true
    } catch {
      return false
    }
  }
}

export async function createSubdomainRecord(
  domainName: string,
  subdomainName: string,
  recordType: 'A' | 'CNAME' | 'SRV',
  recordValue: string,
  cloudflareZoneId: string,
  cloudflareApiKey: string,
  options: {
    ttl?: number
    priority?: number
    weight?: number
    port?: number
  } = {}
): Promise<string> {
  const cloudflare = new CloudflareAPI(cloudflareZoneId, cloudflareApiKey)
  const fullName = `${subdomainName}.${domainName}`
  
  return await cloudflare.createDNSRecord(recordType, fullName, recordValue, options)
}

export async function deleteSubdomainRecord(
  cloudflareZoneId: string,
  cloudflareApiKey: string,
  recordId: string
): Promise<boolean> {
  const cloudflare = new CloudflareAPI(cloudflareZoneId, cloudflareApiKey)
  return await cloudflare.deleteDNSRecord(recordId)
}

export async function testCloudflareConnection(
  cloudflareZoneId: string,
  cloudflareApiKey: string
): Promise<boolean> {
  const cloudflare = new CloudflareAPI(cloudflareZoneId, cloudflareApiKey)
  return await cloudflare.testConnection()
}
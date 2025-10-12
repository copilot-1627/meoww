"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Globe, Trash2, TestTube } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Domain {
  id: string
  name: string
  cloudflareZoneId: string
  cloudflareApiKey: string
  active: boolean
  createdAt: string
  subdomainCount: number
}

export default function AdminDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    cloudflareZoneId: '',
    cloudflareApiKey: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/admin/domains')
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDomain = async () => {
    // Validate form
    const errors: Record<string, string> = {}
    if (!formData.name) errors.name = 'Domain name is required'
    if (!formData.cloudflareZoneId) errors.cloudflareZoneId = 'Cloudflare Zone ID is required'
    if (!formData.cloudflareApiKey) errors.cloudflareApiKey = 'Cloudflare API Key is required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    try {
      const response = await fetch('/api/admin/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        fetchDomains()
        setAddDialogOpen(false)
        setFormData({ name: '', cloudflareZoneId: '', cloudflareApiKey: '' })
        setFormErrors({})
      } else {
        const error = await response.json()
        setFormErrors({ submit: error.error || 'Failed to add domain' })
      }
    } catch (error) {
      setFormErrors({ submit: 'Failed to add domain' })
    }
  }

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain? This will also delete all associated subdomains.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/domains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId })
      })
      
      if (response.ok) {
        fetchDomains()
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  const testConnection = async (domain: Domain) => {
    setTestingConnection(domain.id)
    
    try {
      const response = await fetch('/api/admin/domains/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudflareZoneId: domain.cloudflareZoneId,
          cloudflareApiKey: domain.cloudflareApiKey
        })
      })
      
      const result = await response.json()
      alert(result.success ? 'Connection successful!' : `Connection failed: ${result.error}`)
    } catch (error) {
      alert('Connection test failed')
    } finally {
      setTestingConnection(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
          <p className="text-gray-600 mt-1">Manage domains and Cloudflare integration.</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Domain</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
              <DialogDescription>
                Add a domain with Cloudflare integration for DNS management.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="domainName">Domain Name</Label>
                <Input
                  id="domainName"
                  placeholder="example.com"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="zoneId">Cloudflare Zone ID</Label>
                <Input
                  id="zoneId"
                  placeholder="abc123def456..."
                  value={formData.cloudflareZoneId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cloudflareZoneId: e.target.value }))}
                  className={formErrors.cloudflareZoneId ? 'border-red-500' : ''}
                />
                {formErrors.cloudflareZoneId && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cloudflareZoneId}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Found in Cloudflare dashboard → Your domain → Overview
                </p>
              </div>
              
              <div>
                <Label htmlFor="apiKey">Cloudflare API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your API key"
                  value={formData.cloudflareApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, cloudflareApiKey: e.target.value }))}
                  className={formErrors.cloudflareApiKey ? 'border-red-500' : ''}
                />
                {formErrors.cloudflareApiKey && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cloudflareApiKey}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use API Token with Zone:Edit permissions
                </p>
              </div>
              
              {formErrors.submit && (
                <p className="text-red-500 text-sm">{formErrors.submit}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addDomain}>
                Add Domain
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domains List */}
      <div className="grid gap-6">
        {domains.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Globe className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No domains configured</h3>
              <p className="text-gray-500 mb-4">
                Add your first domain to enable subdomain creation for users.
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            </CardContent>
          </Card>
        ) : (
          domains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-flaxa-blue-600" />
                      <span>{domain.name}</span>
                      <Badge variant={domain.active ? "default" : "secondary"}>
                        {domain.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {domain.subdomainCount} subdomains created
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(domain)}
                      disabled={testingConnection === domain.id}
                    >
                      <TestTube className="w-4 h-4" />
                      {testingConnection === domain.id ? 'Testing...' : 'Test'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDomain(domain.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Zone ID:</span>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1 truncate">
                      {domain.cloudflareZoneId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">API Key:</span>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                      {'*'.repeat(20)}...{domain.cloudflareApiKey.slice(-4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, ExternalLink, Search, Globe, User, Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Subdomain {
  id: string
  name: string
  domainName: string
  recordType: string
  recordValue: string
  createdAt: string
  userId: string
  userEmail: string
  userName: string
}

interface SubdomainStats {
  totalSubdomains: number
  activeUsers: number
  recordTypes: { [key: string]: number }
}

export default function AdminSubdomainsPage() {
  const [subdomains, setSubdomains] = useState<Subdomain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('all')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subdomainToDelete, setSubdomainToDelete] = useState<Subdomain | null>(null)
  const [stats, setStats] = useState<SubdomainStats>({
    totalSubdomains: 0,
    activeUsers: 0,
    recordTypes: {}
  })

  useEffect(() => {
    fetchSubdomains()
  }, [])

  const fetchSubdomains = async () => {
    try {
      // Mock API call - in real implementation, create an admin API route
      const response = await fetch('/api/admin/subdomains')
      if (response.ok) {
        const data = await response.json()
        setSubdomains(data)
        
        // Calculate stats
        const uniqueUsers = new Set(data.map((s: Subdomain) => s.userId)).size
        const recordTypes = data.reduce((acc: any, s: Subdomain) => {
          acc[s.recordType] = (acc[s.recordType] || 0) + 1
          return acc
        }, {})
        
        setStats({
          totalSubdomains: data.length,
          activeUsers: uniqueUsers,
          recordTypes
        })
      }
    } catch (error) {
      console.error('Error fetching subdomains:', error)
      // Mock data for demonstration
      const mockData = [
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
        }
      ]
      setSubdomains(mockData)
      setStats({
        totalSubdomains: mockData.length,
        activeUsers: 2,
        recordTypes: { 'A': 1, 'CNAME': 1 }
      })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (subdomain: Subdomain) => {
    setSubdomainToDelete(subdomain)
    setDeleteDialogOpen(true)
  }

  const deleteSubdomain = async () => {
    if (!subdomainToDelete) return
    
    try {
      const response = await fetch('/api/admin/subdomains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomainId: subdomainToDelete.id })
      })
      
      if (response.ok) {
        fetchSubdomains() // Refresh the list
        setDeleteDialogOpen(false)
        setSubdomainToDelete(null)
      } else {
        alert('Failed to delete subdomain')
      }
    } catch (error) {
      console.error('Error deleting subdomain:', error)
      alert('Failed to delete subdomain')
    }
  }

  const filteredSubdomains = subdomains.filter(subdomain => {
    const matchesSearch = searchQuery === '' || 
      subdomain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subdomain.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subdomain.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subdomain.domainName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRecordType = recordTypeFilter === 'all' || subdomain.recordType === recordTypeFilter
    const matchesDomain = domainFilter === 'all' || subdomain.domainName === domainFilter
    
    return matchesSearch && matchesRecordType && matchesDomain
  })

  const uniqueDomains = Array.from(new Set(subdomains.map(s => s.domainName)))
  const uniqueRecordTypes = Array.from(new Set(subdomains.map(s => s.recordType)))

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CNAME': return 'bg-green-100 text-green-700 border-green-200'
      case 'SRV': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flaxa-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subdomain Management</h1>
          <p className="text-gray-600">View and manage all user-created subdomains</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subdomains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubdomains}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">With subdomains</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used Record</CardTitle>
            <Badge variant="secondary">
              {Object.keys(stats.recordTypes).length > 0 
                ? Object.entries(stats.recordTypes).sort(([,a], [,b]) => b - a)[0][0]
                : 'N/A'
              }
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.recordTypes).length > 0 
                ? Math.max(...Object.values(stats.recordTypes))
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">Records created</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subdomains.filter(s => {
                const createdDate = new Date(s.createdAt)
                const now = new Date()
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New subdomains</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by subdomain, user, or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueRecordTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {uniqueDomains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subdomains Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subdomains ({filteredSubdomains.length})</CardTitle>
          <CardDescription>
            Complete list of user-created subdomains with management actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubdomains.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No subdomains found</p>
              <p className="text-sm">Subdomains will appear here when users create them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Subdomain</th>
                    <th className="text-left py-3 px-2">Owner</th>
                    <th className="text-left py-3 px-2">Record</th>
                    <th className="text-left py-3 px-2">Target</th>
                    <th className="text-left py-3 px-2">Created</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubdomains.map((subdomain) => (
                    <tr key={subdomain.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm font-medium">
                              {subdomain.name}.{subdomain.domainName}
                            </div>
                            <Button variant="ghost" size="sm" className="h-4 p-0" asChild>
                              <a 
                                href={`https://${subdomain.name}.${subdomain.domainName}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Visit
                              </a>
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium">{subdomain.userName}</div>
                        <div className="text-xs text-gray-500">{subdomain.userEmail}</div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge 
                          variant="secondary" 
                          className={getRecordTypeColor(subdomain.recordType)}
                        >
                          {subdomain.recordType}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-mono max-w-[200px] truncate" title={subdomain.recordValue}>
                          {subdomain.recordValue}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm">
                          {new Date(subdomain.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(subdomain.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(subdomain)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subdomain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subdomain? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {subdomainToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div><strong>Subdomain:</strong> {subdomainToDelete.name}.{subdomainToDelete.domainName}</div>
              <div><strong>Owner:</strong> {subdomainToDelete.userName} ({subdomainToDelete.userEmail})</div>
              <div><strong>Record:</strong> {subdomainToDelete.recordType} → {subdomainToDelete.recordValue}</div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSubdomain}>
              Delete Subdomain
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
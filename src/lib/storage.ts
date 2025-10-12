import fs from 'fs/promises'
import path from 'path'

// Data types
export interface User {
  id: string
  email: string
  name: string
  image?: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  subdomainLimit: number
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface Domain {
  id: string
  name: string // e.g., "example.com"
  cloudflareZoneId: string
  cloudflareApiKey: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Subdomain {
  id: string
  name: string // e.g., "myapp" for myapp.example.com
  domainId: string
  userId: string
  active: boolean
  cloudflareRecordId?: string
  createdAt: string
  updatedAt: string
}

export interface DnsRecord {
  id: string
  type: 'A' | 'CNAME' | 'SRV'
  name: string
  value: string
  ttl: number
  priority?: number
  weight?: number
  port?: number
  subdomainId: string
  userId: string
  cloudflareRecordId?: string
  createdAt: string
  updatedAt: string
}

interface DatabaseSchema {
  users: User[]
  domains: Domain[]
  subdomains: Subdomain[]
  dnsRecords: DnsRecord[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'database.json')

// Admin email
const ADMIN_EMAIL = 'pn6009909@gmail.com'

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize empty database if it doesn't exist
async function initializeDatabase(): Promise<DatabaseSchema> {
  await ensureDataDir()
  
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    const initialData: DatabaseSchema = {
      users: [],
      domains: [],
      subdomains: [],
      dnsRecords: []
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

// Read database
async function readDatabase(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return await initializeDatabase()
  }
}

// Write database
async function writeDatabase(data: DatabaseSchema): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Check if user is admin
export function isAdminEmail(email: string): boolean {
  return email === ADMIN_EMAIL
}

// User operations
export class UserStorage {
  static async findByEmail(email: string): Promise<User | null> {
    const db = await readDatabase()
    return db.users.find(user => user.email === email) || null
  }

  static async findById(id: string): Promise<User | null> {
    const db = await readDatabase()
    return db.users.find(user => user.id === id) || null
  }

  static async findAll(): Promise<User[]> {
    const db = await readDatabase()
    return db.users
  }

  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await readDatabase()
    
    const user: User = {
      id: generateId(),
      ...userData,
      plan: userData.plan || 'FREE',
      subdomainLimit: userData.subdomainLimit || 2,
      isAdmin: isAdminEmail(userData.email),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    db.users.push(user)
    await writeDatabase(db)
    return user
  }

  static async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const db = await readDatabase()
    const userIndex = db.users.findIndex(user => user.id === id)
    
    if (userIndex === -1) return null
    
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await writeDatabase(db)
    return db.users[userIndex]
  }

  static async delete(id: string): Promise<boolean> {
    const db = await readDatabase()
    const userIndex = db.users.findIndex(user => user.id === id)
    
    if (userIndex === -1) return false
    
    db.users.splice(userIndex, 1)
    // Also delete related subdomains and DNS records
    db.subdomains = db.subdomains.filter(subdomain => subdomain.userId !== id)
    db.dnsRecords = db.dnsRecords.filter(record => record.userId !== id)
    
    await writeDatabase(db)
    return true
  }
}

// Domain operations
export class DomainStorage {
  static async findAll(): Promise<Domain[]> {
    const db = await readDatabase()
    return db.domains.filter(domain => domain.active)
  }

  static async findById(id: string): Promise<Domain | null> {
    const db = await readDatabase()
    return db.domains.find(domain => domain.id === id) || null
  }

  static async findByName(name: string): Promise<Domain | null> {
    const db = await readDatabase()
    return db.domains.find(domain => domain.name === name) || null
  }

  static async create(domainData: Omit<Domain, 'id' | 'createdAt' | 'updatedAt'>): Promise<Domain> {
    const db = await readDatabase()
    
    // Check if domain name already exists
    const existing = await this.findByName(domainData.name)
    if (existing) {
      throw new Error('Domain name already exists')
    }
    
    const domain: Domain = {
      id: generateId(),
      ...domainData,
      active: domainData.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    db.domains.push(domain)
    await writeDatabase(db)
    return domain
  }

  static async update(id: string, updates: Partial<Omit<Domain, 'id' | 'createdAt'>>): Promise<Domain | null> {
    const db = await readDatabase()
    const domainIndex = db.domains.findIndex(domain => domain.id === id)
    
    if (domainIndex === -1) return null
    
    db.domains[domainIndex] = {
      ...db.domains[domainIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await writeDatabase(db)
    return db.domains[domainIndex]
  }

  static async delete(id: string): Promise<boolean> {
    const db = await readDatabase()
    const domainIndex = db.domains.findIndex(domain => domain.id === id)
    
    if (domainIndex === -1) return false
    
    db.domains.splice(domainIndex, 1)
    // Also delete related subdomains and DNS records
    const subdomainsToDelete = db.subdomains.filter(subdomain => subdomain.domainId === id)
    const subdomainIds = subdomainsToDelete.map(s => s.id)
    
    db.subdomains = db.subdomains.filter(subdomain => subdomain.domainId !== id)
    db.dnsRecords = db.dnsRecords.filter(record => !subdomainIds.includes(record.subdomainId))
    
    await writeDatabase(db)
    return true
  }
}

// Subdomain operations
export class SubdomainStorage {
  static async findByUserId(userId: string): Promise<Subdomain[]> {
    const db = await readDatabase()
    return db.subdomains.filter(subdomain => subdomain.userId === userId)
  }

  static async findById(id: string): Promise<Subdomain | null> {
    const db = await readDatabase()
    return db.subdomains.find(subdomain => subdomain.id === id) || null
  }

  static async findByNameAndDomain(name: string, domainId: string): Promise<Subdomain | null> {
    const db = await readDatabase()
    return db.subdomains.find(subdomain => subdomain.name === name && subdomain.domainId === domainId) || null
  }

  static async findAll(): Promise<Subdomain[]> {
    const db = await readDatabase()
    return db.subdomains
  }

  static async create(subdomainData: Omit<Subdomain, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subdomain> {
    const db = await readDatabase()
    
    // Check if subdomain name already exists for this domain
    const existing = await this.findByNameAndDomain(subdomainData.name, subdomainData.domainId)
    if (existing) {
      throw new Error('Subdomain already exists for this domain')
    }
    
    const subdomain: Subdomain = {
      id: generateId(),
      ...subdomainData,
      active: subdomainData.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    db.subdomains.push(subdomain)
    await writeDatabase(db)
    return subdomain
  }

  static async update(id: string, updates: Partial<Omit<Subdomain, 'id' | 'createdAt'>>): Promise<Subdomain | null> {
    const db = await readDatabase()
    const subdomainIndex = db.subdomains.findIndex(subdomain => subdomain.id === id)
    
    if (subdomainIndex === -1) return null
    
    db.subdomains[subdomainIndex] = {
      ...db.subdomains[subdomainIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await writeDatabase(db)
    return db.subdomains[subdomainIndex]
  }

  static async delete(id: string): Promise<boolean> {
    const db = await readDatabase()
    const subdomainIndex = db.subdomains.findIndex(subdomain => subdomain.id === id)
    
    if (subdomainIndex === -1) return false
    
    db.subdomains.splice(subdomainIndex, 1)
    // Also delete related DNS records
    db.dnsRecords = db.dnsRecords.filter(record => record.subdomainId !== id)
    
    await writeDatabase(db)
    return true
  }

  static async countByUserId(userId: string): Promise<number> {
    const subdomains = await this.findByUserId(userId)
    return subdomains.length
  }
}

// DNS Record operations
export class DnsRecordStorage {
  static async findBySubdomainId(subdomainId: string): Promise<DnsRecord[]> {
    const db = await readDatabase()
    return db.dnsRecords.filter(record => record.subdomainId === subdomainId)
  }

  static async findByUserId(userId: string): Promise<DnsRecord[]> {
    const db = await readDatabase()
    return db.dnsRecords.filter(record => record.userId === userId)
  }

  static async findById(id: string): Promise<DnsRecord | null> {
    const db = await readDatabase()
    return db.dnsRecords.find(record => record.id === id) || null
  }

  static async create(recordData: Omit<DnsRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DnsRecord> {
    const db = await readDatabase()
    
    const record: DnsRecord = {
      id: generateId(),
      ...recordData,
      ttl: recordData.ttl || 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    db.dnsRecords.push(record)
    await writeDatabase(db)
    return record
  }

  static async update(id: string, updates: Partial<Omit<DnsRecord, 'id' | 'createdAt'>>): Promise<DnsRecord | null> {
    const db = await readDatabase()
    const recordIndex = db.dnsRecords.findIndex(record => record.id === id)
    
    if (recordIndex === -1) return null
    
    db.dnsRecords[recordIndex] = {
      ...db.dnsRecords[recordIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await writeDatabase(db)
    return db.dnsRecords[recordIndex]
  }

  static async delete(id: string): Promise<boolean> {
    const db = await readDatabase()
    const recordIndex = db.dnsRecords.findIndex(record => record.id === id)
    
    if (recordIndex === -1) return false
    
    db.dnsRecords.splice(recordIndex, 1)
    await writeDatabase(db)
    return true
  }

  static async countByUserId(userId: string): Promise<number> {
    const records = await this.findByUserId(userId)
    return records.length
  }
}
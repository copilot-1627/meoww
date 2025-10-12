import fs from 'fs/promises'
import path from 'path'

// Data types
export interface User {
  id: string
  email: string
  name: string
  image?: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  createdAt: string
  updatedAt: string
}

export interface Subdomain {
  id: string
  name: string
  userId: string
  active: boolean
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
  createdAt: string
  updatedAt: string
}

interface DatabaseSchema {
  users: User[]
  subdomains: Subdomain[]
  dnsRecords: DnsRecord[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'database.json')

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

  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await readDatabase()
    
    const user: User = {
      id: generateId(),
      ...userData,
      plan: userData.plan || 'FREE',
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

  static async findByName(name: string): Promise<Subdomain | null> {
    const db = await readDatabase()
    return db.subdomains.find(subdomain => subdomain.name === name) || null
  }

  static async create(subdomainData: Omit<Subdomain, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subdomain> {
    const db = await readDatabase()
    
    // Check if subdomain name already exists
    const existing = await this.findByName(subdomainData.name)
    if (existing) {
      throw new Error('Subdomain name already exists')
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
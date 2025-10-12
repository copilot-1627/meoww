import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from './mongodb'

// Data types
export interface User {
  _id?: ObjectId
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
  _id?: ObjectId
  id: string
  name: string
  cloudflareZoneId: string
  cloudflareApiKey: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Subdomain {
  _id?: ObjectId
  id: string
  name: string
  domainId: string
  userId: string
  active: boolean
  cloudflareRecordId?: string
  createdAt: string
  updatedAt: string
}

export interface DnsRecord {
  _id?: ObjectId
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

// Admin email
const ADMIN_EMAIL = 'pn6009909@gmail.com'

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
  private static async getCollection(): Promise<Collection<User>> {
    const db = await getDatabase()
    return db.collection<User>('users')
  }

  static async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection()
    const user = await collection.findOne({ email })
    return user
  }

  static async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection()
    const user = await collection.findOne({ id })
    return user
  }

  static async findAll(): Promise<User[]> {
    const collection = await this.getCollection()
    const users = await collection.find({}).toArray()
    return users
  }

  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | '_id'>): Promise<User> {
    const collection = await this.getCollection()
    
    const user: User = {
      id: generateId(),
      ...userData,
      plan: userData.plan || 'FREE',
      subdomainLimit: userData.subdomainLimit || 2,
      isAdmin: isAdminEmail(userData.email),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await collection.insertOne(user)
    return user
  }

  static async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | '_id'>>): Promise<User | null> {
    const collection = await this.getCollection()
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    return result || null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const db = await getDatabase()
    
    // Delete user
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount > 0) {
      // Also delete related subdomains and DNS records
      await db.collection('subdomains').deleteMany({ userId: id })
      await db.collection('dnsRecords').deleteMany({ userId: id })
      return true
    }
    
    return false
  }
}

// Domain operations
export class DomainStorage {
  private static async getCollection(): Promise<Collection<Domain>> {
    const db = await getDatabase()
    return db.collection<Domain>('domains')
  }

  static async findAll(): Promise<Domain[]> {
    const collection = await this.getCollection()
    const domains = await collection.find({ active: true }).toArray()
    return domains
  }

  static async findById(id: string): Promise<Domain | null> {
    const collection = await this.getCollection()
    const domain = await collection.findOne({ id })
    return domain
  }

  static async findByName(name: string): Promise<Domain | null> {
    const collection = await this.getCollection()
    const domain = await collection.findOne({ name })
    return domain
  }

  static async create(domainData: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | '_id'>): Promise<Domain> {
    const collection = await this.getCollection()
    
    // Check if domain name already exists
    const existing = await collection.findOne({ name: domainData.name })
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
    
    await collection.insertOne(domain)
    return domain
  }

  static async update(id: string, updates: Partial<Omit<Domain, 'id' | 'createdAt' | '_id'>>): Promise<Domain | null> {
    const collection = await this.getCollection()
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    return result || null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const db = await getDatabase()
    
    // Delete domain
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount > 0) {
      // Get subdomains to delete
      const subdomains = await db.collection('subdomains').find({ domainId: id }).toArray()
      const subdomainIds = subdomains.map(s => s.id)
      
      // Delete related subdomains and DNS records
      await db.collection('subdomains').deleteMany({ domainId: id })
      await db.collection('dnsRecords').deleteMany({ subdomainId: { $in: subdomainIds } })
      
      return true
    }
    
    return false
  }
}

// Subdomain operations
export class SubdomainStorage {
  private static async getCollection(): Promise<Collection<Subdomain>> {
    const db = await getDatabase()
    return db.collection<Subdomain>('subdomains')
  }

  static async findByUserId(userId: string): Promise<Subdomain[]> {
    const collection = await this.getCollection()
    const subdomains = await collection.find({ userId }).toArray()
    return subdomains
  }

  static async findById(id: string): Promise<Subdomain | null> {
    const collection = await this.getCollection()
    const subdomain = await collection.findOne({ id })
    return subdomain
  }

  static async findByNameAndDomain(name: string, domainId: string): Promise<Subdomain | null> {
    const collection = await this.getCollection()
    const subdomain = await collection.findOne({ name, domainId })
    return subdomain
  }

  static async findAll(): Promise<Subdomain[]> {
    const collection = await this.getCollection()
    const subdomains = await collection.find({}).toArray()
    return subdomains
  }

  static async create(subdomainData: Omit<Subdomain, 'id' | 'createdAt' | 'updatedAt' | '_id'>): Promise<Subdomain> {
    const collection = await this.getCollection()
    
    // Check if subdomain name already exists for this domain
    const existing = await collection.findOne({ name: subdomainData.name, domainId: subdomainData.domainId })
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
    
    await collection.insertOne(subdomain)
    return subdomain
  }

  static async update(id: string, updates: Partial<Omit<Subdomain, 'id' | 'createdAt' | '_id'>>): Promise<Subdomain | null> {
    const collection = await this.getCollection()
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    return result || null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const db = await getDatabase()
    
    // Delete subdomain
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount > 0) {
      // Also delete related DNS records
      await db.collection('dnsRecords').deleteMany({ subdomainId: id })
      return true
    }
    
    return false
  }

  static async countByUserId(userId: string): Promise<number> {
    const collection = await this.getCollection()
    const count = await collection.countDocuments({ userId })
    return count
  }
}

// DNS Record operations
export class DnsRecordStorage {
  private static async getCollection(): Promise<Collection<DnsRecord>> {
    const db = await getDatabase()
    return db.collection<DnsRecord>('dnsRecords')
  }

  static async findBySubdomainId(subdomainId: string): Promise<DnsRecord[]> {
    const collection = await this.getCollection()
    const records = await collection.find({ subdomainId }).toArray()
    return records
  }

  static async findByUserId(userId: string): Promise<DnsRecord[]> {
    const collection = await this.getCollection()
    const records = await collection.find({ userId }).toArray()
    return records
  }

  static async findById(id: string): Promise<DnsRecord | null> {
    const collection = await this.getCollection()
    const record = await collection.findOne({ id })
    return record
  }

  static async create(recordData: Omit<DnsRecord, 'id' | 'createdAt' | 'updatedAt' | '_id'>): Promise<DnsRecord> {
    const collection = await this.getCollection()
    
    const record: DnsRecord = {
      id: generateId(),
      ...recordData,
      ttl: recordData.ttl || 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await collection.insertOne(record)
    return record
  }

  static async update(id: string, updates: Partial<Omit<DnsRecord, 'id' | 'createdAt' | '_id'>>): Promise<DnsRecord | null> {
    const collection = await this.getCollection()
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    return result || null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }

  static async countByUserId(userId: string): Promise<number> {
    const collection = await this.getCollection()
    const count = await collection.countDocuments({ userId })
    return count
  }
}
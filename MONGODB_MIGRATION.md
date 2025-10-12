# MongoDB Migration Guide

This document outlines the migration from JSON file storage to MongoDB for the FreeDNS application.

## What Changed

### Storage System
- **Before**: JSON files (`data/database.json`, `data/transactions.json`)
- **After**: MongoDB collections (`users`, `domains`, `subdomains`, `dnsRecords`, `transactions`, `userLimits`)

### New Files Created

1. **`src/lib/mongodb.ts`** - MongoDB connection utility
2. **`src/lib/storage-mongodb.ts`** - MongoDB-based storage classes
3. **`src/lib/transaction-service-mongodb.ts`** - MongoDB-based transaction service

### Updated Files

1. **`src/lib/utils.ts`** - Updated to use MongoDB storage
2. **All API routes** - Updated to use MongoDB services
3. **`package.json`** - Added MongoDB driver dependency
4. **`.env.example`** - Added MongoDB connection string

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mongodb
```

### 2. Environment Variables

Add the MongoDB connection string to your `.env` file:

```env
MONGODB_URI=mongodb+srv://flaxa:flaxa@cluster0.shnv2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Database Schema

The application will automatically create the following collections:

#### Collections:
- **users** - User accounts and preferences
- **domains** - Available domains for subdomains
- **subdomains** - User-created subdomains
- **dnsRecords** - DNS records for subdomains
- **transactions** - Payment transactions
- **userLimits** - User subdomain limits from purchases

#### Sample Documents:

**Users Collection:**
```javascript
{
  "_id": ObjectId,
  "id": "user-unique-id",
  "email": "user@example.com",
  "name": "User Name",
  "image": "profile-image-url",
  "plan": "FREE", // FREE, PRO, ENTERPRISE
  "subdomainLimit": 2,
  "isAdmin": false,
  "createdAt": "2025-10-12T15:00:00.000Z",
  "updatedAt": "2025-10-12T15:00:00.000Z"
}
```

**Transactions Collection:**
```javascript
{
  "_id": ObjectId,
  "id": "transaction-unique-id",
  "userId": "user-email-or-id",
  "userEmail": "user@example.com",
  "userName": "User Name",
  "orderId": "razorpay-order-id",
  "paymentId": "razorpay-payment-id",
  "amount": 8,
  "currency": "INR",
  "subdomainSlots": 1,
  "status": "paid", // created, paid, failed
  "createdAt": "2025-10-12T15:00:00.000Z",
  "paidAt": "2025-10-12T15:05:00.000Z"
}
```

**User Limits Collection:**
```javascript
{
  "_id": ObjectId,
  "userId": "user-email-or-id",
  "limit": 5,
  "updatedAt": "2025-10-12T15:00:00.000Z"
}
```

## Data Migration

If you have existing JSON data, you can migrate it using a migration script:

### Migration Script Example

```javascript
// scripts/migrate-to-mongodb.js
const fs = require('fs')
const { MongoClient } = require('mongodb')

async function migrate() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  
  const db = client.db('freedns')
  
  // Read existing JSON data
  const dbData = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'))
  const transactionData = JSON.parse(fs.readFileSync('./data/transactions.json', 'utf8'))
  
  // Migrate users
  if (dbData.users?.length > 0) {
    await db.collection('users').insertMany(dbData.users)
  }
  
  // Migrate domains
  if (dbData.domains?.length > 0) {
    await db.collection('domains').insertMany(dbData.domains)
  }
  
  // Migrate subdomains
  if (dbData.subdomains?.length > 0) {
    await db.collection('subdomains').insertMany(dbData.subdomains)
  }
  
  // Migrate DNS records
  if (dbData.dnsRecords?.length > 0) {
    await db.collection('dnsRecords').insertMany(dbData.dnsRecords)
  }
  
  // Migrate transactions
  if (transactionData.transactions?.length > 0) {
    await db.collection('transactions').insertMany(transactionData.transactions)
  }
  
  // Migrate user limits
  if (transactionData.userSubdomainLimits) {
    const userLimits = Object.entries(transactionData.userSubdomainLimits).map(([userId, limit]) => ({
      userId,
      limit,
      updatedAt: new Date().toISOString()
    }))
    await db.collection('userLimits').insertMany(userLimits)
  }
  
  await client.close()
  console.log('Migration completed!')
}

migrate().catch(console.error)
```

## Performance Benefits

1. **Scalability** - MongoDB can handle large datasets better than JSON files
2. **Concurrent Access** - Multiple requests can access the database simultaneously
3. **Indexing** - MongoDB automatically creates indexes for better query performance
4. **Reliability** - Built-in replication and backup features
5. **Security** - User authentication and role-based access control

## Development Notes

1. **Connection Pooling** - The MongoDB connection is automatically pooled and reused
2. **Error Handling** - All database operations include proper error handling
3. **Type Safety** - TypeScript interfaces ensure data consistency
4. **Transactions** - MongoDB supports ACID transactions for complex operations

## Troubleshooting

### Connection Issues
- Ensure MongoDB URI is correct in environment variables
- Check that the MongoDB cluster allows connections from your IP
- Verify username and password are correct

### Performance Issues
- MongoDB Atlas provides monitoring tools
- Consider adding indexes for frequently queried fields
- Use MongoDB Compass for database visualization and query optimization

### Data Consistency
- All operations maintain referential integrity
- Cascade deletes ensure orphaned records are cleaned up
- Unique constraints prevent duplicate entries

## Backup and Recovery

MongoDB Atlas provides automatic backups, but you can also create manual backups:

```bash
# Export collection
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/freedns" --collection=users

# Import collection
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/freedns" --collection=users dump/freedns/users.bson
```

## Security Considerations

1. **Network Security** - Use MongoDB Atlas IP whitelisting
2. **Authentication** - Strong username/password combinations
3. **SSL/TLS** - All connections are encrypted
4. **Data Encryption** - MongoDB Atlas provides encryption at rest
5. **Access Control** - Principle of least privilege for database users
# FreeDns Setup Guide

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

4. **Copy Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env` file

## Environment Variables

Create `.env` file in root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## No Database Setup Required! 🎉

Unlike traditional applications, FreeDns uses a **JSON file-based storage system** that requires zero database configuration:

- ✅ **No PostgreSQL installation**
- ✅ **No database migrations**
- ✅ **No connection strings**
- ✅ **Automatic file creation**

The application will automatically create a `data/database.json` file when it first runs.

## Installation Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/copilot-1627/meoww.git
   cd meoww
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Google OAuth credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **That's it!** 🚀
   - Open http://localhost:3000
   - The `data` directory will be created automatically
   - No additional setup required

## File Storage Structure

```
data/
└── database.json          # Auto-generated JSON database
    ├── users[]            # User accounts
    ├── subdomains[]       # Subdomain records
    └── dnsRecords[]       # DNS records
```

## Deployment

### Vercel (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect repository to Vercel
   - Add environment variables in dashboard
   - Deploy automatically

3. **Configure OAuth**
   - Update `NEXTAUTH_URL` to your domain
   - Add production redirect URI to Google Console

### Other Platforms

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Add environment variables

## Storage Considerations

### Development
- JSON files are stored locally in `data/`
- Perfect for development and testing
- Easy to inspect and modify data

### Production
- **Vercel**: Files persist in serverless functions
- **Railway**: Files persist with container storage
- **Traditional VPS**: Files stored on server disk

### Backup Strategy
```bash
# Backup your data
cp data/database.json backups/database-$(date +%Y%m%d).json

# Restore from backup
cp backups/database-20250101.json data/database.json
```

### Migration to Database (Future)
When you're ready to scale, you can easily migrate:

1. Set up PostgreSQL/MongoDB
2. Create migration script to import JSON data
3. Switch storage implementation
4. No changes needed to API interfaces

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Restrict Google OAuth to specific domains
- [ ] Secure the `data/` directory permissions
- [ ] Regular backups of JSON files
- [ ] Monitor file sizes for growth

## Performance Optimization

### File Size Management
```bash
# Check database file size
ls -lh data/database.json

# Compress old data if needed
gzip data/database.json.backup
```

### Caching Strategy
- JSON data is loaded into memory
- Fast read/write operations
- No network latency
- Perfect for small to medium datasets

## Troubleshooting

### Common Issues

1. **Permission Denied (data directory)**
   ```bash
   chmod 755 data/
   chmod 644 data/database.json
   ```

2. **File Not Found**
   ```bash
   # Create data directory manually
   mkdir data
   echo '{}' > data/database.json
   ```

3. **Corrupted JSON**
   ```bash
   # Restore from backup
   cp data/database.json.backup data/database.json
   ```

4. **OAuth Redirect Mismatch**
   - Check `NEXTAUTH_URL` in environment
   - Verify redirect URIs in Google Console

### Debug Commands
```bash
# View current data
cat data/database.json | jq .

# Check file permissions
ls -la data/

# Monitor file changes
watch -n 1 'ls -lh data/database.json'
```

## Development Tips

### Data Inspection
```bash
# Pretty print JSON data
npx json-server data/database.json --port 3001

# Or use jq for command line
cat data/database.json | jq '.users'
```

### Testing
```bash
# Reset data for testing
cp data/database.json data/database.backup.json
echo '{"users":[],"subdomains":[],"dnsRecords":[]}' > data/database.json
```

## Monitoring & Analytics

1. **File Size Monitoring**
   ```javascript
   // Add to your app
   const stats = fs.statSync('data/database.json')
   console.log(`Database size: ${stats.size} bytes`)
   ```

2. **Performance Metrics**
   - JSON read/write speed
   - Memory usage
   - File system I/O

3. **Error Tracking**
   - File access errors
   - JSON parsing errors
   - Permission issues

## When to Consider Database Migration

### Indicators
- JSON file > 10MB
- >1000 concurrent users
- Complex queries needed
- Multi-server deployment
- Advanced backup/recovery requirements

### Migration Path
1. **SQLite** (easiest upgrade)
2. **PostgreSQL** (production ready)
3. **MongoDB** (document-based)

## Support

Need help with setup?
- 📧 Email: support@flaxa.tech
- 💬 Discord: [Join our community]
- 📖 Docs: [https://docs.freedns.flaxa.tech]

---

**Simple. Fast. No Database Required.** 🚀
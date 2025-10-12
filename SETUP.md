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

## Database Setup (PostgreSQL)

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb freedns

# Update .env
DATABASE_URL="postgresql://username:password@localhost:5432/freedns"
```

### Option 2: Supabase (Recommended)
1. Visit [Supabase](https://supabase.com/)
2. Create new project
3. Copy database URL from Settings > Database
4. Update `.env` with the connection string

### Option 3: Railway
1. Visit [Railway](https://railway.app/)
2. Create new PostgreSQL service
3. Copy connection string
4. Update `.env`

## Environment Variables

Create `.env` file in root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/freedns?schema=public"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your domain
5. Update Google OAuth redirect URIs

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `./next` folder
- **Railway**: Connect GitHub and add environment variables
- **DigitalOcean**: Use App Platform with Node.js buildpack

## DNS Configuration (For Production)

1. **Domain Setup**
   - Point your domain to your hosting provider
   - Update `NEXT_PUBLIC_APP_URL` to your domain

2. **Subdomain Structure**
   - User subdomains will be: `{username}.freedns.{yourdomain}.com`
   - Configure wildcard DNS: `*.freedns.{yourdomain}.com`

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Restrict Google OAuth to specific domains
- [ ] Use database connection pooling
- [ ] Enable CSRF protection
- [ ] Add rate limiting
- [ ] Configure CORS properly

## Monitoring & Analytics

1. **Add Google Analytics**
   - Create GA4 property
   - Add tracking code to layout

2. **Error Monitoring**
   - Integrate Sentry or similar
   - Monitor API endpoints

3. **Performance**
   - Use Vercel Analytics
   - Monitor Core Web Vitals

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Run `npx prisma db push`

2. **OAuth Redirect Mismatch**
   - Verify redirect URIs in Google Console
   - Check NEXTAUTH_URL matches your domain

3. **Build Errors**
   - Clear `.next` folder
   - Delete `node_modules` and reinstall
   - Check TypeScript errors

### Debug Commands
```bash
# Check database connection
npx prisma studio

# View database schema
npx prisma db pull

# Reset database
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate
```

## Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize logo and assets

2. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

3. **Caching Strategy**
   - Implement Redis for session storage
   - Cache DNS records
   - Use CDN for static assets

## Support

If you encounter issues:
1. Check this setup guide
2. Review GitHub issues
3. Contact: support@flaxa.tech
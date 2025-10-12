# FreeDNS - Advanced DNS Management Platform

## 🌟 Professional DNS Services by Flaxa Technologies

FreeDNS is a comprehensive subdomain management platform that provides free DNS services with premium features. Built with Next.js 14, TypeScript, and modern web technologies, it offers both free and paid subdomain management with advanced DNS record support.

![FreeDNS Dashboard](https://img.shields.io/badge/FreeDNS-Professional%20DNS%20Services-blue?style=for-the-badge&logo=cloudflare)

## ✨ Features

### Core DNS Services
- 🆓 **Free Subdomain Management** - 2 free subdomain slots for all users
- 📈 **Scalable Premium Plans** - Purchase additional slots at ₹8 per subdomain
- 🌐 **Multiple DNS Record Types** - Support for A, CNAME, and SRV records
- ⚡ **Real-time DNS Updates** - Instant propagation of DNS changes
- 🔒 **Secure Authentication** - Google OAuth integration with NextAuth.js

### Payment Integration
- 💳 **Razorpay Integration** - Secure payment processing for Indian users
- 🛒 **Flexible Purchasing** - Buy 1-50 additional subdomain slots at once
- 📊 **Transaction History** - Complete payment and purchase tracking
- 🔄 **Instant Activation** - Immediate slot allocation upon payment confirmation
- 📧 **Payment Notifications** - Real-time payment status updates

### Administrative Features
- 👑 **Admin Dashboard** - Comprehensive platform management interface
- 📈 **Transaction Analytics** - Revenue tracking and payment analytics
- 🗂️ **Subdomain Management** - View, filter, and manage all user subdomains
- 👥 **User Management** - Monitor user activity and account status
- 📊 **Domain Analytics** - Track domain usage and popular record types
- 🗑️ **Bulk Operations** - Efficient management tools for administrators

### SEO & Performance
- 🔍 **Complete SEO Optimization** - Meta tags, structured data, and sitemap
- 📱 **Progressive Web App** - Mobile-first design with offline capabilities
- 🎨 **Professional Favicon Suite** - Complete icon package for all platforms
- ⚡ **Performance Optimized** - Fast loading times and responsive design
- 📈 **Analytics Ready** - Google Analytics and Search Console integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- Google OAuth credentials
- Razorpay account (for payment features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/copilot-1627/meoww.git
   cd meoww
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:
   ```env
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Razorpay Payment Gateway
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💳 Payment Integration Setup

### Razorpay Configuration

1. **Create Razorpay Account**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Complete KYC verification for live payments

2. **Generate API Keys**
   - Navigate to Settings → API Keys
   - Generate Test/Live Key ID and Key Secret
   - Add keys to your environment variables

3. **Webhook Configuration** (Optional)
   - Set webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment.captured`, `payment.failed`

### Payment Features
- **Pricing**: ₹8 INR per additional subdomain slot
- **Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Currency**: Indian Rupee (INR)
- **Security**: PCI DSS compliant payment processing

## 👑 Admin Panel Access

The admin panel is restricted to authorized administrators:

1. **Admin User**: `pn6009909@gmail.com` (configurable in code)
2. **Access URL**: `/admin`
3. **Features**:
   - Transaction monitoring and analytics
   - User subdomain management
   - Domain usage statistics
   - Revenue tracking
   - Bulk operations

### Admin Routes
- `/admin` - Overview dashboard
- `/admin/users` - User management
- `/admin/domains` - Domain configuration
- `/admin/transactions` - Payment analytics
- `/admin/subdomains` - Subdomain management

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Razorpay Integration
- **Database**: File-based storage (easily replaceable)
- **Deployment**: Vercel-ready configuration

### Project Structure
```
src/
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication
│   │   ├── dashboard/    # User dashboard APIs
│   │   ├── payment/      # Payment processing
│   │   └── transactions/ # Transaction management
│   └── dashboard/        # User dashboard
├── components/           # Reusable UI components
│   └── ui/              # Base UI components
└── lib/                 # Utilities and configurations
    ├── razorpay.ts      # Payment integration
    └── utils.ts         # Helper functions
```

## 🔧 Configuration

### DNS Record Types

**A Records**
- Purpose: Point subdomain to IPv4 address
- Format: `192.168.1.1`
- Use Case: Direct IP mapping

**CNAME Records**
- Purpose: Alias to another domain
- Format: `target.example.com`
- Use Case: CDN integration, redirects

**SRV Records**
- Purpose: Service discovery
- Format: `priority weight port target`
- Use Case: Mail servers, gaming servers

### Subdomain Limits
- **Free Tier**: 2 subdomain slots
- **Premium**: Unlimited via ₹8/slot purchase
- **Admin Override**: Configurable limits

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables
   - Deploy automatically

2. **Environment Variables**
   ```bash
   # Production URLs
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   
   # Use production Razorpay keys
   RAZORPAY_KEY_ID=rzp_live_your_key_id
   RAZORPAY_KEY_SECRET=your_live_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
   ```

### Alternative Deployment

**Docker Deployment**
```bash
# Build production image
npm run build
docker build -t freedns .
docker run -p 3000:3000 freedns
```

**Manual Deployment**
```bash
npm run build
npm start
```

## 🔒 Security Features

- **Authentication**: Secure Google OAuth integration
- **Payment Security**: PCI DSS compliant Razorpay integration
- **Admin Protection**: Role-based access control
- **Data Validation**: Input sanitization and validation
- **CORS Configuration**: Secure cross-origin requests
- **Rate Limiting**: API abuse prevention

## 📊 Monitoring & Analytics

### Built-in Analytics
- Transaction success rates
- Revenue tracking
- User engagement metrics
- Subdomain usage patterns
- Payment method preferences

### Integration Ready
- Google Analytics 4
- Google Search Console
- Hotjar/LogRocket
- Sentry error tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software owned by Flaxa Technologies. All rights reserved.

## 🆘 Support

- **Documentation**: [Setup Guide](SETUP.md)
- **Issues**: GitHub Issues
- **Email**: support@flaxa.tech
- **Website**: [flaxa.tech](https://flaxa.tech)

## 🎯 Roadmap

### Upcoming Features
- [ ] Custom domain integration
- [ ] API access for developers
- [ ] Bulk subdomain operations
- [ ] Advanced DNS analytics
- [ ] Multi-currency payment support
- [ ] Subscription-based pricing
- [ ] White-label solutions

---

**Built with ❤️ by [Flaxa Technologies](https://flaxa.tech)**

*Empowering developers and businesses with professional DNS management solutions.*
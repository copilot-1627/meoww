# FreeDns - Advanced Next.js DNS Management Platform

![FreeDns Logo](./public/logo.svg)

**Powered by Flaxa Technologies**

## 🚀 Overview

FreeDns is a modern, advanced Next.js application that provides free DNS management services. Users get 2 free subdomain slots and can purchase additional slots for ₹8 each. The platform supports SRV, A, and CNAME record types with enterprise-grade features.

## ✨ Features

### Core DNS Features
- **Multiple Record Types**: Support for SRV, A, and CNAME records
- **Free Tier**: 2 free subdomain slots for every user
- **Scalable Pricing**: Additional subdomains at ₹8 per slot
- **Real-time Propagation**: DNS changes propagate globally in under 60 seconds
- **Enterprise Security**: DDoS protection and DNSSEC support

### Technical Features
- **Next.js 14**: Latest App Router with Server Components
- **TypeScript**: Fully typed codebase for better DX
- **Tailwind CSS**: Modern, responsive design system
- **NextAuth.js**: Google OAuth authentication with JWT sessions
- **JSON Storage**: Simple file-based storage system (no database required)
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives

### SEO & Performance
- **Complete SEO**: Meta tags, OpenGraph, Twitter Cards
- **Performance Optimized**: Image optimization, lazy loading
- **Mobile First**: Responsive design for all devices
- **PWA Ready**: Manifest and service worker support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider (JWT strategy)
- **Storage**: Local JSON file storage (no database required)
- **UI Components**: Radix UI + Custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google OAuth credentials

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

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
meoww/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Hero.tsx         # Landing page hero
│   │   ├── Features.tsx     # Features section
│   │   ├── Pricing.tsx      # Pricing section
│   │   └── Footer.tsx       # Site footer
│   └── lib/                 # Utilities and configs
│       ├── auth.ts          # NextAuth configuration
│       ├── storage.ts       # JSON file storage system
│       └── utils.ts        # Utility functions
├── data/                   # JSON storage directory
│   ├── database.json       # Main data file (auto-created)
│   └── .gitkeep           # Ensures directory exists
├── public/                 # Static assets
│   └── logo.svg           # FreeDns logo
└── package.json
```

## 🖾 Storage System

### JSON File Storage
FreeDns uses a simple JSON file-based storage system that requires no database setup:

- **Location**: `data/database.json`
- **Structure**: Organized into users, subdomains, and DNS records
- **Benefits**: 
  - No database installation required
  - Easy to backup and migrate
  - Perfect for development and small deployments
  - Human-readable data format

### Storage Classes
- **UserStorage**: Manage user accounts and authentication
- **SubdomainStorage**: Handle subdomain creation and management
- **DnsRecordStorage**: Manage DNS records (A, CNAME, SRV)

## 🎨 Design System

### Color Palette
- **Primary**: Flaxa Blue (#3b82f6 to #1d4ed8)
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Green for success states

### Components
- **Buttons**: Multiple variants (default, gradient, outline, ghost)
- **Cards**: Structured content containers
- **Forms**: Accessible form inputs and validation
- **Navigation**: Responsive header with mobile menu

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. NextAuth handles OAuth flow with JWT strategy
3. User data stored in JSON file via storage classes
4. Automatic redirect to dashboard
5. Session management with JWT tokens

## 💳 Pricing Model

- **Free Tier**: 2 subdomain slots
- **Pro Tier**: ₹8 per additional subdomain slot
- **Enterprise**: Custom pricing for organizations

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### No Database Setup Required!
Unlike traditional applications, FreeDns requires no database installation or configuration. The JSON storage system automatically creates the necessary files when the application starts.

## 📊 Features Roadmap

### Part 1 ✅ (Current)
- [x] Landing page with SEO
- [x] Google OAuth authentication
- [x] FreeDns logo and branding
- [x] Basic dashboard
- [x] JSON file storage system
- [x] Pricing model integration

### Part 2 (Next)
- [ ] Full dashboard functionality
- [ ] DNS record management
- [ ] Subdomain creation/deletion
- [ ] Payment integration
- [ ] Analytics dashboard

### Future Parts
- [ ] API documentation
- [ ] Admin panel
- [ ] Monitoring and alerting
- [ ] Advanced DNS features
- [ ] Database migration option

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. The `data` directory will be created automatically
5. Update Google OAuth redirect URIs

### Other Platforms
- **Netlify**: Ensure `data` directory is writable
- **Railway**: JSON files persist between deployments
- **DigitalOcean**: Use persistent storage for the `data` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Flaxa Technologies.

## 🙋‍♂️ Support

For support, email support@flaxa.tech or join our community Discord.

---

**Made with ❤️ by Flaxa Technologies**

🔗 **Live Demo**: [https://freedns.flaxa.tech](https://freedns.flaxa.tech)
📧 **Contact**: support@flaxa.tech
🐦 **Twitter**: [@FlaxaTech](https://twitter.com/FlaxaTech)
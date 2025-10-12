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
- **NextAuth.js**: Google OAuth authentication
- **Prisma**: Type-safe database ORM
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
- **Authentication**: NextAuth.js with Google Provider
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI + Custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
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
   DATABASE_URL="postgresql://username:password@localhost:5432/freedns"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
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
│       ├── db.ts           # Prisma client
│       └── utils.ts        # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
│   └── logo.svg           # FreeDns logo
└── package.json
```

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
2. NextAuth handles OAuth flow
3. User data stored in PostgreSQL via Prisma
4. Automatic redirect to dashboard
5. Session management across app

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

### Database Commands
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma migrate dev` - Create and apply migration

## 📊 Features Roadmap

### Part 1 ✅ (Current)
- [x] Landing page with SEO
- [x] Google OAuth authentication
- [x] FreeDns logo and branding
- [x] Basic dashboard
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
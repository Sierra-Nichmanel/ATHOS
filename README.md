# Africentric Business OS: Sovereign Enterprise Hub

Africentric Business OS is a high-fidelity, premium enterprise resource planning (ERP) and business management platform designed for the modern "Sovereign" business. Built with a focus on "Corporate Minimalism," it provides a powerful, motion-driven experience for managing finances, inventory, customers, and sales.

## 🚀 Key Features

### 🏢 Command Center (Dashboard)
- **Real-time Telemetry**: High-impact KPI cards showing revenue, expenses, and net profit.
- **Operational Velocity**: Sophisticated Area charts visualizing fiscal inflows vs. outflows.
- **Infrastructure Health**: Integrated system monitoring for database and AI readiness.

### 📦 Stock Vault (Inventory)
- **Precision Tracking**: Granular inventory management with low-stock and out-of-stock protocols.
- **Product Intelligence**: Deep-dive detail pages for every product with sales velocity and margin analysis.
- **Catalog Orchestration**: Modern, searchable interface for large-scale product inventories.

### 🤝 Nexus (Customer Relations)
- **Stakeholder Intelligence**: Advanced customer management with Lifetime Value (LTV) metrics.
- **Client Profiles**: Dedicated interaction ledgers and transaction history for high-value relationships.
- **Portal Access**: Secure client identity management.

### 📊 Fiscal Ledger (Sales)
- **Revenue Orchestration**: Real-time sales ledger with multi-status transaction tracking.
- **Enterprise POS**: High-conversion order creation interface with line-item management and automatic tax/total calculation.

### ⚙️ Strategic Settings
- **Business Identity**: Comprehensive configuration for enterprise branding and information.
- **Security Protocols**: Advanced authentication and profile security.
- **Subscription Management**: Enterprise-grade billing and feature access controls.

## 🎨 Design Philosophy: Corporate Minimalism
- **Premium Aesthetics**: Leverages glassmorphism, high-radius surfaces, and a sophisticated neutral palette with corporate blue accents.
- **Typography**: Optimized for clarity and authority using the Inter font family.
- **Motion Design**: Fluid, cubic-bezier transitions using Framer Motion for a premium desktop-app feel.

## 🛠️ Technology Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, RLS)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens.
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Build for Production
```bash
npm run build
```

## 📜 License
Sovereign License - All Rights Reserved.

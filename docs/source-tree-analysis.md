# Source Tree Analysis - New Emerald

**Generated:** 2026-01-10  
**Scan Level:** Quick Scan

---

## Complete Project Structure

```
New_Emerald/
│
├── Frontend/                          # React 19 Web Application
│   ├── src/
│   │   ├── main.tsx                   # ⭐ Entry point - React DOM render
│   │   ├── App.tsx                    # ⭐ Root component with routing
│   │   ├── App.css                    # Global app styles
│   │   ├── index.css                  # Tailwind directives
│   │   │
│   │   ├── pages/                     # 📄 Route-based page components
│   │   │   ├── Home.tsx               # Landing page
│   │   │   ├── About.tsx              # Company about page
│   │   │   ├── Services.tsx           # Services showcase
│   │   │   ├── Contact.tsx            # Contact form
│   │   │   ├── FAQ.tsx                # FAQ accordion
│   │   │   ├── Quote.tsx              # Quote calculator
│   │   │   ├── QuotesList.tsx         # Saved quotes list
│   │   │   ├── Tracking.tsx           # Public tracking page
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx          # Login form
│   │   │   │   └── Register.tsx       # Registration form
│   │   │   ├── customer/
│   │   │   │   └── Dashboard.tsx      # Customer dashboard
│   │   │   └── admin/
│   │   │       └── Dashboard.tsx      # Admin dashboard
│   │   │
│   │   ├── components/                # 🧩 Reusable UI components
│   │   │   ├── ui/                    # shadcn/ui primitives
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── textarea.tsx
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── Header.tsx         # Navigation header
│   │   │   │   ├── Footer.tsx         # Page footer
│   │   │   │   └── MainLayout.tsx     # Main layout wrapper
│   │   │   ├── auth/                  # Auth-related components
│   │   │   │   ├── ProtectedRoute.tsx # Route guard
│   │   │   │   └── AdminOnly.tsx      # Admin route guard
│   │   │   └── about/
│   │   │       └── Leadership.tsx     # Leadership section
│   │   │
│   │   ├── services/                  # 🔌 API layer
│   │   │   ├── api.ts                 # Axios instance configuration
│   │   │   ├── authApi.ts             # Auth API calls
│   │   │   ├── quote.service.ts       # Quote API calls
│   │   │   ├── shipments.service.ts   # Shipments API calls
│   │   │   ├── tracking.service.ts    # Tracking API calls
│   │   │   ├── admin.service.ts       # Admin API calls
│   │   │   ├── queryClient.ts         # React Query client
│   │   │   └── queryKeys.ts           # Query key constants
│   │   │
│   │   ├── hooks/                     # 🪝 Custom React hooks
│   │   │   └── useAuth.ts             # Authentication hook
│   │   │
│   │   ├── lib/                       # 📚 Utilities
│   │   │   ├── utils.ts               # Helper functions (cn, etc.)
│   │   │   └── constants.ts           # App constants
│   │   │
│   │   ├── types/                     # 📝 TypeScript types
│   │   │   └── index.ts               # Shared type definitions
│   │   │
│   │   └── assets/                    # 🖼️ Static assets
│   │       ├── react.svg
│   │       ├── Fin_DP.jpg
│   │       ├── Modi_DP.jpg
│   │       └── putin_DP.jpg
│   │
│   ├── public/                        # Public static files
│   │   └── vite.svg
│   │
│   ├── package.json                   # NPM dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── tsconfig.app.json              # App TS config
│   ├── tsconfig.node.json             # Node TS config
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   ├── eslint.config.js               # ESLint config
│   ├── index.html                     # HTML entry point
│   ├── nginx.conf                     # Production nginx config
│   ├── Dockerfile                     # Container build
│   ├── README.md                      # Frontend documentation
│   └── QUICKSTART.md                  # Quick start guide
│
├── Backend/                           # .NET 10 REST API
│   │
│   ├── Backend.API/                   # 🎯 API Layer (Entry Point)
│   │   ├── Program.cs                 # ⭐ Application entry point
│   │   ├── Controllers/               # REST Controllers
│   │   │   ├── AuthController.cs      # Authentication endpoints
│   │   │   ├── ShipmentsController.cs # Shipment CRUD
│   │   │   ├── QuotesController.cs    # Quote calculation
│   │   │   ├── TrackingController.cs  # Public tracking
│   │   │   └── ContactController.cs   # Contact form
│   │   ├── Properties/
│   │   │   └── launchSettings.json    # Dev server settings
│   │   ├── appsettings.json           # App configuration
│   │   ├── appsettings.Development.json
│   │   ├── Backend.API.csproj         # Project file
│   │   └── logistics.db               # SQLite database file
│   │
│   ├── Backend.Application/           # 📋 Application Layer
│   │   ├── DTOs/                      # Data Transfer Objects
│   │   │   ├── Auth/
│   │   │   │   ├── LoginDto.cs
│   │   │   │   ├── RegisterDto.cs
│   │   │   │   └── AuthResponseDto.cs
│   │   │   ├── Shipments/
│   │   │   │   ├── CreateShipmentDto.cs
│   │   │   │   ├── ShipmentResponseDto.cs
│   │   │   │   └── UpdateStatusDto.cs
│   │   │   └── Quotes/
│   │   │       ├── CalculateQuoteDto.cs
│   │   │       ├── QuoteResponseDto.cs
│   │   │       └── SaveQuoteDto.cs
│   │   ├── Interfaces/                # Service interfaces
│   │   │   ├── IAuthService.cs
│   │   │   └── IPricingService.cs
│   │   └── Backend.Application.csproj
│   │
│   ├── Backend.Domain/                # 🏛️ Domain Layer (Core)
│   │   ├── Entities/                  # Domain entities
│   │   │   ├── User.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Shipment.cs
│   │   │   ├── Package.cs
│   │   │   ├── TrackingEvent.cs
│   │   │   ├── Quote.cs
│   │   │   ├── Invoice.cs
│   │   │   ├── InvoiceLineItem.cs
│   │   │   ├── PricingRule.cs
│   │   │   ├── Document.cs
│   │   │   └── ContactForm.cs
│   │   ├── Enums/                     # Domain enums
│   │   │   ├── UserRole.cs            # Customer, Admin, Staff
│   │   │   ├── ShipmentStatus.cs      # Pending → Delivered
│   │   │   ├── ServiceType.cs         # Standard, Express, Overnight
│   │   │   ├── InvoiceStatus.cs       # Draft → Paid
│   │   │   └── DocumentType.cs        # Label, Invoice, etc.
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   └── Backend.Domain.csproj
│   │
│   ├── Backend.Infrastructure/        # 🔧 Infrastructure Layer
│   │   ├── Data/                      # Data access
│   │   │   ├── AppDbContext.cs        # EF Core DbContext
│   │   │   └── DbSeeder.cs            # Database seeding
│   │   ├── Services/                  # External services
│   │   │   ├── JwtTokenService.cs     # JWT generation
│   │   │   ├── PricingService.cs      # Pricing calculations
│   │   │   └── TrackingNumberGenerator.cs
│   │   └── Backend.Infrastructure.csproj
│   │
│   ├── Backend.sln                    # Solution file
│   ├── Shipping-Line-Backend.slnx     # Alternative solution
│   ├── Dockerfile                     # Container build
│   └── data/                          # Persistent data volume
│
├── docs/                              # 📚 Documentation
│   ├── planning-artifacts/            # BMM workflow artifacts
│   │   └── bmm-workflow-status.yaml
│   └── implementation-artifacts/      # Implementation docs
│
├── _bmad/                             # BMAD Method configuration
│
├── docker-compose.yml                 # 🐳 Container orchestration
├── content.md                         # Technical specification
└── README.md                          # Project documentation
```

---

## Critical Folders Summary

### Frontend Critical Paths

| Path | Purpose | Contains |
|------|---------|----------|
| `Frontend/src/pages/` | Route components | 12 page components |
| `Frontend/src/components/ui/` | UI primitives | 11 shadcn/ui components |
| `Frontend/src/services/` | API layer | 8 service files |
| `Frontend/src/hooks/` | Custom hooks | Auth hook |
| `Frontend/src/types/` | Type definitions | Shared types |

### Backend Critical Paths

| Path | Purpose | Contains |
|------|---------|----------|
| `Backend/Backend.API/Controllers/` | REST endpoints | 5 controllers |
| `Backend/Backend.Domain/Entities/` | Domain models | 11 entities |
| `Backend/Backend.Domain/Enums/` | Domain enums | 5 enums |
| `Backend/Backend.Application/DTOs/` | Data transfer | 9 DTOs |
| `Backend/Backend.Infrastructure/Data/` | Data access | DbContext, Seeder |
| `Backend/Backend.Infrastructure/Services/` | Business logic | 3 services |

---

## Entry Points

| Part | Entry Point | Description |
|------|-------------|-------------|
| Frontend | `Frontend/src/main.tsx` | React DOM render, providers setup |
| Frontend | `Frontend/index.html` | HTML shell with root div |
| Backend | `Backend/Backend.API/Program.cs` | ASP.NET Core startup |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `Frontend/vite.config.ts` | Vite build configuration |
| `Frontend/tailwind.config.js` | Tailwind CSS customization |
| `Frontend/tsconfig.json` | TypeScript configuration |
| `Backend/Backend.API/appsettings.json` | App configuration (JWT, DB) |
| `docker-compose.yml` | Multi-container orchestration |


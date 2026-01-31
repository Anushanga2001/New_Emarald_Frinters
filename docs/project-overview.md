# Project Overview - New Emerald (Shipping Line Management Platform)

**Generated:** 2026-01-10  
**Scan Level:** Quick Scan  
**Repository Type:** Multi-part (Frontend + Backend)

---

## Executive Summary

**New Emerald** is a comprehensive shipping management platform designed for a single shipping company serving the Sri Lankan market. The platform provides a customer portal and admin dashboard with real-time tracking, invoice management, and automated pricing calculations.

### Key Features

| Category | Features |
|----------|----------|
| **Customer Portal** | User registration/login, shipment creation, quote calculator, tracking, invoice viewing, dashboard |
| **Admin Dashboard** | Shipment management, customer management, pricing rules, invoice generation, analytics |
| **Core Business** | Weight + Distance + Speed pricing, B2B invoice model, milestone-based tracking |

---

## Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 19.2.0 |
| **Frontend Build** | Vite (rolldown-vite) | 7.2.5 |
| **Frontend Language** | TypeScript | 5.9.3 |
| **UI Components** | shadcn/ui (Radix UI) | Various |
| **Styling** | Tailwind CSS | 3.3.6 |
| **State Management** | TanStack Query | 5.12.2 |
| **Routing** | React Router | 6.20.0 |
| **Forms** | React Hook Form + Zod | 7.48.2 / 3.22.4 |
| **HTTP Client** | Axios | 1.6.2 |
| **Maps** | Leaflet + React Leaflet | 1.9.4 / 4.2.1 |
| **Data Grid** | AG Grid | 35.0.0 |
| **Backend Framework** | ASP.NET Core | .NET 10 |
| **ORM** | Entity Framework Core | 10.0.0 |
| **Database** | SQLite | (dev) |
| **Authentication** | JWT Bearer Tokens | ASP.NET 10.0.0 |
| **API Docs** | Swagger (Swashbuckle) | 6.9.0 |

---

## Architecture Classification

| Aspect | Classification |
|--------|---------------|
| **Repository Structure** | Multi-part monorepo |
| **Frontend Architecture** | Component-based SPA |
| **Backend Architecture** | Clean Architecture (4-layer) |
| **API Style** | REST |
| **Auth Pattern** | JWT with role-based access |
| **Deployment** | Docker Compose |

---

## Repository Structure

```
New_Emerald/
├── Frontend/           # React 19 Web Application
├── Backend/            # .NET 10 REST API
│   ├── Backend.API/           # Controllers & entry point
│   ├── Backend.Application/   # DTOs & interfaces
│   ├── Backend.Domain/        # Entities & enums
│   └── Backend.Infrastructure/ # Data access & services
├── docs/               # Documentation
├── docker-compose.yml  # Container orchestration
├── content.md          # Technical specification
└── README.md           # Project documentation
```

---

## Parts Overview

### Part 1: Frontend (Web Application)

| Property | Value |
|----------|-------|
| **Type** | Web Application |
| **Root Path** | `Frontend/` |
| **Language** | TypeScript |
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Entry Point** | `src/main.tsx` |
| **Components** | 31 TSX files |
| **Pages** | 12 pages |

### Part 2: Backend (API)

| Property | Value |
|----------|-------|
| **Type** | Backend API |
| **Root Path** | `Backend/` |
| **Language** | C# |
| **Framework** | .NET 10 / ASP.NET Core |
| **Architecture** | Clean Architecture |
| **Entry Point** | `Backend.API/Program.cs` |
| **Controllers** | 5 controllers |
| **Entities** | 11 domain entities |

---

## Integration Points

| From | To | Method | Description |
|------|-----|--------|-------------|
| Frontend | Backend | REST API (Axios) | All data operations |
| Backend | SQLite | EF Core | Data persistence |
| Frontend | Leaflet | JS Library | Map visualization |

---

## Detailed Documentation

- [Architecture - Frontend](./architecture-frontend.md)
- [Architecture - Backend](./architecture-backend.md)
- [Integration Architecture](./integration-architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Development Guide](./development-guide.md)

---

## Getting Started

See the [Development Guide](./development-guide.md) for setup instructions, or jump straight to:

- **Docker:** `docker-compose up --build`
- **Backend:** `cd Backend && dotnet run`
- **Frontend:** `cd Frontend && npm install && npm run dev`

**Default Admin:** `admin@shipping.com` / `Admin@123`


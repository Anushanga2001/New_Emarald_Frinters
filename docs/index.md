# Project Documentation Index - New Emerald

**Generated:** 2026-01-10  
**Scan Level:** Quick Scan  
**Repository Type:** Multi-part (Frontend + Backend)

---

## Project Overview

| Property | Value |
|----------|-------|
| **Project Name** | New Emerald (Shipping Line Management Platform) |
| **Type** | Multi-part with 2 parts |
| **Primary Languages** | TypeScript, C# |
| **Architecture** | React SPA + .NET Clean Architecture |
| **Database** | SQLite (dev) |
| **Deployment** | Docker Compose |

---

## Quick Reference

### Frontend (React Web Application)

| Property | Value |
|----------|-------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **UI Library** | shadcn/ui + Tailwind CSS |
| **State** | TanStack Query |
| **Root** | `Frontend/` |
| **Entry** | `src/main.tsx` |

### Backend (.NET API)

| Property | Value |
|----------|-------|
| **Framework** | .NET 10 / ASP.NET Core |
| **Architecture** | Clean Architecture (4-layer) |
| **ORM** | Entity Framework Core 10 |
| **Auth** | JWT Bearer Tokens |
| **Root** | `Backend/` |
| **Entry** | `Backend.API/Program.cs` |

---

## Generated Documentation

### Core Documentation

- [Project Overview](./project-overview.md) - Executive summary and tech stack
- [Source Tree Analysis](./source-tree-analysis.md) - Complete directory structure

### Architecture

- [Architecture - Frontend](./architecture-frontend.md) - React application architecture
- [Architecture - Backend](./architecture-backend.md) - .NET API architecture
- [Integration Architecture](./integration-architecture.md) - Frontend ↔ Backend communication

### Development

- [Development Guide](./development-guide.md) - Setup, commands, and workflows

---

## Existing Documentation

| Document | Location | Description |
|----------|----------|-------------|
| [Project README](../README.md) | Root | Main project documentation |
| [Frontend README](../Frontend/README.md) | Frontend | Frontend-specific docs |
| [Frontend Quickstart](../Frontend/QUICKSTART.md) | Frontend | Quick setup guide |
| [Technical Spec](../content.md) | Root | Original technical specification |

---

## Getting Started

### Docker (Recommended)

```bash
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5253
- Swagger UI: http://localhost:5253/swagger

### Local Development

**Backend:**
```bash
cd Backend
dotnet run --project Backend.API
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

### Default Admin Credentials

- **Email:** `admin@shipping.com`
- **Password:** `Admin@123`

---

## API Endpoints Summary

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/register` | POST | Customer registration | Public |
| `/api/shipments` | GET/POST | List/Create shipments | Protected |
| `/api/shipments/{id}` | GET/PUT/DELETE | Shipment CRUD | Protected |
| `/api/quotes/calculate` | POST | Calculate quote | Public |
| `/api/tracking/{number}` | GET | Public tracking | Public |

Full API docs: [Swagger UI](http://localhost:5253/swagger) (when backend running)

---

## Domain Entities

| Entity | Description |
|--------|-------------|
| User | System users (Customer, Admin, Staff) |
| Customer | Extended customer profile |
| Shipment | Shipping orders with tracking |
| Package | Individual packages in shipment |
| TrackingEvent | Status milestones |
| Quote | Shipping cost estimates |
| Invoice | Customer invoices |
| PricingRule | Pricing configuration |

---

## Key Business Logic

### Pricing Formula

```
TotalCost = BaseRate + (Weight × WeightRate) + (Distance × DistanceRate)
TotalCost = Max(TotalCost, MinimumCharge)
```

### Shipment Status Flow

```
Pending → PickedUp → InTransit → OutForDelivery → Delivered
                                               → Cancelled
```

---

## For AI-Assisted Development

When working with this codebase, reference these documents:

| Task | Reference |
|------|-----------|
| **Frontend changes** | [Architecture - Frontend](./architecture-frontend.md) |
| **Backend changes** | [Architecture - Backend](./architecture-backend.md) |
| **API integration** | [Integration Architecture](./integration-architecture.md) |
| **New features** | [Project Overview](./project-overview.md) + [Technical Spec](../content.md) |
| **Full-stack changes** | All architecture docs |

---

## Documentation Metadata

| Property | Value |
|----------|-------|
| **Generated** | 2026-01-10 |
| **Workflow** | document-project |
| **Scan Level** | Quick Scan |
| **Files Generated** | 7 |
| **State File** | [project-scan-report.json](./project-scan-report.json) |


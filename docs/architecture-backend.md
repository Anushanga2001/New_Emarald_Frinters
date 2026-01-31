# Architecture - Backend (.NET REST API)

**Generated:** 2026-01-10  
**Part ID:** backend  
**Project Type:** Backend API

---

## Executive Summary

The backend is a .NET 10 REST API built with ASP.NET Core following Clean Architecture principles. It provides a secure, scalable API for the shipping management platform with JWT authentication, Entity Framework Core for data access, and SQLite for development database.

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | .NET | 10.0 | Runtime environment |
| Framework | ASP.NET Core | 10.0 | Web framework |
| ORM | Entity Framework Core | 10.0.0 | Data access |
| Database | SQLite | (dev) | Data persistence |
| Auth | JWT Bearer | 10.0.0 | Authentication |
| API Docs | Swashbuckle | 6.9.0 | OpenAPI/Swagger |
| Password | BCrypt.Net-Next | (implied) | Password hashing |

---

## Architecture Pattern

**Pattern:** Clean Architecture (4-Layer)

```
┌─────────────────────────────────────────────────────────────┐
│                      Backend.API                             │
│              (Controllers, Middleware, Config)               │
│                         ▲                                    │
├─────────────────────────┼───────────────────────────────────┤
│                         │                                    │
│            Backend.Application                               │
│         (DTOs, Interfaces, Use Cases)                        │
│                         ▲                                    │
├─────────────────────────┼───────────────────────────────────┤
│                         │                                    │
│            Backend.Infrastructure                            │
│         (Data Access, External Services)                     │
│                         ▲                                    │
├─────────────────────────┼───────────────────────────────────┤
│                         │                                    │
│              Backend.Domain                                  │
│            (Entities, Enums, Core)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Flow

```
API → Application → Domain
         ↓
   Infrastructure → Domain
```

---

## Project Structure

### Backend.Domain (Core Layer)

**Purpose:** Core business logic, entities, and domain rules

| Folder | Contents |
|--------|----------|
| `Entities/` | Domain entities (11 classes) |
| `Enums/` | Domain enumerations (5 enums) |

#### Domain Entities

| Entity | Description | Key Properties |
|--------|-------------|----------------|
| `User` | System user | Email, PasswordHash, Role |
| `Customer` | Extended user info | CompanyName, CreditLimit, Balance |
| `Shipment` | Shipping order | TrackingNumber, Status, Weight, Distance |
| `Package` | Package in shipment | Weight, Dimensions |
| `TrackingEvent` | Status milestone | Status, Location, EventDate |
| `Quote` | Shipping quote | ServiceType, TotalCost |
| `Invoice` | Customer invoice | InvoiceNumber, TotalAmount, Status |
| `InvoiceLineItem` | Invoice line | ShipmentId, Amount |
| `PricingRule` | Pricing config | ServiceType, Rates |
| `Document` | Attached doc | DocumentType, FilePath |
| `ContactForm` | Contact submission | Name, Email, Message |

#### Domain Enums

| Enum | Values |
|------|--------|
| `UserRole` | Customer, Admin, Staff |
| `ShipmentStatus` | Pending, PickedUp, InTransit, OutForDelivery, Delivered, Cancelled |
| `ServiceType` | Standard, Express, Overnight |
| `InvoiceStatus` | Draft, Sent, Paid, Overdue, Cancelled |
| `DocumentType` | Label, Invoice, Customs, POD |

---

### Backend.Application (Application Layer)

**Purpose:** Application logic, DTOs, service interfaces

| Folder | Contents |
|--------|----------|
| `DTOs/` | Data Transfer Objects |
| `Interfaces/` | Service contracts |

#### DTOs by Feature

| Feature | DTOs |
|---------|------|
| **Auth** | LoginDto, RegisterDto, AuthResponseDto |
| **Shipments** | CreateShipmentDto, ShipmentResponseDto, UpdateStatusDto |
| **Quotes** | CalculateQuoteDto, QuoteResponseDto, SaveQuoteDto |

#### Service Interfaces

| Interface | Purpose |
|-----------|---------|
| `IAuthService` | Authentication operations |
| `IPricingService` | Quote calculation |

---

### Backend.Infrastructure (Infrastructure Layer)

**Purpose:** External concerns - data access, external services

| Folder | Contents |
|--------|----------|
| `Data/` | EF Core DbContext, seeding |
| `Services/` | Service implementations |

#### Data Access

| Class | Purpose |
|-------|---------|
| `AppDbContext` | EF Core database context |
| `DbSeeder` | Initial data seeding |

#### Services

| Service | Purpose |
|---------|---------|
| `JwtTokenService` | JWT token generation |
| `PricingService` | Shipping cost calculation |
| `TrackingNumberGenerator` | Unique tracking numbers |

---

### Backend.API (Presentation Layer)

**Purpose:** HTTP interface, controllers, middleware

| Folder | Contents |
|--------|----------|
| `Controllers/` | REST API controllers |
| `Properties/` | Launch settings |

#### Controllers

| Controller | Routes | Auth |
|------------|--------|------|
| `AuthController` | `/api/auth/*` | Public |
| `ShipmentsController` | `/api/shipments/*` | Protected |
| `QuotesController` | `/api/quotes/*` | Mixed |
| `TrackingController` | `/api/tracking/*` | Public |
| `ContactController` | `/api/contact/*` | Public |

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/login` | User login | Public |
| POST | `/register` | Customer registration | Public |

### Shipments (`/api/shipments`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List shipments | Customer/Admin |
| GET | `/{id}` | Get shipment details | Customer/Admin |
| POST | `/` | Create shipment | Customer/Admin |
| PUT | `/{id}/status` | Update status | Admin |
| DELETE | `/{id}` | Cancel shipment | Customer/Admin |
| GET | `/{id}/tracking` | Get tracking events | Customer/Admin |

### Tracking (`/api/tracking`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/{trackingNumber}` | Track by number | Public |

### Quotes (`/api/quotes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/calculate` | Calculate quote | Public |

### Contact (`/api/contact`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Submit contact form | Public |

---

## Data Architecture

### Database: SQLite

**File Location:** `Backend/Backend.API/logistics.db`

### Entity Relationships

```
User (1) ←──────→ (0..1) Customer
Customer (1) ←──→ (N) Shipment
Shipment (1) ←──→ (N) Package
Shipment (1) ←──→ (N) TrackingEvent
Shipment (1) ←──→ (N) Document
Customer (1) ←──→ (N) Invoice
Invoice (1) ←──→ (N) InvoiceLineItem
InvoiceLineItem (N) ──→ (1) Shipment
PricingRule (standalone)
ContactForm (standalone)
Quote (1) ──→ (1) Customer (optional)
```

### EF Core Configuration

- Code-first approach
- Automatic migrations
- Auto-seeding on startup

---

## Authentication & Authorization

### JWT Configuration

```json
// appsettings.json
{
  "Jwt": {
    "Key": "[secret-key]",
    "Issuer": "ShippingAPI",
    "Audience": "ShippingClient",
    "ExpiryMinutes": 60
  }
}
```

### Role-Based Access

| Role | Permissions |
|------|-------------|
| Customer | Own shipments, quotes, invoices |
| Admin | All operations |
| Staff | Shipment management |

---

## Pricing Algorithm

```csharp
// PricingService.cs
public decimal CalculateShippingCost(
    decimal weight, 
    decimal distance, 
    ServiceType serviceType)
{
    var rule = GetActivePricingRule(serviceType);
    
    decimal cost = rule.BaseRate 
                 + (weight * rule.WeightRatePerKg)
                 + (distance * rule.DistanceRatePerKm);
    
    return Math.Max(cost, rule.MinimumCharge);
}
```

---

## Configuration

### appsettings.json Structure

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=logistics.db"
  },
  "Jwt": { /* JWT settings */ },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `ASPNETCORE_ENVIRONMENT` | Development/Production |
| `ASPNETCORE_URLS` | Server binding |
| `DB_PATH` | Database file path |
| `FRONTEND_URL` | CORS origin |

---

## Deployment

### Docker Configuration

```dockerfile
# Multi-stage build
# SDK image for build
# Runtime image for execution
# Exposes port 8080
```

### Production Considerations

- Migrate to SQL Server/PostgreSQL
- Configure proper JWT secrets
- Enable HTTPS
- Set up logging
- Configure rate limiting

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `Backend.API/Program.cs` | Application entry point |
| `Backend.Infrastructure/Data/AppDbContext.cs` | Database context |
| `Backend.Infrastructure/Data/DbSeeder.cs` | Initial data |
| `Backend.Infrastructure/Services/JwtTokenService.cs` | Token generation |
| `Backend.Infrastructure/Services/PricingService.cs` | Price calculation |
| `Backend.API/appsettings.json` | Configuration |


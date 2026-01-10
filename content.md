# Shipping Company Platform - Technical Specification

## 1. System Overview

A comprehensive shipping management platform for a single company with customer portal and admin dashboard capabilities.

### Core Requirements
- **Pricing**: Weight + Distance + Speed based calculation
- **Payment**: Invoice-based (B2B model)
- **Tracking**: Status milestone updates (no live GPS)
- **Deployment**: Single-tenant system
- **UI**: Responsive design (mobile & desktop)

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: React Query (TanStack Query) v5
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS + shadcn/ui or Material-UI
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Maps**: Leaflet or Google Maps React

### Backend
- **Framework**: .NET 9 (ASP.NET Core Web API)
- **Architecture**: Clean Architecture
- **ORM**: Entity Framework Core 9
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **API Documentation**: Swagger/OpenAPI

### Database
- **Development/Small Scale**: SQLite
- **Migration Path**: SQL Server/PostgreSQL ready via EF Core

### External Services
- **Payment Gateway**: Stripe (invoice generation)
- **Email Service**: SendGrid or AWS SES
- **Distance Calculation**: Google Distance Matrix API
- **SMS Notifications**: Twilio (optional)

---

## 3. Database Schema

### Core Entities

```sql
-- Users Table
CREATE TABLE Users (
    Id INTEGER PRIMARY KEY,
    Email TEXT UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    PhoneNumber TEXT,
    Role TEXT NOT NULL, -- Customer, Admin, Staff
    IsActive BOOLEAN DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME
);

-- Customers Table (Extended user info for customers)
CREATE TABLE Customers (
    Id INTEGER PRIMARY KEY,
    UserId INTEGER UNIQUE NOT NULL,
    CompanyName TEXT,
    TaxId TEXT,
    BillingAddress TEXT,
    ShippingAddress TEXT,
    CreditLimit DECIMAL(10,2) DEFAULT 0,
    CurrentBalance DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Shipments Table
CREATE TABLE Shipments (
    Id INTEGER PRIMARY KEY,
    TrackingNumber TEXT UNIQUE NOT NULL,
    CustomerId INTEGER NOT NULL,
    OriginAddress TEXT NOT NULL,
    OriginCity TEXT NOT NULL,
    OriginState TEXT NOT NULL,
    OriginZipCode TEXT NOT NULL,
    DestinationAddress TEXT NOT NULL,
    DestinationCity TEXT NOT NULL,
    DestinationState TEXT NOT NULL,
    DestinationZipCode TEXT NOT NULL,
    Status TEXT NOT NULL, -- Pending, PickedUp, InTransit, OutForDelivery, Delivered, Cancelled
    Weight DECIMAL(10,2) NOT NULL, -- in kg
    Distance DECIMAL(10,2), -- in km
    ServiceType TEXT NOT NULL, -- Standard, Express, Overnight
    EstimatedDeliveryDate DATETIME,
    ActualDeliveryDate DATETIME,
    SpecialInstructions TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);

-- Packages Table (multiple packages per shipment)
CREATE TABLE Packages (
    Id INTEGER PRIMARY KEY,
    ShipmentId INTEGER NOT NULL,
    Weight DECIMAL(10,2) NOT NULL,
    Length DECIMAL(10,2) NOT NULL,
    Width DECIMAL(10,2) NOT NULL,
    Height DECIMAL(10,2) NOT NULL,
    Description TEXT,
    FOREIGN KEY (ShipmentId) REFERENCES Shipments(Id)
);

-- Tracking Events Table
CREATE TABLE TrackingEvents (
    Id INTEGER PRIMARY KEY,
    ShipmentId INTEGER NOT NULL,
    Status TEXT NOT NULL,
    Location TEXT,
    Description TEXT,
    EventDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    FOREIGN KEY (ShipmentId) REFERENCES Shipments(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Invoices Table
CREATE TABLE Invoices (
    Id INTEGER PRIMARY KEY,
    InvoiceNumber TEXT UNIQUE NOT NULL,
    CustomerId INTEGER NOT NULL,
    IssueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    DueDate DATETIME NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    TaxAmount DECIMAL(10,2) DEFAULT 0,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status TEXT NOT NULL, -- Draft, Sent, Paid, Overdue, Cancelled
    PaidDate DATETIME,
    PaymentMethod TEXT,
    Notes TEXT,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);

-- Invoice Line Items Table
CREATE TABLE InvoiceLineItems (
    Id INTEGER PRIMARY KEY,
    InvoiceId INTEGER NOT NULL,
    ShipmentId INTEGER NOT NULL,
    Description TEXT NOT NULL,
    Quantity INTEGER DEFAULT 1,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (InvoiceId) REFERENCES Invoices(Id),
    FOREIGN KEY (ShipmentId) REFERENCES Shipments(Id)
);

-- Pricing Rules Table
CREATE TABLE PricingRules (
    Id INTEGER PRIMARY KEY,
    ServiceType TEXT NOT NULL, -- Standard, Express, Overnight
    BaseRate DECIMAL(10,2) NOT NULL,
    WeightRatePerKg DECIMAL(10,2) NOT NULL,
    DistanceRatePerKm DECIMAL(10,2) NOT NULL,
    MinimumCharge DECIMAL(10,2) NOT NULL,
    IsActive BOOLEAN DEFAULT 1,
    EffectiveFrom DATETIME NOT NULL,
    EffectiveTo DATETIME
);

-- Documents Table (shipping labels, invoices, customs)
CREATE TABLE Documents (
    Id INTEGER PRIMARY KEY,
    ShipmentId INTEGER NOT NULL,
    DocumentType TEXT NOT NULL, -- Label, Invoice, Customs, POD
    FileName TEXT NOT NULL,
    FilePath TEXT NOT NULL,
    FileSize INTEGER,
    UploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UploadedBy INTEGER,
    FOREIGN KEY (ShipmentId) REFERENCES Shipments(Id),
    FOREIGN KEY (UploadedBy) REFERENCES Users(Id)
);
```

---

## 4. Backend Architecture (.NET 9 Clean Architecture)

### Project Structure

```
ShippingCompany.Solution/
│
├── src/
│   ├── ShippingCompany.Domain/
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Shipment.cs
│   │   │   ├── Package.cs
│   │   │   ├── Invoice.cs
│   │   │   ├── TrackingEvent.cs
│   │   │   └── PricingRule.cs
│   │   ├── ValueObjects/
│   │   │   ├── Address.cs
│   │   │   ├── TrackingNumber.cs
│   │   │   └── Money.cs
│   │   ├── Enums/
│   │   │   ├── ShipmentStatus.cs
│   │   │   ├── ServiceType.cs
│   │   │   ├── InvoiceStatus.cs
│   │   │   └── UserRole.cs
│   │   ├── Interfaces/
│   │   │   └── IRepository.cs
│   │   └── Events/
│   │       ├── ShipmentCreatedEvent.cs
│   │       └── StatusUpdatedEvent.cs
│   │
│   ├── ShippingCompany.Application/
│   │   ├── DTOs/
│   │   │   ├── Shipments/
│   │   │   │   ├── CreateShipmentDto.cs
│   │   │   │   ├── ShipmentResponseDto.cs
│   │   │   │   └── UpdateStatusDto.cs
│   │   │   ├── Customers/
│   │   │   ├── Invoices/
│   │   │   └── Quotes/
│   │   ├── UseCases/
│   │   │   ├── Shipments/
│   │   │   │   ├── CreateShipmentUseCase.cs
│   │   │   │   ├── UpdateShipmentStatusUseCase.cs
│   │   │   │   ├── GetShipmentByTrackingUseCase.cs
│   │   │   │   └── CancelShipmentUseCase.cs
│   │   │   ├── Quotes/
│   │   │   │   └── CalculateQuoteUseCase.cs
│   │   │   ├── Invoices/
│   │   │   │   ├── GenerateInvoiceUseCase.cs
│   │   │   │   └── GetCustomerInvoicesUseCase.cs
│   │   │   └── Auth/
│   │   │       ├── LoginUseCase.cs
│   │   │       └── RegisterCustomerUseCase.cs
│   │   ├── Interfaces/
│   │   │   ├── IDistanceService.cs
│   │   │   ├── IPricingService.cs
│   │   │   ├── IEmailService.cs
│   │   │   └── IPaymentService.cs
│   │   ├── Validators/
│   │   │   └── CreateShipmentValidator.cs
│   │   └── Mappings/
│   │       └── MappingProfile.cs
│   │
│   ├── ShippingCompany.Infrastructure/
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── ShipmentRepository.cs
│   │   │   │   ├── CustomerRepository.cs
│   │   │   │   └── InvoiceRepository.cs
│   │   │   └── Migrations/
│   │   ├── Services/
│   │   │   ├── GoogleDistanceService.cs
│   │   │   ├── PricingService.cs
│   │   │   ├── SendGridEmailService.cs
│   │   │   ├── StripePaymentService.cs
│   │   │   └── TrackingNumberGenerator.cs
│   │   └── Authentication/
│   │       └── JwtTokenService.cs
│   │
│   └── ShippingCompany.API/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── ShipmentsController.cs
│       │   ├── CustomersController.cs
│       │   ├── InvoicesController.cs
│       │   ├── QuotesController.cs
│       │   └── TrackingController.cs
│       ├── Middleware/
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── JwtMiddleware.cs
│       ├── Program.cs
│       └── appsettings.json
│
└── tests/
    ├── ShippingCompany.Domain.Tests/
    ├── ShippingCompany.Application.Tests/
    └── ShippingCompany.API.Tests/
```

### Key Backend Components

#### Pricing Service Algorithm
```csharp
public class PricingService : IPricingService
{
    public async Task<decimal> CalculateShippingCost(
        decimal weight, 
        decimal distance, 
        ServiceType serviceType)
    {
        var pricingRule = await GetActivePricingRule(serviceType);
        
        decimal cost = pricingRule.BaseRate 
                     + (weight * pricingRule.WeightRatePerKg)
                     + (distance * pricingRule.DistanceRatePerKm);
        
        return Math.Max(cost, pricingRule.MinimumCharge);
    }
}
```

---

## 5. Frontend Architecture (React + TypeScript)

### Project Structure

```
shipping-frontend/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── shipments/
│   │   │   ├── ShipmentList.tsx
│   │   │   ├── ShipmentDetails.tsx
│   │   │   ├── CreateShipmentForm.tsx
│   │   │   ├── TrackingTimeline.tsx
│   │   │   └── ShipmentStatusBadge.tsx
│   │   ├── quotes/
│   │   │   ├── QuoteCalculator.tsx
│   │   │   └── QuoteResult.tsx
│   │   ├── invoices/
│   │   │   ├── InvoiceList.tsx
│   │   │   └── InvoiceDetails.tsx
│   │   └── tracking/
│   │       ├── TrackingSearch.tsx
│   │       └── TrackingMap.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── customer/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MyShipments.tsx
│   │   │   ├── NewShipment.tsx
│   │   │   ├── Invoices.tsx
│   │   │   └── Profile.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AllShipments.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Invoicing.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Settings.tsx
│   │   ├── public/
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── GetQuote.tsx
│   │   │   ├── TrackShipment.tsx
│   │   │   └── Contact.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useShipments.ts
│   │   ├── useInvoices.ts
│   │   └── useQuote.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts (axios instance)
│   │   │   ├── authApi.ts
│   │   │   ├── shipmentsApi.ts
│   │   │   ├── customersApi.ts
│   │   │   ├── invoicesApi.ts
│   │   │   └── quotesApi.ts
│   │   └── queryClient.ts (React Query config)
│   │
│   ├── types/
│   │   ├── shipment.types.ts
│   │   ├── customer.types.ts
│   │   ├── invoice.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── store/
│   │   └── authStore.ts (Zustand for auth state)
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### React Query Setup

```typescript
// queryClient.ts
export const queryKeys = {
  shipments: {
    all: ['shipments'] as const,
    lists: () => [...queryKeys.shipments.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.shipments.lists(), filters] as const,
    details: () => [...queryKeys.shipments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.shipments.details(), id] as const,
    tracking: (trackingNumber: string) => ['shipments', 'tracking', trackingNumber] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    customer: (customerId: string) => ['invoices', 'customer', customerId] as const,
  },
  quotes: ['quotes'] as const,
};
```

---

## 6. API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Shipments
- `GET /api/shipments` - List shipments (filtered by customer for customer role)
- `GET /api/shipments/{id}` - Get shipment details
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/{id}` - Update shipment
- `PUT /api/shipments/{id}/status` - Update status
- `DELETE /api/shipments/{id}` - Cancel shipment
- `GET /api/shipments/{id}/tracking` - Get tracking history

### Tracking (Public)
- `GET /api/tracking/{trackingNumber}` - Track by tracking number

### Quotes
- `POST /api/quotes/calculate` - Calculate shipping quote

### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/{id}` - Get invoice details
- `POST /api/invoices/generate` - Generate invoice for shipments
- `PUT /api/invoices/{id}/mark-paid` - Mark invoice as paid

### Customers (Admin only)
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer details
- `PUT /api/customers/{id}` - Update customer
- `GET /api/customers/{id}/shipments` - Customer's shipments
- `GET /api/customers/{id}/invoices` - Customer's invoices

---

## 7. Features Breakdown

### Phase 1: MVP (Weeks 1-4)
- User authentication (JWT)
- Customer registration and profile
- Basic admin dashboard
- Create shipment (customer & admin)
- Shipment list and details view
- Simple quote calculator
- Tracking by tracking number (public)
- Status milestone updates

### Phase 2: Core Features (Weeks 5-8)
- Invoice generation system
- Invoice management (list, view, mark paid)
- Email notifications (shipment created, status updates)
- Document upload (shipping labels)
- Advanced quote calculator with all factors
- Customer dashboard with statistics
- Admin reports (shipments, revenue)

### Phase 3: Enhancement (Weeks 9-12)
- Payment gateway integration (Stripe)
- PDF generation (invoices, labels)
- Advanced search and filtering
- Export functionality (CSV, PDF)
- Customer credit management
- Rate limiting and API security
- Comprehensive admin analytics
- Mobile responsiveness polish

---

## 8. Security Considerations

- JWT with refresh token rotation
- Role-based authorization (Customer, Admin, Staff)
- Rate limiting on API endpoints
- SQL injection prevention (EF Core parameterized queries)
- XSS protection (React auto-escaping + CSP headers)
- CORS configuration
- HTTPS only in production
- Password hashing (BCrypt/Argon2)
- Input validation on both frontend and backend
- Audit logging for sensitive operations

---

## 9. Deployment Strategy

### Development
- SQLite database
- Local development with hot reload
- Docker Compose for consistent environment

### Production
- Consider migrating to PostgreSQL/SQL Server
- Deploy backend to Azure App Service / AWS Elastic Beanstalk
- Deploy frontend to Vercel / Netlify / Azure Static Web Apps
- Use Azure Blob Storage / AWS S3 for document storage
- Environment-based configuration

---

## 10. Next Steps

1. **Setup Projects**: Initialize .NET solution and React app
2. **Database First**: Create EF Core models and migrations
3. **Authentication**: Implement JWT auth on backend and frontend
4. **Core Use Case**: Build create shipment flow end-to-end
5. **Iterate**: Add features incrementally following the phases

## color palette

- FEB05D -  orange
- 2B2A2A - black
- F5F2F2 - white
---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-foundation', 'step-04-decisions']
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'doc.md'
  - 'Frontend/README.md'
  - 'Frontend/QUICKSTART.md'
  - 'codebase-analysis-comprehensive'
workflowType: 'architecture'
project_name: 'New_Emarald_Frinters'
user_name: 'Anushanga Kaluarachch'
date: '2026-01-31'
---

# Architecture Decision Document - New Emarald Frinters

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements Summary:**

The New Emarald Frinters platform encompasses **75 functional requirements** organized into 11 capability areas, defining a comprehensive B2B freight forwarding management system:

1. **User Management & Authentication (7 FRs)** - Customer registration, JWT-based login, role-based access control (Customer/Admin/Staff), password reset, session management
2. **Quote Management (6 FRs)** - Public quote calculator, multi-factor pricing (origin/destination/weight/dimensions), Google Distance Matrix integration, multi-currency display (LKR/USD), sub-3-second response time
3. **Shipment Management (10 FRs)** - Customer shipment creation, history and search, status updates (Pending→Processing→InTransit→OutForDelivery→Delivered/Cancelled), admin oversight, business rule validation
4. **Tracking System (6 FRs)** - Public tracking without authentication, status timeline display, real-time updates, estimated delivery dates, customer-friendly presentation
5. **Invoice Management (9 FRs)** - Automatic generation from completed shipments, PDF downloads, payment status tracking, customer/admin views, manual invoice creation capability
6. **Notification System (8 FRs)** - Email notifications for shipment events (created, status changes, delivered), admin alerts, SendGrid/AWS SES integration, queue-based delivery
7. **Document Management (6 FRs)** - Shipment document storage, proof of delivery uploads, secure access control, file type/size validation
8. **Admin Dashboard (6 FRs)** - Real-time metrics, recent activity, pending actions, revenue analytics, report exports
9. **Customer Dashboard (6 FRs)** - Active shipments display, recent quotes, unpaid invoices, quick action shortcuts
10. **Customer Management (5 FRs)** - Admin customer views, search/filter, profile and history access, account deactivation
11. **System Configuration & Pricing (6 FRs)** - Pricing rule configuration, rate tables, origin/destination management, audit logs, Sri Lankan localization (phone formats, ports, LKR currency)

**Non-Functional Requirements:**

**Performance Requirements:**
- Page load times: <2 seconds on standard broadband
- Quote calculations: <3 seconds including external API calls
- Dashboard data loading: <1.5 seconds
- Search/filter operations: <1 second for datasets up to 10,000 records
- Concurrent user support: 50 users without degradation, 100 users with <20% degradation

**Security Requirements:**
- Authentication: JWT Bearer tokens with bcrypt password hashing (work factor 10+)
- Authorization: Role-based access control enforced at API and data levels
- Data protection: TLS 1.2+ in transit, encrypted at rest in production
- Access control: Customers see only their own data; admin access logged for audit
- Public endpoints: Rate-limited to prevent abuse
- Compliance: GDPR-ready (data export/deletion), audit trails for financial transactions

**Scalability Requirements:**
- Phase 1 (Current): 80 active customers, 300 shipments/month
- Phase 2 Target: 150 customers, 1,000 shipments/quarter
- Phase 3 Vision: 500+ customers, 5,000+ shipments/quarter
- Database: PostgreSQL for production (supports horizontal read scaling, connection pooling)
- API: Stateless design enables horizontal scaling
- File storage: Cloud object storage scales independently

**Accessibility Requirements:**
- WCAG 2.1 Level AA compliance target
- Keyboard navigation for all interactive elements
- Color contrast ratios: 4.5:1 (normal text), 3:1 (large text/UI)
- Screen reader compatibility (NVDA, JAWS)
- Responsive design: Mobile-first with breakpoints at 640px, 768px, 1024px, 1280px
- Touch targets: Minimum 44x44px for mobile

**Integration Requirements:**
- Google Distance Matrix API: Distance calculation with error handling and fallback
- Email Service: SendGrid or AWS SES with queue-based delivery and retry logic
- Payment Gateway: Stripe integration architecture (Phase 3) with PCI DSS compliance via tokenization
- Currency Conversion: Real-time or cached LKR/USD rates

**Reliability Requirements:**
- Uptime target: 99.5% during business hours (7 AM - 10 PM Sri Lanka time)
- Data integrity: Zero data loss for shipments, customers, invoices
- Backup strategy: Daily automated backups, 30-day retention, 4-hour recovery time objective
- Error handling: User-friendly messages, server error logging, critical error admin notifications
- Graceful degradation: Non-critical feature failures don't break core functionality

### Implementation Status (Brownfield Context)

**Currently Implemented (Phases 1 & 2):**
- ✅ Clean Architecture backend (.NET 10, 4 layers: Domain, Application, Infrastructure, API)
- ✅ React 19 + TypeScript frontend (14 pages: 8 public, 2 auth, 2 customer, 2 admin)
- ✅ JWT authentication with role-based authorization (Customer, Admin, Staff)
- ✅ 11 domain entities with EF Core (User, Customer, Shipment, Package, TrackingEvent, Invoice, InvoiceLineItem, PricingRule, Document, Quote, ContactForm)
- ✅ 5 REST API controllers (Auth, Shipments, Quotes, Tracking, Contact)
- ✅ Complex pricing engine (base rate + weight + distance + service type + cargo surcharge + container multiplier)
- ✅ Customer and Admin dashboards with real-time statistics
- ✅ Public shipment tracking (no authentication required)
- ✅ SQLite database with seeding (development/prototype)
- ✅ Docker containerization (Frontend nginx + Backend API)

**Architectural Gaps Requiring Decisions:**
- ⚠️ **Database**: PostgreSQL production setup (migration from SQLite)
- ⚠️ **Distance Calculation**: Google Distance Matrix API integration (currently mocked with random values)
- ⚠️ **Email Notifications**: SendGrid/AWS SES service implementation (interface defined, not implemented)
- ⚠️ **Document Storage**: Cloud storage strategy (Azure Blob Storage or AWS S3)
- ⚠️ **Payment Gateway**: Stripe integration architecture (Phase 3)
- ⚠️ **Input Validation**: Backend validation strategy (FluentValidation not added)
- ⚠️ **Rate Limiting**: API protection against abuse
- ⚠️ **Audit Logging**: Financial transaction and admin action logging
- ⚠️ **Caching**: Strategy for performance optimization (pricing rules, currency conversion)
- ⚠️ **Real-time Updates**: WebSocket vs polling for shipment status updates

### Scale & Complexity Assessment

**Overall Complexity: MEDIUM-HIGH**

**Primary Technical Domain:** Full-Stack Web Application (B2B SaaS-style platform for single freight forwarding company)

**Complexity Drivers:**

1. **Integration Complexity: HIGH**
   - External API dependencies: Google Distance Matrix (critical path), email service, payment gateway
   - Failure handling: Timeouts, retries, circuit breakers, fallback mechanisms
   - API rate limiting and quota management
   - Webhook handling for async payment events (future)

2. **Business Logic Complexity: MEDIUM-HIGH**
   - Multi-factor pricing algorithm with 6+ variables
   - Service-specific pricing rules (Standard/Express/Overnight, Sea FCL/LCL, Air, Land)
   - Cargo type surcharges (10 categories: 0-35% markup)
   - Container size multipliers (20ft, 40ft, 40HC, 45HC)
   - Region-based distance estimation
   - Invoice generation with shipment grouping by customer
   - Status transition validation (business rule enforcement)

3. **Data Complexity: MEDIUM**
   - 11 interconnected entities with foreign key relationships
   - Pricing rules with date-effective ranges
   - Multi-currency support (LKR primary, USD secondary)
   - Audit trail requirements for financial data
   - Document storage with access control

4. **User Interaction Complexity: MEDIUM**
   - Multi-step quote calculator (3 steps)
   - Real-time dashboard updates
   - Public tracking with rich timeline visualization
   - Role-based UI rendering (Customer vs Admin views)
   - Form validation with real-time feedback
   - Responsive design across mobile/tablet/desktop

5. **Security & Compliance: MEDIUM**
   - Role-based access control (3 roles with different permissions)
   - Data-level authorization (customers see only their data)
   - Public endpoint security (tracking without auth)
   - GDPR compliance requirements (data export, deletion, consent)
   - Audit logging for compliance
   - Future PCI DSS compliance for payment processing

**Estimated Architectural Components:**

- **Frontend Modules:** 10 feature areas (Auth, Quotes, Shipments, Tracking, Invoices, Notifications, Documents, Customer Dashboard, Admin Dashboard, Reports)
- **Backend Aggregates:** 11 domain entities (clean architecture domain layer)
- **Application Services:** 8+ use cases (CreateShipment, UpdateStatus, CalculateQuote, GenerateInvoice, SendNotification, etc.)
- **Infrastructure Services:** 6+ external integrations (Database, Distance API, Email, Storage, Payment, Logging)
- **API Endpoints:** 25+ REST endpoints across 5+ controllers

### Technical Constraints & Dependencies

**Technology Stack (Implemented):**
- Backend: .NET 10 (ASP.NET Core Web API), Entity Framework Core 10
- Frontend: React 19, TypeScript, Vite, TanStack Query v5, React Router v6
- UI: Tailwind CSS, shadcn/ui (Radix UI primitives)
- Database: SQLite (development) → **PostgreSQL (production)**
- Authentication: JWT Bearer tokens, BCrypt.Net-Next 4.0.3
- Documentation: Swagger/OpenAPI (Swashbuckle)
- Containerization: Docker + Docker Compose

**External Service Dependencies:**
1. **Google Distance Matrix API** (Critical)
   - Purpose: Calculate shipping distances between origin and destination
   - Impact: Quote calculator depends on accurate distance for pricing
   - Constraint: API quotas, rate limits, cost per request
   - Fallback: Region-based estimation or manual distance entry

2. **Email Service: SendGrid or AWS SES** (High Priority)
   - Purpose: Transactional emails (shipment notifications, status updates, invoice delivery)
   - Constraint: Delivery rate limits, sender reputation, bounce handling
   - Requirement: Template management, queue-based async processing

3. **Cloud Storage: Azure Blob Storage or AWS S3** (Medium Priority)
   - Purpose: Document storage (shipping labels, proof of delivery, customs docs, invoice PDFs)
   - Constraint: Storage costs, access control, CDN delivery
   - Requirement: Secure file upload, size/type validation, role-based access

4. **Payment Gateway: Stripe** (Phase 3, Low Current Priority)
   - Purpose: Online invoice payment processing
   - Constraint: PCI DSS compliance, webhook handling, currency support
   - Requirement: Tokenized payment (no card storage), payment intent flow

**Database: PostgreSQL**
- **Migration Path:** SQLite (current) → PostgreSQL (production)
- **Justification:**
  - Concurrent user support (50-100+ users)
  - Production reliability and ACID guarantees
  - Advanced indexing and query optimization
  - Connection pooling for performance
  - Horizontal read scaling capability
  - Better handling of 10,000+ shipment records
- **Migration Considerations:**
  - EF Core migrations tested against PostgreSQL
  - Connection string configuration for production
  - Index strategy for common queries (tracking number, customer ID, date ranges)
  - Connection pooling configuration (Npgsql)

**Localization Requirements (Sri Lankan Market):**
- Currency: LKR (Sri Lankan Rupee) as primary, USD as secondary
- Phone format: +94 (Sri Lanka country code)
- Ports: Colombo, Hambantota, Trincomalee, Galle (hardcoded in constants)
- Time zone: UTC+5:30 (Sri Lanka time)
- Future multi-language: English (primary), Sinhala, Tamil (i18next infrastructure ready)

**Deployment Constraints:**
- Frontend: Static hosting (Vercel, Netlify, Azure Static Web Apps)
- Backend: Cloud platform (Azure App Service, AWS Elastic Beanstalk, or containerized deployment)
- Database: Managed PostgreSQL (Azure Database for PostgreSQL, AWS RDS, or DigitalOcean)
- File Storage: Cloud object storage (Azure Blob, AWS S3)

### Cross-Cutting Concerns Identified

These concerns affect multiple architectural components and require consistent implementation patterns:

1. **Authentication & Authorization**
   - JWT token generation, validation, and refresh
   - Role-based access control (Customer, Admin, Staff)
   - Protected route components (frontend)
   - Authorize attributes (backend controllers)
   - Data-level authorization (customers access only their data)
   - Public endpoint security (tracking by tracking number)

2. **External API Integration Patterns**
   - Resilient HTTP client configuration (timeouts, retries, circuit breakers)
   - Error handling for API failures (graceful degradation)
   - Rate limiting and quota management
   - Fallback strategies when APIs unavailable
   - Cost optimization (caching, request batching)

3. **Email Notification System**
   - Queue-based asynchronous processing (avoid blocking API requests)
   - Template management (shipment created, status updated, delivered, invoice sent)
   - Retry logic for failed deliveries
   - Bounce and complaint handling
   - Delivery status tracking

4. **Document Storage & Access Control**
   - Cloud storage integration (upload, download, delete)
   - File type and size validation
   - Role-based access (customers see only their documents, admin sees all)
   - Secure URL generation (pre-signed URLs with expiration)
   - Document association with shipments

5. **Error Handling & Logging**
   - Global error boundary (React frontend)
   - Axios interceptor for API errors (frontend)
   - Exception middleware (backend)
   - Structured logging (JSON format for log aggregation)
   - User-friendly error messages (no technical jargon)
   - Admin alerts for critical errors

6. **Audit Trails & Compliance**
   - Financial transaction logging (invoice creation, payment recording)
   - Shipment status change history (who updated, when, from/to status)
   - Admin action logging (customer edits, pricing changes)
   - GDPR compliance (data export, deletion workflows)
   - Audit log retention (30 days minimum)

7. **Database Migration Strategy**
   - EF Core provider abstraction (SQLite → PostgreSQL)
   - Migration testing in staging environment
   - Index optimization for PostgreSQL
   - Connection pooling configuration
   - Query performance monitoring

8. **Multi-Currency Support**
   - Currency conversion (LKR ↔ USD)
   - Conversion rate management (hardcoded vs API)
   - Display formatting (currency symbols, decimal places)
   - Invoice currency selection
   - Pricing rule currency consistency

9. **Public vs Authenticated Access Security**
   - Public tracking endpoint (no authentication)
   - Rate limiting on public endpoints (prevent abuse)
   - Protected customer and admin endpoints (JWT required)
   - CORS configuration for frontend domains
   - API key consideration for external integrations (future)

10. **Performance Optimization**
    - API response caching (pricing rules, common routes)
    - Database query optimization (eager loading, indexing)
    - Frontend code splitting (route-based lazy loading)
    - React Query caching (server state management)
    - CDN for static assets (frontend)
    - Image optimization (WebP with fallbacks)

11. **Real-Time Updates**
    - Current: Polling with React Query auto-refetch (30-60 second intervals)
    - Future consideration: WebSocket or Server-Sent Events for instant status updates
    - Optimistic UI updates for admin actions
    - Stale-while-revalidate pattern

12. **Input Validation**
    - Frontend: Zod schemas with React Hook Form (implemented)
    - Backend: Need consistent validation strategy (FluentValidation recommended)
    - Validation error formatting (consistent structure)
    - Business rule validation (status transitions, date constraints)

---

### Architecture Decision Scope

Based on this context analysis, the architecture document will address:

1. **System Architecture Pattern** - Clean Architecture layer implementation and boundaries
2. **Database Architecture** - PostgreSQL schema design, migration strategy, indexing
3. **API Design** - REST endpoint patterns, versioning, error responses
4. **Authentication & Authorization** - JWT implementation, token refresh, role enforcement
5. **External Service Integration** - Google Distance Matrix, Email, Storage, Payment gateway
6. **Frontend Architecture** - Component structure, state management, routing patterns
7. **Cross-Cutting Concerns** - Logging, error handling, validation, caching strategies
8. **Scalability Strategy** - Horizontal scaling, database optimization, caching layers
9. **Security Architecture** - Data protection, access control, compliance requirements
10. **Deployment Architecture** - Containerization, cloud platform, CI/CD considerations

## Technical Foundation (Brownfield Analysis)

### Primary Technology Domain

**Full-Stack Web Application** - B2B SaaS-style freight forwarding management platform

This is a **brownfield project** with an operational MVP. The technical stack is already established and running.

### Current Technical Stack

**Backend Technology:**
- **Framework:** .NET 10 (ASP.NET Core Web API)
- **Architecture Pattern:** Clean Architecture with 4 layers
  - Domain Layer: Pure business entities and enums (11 entities)
  - Application Layer: DTOs, interfaces, use case orchestration
  - Infrastructure Layer: Data access (EF Core), external services, repositories
  - API Layer: 5 REST controllers, middleware, HTTP concerns
- **ORM:** Entity Framework Core 10
- **Database:** SQLite (development) → PostgreSQL (production target)
- **Authentication:** JWT Bearer tokens
- **Password Hashing:** BCrypt.Net-Next 4.0.3 (work factor 10+)
- **API Documentation:** Swagger/OpenAPI via Swashbuckle.AspNetCore 6.9.0

**Frontend Technology:**
- **Framework:** React 19 with TypeScript (strict mode)
- **Build Tool:** Vite with rolldown-vite 7.2.5
- **State Management:**
  - Server state: TanStack Query (React Query) v5.12.2
  - Client state: Minimal (auth in localStorage)
- **Routing:** React Router v6.20.0
- **UI Library:** Tailwind CSS 3.3.6 + shadcn/ui (Radix UI primitives)
- **Form Handling:** React Hook Form 7.48.2 + Zod validation
- **HTTP Client:** Axios 1.6.2 with interceptors
- **Data Tables:** ag-grid-react 35.0.0
- **Internationalization:** i18next 23.7.6 (infrastructure ready)
- **Mapping:** Leaflet 1.9.4 (installed, not yet integrated)

**Development & Deployment:**
- **Containerization:** Docker + Docker Compose
- **Version Control:** Git (branch: ak-edition-01, main: main)

### Architectural Decisions Established by Existing Implementation

**1. Backend Architecture: Clean Architecture Pattern**

**Decision:** Four-layer Clean Architecture with clear dependency rules

**Implementation:**
- **Domain Layer** (`Backend.Domain/`): Pure business logic, no external dependencies
  - 11 entities: User, Customer, Shipment, Package, TrackingEvent, Invoice, InvoiceLineItem, PricingRule, Document, Quote, ContactForm
  - 6 enums: ShipmentStatus, ServiceType, InvoiceStatus, UserRole, etc.
  - Value objects for domain concepts

- **Application Layer** (`Backend.Application/`): Business orchestration
  - DTOs for data transfer
  - Service interfaces (IAuthService, IPricingService, IDistanceService, IEmailService)
  - Use case coordination

- **Infrastructure Layer** (`Backend.Infrastructure/`): External concerns
  - AppDbContext with EF Core
  - Repository implementations
  - Service implementations (JwtTokenService, PricingService, TrackingNumberGenerator)
  - Database seeding (DbSeeder)

- **API Layer** (`Backend.API/`): HTTP interface
  - 5 controllers: Auth, Shipments, Quotes, Tracking, Contact
  - Middleware for exception handling
  - Program.cs for dependency injection

**Rationale:** Clean separation enables testability, maintainability, and database provider independence

**2. Authentication & Authorization Strategy**

**Decision:** JWT Bearer tokens with role-based authorization

**Implementation:**
- JWT token generation with claims (userId, email, role)
- BCrypt password hashing (secure, industry-standard)
- Role-based authorization attributes: `[Authorize(Roles = "Admin,Staff")]`
- Token stored in localStorage on frontend
- Axios interceptor for automatic token attachment
- Public endpoints for tracking: `[AllowAnonymous]`

**Rationale:** Stateless authentication enables horizontal scaling; RBAC provides fine-grained access control

**3. Frontend State Management Strategy**

**Decision:** TanStack Query for server state, minimal client state

**Implementation:**
- Server state: TanStack Query with automatic caching and refetch (30-60 second intervals)
- Client state: Auth token in localStorage, minimal global state
- No Redux/MobX/Zustand for global state management
- Optimistic UI updates for admin status changes

**Rationale:** React Query handles server state complexity; simple client state reduces overhead and improves performance

**4. API Design Pattern**

**Decision:** RESTful API with conventional HTTP verbs and role-based protection

**Implementation:**
- RESTful endpoints: GET, POST, PUT, DELETE
- Role-based endpoint protection with `[Authorize]` attributes
- Public endpoints for tracking (no auth required)
- Swagger/OpenAPI documentation auto-generated
- Consistent error response format

**Rationale:** RESTful design is well-understood, self-documenting with Swagger, and aligns with HTTP semantics

**5. Database Access Pattern**

**Decision:** Entity Framework Core with code-first approach

**Implementation:**
- EF Core 10 with provider abstraction (SQLite → PostgreSQL ready)
- Code-first database schema via `AppDbContext`
- `Database.EnsureCreatedAsync()` for development (no explicit migrations yet)
- Async/await throughout for non-blocking I/O
- Repository pattern in Infrastructure layer

**Rationale:** EF Core abstracts database provider, enabling easy migration from SQLite to PostgreSQL

**6. UI Component Strategy**

**Decision:** shadcn/ui component library with Tailwind CSS

**Implementation:**
- shadcn/ui: Copy/paste components (full ownership, no npm dependency)
- Tailwind CSS: Utility-first styling (rapid development)
- Radix UI primitives: Accessible, unstyled component foundations
- Responsive mobile-first design with breakpoints: 640px, 768px, 1024px, 1280px

**Rationale:** Full component ownership, accessibility built-in, consistent design system, rapid iteration

**7. Form Handling Strategy**

**Decision:** React Hook Form with Zod validation

**Implementation:**
- React Hook Form: Performant, minimal re-renders
- Zod schemas: Type-safe runtime validation
- Real-time validation feedback on blur/change
- Consistent error message formatting

**Rationale:** Excellent performance, TypeScript integration, declarative validation schemas

**8. Development Experience Setup**

**Decision:** Modern tooling for fast iteration

**Implementation:**
- TypeScript strict mode (frontend type safety)
- Vite hot module replacement (instant feedback)
- Docker Compose for local development (consistent environments)
- Swagger UI for API testing and documentation

**Rationale:** Fast feedback loops, type safety reduces bugs, containerization ensures consistency across team

### What This Foundation Provides

**Strengths of Current Stack:**

✅ **Modern & Current:** React 19, .NET 10, EF Core 10 - latest stable versions
✅ **Type Safety:** TypeScript (frontend) + C# (backend) - strong typing across stack
✅ **Scalable:** Stateless API design, PostgreSQL migration ready, horizontal scaling capable
✅ **Maintainable:** Clean Architecture, clear layer boundaries, separation of concerns
✅ **Performant:** Vite build optimization, TanStack Query caching, async backend operations
✅ **Developer Experience:** Hot reloading, Swagger docs, TypeScript intellisense, Docker dev environment
✅ **Production-Ready:** Docker containerization, JWT security, role-based access, operational MVP

**Architectural Patterns Established:**

✅ Dependency injection throughout backend
✅ Async/await for all I/O operations
✅ DTO pattern for API responses
✅ Repository pattern for data access
✅ Service layer for business logic
✅ Component-based UI with hooks
✅ Protected routes on frontend
✅ Axios interceptors for cross-cutting HTTP concerns

### Architectural Gaps Requiring Decisions

The technical foundation is solid and operational. The following areas need architectural decisions for consistent implementation:

**Critical Priority:**
1. **PostgreSQL Migration Strategy** - EF Core migration from SQLite to PostgreSQL for production
2. **Google Distance Matrix API Integration** - Distance calculation service pattern (currently mocked)
3. **Email Notification Service** - SendGrid/AWS SES integration with queue-based processing

**High Priority:**
4. **Document Storage Strategy** - Azure Blob Storage or AWS S3 integration pattern
5. **Error Handling & Logging** - Global error handling, structured logging, log aggregation
6. **Input Validation** - Backend validation strategy (FluentValidation consideration)

**Medium Priority:**
7. **Caching Strategy** - Performance optimization for pricing rules, routes, currency conversion
8. **Rate Limiting** - API protection against abuse on public endpoints
9. **Audit Logging** - Compliance logging for financial transactions and admin actions
10. **Real-Time Updates** - WebSocket vs polling decision for shipment status updates

**Phase 3 (Future):**
11. **Payment Gateway Integration** - Stripe integration architecture with webhook handling
12. **Advanced Analytics** - Reporting and business intelligence patterns

### Architecture Document Approach

Since this is a brownfield project with established patterns, this architecture document will:

1. ✅ **Document existing architectural patterns** for AI agent consistency
2. ✅ **Make decisions for architectural gaps** (external services, storage, logging, etc.)
3. ✅ **Establish integration patterns** for external APIs
4. ✅ **Define migration strategy** for SQLite → PostgreSQL
5. ✅ **Formalize cross-cutting concerns** (error handling, logging, caching, validation)
6. ✅ **Provide implementation guidance** for consistent future development

**Goal:** Ensure AI agents understand existing patterns, maintain architectural consistency, and implement new features following established conventions.

## Core Architectural Decisions

### Decision Priority Framework

**Critical Decisions (Block Implementation Without):**
1. PostgreSQL Migration Strategy
2. Error Handling & Logging
3. Backend Input Validation

**Important Decisions (Shape Architecture Quality):**
4. Caching Strategy
5. Rate Limiting
6. Audit Logging
7. Real-Time Updates Approach

**Deferred Decisions (Phase 3):**
- Google Distance Matrix API integration (use regional estimation for now)
- Email notification service (manual process acceptable at current scale)
- Cloud document storage (local filesystem sufficient for Phase 1-2)
- Stripe payment gateway
- WebSocket real-time updates

---

### Decision 1: PostgreSQL Migration Strategy

**Status:** Critical - Immediate Implementation Required

**Decision:** Direct PostgreSQL adoption across all environments with Docker Compose

**Technical Implementation:**

**Package Installation:**
```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 9.0.0
```

**Docker Compose PostgreSQL Service:**
```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: logistics_db
      POSTGRES_USER: logistics_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dev_password}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U logistics_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Connection Configuration (appsettings.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=logistics_db;Username=logistics_user;Password=${DB_PASSWORD}"
  }
}
```

**Program.cs DbContext Registration:**
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions
            .EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null)
            .CommandTimeout(30)
    ));
```

**Migration Commands:**
```bash
# Create initial migration
dotnet ef migrations add InitialCreate --project Backend.Infrastructure --startup-project Backend.API

# Apply migration
dotnet ef database update --project Backend.Infrastructure --startup-project Backend.API

# Remove existing Database.EnsureCreatedAsync() from Program.cs
# Replace with: await context.Database.MigrateAsync();
```

**Index Strategy (AppDbContext.OnModelCreating):**
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Unique indexes
    modelBuilder.Entity<Shipment>()
        .HasIndex(s => s.TrackingNumber)
        .IsUnique()
        .HasDatabaseName("IX_Shipments_TrackingNumber");

    modelBuilder.Entity<Invoice>()
        .HasIndex(i => i.InvoiceNumber)
        .IsUnique()
        .HasDatabaseName("IX_Invoices_InvoiceNumber");

    // Performance indexes
    modelBuilder.Entity<Shipment>()
        .HasIndex(s => s.CustomerId)
        .HasDatabaseName("IX_Shipments_CustomerId");

    modelBuilder.Entity<Shipment>()
        .HasIndex(s => s.CreatedAt)
        .HasDatabaseName("IX_Shipments_CreatedAt");

    modelBuilder.Entity<Shipment>()
        .HasIndex(s => s.Status)
        .HasDatabaseName("IX_Shipments_Status");

    modelBuilder.Entity<TrackingEvent>()
        .HasIndex(t => new { t.ShipmentId, t.EventDate })
        .HasDatabaseName("IX_TrackingEvents_ShipmentId_EventDate");

    modelBuilder.Entity<Invoice>()
        .HasIndex(i => i.CustomerId)
        .HasDatabaseName("IX_Invoices_CustomerId");
}
```

**Connection Pooling Configuration:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=logistics_db;Username=logistics_user;Password=${DB_PASSWORD};Minimum Pool Size=5;Maximum Pool Size=100;Connection Lifetime=0;Connection Idle Lifetime=300"
  }
}
```

**Rationale:**
- PostgreSQL provides production-grade ACID compliance and concurrent user support (50-100+ users)
- Advanced indexing and query optimization for 10,000+ shipment records
- Connection pooling ensures efficient resource utilization
- EF Core migrations provide version control for database schema changes
- Using PostgreSQL in development ensures consistency and prevents SQLite dialect issues

**Implementation Priority:** Sprint 1 - Week 1

---

### Decision 2: Error Handling & Logging Strategy

**Status:** Critical - Immediate Implementation Required

**Decision:** Serilog structured logging with file output and global exception middleware

**Technical Implementation:**

**Package Installation:**
```bash
dotnet add package Serilog.AspNetCore --version 9.0.0
dotnet add package Serilog.Sinks.Console --version 6.0.0
dotnet add package Serilog.Sinks.File --version 6.0.0
```

**Program.cs Serilog Configuration:**
```csharp
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "NewEmaraldFrinters")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .Enrich.WithMachineName()
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.File(
            path: "logs/app-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
            retainedFileCountLimit: 30);
});

// Add request logging
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
    };
});
```

**Global Exception Middleware (Backend.API/Middleware/GlobalExceptionMiddleware.cs):**
```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger,
        IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error: {Errors}", string.Join(", ", ex.Errors));
            await HandleExceptionAsync(context, ex, StatusCodes.Status400BadRequest, "Validation failed", ex.Errors);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access attempt");
            await HandleExceptionAsync(context, ex, StatusCodes.Status403Forbidden, "Access denied");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex, StatusCodes.Status500InternalServerError,
                "An error occurred processing your request");
        }
    }

    private async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception,
        int statusCode,
        string message,
        object? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new
        {
            StatusCode = statusCode,
            Message = message,
            Errors = errors,
            Detail = _env.IsDevelopment() ? exception.StackTrace : null
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}

// Custom exception classes (Backend.Application/Exceptions/)
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

public class ValidationException : Exception
{
    public IEnumerable<string> Errors { get; }
    public ValidationException(IEnumerable<string> errors) : base("Validation failed")
    {
        Errors = errors;
    }
}
```

**Program.cs Middleware Registration:**
```csharp
app.UseMiddleware<GlobalExceptionMiddleware>();
```

**Frontend Error Handling (Already Implemented - Document Pattern):**
```typescript
// Axios error interceptor (src/services/api.ts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }

    // Log error for monitoring
    console.error('API Error:', error.response?.data || error.message);

    return Promise.reject(error);
  }
);

// React Error Boundary (wrap App component)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
```

**Rationale:**
- Serilog provides structured logging with rich context for debugging
- File-based logs with 30-day retention for audit and troubleshooting
- Global exception middleware ensures consistent error responses
- Custom exception types enable specific error handling
- Development mode provides stack traces for debugging

**Implementation Priority:** Sprint 1 - Week 1

---

### Decision 3: Backend Input Validation Strategy

**Status:** Critical - Immediate Implementation Required

**Decision:** FluentValidation for declarative, testable backend validation

**Technical Implementation:**

**Package Installation:**
```bash
dotnet add package FluentValidation.AspNetCore --version 11.3.0
```

**Program.cs Configuration:**
```csharp
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateShipmentDtoValidator>();
```

**Example Validators (Backend.Application/Validators/):**
```csharp
public class CreateShipmentDtoValidator : AbstractValidator<CreateShipmentDto>
{
    public CreateShipmentDtoValidator()
    {
        RuleFor(x => x.OriginAddress)
            .NotEmpty().WithMessage("Origin address is required")
            .MaximumLength(200).WithMessage("Origin address must not exceed 200 characters");

        RuleFor(x => x.DestinationAddress)
            .NotEmpty().WithMessage("Destination address is required")
            .MaximumLength(200).WithMessage("Destination address must not exceed 200 characters");

        RuleFor(x => x.Weight)
            .GreaterThan(0).WithMessage("Weight must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Weight must not exceed 10,000 kg");

        RuleFor(x => x.ServiceType)
            .IsInEnum().WithMessage("Invalid service type");

        RuleFor(x => x.Packages)
            .NotEmpty().WithMessage("At least one package is required")
            .Must(packages => packages.Count <= 50).WithMessage("Maximum 50 packages per shipment");

        RuleForEach(x => x.Packages)
            .SetValidator(new PackageDtoValidator());
    }
}

public class PackageDtoValidator : AbstractValidator<PackageDto>
{
    public PackageDtoValidator()
    {
        RuleFor(x => x.Weight)
            .GreaterThan(0).WithMessage("Package weight must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Package weight must not exceed 1,000 kg");

        RuleFor(x => x.Length)
            .GreaterThan(0).WithMessage("Length must be greater than 0")
            .LessThanOrEqualTo(500).WithMessage("Length must not exceed 500 cm");

        RuleFor(x => x.Width)
            .GreaterThan(0).WithMessage("Width must be greater than 0")
            .LessThanOrEqualTo(500).WithMessage("Width must not exceed 500 cm");

        RuleFor(x => x.Height)
            .GreaterThan(0).WithMessage("Height must be greater than 0")
            .LessThanOrEqualTo(500).WithMessage("Height must not exceed 500 cm");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}

public class UpdateShipmentStatusDtoValidator : AbstractValidator<UpdateShipmentStatusDto>
{
    public UpdateShipmentStatusDtoValidator()
    {
        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("Invalid shipment status");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1,000 characters");

        // Business rule validation
        RuleFor(x => x)
            .Must(dto => IsValidStatusTransition(dto.CurrentStatus, dto.NewStatus))
            .WithMessage("Invalid status transition");
    }

    private bool IsValidStatusTransition(ShipmentStatus current, ShipmentStatus next)
    {
        // Define allowed transitions
        return (current, next) switch
        {
            (ShipmentStatus.Pending, ShipmentStatus.Processing) => true,
            (ShipmentStatus.Processing, ShipmentStatus.InTransit) => true,
            (ShipmentStatus.InTransit, ShipmentStatus.OutForDelivery) => true,
            (ShipmentStatus.OutForDelivery, ShipmentStatus.Delivered) => true,
            (_, ShipmentStatus.Cancelled) => current != ShipmentStatus.Delivered,
            _ => false
        };
    }
}
```

**Controller Integration (Automatic):**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ShipmentsController : ControllerBase
{
    // FluentValidation runs automatically before action execution
    [HttpPost]
    public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentDto dto)
    {
        // If validation fails, returns 400 BadRequest with validation errors
        // If validation passes, continues execution
        // ...
    }
}
```

**Rationale:**
- Declarative validation rules are easy to read and maintain
- Type-safe validation with compile-time checking
- Composable validators enable reuse (PackageDtoValidator)
- Business rule validation (status transitions) in single location
- Automatic ASP.NET Core integration returns consistent 400 responses

**Implementation Priority:** Sprint 1 - Week 2

---

### Decision 4: Caching Strategy

**Status:** Important - Short-term Implementation

**Decision:** In-memory caching with IMemoryCache for frequently accessed data

**Technical Implementation:**

**Program.cs:**
```csharp
builder.Services.AddMemoryCache();
```

**Cached Pricing Service (Backend.Infrastructure/Services/CachedPricingService.cs):**
```csharp
public class CachedPricingService : IPricingService
{
    private readonly IPricingService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedPricingService> _logger;

    public CachedPricingService(
        IPricingService innerService,
        IMemoryCache cache,
        ILogger<CachedPricingService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<PricingRule> GetActivePricingRule(ServiceType serviceType)
    {
        var cacheKey = $"pricing-rule-{serviceType}";

        if (_cache.TryGetValue(cacheKey, out PricingRule? cachedRule))
        {
            _logger.LogDebug("Cache hit for pricing rule: {ServiceType}", serviceType);
            return cachedRule!;
        }

        _logger.LogDebug("Cache miss for pricing rule: {ServiceType}", serviceType);
        var rule = await _innerService.GetActivePricingRule(serviceType);

        _cache.Set(cacheKey, rule, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24),
            SlidingExpiration = TimeSpan.FromHours(6),
            Priority = CacheItemPriority.High
        });

        return rule;
    }

    public async Task<decimal> CalculateShippingCost(
        decimal weight,
        decimal distance,
        ServiceType serviceType)
    {
        // Get cached pricing rule
        var pricingRule = await GetActivePricingRule(serviceType);

        // Calculate cost using cached rule
        decimal cost = pricingRule.BaseRate
                     + (weight * pricingRule.WeightRatePerKg)
                     + (distance * pricingRule.DistanceRatePerKm);

        return Math.Max(cost, pricingRule.MinimumCharge);
    }

    public void InvalidatePricingCache(ServiceType serviceType)
    {
        var cacheKey = $"pricing-rule-{serviceType}";
        _cache.Remove(cacheKey);
        _logger.LogInformation("Invalidated pricing cache for {ServiceType}", serviceType);
    }
}
```

**Cache Invalidation (when pricing rules updated):**
```csharp
// In PricingController or PricingService
public async Task UpdatePricingRule(PricingRule rule)
{
    await _repository.UpdateAsync(rule);
    _cachedPricingService.InvalidatePricingCache(rule.ServiceType);
}
```

**Additional Caching Opportunities:**
- Regional distance estimates (24-hour cache)
- Currency conversion rates (6-hour cache)
- User role permissions (15-minute cache)

**Rationale:**
- In-memory cache is simple, fast, and sufficient for single-server deployment
- Pricing rules change infrequently, ideal for caching
- Sliding expiration ensures frequently accessed data stays cached
- Cache invalidation ensures consistency when rules change
- Future: Consider Redis for multi-server deployment

**Implementation Priority:** Sprint 2

---

### Decision 5: Rate Limiting Strategy

**Status:** Important - Short-term Implementation

**Decision:** AspNetCoreRateLimit middleware for public endpoint protection

**Technical Implementation:**

**Package Installation:**
```bash
dotnet add package AspNetCoreRateLimit --version 5.0.0
```

**appsettings.json:**
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "HttpStatusCode": 429,
    "QuotaExceededResponse": {
      "Content": "{ \"message\": \"Too many requests. Please try again later.\" }",
      "ContentType": "application/json"
    },
    "GeneralRules": [
      {
        "Endpoint": "GET:/api/tracking/*",
        "Period": "1m",
        "Limit": 20
      },
      {
        "Endpoint": "POST:/api/quotes/calculate",
        "Period": "1m",
        "Limit": 10
      },
      {
        "Endpoint": "POST:/api/auth/login",
        "Period": "5m",
        "Limit": 5
      },
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 60
      }
    ]
  }
}
```

**Program.cs:**
```csharp
builder.Services.AddMemoryCache();

builder.Services.Configure<IpRateLimitOptions>(
    builder.Configuration.GetSection("IpRateLimiting"));

builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Add rate limiting middleware
app.UseIpRateLimiting();
```

**Rationale:**
- Protects public endpoints from abuse and DoS attacks
- IP-based limiting prevents spam and automated attacks
- Configurable per-endpoint limits allow fine-tuning
- 429 Too Many Requests response follows HTTP standards
- Low overhead, in-memory implementation

**Implementation Priority:** Sprint 2

---

### Decision 6: Audit Logging Strategy

**Status:** Important - Short-term Implementation

**Decision:** Separate AuditLog entity with EF Core SaveChanges interceptor

**Technical Implementation:**

**Audit Log Entity (Backend.Domain/Entities/AuditLog.cs):**
```csharp
public class AuditLog
{
    public int Id { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string Action { get; set; } = string.Empty; // Created, Updated, Deleted
    public string? OldValues { get; set; } // JSON
    public string? NewValues { get; set; } // JSON
    public int? UserId { get; set; }
    public string? UserEmail { get; set; }
    public DateTime Timestamp { get; set; }
}
```

**Auditable Interface:**
```csharp
public interface IAuditable
{
    int Id { get; }
}

// Apply to entities requiring audit
public class Shipment : IAuditable { /* ... */ }
public class Invoice : IAuditable { /* ... */ }
public class PricingRule : IAuditable { /* ... */ }
```

**EF Core Interceptor (Backend.Infrastructure/Data/AuditInterceptor.cs):**
```csharp
public class AuditInterceptor : SaveChangesInterceptor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        AddAuditLogs(eventData.Context);
        return result;
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        AddAuditLogs(eventData.Context);
        return ValueTask.FromResult(result);
    }

    private void AddAuditLogs(DbContext? context)
    {
        if (context == null) return;

        var entries = context.ChangeTracker.Entries()
            .Where(e => e.Entity is IAuditable &&
                       (e.State == EntityState.Added ||
                        e.State == EntityState.Modified ||
                        e.State == EntityState.Deleted))
            .ToList();

        var userId = GetCurrentUserId();
        var userEmail = GetCurrentUserEmail();

        foreach (var entry in entries)
        {
            var auditLog = new AuditLog
            {
                EntityName = entry.Entity.GetType().Name,
                EntityId = ((IAuditable)entry.Entity).Id,
                Action = entry.State.ToString(),
                OldValues = SerializeOldValues(entry),
                NewValues = SerializeNewValues(entry),
                UserId = userId,
                UserEmail = userEmail,
                Timestamp = DateTime.UtcNow
            };

            context.Set<AuditLog>().Add(auditLog);
        }
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    private string? GetCurrentUserEmail()
    {
        return _httpContextAccessor.HttpContext?.User?
            .FindFirst(ClaimTypes.Email)?.Value;
    }

    private string? SerializeOldValues(EntityEntry entry)
    {
        if (entry.State == EntityState.Added) return null;

        var oldValues = new Dictionary<string, object?>();
        foreach (var property in entry.OriginalValues.Properties)
        {
            oldValues[property.Name] = entry.OriginalValues[property];
        }
        return JsonSerializer.Serialize(oldValues);
    }

    private string? SerializeNewValues(EntityEntry entry)
    {
        if (entry.State == EntityState.Deleted) return null;

        var newValues = new Dictionary<string, object?>();
        foreach (var property in entry.CurrentValues.Properties)
        {
            newValues[property.Name] = entry.CurrentValues[property];
        }
        return JsonSerializer.Serialize(newValues);
    }
}
```

**Program.cs Registration:**
```csharp
builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>((provider, options) =>
{
    options.UseNpgsql(connectionString)
           .AddInterceptors(new AuditInterceptor(
               provider.GetRequiredService<IHttpContextAccessor>()));
});
```

**Rationale:**
- Automatic audit trail for compliance (financial transactions, admin actions)
- JSON storage of old/new values provides complete change history
- Interceptor ensures consistency without cluttering business logic
- User tracking for accountability
- 30-day retention meets compliance requirements

**Implementation Priority:** Sprint 2-3

---

### Decision 7: Real-Time Updates Approach

**Status:** Documented Pattern - Continue Current Approach

**Decision:** Continue TanStack Query polling; defer WebSocket to Phase 3

**Current Implementation (Documented):**

**Customer Dashboard (Already Implemented):**
```typescript
// Auto-refetch every 30 seconds
const { data: shipments, refetch } = useQuery({
  queryKey: ['shipments', 'customer'],
  queryFn: () => shipmentsService.getCustomerShipments(),
  refetchInterval: 30000,
  refetchOnWindowFocus: true,
  staleTime: 20000
});
```

**Admin Dashboard with Optimistic Updates (Already Implemented):**
```typescript
const updateStatusMutation = useMutation({
  mutationFn: (data) => adminService.updateShipmentStatus(data),
  onMutate: async (newStatus) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['shipments'] });

    // Snapshot previous value
    const previousShipments = queryClient.getQueryData(['shipments']);

    // Optimistically update cache
    queryClient.setQueryData(['shipments'], (old) => {
      return old.map(shipment =>
        shipment.id === newStatus.shipmentId
          ? { ...shipment, status: newStatus.status }
          : shipment
      );
    });

    return { previousShipments };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['shipments'], context.previousShipments);
    toast.error('Failed to update status');
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['shipments'] });
  }
});
```

**Future WebSocket Consideration (Phase 3 - When Needed):**
- SignalR integration for .NET backend
- Real-time status broadcasting to connected clients
- Implement when >500 concurrent users or customer demand justifies complexity

**Rationale:**
- Polling is simple, reliable, and sufficient for current scale (80-150 customers)
- 30-second refresh provides near-real-time experience
- Optimistic updates make admin actions feel instant
- No additional infrastructure or complexity
- WebSocket/SignalR adds complexity not yet justified by scale or requirements

**Implementation Priority:** Already implemented - No action required

---

### Decision 8: External Services - Deferred Approach

**Status:** Deferred to Phase 3

**Distance Calculation Service - Regional Estimation:**

**Decision:** Keep regional distance estimation, defer Google Distance Matrix API

**Current Approach (Backend.Infrastructure/Services/RegionalDistanceService.cs):**
```csharp
public class RegionalDistanceService : IDistanceService
{
    private readonly Dictionary<string, Dictionary<string, double>> _distanceMatrix;

    public RegionalDistanceService()
    {
        // Initialize with common routes
        _distanceMatrix = new Dictionary<string, Dictionary<string, double>>
        {
            ["Colombo"] = new()
            {
                ["Singapore"] = 2800,
                ["Dubai"] = 3200,
                ["Mumbai"] = 1200,
                ["Chennai"] = 700,
                ["Male"] = 700,
                ["Karachi"] = 1900
            },
            ["Hambantota"] = new()
            {
                ["Singapore"] = 3000,
                ["Dubai"] = 3400,
                ["Mumbai"] = 1400
            }
            // Add more routes as needed
        };
    }

    public Task<DistanceResult> CalculateDistanceAsync(string origin, string destination)
    {
        var distance = GetDistanceFromMatrix(origin, destination)
                      ?? EstimateDistanceByRegion(origin, destination)
                      ?? 1000.0; // Default fallback

        return Task.FromResult(new DistanceResult(
            DistanceKm: distance,
            DurationMinutes: (int)(distance / 60), // Assume 60 km/h average
            IsSuccess: true
        ));
    }

    private double? GetDistanceFromMatrix(string origin, string destination)
    {
        if (_distanceMatrix.TryGetValue(origin, out var destinations) &&
            destinations.TryGetValue(destination, out var distance))
        {
            return distance;
        }
        return null;
    }

    private double? EstimateDistanceByRegion(string origin, string destination)
    {
        // Rough regional estimates
        if (IsLocalPort(origin) && IsLocalPort(destination))
            return 200; // Local Sri Lanka
        if (IsSouthAsia(destination))
            return 1500; // South Asia region
        if (IsMiddleEast(destination))
            return 3000; // Middle East
        if (IsEastAsia(destination))
            return 3500; // East Asia

        return null;
    }
}
```

**Rationale:** Regional estimation sufficient for MVP pricing. API integration deferred until quote volume justifies API costs.

---

**Email Notification Service - Manual Process:**

**Decision:** Defer email automation to Phase 3

**Alternative Approach:**
- Manual email communication for critical updates
- Admin sends emails through regular email client
- Email templates stored in documentation
- Implement automated emails when customer count >200

**Rationale:** Email infrastructure adds complexity. Manual process acceptable for 80-customer scale.

---

**Document Storage - Local Filesystem:**

**Decision:** Local filesystem storage, defer cloud storage to Phase 3

**Implementation (Backend.Infrastructure/Services/LocalDocumentStorageService.cs):**
```csharp
public class LocalDocumentStorageService : IDocumentStorageService
{
    private readonly string _storagePath;
    private readonly ILogger<LocalDocumentStorageService> _logger;

    public LocalDocumentStorageService(
        IConfiguration configuration,
        ILogger<LocalDocumentStorageService> logger)
    {
        _storagePath = configuration["DocumentStorage:Path"] ?? "./documents";
        _logger = logger;
        Directory.CreateDirectory(_storagePath);
    }

    public async Task<string> UploadDocumentAsync(
        Stream fileStream,
        string fileName,
        string contentType)
    {
        var fileKey = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(_storagePath, fileKey);

        using var fileStreamOut = File.Create(filePath);
        await fileStream.CopyToAsync(fileStreamOut);

        _logger.LogInformation("Document uploaded: {FileName} -> {FileKey}", fileName, fileKey);
        return fileKey;
    }

    public Task<Stream> DownloadDocumentAsync(string fileKey)
    {
        var filePath = Path.Combine(_storagePath, fileKey);
        if (!File.Exists(filePath))
            throw new NotFoundException($"Document not found: {fileKey}");

        return Task.FromResult<Stream>(File.OpenRead(filePath));
    }

    public Task DeleteDocumentAsync(string fileKey)
    {
        var filePath = Path.Combine(_storagePath, fileKey);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            _logger.LogInformation("Document deleted: {FileKey}", fileKey);
        }
        return Task.CompletedTask;
    }
}
```

**Docker Volume (docker-compose.yml):**
```yaml
services:
  backend:
    volumes:
      - ./documents:/app/documents
```

**Rationale:** Local filesystem simple, sufficient for Phase 1-2. Migrate to S3/Azure Blob in Phase 3 when storage >100GB or multi-server deployment needed.

---

## Implementation Roadmap

### Sprint 1 (Weeks 1-2) - Critical Foundation
- ✅ PostgreSQL migration with Docker Compose
- ✅ EF Core migrations setup
- ✅ Database indexes for performance
- ✅ Serilog structured logging
- ✅ Global exception middleware
- ✅ FluentValidation setup for all DTOs

### Sprint 2 (Weeks 3-4) - Quality & Performance
- ✅ In-memory caching for pricing rules
- ✅ Rate limiting on public endpoints
- ✅ Audit logging interceptor
- ✅ Local document storage service

### Phase 3 (Future - Scale Justifies)
- Google Distance Matrix API integration (when quote volume >1000/month)
- Email notification service (when customer count >200)
- Cloud document storage (when storage >100GB or multi-server deployment)
- Stripe payment gateway (when online payment demand exists)
- WebSocket real-time updates (when >500 concurrent users)

---

## Decision Impact Analysis

### Cross-Component Dependencies

**PostgreSQL Migration → All Layers:**
- Domain: No changes (database-agnostic)
- Infrastructure: DbContext update, migration files
- Application: No changes (uses interfaces)
- API: Connection string configuration

**FluentValidation → Controllers:**
- All API controllers automatically validate DTOs
- Consistent 400 BadRequest responses
- Validation errors in standardized format

**Serilog → All Components:**
- Controllers: Request/response logging
- Services: Business logic logging
- Infrastructure: Database query logging
- Middleware: Exception logging

**Caching → Infrastructure Services:**
- PricingService wrapped with caching
- Controllers unchanged (dependency injection)
- Cache invalidation when pricing rules updated

**Rate Limiting → Public Endpoints:**
- Tracking controller (GET /api/tracking/{trackingNumber})
- Quotes controller (POST /api/quotes/calculate)
- Auth controller (POST /api/auth/login)

**Audit Logging → Auditable Entities:**
- Automatic for Shipment, Invoice, PricingRule
- Transparent to controllers and services
- Database writes audits alongside entity changes

---

## Architecture Completion

The architecture document is now complete with:

✅ **Project Context** - Requirements, complexity assessment, constraints
✅ **Technical Foundation** - Existing stack and patterns documented
✅ **Core Decisions** - All critical and important architectural decisions made
✅ **Implementation Guidance** - Code examples and configuration details
✅ **Roadmap** - Clear prioritization and phasing

**AI Agent Readiness:** This document provides sufficient architectural guidance for AI agents to:
- Understand existing patterns and maintain consistency
- Implement features following established decisions
- Apply consistent error handling, logging, and validation
- Make informed trade-offs within architectural boundaries

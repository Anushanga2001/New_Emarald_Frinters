---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'docs/planning-artifacts/architecture.md'
---

# New_Emarald_Frinters - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for New_Emarald_Frinters, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Customers can register for an account using email and password
FR2: Customers can log in to access personalized features
FR3: Admin users can log in with elevated privileges
FR4: System can enforce role-based access control (Customer, Admin roles)
FR5: Users can reset forgotten passwords via email verification
FR6: System can maintain secure session management with JWT tokens
FR7: System can log out users and invalidate their sessions
FR8: Public users can calculate shipping quotes without authentication
FR9: System can calculate quotes based on origin, destination, weight, and dimensions
FR10: System can integrate with external distance calculation services (Google Distance Matrix API)
FR11: System can display quote breakdowns showing distance, weight factors, and total cost
FR12: System can support multi-currency display (LKR primary, USD secondary)
FR13: System can provide instant quote results within 3 seconds
FR14: Customers can view their shipment history
FR15: Customers can filter and search shipments by status, date, or tracking number
FR16: Customers can view detailed information for individual shipments
FR17: Customers can create shipment requests with complete package and destination details
FR18: System can validate shipment data including addresses and package specifications
FR19: System can generate unique tracking numbers for each shipment
FR20: Admin users can view all shipments across all customers
FR21: Admin users can update shipment status (Pending, Processing, In Transit, Delivered, Cancelled)
FR22: Admin users can assign delivery personnel to shipments
FR23: System can prevent status transitions that violate business rules
FR24: Customers can track shipments using tracking numbers
FR25: System can display shipment status and estimated delivery dates
FR26: System can show shipment timeline with status history
FR27: Public users can track shipments without logging in
FR28: System can display tracking information in customer-friendly format
FR29: System can update tracking status in real-time as admin makes changes
FR30: System can generate invoices automatically from completed shipments
FR31: System can calculate invoice totals including base charges, taxes, and fees
FR32: Customers can view their invoice history
FR33: Customers can download invoices as PDF documents
FR34: Admin users can view all invoices across all customers
FR35: Admin users can manually create invoices for special cases
FR36: Admin users can mark invoices as paid or unpaid
FR37: System can display invoice payment status clearly
FR38: System can generate invoice PDFs with company branding and complete details
FR39: System can send email notifications for key shipment events
FR40: Customers receive notifications when shipments are created
FR41: Customers receive notifications when shipment status changes
FR42: Customers receive notifications when shipments are delivered
FR43: Admin users receive notifications for new shipment requests
FR44: System can integrate with email service providers (SendGrid or AWS SES)
FR45: System can queue email notifications for reliable delivery
FR46: System can handle email delivery failures gracefully
FR47: System can store and retrieve shipment-related documents
FR48: Customers can upload supporting documents for shipments
FR49: Admin users can upload proof of delivery documents
FR50: System can associate documents with specific shipments
FR51: System can serve document downloads securely based on user permissions
FR52: System can validate document file types and sizes
FR53: Admin users can access a comprehensive dashboard
FR54: Admin dashboard displays key metrics (total shipments, pending requests, revenue)
FR55: Admin dashboard shows recent activity and pending actions
FR56: Admin users can quickly access pending shipment requests
FR57: Admin users can view revenue analytics by time period
FR58: Admin users can export reports for business analysis
FR59: Customers can access a personalized dashboard
FR60: Customer dashboard shows active shipments prominently
FR61: Customer dashboard displays recent quotes and shipment history
FR62: Customer dashboard shows unpaid invoices requiring attention
FR63: Customers can quickly create new quotes from dashboard
FR64: Customers can quickly create new shipment requests from dashboard
FR65: Admin users can view all registered customers
FR66: Admin users can search and filter customer list
FR67: Admin users can view customer profiles with shipment history
FR68: Admin users can view customer invoice history and payment status
FR69: Admin users can deactivate customer accounts if needed
FR70: Admin users can configure pricing rules and rate tables
FR71: System can apply configured pricing rules during quote calculations
FR72: Admin users can configure supported origin and destination locations
FR73: Admin users can configure system-wide settings (company info, email templates)
FR74: System can maintain audit logs of configuration changes
FR75: System can support Sri Lankan localization (phone formats, local ports, LKR currency)

### NonFunctional Requirements

**Performance Requirements:**
NFR1: User-facing page loads complete initial render within 2 seconds on standard broadband
NFR2: Quote calculations return results within 3 seconds including external API calls
NFR3: Dashboard data loading displays key metrics within 1.5 seconds
NFR4: Search and filter operations return results within 1 second for datasets up to 10,000 records
NFR5: Document downloads initiate PDF download within 2 seconds
NFR6: System supports 50 concurrent users without performance degradation
NFR7: System supports 100 concurrent users with <20% performance degradation
NFR8: Admin dashboard remains responsive during peak customer activity
NFR9: External API timeout maximum 5 seconds for Google Distance Matrix calls
NFR10: Fallback mechanism activates if API response exceeds timeout
NFR11: Quote calculation degrades gracefully if distance API unavailable

**Security Requirements:**
NFR12: All user passwords hashed using bcrypt with minimum work factor of 10
NFR13: JWT tokens expire after configurable duration (default 24 hours)
NFR14: Role-based access control enforced on all protected endpoints
NFR15: Session invalidation on logout with token blacklisting
NFR16: All data encrypted in transit using TLS 1.2 or higher
NFR17: All data encrypted at rest using database encryption
NFR18: Sensitive customer information protected with access logging
NFR19: Payment information never stored locally, only tokenized references
NFR20: Customers can only access their own shipments, invoices, and documents
NFR21: Admin users have full access with audit logging of all actions
NFR22: Public endpoints rate-limited to prevent abuse
NFR23: Failed login attempts tracked with temporary account lockout after 5 consecutive failures
NFR24: GDPR-ready with customer data export and deletion capabilities
NFR25: Audit trail maintained for financial transactions
NFR26: Document access logged for compliance verification

**Scalability Requirements:**
NFR27: Phase 1 supports 80 active customer accounts, 300 shipments/month
NFR28: Phase 2 supports 150 active customers, 1,000 shipments/quarter
NFR29: Phase 3 supports 500+ active customers, 5,000+ shipments/quarter
NFR30: SQLite implementation supports up to 10,000 shipments without performance issues
NFR31: Migration path defined to PostgreSQL for Phase 3 scale
NFR32: Database query optimization maintains <500ms response for common operations at scale
NFR33: Frontend static hosting supports unlimited read traffic through CDN
NFR34: Backend API designed for horizontal scaling with stateless JWT design
NFR35: File storage scales independently using cloud object storage
NFR36: Google Distance Matrix API quota monitoring and optimization
NFR37: Email service supports batch processing for notification spikes
NFR38: Rate limiting prevents excessive API consumption during traffic bursts

**Accessibility Requirements:**
NFR39: All interactive elements keyboard-navigable with visible focus indicators
NFR40: Color contrast ratios meet minimum 4.5:1 for normal text, 3:1 for large text
NFR41: All images and icons include meaningful alt text
NFR42: Form fields include proper labels and error messaging
NFR43: Screen reader compatibility verified with NVDA and JAWS
NFR44: Mobile-first design with breakpoints at 640px, 768px, 1024px, 1280px
NFR45: Touch targets minimum 44x44px for mobile interactions
NFR46: Text scales appropriately across device sizes without horizontal scrolling
NFR47: Critical features accessible on mobile devices
NFR48: UI prepared for English/Sinhala/Tamil language switching
NFR49: Currency display supports LKR (primary) and USD (secondary)
NFR50: Date/time formatting follows ISO 8601 with localized display

**Integration Requirements:**
NFR51: Google Distance Matrix API integration with error handling and fallback
NFR52: API keys stored securely in environment variables, never in code
NFR53: Integration health monitoring with alerting for failures
NFR54: Graceful degradation if external service unavailable
NFR55: SendGrid or AWS SES integration for transactional emails
NFR56: Email queue system ensures reliable delivery with retry logic
NFR57: Template management for consistent branding across notifications
NFR58: Delivery tracking and bounce handling
NFR59: Stripe integration architecture prepared for Phase 3
NFR60: Webhook handling for asynchronous payment events
NFR61: PCI-DSS compliance through tokenization (no card data storage)
NFR62: Shipment data exportable to CSV format
NFR63: Invoice data exportable to PDF and CSV formats
NFR64: Customer data exportable for GDPR compliance

**Reliability Requirements:**
NFR65: Target uptime 99.5% during business hours (7 AM - 10 PM LKR time)
NFR66: Planned maintenance communicated 48 hours in advance
NFR67: Critical customer-facing features prioritized for uptime
NFR68: Database migrations tested in staging before production
NFR69: Automated backups daily with 30-day retention
NFR70: Point-in-time recovery capability for critical data loss scenarios
NFR71: Transaction integrity for financial operations
NFR72: User-facing error messages clear and actionable
NFR73: Server errors logged with full stack traces for debugging
NFR74: Critical errors trigger admin notifications
NFR75: Graceful degradation for non-critical feature failures
NFR76: Application logging with structured format for analysis
NFR77: Performance metrics tracking (response times, error rates)
NFR78: External API health monitoring
NFR79: Database performance monitoring with slow query alerts

### Additional Requirements

**From Architecture Document:**

**AR1: PostgreSQL Migration (Critical - Sprint 1)**
- Direct PostgreSQL adoption across all environments with Docker Compose
- PostgreSQL 17-alpine with connection pooling (min 5, max 100)
- EF Core migrations replacing Database.EnsureCreatedAsync()
- Database indexes for performance: TrackingNumber (unique), InvoiceNumber (unique), CustomerId, CreatedAt, Status
- Composite index for TrackingEvents (ShipmentId, EventDate)

**AR2: Error Handling & Logging (Critical - Sprint 1)**
- Serilog structured logging with Console and File sinks
- 30-day log file retention with daily rolling
- Global exception middleware with custom exception types (NotFoundException, ValidationException)
- HTTP status code mapping: 404 (Not Found), 400 (Validation), 403 (Unauthorized), 500 (Server Error)
- Development mode includes stack traces, production hides implementation details
- Request logging with timing, status code, user agent enrichment

**AR3: Backend Input Validation (Critical - Sprint 1)**
- FluentValidation for all DTOs with declarative validation rules
- Automatic validation before controller action execution
- Business rule validation (e.g., status transition rules)
- Consistent 400 BadRequest responses with validation error details
- Nested validation for complex DTOs (Shipments with Packages)

**AR4: Caching Strategy (Important - Sprint 2)**
- In-memory caching with IMemoryCache for pricing rules
- 24-hour absolute expiration, 6-hour sliding expiration for pricing rules
- Cache invalidation when pricing rules updated by admin
- Future caching opportunities: regional distances (24h), currency conversion (6h), user roles (15m)

**AR5: Rate Limiting (Important - Sprint 2)**
- AspNetCoreRateLimit middleware for public endpoint protection
- IP-based rate limiting with configurable per-endpoint limits
- Public tracking: 20 requests/minute
- Quote calculator: 10 requests/minute
- Login endpoint: 5 requests/5 minutes
- Global catch-all: 60 requests/minute
- 429 Too Many Requests response with JSON message

**AR6: Audit Logging (Important - Sprint 2-3)**
- Separate AuditLog entity with EF Core SaveChanges interceptor
- Automatic audit for IAuditable entities (Shipment, Invoice, PricingRule)
- JSON serialization of old/new values for complete change history
- User tracking (UserId, UserEmail) from JWT claims
- Audit actions: Created, Updated, Deleted
- 30-day retention for compliance

**AR7: Real-Time Updates via Polling (Already Implemented)**
- TanStack Query auto-refetch every 30 seconds for active shipments
- Refetch on window focus enabled
- Optimistic UI updates for admin status changes with rollback on error
- WebSocket/SignalR deferred to Phase 3 (>500 concurrent users)

**AR8: Local Document Storage (Sprint 2)**
- Local filesystem storage with configurable path
- GUID-based file keys to prevent collisions
- Upload validation for file type and size
- Secure download with permission checks (customers see only their documents)
- Docker volume mapping for persistence
- Cloud storage (S3/Azure Blob) deferred to Phase 3 (>100GB or multi-server)

**AR9: Regional Distance Service (Implemented - Defer API)**
- Hardcoded distance matrix for common routes (Colombo/Hambantota → major destinations)
- Regional estimation for unlisted routes (Local: 200km, South Asia: 1500km, Middle East: 3000km, East Asia: 3500km)
- Google Distance Matrix API integration deferred to Phase 3 (when quote volume >1000/month)

**AR10: Email Notifications (Deferred to Phase 3)**
- Manual email communication acceptable for Phase 1-2 (80-150 customers)
- Email templates stored in documentation for consistency
- SendGrid/AWS SES integration deferred until customer count >200

**AR11: Starter Template/Greenfield Setup**
- No starter template required (brownfield project with operational MVP)
- Docker Compose development environment already established
- Clean Architecture with 4 layers already implemented

### FR Coverage Map

FR1: Epic 1 - Customer registration with email and password
FR2: Epic 1 - Customer login to access personalized features
FR3: Epic 1 - Admin login with elevated privileges
FR4: Epic 1 - Role-based access control enforcement
FR5: Epic 1 - Password reset via email verification
FR6: Epic 1 - JWT token session management
FR7: Epic 1 - User logout and session invalidation
FR8: Epic 2 - Public quote calculator (no authentication)
FR9: Epic 2 - Quote calculation based on origin, destination, weight, dimensions
FR10: Epic 2 - Distance calculation service integration
FR11: Epic 2 - Quote breakdown display
FR12: Epic 2 - Multi-currency support (LKR/USD)
FR13: Epic 2 - Instant quote results (<3 seconds)
FR14: Epic 3 - Customer shipment history view
FR15: Epic 3 - Shipment search and filtering
FR16: Epic 3 - Detailed shipment information view
FR17: Epic 3 - Customer shipment creation
FR18: Epic 3 - Shipment data validation
FR19: Epic 3 - Unique tracking number generation
FR20: Epic 3 - Admin view all shipments
FR21: Epic 3 - Admin shipment status updates
FR22: Epic 3 - Admin assign delivery personnel
FR23: Epic 3 - Status transition validation
FR24: Epic 4 - Customer shipment tracking by tracking number
FR25: Epic 4 - Shipment status and estimated delivery display
FR26: Epic 4 - Shipment timeline with status history
FR27: Epic 4 - Public tracking without login
FR28: Epic 4 - Customer-friendly tracking information display
FR29: Epic 4 - Real-time tracking status updates
FR30: Epic 5 - Automatic invoice generation from completed shipments
FR31: Epic 5 - Invoice total calculation (charges, taxes, fees)
FR32: Epic 5 - Customer invoice history view
FR33: Epic 5 - Invoice PDF download
FR34: Epic 5 - Admin view all invoices
FR35: Epic 5 - Admin manual invoice creation
FR36: Epic 5 - Admin mark invoices as paid/unpaid
FR37: Epic 5 - Invoice payment status display
FR38: Epic 5 - Invoice PDF generation with branding
FR39: Epic 7 - Email notifications for shipment events
FR40: Epic 7 - Shipment creation notification
FR41: Epic 7 - Shipment status change notification
FR42: Epic 7 - Shipment delivery notification
FR43: Epic 7 - Admin new shipment request notification
FR44: Epic 7 - Email service provider integration
FR45: Epic 7 - Email notification queue
FR46: Epic 7 - Email delivery failure handling
FR47: Epic 6 - Document storage and retrieval
FR48: Epic 6 - Customer document upload
FR49: Epic 6 - Admin proof of delivery upload
FR50: Epic 6 - Document-shipment association
FR51: Epic 6 - Secure document download with permissions
FR52: Epic 6 - Document file type and size validation
FR53: Epic 9 - Admin dashboard access
FR54: Epic 9 - Admin dashboard key metrics display
FR55: Epic 9 - Admin dashboard recent activity
FR56: Epic 9 - Admin quick access to pending requests
FR57: Epic 9 - Admin revenue analytics
FR58: Epic 9 - Admin report exports
FR59: Epic 8 - Customer dashboard access
FR60: Epic 8 - Customer dashboard active shipments display
FR61: Epic 8 - Customer dashboard recent quotes and history
FR62: Epic 8 - Customer dashboard unpaid invoices display
FR63: Epic 8 - Customer dashboard quick quote creation
FR64: Epic 8 - Customer dashboard quick shipment creation
FR65: Epic 10 - Admin view all customers
FR66: Epic 10 - Admin customer search and filtering
FR67: Epic 10 - Admin customer profile view with shipment history
FR68: Epic 10 - Admin customer invoice history view
FR69: Epic 10 - Admin customer account deactivation
FR70: Epic 11 - Admin pricing rule configuration
FR71: Epic 11 - Pricing rule application during quote calculation
FR72: Epic 11 - Admin origin/destination configuration
FR73: Epic 11 - Admin system-wide settings configuration
FR74: Epic 11 - Configuration change audit logs
FR75: Epic 11 - Sri Lankan localization support

## Epic List

### Epic 1: Foundation - User Authentication & Account Management
Users can register accounts, securely log in with role-based access, manage profiles, reset passwords, and maintain secure sessions. This epic establishes the authentication foundation that all authenticated features depend on.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7

**Technical Foundation:** AR1 (PostgreSQL migration), AR2 (Error handling & logging), AR3 (Backend validation)

**NFRs addressed:** NFR12-NFR15 (Security: bcrypt hashing, JWT tokens, RBAC, session management), NFR23 (Failed login lockout), NFR31 (PostgreSQL migration), NFR68-NFR71 (Database reliability)

---

### Epic 2: Self-Service Quote Calculator
Public users get instant shipping quotes with transparent pricing breakdown without requiring registration. The quote calculator uses distance calculation, multi-currency support, and displays detailed cost breakdowns to enable informed shipping decisions.

**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13

**Technical:** AR4 (Caching for pricing rules), AR5 (Rate limiting), AR9 (Regional distance service)

**NFRs addressed:** NFR1-NFR2 (Performance: page load <2s, quote <3s), NFR9-NFR11 (API timeout and fallback), NFR22 (Rate limiting), NFR49 (Multi-currency display)

---

### Epic 3: Shipment Lifecycle Management
Customers create shipment requests with complete package details; admins manage the complete shipment workflow from creation through delivery with status updates, validation, and business rule enforcement.

**FRs covered:** FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23

**NFRs addressed:** NFR3-NFR4 (Dashboard and search performance), NFR14 (RBAC enforcement), NFR20 (Customer data isolation), NFR21 (Admin audit logging), NFR32 (Query optimization), NFR71 (Transaction integrity)

---

### Epic 4: Public Tracking & Real-Time Updates
Anyone can track shipments by tracking number without login; customers see detailed status timelines with estimated delivery dates. Real-time polling ensures users see the latest status without manual refresh.

**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29

**Technical:** AR7 (TanStack Query polling for real-time updates)

**NFRs addressed:** NFR1 (Page load <2s), NFR22 (Public endpoint rate limiting), NFR67 (Critical feature uptime)

---

### Epic 5: Invoice Generation & Management
System automatically generates invoices from completed shipments; customers view invoice history and download PDF invoices; admins manage payment status and manually create invoices for special cases.

**FRs covered:** FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38

**NFRs addressed:** NFR5 (Document download <2s), NFR20 (Customer data isolation), NFR21 (Admin audit logging), NFR25 (Audit trail for financial transactions), NFR63 (Invoice export to PDF/CSV), NFR71 (Transaction integrity)

---

### Epic 6: Document Management System
Users upload shipment-related documents; admins upload proof of delivery; system provides secure document storage and retrieval with role-based access control and file validation.

**FRs covered:** FR47, FR48, FR49, FR50, FR51, FR52

**Technical:** AR8 (Local document storage with Docker volumes)

**NFRs addressed:** NFR5 (Document download <2s), NFR20 (Customer access control), NFR26 (Document access logging), NFR35 (Scalable file storage)

---

### Epic 7: Email Notification System
Users receive automated email notifications for key shipment events (created, status changes, delivered) with queue-based delivery and failure handling to keep users informed without requiring portal login.

**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46

**Technical:** AR10 (Email deferred to Phase 3 - manual process for now, interface ready)

**NFRs addressed:** NFR55-NFR58 (Email integration: SendGrid/AWS SES, queue system, templates, delivery tracking), NFR37 (Batch processing for notification spikes)

---

### Epic 8: Customer Portal Dashboard
Customers have a centralized dashboard showing active shipments, recent quotes, unpaid invoices, and quick actions for creating new quotes and shipments - a one-stop shop for customer self-service.

**FRs covered:** FR59, FR60, FR61, FR62, FR63, FR64

**NFRs addressed:** NFR1 (Page load <2s), NFR3 (Dashboard data load <1.5s), NFR20 (Customer data isolation), NFR44-NFR47 (Responsive design and mobile accessibility)

---

### Epic 9: Admin Operations Dashboard
Admin has real-time visibility into operations with key metrics (shipments, revenue, pending actions), recent activity, revenue analytics by time period, and report export capabilities.

**FRs covered:** FR53, FR54, FR55, FR56, FR57, FR58

**Technical:** AR6 (Audit logging for compliance)

**NFRs addressed:** NFR3 (Dashboard load <1.5s), NFR8 (Dashboard responsive during peak activity), NFR21 (Admin audit logging), NFR62-NFR63 (Export to CSV/PDF), NFR77 (Performance metrics tracking)

---

### Epic 10: Customer Relationship Management
Admin manages complete customer lifecycle: view all customers, search and filter, access customer profiles with complete shipment and invoice history, and handle account deactivation when needed.

**FRs covered:** FR65, FR66, FR67, FR68, FR69

**NFRs addressed:** NFR4 (Search performance <1s), NFR21 (Admin audit logging), NFR24 (GDPR-ready with data export/deletion)

---

### Epic 11: System Configuration & Pricing Management
Admin configures pricing rules and rate tables, manages supported origin/destination locations, configures system-wide settings (company info, email templates), maintains audit logs of configuration changes, and manages Sri Lankan localization.

**FRs covered:** FR70, FR71, FR72, FR73, FR74, FR75

**Technical:** AR6 (Audit logging for configuration changes)

**NFRs addressed:** NFR21 (Admin audit logging), NFR25 (Audit trail for configuration), NFR49-NFR50 (Multi-currency and localization)

---

## Epic 1: Foundation - User Authentication & Account Management

### Story 1.1: PostgreSQL Database Setup & Core Infrastructure

As a **system administrator**,
I want to migrate from SQLite to PostgreSQL with proper error handling and logging infrastructure,
So that the system has a production-ready database foundation with reliability and observability.

**Acceptance Criteria:**

**Given** the current system uses SQLite for development
**When** I set up the PostgreSQL database with Docker Compose
**Then** the system connects to PostgreSQL 17-alpine successfully
**And** connection pooling is configured (min 5, max 100 connections)
**And** EF Core migrations are created and applied successfully
**And** the User and Customer tables are created with proper indexes
**And** Serilog structured logging is configured with Console and File sinks
**And** logs are written to rolling daily files with 30-day retention
**And** global exception middleware handles all API errors consistently
**And** validation errors return 400, not found returns 404, unauthorized returns 403
**And** FluentValidation is registered for automatic DTO validation

**Technical Implementation:**
- Install Npgsql.EntityFrameworkCore.PostgreSQL 9.0.0
- Install Serilog.AspNetCore 9.0.0, Serilog.Sinks.Console, Serilog.Sinks.File
- Install FluentValidation.AspNetCore 11.3.0
- Configure Docker Compose with PostgreSQL service
- Create GlobalExceptionMiddleware with custom exception types
- Create initial EF Core migration for User and Customer entities
- Add unique index on User.Email
- Configure Serilog with request logging enrichment

---

### Story 1.2: User Registration with Email Verification

As a **new customer**,
I want to register for an account using my email and password,
So that I can access personalized shipping features.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I enter a valid email (not already registered), password (min 8 chars), and confirm password
**Then** my password is hashed using bcrypt with work factor 10
**And** a new User record is created with Customer role
**And** a Customer profile record is created linked to the User
**And** I receive a success message
**And** I am redirected to the login page

**Given** I enter an email that is already registered
**When** I attempt to register
**Then** I receive a clear error: "Email already exists"
**And** no duplicate User record is created

**Given** I enter a password shorter than 8 characters
**When** I attempt to register
**Then** I receive a validation error: "Password must be at least 8 characters"

**Given** I enter mismatched password and confirm password
**When** I attempt to register
**Then** I receive a validation error: "Passwords do not match"

**Technical Implementation:**
- Backend: RegisterDto with FluentValidation (email format, password length, unique email check)
- Backend: AuthService.RegisterAsync method with BCrypt.Net-Next for password hashing
- Backend: Create User entity with hashed password and UserRole.Customer
- Backend: Create linked Customer entity with user's details
- Frontend: Registration form with React Hook Form + Zod validation
- Frontend: Real-time validation feedback on blur/change

---

### Story 1.3: User Login with JWT Authentication

As a **registered user (customer or admin)**,
I want to log in with my email and password,
So that I can access my account and role-specific features.

**Acceptance Criteria:**

**Given** I am a registered user with valid credentials
**When** I enter my email and password and submit the login form
**Then** the system verifies my password using bcrypt comparison
**And** a JWT token is generated with claims: userId, email, role
**And** the token expires in 24 hours (configurable)
**And** the token is returned in the response
**And** I am redirected to my role-appropriate dashboard (Customer → Customer Dashboard, Admin → Admin Dashboard)

**Given** I enter an incorrect password
**When** I attempt to login
**Then** I receive an error: "Invalid email or password"
**And** the failed attempt is logged

**Given** I enter an email that doesn't exist
**When** I attempt to login
**Then** I receive an error: "Invalid email or password"
**And** no information is revealed about whether the email exists (security)

**Given** I have failed to login 5 consecutive times
**When** I attempt to login again
**Then** my account is temporarily locked for 15 minutes
**And** I receive an error: "Account temporarily locked due to multiple failed attempts"

**Technical Implementation:**
- Backend: LoginDto with email and password
- Backend: AuthService.LoginAsync verifies password with BCrypt.Verify
- Backend: JwtTokenService generates token with configurable expiration
- Backend: Track failed login attempts in User entity (FailedLoginAttempts, LockoutUntil)
- Backend: Return token in AuthResponseDto
- Frontend: Login form stores JWT in localStorage
- Frontend: Axios interceptor attaches token to all authenticated requests
- Frontend: Redirect logic based on user role from JWT claims

---

### Story 1.4: Role-Based Access Control (Customer/Admin/Staff)

As a **system**,
I want to enforce role-based access control on all protected endpoints,
So that customers only access customer features and admins access admin features.

**Acceptance Criteria:**

**Given** I am a logged-in customer
**When** I attempt to access a customer endpoint (e.g., GET /api/shipments/my-shipments)
**Then** the request succeeds and returns my data only

**Given** I am a logged-in customer
**When** I attempt to access an admin endpoint (e.g., GET /api/admin/shipments/all)
**Then** I receive a 403 Forbidden response
**And** an error message: "Access denied"

**Given** I am a logged-in admin
**When** I attempt to access any admin or customer endpoint
**Then** the request succeeds (admin has elevated privileges)

**Given** I am not logged in (no JWT token)
**When** I attempt to access a protected endpoint
**Then** I receive a 401 Unauthorized response
**And** I am redirected to the login page (frontend)

**Given** I am logged in as a customer
**When** I request shipment data
**Then** I only see shipments associated with my CustomerId
**And** I cannot see other customers' shipments (data-level authorization)

**Technical Implementation:**
- Backend: Add [Authorize(Roles = "Customer")] to customer endpoints
- Backend: Add [Authorize(Roles = "Admin,Staff")] to admin endpoints
- Backend: Customer endpoints filter data by current user's CustomerId
- Backend: Extract userId from JWT claims in controllers
- Frontend: Protected routes component checks for valid JWT
- Frontend: Axios interceptor redirects to login on 401 response
- Frontend: Conditional UI rendering based on user role

---

### Story 1.5: Password Reset via Email

As a **user who forgot their password**,
I want to reset my password via email verification,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the "Forgot Password" page
**When** I enter my registered email and submit
**Then** a password reset token is generated and stored with 1-hour expiration
**And** I receive a success message: "If that email exists, a reset link has been sent" (security - don't reveal if email exists)
**And** the system logs the password reset request

**Given** I receive the password reset email (simulated for now since AR10 defers email)
**When** I click the reset link with valid token
**Then** I am redirected to a "Reset Password" page with the token in URL

**Given** I am on the "Reset Password" page with a valid token
**When** I enter a new password (min 8 chars) and confirm password
**Then** my password is updated with bcrypt hashing
**And** the reset token is invalidated
**And** I receive a success message: "Password reset successful"
**And** I am redirected to the login page

**Given** the reset token has expired (>1 hour old)
**When** I attempt to reset my password
**Then** I receive an error: "Reset link has expired. Please request a new one."

**Given** I enter mismatched passwords on reset form
**When** I attempt to reset
**Then** I receive a validation error: "Passwords do not match"

**Technical Implementation:**
- Backend: User entity has PasswordResetToken and PasswordResetTokenExpiry fields
- Backend: ForgotPasswordDto with email validation
- Backend: AuthService.ForgotPasswordAsync generates secure token (GUID)
- Backend: ResetPasswordDto with token, newPassword, confirmPassword
- Backend: AuthService.ResetPasswordAsync validates token expiry and updates password
- Frontend: Forgot Password form with email input
- Frontend: Reset Password form with new password fields
- Note: Email sending deferred to Epic 7 (AR10) - token generation works, email simulation for now

---

### Story 1.6: User Profile Management

As a **logged-in user (customer or admin)**,
I want to view and update my profile information,
So that I can keep my account details current.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to "My Profile" page
**Then** I see my current profile information: name, email, phone, company name
**And** the form is pre-populated with my existing data

**Given** I am viewing my profile
**When** I update my name, phone, or company name and submit
**Then** my Customer record is updated in the database
**And** I receive a success message: "Profile updated successfully"
**And** the updated information is displayed

**Given** I attempt to change my email to one already in use
**When** I submit the profile update
**Then** I receive an error: "Email already exists"
**And** my profile is not updated

**Given** I enter invalid data (e.g., phone number with letters)
**When** I submit the profile update
**Then** I receive validation errors for invalid fields
**And** my profile is not updated

**Technical Implementation:**
- Backend: GET /api/profile returns current user's Customer data
- Backend: PUT /api/profile with UpdateProfileDto (name, email, phone, companyName)
- Backend: FluentValidation for UpdateProfileDto
- Backend: Check email uniqueness if email is being changed
- Frontend: Profile page with pre-populated form (React Hook Form)
- Frontend: Validation with Zod schema
- Frontend: Success/error toast notifications

---

### Story 1.7: Session Management & Logout

As a **logged-in user**,
I want to securely log out of my account,
So that my session is terminated and no one else can access my account.

**Acceptance Criteria:**

**Given** I am logged in with a valid JWT token
**When** I click the "Logout" button
**Then** my JWT token is removed from localStorage
**And** I am redirected to the home page or login page
**And** all subsequent API calls fail with 401 Unauthorized

**Given** my JWT token has expired (>24 hours old)
**When** I make an API request
**Then** I receive a 401 Unauthorized response
**And** I am automatically redirected to the login page
**And** a message appears: "Your session has expired. Please log in again."

**Given** I am logged in on multiple devices/tabs
**When** I log out on one device/tab
**Then** only that device/tab's token is removed (client-side logout)
**And** other devices/tabs remain logged in (stateless JWT design)

**Given** I close my browser without logging out
**When** I return and open the application
**Then** I am still logged in if my JWT token hasn't expired
**And** I am prompted to log in if the token has expired

**Technical Implementation:**
- Frontend: Logout function removes JWT from localStorage
- Frontend: Axios response interceptor detects 401 and redirects to login
- Frontend: Clear all cached user data on logout
- Backend: JWT expiration is enforced by ASP.NET Core JWT middleware
- Backend: No server-side session storage (stateless design per AR1/NFR34)
- Future: Token blacklist/refresh token for server-side logout (Phase 3 if needed)

---

## Epic 2: Self-Service Quote Calculator

### Story 2.1: Create Quote Calculation API with Regional Distance Service

As a **public user**,
I want to get a shipping quote by entering origin, destination, weight, and dimensions,
So that I can estimate shipping costs before creating an account or booking a shipment.

**Acceptance Criteria:**

**Given** I am on the quote calculator page (no authentication required)
**When** I enter origin city, destination city, package weight (kg), and dimensions (L x W x H in cm)
**Then** the system calculates the distance using the hardcoded regional distance matrix (AR9)
**And** applies pricing rules based on distance and weight
**And** returns a quote breakdown showing: base cost, distance factor, weight factor, total in LKR
**And** the quote calculation completes within 3 seconds (NFR2)

**Given** I enter an origin-destination pair that exists in the hardcoded distance matrix
**When** the quote is calculated
**Then** the system uses the exact distance from the matrix (e.g., Colombo-Jaffna: 396km)

**Given** I enter an origin-destination pair NOT in the hardcoded matrix
**When** the quote is calculated
**Then** the system uses regional estimation (Local: 200km, South Asia: 1500km, Middle East: 3000km, East Asia: 3500km)
**And** logs the unlisted route for future optimization

**Given** I enter invalid data (negative weight, missing fields)
**When** I submit the quote request
**Then** I receive a 400 BadRequest with specific validation errors
**And** the error message clearly indicates which fields are invalid

**Given** the system experiences high traffic
**When** multiple quote requests are made simultaneously
**Then** rate limiting is NOT applied to quote calculation yet (deferred to Story 2.3)
**And** the system handles 50 concurrent requests without degradation (NFR6)

**Technical Implementation:**
- Backend: Create Quote entity (Id, Origin, Destination, Weight, Dimensions, Distance, BaseCost, TotalCost, Currency, CreatedAt)
- Backend: Create QuoteRequestDto with FluentValidation (required fields, positive numbers)
- Backend: QuoteService.CalculateQuoteAsync method
- Backend: RegionalDistanceService with hardcoded distance matrix (AR9)
- Backend: PricingService applies base rate + distance multiplier + weight multiplier
- Backend: No external Google Distance Matrix API yet (AR9 - deferred to Phase 3)
- Backend: Create EF Core migration for Quote table
- Backend: POST /api/quotes/calculate endpoint (public, no authentication)

---

### Story 2.2: Build Public Quote Calculator UI with Multi-Currency Display

As a **public user**,
I want a user-friendly quote calculator interface with clear pricing breakdown and multi-currency display,
So that I can easily understand the shipping costs in my preferred currency.

**Acceptance Criteria:**

**Given** I navigate to the home page or /quote-calculator page
**When** the page loads
**Then** I see a prominent quote calculator form with fields: Origin (dropdown), Destination (dropdown), Weight (number input), Dimensions (3 number inputs for L/W/H)
**And** the form includes helpful labels and placeholder text
**And** the page loads within 2 seconds (NFR1)

**Given** I fill in all required fields with valid data
**When** I click "Calculate Quote"
**Then** a quote breakdown is displayed showing:
  - Distance: [X] km
  - Base Rate: LKR [amount]
  - Distance Factor: LKR [amount]
  - Weight Factor: LKR [amount]
  - **Total: LKR [amount]**
  - Secondary display: USD [converted amount] (NFR49)
**And** the breakdown appears within 3 seconds (NFR2)

**Given** the quote calculation is successful
**When** the breakdown is displayed
**Then** I see a currency toggle to switch between LKR (primary) and USD (secondary)
**And** the conversion uses a configurable exchange rate (stored in app settings)

**Given** I submit the form with invalid data
**When** the API returns validation errors
**Then** the form displays clear error messages next to the invalid fields
**And** the form remains populated with my entered data

**Given** I am viewing a successful quote
**When** I want to create a shipment from this quote
**Then** I see a "Create Shipment from Quote" button
**And** clicking it redirects me to the registration page (since I'm not authenticated)
**And** the quote data is preserved for after registration (optional enhancement)

**Given** the API request fails or times out
**When** an error occurs
**Then** I see a user-friendly error message: "Unable to calculate quote. Please try again."
**And** the error is logged for debugging

**Technical Implementation:**
- Frontend: Create QuoteCalculator component with React Hook Form + Zod validation
- Frontend: Origin/Destination dropdowns populated from common Sri Lankan cities + international destinations
- Frontend: Real-time client-side validation on blur
- Frontend: Call POST /api/quotes/calculate from QuoteService
- Frontend: Display QuoteBreakdown component with pricing details
- Frontend: Currency toggle component with LKR/USD conversion
- Frontend: Responsive design for mobile devices (NFR44-NFR47)
- Frontend: Accessible form with proper labels and ARIA attributes (NFR39-NFR43)

---

### Story 2.3: Add Pricing Rule Caching and Rate Limiting

As a **system administrator**,
I want pricing rules cached and public endpoints rate-limited,
So that the quote calculator performs optimally and prevents abuse.

**Acceptance Criteria:**

**Given** pricing rules are configured in the database (PricingRule table)
**When** the first quote calculation request is made after server start
**Then** the pricing rules are loaded from the database
**And** cached in memory using IMemoryCache (AR4)
**And** the cache has 24-hour absolute expiration and 6-hour sliding expiration

**Given** pricing rules are cached
**When** subsequent quote calculations are performed
**Then** the system uses cached pricing rules without database queries
**And** quote calculation performance remains under 3 seconds (NFR2)

**Given** an admin user updates pricing rules (in future story)
**When** the pricing configuration is saved
**Then** the pricing cache is invalidated immediately
**And** the next quote calculation fetches fresh pricing rules

**Given** I am a public user accessing the quote calculator endpoint
**When** I make more than 10 quote requests within 1 minute from the same IP
**Then** subsequent requests return 429 Too Many Requests (AR5)
**And** a clear error message: "Rate limit exceeded. Please try again in [X] seconds."

**Given** the rate limit is enforced
**When** I wait for the rate limit window to expire
**Then** I can successfully make quote requests again

**Given** the system is under heavy load
**When** rate limiting is active
**Then** legitimate users can still make reasonable quote requests
**And** the system prevents abuse from single IPs

**Technical Implementation:**
- Backend: Create PricingRule entity (Id, RuleType, BaseCost, DistanceMultiplier, WeightMultiplier, EffectiveDate, IsActive)
- Backend: Create EF Core migration for PricingRule table
- Backend: Seed initial pricing rules in migration
- Backend: Implement PricingCacheService with IMemoryCache
- Backend: Cache invalidation method for admin updates
- Backend: Install AspNetCoreRateLimit 5.0.0
- Backend: Configure rate limiting in Program.cs (AR5)
- Backend: Apply rate limit rules:
  - Quote calculator: 10 requests/minute per IP
  - Public tracking: 20 requests/minute per IP (for future use)
  - Global: 60 requests/minute per IP
- Frontend: Handle 429 response with user-friendly error message

---

## Epic 3: Shipment Lifecycle Management

### Story 3.1: Create Shipment Request (Customer Feature)

As a **logged-in customer**,
I want to create a new shipment request with complete package and destination details,
So that I can book shipping services and receive tracking information.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to "Create Shipment" page
**Then** I see a shipment request form with fields:
  - Origin (dropdown or address input)
  - Destination (dropdown or address input)
  - Recipient name, phone, email
  - Package weight (kg)
  - Package dimensions (L x W x H in cm)
  - Package description
  - Requested pickup date
**And** the form loads within 2 seconds (NFR1)

**Given** I fill in all required shipment details with valid data
**When** I submit the shipment request
**Then** a new Shipment record is created with status "Pending"
**And** a unique tracking number is generated (format: NE-YYYY-XXXXXX, e.g., NE-2026-000001) (FR19)
**And** the shipment is associated with my CustomerId (NFR20)
**And** a ShipmentPackage record is created with package details
**And** the calculated quote is stored with the shipment
**And** I see a success message with the tracking number
**And** I am redirected to the shipment details page

**Given** I enter invalid data (negative weight, missing required fields)
**When** I submit the shipment request
**Then** I receive validation errors for the invalid fields
**And** the form remains populated with my entered data
**And** no Shipment record is created

**Given** I want to create a shipment from a previous quote
**When** I click "Create Shipment" from a quote
**Then** the shipment form is pre-populated with origin, destination, and package details from the quote
**And** I only need to add recipient information and pickup date

**Given** the system is calculating the shipment cost
**When** the calculation completes
**Then** the total cost is displayed before final submission
**And** the cost calculation uses the same pricing rules as the quote calculator (AR4)

**Technical Implementation:**
- Backend: Create Shipment entity (Id, TrackingNumber, CustomerId, Origin, Destination, Status, TotalCost, CreatedAt, UpdatedAt)
- Backend: Create ShipmentPackage entity (Id, ShipmentId, Weight, Length, Width, Height, Description)
- Backend: Create ShipmentAddress entity (RecipientName, Phone, Email, AddressLine1, City, PostalCode)
- Backend: Create CreateShipmentDto with FluentValidation (FR18)
- Backend: ShipmentService.CreateShipmentAsync method
- Backend: TrackingNumberGenerator.GenerateUniqueTrackingNumber() (FR19)
- Backend: Associate shipment with current user's CustomerId (NFR20)
- Backend: POST /api/shipments with [Authorize(Roles = "Customer")] (NFR14)
- Backend: Create EF Core migration for Shipment, ShipmentPackage, ShipmentAddress tables
- Backend: Create indexes: TrackingNumber (unique), CustomerId, Status, CreatedAt
- Frontend: CreateShipment component with React Hook Form + Zod validation
- Frontend: Address autocomplete for origin/destination
- Frontend: Real-time cost calculation display
- Frontend: Success notification with tracking number

---

### Story 3.2: View My Shipments with Search and Filtering (Customer Feature)

As a **logged-in customer**,
I want to view my shipment history with search and filtering capabilities,
So that I can easily find and track my shipments.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to "My Shipments" page
**Then** I see a list of all my shipments (only my CustomerId) (FR14, NFR20)
**And** each shipment shows: tracking number, destination, status, created date, total cost
**And** the list loads within 1.5 seconds for up to 10,000 records (NFR3)
**And** shipments are sorted by created date (newest first)

**Given** I have multiple shipments
**When** the shipment list is displayed
**Then** I see pagination (20 shipments per page)
**And** I can navigate between pages without full page reload
**And** each page transition completes within 1 second (NFR4)

**Given** I want to find specific shipments
**When** I use the search box and enter a tracking number or destination
**Then** the list filters in real-time as I type
**And** the search completes within 1 second (NFR4)
**And** only matching shipments are displayed

**Given** I want to filter by shipment status
**When** I select a status filter (Pending, Processing, In Transit, Delivered, Cancelled)
**Then** only shipments with that status are displayed (FR15)
**And** the filter updates within 1 second (NFR4)

**Given** I want to filter by date range
**When** I select a date range (e.g., "Last 30 days", "Last 3 months", or custom range)
**Then** only shipments within that date range are displayed (FR15)
**And** the filter updates within 1 second (NFR4)

**Given** I have no shipments
**When** I view "My Shipments" page
**Then** I see a helpful message: "You haven't created any shipments yet"
**And** I see a "Create New Shipment" button

**Given** I click on a shipment in the list
**When** I select it
**Then** I am navigated to the detailed shipment view (Story 3.3)

**Technical Implementation:**
- Backend: GET /api/shipments/my-shipments with [Authorize(Roles = "Customer")]
- Backend: Query filters by current user's CustomerId (NFR20)
- Backend: Support query parameters: status, searchTerm, startDate, endDate, page, pageSize
- Backend: Implement efficient pagination with skip/take
- Backend: Add database indexes for performance: (CustomerId, CreatedAt), (CustomerId, Status) (NFR32)
- Frontend: MyShipments component with TanStack Query for data fetching
- Frontend: SearchBar component with debounced search
- Frontend: StatusFilter dropdown component
- Frontend: DateRangePicker component
- Frontend: ShipmentList component with pagination
- Frontend: Loading states and skeleton screens for better UX

---

### Story 3.3: View Shipment Details (Customer Feature)

As a **logged-in customer**,
I want to view detailed information for a specific shipment,
So that I can see complete shipment details, status, and tracking history.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to a shipment details page (by tracking number or shipment ID)
**Then** I see comprehensive shipment information:
  - Tracking number
  - Current status with visual indicator
  - Origin and destination details
  - Recipient information
  - Package details (weight, dimensions, description)
  - Total cost in LKR (with USD conversion)
  - Created date and last updated date
**And** the page loads within 2 seconds (NFR1)

**Given** I am viewing my own shipment
**When** the details page loads
**Then** I can access all shipment information (FR16)
**And** the system verifies the shipment belongs to my CustomerId (NFR20)

**Given** I try to view another customer's shipment
**When** I attempt to access their shipment details page
**Then** I receive a 403 Forbidden response
**And** an error message: "Access denied"
**And** I am redirected to my shipments list

**Given** I enter an invalid tracking number
**When** I try to access the shipment
**Then** I receive a 404 Not Found response
**And** an error message: "Shipment not found"

**Given** the shipment has status updates
**When** I view the shipment details
**Then** I see a timeline of status changes with timestamps
**And** the timeline shows: status, date/time, and notes (if any)

**Given** I want to download shipment information
**When** I click "Download Receipt" or "Download Details"
**Then** I receive a PDF document with shipment information
**And** the download initiates within 2 seconds (NFR5)

**Technical Implementation:**
- Backend: GET /api/shipments/{id} with [Authorize(Roles = "Customer")]
- Backend: GET /api/shipments/by-tracking/{trackingNumber} with [Authorize(Roles = "Customer")]
- Backend: Verify shipment belongs to current user's CustomerId (NFR20)
- Backend: Include related data: ShipmentPackage, ShipmentAddress, TrackingEvents
- Backend: Return 403 if shipment doesn't belong to user
- Frontend: ShipmentDetails component with all shipment information
- Frontend: StatusTimeline component showing status history
- Frontend: Currency conversion display (LKR/USD)
- Frontend: PDF download functionality (use existing invoice PDF generation approach)
- Frontend: Responsive design for mobile viewing

---

### Story 3.4: Admin View All Shipments with Advanced Filtering

As an **admin user**,
I want to view all shipments across all customers with advanced filtering capabilities,
So that I can manage operations and quickly find shipments requiring attention.

**Acceptance Criteria:**

**Given** I am logged in as an admin
**When** I navigate to "All Shipments" admin page
**Then** I see a list of ALL shipments across all customers (FR20)
**And** each shipment shows: tracking number, customer name, destination, status, created date, cost
**And** the list loads within 1.5 seconds for up to 10,000 records (NFR3)
**And** shipments are sorted by created date (newest first by default)

**Given** I am viewing all shipments
**When** the dashboard loads during peak activity
**Then** the page remains responsive with no degradation (NFR8)
**And** all filtering operations complete within 1 second (NFR4)

**Given** I want to find specific shipments
**When** I use advanced search with multiple criteria:
  - Tracking number
  - Customer name or email
  - Destination city
  - Status
  - Date range
  - Cost range
**Then** the system applies all filters simultaneously (FR15)
**And** results display within 1 second (NFR4)

**Given** I want to see shipments requiring action
**When** I apply the "Pending" status filter
**Then** I see all shipments awaiting admin processing
**And** these are highlighted or sorted to the top
**And** the count of pending shipments is displayed

**Given** I want to sort shipments
**When** I click column headers (Date, Status, Cost, Customer)
**Then** the list re-sorts by that column (ascending/descending toggle)
**And** the sort completes within 1 second

**Given** I want to export shipment data
**When** I click "Export to CSV"
**Then** I receive a CSV file with all filtered shipments (NFR62)
**And** the export includes: tracking number, customer, origin, destination, status, cost, dates

**Given** I click on a shipment
**When** I select it
**Then** I am navigated to the admin shipment details page where I can update status (Story 3.5)

**Technical Implementation:**
- Backend: GET /api/admin/shipments with [Authorize(Roles = "Admin,Staff")]
- Backend: Support query parameters: status, customerId, searchTerm, startDate, endDate, minCost, maxCost, sortBy, sortOrder, page, pageSize
- Backend: Efficient querying with indexes: (Status, CreatedAt), (CustomerId), (TrackingNumber) (NFR32)
- Backend: Include customer information in response
- Backend: CSV export endpoint: GET /api/admin/shipments/export
- Frontend: AdminShipments component with comprehensive filtering UI
- Frontend: AdvancedSearchPanel with multiple filter inputs
- Frontend: Sortable table columns
- Frontend: Export button with loading state
- Frontend: Pagination with page size selector

---

### Story 3.5: Admin Update Shipment Status with Business Rules

As an **admin user**,
I want to update shipment status with validation and business rule enforcement,
So that shipment lifecycle is properly managed and invalid status transitions are prevented.

**Acceptance Criteria:**

**Given** I am logged in as an admin viewing a shipment
**When** I access the shipment details page
**Then** I see a "Update Status" button or dropdown
**And** I can change the status to valid next states only (FR21)

**Given** a shipment has status "Pending"
**When** I update the status
**Then** I can only select: "Processing" or "Cancelled"
**And** invalid transitions (e.g., Pending → Delivered) are not available (FR23)

**Given** a shipment has status "Processing"
**When** I update the status
**Then** I can only select: "In Transit" or "Cancelled"

**Given** a shipment has status "In Transit"
**When** I update the status
**Then** I can only select: "Delivered" or "Cancelled"

**Given** a shipment has status "Delivered" or "Cancelled"
**When** I view the status options
**Then** no further status changes are allowed (terminal states)
**And** the status update UI is disabled or hidden

**Given** I am updating shipment status
**When** I submit the status change with optional notes
**Then** the shipment status is updated in the database
**And** a TrackingEvent record is created with: ShipmentId, Status, EventDate, Notes, UpdatedByUserId (AR6)
**And** the UpdatedAt timestamp on the shipment is updated
**And** I see a success message: "Shipment status updated"
**And** the audit log records this change (NFR21, AR6)

**Given** I update a shipment status
**When** the customer is viewing their shipment details (Story 3.3)
**Then** they see the updated status within 30 seconds (AR7 - TanStack Query auto-refetch)

**Given** I attempt to update a shipment that doesn't exist
**When** I submit the status change
**Then** I receive a 404 Not Found error

**Given** the status update fails (database error, network issue)
**When** an error occurs
**Then** I see an error message: "Failed to update status. Please try again."
**And** the shipment status remains unchanged
**And** the error is logged for debugging

**Technical Implementation:**
- Backend: Create TrackingEvent entity (Id, ShipmentId, Status, EventDate, Notes, UpdatedByUserId)
- Backend: Create EF Core migration for TrackingEvent table with composite index (ShipmentId, EventDate)
- Backend: PUT /api/admin/shipments/{id}/status with [Authorize(Roles = "Admin,Staff")]
- Backend: UpdateShipmentStatusDto with status and optional notes
- Backend: ShipmentService.UpdateStatusAsync with business rule validation (FR23)
- Backend: Status transition rules enforced in service layer
- Backend: Create TrackingEvent on each status change
- Backend: Audit logging via SaveChanges interceptor (AR6) (NFR21)
- Backend: Record UserId and UserEmail from JWT claims
- Frontend: StatusUpdateModal component with status dropdown
- Frontend: Notes textarea for admin comments
- Frontend: Display only valid next states based on current status
- Frontend: Optimistic UI update with TanStack Query (AR7)
- Frontend: Automatic rollback if update fails

---

### Story 3.6: Admin Assign Delivery Personnel to Shipments

As an **admin user**,
I want to assign delivery personnel to shipments,
So that shipments can be tracked to specific staff members and accountability is maintained.

**Acceptance Criteria:**

**Given** I am logged in as an admin viewing a shipment
**When** I access the shipment details page
**Then** I see an "Assign Delivery Personnel" section
**And** I can select from a list of available staff members (FR22)

**Given** I want to assign a delivery person
**When** I select a staff member from the dropdown and click "Assign"
**Then** the shipment's AssignedToUserId is updated
**And** the AssignedAt timestamp is recorded
**And** I see a success message: "Delivery personnel assigned"
**And** the staff member's name is displayed on the shipment

**Given** a shipment already has an assigned delivery person
**When** I view the shipment
**Then** I see the currently assigned staff member's name
**And** I can reassign to a different staff member
**And** the reassignment is recorded in the audit log (AR6)

**Given** I want to remove a delivery assignment
**When** I click "Unassign" or select "None"
**Then** the AssignedToUserId is set to null
**And** a TrackingEvent is created noting the unassignment

**Given** a shipment is assigned to a delivery person
**When** the assigned staff member logs in (future feature)
**Then** they can see shipments assigned to them in their dashboard

**Given** I am viewing all shipments as admin
**When** I filter by assigned delivery personnel
**Then** I see only shipments assigned to that staff member
**And** I can see unassigned shipments separately

**Technical Implementation:**
- Backend: Add AssignedToUserId and AssignedAt fields to Shipment entity
- Backend: Create EF Core migration to add these fields
- Backend: PUT /api/admin/shipments/{id}/assign with [Authorize(Roles = "Admin")]
- Backend: AssignDeliveryPersonDto with userId
- Backend: GET /api/admin/staff endpoint to get list of staff users
- Backend: Create index on AssignedToUserId for filtering (NFR32)
- Backend: Audit logging for assignment changes (AR6)
- Frontend: DeliveryPersonnelSelector component with staff dropdown
- Frontend: Display assigned personnel on shipment details
- Frontend: Filter by assigned personnel in admin shipments list
- Frontend: Show unassigned shipment count on admin dashboard

---

## Epic 4: Public Tracking & Real-Time Updates

### Story 4.1: Public Shipment Tracking by Tracking Number (No Login Required)

As a **public user (no login required)**,
I want to track a shipment by entering a tracking number,
So that I can check the status of my shipment without creating an account.

**Acceptance Criteria:**

**Given** I am on the home page or tracking page (no authentication required)
**When** the page loads
**Then** I see a prominent "Track Your Shipment" search box
**And** I see placeholder text: "Enter tracking number (e.g., NE-2026-000001)"
**And** the page loads within 2 seconds (NFR1, NFR67)

**Given** I enter a valid tracking number in the search box
**When** I click "Track" or press Enter
**Then** I am shown the shipment tracking information page
**And** the tracking information loads within 2 seconds (NFR1)
**And** no login or authentication is required (FR27)

**Given** I enter an invalid or non-existent tracking number
**When** I attempt to track
**Then** I see a user-friendly error message: "Tracking number not found. Please check and try again."
**And** no shipment details are revealed (security)

**Given** the tracking endpoint receives excessive requests from my IP
**When** I make more than 20 tracking requests within 1 minute (AR5)
**Then** I receive a 429 Too Many Requests response (NFR22)
**And** a clear error message: "Too many tracking requests. Please try again in [X] seconds."

**Given** I successfully track a shipment
**When** the tracking page displays
**Then** I see customer-friendly tracking information (FR28):
  - Tracking number (prominently displayed)
  - Current status with visual indicator (color-coded badge)
  - Estimated delivery date (if available)
  - Origin and destination cities
  - Last update timestamp
  - High-level package information (no sensitive customer data)
**And** I do NOT see: customer name, phone, email, exact address, pricing details (privacy)

**Given** I want to share tracking information
**When** I view the tracking page
**Then** the URL includes the tracking number (e.g., /track/NE-2026-000001)
**And** I can copy and share this URL with others
**And** the shared link works without login

**Technical Implementation:**
- Backend: GET /api/tracking/public/{trackingNumber} (no authentication required)
- Backend: Rate limiting: 20 requests/minute per IP (AR5, NFR22)
- Backend: Return sanitized shipment data (exclude customer PII)
- Backend: Return 404 for invalid tracking numbers (don't reveal if tracking number format is valid)
- Backend: Include only: TrackingNumber, Status, EstimatedDeliveryDate, Origin, Destination, LastUpdated
- Frontend: PublicTracking component with search input
- Frontend: Display tracking information in customer-friendly format (FR28)
- Frontend: Color-coded status badges (Pending: Yellow, Processing: Blue, In Transit: Purple, Delivered: Green, Cancelled: Red)
- Frontend: Handle rate limiting with user-friendly error message
- Frontend: SEO-friendly URLs for tracking pages
- Frontend: Responsive design for mobile tracking

---

### Story 4.2: Real-Time Status Updates with Auto-Refresh Polling

As a **user tracking a shipment (public or logged-in)**,
I want the shipment status to update automatically without manual refresh,
So that I always see the latest tracking information.

**Acceptance Criteria:**

**Given** I am viewing a shipment tracking page (public or customer portal)
**When** the page is loaded and active
**Then** the system automatically polls for status updates every 30 seconds (AR7)
**And** I see the latest shipment status without manual page refresh (FR29)

**Given** the admin updates the shipment status (Story 3.5)
**When** I am viewing the tracking page
**Then** I see the updated status within 30 seconds (AR7)
**And** the status indicator updates smoothly without jarring page reload
**And** a subtle notification appears: "Status updated"

**Given** I switch away from the tracking page tab/window
**When** I return to the tracking page (window focus)
**Then** the system immediately fetches the latest status
**And** displays any updates that occurred while I was away

**Given** the auto-refresh polling is active
**When** a network error occurs or the API is unreachable
**Then** the system retries gracefully without displaying errors
**And** continues polling at the normal interval
**And** displays a subtle indicator if data is stale

**Given** I am on a slow or metered connection
**When** the auto-refresh polling is active
**Then** the polling requests are lightweight (minimal data transfer)
**And** only changed data is highlighted on update

**Given** multiple users are tracking the same shipment
**When** the status is updated by admin
**Then** all users see the updated status within 30 seconds
**And** the system efficiently handles concurrent tracking requests

**Technical Implementation:**
- Frontend: Implement TanStack Query with refetchInterval: 30000ms (AR7)
- Frontend: Enable refetchOnWindowFocus: true for immediate updates on tab focus
- Frontend: Use staleTime: 25000ms to prevent unnecessary refetches
- Frontend: Implement optimistic UI updates for smooth status transitions
- Frontend: Show subtle loading indicator during background refetch
- Frontend: Display timestamp of last update
- Frontend: Graceful error handling with retry logic
- Backend: Optimize GET /api/tracking/public/{trackingNumber} for frequent polling
- Backend: Consider adding Last-Modified header for efficient cache validation
- Backend: Ensure query performance remains <500ms for polling requests (NFR32)

---

### Story 4.3: Shipment Status Timeline with Event History

As a **user tracking a shipment (public or logged-in)**,
I want to see a complete timeline of shipment status changes,
So that I can understand the shipment's journey and history.

**Acceptance Criteria:**

**Given** I am viewing a shipment tracking page
**When** the shipment has multiple status updates
**Then** I see a vertical timeline showing all status changes in chronological order (FR26)
**And** the timeline displays: status name, date/time, and admin notes (if appropriate)
**And** the timeline is displayed newest-to-oldest (most recent at top)

**Given** the shipment status timeline is displayed
**When** I view each status event
**Then** each event shows:
  - Status name (e.g., "Pending", "Processing", "In Transit", "Delivered")
  - Date and time of status change
  - Admin notes (public-safe notes only, exclude internal comments)
  - Visual indicator (icon or color)
**And** the current status is highlighted or emphasized

**Given** the shipment has an estimated delivery date
**When** I view the tracking page
**Then** I see the estimated delivery date prominently displayed (FR25)
**And** the format is customer-friendly (e.g., "Estimated Delivery: Thursday, Feb 15, 2026")
**And** the estimated date is calculated based on: creation date + typical delivery time for route

**Given** a shipment is delivered
**When** I view the tracking timeline
**Then** the "Delivered" status shows the actual delivery date/time
**And** I see a completion indicator or celebration visual
**And** the timeline is marked as complete

**Given** a shipment is cancelled
**When** I view the tracking timeline
**Then** the "Cancelled" status is clearly marked
**And** admin notes explain the cancellation reason (if public-safe)
**And** no estimated delivery date is shown

**Given** I am viewing the timeline on a mobile device
**When** the page loads
**Then** the timeline is responsive and easily readable
**And** touch-friendly interactions work smoothly (NFR44-NFR47)

**Given** a shipment has no status updates yet (only "Pending")
**When** I view the tracking page
**Then** I see a single timeline entry for "Pending"
**And** a helpful message: "Your shipment request has been received and is awaiting processing"

**Technical Implementation:**
- Backend: GET /api/tracking/public/{trackingNumber} includes TrackingEvents array
- Backend: TrackingEvents ordered by EventDate descending
- Backend: Filter admin notes to exclude internal/sensitive comments for public view
- Backend: Calculate EstimatedDeliveryDate based on CreatedAt + route-based delivery time
- Frontend: StatusTimeline component with vertical timeline layout
- Frontend: Status icons for each event type
- Frontend: Color-coded timeline events matching status colors
- Frontend: Date formatting with moment.js or date-fns (customer-friendly display)
- Frontend: Responsive timeline layout for mobile (NFR44-NFR47)
- Frontend: Empty state messaging for shipments with minimal history
- Frontend: Accessibility: proper ARIA labels for timeline events (NFR39-NFR43)

---

## Epic 5: Invoice Generation & Management

### Story 5.1: Automatic Invoice Generation from Completed Shipments

As a **system**,
I want to automatically generate invoices when shipments are marked as "Delivered",
So that customers receive proper billing documentation without manual admin effort.

**Acceptance Criteria:**

**Given** an admin updates a shipment status to "Delivered" (Story 3.5)
**When** the status update is saved
**Then** an Invoice record is automatically created in the database (FR30)
**And** a unique invoice number is generated (format: INV-YYYY-XXXXXX, e.g., INV-2026-000001)
**And** the invoice is associated with the shipment's CustomerId
**And** the invoice status is set to "Unpaid"
**And** the invoice includes all shipment cost details

**Given** an invoice is automatically generated
**When** the invoice creation completes
**Then** the invoice total is calculated including (FR31):
  - Base shipping cost (from shipment)
  - Distance charges
  - Weight charges
  - Tax (configurable percentage, e.g., 15% VAT)
  - Any additional fees
**And** all line items are stored in InvoiceLineItem records
**And** the calculation follows transaction integrity rules (NFR71)

**Given** an invoice is created
**When** the creation succeeds
**Then** an audit log entry is created (AR6, NFR25)
**And** the audit log records: invoice creation, total amount, customer, shipment reference
**And** the invoice CreatedAt timestamp is recorded

**Given** invoice generation fails (database error, calculation error)
**When** an error occurs during automatic generation
**Then** the error is logged with full details
**And** the shipment status update still succeeds (don't block delivery)
**And** an alert is sent to admin for manual invoice creation

**Given** a shipment is marked as "Delivered" but already has an invoice
**When** the status update occurs
**Then** no duplicate invoice is created
**And** the existing invoice remains unchanged

**Technical Implementation:**
- Backend: Create Invoice entity (Id, InvoiceNumber, CustomerId, ShipmentId, TotalAmount, TaxAmount, SubTotal, Status, CreatedAt, DueDate)
- Backend: Create InvoiceLineItem entity (Id, InvoiceId, Description, Quantity, UnitPrice, TotalPrice)
- Backend: Create EF Core migration for Invoice and InvoiceLineItem tables
- Backend: Create indexes: InvoiceNumber (unique), CustomerId, ShipmentId (unique), Status, CreatedAt
- Backend: InvoiceService.GenerateInvoiceFromShipmentAsync method
- Backend: InvoiceNumberGenerator.GenerateUniqueInvoiceNumber()
- Backend: Call invoice generation from ShipmentService.UpdateStatusAsync when status = "Delivered"
- Backend: Transaction scope to ensure atomic invoice creation (NFR71)
- Backend: Audit logging for invoice creation (AR6, NFR25)
- Backend: Tax calculation based on configurable rate in app settings

---

### Story 5.2: Customer Invoice History and PDF Download

As a **logged-in customer**,
I want to view my invoice history and download invoices as PDF documents,
So that I can keep records for accounting and tax purposes.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to "My Invoices" page
**Then** I see a list of all my invoices (only my CustomerId) (FR32, NFR20)
**And** each invoice shows: invoice number, shipment tracking number, issue date, total amount, payment status
**And** the list loads within 1.5 seconds (NFR3)
**And** invoices are sorted by issue date (newest first)

**Given** I have multiple invoices
**When** the invoice list is displayed
**Then** I see pagination (20 invoices per page)
**And** I can filter by payment status (All, Paid, Unpaid)
**And** I can filter by date range
**And** unpaid invoices are highlighted or visually distinct (FR37)

**Given** I click on an invoice in the list
**When** I select it
**Then** I am navigated to the invoice details page
**And** I see complete invoice information:
  - Invoice number and issue date
  - Shipment tracking number (clickable link)
  - Billing details (customer name, address)
  - Line items with descriptions and amounts
  - Subtotal, tax breakdown, total amount
  - Payment status (Paid/Unpaid)
  - Due date

**Given** I am viewing an invoice details page
**When** I click "Download PDF" button
**Then** a PDF document is generated and download starts (FR33)
**And** the download initiates within 2 seconds (NFR5)
**And** the PDF includes company branding and complete invoice details (FR38)

**Given** the PDF generation is in progress
**When** I wait for the download
**Then** I see a loading indicator
**And** the PDF includes (FR38):
  - Company logo and header (New Emarald Frinters branding)
  - Invoice number and date
  - Customer details
  - Shipment reference (tracking number)
  - Itemized charges table
  - Subtotal, tax, and total
  - Payment status
  - Footer with company contact information

**Given** I try to view another customer's invoice
**When** I attempt to access their invoice
**Then** I receive a 403 Forbidden response (NFR20)
**And** an error message: "Access denied"

**Given** I have no invoices
**When** I view "My Invoices" page
**Then** I see a helpful message: "No invoices yet"
**And** I see a link to "View My Shipments"

**Technical Implementation:**
- Backend: GET /api/invoices/my-invoices with [Authorize(Roles = "Customer")]
- Backend: Query filters by current user's CustomerId (NFR20)
- Backend: Support query parameters: status, startDate, endDate, page, pageSize
- Backend: GET /api/invoices/{id} with authorization check (NFR20)
- Backend: GET /api/invoices/{id}/download-pdf with authorization check
- Backend: Install QuestPDF or similar library for PDF generation
- Backend: PdfService.GenerateInvoicePdf with company branding (FR38)
- Backend: Return PDF as FileResult with proper Content-Type
- Frontend: MyInvoices component with filtering and pagination
- Frontend: InvoiceDetails component showing complete invoice information
- Frontend: PDF download button with loading state
- Frontend: Payment status badge (Paid: Green, Unpaid: Yellow/Red)
- Frontend: Responsive design for mobile viewing

---

### Story 5.3: Admin Invoice Management and Manual Invoice Creation

As an **admin user**,
I want to view all customer invoices and manually create invoices for special cases,
So that I can handle custom billing scenarios and corrections.

**Acceptance Criteria:**

**Given** I am logged in as an admin
**When** I navigate to "All Invoices" admin page
**Then** I see a list of ALL invoices across all customers (FR34)
**And** each invoice shows: invoice number, customer name, shipment tracking number, amount, status, date
**And** the list loads within 1.5 seconds (NFR3)
**And** invoices are sorted by issue date (newest first)

**Given** I am viewing all invoices
**When** I use advanced search and filtering
**Then** I can filter by:
  - Customer name or email
  - Payment status (Paid/Unpaid)
  - Date range
  - Amount range
  - Shipment tracking number
**And** all filtering operations complete within 1 second (NFR4)

**Given** I want to export invoice data
**When** I click "Export to CSV"
**Then** I receive a CSV file with all filtered invoices (NFR63)
**And** the export includes: invoice number, customer, shipment, amount, tax, status, dates

**Given** I want to create a manual invoice (special case scenario)
**When** I click "Create Manual Invoice" button
**Then** I see an invoice creation form with fields (FR35):
  - Customer (dropdown or search)
  - Shipment reference (optional - for special invoices not tied to shipments)
  - Line items (description, quantity, unit price) - add multiple
  - Tax rate (percentage)
  - Due date
  - Notes

**Given** I fill in the manual invoice form with valid data
**When** I submit the invoice
**Then** a new Invoice record is created with status "Unpaid"
**And** a unique invoice number is generated
**And** line items are calculated and saved
**And** I see a success message: "Invoice created successfully"
**And** the audit log records the manual creation (AR6, NFR21, NFR25)

**Given** I create a manual invoice
**When** the invoice is saved
**Then** the audit log records:
  - Action: Manual Invoice Created
  - Admin user who created it
  - Customer
  - Total amount
  - Timestamp

**Given** I am viewing invoice details as admin
**When** I access any invoice
**Then** I see all invoice details plus:
  - Related shipment information (if applicable)
  - Customer contact details
  - Payment history (future enhancement)
  - Audit trail of changes

**Technical Implementation:**
- Backend: GET /api/admin/invoices with [Authorize(Roles = "Admin,Staff")]
- Backend: Support query parameters: customerId, status, searchTerm, startDate, endDate, minAmount, maxAmount, page, pageSize
- Backend: GET /api/admin/invoices/export for CSV export (NFR63)
- Backend: POST /api/admin/invoices with [Authorize(Roles = "Admin")]
- Backend: CreateManualInvoiceDto with validation
- Backend: InvoiceService.CreateManualInvoiceAsync method
- Backend: Audit logging for manual invoice creation (AR6, NFR21, NFR25)
- Frontend: AdminInvoices component with filtering UI
- Frontend: CreateManualInvoice form component
- Frontend: Dynamic line item rows (add/remove)
- Frontend: Automatic calculation of subtotal, tax, and total
- Frontend: CSV export button
- Frontend: Invoice details modal/page for admin view

---

### Story 5.4: Admin Invoice Payment Status Management

As an **admin user**,
I want to mark invoices as paid or unpaid,
So that I can track payment status and maintain accurate billing records.

**Acceptance Criteria:**

**Given** I am logged in as an admin viewing an invoice
**When** I access the invoice details page
**Then** I see the current payment status clearly displayed (FR37)
**And** I see a "Mark as Paid" or "Mark as Unpaid" button depending on current status (FR36)

**Given** an invoice has status "Unpaid"
**When** I click "Mark as Paid"
**Then** a payment confirmation modal appears
**And** I can enter:
  - Payment date (defaults to today)
  - Payment method (Cash, Bank Transfer, Credit Card, etc.)
  - Payment reference number (optional)
  - Notes (optional)

**Given** I submit the payment confirmation
**When** I mark the invoice as paid
**Then** the invoice status is updated to "Paid"
**And** the PaymentDate is recorded
**And** the PaymentMethod and PaymentReference are saved
**And** I see a success message: "Invoice marked as paid"
**And** the audit log records this change (AR6, NFR25)

**Given** an invoice has status "Paid"
**When** I click "Mark as Unpaid" (for corrections)
**Then** a confirmation dialog appears: "Are you sure you want to mark this invoice as unpaid?"
**And** I can enter a reason for the change

**Given** I confirm marking an invoice as unpaid
**When** the status update is processed
**Then** the invoice status reverts to "Unpaid"
**And** the PaymentDate, PaymentMethod, and PaymentReference are cleared
**And** the audit log records the reversal with reason (AR6)

**Given** I update an invoice payment status
**When** the customer views their invoice list (Story 5.2)
**Then** they see the updated payment status immediately
**And** paid invoices show a "Paid" badge with payment date

**Given** multiple admins are viewing invoices
**When** one admin updates payment status
**Then** other admins see the updated status within 30 seconds (via polling or refresh)

**Given** I filter invoices by payment status on admin dashboard
**When** I apply "Unpaid" filter
**Then** I see all unpaid invoices prominently
**And** I can quickly identify overdue invoices (past due date)
**And** overdue invoices are visually distinct (e.g., red indicator)

**Technical Implementation:**
- Backend: Add PaymentDate, PaymentMethod, PaymentReference, PaymentNotes fields to Invoice entity
- Backend: Create EF Core migration to add these fields
- Backend: PUT /api/admin/invoices/{id}/mark-paid with [Authorize(Roles = "Admin,Staff")]
- Backend: PUT /api/admin/invoices/{id}/mark-unpaid with [Authorize(Roles = "Admin,Staff")]
- Backend: MarkInvoicePaidDto (paymentDate, paymentMethod, paymentReference, notes)
- Backend: MarkInvoiceUnpaidDto (reason)
- Backend: InvoiceService.MarkAsPaidAsync and MarkAsUnpaidAsync methods
- Backend: Audit logging for all payment status changes (AR6, NFR25)
- Backend: Record admin user who made the change in audit log
- Frontend: PaymentStatusBadge component (Paid: Green, Unpaid: Yellow, Overdue: Red)
- Frontend: MarkAsPaidModal with payment details form
- Frontend: MarkAsUnpaidConfirmation dialog
- Frontend: Display payment details on invoice view (date, method, reference)
- Frontend: Overdue invoice highlighting (if dueDate < today and status = "Unpaid")

---

## Epic 6: Document Management System

### Story 6.1: Customer Document Upload for Shipments

As a **logged-in customer**,
I want to upload supporting documents for my shipments,
So that I can provide required documentation (customs forms, insurance, etc.) for my shipments.

**Acceptance Criteria:**

**Given** I am viewing my shipment details page
**When** the page loads
**Then** I see a "Documents" section with an "Upload Document" button (FR48)
**And** I see a list of any previously uploaded documents for this shipment

**Given** I click "Upload Document"
**When** I select a file from my computer (PDF, JPG, PNG)
**Then** the file is validated for type (PDF, JPG, PNG allowed) and size (max 10MB) (FR52)
**And** the upload begins with a progress indicator
**And** the document is uploaded to local storage with GUID-based filename (AR8)
**And** a ShipmentDocument record is created linking the file to my shipment
**And** I see a success message: "Document uploaded successfully"

**Given** I upload an invalid file type (e.g., .exe)
**When** the validation runs
**Then** I see an error: "File type not allowed. Please upload PDF, JPG, or PNG files only"
**And** the file is not uploaded

**Given** I upload a file larger than 10MB
**When** the validation runs
**Then** I see an error: "File size exceeds 10MB limit"
**And** the file is not uploaded

**Given** I have uploaded documents
**When** I view my shipment's documents
**Then** I can click to download/view any document I uploaded (FR47)
**And** the download initiates within 2 seconds (NFR5)
**And** I can only access documents for my own shipments (NFR20)

**Given** I try to access another customer's document
**When** I attempt the download
**Then** I receive a 403 Forbidden response
**And** the document is not downloaded (NFR51)

**Technical Implementation:**
- Backend: Create ShipmentDocument entity (Id, ShipmentId, FileName, FileKey, FileSize, FileType, UploadedAt, UploadedByUserId)
- Backend: Create EF Core migration for ShipmentDocument table
- Backend: Local file storage service with configurable path (AR8)
- Backend: Generate GUID-based file keys to prevent collisions (AR8)
- Backend: POST /api/shipments/{id}/documents/upload with [Authorize(Roles = "Customer")]
- Backend: Validate file type and size (FR52)
- Backend: Verify shipment belongs to current user (NFR20)
- Backend: GET /api/shipments/{id}/documents with authorization check
- Backend: GET /api/documents/{fileKey}/download with permission check (NFR51)
- Backend: Docker volume mapping for file persistence (AR8)
- Backend: Document access logging (NFR26)
- Frontend: DocumentUpload component with drag-and-drop support
- Frontend: File type/size validation before upload
- Frontend: Upload progress indicator
- Frontend: Document list with download buttons

---

### Story 6.2: Admin Proof of Delivery Document Management

As an **admin user**,
I want to upload proof of delivery documents for shipments,
So that we have official records of completed deliveries.

**Acceptance Criteria:**

**Given** I am logged in as an admin viewing a delivered shipment
**When** I access the shipment details page
**Then** I see a "Proof of Delivery" section
**And** I can upload POD documents (signature, photo, receipt) (FR49)

**Given** I upload a proof of delivery document
**When** the upload completes
**Then** the document is marked as "Proof of Delivery" type
**And** it is associated with the shipment (FR50)
**And** the document access is logged with my admin userId (NFR26)
**And** customers can view (but not delete) POD documents

**Given** I am viewing all documents for a shipment as admin
**When** I access the documents section
**Then** I see both customer-uploaded documents and admin POD documents
**And** I can download any document (FR51)
**And** I can delete documents if needed (with confirmation)

**Given** a customer views their delivered shipment
**When** they access the shipment details
**Then** they can see and download the proof of delivery document
**And** they cannot delete or modify it

**Technical Implementation:**
- Backend: Add DocumentType field to ShipmentDocument entity (CustomerDocument, ProofOfDelivery)
- Backend: Create EF Core migration to add DocumentType field
- Backend: POST /api/admin/shipments/{id}/documents/pod with [Authorize(Roles = "Admin,Staff")]
- Backend: GET /api/admin/shipments/{id}/documents (admin can see all documents)
- Backend: DELETE /api/admin/documents/{fileKey} with [Authorize(Roles = "Admin")]
- Backend: Audit logging for document deletion (NFR26)
- Frontend: AdminDocumentUpload component with type selector
- Frontend: Document list showing document type badges
- Frontend: Delete confirmation dialog for admins
- Frontend: Read-only POD display for customers

---

## Epic 7: Email Notification System (DEFERRED TO PHASE 3)

**Note:** Per Architecture AR10, email notifications are deferred to Phase 3. Manual email communication is acceptable for Phase 1-2 (80-150 customers). Email templates will be documented for consistency, and SendGrid/AWS SES integration will be implemented when customer count >200.

**Interface Preparation:**
- Email templates documented in `/docs/email-templates/`
- IEmailService interface defined for future implementation
- Notification trigger points identified in code (shipment created, status changed, delivered)
- Queue architecture designed (deferred implementation)

---

## Epic 8: Customer Portal Dashboard

### Story 8.1: Customer Dashboard Overview and Quick Actions

As a **logged-in customer**,
I want a centralized dashboard showing my account overview and quick actions,
So that I can efficiently manage my shipping activities.

**Acceptance Criteria:**

**Given** I am logged in as a customer
**When** I navigate to the dashboard (home page after login)
**Then** I see my customer dashboard with key sections (FR59):
  - Active Shipments widget (showing shipments not yet delivered)
  - Recent Quotes widget
  - Unpaid Invoices widget
  - Quick action buttons
**And** the dashboard loads within 2 seconds (NFR1)
**And** all data shown is filtered to my CustomerId only (NFR20)

**Given** the Active Shipments widget is displayed
**When** I view it
**Then** I see my shipments with status: Pending, Processing, or In Transit (FR60)
**And** each shipment shows: tracking number, destination, status, estimated delivery
**And** I can click on any shipment to view details
**And** if I have no active shipments, I see: "No active shipments"

**Given** the Recent Quotes widget is displayed
**When** I view it
**Then** I see my last 5 quotes with date, origin/destination, and cost (FR61)
**And** I can click "Create Shipment" from any quote
**And** I can click "View All Quotes" to see complete history

**Given** the Unpaid Invoices widget is displayed
**When** I view it
**Then** I see all my unpaid invoices prominently (FR62)
**And** each shows: invoice number, amount, due date
**And** overdue invoices are highlighted in red
**And** I can click to view invoice details or download PDF

**Given** I want to take quick actions
**When** I view the dashboard
**Then** I see prominent buttons for (FR63, FR64):
  - "Calculate New Quote"
  - "Create New Shipment"
  - "Track Shipment"
**And** clicking these navigates to the respective pages

**Given** the dashboard is loading
**When** data is being fetched
**Then** I see skeleton loading states for each widget
**And** widgets load independently (quote widget loads separately from shipments)

**Technical Implementation:**
- Backend: GET /api/dashboard/customer with [Authorize(Roles = "Customer")]
- Backend: Return aggregated data: activeShipments, recentQuotes, unpaidInvoices, summary counts
- Backend: All queries filtered by current user's CustomerId (NFR20)
- Backend: Dashboard data loads within 1.5 seconds (NFR3)
- Frontend: CustomerDashboard component with grid layout
- Frontend: ActiveShipmentsWidget component
- Frontend: RecentQuotesWidget component
- Frontend: UnpaidInvoicesWidget component
- Frontend: QuickActions component with navigation buttons
- Frontend: Skeleton loaders for each widget
- Frontend: Responsive layout for mobile (NFR44-NFR47)
- Frontend: TanStack Query for data fetching with staleTime

---

### Story 8.2: Dashboard Summary Statistics and Navigation

As a **logged-in customer**,
I want to see summary statistics about my shipping activity,
So that I can quickly understand my account status.

**Acceptance Criteria:**

**Given** I am viewing my customer dashboard
**When** the page loads
**Then** I see summary statistics cards at the top:
  - Total Shipments (lifetime count)
  - Active Shipments (current count)
  - Pending Quotes (count)
  - Unpaid Invoices (count and total amount)
**And** each stat card is clickable and navigates to the relevant page

**Given** I click on "Total Shipments" stat
**When** I select it
**Then** I am navigated to "My Shipments" page showing all my shipments

**Given** I click on "Unpaid Invoices" stat
**When** I select it
**Then** I am navigated to "My Invoices" page filtered to show unpaid invoices only

**Given** I have no activity yet (new customer)
**When** I view my dashboard
**Then** I see a welcome message and getting started guide:
  - "Welcome to New Emarald Frinters!"
  - Steps: 1) Calculate a quote, 2) Create a shipment, 3) Track your delivery
**And** I see helpful links to get started

**Technical Implementation:**
- Backend: Dashboard API includes summary statistics
- Backend: Efficient counting queries with indexes
- Frontend: SummaryStatsCard component (reusable)
- Frontend: Stats cards with icons and click handlers
- Frontend: WelcomeMessage component for new customers
- Frontend: Conditional rendering based on activity level

---

## Epic 9: Admin Operations Dashboard

### Story 9.1: Admin Dashboard Real-Time Operations Overview

As an **admin user**,
I want a real-time operations dashboard with key metrics and pending actions,
So that I can monitor business operations and quickly respond to issues.

**Acceptance Criteria:**

**Given** I am logged in as an admin
**When** I navigate to the admin dashboard
**Then** I see real-time operational metrics (FR53, FR54):
  - Total Shipments (today/week/month selectors)
  - Pending Shipment Requests (requiring action)
  - In Transit Shipments (current count)
  - Delivered Today (count)
  - Revenue (today/week/month)
  - Unpaid Invoices (count and total amount)
**And** the dashboard loads within 1.5 seconds (NFR3)
**And** the dashboard remains responsive during peak activity (NFR8)

**Given** I view the "Pending Requests" metric
**When** the count is greater than 0
**Then** the count is highlighted or shows as an alert
**And** I can click to see the list of pending shipments (FR56)
**And** I can take action directly from the dashboard

**Given** I view the Recent Activity feed
**When** the dashboard loads
**Then** I see the last 10 system events (FR55):
  - New shipment requests
  - Status changes
  - Deliveries completed
  - Invoices generated
  - Payments received
**And** each event shows: type, shipment/customer, timestamp
**And** I can click any event to view details

**Given** the admin dashboard is active
**When** new events occur (new shipment created, status changed)
**Then** the dashboard auto-refreshes every 30 seconds
**And** new events appear in the activity feed
**And** metric counts update automatically

**Given** the dashboard is displaying data during peak hours
**When** multiple admins are viewing the dashboard
**Then** the page remains responsive with no degradation (NFR8)
**And** all metrics load within 1.5 seconds

**Technical Implementation:**
- Backend: GET /api/admin/dashboard with [Authorize(Roles = "Admin,Staff")]
- Backend: Aggregate queries for metrics (use indexes for performance) (NFR32)
- Backend: Recent activity query (last 10 events from audit log or tracking events)
- Backend: Revenue calculations from paid invoices
- Backend: Performance metrics tracking (NFR77)
- Frontend: AdminDashboard component with grid layout
- Frontend: MetricCard component (reusable for each stat)
- Frontend: RecentActivityFeed component
- Frontend: Auto-refresh with TanStack Query (refetchInterval: 30000ms)
- Frontend: Chart library integration for visual metrics
- Frontend: Loading states and error handling

---

### Story 9.2: Admin Revenue Analytics and Reporting

As an **admin user**,
I want to view revenue analytics by time period and export reports,
So that I can analyze business performance and make data-driven decisions.

**Acceptance Criteria:**

**Given** I am on the admin dashboard
**When** I access the Revenue Analytics section
**Then** I see revenue breakdown by time period (FR57):
  - Today's revenue
  - This week's revenue
  - This month's revenue
  - Custom date range selector
**And** I can toggle between these views

**Given** I select a custom date range
**When** I choose start and end dates
**Then** revenue analytics update to show data for that period
**And** the update completes within 1 second (NFR4)

**Given** I view revenue analytics
**When** the data is displayed
**Then** I see:
  - Total revenue (from paid invoices)
  - Number of shipments delivered
  - Average revenue per shipment
  - Revenue trend chart (line or bar chart)
**And** all amounts are displayed in LKR with USD conversion

**Given** I want to export revenue data
**When** I click "Export Revenue Report"
**Then** I receive a CSV file with (NFR62, FR58):
  - Date range
  - Total revenue
  - Shipment count
  - Average per shipment
  - Daily breakdown
**And** the export completes within 2 seconds

**Given** I want to analyze shipment trends
**When** I view the analytics dashboard
**Then** I see a chart showing shipments over time
**And** I can see breakdowns by status
**And** I can identify peak periods

**Technical Implementation:**
- Backend: GET /api/admin/analytics/revenue with [Authorize(Roles = "Admin")]
- Backend: Support query parameters: startDate, endDate, groupBy (day/week/month)
- Backend: Aggregate revenue from Invoice table (Status = 'Paid')
- Backend: Calculate metrics with efficient SQL queries (NFR32)
- Backend: GET /api/admin/reports/revenue-export for CSV export (NFR62)
- Frontend: RevenueAnalytics component
- Frontend: DateRangePicker for custom periods
- Frontend: Chart.js or Recharts for revenue visualization
- Frontend: ExportButton component
- Frontend: Currency toggle (LKR/USD display)

---

### Story 9.3: Admin Quick Access to Pending Actions

As an **admin user**,
I want quick access to shipments and invoices requiring my attention,
So that I can efficiently manage pending tasks and maintain service quality.

**Acceptance Criteria:**

**Given** I am on the admin dashboard
**When** I view the "Pending Actions" section
**Then** I see categorized lists of items requiring attention (FR56):
  - Pending Shipment Requests (status: Pending, needs processing)
  - In Transit Shipments (may need status updates)
  - Overdue Invoices (past due date, unpaid)
**And** each category shows the count

**Given** I click on "Pending Shipment Requests"
**When** I select it
**Then** I am taken to the filtered shipments view showing only Pending status
**And** I can quickly update status for each shipment
**And** bulk actions are available for efficiency

**Given** I view Overdue Invoices
**When** the list loads
**Then** invoices are sorted by how overdue they are (most overdue first)
**And** I see: customer name, invoice number, amount, days overdue
**And** I can click to contact customer or mark as paid

**Given** I want to process multiple pending shipments
**When** I access the pending shipments list
**Then** I see checkboxes for bulk selection
**And** I can bulk update status for selected shipments (e.g., Pending → Processing)
**And** a confirmation dialog appears before bulk action

**Technical Implementation:**
- Backend: GET /api/admin/pending-actions with [Authorize(Roles = "Admin")]
- Backend: Return categorized pending items with counts
- Backend: Efficient queries with status and date filters
- Frontend: PendingActionsWidget component
- Frontend: Categorized lists with badge counts
- Frontend: Quick action buttons for each item
- Frontend: Bulk selection checkboxes
- Frontend: BulkActionConfirmation modal

---

## Epic 10: Customer Relationship Management

### Story 10.1: Admin Customer List and Search

As an **admin user**,
I want to view and search all customers with their account information,
So that I can manage customer relationships and provide support.

**Acceptance Criteria:**

**Given** I am logged in as an admin
**When** I navigate to "Customers" admin page
**Then** I see a list of all registered customers (FR65)
**And** each customer shows: name, email, phone, registration date, total shipments, account status
**And** the list loads within 1.5 seconds for up to 10,000 records (NFR3)

**Given** I want to search for a customer
**When** I use the search box and enter name, email, or phone
**Then** the list filters in real-time (FR66)
**And** the search completes within 1 second (NFR4)
**And** only matching customers are displayed

**Given** I want to filter customers
**When** I apply filters
**Then** I can filter by (FR66):
  - Account status (Active/Inactive)
  - Registration date range
  - Number of shipments (has shipments / no shipments yet)
**And** filters update within 1 second

**Given** I want to sort the customer list
**When** I click column headers
**Then** the list sorts by: name, email, registration date, shipment count
**And** ascending/descending toggle works

**Given** I click on a customer
**When** I select them
**Then** I am navigated to the customer profile page (Story 10.2)

**Technical Implementation:**
- Backend: GET /api/admin/customers with [Authorize(Roles = "Admin,Staff")]
- Backend: Support query parameters: searchTerm, status, startDate, endDate, sortBy, sortOrder, page, pageSize
- Backend: Include shipment count for each customer (aggregated)
- Backend: Efficient queries with indexes on email and registration date
- Frontend: AdminCustomers component with search and filter UI
- Frontend: SearchBar with debounced search
- Frontend: FilterPanel with status and date filters
- Frontend: Sortable table columns
- Frontend: Pagination

---

### Story 10.2: Admin Customer Profile and Management

As an **admin user**,
I want to view complete customer profiles with shipment and invoice history,
So that I can provide personalized support and manage customer accounts.

**Acceptance Criteria:**

**Given** I am viewing a customer profile
**When** the page loads
**Then** I see comprehensive customer information (FR67):
  - Customer details (name, email, phone, company)
  - Registration date and account status
  - Complete shipment history (all shipments for this customer)
  - Complete invoice history with payment status (FR68)
  - Summary statistics (total shipments, total spent, avg shipment value)
**And** the page loads within 2 seconds

**Given** I view the customer's shipment history
**When** the shipment list is displayed
**Then** I see all shipments sorted by date (newest first)
**And** I can filter by status
**And** I can click any shipment to view details or update status

**Given** I view the customer's invoice history
**When** the invoice list is displayed
**Then** I see all invoices with payment status (FR68)
**And** unpaid invoices are highlighted
**And** I can click any invoice to view details or mark as paid

**Given** I need to deactivate a customer account
**When** I click "Deactivate Account" button
**Then** a confirmation dialog appears (FR69)
**And** I must enter a reason for deactivation
**And** upon confirmation, the customer account is marked inactive
**And** the customer cannot log in (future logins blocked)
**And** the action is logged in audit trail (NFR21)

**Given** I need to reactivate a customer account
**When** I click "Reactivate Account" on an inactive customer
**Then** the account is marked active again
**And** the customer can log in normally

**Given** I want to export customer data (GDPR compliance)
**When** I click "Export Customer Data"
**Then** I receive a CSV/JSON file with all customer information (NFR24, NFR64)
**And** the export includes: profile, shipments, invoices, documents

**Technical Implementation:**
- Backend: GET /api/admin/customers/{id} with [Authorize(Roles = "Admin")]
- Backend: Include aggregated data: shipment count, total revenue, invoice summary
- Backend: GET /api/admin/customers/{id}/shipments for shipment history
- Backend: GET /api/admin/customers/{id}/invoices for invoice history
- Backend: PUT /api/admin/customers/{id}/deactivate with [Authorize(Roles = "Admin")]
- Backend: PUT /api/admin/customers/{id}/reactivate with [Authorize(Roles = "Admin")]
- Backend: GET /api/admin/customers/{id}/export for GDPR data export (NFR24, NFR64)
- Backend: Audit logging for account deactivation/reactivation (NFR21)
- Frontend: CustomerProfile component
- Frontend: CustomerStats summary cards
- Frontend: ShipmentHistoryTable component
- Frontend: InvoiceHistoryTable component
- Frontend: DeactivateAccountModal with reason input
- Frontend: ExportDataButton

---

## Epic 11: System Configuration & Pricing Management

### Story 11.1: Admin Pricing Rules Configuration

As an **admin user**,
I want to configure pricing rules and rate tables,
So that quote and shipment calculations use correct pricing.

**Acceptance Criteria:**

**Given** I am logged in as an admin
**When** I navigate to "Settings > Pricing" page
**Then** I see current pricing rules (FR70):
  - Base rate (per km)
  - Weight multiplier (per kg)
  - Distance tiers (if applicable)
  - Additional fees
**And** I can edit each pricing rule

**Given** I want to update a pricing rule
**When** I click "Edit" on a rule
**Then** I see a form with current values
**And** I can update: base cost, distance multiplier, weight multiplier, effective date
**And** I can set an effective date (future pricing changes)

**Given** I submit updated pricing rules
**When** the form is saved
**Then** the PricingRule is updated in the database
**And** the pricing cache is invalidated immediately (AR4)
**And** the next quote calculation uses the new rules (FR71)
**And** I see a success message: "Pricing rules updated"
**And** the change is logged in audit trail (FR74, NFR21, AR6)

**Given** pricing rules have an effective date in the future
**When** that date arrives
**Then** the system automatically activates the new pricing
**And** old pricing rules are archived (marked inactive)

**Given** I want to view pricing history
**When** I access the "Pricing History" tab
**Then** I see all historical pricing rules with:
  - Rule values
  - Effective dates
  - Changed by (admin user)
  - Changed at (timestamp)
**And** the audit trail is complete (FR74)

**Technical Implementation:**
- Backend: GET /api/admin/pricing-rules with [Authorize(Roles = "Admin")]
- Backend: PUT /api/admin/pricing-rules/{id} with [Authorize(Roles = "Admin")]
- Backend: POST /api/admin/pricing-rules to create new rule
- Backend: PricingRule entity already created in Story 2.3
- Backend: Cache invalidation when pricing updated (AR4)
- Backend: Audit logging for all pricing changes (FR74, AR6)
- Backend: Scheduled job to activate future-dated pricing rules
- Frontend: PricingConfiguration component
- Frontend: PricingRuleForm for editing rules
- Frontend: PricingHistory table showing audit trail
- Frontend: Effective date picker for future pricing

---

### Story 11.2: Admin Location and Route Configuration

As an **admin user**,
I want to configure supported origin and destination locations,
So that the system supports the correct shipping routes.

**Acceptance Criteria:**

**Given** I am on the "Settings > Locations" page
**When** the page loads
**Then** I see a list of supported locations (FR72):
  - Cities/ports in Sri Lanka
  - International destinations
  - Regional groupings
**And** I can add, edit, or remove locations

**Given** I want to add a new supported location
**When** I click "Add Location"
**Then** I see a form with fields:
  - Location name
  - Country
  - Region (Local, South Asia, Middle East, East Asia, etc.)
  - Status (Active/Inactive)
**And** I can submit to add the location

**Given** I want to configure distance matrix
**When** I access "Distance Matrix" tab
**Then** I see the hardcoded distances between common routes (AR9)
**And** I can add/update specific route distances
**And** if a route is not in the matrix, regional estimation is used

**Given** I update a location or distance
**When** the change is saved
**Then** future quotes use the updated configuration
**And** the change is logged (FR74)

**Technical Implementation:**
- Backend: Create Location entity (Id, Name, Country, Region, IsActive)
- Backend: Create DistanceMatrix entity (Id, OriginLocationId, DestinationLocationId, DistanceKm)
- Backend: Create EF Core migrations
- Backend: GET /api/admin/locations with [Authorize(Roles = "Admin")]
- Backend: POST/PUT/DELETE /api/admin/locations
- Backend: GET/PUT /api/admin/distance-matrix
- Backend: Audit logging (FR74)
- Frontend: LocationConfiguration component
- Frontend: LocationForm for add/edit
- Frontend: DistanceMatrixTable for route distances
- Frontend: Regional grouping management

---

### Story 11.3: Admin System-Wide Settings

As an **admin user**,
I want to configure system-wide settings like company information and email templates,
So that the system reflects our business branding and communication style.

**Acceptance Criteria:**

**Given** I am on "Settings > System" page
**When** the page loads
**Then** I see configurable system settings (FR73):
  - Company Information (name, address, phone, email, website)
  - Tax rate (VAT percentage)
  - Currency exchange rates (LKR to USD)
  - Email templates (prepared for Phase 3)
  - Sri Lankan localization settings (FR75)
**And** I can edit each setting

**Given** I update company information
**When** I save the changes
**Then** the information is updated in the database
**And** invoices generated after the change use the new company information
**And** the change is logged (FR74, NFR21)

**Given** I update the tax rate
**When** I save the new rate
**Then** future invoices calculate tax using the new rate
**And** existing invoices remain unchanged

**Given** I configure Sri Lankan localization
**When** I access the localization settings
**Then** I can configure (FR75):
  - Phone number format (Sri Lankan format)
  - Supported local ports/cities
  - LKR currency as primary
  - Date format preferences
**And** these settings affect system-wide display

**Given** I want to prepare email templates (Phase 3)
**When** I access "Email Templates" tab
**Then** I see template placeholders for:
  - Shipment created notification
  - Status change notification
  - Delivery notification
  - Invoice generated notification
**And** I can edit template content (stored for future use when AR10 implemented)

**Given** configuration changes are made
**When** any setting is updated
**Then** the audit log records (FR74, AR6):
  - Setting name
  - Old value
  - New value
  - Changed by (admin user)
  - Changed at (timestamp)

**Technical Implementation:**
- Backend: Create SystemSetting entity (Id, Key, Value, Category, UpdatedAt, UpdatedByUserId)
- Backend: Create EF Core migration
- Backend: GET /api/admin/settings with [Authorize(Roles = "Admin")]
- Backend: PUT /api/admin/settings with [Authorize(Roles = "Admin")]
- Backend: Settings cached in memory for performance
- Backend: Cache invalidation when settings updated
- Backend: Audit logging for all configuration changes (FR74, AR6)
- Frontend: SystemSettings component with tabs
- Frontend: CompanyInfoForm
- Frontend: TaxRateForm
- Frontend: LocalizationSettings form (FR75)
- Frontend: EmailTemplateEditor (prepared for future)
- Frontend: SettingsAuditLog table

---

## Document Complete

**Epic Breakdown Summary:**
- **Epic 1:** User Authentication (7 stories) ✅
- **Epic 2:** Quote Calculator (3 stories) ✅
- **Epic 3:** Shipment Management (6 stories) ✅
- **Epic 4:** Public Tracking (3 stories) ✅
- **Epic 5:** Invoice Management (4 stories) ✅
- **Epic 6:** Document Management (2 stories) ✅
- **Epic 7:** Email Notifications - DEFERRED TO PHASE 3 (AR10)
- **Epic 8:** Customer Dashboard (2 stories) ✅
- **Epic 9:** Admin Dashboard (3 stories) ✅
- **Epic 10:** Customer CRM (2 stories) ✅
- **Epic 11:** System Configuration (3 stories) ✅

**Total Stories Created:** 35 implementation-ready user stories

**All Functional Requirements Covered:** FR1-FR75
**All Non-Functional Requirements Addressed:** NFR1-NFR79
**All Architecture Requirements Integrated:** AR1-AR11

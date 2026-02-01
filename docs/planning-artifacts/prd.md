---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - 'doc.md'
  - 'Frontend/README.md'
workflowType: 'prd'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 2
classification:
  projectType: web_app
  domain: logistics
  complexity: medium
  projectContext: brownfield
  purpose: documenting_existing_system
---

# Product Requirements Document - New_Emarald_Frinters

**Author:** Anushanga Kaluarachch
**Date:** 2026-01-31

## Success Criteria

### User Success

**For Customers (Shippers/Businesses):**

**Self-Service Efficiency:**
- Customers can obtain accurate shipping quotes within 2 minutes without contacting staff
- Customers can create and submit shipment requests independently through the portal
- Real-time tracking accessible 24/7 with visual timeline showing shipment status
- Invoice history and payment status visible at any time through customer dashboard

**Transparency & Control:**
- Immediate tracking number generation upon shipment creation
- Status update notifications via email for key milestones (Picked Up, In Transit, Out for Delivery, Delivered)
- Clear breakdown of pricing components (weight cost + distance cost + speed premium)
- Multi-currency support (LKR/USD) with real-time conversion for international customers

**The "Aha!" Moment:**
When customers realize they can get instant quotes, track shipments in real-time, and manage all their shipping operations without phone calls or email chains - saving hours per week.

**For Admin/Staff:**

**Operational Efficiency:**
- Process shipment requests 3x faster than manual entry
- Update shipment status across all customer touchpoints with single action
- Generate invoices automatically from completed shipments
- Dashboard provides real-time visibility into all active shipments and pending invoices

**Workload Reduction:**
- 80% reduction in "Where is my shipment?" customer inquiries due to self-service tracking
- 70% reduction in manual quote calculations due to automated pricing engine
- Automated email notifications eliminate manual status update communications

### Business Success

**Operational Metrics (3-6 months):**
- **Shipment Processing:** Handle 50+ shipments per week with same admin headcount
- **Quote-to-Booking Conversion:** 40% of calculated quotes convert to actual shipments
- **Customer Self-Service Rate:** 75% of customers use portal for quotes and tracking without staff assistance
- **Invoice Processing Time:** Average invoice generation and delivery within 24 hours of shipment completion

**Customer Satisfaction (6-12 months):**
- **Customer Retention:** 85% of customers remain active quarter-over-quarter
- **Platform Adoption:** 70% of regular customers (5+ shipments/year) actively use the portal
- **Net Promoter Score (NPS):** Target NPS of 50+ for platform ease-of-use
- **Support Ticket Reduction:** 60% reduction in tracking-related support requests

**Revenue & Growth (12+ months):**
- **Revenue Growth:** 30% increase in shipments processed year-over-year
- **Average Shipment Value:** Maintain or increase average shipment value through premium service visibility
- **Payment Collection:** 90% of invoices paid within terms (due date)
- **Multi-Service Usage:** 40% of customers use 2+ service types (Sea + Air, or Sea + Warehousing)

**Market Position:**
- Recognized as the most technologically advanced freight forwarder in Sri Lankan market
- First shipping company in Sri Lanka offering full self-service digital platform
- Preferred partner for businesses requiring transparent, trackable logistics

### Technical Success

**Performance & Reliability:**
- **Uptime:** 99.5% platform availability during business hours (8 AM - 8 PM Sri Lanka time)
- **Page Load Time:** All pages load within 3 seconds on 3G mobile connections
- **Quote Calculation:** Distance calculation and pricing returned within 5 seconds
- **Concurrent Users:** Support 100+ concurrent users without performance degradation

**Data Integrity & Security:**
- **Zero Data Loss:** No shipment, customer, or invoice data loss
- **Authentication Security:** JWT token-based security with no authentication breaches
- **Payment Security:** PCI DSS compliant payment processing (when Stripe integrated)
- **Backup & Recovery:** Daily automated backups with 4-hour recovery time objective

**Integration & Scalability:**
- **API Reliability:** 99% success rate for external API calls (Google Distance Matrix, payment gateway, email service)
- **Database Performance:** Query response time under 100ms for 95% of queries
- **Scalability:** System handles 10x current shipment volume without architectural changes
- **Mobile Responsiveness:** Full functionality on mobile devices (50% of customer traffic expected from mobile)

**Code Quality & Maintainability:**
- **Test Coverage:** 80%+ unit test coverage for business logic (pricing, invoice generation)
- **Clean Architecture:** Clear separation between Domain, Application, Infrastructure layers
- **API Documentation:** 100% of endpoints documented in Swagger/OpenAPI
- **Type Safety:** TypeScript strict mode enabled across entire frontend codebase

### Measurable Outcomes

**Within 3 Months of Full Deployment:**
- 100+ shipments processed through platform
- 50+ active customer accounts using portal
- Average quote calculation time under 3 seconds
- Zero critical bugs in production

**Within 6 Months:**
- 300+ shipments processed
- 80+ active customers
- 70% of customers using self-service features
- Customer satisfaction score of 4.2/5.0 or higher

**Within 12 Months:**
- 1,000+ shipments processed annually
- 150+ active customer accounts
- Stripe payment integration live with 20% of invoices paid online
- Platform generates 50% of company's total revenue

## User Journeys

### Journey 1: Priya - The Growing E-Commerce Business Owner (Primary Customer - Success Path)

**Persona:**
Priya Wickramasinghe runs a growing e-commerce business in Colombo, selling Sri Lankan handicrafts to international customers. She ships 15-20 packages per week to various countries via sea and air freight.

**Opening Scene - The Pain:**
It's Monday morning, and Priya is drowning in WhatsApp messages and phone calls. She has 8 shipments to arrange this week, but getting quotes takes hours. She calls the freight forwarder, waits on hold, explains package weights and destinations, then waits for a callback with pricing. By the time she gets quotes back, she's forgotten which shipment was which. Last week, a customer complained their package hadn't moved in days, but Priya had no way to check - she had to call the forwarder again and wait for updates.

"There has to be a better way," she thinks, staring at her messy spreadsheet of tracking numbers and costs.

**Discovery:**
Priya's business friend mentions New Emarald Frinters has a new online portal. "You can get instant quotes and track everything yourself," she says. Skeptical but desperate, Priya visits the website and sees a "Get Quote" button prominently displayed.

**Rising Action - First Experience:**

1. **Getting Her First Quote (2 minutes):**
   - Priya enters origin (Colombo warehouse) and destination (Los Angeles)
   - Inputs package weight (5kg) and selects service type (Air Freight - Express)
   - Within 3 seconds, she sees the quote: LKR 8,500 with clear breakdown (Base Rate: 2,000 + Weight: 3,500 + Distance: 2,500 + Express Premium: 500)
   - She gasps - "That would have taken me 2 hours before!"
   - She tries 3 more quotes for different destinations - all instant

2. **Creating Her First Shipment (5 minutes):**
   - Priya decides to register an account
   - After quick registration, she creates her first shipment
   - Enters package details, destination address, selects Air Express
   - Gets immediate tracking number: EMLD-2026-0421
   - Receives confirmation email with all details
   - "This is exactly what I needed!"

3. **Tracking in Real-Time:**
   - Next day, Priya checks the portal and sees status updated to "Picked Up"
   - Email notification arrives confirming pickup
   - She copies the tracking link and sends it directly to her customer
   - Her customer can track without calling Priya

4. **Managing Multiple Shipments:**
   - By week's end, Priya has created 6 shipments through the portal
   - Her dashboard shows all active shipments at a glance
   - Color-coded status indicators show which are in transit, which are delivered
   - She can filter by status, date, destination

**Climax - The Transformation Moment:**
Two weeks later, Priya receives an invoice for 12 completed shipments. Instead of sorting through emails and receipts, everything is in one clean invoice with tracking numbers, dates, and costs. She downloads the PDF, forwards it to her accountant, and marks it for payment in the portal.

She realizes she hasn't called the freight forwarder once in two weeks. No more phone tag. No more waiting for quotes. No more "Where is my shipment?" anxiety.

**Resolution - The New Reality:**
Priya now processes 25+ shipments per week (60% increase) without hiring help. Every Monday morning, she bulk-creates shipments in 30 minutes instead of spending 3 hours on phone calls. Her customers love the tracking links. Her accountant appreciates the organized invoicing.

"This platform gave me back 10 hours per week," she tells her business friends. "I can finally focus on growing my business instead of chasing logistics."

**Journey Requirements Revealed:**
- Instant quote calculator with multi-currency support
- Self-service shipment creation with immediate confirmation
- Real-time tracking with email notifications
- Customer dashboard with shipment overview and filtering
- Automated invoice generation with PDF download
- Public tracking links (no login required)
- Mobile-responsive design (Priya uses it on her phone)

---

### Journey 2: Rajith - The First-Time Shipper (Primary Customer - Edge Case/Error Recovery)

**Persona:**
Rajith Fernando is a 28-year-old software engineer in Kandy who needs to ship his motorcycle to his new job location in Jaffna. He's never used freight services before and is anxious about costs and safety.

**Opening Scene - The Anxiety:**
Rajith found New Emarald Frinters through Google search. He's nervous - "What if I enter the wrong information? What if it's too expensive? What if they lose my motorcycle?"

**Rising Action - The Learning Journey:**

1. **First Attempt - Confusion:**
   - Rajith tries the quote calculator
   - Enters weight as "150" (thinking in pounds, not kg)
   - Gets a quote of LKR 45,000 - way higher than expected
   - Panics and closes the browser

2. **Second Attempt - Discovery:**
   - Next day, Rajith tries again
   - Notices the "kg" label next to weight field
   - Converts his motorcycle weight correctly (68 kg)
   - Gets a reasonable quote of LKR 12,500 for Land Transport
   - Relief washes over him

3. **Registration Struggle:**
   - Tries to register but makes a typo in email address
   - Doesn't receive verification email
   - Uses "Contact Us" form to ask for help
   - Admin staff responds within 2 hours with guidance
   - Successfully registers with correct email

4. **Creating First Shipment - Validation Helps:**
   - Rajith starts creating shipment but unsure about package dimensions
   - Form validation helps: "Please enter dimensions in cm (Length x Width x Height)"
   - He measures carefully and enters: 220cm x 80cm x 110cm
   - System accepts and calculates cubic weight
   - Adds special instructions: "Motorcycle - please handle with care, covered with protective wrap"

5. **Tracking Obsessively:**
   - After pickup, Rajith checks tracking 5 times per day
   - Sees status updates: Picked Up → In Transit → Out for Delivery
   - Each update reduces his anxiety
   - Takes 3 days for delivery (as estimated)

**Climax - The Relief:**
When status changes to "Delivered," Rajith immediately calls the Jaffna location. His motorcycle arrived safely. The tracking was accurate. The price was exactly as quoted - no hidden fees.

**Resolution - The Advocate:**
Rajith posts on Reddit: "Just shipped my motorcycle with New Emarald Frinters. Their online platform is super easy even for first-timers. Accurate tracking, fair pricing, safe delivery. Highly recommend!"

**Journey Requirements Revealed:**
- Clear field labels and units (kg, cm, etc.)
- Form validation with helpful error messages
- Contact/support system for questions
- Special instructions field for unique needs
- Accurate estimated delivery dates
- Transparent pricing (no hidden fees)
- Email notifications for status changes
- Reassuring UI that builds trust (professional design, clear communication)

---

### Journey 3: Sanduni - The Admin Operations Manager (Secondary User - Admin/Staff)

**Persona:**
Sanduni Perera is the operations manager at New Emarald Frinters. She manages a team of 3 staff members handling 50+ shipments per week across sea, air, and land freight.

**Opening Scene - The Chaos:**
Before the platform, Sanduni's team maintained shipment records in Excel spreadsheets. Customer calls asking "Where's my shipment?" interrupted work constantly. Invoice generation at month-end took 2 full days of manual work - copying data from spreadsheets, calculating costs, generating PDFs, emailing customers.

Staff made mistakes: wrong tracking numbers, missed status updates, pricing calculation errors. Every mistake meant an unhappy customer and wasted time fixing issues.

**Rising Action - The New System:**

1. **Monday Morning - Dashboard Power:**
   - Sanduni logs into the admin dashboard
   - Sees 23 active shipments at a glance
   - 5 pending pickup (needs action today)
   - 12 in transit (on schedule)
   - 6 out for delivery (should complete today)
   - Color-coded status makes priorities obvious

2. **Processing New Shipments:**
   - 8 new shipment requests came in over the weekend (customers created them online)
   - Sanduni reviews each one, verifies details
   - One shipment has unusual dimensions - she calls customer to confirm
   - Approves 7 shipments, updates one with corrected details
   - All customers receive automatic confirmation emails

3. **Status Updates Throughout the Day:**
   - Warehouse calls: "5 shipments picked up"
   - Sanduni updates status to "Picked Up" with 5 clicks
   - System sends automatic email notifications to all 5 customers
   - No manual emails needed

4. **Handling Customer Questions:**
   - Customer calls: "Has my shipment moved?"
   - Instead of searching through spreadsheets, Sanduni pulls up the tracking number in 2 seconds
   - "Yes, it was picked up yesterday morning and is currently in transit. Expected delivery Wednesday."
   - Call takes 30 seconds instead of 5 minutes

5. **Invoice Generation - Month End:**
   - Previously: 2 days of manual work
   - Now: Sanduni filters completed shipments for January
   - Selects all 87 completed shipments
   - Clicks "Generate Invoices"
   - System automatically:
     - Groups shipments by customer
     - Calculates totals with pricing rules
     - Generates professional PDF invoices
     - Sends to customers via email
   - Takes 45 minutes instead of 2 days

**Climax - The Transformation:**
Three months after platform launch, Sanduni's team is handling 80+ shipments per week (60% more volume) with the same 3 staff members. Customer satisfaction calls increased - customers love the transparency. Complaint calls decreased 70% - customers track shipments themselves.

**Resolution - The Strategic Role:**
With operational efficiency improved, Sanduni now spends time on strategic work: analyzing shipment trends, identifying top customers, negotiating better rates with carriers, improving service quality.

"This platform didn't just make us faster," she tells the owner. "It made us better. We can actually focus on serving customers instead of fighting spreadsheets."

**Journey Requirements Revealed:**
- Comprehensive admin dashboard with real-time shipment overview
- Status filtering and search capabilities
- Bulk status update functionality
- Automatic email notification system
- Invoice generation system with bulk operations
- Customer management view
- Shipment approval workflow
- Analytics and reporting capabilities
- Audit trail (who updated what and when)
- Role-based access control

---

### Journey 4: Marcus - The International Customer (Public User/Potential Customer)

**Persona:**
Marcus Chen is a business owner in Singapore who ordered custom furniture from a Sri Lankan manufacturer. The manufacturer used New Emarald Frinters for shipping.

**Opening Scene - The Wait:**
Marcus paid $2,500 for custom teak furniture. The manufacturer said "It's shipped!" and sent him a tracking number: EMLD-2026-0856. But Marcus has no relationship with New Emarald Frinters - he's never heard of them.

**Rising Action - Discovery:**

1. **First Track:**
   - Marcus googles "EMLD-2026-0856"
   - Finds New Emarald Frinters tracking page
   - Enters tracking number (no login required)
   - Sees shipment details:
     - Origin: Colombo, Sri Lanka
     - Destination: Singapore
     - Service: Sea Freight FCL
     - Status: In Transit
     - Estimated Delivery: March 15, 2026
   - Timeline shows: Pending → Picked Up (Feb 20) → In Transit (Feb 22)

2. **Daily Checks:**
   - Marcus bookmarks the tracking page
   - Checks every day
   - March 5: Status updates to "At Port - Singapore"
   - March 10: "Customs Clearance"
   - March 14: "Out for Delivery"

3. **Trust Building:**
   - Marcus is impressed - "This is more transparent than many international carriers"
   - Shares tracking link with his warehouse manager
   - Manager can track without bothering Marcus

**Climax - The Delivery:**
March 15, 2026: Status changes to "Delivered." Marcus calls his warehouse - furniture arrived in perfect condition, exactly as tracked.

**Resolution - The Referral:**
Two months later, Marcus needs to ship electronics to Sri Lanka. He remembers the excellent tracking experience and visits New Emarald Frinters website. Creates an account. Becomes a customer.

"I became their customer because I was someone else's recipient," he tells his business partner. "That's smart business."

**Journey Requirements Revealed:**
- Public tracking (no login required)
- Clear, professional tracking interface
- International address support
- Service type visibility (customer education)
- Estimated delivery dates
- Visual timeline/progress indicator
- Clean, trustworthy design
- Mobile-friendly (Marcus tracked on his phone)
- Shareable tracking URLs
- Clear company branding (builds trust)

---

### Journey Requirements Summary

**Core Capabilities Revealed by All Journeys:**

**Self-Service Customer Portal:**
- Instant quote calculator with weight + distance + speed pricing
- Multi-currency support (LKR/USD)
- Self-service shipment creation
- Customer dashboard with shipment overview
- Invoice history and payment status
- Special instructions capability
- Mobile-responsive design

**Tracking & Transparency:**
- Real-time status tracking
- Public tracking (no login required)
- Visual timeline/progress indicator
- Email notifications for status changes
- Shareable tracking links
- Estimated delivery dates

**Admin Operations:**
- Comprehensive admin dashboard
- Real-time shipment visibility
- Bulk status updates
- Automatic notification system
- Invoice generation and management
- Customer management
- Search and filtering capabilities
- Analytics and reporting

**Trust & Quality:**
- Clear pricing transparency (no hidden fees)
- Form validation and helpful error messages
- Professional, trustworthy design
- Contact/support system
- Accurate estimates
- Reliable notifications

**Business Impact:**
- 60-80% reduction in phone inquiries
- 3x faster shipment processing
- 70% reduction in manual quote work
- Invoice generation 2 days → 45 minutes
- Enables volume growth without staff growth
- Converts recipients into customers

## Web Application Specific Requirements

### Project-Type Overview

**New Emarald Frinters** is a modern Single Page Application (SPA) built with React 19 and TypeScript, providing a responsive web platform for freight and logistics operations. The application serves multiple user roles (customers, admin, staff) with distinct interfaces and capabilities optimized for both desktop and mobile browsers.

**Key Technical Characteristics:**
- Single Page Application architecture for smooth, app-like experience
- Progressive enhancement for mobile devices
- Real-time data updates for shipment tracking
- Multi-currency support with locale-specific formatting
- Responsive design serving both desktop and mobile users

### Browser & Platform Support

**Supported Browsers:**
- **Modern Evergreen Browsers:**
  - Chrome 90+ (primary development target)
  - Firefox 88+
  - Safari 14+ (macOS and iOS)
  - Edge 90+ (Chromium-based)

**Mobile Browser Support:**
- iOS Safari 14+
- Chrome for Android
- Samsung Internet

**Minimum Requirements:**
- JavaScript enabled (required for application functionality)
- ES6+ support
- Local Storage support (for auth tokens and client-side caching)
- Cookie support (for session management)

**Not Supported:**
- Internet Explorer (end of life)
- Legacy browsers without ES6 support

### Responsive Design Requirements

**Breakpoints:**
- Mobile: 320px - 640px (primary: 375px iPhone, 360px Android)
- Tablet: 641px - 1024px
- Desktop: 1025px+ (optimized for 1920px)

**Mobile-First Approach:**
- 50% of customer traffic expected from mobile devices
- Touch-optimized interactions (minimum 44px touch targets)
- Mobile-optimized forms with appropriate input types
- Responsive tables with horizontal scroll or card layouts
- Bottom navigation for key actions on mobile

**Layout Adaptations:**
- Customer portal: Mobile-friendly shipment cards, collapsible sections
- Admin dashboard: Desktop-optimized data tables with mobile fallback views
- Quote calculator: Multi-step wizard on mobile, single-page form on desktop
- Tracking: Public tracking works seamlessly on all screen sizes

### Performance Targets

**Page Load Performance:**
- **Initial Page Load:** < 3 seconds on 3G mobile connections
- **Time to Interactive (TTI):** < 5 seconds on 3G
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

**Runtime Performance:**
- **Quote Calculation Response:** < 5 seconds (including external API call)
- **Page Navigation:** < 200ms (SPA routing)
- **Search/Filter Operations:** < 500ms
- **Dashboard Data Refresh:** < 2 seconds

**Asset Optimization:**
- Code splitting for route-based lazy loading
- Image optimization (WebP with PNG fallback)
- Minified and compressed JavaScript bundles
- CDN delivery for static assets
- Aggressive caching strategy (Service Worker consideration for future)

**Concurrent User Support:**
- Support 100+ concurrent users without performance degradation
- Optimistic UI updates for improved perceived performance
- Background data fetching with React Query caching

### SEO & Discoverability

**SEO Priority: Medium**

The platform has mixed SEO requirements:

**Public Pages (High SEO Priority):**
- **Home Page:** Company information, services overview
- **Services Page:** Detailed service descriptions (Sea, Air, Land, Warehousing, Customs)
- **Get Quote Page:** Public quote calculator landing page
- **Track Shipment Page:** Public tracking interface (no login required)
- **Contact Page:** Contact information and business hours

**SEO Strategy for Public Pages:**
- Server-Side Rendering (SSR) or Static Generation for public pages (consider Next.js migration)
- Proper meta tags (title, description, Open Graph)
- Semantic HTML structure
- Structured data markup for business information (Schema.org)
- XML sitemap for public pages
- robots.txt configuration

**Authenticated Pages (Low SEO Priority):**
- Customer portal (login required)
- Admin dashboard (login required)
- These pages do not need SEO optimization (protected behind authentication)

**Social Sharing:**
- Open Graph tags for sharing tracking links
- When customers share tracking links, preview shows shipment origin/destination
- Professional og:image for brand recognition

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance (Target):**

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Logical tab order throughout application
- Skip links for main content areas
- Visible focus indicators (meeting color contrast requirements)
- Escape key dismisses modals and overlays

**Screen Reader Support:**
- Semantic HTML elements (nav, main, article, aside)
- ARIA labels for dynamic content and complex interactions
- ARIA live regions for shipment status updates and notifications
- Alt text for all meaningful images
- Form labels properly associated with inputs

**Visual Accessibility:**
- Minimum 4.5:1 color contrast for normal text
- Minimum 3:1 color contrast for large text and UI components
- Text resizable up to 200% without loss of functionality
- No reliance on color alone for information (use icons + text)
- Color palette:
  - Primary: #FEB05D (orange) - used for accents and CTAs
  - Text: #2B2A2A (near-black) - high contrast for readability
  - Background: #F5F2F2 (off-white) - reduces eye strain

**Form Accessibility:**
- Clear error messages associated with form fields
- Inline validation with descriptive feedback
- Required fields clearly marked
- Helpful placeholder text and labels

**Responsive Text:**
- Minimum font size: 16px for body text (prevents mobile zoom)
- Scalable units (rem/em) for typography
- Line height 1.5+ for readability

### Real-Time & Dynamic Features

**Real-Time Requirements:**

**Shipment Tracking Updates:**
- Status changes reflect immediately in customer portal
- Email notifications sent on status changes (async process)
- Admin dashboard shows real-time shipment counts
- No need for manual page refresh to see updates

**Implementation Strategy:**
- **Polling approach:** React Query automatic refetching every 30-60 seconds for active shipments
- **Push notifications (future):** WebSocket or Server-Sent Events for instant updates
- Optimistic UI updates for admin status changes

**Dynamic Data:**
- Quote calculation with external API (Google Distance Matrix)
- Live invoice generation
- Dashboard statistics updated on navigation
- Search and filter with instant client-side results

### Technical Architecture Considerations

**Frontend Stack:**
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite (fast development and optimized production builds)
- **Routing:** React Router v6 (client-side routing for SPA)
- **State Management:**
  - React Query (TanStack Query v5) for server state
  - Zustand for minimal global client state (auth)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios with interceptors for auth and error handling

**Build & Deployment:**
- Vite production builds with code splitting
- Environment-based configuration (dev/staging/prod)
- Static hosting (Vercel, Netlify, or Azure Static Web Apps)
- Automatic deployment from Git

**Browser Storage:**
- LocalStorage: JWT tokens, user preferences
- SessionStorage: Temporary form data
- Cookies: Optional for additional session tracking

### Implementation Considerations

**Authentication Flow:**
- JWT tokens stored in LocalStorage
- Axios interceptors for automatic token attachment
- Token refresh mechanism before expiration
- Redirect to login on 401 responses
- Protected route components

**Error Handling:**
- Global error boundary for React errors
- Axios interceptor for API errors
- User-friendly error messages
- Network offline detection
- Retry logic for failed API calls

**Data Validation:**
- Client-side validation with Zod schemas
- Server-side validation (not just client-side)
- Consistent error message format
- Real-time validation feedback

**Security Considerations:**
- HTTPS only in production
- XSS protection (React auto-escaping + CSP headers)
- CSRF token for state-changing operations
- Rate limiting on sensitive endpoints (server-side)
- Content Security Policy headers
- Secure JWT storage and transmission

**Internationalization (Future):**
- Infrastructure ready for i18next
- English (primary), Sinhala, Tamil (future)
- Currency formatting (LKR, USD)
- Date/time formatting (Sri Lanka time zone UTC+5:30)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Problem-Solving MVP**

The platform's MVP strategy focused on solving the core operational pain points for freight forwarders in the Sri Lankan market:
- **Primary Problem Solved:** Eliminating manual quote generation, tracking inquiries, and invoice processing
- **MVP Philosophy:** Deliver immediately useful automation that saves hours per week for both customers and operations staff
- **Validation Approach:** Operational efficiency metrics (reduction in phone calls, faster processing) validate MVP success

**Current System Status:**
- MVP (Phase 1) and Growth Features (Phase 2) are **implemented and operational**
- Phase 3 (Vision) represents future enhancements and advanced capabilities
- Platform is actively serving customers with proven value delivery

**Resource Requirements:**
- **Development Team:** 2-3 full-stack developers (React + .NET)
- **Design:** 1 UI/UX designer for continued refinement
- **Operations:** Existing freight forwarding staff (domain experts)
- **Infrastructure:** Cloud hosting (Azure/AWS), external APIs (Google Distance Matrix, SendGrid/SES, future Stripe)

### MVP Feature Set (Phase 1 - Implemented)

**Core User Journeys Supported:**
1. **Customer - Get Instant Quote:** Self-service quote calculation eliminates wait time
2. **Customer - Create Shipment:** Self-service shipment booking with immediate confirmation
3. **Customer - Track Shipment:** Real-time public tracking accessible 24/7
4. **Admin - Process Shipments:** Centralized dashboard for managing all shipments
5. **Admin - Update Status:** Single-click status updates with automatic notifications

**Must-Have Capabilities (All Implemented):**

**Authentication & User Management:**
- JWT-based authentication system
- Customer self-registration with email verification
- Role-based access control (Customer, Admin, Staff)
- Basic profile management

**Shipment Operations:**
- Create shipment with origin/destination, package details
- Service type selection (Standard, Express, Overnight)
- Automatic tracking number generation
- Shipment list with status filtering
- Detailed shipment view

**Quote Calculator:**
- Weight + Distance + Speed pricing algorithm
- Instant calculation (< 5 seconds)
- Clear cost breakdown display
- Multi-currency support (LKR/USD)

**Public Tracking:**
- No-login-required tracking by tracking number
- Status milestone display with timeline
- Shareable tracking URLs

**Admin Dashboard:**
- Real-time shipment overview
- Status filtering and search
- Manual status updates
- Customer management
- Basic statistics

**Why These Were Must-Haves:**
- Without quotes, customers can't make decisions → No business
- Without tracking, customers call constantly → Operations overwhelmed
- Without admin dashboard, staff can't manage shipments → System useless
- Without authentication, no multi-tenancy → Security risk

### Post-MVP Features

**Phase 2 - Growth Features (Implemented):**

**Invoice Management:**
- Automatic invoice generation from completed shipments
- Customer-grouped invoices
- PDF invoice generation
- Payment status tracking
- Mark invoices as paid

**Email Notifications:**
- Shipment creation confirmation
- Status change notifications (Picked Up, In Transit, Delivered)
- Invoice sent notifications
- SendGrid/AWS SES integration

**Document Management:**
- Upload shipping labels and proof of delivery
- Document storage (Azure Blob/AWS S3)
- Document retrieval from shipment details

**Enhanced Quote Calculator:**
- Multiple packages per shipment
- Google Distance Matrix API integration
- Service-specific pricing rules
- Estimated delivery date calculation

**Enhanced Dashboards:**
- Customer shipment statistics
- Admin revenue analytics
- Shipment trend analysis
- Top customer reports

**Why Phase 2 Not MVP:**
- Invoices can be manual initially (Excel/email)
- Email notifications nice but not essential (phone/WhatsApp works)
- Documents can be handled offline
- Basic quote calculator sufficient for MVP validation

**Phase 3 - Vision & Expansion (Future/Planned):**

**Payment Integration:**
- Stripe integration for online payments
- Credit/debit card acceptance
- Automatic payment confirmation
- Digital receipts

**Advanced Features:**
- PDF generation for invoices and labels
- Advanced search with multiple filters
- Export functionality (CSV, Excel, PDF)
- Customer credit management
- Overdue invoice alerts

**Analytics & Insights:**
- Comprehensive admin analytics
- Revenue reports by service/customer/period
- Performance metrics (on-time delivery rate)
- Customer lifetime value analysis
- Predictive analytics

**Mobile Applications:**
- Native iOS/Android apps
- Push notifications
- Mobile-optimized workflows
- Camera integration for documents

**Market Expansion:**
- WhatsApp Business integration (Sri Lankan market preference)
- SMS notifications (Twilio)
- Multi-language support (Sinhala, Tamil)
- Integration with accounting software (QuickBooks, Xero)
- Customs documentation automation

**Why Phase 3 Later:**
- Payment gateway adds complexity and compliance requirements
- Analytics require significant usage data first
- Mobile apps require proven web platform first
- Integrations require established user base to justify investment

### Risk Mitigation Strategy

**Technical Risks:**

**Risk:** External API dependencies (Google Distance Matrix, payment gateway, email service) could fail or change pricing
- **Mitigation:** Fallback mechanisms, graceful degradation, caching strategies
- **Contingency:** Manual distance calculation initially, queue-based email retry logic

**Risk:** SQLite performance limitations at scale
- **Mitigation:** Designed for easy migration to SQL Server/PostgreSQL via EF Core
- **Monitoring:** Track query performance, set migration trigger at 10,000+ shipments

**Risk:** React/TypeScript and .NET 9 learning curve for team
- **Mitigation:** Strong type safety reduces runtime errors, comprehensive documentation
- **Training:** Invest in team upskilling, leverage modern development tools

**Market Risks:**

**Risk:** Customers resist change from phone/email to self-service platform
- **Validation:** Early adopter program, gradual rollout with hybrid support
- **Mitigation:** Excellent UX, responsive customer support, staff training

**Risk:** Competitors copy the platform approach
- **Mitigation:** First-mover advantage in Sri Lankan market, focus on service quality
- **Differentiation:** Market-specific features (LKR/USD, local ports, WhatsApp integration)

**Risk:** Freight industry slowdown impacts customer acquisition
- **Mitigation:** Efficiency gains make platform valuable even in downturn
- **Value Prop:** Cost reduction through automation attracts customers in any economy

**Resource Risks:**

**Risk:** Key developers leave during development
- **Mitigation:** Clean Architecture ensures maintainability, comprehensive documentation
- **Contingency:** Code ownership practices, knowledge sharing sessions

**Risk:** Budget constraints delay Phase 3 features
- **Mitigation:** Phase 1 & 2 deliver complete value independently
- **Revenue:** Platform generates ROI through operational efficiency before Phase 3 needed

**Risk:** External service cost increases (Google APIs, hosting)
- **Mitigation:** Architecture supports provider switching, usage monitoring and optimization
- **Contingency:** Alternative providers identified (Mapbox for distance, self-hosted options)

### Scope Validation Criteria

**MVP Success Indicators (Already Achieved):**
- ✅ 50+ shipments processed per week
- ✅ 70%+ customers using self-service features
- ✅ 60%+ reduction in tracking-related phone calls
- ✅ Invoice generation time reduced from 2 days to 45 minutes

**Phase 2 Success Indicators (Current Goals):**
- 80+ active customer accounts
- 300+ shipments processed per month
- 85% customer retention rate
- NPS score 50+

**Phase 3 Readiness Indicators:**
- 150+ active customers
- 1,000+ annual shipments
- Stripe integration ROI justified (20%+ customers request online payment)
- Mobile app demand validated (50%+ mobile traffic)

## Functional Requirements

This section defines implementation-agnostic functional requirements organized by capability area. Each requirement represents a distinct capability contract that must be fulfilled by the system.

### 1. User Management & Authentication

- FR1: Customers can register for an account using email and password
- FR2: Customers can log in to access personalized features
- FR3: Admin users can log in with elevated privileges
- FR4: System can enforce role-based access control (Customer, Admin roles)
- FR5: Users can reset forgotten passwords via email verification
- FR6: System can maintain secure session management with JWT tokens
- FR7: System can log out users and invalidate their sessions

### 2. Quote Management

- FR8: Public users can calculate shipping quotes without authentication
- FR9: System can calculate quotes based on origin, destination, weight, and dimensions
- FR10: System can integrate with external distance calculation services (Google Distance Matrix API)
- FR11: System can display quote breakdowns showing distance, weight factors, and total cost
- FR12: System can support multi-currency display (LKR primary, USD secondary)
- FR13: System can provide instant quote results within 3 seconds

### 3. Shipment Management

- FR14: Customers can view their shipment history
- FR15: Customers can filter and search shipments by status, date, or tracking number
- FR16: Customers can view detailed information for individual shipments
- FR17: Customers can create shipment requests with complete package and destination details
- FR18: System can validate shipment data including addresses and package specifications
- FR19: System can generate unique tracking numbers for each shipment
- FR20: Admin users can view all shipments across all customers
- FR21: Admin users can update shipment status (Pending, Processing, In Transit, Delivered, Cancelled)
- FR22: Admin users can assign delivery personnel to shipments
- FR23: System can prevent status transitions that violate business rules

### 4. Tracking System

- FR24: Customers can track shipments using tracking numbers
- FR25: System can display shipment status and estimated delivery dates
- FR26: System can show shipment timeline with status history
- FR27: Public users can track shipments without logging in
- FR28: System can display tracking information in customer-friendly format
- FR29: System can update tracking status in real-time as admin makes changes

### 5. Invoice Management

- FR30: System can generate invoices automatically from completed shipments
- FR31: System can calculate invoice totals including base charges, taxes, and fees
- FR32: Customers can view their invoice history
- FR33: Customers can download invoices as PDF documents
- FR34: Admin users can view all invoices across all customers
- FR35: Admin users can manually create invoices for special cases
- FR36: Admin users can mark invoices as paid or unpaid
- FR37: System can display invoice payment status clearly
- FR38: System can generate invoice PDFs with company branding and complete details

### 6. Notification System

- FR39: System can send email notifications for key shipment events
- FR40: Customers receive notifications when shipments are created
- FR41: Customers receive notifications when shipment status changes
- FR42: Customers receive notifications when shipments are delivered
- FR43: Admin users receive notifications for new shipment requests
- FR44: System can integrate with email service providers (SendGrid or AWS SES)
- FR45: System can queue email notifications for reliable delivery
- FR46: System can handle email delivery failures gracefully

### 7. Document Management

- FR47: System can store and retrieve shipment-related documents
- FR48: Customers can upload supporting documents for shipments
- FR49: Admin users can upload proof of delivery documents
- FR50: System can associate documents with specific shipments
- FR51: System can serve document downloads securely based on user permissions
- FR52: System can validate document file types and sizes

### 8. Admin Dashboard

- FR53: Admin users can access a comprehensive dashboard
- FR54: Admin dashboard displays key metrics (total shipments, pending requests, revenue)
- FR55: Admin dashboard shows recent activity and pending actions
- FR56: Admin users can quickly access pending shipment requests
- FR57: Admin users can view revenue analytics by time period
- FR58: Admin users can export reports for business analysis

### 9. Customer Dashboard

- FR59: Customers can access a personalized dashboard
- FR60: Customer dashboard shows active shipments prominently
- FR61: Customer dashboard displays recent quotes and shipment history
- FR62: Customer dashboard shows unpaid invoices requiring attention
- FR63: Customers can quickly create new quotes from dashboard
- FR64: Customers can quickly create new shipment requests from dashboard

### 10. Customer Management (Admin)

- FR65: Admin users can view all registered customers
- FR66: Admin users can search and filter customer list
- FR67: Admin users can view customer profiles with shipment history
- FR68: Admin users can view customer invoice history and payment status
- FR69: Admin users can deactivate customer accounts if needed

### 11. System Configuration & Pricing

- FR70: Admin users can configure pricing rules and rate tables
- FR71: System can apply configured pricing rules during quote calculations
- FR72: Admin users can configure supported origin and destination locations
- FR73: Admin users can configure system-wide settings (company info, email templates)
- FR74: System can maintain audit logs of configuration changes
- FR75: System can support Sri Lankan localization (phone formats, local ports, LKR currency)

### Coverage Validation

The 75 functional requirements above provide comprehensive coverage of:

- **All MVP Phase 1 capabilities** (core quote, shipment, tracking, invoice, notification features)
- **Phase 2 enhancements** (advanced dashboards, customer management, analytics)
- **All user journeys** (Priya's full-service experience, Rajith's edge case handling, Sanduni's admin workflow, Marcus's public tracking)
- **Technical requirements** (authentication, RBAC, API integration, multi-currency, document management)
- **Web app requirements** (responsive design implicit in customer-facing features)
- **Sri Lankan market requirements** (localization, local ports, currency support)

## Non-Functional Requirements

This section defines quality attributes that specify how well the system must perform. These requirements are measurable, testable criteria tied directly to the system's technical architecture and business needs.

### Performance

**Response Time Requirements:**
- User-facing page loads: Complete initial render within 2 seconds on standard broadband
- Quote calculations: Return results within 3 seconds including external API calls
- Dashboard data loading: Display key metrics within 1.5 seconds
- Search and filter operations: Return results within 1 second for datasets up to 10,000 records
- Document downloads: Initiate PDF download within 2 seconds

**Concurrent User Support:**
- System supports 50 concurrent users without performance degradation
- System supports 100 concurrent users with <20% performance degradation
- Admin dashboard remains responsive during peak customer activity

**API Integration Performance:**
- External API timeout: 5 seconds maximum for Google Distance Matrix calls
- Fallback mechanism activates if API response exceeds timeout
- Quote calculation degrades gracefully if distance API unavailable

### Security

**Authentication & Authorization:**
- All user passwords hashed using bcrypt with minimum work factor of 10
- JWT tokens expire after configurable duration (default 24 hours)
- Role-based access control enforced on all protected endpoints
- Session invalidation on logout with token blacklisting

**Data Protection:**
- All data encrypted in transit using TLS 1.2 or higher
- All data encrypted at rest using SQLite encryption extensions (production migration to encrypted databases)
- Sensitive customer information (addresses, contact details) protected with access logging
- Payment information (future Stripe integration) never stored locally, only tokenized references

**Access Control:**
- Customers can only access their own shipments, invoices, and documents
- Admin users have full access with audit logging of all actions
- Public endpoints (quote calculator, tracking lookup) rate-limited to prevent abuse
- Failed login attempts tracked with temporary account lockout after 5 consecutive failures

**Compliance Considerations:**
- GDPR-ready: Customer data export capability, deletion workflows
- Audit trail maintained for financial transactions (invoices, payments)
- Document access logged for compliance verification

### Scalability

**User Growth Support:**
- **Phase 1 (Current MVP)**: 80 active customer accounts, 300 shipments/month
- **Phase 2**: 150 active customers, 1,000 shipments/quarter
- **Phase 3**: 500+ active customers, 5,000+ shipments/quarter

**Database Performance:**
- Current SQLite implementation supports up to 10,000 shipments without performance issues
- Migration path defined to PostgreSQL or SQL Server for Phase 3 scale
- Database query optimization maintains <500ms response for common operations at scale

**Infrastructure Scalability:**
- Frontend static hosting supports unlimited read traffic through CDN
- Backend API designed for horizontal scaling (stateless design with JWT)
- File storage scales independently using cloud object storage (future)

**External Service Scaling:**
- Google Distance Matrix API quota monitoring and optimization
- Email service (SendGrid/AWS SES) supports batch processing for notification spikes
- Rate limiting prevents excessive API consumption during traffic bursts

### Accessibility

**WCAG 2.1 Level AA Compliance:**
- All interactive elements keyboard-navigable with visible focus indicators
- Color contrast ratios meet minimum 4.5:1 for normal text, 3:1 for large text
- All images and icons include meaningful alt text
- Form fields include proper labels and error messaging
- Screen reader compatibility verified with NVDA and JAWS

**Responsive Design:**
- Mobile-first design approach with breakpoints at 640px, 768px, 1024px, 1280px
- Touch targets minimum 44x44px for mobile interactions
- Text scales appropriately across device sizes without horizontal scrolling
- Critical features accessible on mobile devices (quote calculator, tracking, shipment creation)

**Multi-Language Infrastructure:**
- UI prepared for English/Sinhala/Tamil language switching (infrastructure ready, Phase 2 implementation)
- Currency display supports LKR (primary) and USD (secondary)
- Date/time formatting follows ISO 8601 with localized display

### Integration

**External API Integration:**
- Google Distance Matrix API integration with error handling and fallback
- API keys stored securely in environment variables, never in code
- Integration health monitoring with alerting for failures
- Graceful degradation if external service unavailable

**Email Service Integration:**
- SendGrid or AWS SES integration for transactional emails
- Email queue system ensures reliable delivery with retry logic
- Template management for consistent branding across notifications
- Delivery tracking and bounce handling

**Future Payment Integration:**
- Stripe integration architecture prepared (Phase 3)
- Webhook handling for asynchronous payment events
- PCI-DSS compliance through tokenization (no card data storage)

**Data Export/Import:**
- Shipment data exportable to CSV format for business analytics
- Invoice data exportable to PDF and CSV formats
- Customer data exportable for GDPR compliance

### Reliability

**Uptime & Availability:**
- Target uptime: 99.5% during business hours (7 AM - 10 PM LKR time)
- Planned maintenance communicated 48 hours in advance
- Critical customer-facing features (tracking, quote calculator) prioritized for uptime

**Data Integrity:**
- Database migrations tested in staging before production
- Automated backups daily with 30-day retention
- Point-in-time recovery capability for critical data loss scenarios
- Transaction integrity for financial operations (invoice generation, payment recording)

**Error Handling:**
- User-facing error messages clear and actionable (no technical jargon)
- Server errors logged with full stack traces for debugging
- Critical errors trigger admin notifications
- Graceful degradation for non-critical feature failures

**Monitoring & Observability:**
- Application logging with structured format for analysis
- Performance metrics tracking (response times, error rates)
- External API health monitoring
- Database performance monitoring with slow query alerts

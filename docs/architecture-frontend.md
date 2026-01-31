# Architecture - Frontend (React Web Application)

**Generated:** 2026-01-10  
**Part ID:** frontend  
**Project Type:** Web Application

---

## Executive Summary

The frontend is a modern React 19 Single Page Application (SPA) built with TypeScript and Vite. It implements a component-based architecture with shadcn/ui for consistent UI, TanStack Query for server state management, and React Router for client-side navigation.

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 19.2.0 | UI library |
| Language | TypeScript | 5.9.3 | Type safety |
| Build Tool | Vite (rolldown) | 7.2.5 | Fast bundling |
| Styling | Tailwind CSS | 3.3.6 | Utility-first CSS |
| Components | shadcn/ui (Radix) | Various | Accessible UI primitives |
| State | TanStack Query | 5.12.2 | Server state management |
| Routing | React Router | 6.20.0 | Client-side routing |
| Forms | React Hook Form | 7.48.2 | Form management |
| Validation | Zod | 3.22.4 | Schema validation |
| HTTP | Axios | 1.6.2 | API client |
| Maps | Leaflet | 1.9.4 | Map visualization |
| Data Grid | AG Grid | 35.0.0 | Data tables |
| i18n | i18next | 23.7.6 | Internationalization |
| Icons | Lucide React | 0.562.0 | Icon library |

---

## Architecture Pattern

**Pattern:** Component-based SPA with Feature-based Organization

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│                   (Routing & Providers)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   pages/        │  │  components/    │  │  services/   │ │
│  │   (Routes)      │  │  (Reusable UI)  │  │  (API Layer) │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬───────┘ │
│           │                    │                   │         │
│           ▼                    ▼                   ▼         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    hooks/ & lib/                         ││
│  │              (Shared Logic & Utilities)                  ││
│  └─────────────────────────────────────────────────────────┘│
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                      types/                              ││
│  │                 (TypeScript Types)                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Layer Structure

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Pages | `src/pages/` | Route components, page-level logic |
| Components | `src/components/` | Reusable UI components |
| Services | `src/services/` | API calls, query configuration |
| Hooks | `src/hooks/` | Custom React hooks |
| Lib | `src/lib/` | Utilities, constants |
| Types | `src/types/` | TypeScript type definitions |

### Component Categories

| Category | Path | Components |
|----------|------|------------|
| **UI Primitives** | `components/ui/` | button, input, card, dialog, select, tabs, accordion, badge, label, separator, textarea |
| **Layout** | `components/layout/` | Header, Footer, MainLayout |
| **Auth Guards** | `components/auth/` | ProtectedRoute, AdminOnly |
| **Feature** | `components/about/` | Leadership |

---

## Routing Structure

```typescript
// Route hierarchy
/                    → Home.tsx
/about               → About.tsx
/services            → Services.tsx
/contact             → Contact.tsx
/faq                 → FAQ.tsx
/quote               → Quote.tsx
/quotes              → QuotesList.tsx
/tracking            → Tracking.tsx (public)
/auth/login          → auth/Login.tsx
/auth/register       → auth/Register.tsx
/customer/dashboard  → customer/Dashboard.tsx (protected)
/admin/dashboard     → admin/Dashboard.tsx (admin only)
```

### Route Guards

| Guard | Component | Purpose |
|-------|-----------|---------|
| Protected | `ProtectedRoute.tsx` | Requires authentication |
| Admin Only | `AdminOnly.tsx` | Requires admin role |

---

## State Management

### Server State (TanStack Query)

```typescript
// Query client configuration (services/queryClient.ts)
// Manages: caching, refetching, optimistic updates

// Query keys pattern (services/queryKeys.ts)
export const queryKeys = {
  shipments: ['shipments'],
  quotes: ['quotes'],
  tracking: (id: string) => ['tracking', id],
  // ...
}
```

### Client State

| Type | Implementation |
|------|----------------|
| Auth State | Custom `useAuth` hook |
| Form State | React Hook Form |
| UI State | Local component state |

---

## API Layer

### Axios Configuration (`services/api.ts`)

```typescript
// Base instance with interceptors
// - Base URL: VITE_API_URL
// - JWT token injection
// - Error handling
```

### Service Modules

| Service | File | Endpoints |
|---------|------|-----------|
| Auth | `authApi.ts` | login, register, refresh |
| Quotes | `quote.service.ts` | calculate, save, list |
| Shipments | `shipments.service.ts` | CRUD operations |
| Tracking | `tracking.service.ts` | public tracking |
| Admin | `admin.service.ts` | admin operations |

---

## UI Component Library

### shadcn/ui Components Used

| Component | Radix Primitive | Usage |
|-----------|-----------------|-------|
| Accordion | `@radix-ui/react-accordion` | FAQ section |
| Badge | Custom | Status indicators |
| Button | `@radix-ui/react-slot` | Actions |
| Card | Custom | Content containers |
| Dialog | `@radix-ui/react-dialog` | Modals |
| Input | Custom | Form inputs |
| Label | `@radix-ui/react-label` | Form labels |
| Select | `@radix-ui/react-select` | Dropdowns |
| Separator | `@radix-ui/react-separator` | Visual dividers |
| Tabs | `@radix-ui/react-tabs` | Tab navigation |
| Textarea | Custom | Multi-line input |

### Styling Approach

```javascript
// tailwind.config.js - Custom configuration
// - Custom colors for brand
// - Extended spacing/sizing
// - Animation utilities (tailwindcss-animate)
```

---

## Form Handling Pattern

```typescript
// Pattern: React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

---

## Build & Bundle Configuration

### Vite Configuration

| Setting | Value |
|---------|-------|
| Build target | ES modules |
| Dev port | 5173 |
| API proxy | Configured for `/api` |
| HMR | Enabled |

### TypeScript Configuration

| Config File | Purpose |
|-------------|---------|
| `tsconfig.json` | Base configuration |
| `tsconfig.app.json` | Application code |
| `tsconfig.node.json` | Node/Vite config files |

---

## Deployment

### Production Build

```bash
npm run build  # Outputs to dist/
```

### Docker Configuration

```dockerfile
# Multi-stage build
# Stage 1: Build with Node
# Stage 2: Serve with Nginx
```

### Nginx Configuration

- Static file serving from `/usr/share/nginx/html`
- SPA fallback to `index.html`
- Gzip compression enabled

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/main.tsx` | React DOM render, providers |
| `src/App.tsx` | Root component, routing |
| `src/services/api.ts` | Axios instance |
| `src/services/queryClient.ts` | React Query setup |
| `src/hooks/useAuth.ts` | Auth state management |
| `src/lib/utils.ts` | Utility functions |
| `src/types/index.ts` | Shared TypeScript types |


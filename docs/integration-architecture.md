# Integration Architecture - New Emerald

**Generated:** 2026-01-10  
**Repository Type:** Multi-part

---

## Overview

This document describes how the Frontend and Backend parts of the New Emerald shipping platform communicate and integrate with each other.

---

## Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                  │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     FRONTEND (React SPA)                             │   │
│   │                     http://localhost:5173                            │   │
│   │                                                                      │   │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│   │   │   Pages      │  │  Components  │  │    State (React Query)   │  │   │
│   │   └──────┬───────┘  └──────────────┘  └─────────────┬────────────┘  │   │
│   │          │                                          │               │   │
│   │          ▼                                          ▼               │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │                    Services Layer                            │   │
│   │   │   ┌─────────────┐ ┌──────────────┐ ┌───────────────────┐    │   │   │
│   │   │   │ authApi.ts  │ │ shipments    │ │ quote.service.ts  │    │   │   │
│   │   │   │             │ │ .service.ts  │ │                   │    │   │   │
│   │   │   └─────────────┘ └──────────────┘ └───────────────────┘    │   │   │
│   │   │                          │                                   │   │   │
│   │   │                          ▼                                   │   │   │
│   │   │   ┌─────────────────────────────────────────────────────┐   │   │   │
│   │   │   │              api.ts (Axios Instance)                 │   │   │   │
│   │   │   │              - Base URL configuration                │   │   │   │
│   │   │   │              - JWT token injection                   │   │   │   │
│   │   │   │              - Error handling                        │   │   │   │
│   │   │   └─────────────────────────┬───────────────────────────┘   │   │   │
│   │   └─────────────────────────────┼───────────────────────────────┘   │   │
│   └─────────────────────────────────┼───────────────────────────────────┘   │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      │ HTTP/REST
                                      │ JSON
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (.NET API)                              │
│                           http://localhost:5253                              │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         API Layer                                    │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │                    Controllers                               │   │   │
│   │   │   ┌───────────┐ ┌──────────────┐ ┌────────────┐ ┌────────┐  │   │   │
│   │   │   │   Auth    │ │  Shipments   │ │   Quotes   │ │Tracking│  │   │   │
│   │   │   │Controller │ │  Controller  │ │ Controller │ │Contrlr │  │   │   │
│   │   │   └───────────┘ └──────────────┘ └────────────┘ └────────┘  │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                                │                                     │   │
│   │                                ▼                                     │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │                  Application Layer                           │   │   │
│   │   │              (DTOs, Interfaces, Services)                    │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                                │                                     │   │
│   │                                ▼                                     │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │                Infrastructure Layer                          │   │   │
│   │   │   ┌──────────────────┐  ┌────────────────────────────────┐  │   │   │
│   │   │   │  AppDbContext    │  │  Services (JWT, Pricing, etc)  │  │   │   │
│   │   │   └────────┬─────────┘  └────────────────────────────────┘  │   │   │
│   │   └────────────┼────────────────────────────────────────────────┘   │   │
│   └────────────────┼────────────────────────────────────────────────────┘   │
│                    │                                                         │
│                    ▼                                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         SQLite Database                              │   │
│   │                         logistics.db                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### Frontend → Backend

| Integration | Type | Details |
|-------------|------|---------|
| **Primary API** | REST over HTTP | All data operations |
| **Protocol** | JSON | Request/Response format |
| **Authentication** | JWT Bearer Token | Sent in Authorization header |
| **Base URL** | `http://localhost:5253/api` | Configured via `VITE_API_URL` |

### API Endpoints Consumed

| Frontend Service | Backend Controller | Endpoints |
|-----------------|-------------------|-----------|
| `authApi.ts` | `AuthController` | POST `/auth/login`, POST `/auth/register` |
| `shipments.service.ts` | `ShipmentsController` | GET/POST/PUT/DELETE `/shipments/*` |
| `quote.service.ts` | `QuotesController` | POST `/quotes/calculate` |
| `tracking.service.ts` | `TrackingController` | GET `/tracking/{trackingNumber}` |
| `admin.service.ts` | Multiple | Admin-specific operations |

---

## Authentication Flow

```
┌──────────────┐                                    ┌──────────────┐
│   Frontend   │                                    │   Backend    │
└──────┬───────┘                                    └──────┬───────┘
       │                                                    │
       │  1. POST /api/auth/login                          │
       │   { email, password }                             │
       ├──────────────────────────────────────────────────►│
       │                                                    │
       │  2. Validate credentials                          │
       │     Generate JWT token                            │
       │                                                    │
       │  3. Return { token, user }                        │
       │◄──────────────────────────────────────────────────┤
       │                                                    │
       │  4. Store token in localStorage                   │
       │     or memory                                     │
       │                                                    │
       │  5. Subsequent requests with                      │
       │     Authorization: Bearer <token>                 │
       ├──────────────────────────────────────────────────►│
       │                                                    │
       │  6. Validate JWT                                  │
       │     Extract user claims                           │
       │     Process request                               │
       │                                                    │
       │  7. Return data                                   │
       │◄──────────────────────────────────────────────────┤
       │                                                    │
```

---

## Axios Configuration

```typescript
// Frontend: services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5253/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## CORS Configuration

### Backend Configuration

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Allowed Origins

| Environment | Frontend URL |
|-------------|--------------|
| Development | `http://localhost:5173` |
| Docker | `http://localhost:5173` |
| Production | Configured via `FRONTEND_URL` |

---

## Data Contract Examples

### Authentication

**Request: POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Customer"
  }
}
```

### Quote Calculation

**Request: POST /api/quotes/calculate**
```json
{
  "originCity": "Colombo",
  "destinationCity": "Kandy",
  "weight": 25.5,
  "serviceType": "Express"
}
```

**Response:**
```json
{
  "distance": 115.5,
  "weight": 25.5,
  "serviceType": "Express",
  "baseRate": 500,
  "weightCharge": 255,
  "distanceCharge": 577.5,
  "totalCost": 1332.5,
  "currency": "LKR",
  "estimatedDays": 2
}
```

### Shipment Creation

**Request: POST /api/shipments**
```json
{
  "originAddress": "123 Main St",
  "originCity": "Colombo",
  "destinationAddress": "456 Oak Ave",
  "destinationCity": "Galle",
  "weight": 10.0,
  "serviceType": "Standard",
  "packages": [
    { "weight": 5.0, "length": 30, "width": 20, "height": 15 },
    { "weight": 5.0, "length": 25, "width": 25, "height": 20 }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process response |
| 201 | Created | Process response |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show access denied |
| 404 | Not Found | Show not found message |
| 500 | Server Error | Show generic error |

### Error Response Format

```json
{
  "message": "Error description",
  "errors": {
    "fieldName": ["Validation error 1", "Validation error 2"]
  }
}
```

---

## Docker Network Integration

```yaml
# docker-compose.yml
services:
  frontend:
    container_name: shipping-frontend
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:5253/api
    depends_on:
      - backend
    networks:
      - shipping-network

  backend:
    container_name: shipping-backend
    ports:
      - "5253:8080"
    environment:
      - FRONTEND_URL=http://localhost:5173
    networks:
      - shipping-network

networks:
  shipping-network:
    driver: bridge
```

---

## Key Integration Files

| Part | File | Purpose |
|------|------|---------|
| Frontend | `services/api.ts` | Axios instance |
| Frontend | `services/queryClient.ts` | React Query config |
| Frontend | `services/queryKeys.ts` | Query key management |
| Frontend | `.env` | API URL configuration |
| Backend | `Program.cs` | CORS, auth config |
| Backend | `appsettings.json` | JWT, CORS settings |
| Root | `docker-compose.yml` | Network configuration |


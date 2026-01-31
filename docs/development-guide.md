# Development Guide - New Emerald

**Generated:** 2026-01-10

---

## Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| .NET SDK | 10.0+ | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/10.0) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and navigate to project
git clone <repository-url>
cd New_Emerald

# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5253
# Swagger UI: http://localhost:5253/swagger
```

### Option 2: Local Development

**Terminal 1 - Backend:**
```bash
cd Backend
dotnet restore
dotnet run --project Backend.API
# API available at http://localhost:5253
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Default Credentials

| Account | Email | Password |
|---------|-------|----------|
| **Admin** | `admin@shipping.com` | `Admin@123` |

New customers can register via `/auth/register`

---

## Environment Configuration

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5253/api
```

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=logistics.db"
  },
  "Jwt": {
    "Key": "your-secret-key-here-minimum-32-characters",
    "Issuer": "ShippingAPI",
    "Audience": "ShippingClient",
    "ExpiryMinutes": 60
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

---

## Backend Development

### Common Commands

```bash
cd Backend

# Restore packages
dotnet restore

# Build all projects
dotnet build

# Run API
dotnet run --project Backend.API

# Run with hot reload
dotnet watch run --project Backend.API

# Run tests (when added)
dotnet test
```

### Project Structure

```
Backend/
├── Backend.sln              # Solution file - open this in IDE
├── Backend.API/             # Entry point
├── Backend.Application/     # Business logic
├── Backend.Domain/          # Core entities
└── Backend.Infrastructure/  # Data access
```

### Adding a New Entity

1. Create entity in `Backend.Domain/Entities/`
2. Add DbSet in `Backend.Infrastructure/Data/AppDbContext.cs`
3. Create DTOs in `Backend.Application/DTOs/`
4. Add controller in `Backend.API/Controllers/`
5. Run to apply migrations automatically

### Database Management

```bash
# Database is auto-created on first run
# Located at: Backend/Backend.API/logistics.db

# To reset database, delete the file and restart
rm Backend/Backend.API/logistics.db
dotnet run --project Backend.API
```

---

## Frontend Development

### Common Commands

```bash
cd Frontend

# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
Frontend/src/
├── main.tsx           # Entry point
├── App.tsx            # Root component
├── pages/             # Route pages
├── components/        # Reusable UI
├── services/          # API layer
├── hooks/             # Custom hooks
├── lib/               # Utilities
└── types/             # TypeScript types
```

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Header.tsx`

### Adding a New Component

```bash
# shadcn/ui pattern (manual)
# Create in src/components/ui/
```

### API Service Pattern

```typescript
// src/services/example.service.ts
import api from './api';

export const exampleService = {
  getAll: () => api.get('/example'),
  getById: (id: string) => api.get(`/example/${id}`),
  create: (data: CreateDto) => api.post('/example', data),
  update: (id: string, data: UpdateDto) => api.put(`/example/${id}`, data),
  delete: (id: string) => api.delete(`/example/${id}`),
};
```

---

## Docker Development

### Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Shell into container
docker exec -it shipping-backend /bin/bash
docker exec -it shipping-frontend /bin/sh
```

### Port Mapping

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Frontend | 80 | 5173 |
| Backend | 8080 | 5253 |

---

## Code Style & Conventions

### TypeScript/React

- Use functional components with hooks
- TypeScript strict mode enabled
- shadcn/ui for UI components
- TanStack Query for server state
- React Hook Form + Zod for forms

### C#/.NET

- Clean Architecture layers
- DTOs for API contracts
- Entity Framework Core for data
- Async/await for all I/O

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| React Component | PascalCase.tsx | `Dashboard.tsx` |
| React Hook | camelCase.ts | `useAuth.ts` |
| Service | camelCase.service.ts | `quote.service.ts` |
| C# Class | PascalCase.cs | `ShipmentController.cs` |
| C# DTO | PascalCaseDto.cs | `CreateShipmentDto.cs` |

---

## Testing

### Backend Tests (Future)

```bash
cd Backend
dotnet test
```

### Frontend Tests (Future)

```bash
cd Frontend
npm run test
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5253 in use | Stop other services or change port in launchSettings.json |
| Port 5173 in use | Stop other services or change in vite.config.ts |
| CORS errors | Check backend CORS config matches frontend URL |
| JWT invalid | Clear localStorage, re-login |
| Database locked | Stop all backend instances |
| npm install fails | Delete node_modules and package-lock.json, retry |

### Reset Development Environment

```bash
# Frontend
cd Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd Backend
rm -rf */bin */obj
rm Backend.API/logistics.db
dotnet restore
dotnet run --project Backend.API
```

---

## IDE Setup

### Visual Studio Code

**Recommended Extensions:**
- C# Dev Kit (Microsoft)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier
- ESLint

### Visual Studio

- Open `Backend/Backend.sln`
- Set `Backend.API` as startup project

### JetBrains Rider

- Open `Backend/Backend.sln`
- Configure run configuration for Backend.API

---

## API Documentation

When backend is running, access Swagger UI at:

**http://localhost:5253/swagger**

Features:
- Interactive endpoint testing
- Request/response schemas
- Authentication support (authorize with JWT)


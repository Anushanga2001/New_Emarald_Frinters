# Shipping Line Management Platform

A comprehensive shipping management platform with customer portal and admin dashboard capabilities. Built with React and .NET 10, featuring real-time tracking, invoice management, and automated pricing calculations.

## 🚀 Features

### Customer Features
- **User Registration & Authentication**: Secure JWT-based authentication
- **Shipment Management**: Create, track, and manage shipments
- **Quote Calculator**: Get instant shipping quotes based on weight, distance, and service type
- **Tracking**: Real-time shipment status updates
- **Invoice Management**: View and manage invoices
- **Dashboard**: Overview of shipments, invoices, and account status

### Admin Features
- **Admin Dashboard**: Comprehensive overview of all operations
- **Shipment Management**: View and manage all customer shipments
- **Customer Management**: Manage customer accounts and information
- **Pricing Rules**: Configure shipping pricing rules
- **Invoice Generation**: Generate and manage invoices
- **Reports & Analytics**: Business insights and reporting

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query) v5
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS + shadcn/ui (Radix UI)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Maps**: Leaflet & React Leaflet 
- **Icons**: Lucide React

### Backend
- **Framework**: .NET 10 (ASP.NET Core Web API)
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API layers)
- **ORM**: Entity Framework Core 10
- **Database**: SQLite (development) with migration path to SQL Server/PostgreSQL
- **Authentication**: JWT Bearer Tokens
- **Password Hashing**: BCrypt.Net-Next
- **API Documentation**: Swagger/OpenAPI (Swashbuckle)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend production)

## 📁 Project Structure

```
New_Repo/
├── Backend/
│   ├── API/                    # API Controllers
│   ├── Application/             # Application layer (DTOs, Interfaces)
│   ├── Domain/                  # Domain entities and enums
│   ├── Infrastructure/          # Data access and services
│   ├── Dockerfile
│   ├── .dockerignore
│   └── Shipping-Line-Backend.csproj
├── Frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services and query client
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and constants
│   │   └── types/              # TypeScript type definitions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
└── README.md
```

## 📋 Prerequisites

- **.NET 10 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Docker Desktop** (for Docker setup) - [Download](https://www.docker.com/products/docker-desktop)

## 🚀 Getting Started

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd New_Repo
   ```

2. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5253
   - Swagger UI: http://localhost:5253

4. **Stop containers**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Run the application**
   ```bash
   dotnet run
   ```

   The backend will be available at:
   - API: http://localhost:5253
   - Swagger UI: http://localhost:5253

#### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:5173

### Customer Registration
Customers can register through the frontend at `/auth/register`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Customer registration

### Shipments
- `GET /api/shipments` - Get all shipments (authenticated)
- `GET /api/shipments/{id}` - Get shipment by ID
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/{id}/status` - Update shipment status
- `DELETE /api/shipments/{id}` - Cancel shipment
- `GET /api/shipments/{id}/tracking` - Get tracking events

### Tracking (Public)
- `GET /api/tracking/{trackingNumber}` - Track shipment by tracking number (no auth required)

### Quotes
- `POST /api/quotes/calculate` - Calculate shipping quote

For complete API documentation, visit the Swagger UI at http://localhost:5253 when the backend is running.

## 🔧 Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT` - Environment (Development/Production)
- `ASPNETCORE_URLS` - Server URLs (default: `http://+:8080`)
- `DB_PATH` - SQLite database path (default: `logistics.db`)
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:5173`)
- `Jwt:Key` - JWT secret key (configured in `appsettings.json`)
- `Jwt:Issuer` - JWT issuer (configured in `appsettings.json`)
- `Jwt:Audience` - JWT audience (configured in `appsettings.json`)

### Frontend
- `VITE_API_URL` - Backend API URL (default: `http://localhost:5253/api`)

## 📊 Database

The application uses postgreSQL for development. The database file is created automatically on first run and seeded with:
- Default admin user
- Pricing rules for different service types

**Database Location:**
- Local development: `Backend/logistics.db`
- Docker: `Backend/data/logistics.db` (persisted via volume)

## 🏗️ Architecture

The backend follows **Clean Architecture** principles:

- **Domain Layer**: Core business entities and enums
- **Application Layer**: Business logic, DTOs, and service interfaces
- **Infrastructure Layer**: Data access (EF Core), external services, JWT implementation
- **API Layer**: Controllers, middleware, and API configuration

## 🧪 Development

### Backend Commands
```bash
# Restore packages
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Run with watch mode
dotnet watch run
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build frontend
docker-compose build backend
```

## 📝 API Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:5253
- The Swagger UI provides interactive API documentation where you can test endpoints directly

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- CORS configuration
- Role-based authorization (Customer, Admin, Staff)
- Input validation with FluentValidation (backend) and Zod (frontend)

## 🚧 Roadmap

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced reporting and analytics
- [ ] Document management
- [ ] Multi-currency support
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)

---

**Built with ❤️ using React and .NET**

# Quick Start Guide

## Getting Started with New Emarald Frinters Website

### 1. Install Dependencies

Open terminal in the project directory and run:

```powershell
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` because some packages have React 18 peer dependencies while we're using React 19.

### 2. Start Development Server

```powershell
npm run dev
```

The application will start at `http://localhost:5173`

### 3. Test the Features

#### Shipment Tracking
1. Go to the home page
2. Use the quick tracking widget or navigate to "Track Shipment"
3. Try these sample tracking numbers:
   - **LS2024001** - In-transit sea freight
   - **LS2024002** - Delivered air freight

#### Quote Calculator
1. Navigate to "Get Quote"
2. Fill in the multi-step form:
   - **Step 1**: Enter origin (e.g., "Singapore") and destination (e.g., "Colombo")
   - **Step 2**: Select service type, cargo type, and weight
   - Get instant quote in USD or LKR

#### Browse Services
- Navigate to "Our Services" to see all available shipping services
- Each service has detailed descriptions and features

#### Contact Form
- Navigate to "Contact" to see company information and send messages

### 4. Build for Production

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Project Structure Overview

```
src/
├── components/
│   ├── layout/         # Header, Footer, MainLayout
│   └── ui/             # shadcn/ui components (Button, Card, Input, etc.)
├── pages/              # All page components
│   ├── Home.tsx        # Landing page with hero and quick track
│   ├── Tracking.tsx    # Full tracking page
│   ├── Quote.tsx       # Quote calculator
│   ├── Services.tsx    # Services overview
│   ├── About.tsx       # Company information
│   ├── Contact.tsx     # Contact form
│   └── FAQ.tsx         # Frequently asked questions
├── services/           # API service layer (mock data included)
│   ├── api.ts
│   ├── tracking.service.ts
│   └── quote.service.ts
├── lib/
│   ├── utils.ts        # Helper functions (currency, date formatting)
│   └── constants.ts    # Company info, ports, services
└── types/
    └── index.ts        # TypeScript interfaces
```

## Customization

### Update Company Information

Edit `src/lib/constants.ts`:

```typescript
export const COMPANY_INFO = {
  name: 'Your Company Name',
  tagline: 'Your Tagline',
  email: 'your@email.com',
  phone: '+94 11 XXX XXXX',
  // ... more fields
}
```

### Change Colors/Theme

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: 217 91% 35%;  /* Blue color */
  --primary-foreground: 210 40% 98%;
  /* ... other colors */
}
```

### Add New Services

Edit `SERVICES` array in `src/lib/constants.ts`:

```typescript
export const SERVICES = [
  {
    id: 'your-service',
    name: 'Your Service Name',
    description: 'Service description',
    icon: 'IconName', // from lucide-react
  },
  // ... more services
]
```

## API Integration

Currently using mock data. To connect to a real backend:

1. Create a `.env` file:
   ```
   VITE_API_URL=https://your-api-url.com/api
   ```

2. Update service files in `src/services/` to use real API calls instead of mock data

3. The axios instance in `src/services/api.ts` is already configured with:
   - Base URL from environment variable
   - Authorization header interceptor
   - Error handling

Example:
```typescript
// src/services/tracking.service.ts
export async function trackShipment(trackingNumber: string): Promise<Shipment> {
  return api.get(`/shipments/track/${trackingNumber}`).then(res => res.data)
}
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.)

### Module Not Found Errors
Run:
```powershell
npm install --legacy-peer-deps
```

### Build Errors
Clear node_modules and reinstall:
```powershell
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

## Next Steps

### Implement Customer Portal
- Add authentication (JWT, OAuth)
- Create dashboard pages
- Add user profile management

### Add Booking System
- Multi-step booking form
- Document upload
- Payment gateway integration (PayHere for Sri Lanka)

### Internationalization
- Add Sinhala translations in `public/locales/si/`
- Add Tamil translations in `public/locales/ta/`
- Implement language switcher

### Backend Integration
- Replace mock services with real API calls
- Add authentication flow
- Implement real-time tracking updates
- Add email/SMS notifications

## Support

For questions or issues:
- Email: info@lankashipping.lk
- Phone: +94 11 234 5678

---

Happy shipping! 🚢

# New Emarald Frinters - Freight & Logistics Website

A modern, fully-featured shipping company website built with React, TypeScript, Vite, and shadcn/ui for the Sri Lankan market.

## Features

### Core Functionality
- **Real-time Shipment Tracking**: Track shipments with visual timeline and status updates
- **Instant Quote Calculator**: Multi-step form to calculate shipping costs for different services
- **Service Showcase**: Comprehensive display of Sea Freight (FCL/LCL), Air Freight, Land Transport, Warehousing, and Customs services
- **Contact System**: Contact forms with company information and business hours
- **FAQ Section**: Accordion-based FAQ page with common shipping questions
- **Responsive Design**: Mobile-first design that works on all devices

### Sri Lanka Specific Features
- **Currency Support**: LKR and USD with real-time conversion
- **Local Ports**: Integration of Colombo, Hambantota, Trincomalee, and Galle ports
- **Phone Format**: Sri Lankan phone number formatting (+94)
- **Business Hours**: Displays local Sri Lanka time zone (UTC+5:30)
- **Multi-language Ready**: Infrastructure for English, Sinhala, and Tamil (i18next configured)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

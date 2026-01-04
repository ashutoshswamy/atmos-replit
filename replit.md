# Atmos Weather Dashboard

## Overview

Atmos is a weather dashboard application that displays current weather conditions, hourly forecasts, and 7-day forecasts for any location. Users can search for cities, view detailed weather information with beautiful gradient-based UI themes, and save favorite locations for quick access.

The app uses the Open-Meteo API for weather data (free, no API key required) and stores user favorites in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL

### Data Storage
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema sync

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schema and route definitions used by both frontend and backend, ensuring type safety across the stack
- **API Contract**: Routes are defined with Zod schemas for input validation and response typing in `shared/routes.ts`
- **Storage Abstraction**: Database operations are abstracted through a `DatabaseStorage` class in `server/storage.ts`

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components including weather displays
│       ├── hooks/        # Custom React hooks (weather API, favorites)
│       ├── lib/          # Utilities (query client, weather utils)
│       └── pages/        # Route pages
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between frontend/backend
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod
└── migrations/       # Drizzle database migrations
```

## External Dependencies

### External APIs
- **Open-Meteo Geocoding API**: City search functionality (`geocoding-api.open-meteo.com`)
- **Open-Meteo Weather API**: Current weather, hourly and daily forecasts (`api.open-meteo.com`)

### Database
- **PostgreSQL**: Primary data store for user favorites, connected via `DATABASE_URL` environment variable

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `date-fns`: Date formatting utilities
- `zod`: Runtime type validation
- `shadcn/ui` components via Radix UI primitives
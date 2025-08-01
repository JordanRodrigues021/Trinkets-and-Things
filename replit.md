# Overview

This is a 3D printing showcase and e-commerce website built with a modern full-stack architecture. The application displays 3D printed products across different categories (functional items, artistic pieces, and prototypes), allows users to browse and search products, and includes a contact form for inquiries. The site features a responsive design with smooth scrolling navigation, product filtering, and detailed product views through modals.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based UI built with React 18 and TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds with HMR support
- **Wouter Router**: Lightweight client-side routing for single-page application navigation
- **shadcn/ui Components**: Pre-built, accessible UI components based on Radix UI primitives with Tailwind CSS styling
- **TanStack Query**: Server state management for API calls with caching, background updates, and error handling
- **React Hook Form**: Form state management with Zod schema validation for type-safe form handling

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing, logging, and error handling
- **TypeScript**: Full-stack type safety with shared schemas between client and server
- **In-Memory Storage**: Development storage implementation with plans for database migration
- **API Routes**: RESTful endpoints for products (`/api/products`) and contact forms (`/api/contact`)

## Data Storage
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema definitions and migrations
- **PostgreSQL**: Production database configured for Neon serverless hosting
- **Shared Schema**: Common TypeScript types and Zod validation schemas used across client and server
- **Database Structure**: Products table with categories, images, materials, and pricing; Contacts table for form submissions

## Styling and UI
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **CSS Variables**: Theme system supporting light/dark modes with consistent color palette
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Library**: Comprehensive UI component system with consistent styling and accessibility

## Development Features
- **Hot Module Replacement**: Vite development server with instant updates
- **Error Overlay**: Development error modal for better debugging experience
- **Path Aliases**: Clean import paths using TypeScript path mapping
- **Build Optimization**: Separate client and server builds with external package bundling

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for UI and form management
- **Build Tools**: Vite for frontend bundling, esbuild for server bundling, TypeScript compiler
- **Routing**: Wouter for lightweight client-side routing

## Database and ORM
- **Database**: Neon PostgreSQL serverless database for production
- **ORM**: Drizzle ORM with PostgreSQL dialect and migration support
- **Connection**: @neondatabase/serverless for optimized serverless connections

## UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React icon library
- **Utilities**: clsx and class-variance-authority for conditional styling
- **Carousel**: Embla Carousel for image galleries

## State Management and API
- **Server State**: TanStack React Query for API state management and caching
- **Form Management**: React Hook Form with Hookform Resolvers for validation integration
- **Validation**: Zod for runtime type validation and schema definition

## Development Tools
- **Replit Integration**: Vite plugins for Replit development environment and error handling
- **Session Management**: Connect-pg-simple for PostgreSQL session storage (configured but not actively used)
- **Date Utilities**: date-fns for date formatting and manipulation
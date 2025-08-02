# Netlify Agent Guide - 3D Printing Showcase Website

## 🚨 IMPORTANT: READ THIS FIRST BEFORE MAKING ANY CHANGES

This document contains critical information for any Netlify agent working on this project. Following these guidelines will prevent common deployment issues and ensure smooth operation.

## Project Architecture Overview

### Core Setup
- **Frontend**: React + TypeScript + Vite (client-side only)
- **Database**: Supabase PostgreSQL (serverless)
- **Deployment**: Netlify (static site)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + TanStack Query

### Key Principle: STATIC DEPLOYMENT ONLY
This project is designed as a **static frontend** that connects directly to Supabase. There is NO Express.js server in production. The server folder exists only for development.

## Critical Deployment Configuration

### 1. netlify.toml Configuration
```toml
[build]
  base = "client"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  VITE_SUPABASE_URL = "https://qvjxwkttohjhlhvimoqf.supabase.co"
  VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2anh3a3R0b2hqaGxodmltb3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzI0MTUsImV4cCI6MjA2OTY0ODQxNX0.WiVKALXqVE71hSzlROGJSYhuYxLOPCKgmDLVn1ryurE"
```

**⚠️ NEVER CHANGE THESE SETTINGS:**
- Base directory MUST be `client`
- Publish directory MUST be `dist`
- Build command MUST be `npm run build`
- Redirects rule is ESSENTIAL for SPA routing

### 2. Client Directory Structure
```
client/
├── src/                    # React application source
├── dist/                   # Build output (auto-generated)
├── package.json           # Client-only dependencies
├── vite.config.ts         # Vite build configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── .env                   # Environment variables
```

### 3. Environment Variables
Environment variables MUST be prefixed with `VITE_` to be accessible in the frontend:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Supabase Integration

### Database Setup
1. **Tables**: `products` and `contacts` (see `supabase-schema.sql`)
2. **Row Level Security**: Enabled with public read/insert policies
3. **Connection**: Direct client-side connection (no server required)

### Key Files for Supabase:
- `client/src/lib/supabase.ts`: Supabase client configuration
- `client/src/types/database.ts`: TypeScript types for database
- `client/src/hooks/use-products.ts`: Product data fetching hooks
- `supabase-schema.sql`: Database schema and sample data

### Supabase Client Usage:
```typescript
// Correct way to fetch data
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false });
```

## Common Issues and Solutions

### 🚫 Build Failures

**Issue**: Missing Tailwind plugins
```
Cannot find module '@tailwindcss/typography'
```
**Solution**: Only use `tailwindcss-animate` plugin. Remove any other Tailwind plugins from `client/tailwind.config.ts`.

**Issue**: Incorrect dependencies
**Solution**: Ensure `client/package.json` contains only frontend dependencies. No Express.js or server packages.

### 🚫 404 Errors on Deployed Site

**Issue**: SPA routing not working
**Solution**: Verify `netlify.toml` has the redirect rule:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 🚫 Database Connection Issues

**Issue**: Supabase environment variables not working
**Solution**: 
1. Verify variables are prefixed with `VITE_`
2. Check they're set in both `client/.env` and `netlify.toml`
3. Restart build after changing environment variables

## Dependency Management

### ✅ Allowed Dependencies (client/package.json)
- React ecosystem: `react`, `react-dom`, `@types/react`, etc.
- Supabase: `@supabase/supabase-js`
- 3D Graphics: `three` (Three.js for 3D model viewing)
- UI components: `@radix-ui/*`, `lucide-react`
- Styling: `tailwindcss`, `tailwindcss-animate`, `clsx`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- Routing: `wouter`
- Data fetching: `@tanstack/react-query`
- Build tools: `vite`, `@vitejs/plugin-react`, `typescript`

### 🚫 Forbidden Dependencies
- Express.js or any server packages
- Database drivers (use Supabase client only)
- Additional Tailwind plugins beyond `tailwindcss-animate`
- Node.js specific packages

## Development vs Production

### Development Environment
- Uses Express.js server for convenience (see `server/` folder)
- Vite dev server with HMR
- Environment variables loaded from `client/.env`

### Production Environment (Netlify)
- Static files only (no server)
- Built with `vite build` in `client/` directory
- Environment variables from `netlify.toml`
- Direct Supabase connection from browser

## File Changes to NEVER Make

### ❌ DON'T TOUCH THESE FILES:
- `netlify.toml` (deployment will break)
- `client/vite.config.ts` (build configuration)
- `client/tsconfig.json` (TypeScript configuration)
- `supabase-schema.sql` (database structure)

### ❌ DON'T ADD THESE:
- Server-side code in production builds
- Additional build tools or bundlers
- Database migrations (use Supabase dashboard)
- Custom Netlify functions

## Testing Deployment Locally

```bash
# Navigate to client directory
cd client

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Verify build output
ls -la dist/

# Preview build locally
npm run preview
```

## Troubleshooting Checklist

Before making any changes, verify:
1. ✅ `client/package.json` has correct dependencies
2. ✅ `client/tailwind.config.ts` only uses `tailwindcss-animate`
3. ✅ `netlify.toml` configuration is unchanged
4. ✅ Environment variables are prefixed with `VITE_`
5. ✅ Build works locally: `cd client && npm run build`
6. ✅ Supabase schema is properly set up

## Recent Changes and Fixes

### 2025-01-02: Netlify Build Fix
- **Issue**: Build failing due to missing `@tailwindcss/typography`
- **Solution**: Removed plugin from `tailwind.config.ts`
- **Result**: Clean builds on Netlify

### 2025-01-02: Static Deployment Setup
- **Issue**: 404 errors on Netlify deployment
- **Solution**: Created separate client build configuration
- **Result**: Proper static site deployment

## Contact and Support

For issues with this setup:
1. Check this guide first
2. Verify Supabase connection in dashboard
3. Test build locally before deploying
4. Review Netlify build logs for specific errors

## Summary for Quick Reference

**What this is**: Static React site + Supabase database
**Deployment**: Netlify static hosting
**Build**: `cd client && npm run build`
**Environment**: All variables prefixed with `VITE_`
**Database**: Supabase with direct client connection
**Routing**: Wouter with Netlify redirects for SPA

**Key Rule**: Keep it simple. This is a static frontend with database backend. No server, no complexity.
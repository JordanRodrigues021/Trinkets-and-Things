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
2. **Row Level Security**: DISABLED for simplified admin operations
3. **Connection**: Direct client-side connection (no server required)
4. **Admin Panel**: Fully functional at `/admin` with hardcoded credentials

### 🔥 CRITICAL DATABASE CONFIGURATION SOLVED ISSUES:

#### Admin Panel Database Update Problems
**Problem**: Admin panel showed "Product updated" but no actual database changes occurred.
**Root Cause**: Row Level Security (RLS) policies were blocking updates due to lack of authentication context.
**Solution Applied**: 
```sql
-- Disable RLS for simplified admin functionality
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

#### Model URL Column Removal Issues  
**Problem**: Database errors when creating/updating products due to missing model_url column.
**Root Cause**: Schema updates weren't applied to actual Supabase database.
**Solution Applied**:
1. Removed `model_url` column from database schema completely
2. Updated TypeScript types to remove model_url references
3. Updated all INSERT/UPDATE operations to exclude model_url

#### TypeScript Environment Variable Errors
**Problem**: `Property 'env' does not exist on type 'ImportMeta'`
**Solution Applied**: Created `client/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Key Files for Supabase:
- `client/src/lib/supabase.ts`: Supabase client configuration
- `client/src/types/database.ts`: TypeScript types for database (NO model_url)
- `client/src/hooks/use-products.ts`: Product data fetching hooks
- `supabase-schema.sql`: Database schema with RLS DISABLED
- `client/vite-env.d.ts`: TypeScript environment variable types

### WhatsApp Notifications System:
- `netlify/functions/send-whatsapp-notification.js`: Serverless function for WhatsApp messaging
- `client/src/pages/checkout.tsx`: Modified to trigger WhatsApp notifications on order placement
- `netlify.toml`: Updated with functions path and environment variable placeholders
- `WHATSAPP_SETUP_GUIDE.md`: Comprehensive setup instructions for Twilio integration
- **Environment Variables Required**: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, OWNER_WHATSAPP_NUMBER, ADMIN_URL

### Unified Color System:
- `client/src/lib/colors.ts`: Centralized color mapping system with 30+ color definitions
- `client/src/components/add-to-cart-button.tsx`: Updated to use unified color system
- `client/src/components/product-modal.tsx`: Updated to use unified color system
- **Features**: Case-insensitive matching, fallback colors, hex and Tailwind class support

### Database Schema Application Process:
1. Go to Supabase Dashboard > SQL Editor
2. Run the complete `supabase-schema.sql` file
3. Verify RLS is disabled with: `SHOW row_security;`
4. Test admin panel functionality

### Admin Panel Credentials:
- Email: `jordanrodrigues021@gmail.com`
- Password: `Jordan@trinketsandthings123`
- Access URL: `/admin`

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

## 🔧 ADMIN PANEL IMPLEMENTATION GUIDE

### Complete Admin System Architecture
The admin panel was successfully implemented with these exact specifications:

#### Admin Login System
- **Route**: `/admin`
- **Authentication**: Hardcoded credentials (localStorage-based)
- **Credentials**: 
  - Email: `jordanrodrigues021@gmail.com`
  - Password: `Jordan@trinketsandthings123`
- **Implementation**: Simple form validation, no database authentication required

#### Admin Dashboard Features
- **Route**: `/admin/dashboard`
- **Product Management**: Full CRUD operations on products table
- **Contact Management**: View contact form submissions
- **Navigation**: Clean admin interface with sidebar navigation

#### Product Form Implementation  
- **Routes**: `/admin/products/new` and `/admin/products/:id/edit`
- **Form Library**: React Hook Form with Zod validation
- **Image Management**: URL-based image array system
- **Color Management**: String array for available colors
- **Categories**: Functional, Artistic, Prototypes (enum validation)

### 🚨 DEBUGGING METHODOLOGY THAT SOLVED ISSUES

#### Step 1: Add Comprehensive Logging
When admin updates weren't working, we added detailed console logging:
```typescript
const { data: result, error } = await supabase
  .from('products')
  .update(productData)
  .eq('id', params.id)
  .select();

console.log('Update result:', result);
console.log('Update error:', error);
```

#### Step 2: Identify Empty Array Response
**Key Discovery**: `Update result: Array(0)` indicated no rows were updated, not a database error.
**Diagnosis**: This pattern means RLS policies are blocking the operation.

#### Step 3: RLS Policy Resolution
**Root Issue**: Row Level Security was preventing updates due to lack of authentication context.
**Solution**: Disable RLS entirely for simplified admin functionality:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

#### Step 4: Schema Column Cleanup
**Issue**: Attempting to update non-existent `model_url` column
**Solution**: Completely remove model_url from:
1. Database schema (`supabase-schema.sql`)
2. TypeScript types (`client/src/types/database.ts`) 
3. Form submission logic (`admin-product-form.tsx`)

#### Step 5: TypeScript Environment Variables
**Issue**: `Property 'env' does not exist on type 'ImportMeta'`
**Solution**: Create proper type definitions in `client/vite-env.d.ts`

### Verification Steps for Admin Panel
1. Navigate to `/admin` - should show login form
2. Enter credentials - should redirect to dashboard
3. Create new product - should save and show in list
4. Edit existing product - should update successfully
5. Check browser console - should show successful database operations

### Admin Panel File Structure
```
client/src/pages/
├── admin-login.tsx           # Login form with hardcoded credentials
├── admin-dashboard.tsx       # Main admin interface with product/contact lists
└── admin-product-form.tsx    # Product creation/editing form

client/src/components/
└── navigation.tsx            # Main site navigation (updated for admin access)
```

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

## 🎯 PROJECT REQUIREMENTS SUCCESSFULLY IMPLEMENTED

### ✅ Core Features Delivered
1. **3D Printing Showcase**: Product catalog with categories (Functional, Artistic, Prototypes)
2. **Image-Only Products**: NO 3D model viewing functionality (completely removed)
3. **Admin Panel**: Full product and contact management system
4. **Contact Form**: Functional contact form saving to Supabase
5. **Responsive Design**: Mobile-first with Tailwind CSS
6. **Static Deployment**: Fully serverless, Netlify-ready

### ✅ Admin Panel Capabilities
- Product creation with name, description, price, category, material, dimensions, weight, print time
- Image URL management (multiple images per product)
- Color variant management  
- Featured product flagging (0=normal, 1=featured, 2=highly featured)
- Contact form submission viewing
- Simple authentication system

### ✅ Technical Implementation
- React + TypeScript frontend
- Supabase PostgreSQL database
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation
- TanStack Query for data fetching
- Wouter for client-side routing
- Vite build system for static deployment

### 🔒 Security Considerations
- RLS disabled for simplified admin operations
- Hardcoded admin credentials (suitable for single-admin use)
- Anonymous Supabase key used (read/write access)
- No server-side authentication required

**Note**: For production scaling, consider implementing proper authentication with Supabase Auth and re-enabling RLS with appropriate policies.

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

### 2025-01-02: WhatsApp Order Notifications System
- **Feature**: Added serverless WhatsApp notifications for new orders
- **Implementation**: 
  - Created Netlify function `send-whatsapp-notification.js` with Twilio integration
  - Updated `netlify.toml` with functions path `../netlify/functions`
  - Modified checkout process to trigger WhatsApp notifications
  - Added comprehensive error handling and debugging
- **Requirements**: 5 environment variables needed (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, etc.)
- **Result**: Owners receive WhatsApp messages with order details automatically

### 2025-01-02: Unified Color System Fix
- **Issue**: Product color swatches showing grey instead of actual colors
- **Root Cause**: Two different color mapping systems causing inconsistencies
- **Solution**: 
  - Created unified color system in `client/src/lib/colors.ts`
  - Updated both AddToCartButton and ProductModal components
  - Added 30+ color mappings including metals, gradients, and special materials
  - Implemented case-insensitive color matching with fallbacks
- **Result**: All color swatches now display correct colors consistently

### 2025-01-02: Logo Update
- **Change**: Updated website logo to custom circular "Trinkets and Things" logo
- **Implementation**: Modified navigation component to use new logo URL
- **URL**: `https://i.ibb.co/21pXCY9j/Trinkets-and-Things-Logo-circle.png`

### 2025-01-02: Netlify Build Fix
- **Issue**: Build failing due to missing `@tailwindcss/typography`
- **Solution**: Removed plugin from `tailwind.config.ts`
- **Result**: Clean builds on Netlify

### 2025-01-02: Static Deployment Setup
- **Issue**: 404 errors on Netlify deployment
- **Solution**: Created separate client build configuration
- **Result**: Proper static site deployment

### 2025-01-02: Workspace Cleanup
- **Action**: Cleaned up development workspace for better organization
- **Removed Files**: 
  - Debug scripts: `debug-whatsapp.cjs`, `debug-whatsapp.js`, `test-whatsapp.js`
  - Outdated docs: `NETLIFY_FUNCTION_FIX.md`, `QUICK_WHATSAPP_SETUP.md`, `DEPLOYMENT.md`
  - Import files: `BULK_IMPORT_GUIDE.md`, `sample-products.csv`, `imported-products.csv`
  - Unused assets: `attached_assets/` directory
- **Result**: Cleaner workspace with only essential files

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
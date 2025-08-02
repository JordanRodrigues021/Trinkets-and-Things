# Deployment Instructions

## Netlify Deployment

This project is configured for static deployment on Netlify with Supabase as the backend database.

### Prerequisites

1. **Supabase Project Setup**:
   - Create a Supabase project at https://supabase.com
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Note down your project URL and anon key

2. **Environment Variables**:
   - The project is pre-configured with environment variables in `netlify.toml`
   - Update the Supabase URL and anon key in `netlify.toml` if needed

### Deployment Steps

1. **Connect Repository**:
   - Connect your repository to Netlify
   - The build configuration is already set in `netlify.toml`

2. **Build Configuration**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Deploy**:
   - Netlify will automatically build and deploy your site
   - The site will be available at your Netlify URL

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── dist/              # Build output (generated)
│   ├── package.json       # Client dependencies
│   └── vite.config.ts     # Vite configuration
├── netlify.toml           # Netlify configuration
├── supabase-schema.sql    # Database schema
└── DEPLOYMENT.md          # This file
```

### Features

- **Products**: Displays 3D printed products from Supabase database
- **Categories**: Functional, Artistic, and Prototypes
- **Search**: Filter products by name, description, or category
- **Contact Form**: Saves inquiries to Supabase contacts table
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes

### Troubleshooting

- **404 Errors**: Ensure `netlify.toml` redirect rules are in place
- **Database Errors**: Verify Supabase environment variables are correct
- **Build Failures**: Check that all dependencies are installed in `client/package.json`
# 3D Printing Showcase Website

A professional showcase website for 3D printed products built with React, TypeScript, and Supabase. Designed for static deployment on Netlify.

## 🚀 Live Demo

Visit the live site at: `trinketsandthings.netlify.app`

## 📋 Features

- **Product Gallery**: Browse 3D printed products across three categories (Functional, Artistic, Prototypes)
- **3D Model Viewer**: Interactive 3D visualization of products with rotation, zoom, and pan controls
- **Search & Filter**: Find products by name, description, or category
- **Product Details**: View detailed specifications, materials, and pricing with tabbed interface
- **Contact Form**: Submit inquiries directly to database
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js for interactive 3D model rendering
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Netlify (Static)
- **State Management**: TanStack Query + React Hooks

### Project Structure
```
├── client/                 # Static React application
│   ├── src/               # Source code
│   ├── dist/              # Build output
│   └── package.json       # Frontend dependencies
├── supabase-schema.sql    # Database schema
├── netlify.toml           # Deployment configuration
├── NETLIFY_AGENT_GUIDE.md # Comprehensive agent documentation
└── DEPLOYMENT.md          # Deployment instructions
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Supabase account and project

### Setup
1. Clone the repository
2. Set up Supabase:
   ```sql
   -- Run the SQL from supabase-schema.sql in your Supabase SQL Editor
   ```
3. Configure environment variables in `client/.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Install dependencies and start development:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Building for Production
```bash
cd client
npm run build
```

## 🚀 Deployment

This project is configured for automatic deployment on Netlify:

1. Connect your repository to Netlify
2. Netlify will automatically use the configuration from `netlify.toml`
3. Ensure your Supabase environment variables are set

For detailed deployment instructions, see `DEPLOYMENT.md`.

## 📚 Documentation

- **`NETLIFY_AGENT_GUIDE.md`**: Comprehensive guide for future developers/agents
- **`DEPLOYMENT.md`**: Step-by-step deployment instructions  
- **`replit.md`**: Project architecture and preferences
- **`supabase-schema.sql`**: Database schema and sample data

## 🗄️ Database Schema

### Products Table
- Product information (name, description, price, category)
- Technical specifications (material, dimensions, weight, print time)
- Media (colors, images)
- Metadata (featured status, timestamps)

### Contacts Table
- Customer inquiries from contact form
- Personal information and message content
- Timestamps for tracking

## 🔧 Key Configuration Files

- **`netlify.toml`**: Netlify build and deployment settings
- **`client/vite.config.ts`**: Vite build configuration
- **`client/tailwind.config.ts`**: Tailwind CSS styling configuration
- **`client/package.json`**: Frontend dependencies and scripts

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Public read access for products
- Insert-only access for contact submissions
- Environment variables properly configured for client-side access

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first design approach
- Optimized layouts for all screen sizes
- Touch-friendly navigation and interactions
- Fast loading with optimized assets

## 🎨 UI Components

Built with shadcn/ui component library:
- Consistent design system
- Accessible components
- Dark mode support
- Professional styling

## 📈 Performance

- Static site generation for fast loading
- Optimized bundle size with Vite
- Efficient database queries with Supabase
- CDN distribution via Netlify

## 🔄 Future Enhancements

Potential improvements:
- Product search with advanced filters
- User authentication and favorites
- Shopping cart functionality
- Admin dashboard for product management
- Real-time inventory tracking

## 🆘 Support

For development issues:
1. Check the `NETLIFY_AGENT_GUIDE.md` for common solutions
2. Verify Supabase connection and environment variables
3. Review build logs in Netlify dashboard
4. Test local build with `cd client && npm run build`

## 📄 License

This project is configured for deployment and can be modified as needed for your specific use case.
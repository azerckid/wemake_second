# WeMake Clone

A modern, production-ready clone of Product Hunt (WeMake) built with React Router, TypeScript, and Tailwind CSS v4.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering with React Router v7
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎨 Tailwind CSS v4 for styling
- 🎯 shadcn/ui components
- 📱 Responsive design
- 🌙 Dark mode support
- 💬 Real-time messaging UI
- 📊 Product discovery and promotion
- 👥 Community features
- 💼 Job listings
- 🤝 Team collaboration
- 📖 [React Router docs](https://reactrouter.com/)

## Tech Stack

- **Framework**: React Router v7
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Date Handling**: date-fns, luxon
- **Form Validation**: Zod

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Project Structure

```
app/
├── common/
│   ├── components/ui/     # shadcn/ui components
│   └── pages/             # Shared pages
├── features/
│   ├── auth/              # Authentication pages
│   ├── community/         # Community features
│   ├── jobs/              # Job listings
│   ├── products/          # Product discovery
│   ├── teams/             # Team collaboration
│   └── users/             # User profiles & messaging
└── routes.ts              # Route configuration
```

## Key Features Implemented

### Authentication
- Login and registration pages
- OTP verification flow
- Social authentication

### Products
- Product discovery and leaderboards
- Product submission and promotion
- Product reviews and ratings
- Calendar for promotion period selection

### Community
- Discussion posts
- Post submission
- Community engagement

### Jobs
- Job listings with filters
- Job application
- Company profiles

### Teams
- Team discovery
- Team creation
- Team collaboration

### User Features
- User profiles (public and private)
- Dashboard with ideas and products
- Real-time messaging with online status
- Notifications
- Settings

### Messaging
- Sidebar-based message list
- Real-time chat interface
- Online status indicators
- Message bubbles with alternating alignment

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/) with custom theme configuration. All styling is done through CSS variables in `app/app.css` using the `@theme` directive.

### Customization

Tailwind CSS v4 configuration is located in `app/app.css`:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-sidebar: var(--sidebar);
  /* ... more customizations */
}
```

## shadcn/ui Components

This project uses shadcn/ui components for consistent UI design:

- Avatar, Badge, Breadcrumb
- Button, Calendar, Card
- Dialog, Dropdown Menu
- Input, Label, Scroll Area
- Select, Separator, Sheet
- Sidebar, Skeleton, Textarea
- Tooltip

## Development Tips

- Use `@` alias for imports from `app/` directory
- Tailwind v4 uses CSS variables and `@theme` directive instead of `tailwind.config.ts`
- All routes are defined in `app/routes.ts`
- Use `loader` and `action` functions for data fetching and mutations
- Components receive `Route.ComponentProps` type param instead of using hooks

---

Built with ❤️ using React Router v7, TypeScript, and Tailwind CSS v4.

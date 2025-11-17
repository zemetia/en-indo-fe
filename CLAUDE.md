# CLAUDE.md - EN Indonesia Connect

## Project Overview

**EN Indonesia Connect** is a comprehensive church management system built for Every Nation Indonesia. It's a full-stack web application designed to manage church operations, member engagement, events, attendance, worship teams, life groups, and more.

### Core Purpose
- Church and member management
- Event planning and attendance tracking
- Life group coordination
- Worship team scheduling
- Visitor management and follow-up
- Role-based access control
- AI-powered engagement insights

## Tech Stack

### Framework & Runtime
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.1** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **class-variance-authority** - Component variants
- **Lucide React & React Icons** - Icon libraries

### Backend & Data
- **Firebase 11.9.1** - Authentication and backend services
- **Axios** - HTTP client with enhanced caching
- **Genkit AI 1.13.0** - AI integration for engagement insights

### Forms & Validation
- **React Hook Form 7.54.2** - Form management
- **Zod 3.24.2** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Other Key Libraries
- **react-big-calendar** - Calendar component
- **recharts** - Charts and data visualization
- **qrcode.react & qr-scanner** - QR code generation and scanning
- **date-fns & moment** - Date manipulation
- **crypto-js** - Client-side encryption
- **jwt-decode** - JWT token handling

## Directory Structure

```
en-indo-fe/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── dashboard/                # Main dashboard area
│   │   │   ├── attendance/           # Attendance tracking (manual, QR, event-based)
│   │   │   ├── church/               # Church management & statistics
│   │   │   ├── department/           # Department management
│   │   │   ├── event/                # Event management & calendar
│   │   │   ├── jadwal-saya/          # My schedule (Indonesian)
│   │   │   ├── jemaat/               # Member management (Indonesian)
│   │   │   ├── ketersediaan/         # Availability management
│   │   │   ├── lifegroup/            # Life group management
│   │   │   ├── musik/                # Music/worship team scheduling
│   │   │   ├── pelayanan/            # Ministry/service management
│   │   │   ├── pemuridan/            # Discipleship
│   │   │   ├── role/                 # Role & permission management
│   │   │   ├── settings/             # User settings
│   │   │   └── tamu/                 # Visitor management (Indonesian)
│   │   ├── login/                    # Authentication pages
│   │   ├── api/                      # API routes
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # React components
│   │   ├── ui/                       # Shared UI components (shadcn/ui based)
│   │   ├── dashboard/                # Dashboard-specific components
│   │   ├── events/                   # Event-related components
│   │   ├── auth/                     # Authentication components
│   │   ├── navigation/               # Navigation components
│   │   ├── buttons/                  # Button components
│   │   └── links/                    # Link components
│   ├── lib/                          # Library utilities
│   │   ├── api/                      # API endpoint definitions
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── api-client.ts             # Enhanced Axios client
│   │   ├── helper.ts                 # Utility functions
│   │   ├── auth-service.ts           # Authentication services
│   │   ├── church-service.ts         # Church-related services
│   │   ├── person-service.ts         # Person/member services
│   │   ├── visitor-service.ts        # Visitor services
│   │   ├── lifegroup.ts              # Life group services
│   │   └── pelayanan-service.ts      # Ministry services
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication context
│   │   ├── ToastContext.tsx          # Toast notifications
│   │   └── PasswordSetupContext.tsx  # Password setup flow
│   ├── constant/                     # Constants and configuration
│   │   ├── config.ts                 # Site configuration
│   │   ├── env.ts                    # Environment helpers
│   │   └── menu.tsx                  # Menu structure & permissions
│   ├── hooks/                        # Custom hooks
│   ├── ai/                           # AI integration (Genkit)
│   ├── styles/                       # Global styles
│   └── __tests__/                    # Test files
├── public/                           # Static assets
├── docs/                             # Documentation
│   └── blueprint.md                  # Project blueprint
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── middleware.ts                     # Next.js middleware
```

## Key Architectural Patterns

### 1. API Client Pattern

The project uses an **EnhancedAPIClient** (`src/lib/api-client.ts`) with advanced features:

```typescript
// Features:
- Request deduplication (prevents duplicate simultaneous requests)
- Automatic caching for GET requests (5-minute TTL default)
- Retry logic with exponential backoff
- Abort controller support
- Automatic JWT token injection
- 401 redirect to login
- Request queue management
```

**Usage Example:**
```typescript
import { enhancedApiClient } from '@/lib/api-client';

// GET with caching
const data = await enhancedApiClient.get('/api/members', {
  cache: true,
  cacheTTL: 300000 // 5 minutes
});

// POST without caching
await enhancedApiClient.post('/api/members', memberData);
```

### 2. Service Layer Pattern

Business logic is separated into service files:
- `auth-service.ts` - Authentication operations
- `church-service.ts` - Church CRUD operations
- `person-service.ts` - Member management
- `visitor-service.ts` - Visitor management
- `lifegroup.ts` - Life group operations
- `pelayanan-service.ts` - Ministry/service operations

**Convention:** Each service exports functions that use the `enhancedApiClient`

### 3. Component Architecture

#### UI Components (`src/components/ui/`)
- Based on **shadcn/ui** principles
- Use Radix UI primitives
- Styled with Tailwind CSS
- Implement **class-variance-authority** for variants

**Example Pattern:**
```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  }
})
```

#### Feature Components (`src/components/dashboard/`, etc.)
- Domain-specific components
- Can use UI components
- Connect to service layer
- May include local state management

### 4. Authentication Flow

```
1. User logs in → auth-service.ts
2. Token received → Encrypted and stored in cookie (helper.ts)
3. All API requests → Auto-include Bearer token (api-client.ts)
4. 401 response → Auto-redirect to /login
5. Token stored with user data (pelayanan, roles, etc.)
```

**Key Functions:**
- `setUserData(userData)` - Encrypts and stores user data
- `getUserData()` - Retrieves and decrypts user data
- `getToken()` - Extracts JWT token
- `clearUserData()` - Logs out user

### 5. Permission System

Located in `src/constant/menu.tsx`:

```typescript
interface MenuItem {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  permissions: string[];      // Required roles
  requirePIC?: boolean;        // Requires PIC (Person In Charge) role
  submenu?: MenuItem[];
}

// Check access
hasAccess(menu, userRoles, userPelayanan): boolean
```

**Roles:**
- `admin` - Full access
- Custom roles defined per ministry/department
- PIC (Person In Charge) - Special elevated permissions

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Run with fast parallel builds
npm run dev:fast

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Analyze bundle
npm run analyze
```

### Environment Variables

Required environment variables (create `.env.local`):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=<backend-api-url>

# Encryption
NEXT_PUBLIC_SECRET_KEY=<your-secret-key>

# Logging
NEXT_PUBLIC_SHOW_LOGGER=true  # Show logs in production

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=<key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<id>
# ... other Firebase config
```

### Code Style Guidelines

#### TypeScript Conventions
- Use TypeScript for all files (`.ts`, `.tsx`)
- Define interfaces for all data structures
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and utilities
- Avoid `any` - use `unknown` if type is truly unknown

#### Component Conventions
```typescript
// ✅ Good: Named export with interface
interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export function ComponentName({ title, onAction }: ComponentNameProps) {
  // implementation
}

// ✅ Good: Default export for page components
export default function Page() {
  // implementation
}
```

#### Naming Conventions
- **Files:** `kebab-case.tsx` for components, `camelCase.ts` for utilities
- **Components:** `PascalCase`
- **Functions/Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE` or `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Context:** `PascalCase` with `Context` suffix (e.g., `AuthContext`)

#### Import Order
```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal absolute imports (using @/ alias)
import { Button } from '@/components/ui/button';
import { getUserData } from '@/lib/helper';

// 3. Relative imports
import { LocalComponent } from './LocalComponent';

// 4. Types
import type { User } from '@/types';
```

### Styling Guidelines

#### Tailwind CSS Usage
```typescript
// ✅ Use Tailwind utility classes
<div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-md">

// ✅ Use cn() utility for conditional classes
import { cn } from '@/lib/utils';
<div className={cn("base-class", isActive && "active-class")}>

// ❌ Avoid inline styles unless absolutely necessary
<div style={{ color: 'red' }}> // Avoid
```

#### Color System
Use Tailwind's CSS variables defined in `globals.css`:

```css
--primary: /* Main brand color */
--secondary: /* Secondary color */
--accent: /* Accent color */
--destructive: /* Error/delete actions */
--muted: /* Subtle backgrounds */
```

**Usage:**
```typescript
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
```

### Performance Optimizations

The project includes several performance optimizations:

1. **Bundle Splitting** (next.config.js):
   - Separate chunks for Radix UI, Firebase, and vendor libraries
   - Optimized package imports for lucide-react, framer-motion, etc.

2. **Turbopack** - Faster builds in development

3. **Image Optimization** - Next.js Image component

4. **Code Splitting** - Automatic with Next.js App Router

5. **Request Deduplication** - Via EnhancedAPIClient

6. **Caching** - GET requests cached for 5 minutes by default

## Common Tasks for AI Assistants

### Adding a New Page

1. Create the page file:
```bash
src/app/dashboard/[feature-name]/page.tsx
```

2. Implement the page component:
```typescript
'use client'; // If using hooks/state

export default function FeaturePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Feature Name</h1>
      {/* Content */}
    </div>
  );
}
```

3. Add to menu (if needed) in `src/constant/menu.tsx`:
```typescript
{
  title: 'Feature Name',
  description: 'Description',
  icon: IconComponent,
  href: '/dashboard/feature-name',
  color: '#007BFF',
  permissions: ['admin', 'feature-role'],
}
```

### Adding a New API Service

1. Create service file: `src/lib/[feature]-service.ts`

2. Implement service functions:
```typescript
import { enhancedApiClient } from './api-client';

export interface Feature {
  id: string;
  name: string;
  // ... other fields
}

export async function getFeatures(): Promise<Feature[]> {
  return enhancedApiClient.get('/api/features', {
    cache: true,
    cacheTTL: 300000 // 5 minutes
  });
}

export async function createFeature(data: Partial<Feature>): Promise<Feature> {
  return enhancedApiClient.post('/api/features', data);
}

export async function updateFeature(id: string, data: Partial<Feature>): Promise<Feature> {
  return enhancedApiClient.put(`/api/features/${id}`, data);
}

export async function deleteFeature(id: string): Promise<void> {
  return enhancedApiClient.delete(`/api/features/${id}`);
}
```

### Adding a New UI Component

1. For shadcn/ui components:
```bash
# If components.json is configured
npx shadcn-ui@latest add [component-name]
```

2. For custom components, create in `src/components/ui/[component-name].tsx`:
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { default: "...", /* other variants */ },
      size: { default: "...", /* other sizes */ }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export function Component({
  className,
  variant,
  size,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Implementing Authentication-Required Features

1. Use the `AuthContext`:
```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export default function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Unauthorized</div>;

  return <div>Protected content</div>;
}
```

2. Check permissions:
```typescript
import { getUserData } from '@/lib/helper';
import { hasAccess } from '@/constant/menu';

const userData = getUserData();
const canAccess = hasAccess(
  menuItem,
  userData?.roles || [],
  userData?.pelayanan || []
);
```

### Form Handling Pattern

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Call service function
      await someService.create(data);
      // Show success toast
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('name')} placeholder="Name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input {...register('email')} placeholder="Email" type="email" />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

## Language & Localization

- **Primary Language:** Indonesian (Bahasa Indonesia)
- **Locale:** `id` (set in `src/app/layout.tsx`)
- **Mixed Usage:** UI labels and user-facing text are in Indonesian, but code/comments are in English

**Common Indonesian Terms in Codebase:**
- `jemaat` - Members/congregation
- `tamu` - Visitors/guests
- `pelayanan` - Ministry/service
- `pemuridan` - Discipleship
- `jadwal` - Schedule
- `ketersediaan` - Availability
- `lifegroup` - Small group/cell group

## Testing

- Test files located in `src/__tests__/`
- Component tests in `src/lib/__tests__/`
- Follow naming: `[filename].test.ts` or `[filename].test.tsx`

## Important Notes for AI Assistants

### Security Considerations
1. **Never commit secrets** - All sensitive data must be in environment variables
2. **Client-side encryption** - User data is encrypted before storing in cookies
3. **JWT tokens** - Always transmitted in Authorization headers
4. **Input validation** - Always use Zod schemas for form validation
5. **XSS Prevention** - React handles this, but be careful with `dangerouslySetInnerHTML`

### Build Considerations
1. **TypeScript errors ignored in build** - `ignoreBuildErrors: true` in next.config.js
2. **ESLint errors ignored in build** - `ignoreDuringBuilds: true` in next.config.js
3. This is **NOT RECOMMENDED** for production - Should be fixed before deployment

### Performance Considerations
1. Use `cache: true` for GET requests that don't change frequently
2. Implement optimistic updates for better UX
3. Use React Suspense for async components when appropriate
4. Lazy load heavy components with `dynamic()` from 'next/dynamic'

### Common Pitfalls
1. **Client vs Server Components** - Be aware of Next.js 13+ App Router patterns
2. **'use client'** - Required for hooks, browser APIs, event handlers
3. **Path Aliases** - Always use `@/` imports instead of relative paths
4. **Image Optimization** - Use `next/image` instead of `<img>` tags
5. **API Routes** - Remember they run server-side and have different environment variables

## Design System

### Colors
- **Primary:** White (#FFFFFF) - Clean, modern base
- **Secondary:** Soft Blue (#ADD8E6) - Every Nation brand color
- **Accent:** Bright Blue (#007BFF) - Interactive elements
- **Font:** Roboto - Modern, readable sans-serif

### Design Principles
1. **Minimalist** - Clean layouts with generous white space
2. **User-Friendly** - Intuitive navigation and clear hierarchy
3. **Consistent** - Line-based icons in brand colors
4. **Subtle Animations** - Gentle transitions, no distracting effects
5. **Accessibility** - Use Radix UI for accessible components

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/
- **shadcn/ui:** https://ui.shadcn.com/
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/

## Deployment

- **Platform:** Firebase Hosting (based on apphosting.yaml)
- **Build:** `npm run build`
- **Output:** Standalone mode enabled
- **Environment:** Set production environment variables in hosting platform

---

**Last Updated:** 2025-11-17
**Maintained For:** AI-assisted development with Claude Code and similar tools

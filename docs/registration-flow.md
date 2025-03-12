
# SP Fair Value Registration Flow Documentation

## Overview
This document outlines the complete registration and subscription process for SP Fair Value, including all routes, components, API endpoints, and server actions.

## Flow Stages

### 1. Initial Landing Page (`app/page.tsx` and `components/landing/*.tsx`)
- Users start at the landing page which includes:
  - Hero section with "Get Started" button (`components/landing/hero-section.tsx`)
  - Features section showcasing SPFV tools (`components/landing/features-section.tsx`)
  - Benefits section (`components/landing/benefits-section.tsx`)
  - Pricing section with subscription plans (`components/landing/pricing-section.tsx`)
  - CTA section (`components/landing/cta-section.tsx`)

**API Involved:**
- `GET /api/stripe/subscription-plans`
  - Fetches available subscription plans from Stripe
  - Caches results for 1 hour using `unstable_cache`
  - Returns formatted plan data including prices and features

### 2. Plan Selection Flow
- When a user clicks "Get Started", they're directed to `/sign-up`
- After sign-up, they're redirected to `/account-confirmation`
- `account-confirmation/page.tsx` shows:
  - Success message for account creation
  - Plan selection cards
  - Selected plan is stored in localStorage
  - "Continue" button leads to additional data collection

**Components:**
- `PricingSection`: Displays subscription plans with pricing
- `PricingSkeleton`: Loading state for pricing data

**API and Data Flow:**
- Fetches plans using `/api/stripe/subscription-plans`
- Stores selected plan in localStorage: `selectedPlan: string`

### 3. Additional Data Collection (`/additional-data`)
- `additional-data-form.tsx` collects:
  - Pre-filled user info (name, email) from auth
  - Street address
  - City, State, ZIP
  - Phone number

**Form Validation:**
```typescript
// lib/validations/user-profile.ts
const userProfileSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(5),
  phone: z.string()
});
```

**Server Actions:**
```typescript
// app/actions/users.ts
export async function updateUser({
  full_name,
  billing_address,
  phone
}: UpdateUserParams): Promise<{ success: boolean; error?: string }>;

export const getCurrentUser = cache(async (): Promise<User | null>);
```

### 4. Agreements Page (`/agreements`)
- `agreements/page.tsx` and `agreements-form.tsx` handle:
  - Terms and Conditions acceptance
  - Privacy Policy acceptance
  - Both must be accepted to proceed

**Form Validation:**
```typescript
// lib/validations/agreements.ts
export const agreementsSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true),
  privacyAccepted: z.boolean().refine((val) => val === true)
});
```

**API Routes:**
- `POST /api/stripe/create-checkout-session`
  ```typescript
  // Request body
  interface CreateCheckoutSessionRequest {
    priceId: string;
  }
  // Response
  interface CreateCheckoutSessionResponse {
    url: string;
    error?: string;
  }
  ```

### 5. Payment Processing
- Stripe handles the payment collection
- On successful payment:
  - Redirects to `/success-payment`
  - Verifies the payment
  - Creates subscription via webhook

**API Routes:**
1. `POST /api/stripe/check-session`
   ```typescript
   // Request body
   interface CheckSessionRequest {
     sessionId: string;
   }
   // Response
   interface CheckSessionResponse {
     status: 'complete' | 'incomplete';
     error?: string;
   }
   ```

2. `POST /api/stripe/webhook`
   - Handles Stripe webhook events:
     ```typescript
     // Handled events
     - 'checkout.session.completed'
     - 'customer.subscription.updated'
     - 'customer.subscription.deleted'
     ```
   - Creates/updates subscriptions in Supabase
   - Updates user billing information

**Supabase Actions:**
```typescript
// app/actions/subscriptions.ts
export async function createSubscription(data: SubscriptionData);
export async function updateSubscription(data: UpdateSubscriptionData);
export const getSubscriptionById = cache(async (id: string));
export const getActiveSubscription = cache(async (userId: string));
```

### 6. Middleware Protection (`middleware.ts`)
- Route protection configuration:
  ```typescript
  const publicRoutes = [
    '/', 
    '/sign-in', 
    '/sign-up', 
    '/auth/callback', 
    '/additional-data', 
    '/agreements', 
    '/success-payment'
  ];
  
  const protectedRoutes = [
    '/dashboard', 
    '/settings', 
    '/profile', 
    '/account-confirmation'
  ];
  ```

**Redirect Logic:**
- No subscription → `/account-confirmation`
- Invalid subscription → `/settings`
- Active subscription → `/dashboard`

## Database Schema

### Users Table
```sql
create table users (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  bio text,
  billing_address jsonb,
  payment_method jsonb,
  phone text
);
```

### Subscriptions Table
```sql
create table subscriptions (
  id text primary key,
  user_id uuid references users not null,
  status text not null,
  price_id text not null,
  quantity integer not null,
  cancel_at_period_end boolean not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  ended_at timestamp with time zone,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  metadata jsonb
);
```

## Error Handling
- Form validation errors using Zod
- API error responses with appropriate status codes
- Toast notifications for user feedback
- Graceful fallbacks for loading states

## Security Considerations
1. Route protection via middleware
2. Supabase RLS policies
3. Stripe webhook signature verification
4. Service role usage for admin operations
5. Protected API routes with authentication checks

## Data Flow Diagram
```
Landing Page → Sign Up → Account Confirmation
     ↓
Additional Data → Agreements → Stripe Checkout
     ↓
Success Page → Dashboard
```

This documentation provides a comprehensive overview of the registration flow, including all components, API routes, server actions, and security considerations.


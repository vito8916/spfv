# SupaNext Starter Kit

A modern, full-featured starter kit combining Next.js 15 with Supabase for authentication and data storage. This project provides a solid foundation for building web applications with a beautiful UI, authentication flows, and user settings management.

## 🚀 Demo

[SupaNext Starter Kit](https://supanext-starter-kit.vicbox.dev)

![SupaNext Starter Kit](https://supanext-starter-kit.vicbox.dev/supanext-kit.webp)

## Features

- 🔐 **Complete Authentication System**
  - Sign up with email verification
  - Sign in with email/password
  - Social login with Google, GitHub, and Facebook
  - Password reset flow
  - Protected routes

- 🎨 **Modern UI Components**
  - Built with Tailwind CSS 4 and shadcn/ui
  - Responsive design
  - Dark/light mode support
  - Beautiful dashboard layout

- ⚙️ **User Settings**
  - Profile management
  - Password updates
  - Theme preferences

- 🛠️ **Developer Experience**
  - TypeScript for type safety
  - Form validation with Zod
  - Server actions for API calls
  - Toast notifications with Sonner

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account (free tier works fine)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vito8916/supanext-starter-kit.git
   cd supanext-starter-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=your-site-url
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com/)
2. Enable authentication providers:
   - Email/Password: Enable in Authentication → Providers → Email
   - Google: Configure in Authentication → Providers → Google
   - GitHub: Configure in Authentication → Providers → GitHub
   - Facebook: Configure in Authentication → Providers → Facebook
3. Set up email templates in Authentication → Email Templates
4. Configure site URL in Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

## Project Structure

```
supanext-starter-kit/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes (protected)
│   ├── actions.ts          # Server actions
│   └── actions/            # Grouped server actions
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── settings/           # Settings components
│   └── ui/                 # UI components (shadcn/ui)
├── lib/                    # Utility functions and libraries
│   └── validations/        # Zod validation schemas
├── public/                 # Static assets
├── utils/                  # Utility functions
│   └── supabase/           # Supabase client utilities
└── ...                     # Config files
```

## Authentication Flow

The starter kit includes a complete authentication system:

1. **Sign Up**: Users can create an account with email/password
   - Email verification is required
   - Social sign up with Google, GitHub, and Facebook
   - User metadata (name) is stored during registration

2. **Sign In**: Users can sign in with multiple methods
   - Email/password authentication
   - Social login with Google, GitHub, and Facebook
   - Error handling for invalid credentials
   - Redirect to dashboard on success

3. **Password Reset**: Complete password reset flow
   - Request password reset email
   - Set new password with validation

4. **Protected Routes**: Dashboard and settings are protected
   - Middleware redirects unauthenticated users

## User Settings

The settings page allows users to:

1. **Update Profile**: Change name, email, and bio
   - Form validation with Zod
   - Real-time feedback with toast notifications

2. **Change Password**: Securely update password
   - Current password verification
   - Strong password requirements
   - Validation for password confirmation

3. **Theme Preferences**: Toggle between light, dark, and system theme
   - Persistent theme selection
   - Immediate visual feedback

## Customization

### Styling

The project uses Tailwind CSS 4, which simplifies configuration with its new features. Tailwind CSS 4 no longer requires a separate `tailwind.config.js` file for most customizations, as it now supports configuration directly in your CSS files.

For custom styling, you can use CSS variables in your global CSS file:

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* Add your custom colors here */
  }
}
```

### UI Components

UI components are built with shadcn/ui, which provides a set of accessible, customizable components. You can add or modify components using their CLI:

```bash
npx shadcn-ui@latest add button
```

### Adding Pages

To add a new page to the dashboard:

1. Create a new file in `app/(dashboard)/(routes)/your-page/page.tsx`
2. Add the page to the navigation in `components/dashboard/nav-main.tsx`

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/):

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project in Vercel
3. Add your environment variables
4. Deploy

### Other Platforms

You can also deploy to other platforms that support Next.js:

- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ by [Victor Alvarado](https://victoralvarado.dev)

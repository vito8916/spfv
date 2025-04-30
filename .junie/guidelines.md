# SPFV SaaS - Production Deployment Guide

## Project Overview

SPFV SaaS is a financial services application built with the following technology stack:

- **Frontend**: NextJS v15, React 19, Tailwind v4, ShadCn (Radix UI components)
- **Backend**: NextJS API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment Processing**: Stripe
- **Email**: Nodemailer
- **Document Generation**: PDF-Lib (for OPRA documents)
- **Data Fetching**: SWR
- **Form Handling**: React Hook Form, Zod
- **External APIs**: SPFV API, Alpha Vantage API

The application handles user registration, OPRA questionnaires, terms and conditions acceptance, subscription management, and financial data visualization.

## Pre-Deployment Checklist

Before deploying to production, ensure the following items are validated:

### Content Verification
- [ ] **Landing Page**: Verify all information, content, images, and links
- [ ] **Terms and Conditions**: Review and approve the final content
- [ ] **Privacy Policy**: Review and approve the final content
- [ ] **Plans and Prices**: Confirm all subscription tiers and pricing are correct in both the UI and Stripe dashboard

### Technical Configuration
- [ ] **Domain Name**: Confirm the production domain name and ensure DNS records are properly configured
- [ ] **SMTP Server**: Verify email sending capabilities with the production SMTP server
- [ ] **OPRA Documents**: Test the generation of OPRA documents during the registration process
- [ ] **Supabase Project**: Create a production Supabase project and apply all migrations
- [ ] **Stripe Account**: Configure the production Stripe account with correct products and prices
- [ ] **Environment Variables**: Prepare all production environment variables
- [ ] **SSL Certificate**: Ensure SSL is properly configured for the production domain

## Deployment Options Comparison

### Vercel

**Pros:**
- Native integration with Next.js
- Automatic preview deployments for PRs
- Built-in CI/CD pipeline
- Edge network for global performance
- Serverless functions support
- Easy environment variable management
- Free SSL certificates
- Simple rollbacks

**Cons:**
- Higher cost for high-traffic applications
- Limited customization compared to self-hosted solutions

**Best for:** Teams that want the simplest deployment experience with minimal DevOps overhead.

### Amazon Amplify

**Pros:**
- Seamless integration with AWS services
- Built-in CI/CD pipeline
- Preview environments
- Easy environment variable management
- Free SSL certificates
- Authentication and storage services

**Cons:**
- Learning curve for AWS-specific configurations
- Potentially higher costs for high-traffic applications
- Less optimized for Next.js compared to Vercel

**Best for:** Teams already using AWS ecosystem who want to leverage other AWS services.

### AWS EC2 with Coolify

**Pros:**
- Complete control over the infrastructure
- Potentially lower costs for high-traffic applications
- Ability to customize server configurations
- No vendor lock-in
- Can host multiple applications on the same server

**Cons:**
- Requires more DevOps knowledge
- Manual setup for CI/CD pipelines
- More maintenance overhead
- Manual SSL certificate management

**Best for:** Teams that need maximum control over their infrastructure or have specific compliance requirements.

## Recommended Deployment Option

Based on the project's requirements, **Vercel** is recommended for the following reasons:
1. Native Next.js support ensures optimal performance
2. Simplified deployment process reduces DevOps overhead
3. Automatic preview deployments facilitate testing
4. Seamless integration with environment variables
5. Edge network provides global performance benefits

## Deployment Instructions

### Vercel Deployment

1. **Prepare your project**:
   ```bash
   # Install dependencies
   npm install

   # Build the project locally to ensure it compiles
   npm run build
   ```

2. **Create a Vercel account** (if you don't have one already) at [vercel.com](https://vercel.com).

3. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

4. **Login to Vercel**:
   ```bash
   vercel login
   ```

5. **Deploy to Vercel**:
   ```bash
   vercel
   ```

6. **Configure environment variables** in the Vercel dashboard:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_SITE_URL (set to your production domain)
   - NEXT_PUBLIC_API_URL (set to your production domain)
   - STRIPE_PUBLISHABLE_KEY (production key)
   - STRIPE_SECRET_KEY (production key)
   - STRIPE_WEBHOOK_SECRET (production webhook secret)
   - SPFV_API_URL
   - ALPHA_VANTAGE_API_KEY
   - EMAIL_USER
   - EMAIL_PASSWORD
   - EMAIL_RECIPIENT

7. **Set up a custom domain** in the Vercel dashboard and configure DNS records.

8. **Enable automatic deployments** by connecting your GitHub repository.

### Supabase Configuration

1. **Create a production Supabase project** at [supabase.com](https://supabase.com).

2. **Apply migrations**:
   ```bash
   # Link to your production Supabase project
   npx supabase link --project-ref your-project-ref

   # Apply migrations
   npx supabase db push
   ```

3. **Configure storage buckets** for legal documents as defined in the migrations.

4. **Set up Row Level Security (RLS)** policies to ensure data security.

5. **Create service accounts** with appropriate permissions.

6. **Enable email authentication** in the Auth settings.

### Stripe Configuration

1. **Create a production Stripe account** (if you don't have one already) at [stripe.com](https://stripe.com).

2. **Create products and prices** that match your application's subscription plans.

3. **Configure webhook endpoints** to point to your production domain:
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

4. **Test the payment flow** in Stripe test mode before going live.

5. **Switch to live mode** once testing is complete.

## Post-Deployment Verification

After deploying to production, perform the following checks:

1. **Functionality Testing**:
   - Complete user registration flow
   - Verify OPRA document generation
   - Test subscription purchase and management
   - Check email notifications
   - Verify data visualization components

2. **Performance Testing**:
   - Check page load times
   - Verify API response times
   - Test under expected load conditions

3. **Security Testing**:
   - Verify SSL configuration
   - Test authentication flows
   - Check authorization rules
   - Verify Supabase RLS policies

4. **Cross-Browser Testing**:
   - Test on Chrome, Firefox, Safari, and Edge
   - Verify mobile responsiveness

## Maintenance and Monitoring

### Monitoring

1. **Set up application monitoring** using Vercel Analytics or a third-party service like Sentry.

2. **Configure error tracking** to receive notifications for application errors.

3. **Set up performance monitoring** to track page load times and API response times.

4. **Monitor database performance** using Supabase dashboard.

5. **Set up uptime monitoring** using a service like UptimeRobot or Pingdom.

### Regular Maintenance

1. **Update dependencies** regularly to address security vulnerabilities.

2. **Perform database backups** regularly (Supabase provides automatic backups).

3. **Review and rotate API keys** periodically.

4. **Monitor Stripe webhook events** for payment issues.

5. **Review application logs** for errors and unusual activity.

## Scaling Considerations

As your application grows, consider the following scaling strategies:

1. **Database Scaling**:
   - Upgrade your Supabase plan as needed
   - Optimize database queries
   - Implement caching for frequently accessed data

2. **Application Scaling**:
   - Implement edge caching for static content
   - Use Incremental Static Regeneration (ISR) for semi-dynamic content
   - Consider implementing a CDN for media assets

3. **Infrastructure Scaling**:
   - Upgrade your Vercel plan as needed
   - Consider multi-region deployments for global audiences

## Disaster Recovery

1. **Database Backups**:
   - Ensure Supabase backups are properly configured
   - Periodically test database restoration

2. **Code Backups**:
   - Maintain a backup repository
   - Document deployment procedures

3. **Documentation**:
   - Maintain up-to-date documentation of the infrastructure
   - Document recovery procedures

## Conclusion

This deployment guide provides a comprehensive overview of deploying the SPFV SaaS application to production. By following these instructions, you can ensure a smooth deployment process and maintain a reliable production environment.

For any questions or issues, please contact the development team.

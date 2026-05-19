# PixTide

PixTide is a digital asset marketplace built with Next.js. Users can upload assets, admins can review them, and buyers can purchase approved assets, download them, and access invoices.

## Features

- Google sign-in with Better Auth
- Asset uploads with Cloudinary
- Admin approval workflow
- Public gallery with category filtering
- PayPal checkout for asset purchases
- Purchase history, protected downloads, and invoices

## Stack

- Next.js 15
- Tailwind CSS 4
- Drizzle ORM + PostgreSQL
- Better Auth
- Cloudinary
- PayPal

## Environment Variables

Create a `.env` file:

```bash
APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

Note: the app expects `DATABASE_URL`, but `.env.example` currently says `DATABASES_URL`.

## Setup

```bash
npm install
npm run dev
```

Before starting the app, make sure:

- PostgreSQL is running and the schema from [`drizzle/0000_lush_machine_man.sql`](/home/bilalnsmuhammed/my_projects/pixtide/drizzle/0000_lush_machine_man.sql:1) is applied
- Google OAuth credentials are configured
- Cloudinary credentials are set
- PayPal sandbox credentials are set

## Main Routes

- `/` landing page
- `/login` sign in
- `/gallery` public assets
- `/gallery/[id]` asset details and purchase
- `/dashboard/assets` user uploads
- `/dashboard/purchases` purchases and invoices
- `/admin/settings` category management
- `/admin/assets-approval` asset moderation



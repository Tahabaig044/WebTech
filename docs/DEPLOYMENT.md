# Pixelwyre Digital — Deployment Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Select or create one
   - **Project name**: `pixelwyre-production`
   - **Database password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Asia Pacific` for Pakistan)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be ready

## Step 2: Get Your Credentials

1. In your project dashboard, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xyzcompany.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (click "Reveal" first, then copy)

## Step 3: Update .env.local

Open `.env.local` and replace the placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/schema.sql` from the project folder
4. Copy the entire content and paste into SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Verify: Go to **Table Editor** — you should see 5 tables:
   - `blog_posts`
   - `services`
   - `case_studies`
   - `contact_submissions`
   - `leads`

## Step 5: Seed Your Data

1. In SQL Editor, click **"New query"** again
2. Open `supabase/seed.sql` from the project folder
3. Copy the entire content and paste into SQL Editor
4. Click **"Run"**
5. Verify: Go to **Table Editor** → `services` — you should see 32 services

## Step 6: Test Locally

```bash
cd pixelwyre
npm run dev
```

Open http://localhost:3000 and verify:
- [ ] Home page loads
- [ ] Blog page shows 3 posts from Supabase
- [ ] Services page shows 32 services from Supabase
- [ ] Case Studies page shows 5 case studies from Supabase
- [ ] Contact form submits successfully
- [ ] Admin Dashboard shows leads from Supabase
- [ ] Admin Leads kanban loads and drag-drop works

## Step 7: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

## Troubleshooting

### "Invalid API key" error
- Check that `.env.local` has correct keys (no extra spaces or quotes)
- Restart dev server after changing `.env.local`

### Tables not found
- Make sure you ran `schema.sql` first, then `seed.sql`
- Check SQL Editor for any error messages

### Contact form not working
- Check browser console for errors
- Verify `contact_submissions` table exists in Supabase

### Admin shows no leads
- Leads appear when users submit the contact form
- Or manually insert test data via SQL Editor

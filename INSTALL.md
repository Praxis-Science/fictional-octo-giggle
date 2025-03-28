# Research Collaboration Platform - Installation Guide

This guide will walk you through setting up the Research Collaboration Platform from scratch.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or later)
- [npm](https://www.npmjs.com/) (v8.x or later)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account (for database and authentication)
- A [Discord Developer](https://discord.com/developers/applications) account (for authentication)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/research-collaboration-platform.git
cd research-collaboration-platform
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Supabase

1. Create a new project in [Supabase](https://app.supabase.com/)
2. In the Supabase dashboard, go to Project Settings → API to get your API URLs and keys
3. Create the following tables:

### Users Table
```sql
create table users (
  id uuid primary key default uuid_generate_v4(),
  discord_id text unique not null,
  username text not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Research Calls Table
```sql
create table research_calls (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text not null,
  keywords text[] not null,
  credit_roles text[] not null,
  lead_author_id uuid references users(id) not null,
  slug text unique not null,
  status text not null check (status in ('open', 'closed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  publication_url text
);
```

### Co-Author Applications Table
```sql
create table co_author_applications (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid references research_calls(id) not null,
  user_id uuid references users(id) not null,
  roles text[] not null,
  motivation text not null,
  orcid_id text,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(call_id, user_id)
);
```

## Step 4: Set Up Discord OAuth

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 → General
4. Add a redirect URL (e.g., `http://localhost:3000/api/discord/callback` for development)
5. Save changes and copy the Client ID and Client Secret

## Step 5: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/discord/callback

# Optional: Discord Bot for Announcements
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_announcement_channel_id

# Application URL (for links in emails, etc.)
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: Email Configuration (for production)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_USER=your_email_user
# EMAIL_PASSWORD=your_email_password
# EMAIL_FROM=noreply@example.com
```

## Step 6: Run the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Step 7: Build for Production

When you're ready to deploy:

```bash
npm run build
```

This will create an optimized production build.

## Deployment Options

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com/)
3. Configure the environment variables in the Vercel dashboard
4. Deploy

### Other Options

The application can be deployed on any platform that supports Next.js applications, such as:

- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

## Troubleshooting

### Discord Authentication Issues

- Ensure your redirect URI exactly matches what's configured in the Discord Developer Portal
- Check that the CLIENT_ID and CLIENT_SECRET are correctly set in your environment variables

### Database Connection Issues

- Verify your Supabase credentials and URL
- Ensure all tables are created with the correct schema

### "Module Not Found" Errors

If you encounter a "Cannot find module" error:

```
npm install --force
```

This will reinstall all dependencies, which may resolve module resolution issues.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Discord API Documentation](https://discord.com/developers/docs) 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client with service role key
// Note: In production, you would use a more secure approach
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function GET(request: Request) {
  // Get the authorization code from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // Validate required parameters
  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }
  
  // Verify environment variables
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
    return NextResponse.json({ error: 'Discord OAuth configuration is missing' }, { status: 500 });
  }
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Discord token exchange error:', errorData);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const { access_token, token_type } = tokenData;

    // Use the token to get the user's Discord information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error('Discord user info error:', errorData);
      return NextResponse.json({ error: 'Failed to get Discord user info' }, { status: 500 });
    }

    const userData = await userResponse.json();

    // Destructure the user data
    const { id: discordId, username, email, avatar, discriminator } = userData;

    // Store user data in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        discord_id: discordId,
        username,
        email,
        avatar_url: avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving user:', error);
      return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
    }

    // Set a cookie with the user ID or create a session
    // For simplicity, we'll just redirect to the dashboard with the user ID as a query param
    // In production, use a more secure method like JWT tokens or server-side sessions
    return NextResponse.redirect(new URL(`/dashboard?userId=${user.id}`, request.url));
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
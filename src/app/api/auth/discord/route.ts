import { NextResponse } from 'next/server';

// Constants for Discord OAuth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

// Scopes needed from Discord
const scopes = ['identify', 'email'];

export async function GET() {
  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Discord OAuth configuration is missing' },
      { status: 500 }
    );
  }

  // Construct Discord OAuth URL
  const discordOAuthURL = new URL('https://discord.com/api/oauth2/authorize');
  discordOAuthURL.searchParams.append('client_id', DISCORD_CLIENT_ID);
  discordOAuthURL.searchParams.append('redirect_uri', DISCORD_REDIRECT_URI);
  discordOAuthURL.searchParams.append('response_type', 'code');
  discordOAuthURL.searchParams.append('scope', scopes.join(' '));

  // Add a state parameter for security (should be stored in session/cookie in production)
  const state = crypto.randomUUID();
  discordOAuthURL.searchParams.append('state', state);

  // Redirect to Discord OAuth page
  return NextResponse.redirect(discordOAuthURL);
} 
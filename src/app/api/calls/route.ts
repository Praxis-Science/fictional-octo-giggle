import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// Initialize Supabase client with service role key
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('-', Math.floor(Math.random() * 1000).toString());
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, summary, keywords, credit_roles, lead_author_id } = body;
    
    if (!title || !summary || !keywords || !credit_roles || !lead_author_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a slug for the call
    const slug = generateSlug(title);

    // Insert the call into the database
    const { data, error } = await supabase
      .from('research_calls')
      .insert({
        title,
        summary,
        keywords,
        credit_roles,
        lead_author_id,
        slug,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating research call:', error);
      return NextResponse.json({ error: 'Failed to create research call' }, { status: 500 });
    }

    // Post to Discord if configured
    if (DISCORD_BOT_TOKEN && DISCORD_CHANNEL_ID) {
      try {
        await postToDiscord(data);
      } catch (discordError) {
        console.error('Error posting to Discord:', discordError);
        // We'll still return success but log the error
      }
    }

    return NextResponse.json({
      message: 'Research call created successfully',
      data
    });
  } catch (error) {
    console.error('Error in POST /api/calls:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const authorId = url.searchParams.get('authorId');
    const status = url.searchParams.get('status');
    
    let query = supabase.from('research_calls').select('*');

    // Apply filters if provided
    if (authorId) {
      query = query.eq('lead_author_id', authorId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    // Get the calls
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching research calls:', error);
      return NextResponse.json({ error: 'Failed to fetch research calls' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/calls:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to post to Discord
async function postToDiscord(call: any) {
  const { title, summary, slug } = call;
  const callUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/calls/${slug}`;
  
  const message = {
    content: '**New Research Collaboration Opportunity**',
    embeds: [
      {
        title,
        description: summary.length > 400 ? summary.substring(0, 397) + '...' : summary,
        url: callUrl,
        color: 3447003, // Blue color
        footer: {
          text: 'Click the title to apply as a co-author'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
} 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/services/emailService';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client with service role key
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { call_id, user_id, roles, motivation, orcid_id } = body;
    
    if (!call_id || !user_id || !roles || !roles.length || !motivation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the research call exists and is open
    const { data: call, error: callError } = await supabase
      .from('research_calls')
      .select('*, users:lead_author_id(id, username, email)')
      .eq('id', call_id)
      .eq('status', 'open')
      .single();

    if (callError || !call) {
      return NextResponse.json({ 
        error: 'Research call not found or closed' 
      }, { status: 404 });
    }

    // Check if the user has already applied for this call
    const { data: existingApplication, error: checkError } = await supabase
      .from('co_author_applications')
      .select('id')
      .eq('call_id', call_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingApplication) {
      return NextResponse.json({ 
        error: 'You have already applied for this research call' 
      }, { status: 400 });
    }

    // Get applicant details for the email
    const { data: applicant, error: applicantError } = await supabase
      .from('users')
      .select('username, email')
      .eq('id', user_id)
      .single();

    if (applicantError) {
      console.error('Error getting applicant details:', applicantError);
      // Continue anyway as we can still create the application
    }

    // Insert the application
    const { data, error } = await supabase
      .from('co_author_applications')
      .insert({
        call_id,
        user_id,
        roles,
        motivation,
        orcid_id: orcid_id || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    // Send email notification to the lead author
    try {
      if (call.users && call.users.email && applicant) {
        await sendEmail({
          to: call.users.email,
          subject: `New Co-Author Application for "${call.title}"`,
          html: `
            <h1>New Co-Author Application</h1>
            <p>You have received a new application for your research call "${call.title}".</p>
            <p><strong>Applicant:</strong> ${applicant.username}</p>
            <p><strong>Email:</strong> ${applicant.email}</p>
            <p><strong>Roles Applied For:</strong> ${roles.join(', ')}</p>
            <p><strong>Motivation:</strong></p>
            <p>${motivation}</p>
            <p>Log in to your dashboard to review and respond to this application.</p>
          `
        });
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue anyway as the application was created successfully
    }

    return NextResponse.json({
      message: 'Application submitted successfully',
      data
    });
  } catch (error) {
    console.error('Error in POST /api/applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const callId = url.searchParams.get('callId');
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    
    if (!callId && !userId) {
      return NextResponse.json({ error: 'Either callId or userId is required' }, { status: 400 });
    }

    let query = supabase
      .from('co_author_applications')
      .select('*, users:user_id(id, username, email, avatar_url)');

    // Apply filters
    if (callId) {
      query = query.eq('call_id', callId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    // Get applications
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update application status
export async function PATCH(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database configuration is missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Update application status
    const { data, error } = await supabase
      .from('co_author_applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, research_calls:call_id(title), users:user_id(username, email)')
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
    }

    // Send email notification to the applicant
    try {
      if (data.users && data.users.email && data.research_calls) {
        const subject = status === 'accepted'
          ? `Your Application for "${data.research_calls.title}" Has Been Accepted`
          : `Update on Your Application for "${data.research_calls.title}"`;
        
        const html = status === 'accepted'
          ? `
            <h1>Application Accepted</h1>
            <p>Congratulations! Your application to be a co-author for the research call "${data.research_calls.title}" has been accepted.</p>
            <p>The lead author will be in touch soon with next steps.</p>
          `
          : `
            <h1>Application Status Update</h1>
            <p>Thank you for your interest in the research call "${data.research_calls.title}".</p>
            <p>After careful consideration, the lead author has decided to proceed with other candidates whose skills better match the current needs of the project.</p>
            <p>We appreciate your interest and encourage you to apply for future research calls.</p>
          `;
        
        await sendEmail({
          to: data.users.email,
          subject,
          html
        });
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue anyway as the status was updated successfully
    }

    return NextResponse.json({
      message: `Application status updated to ${status}`,
      data
    });
  } catch (error) {
    console.error('Error in PATCH /api/applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
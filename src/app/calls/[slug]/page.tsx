'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { creditRoles } from '@/data/creditTaxonomy';
import { api, ResearchCall } from '@/services/api';
import CoAuthorApplicationForm from '@/components/CoAuthorApplication';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApplyCoAuthorForm } from '@/components/ApplyCoAuthorForm';
import { ResearchCallView } from '@/components/ResearchCallView';
import { CreditRoleData } from '@/lib/credit-roles';
import { CreditRole } from '@/types/credit';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ResearchCallPage({ params }: PageProps) {
  const { slug } = params;
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const currentUser = session?.user;

  // Fetch the research call by slug
  const { data: call, error } = await supabase
    .from('research_calls')
    .select('*, users:lead_author_id(id, username, email, avatar_url)')
    .eq('slug', slug)
    .single();

  if (error || !call) {
    console.error('Error fetching research call:', error);
    notFound();
  }

  // Check if the current user is the lead author
  const isLeadAuthor = currentUser?.id === call.lead_author_id;

  // Check if the user has already applied
  let hasApplied = false;
  if (currentUser) {
    const { data: existingApplication } = await supabase
      .from('co_author_applications')
      .select('id')
      .eq('call_id', call.id)
      .eq('user_id', currentUser.id)
      .maybeSingle();
    
    hasApplied = !!existingApplication;
  }

  // Get available roles (either from required_roles or all CRediT roles)
  let availableRoles: CreditRole[] = [];
  
  if (call.required_roles && call.required_roles.length > 0) {
    availableRoles = CreditRoleData.filter(role => call.required_roles?.includes(role.id));
  } else {
    availableRoles = CreditRoleData;
  }

  return (
    <div className="container py-8 space-y-8">
      <ResearchCallView researchCall={call} />
      
      {currentUser && !isLeadAuthor && call.status === 'open' && (
        <div className="mt-10">
          {hasApplied ? (
            <div className="bg-muted p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Application Submitted</h3>
              <p>You have already applied to this research call. You can check your application status in your dashboard.</p>
            </div>
          ) : (
            <ApplyCoAuthorForm 
              researchCall={call} 
              userId={currentUser.id} 
              availableRoles={availableRoles} 
            />
          )}
        </div>
      )}
      
      {currentUser && isLeadAuthor && (
        <div className="bg-muted p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">You are the Lead Author</h3>
          <p>You can manage applications for this research call from your dashboard.</p>
        </div>
      )}

      {!currentUser && (
        <div className="bg-muted p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Sign in to Apply</h3>
          <p>Please sign in to apply as a co-author for this research call.</p>
        </div>
      )}
    </div>
  );
} 
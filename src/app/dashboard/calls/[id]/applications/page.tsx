import { notFound, redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApplicationsManagement } from '@/components/ApplicationsManagement';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ManageApplicationsPage({ params }: PageProps) {
  const { id } = params;
  const supabase = createServerComponentClient({ cookies });

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch the research call
  const { data: call, error } = await supabase
    .from('research_calls')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !call) {
    console.error('Error fetching research call:', error);
    notFound();
  }

  // Check if the current user is the lead author
  if (session.user.id !== call.lead_author_id) {
    redirect('/dashboard');
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">
        Manage Applications for "{call.title}"
      </h1>
      <ApplicationsManagement callId={id} />
    </div>
  );
} 
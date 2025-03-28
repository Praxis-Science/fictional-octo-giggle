import { api, ResearchCall } from '@/services/api';
import CoAuthorApplicationForm from '@/components/CoAuthorApplication';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApplyCoAuthorForm } from '@/components/ApplyCoAuthorForm';
import { ResearchCallView } from '@/components/ResearchCallView';
import { CreditRoleData } from '@/lib/credit-roles';

export default async function ResearchCallPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const { data: call } = await api.calls.getBySlug(params.slug);
  const creditRoles = CreditRoleData;

  // Get available roles based on the research call's required roles
  const availableRoles = call.required_roles 
    ? CreditRoleData.filter(role => call.required_roles.includes(role.id))
    : CreditRoleData;

  return (
    <div className="container mx-auto px-4 py-8">
      <ResearchCallView researchCall={call} />
      {userId && (
        <ApplyCoAuthorForm 
          researchCall={call} 
          userId={userId} 
          availableRoles={availableRoles}
        />
      )}
    </div>
  );
} 
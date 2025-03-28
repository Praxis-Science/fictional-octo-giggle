'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditRoleData } from '@/lib/credit-roles';
import { formatDistanceToNow } from 'date-fns';

interface MyApplicationsProps {
  userId: string;
}

interface Application {
  id: string;
  call_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  roles: string[];
  created_at: string;
  research_calls: {
    id: string;
    title: string;
    slug: string;
    lead_author_id: string;
    status: string;
  }
}

export function MyApplications({ userId }: MyApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/applications?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getRoleName = (roleId: string) => {
    const role = CreditRoleData.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You haven&apos;t applied to any research calls yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Applications</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Link href={`/calls/${application.research_calls.slug}`} className="hover:underline">
                  <CardTitle className="text-lg">
                    {application.research_calls.title}
                  </CardTitle>
                </Link>
                <Badge className={`${getStatusColor(application.status)} text-white`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium mb-1">Roles applied for:</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {application.roles.map(roleId => (
                    <Badge key={roleId} variant="outline">
                      {getRoleName(roleId)}
                    </Badge>
                  ))}
                </div>
                
                {application.status === 'accepted' && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-green-800 dark:text-green-300">
                    <p>Your application has been accepted. The lead author will contact you soon.</p>
                  </div>
                )}
                
                {application.status === 'rejected' && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300">
                    <p>Your application was not selected for this research call.</p>
                  </div>
                )}
                
                {application.status === 'pending' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-yellow-800 dark:text-yellow-300">
                    <p>Your application is being reviewed by the lead author.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
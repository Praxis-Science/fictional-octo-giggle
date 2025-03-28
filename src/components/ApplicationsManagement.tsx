'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditRoleData } from '@/lib/credit-roles';
import { toast } from '@/components/ui/use-toast';

interface Application {
  id: string;
  call_id: string;
  user_id: string;
  roles: string[];
  motivation: string;
  status: 'pending' | 'accepted' | 'rejected';
  orcid_id?: string;
  created_at: string;
  users: {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
  }
}

interface ApplicationsManagementProps {
  callId: string;
}

export function ApplicationsManagement({ callId }: ApplicationsManagementProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, [callId]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications?callId=${callId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: applicationId,
          status,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast({
        title: 'Success',
        description: `Application ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    }
  };

  const getRoleName = (roleId: string) => {
    const role = CreditRoleData.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  const filteredApplications = applications.filter(app => app.status === activeTab);

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No applications have been submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Co-Author Applications</CardTitle>
        <CardDescription>Manage applications for this research call</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {applications.filter(app => app.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted
              <Badge variant="secondary" className="ml-2">
                {applications.filter(app => app.status === 'accepted').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {applications.filter(app => app.status === 'rejected').length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No {activeTab} applications.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={application.users.avatar_url || ''} alt={application.users.username} />
                            <AvatarFallback>{application.users.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{application.users.username}</CardTitle>
                            <CardDescription>{application.users.email}</CardDescription>
                          </div>
                        </div>
                        <div>
                          {application.orcid_id && (
                            <a 
                              href={`https://orcid.org/${application.orcid_id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center"
                            >
                              ORCID: {application.orcid_id}
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Applied for roles:</h4>
                        <div className="flex flex-wrap gap-1">
                          {application.roles.map((roleId) => (
                            <Badge key={roleId} variant="outline">
                              {getRoleName(roleId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Motivation:</h4>
                        <p className="text-sm whitespace-pre-line">{application.motivation}</p>
                      </div>
                    </CardContent>
                    {application.status === 'pending' && (
                      <CardFooter className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => updateApplicationStatus(application.id, 'accepted')}
                        >
                          Accept
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
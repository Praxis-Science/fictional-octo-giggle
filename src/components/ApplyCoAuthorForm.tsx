'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { CreditRole } from '@/types/credit';
import { ResearchCall } from '@/types/research-call';

interface ApplyCoAuthorFormProps {
  researchCall: ResearchCall;
  userId: string;
  availableRoles: CreditRole[];
}

export function ApplyCoAuthorForm({ researchCall, userId, availableRoles }: ApplyCoAuthorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [motivation, setMotivation] = useState('');
  const [orcidId, setOrcidId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRoles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one role',
        variant: 'destructive',
      });
      return;
    }

    if (!motivation.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide your motivation',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_id: researchCall.id,
          user_id: userId,
          roles: selectedRoles,
          motivation,
          orcid_id: orcidId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully',
      });
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit application',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Apply as Co-Author</CardTitle>
        <CardDescription>
          Apply to collaborate on &quot;{researchCall.title}&quot;
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="font-medium">Select the roles you wish to contribute to:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => handleRoleToggle(role.id)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`role-${role.id}`} className="font-medium">
                      {role.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivation" className="font-medium">
              Explain your motivation and how you can contribute
            </Label>
            <Textarea
              id="motivation"
              placeholder="Describe your relevant experience, skills, and why you'd like to join this research"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={5}
              required
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orcid" className="font-medium">
              ORCID ID (optional)
            </Label>
            <Input
              id="orcid"
              placeholder="e.g. 0000-0000-0000-0000"
              value={orcidId}
              onChange={(e) => setOrcidId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Providing your ORCID ID helps establish your academic identity
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResearchCall } from '@/types/research-call';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface ResearchCallViewProps {
  researchCall: ResearchCall & {
    users: {
      id: string;
      username: string;
      email: string;
      avatar_url?: string;
    }
  };
}

export function ResearchCallView({ researchCall }: ResearchCallViewProps) {
  const statusColor = {
    draft: 'bg-gray-500',
    open: 'bg-green-500',
    closed: 'bg-red-500',
    completed: 'bg-blue-500',
  }[researchCall.status];

  const formattedDate = formatDistanceToNow(new Date(researchCall.created_at), { addSuffix: true });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">{researchCall.title}</CardTitle>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={researchCall.users.avatar_url || ''} alt={researchCall.users.username} />
                  <AvatarFallback>{researchCall.users.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{researchCall.users.username}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              <div>
                <Badge variant="outline" className={`${statusColor} text-white`}>
                  {researchCall.status.charAt(0).toUpperCase() + researchCall.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <h3 className="text-lg font-medium mt-4 mb-2">Description</h3>
          <div className="whitespace-pre-line">{researchCall.description}</div>
          
          {researchCall.abstract && (
            <>
              <h3 className="text-lg font-medium mt-6 mb-2">Abstract</h3>
              <div className="whitespace-pre-line">{researchCall.abstract}</div>
            </>
          )}
          
          {researchCall.timeline && (
            <>
              <h3 className="text-lg font-medium mt-6 mb-2">Timeline</h3>
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div className="whitespace-pre-line">{researchCall.timeline}</div>
              </div>
            </>
          )}
          
          {researchCall.tags && researchCall.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {researchCall.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
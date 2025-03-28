/**
 * Represents a research call in the system
 */
export interface ResearchCall {
  id: string;
  title: string;
  description: string;
  lead_author_id: string;
  slug: string;
  status: 'draft' | 'open' | 'closed' | 'completed';
  abstract?: string;
  required_roles?: string[];
  timeline?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
} 
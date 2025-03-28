import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client (client-side)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Interface for research call data
export interface ResearchCall {
  id?: string;
  title: string;
  summary: string;
  keywords: string[];
  credit_roles: string[];
  lead_author_id: string;
  slug: string;
  status: 'open' | 'closed';
  created_at?: string;
  updated_at?: string;
  publication_url?: string;
}

// Interface for co-author application
export interface CoAuthorApplication {
  id?: string;
  call_id: string;
  user_id: string;
  roles: string[];
  motivation: string;
  orcid_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

// API service
export const api = {
  // Research Calls
  calls: {
    // Create a new research call
    async create(callData: Omit<ResearchCall, 'id' | 'created_at' | 'updated_at' | 'slug' | 'status'>) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('research_calls')
        .insert({
          ...callData,
          status: 'open',
          slug: generateSlug(callData.title)
        })
        .select()
        .single();
    },
    
    // Get a research call by its slug
    async getBySlug(slug: string) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('research_calls')
        .select('*, users:lead_author_id(id, username, avatar_url)')
        .eq('slug', slug)
        .single();
    },
    
    // Get research calls by lead author ID
    async getByAuthor(authorId: string) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('research_calls')
        .select('*')
        .eq('lead_author_id', authorId)
        .order('created_at', { ascending: false });
    },
    
    // Update a research call
    async update(id: string, callData: Partial<ResearchCall>) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('research_calls')
        .update({
          ...callData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    },
    
    // Close a research call
    async close(id: string, publicationUrl?: string) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('research_calls')
        .update({
          status: 'closed',
          publication_url: publicationUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    }
  },
  
  // Co-author Applications
  applications: {
    // Submit a new application
    async submit(applicationData: Omit<CoAuthorApplication, 'id' | 'created_at' | 'updated_at' | 'status'>) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('co_author_applications')
        .insert({
          ...applicationData,
          status: 'pending'
        })
        .select()
        .single();
    },
    
    // Get applications for a research call
    async getByCallId(callId: string) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('co_author_applications')
        .select('*, users:user_id(id, username, email, avatar_url)')
        .eq('call_id', callId)
        .order('created_at', { ascending: false });
    },
    
    // Update application status
    async updateStatus(id: string, status: 'accepted' | 'rejected') {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('co_author_applications')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    }
  },
  
  // Users
  users: {
    // Get user by ID
    async getById(id: string) {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    }
  }
};

// Utility function to generate a URL slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('-', Math.floor(Math.random() * 1000).toString());
} 
/**
 * Represents a role in the CRediT (Contributor Roles Taxonomy) system
 */
export interface CreditRole {
  id: string;
  name: string;
  description: string;
  category?: 'conceptualization' | 'execution' | 'writing' | 'support';
} 
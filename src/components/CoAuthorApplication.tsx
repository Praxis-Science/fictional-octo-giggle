'use client';

import { useState, FormEvent } from 'react';
import { creditRoles, CreditRole } from '@/data/creditTaxonomy';
import { api, CoAuthorApplication } from '@/services/api';

interface CoAuthorApplicationProps {
  callId: string;
  userId: string;
  selectedRoles?: string[];
  onSuccess?: (application: CoAuthorApplication) => void;
  onError?: (error: Error) => void;
}

export default function CoAuthorApplicationForm({
  callId,
  userId,
  selectedRoles = [],
  onSuccess,
  onError
}: CoAuthorApplicationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<string[]>(selectedRoles);
  const [motivation, setMotivation] = useState('');
  const [orcidId, setOrcidId] = useState('');

  const handleRoleToggle = (roleId: string) => {
    setRoles((prev) => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!motivation || roles.length === 0) {
      alert('Please provide your motivation and select at least one role.');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        call_id: callId,
        user_id: userId,
        roles,
        motivation,
        orcid_id: orcidId || undefined
      };

      const { data, error } = await api.applications.submit(applicationData);

      if (error) {
        throw new Error(error.message);
      }

      // Reset form
      setRoles([]);
      setMotivation('');
      setOrcidId('');

      // Callback
      onSuccess?.(data);
    } catch (error) {
      console.error('Error submitting application:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to submit application'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Apply as Co-Author</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Roles You Can Contribute To *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
            {creditRoles.map((role: CreditRole) => (
              <div key={role.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`apply-role-${role.id}`}
                    type="checkbox"
                    checked={roles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`apply-role-${role.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                    {role.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          {roles.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please select at least one role</p>
          )}
        </div>

        <div>
          <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Motivation *
          </label>
          <textarea
            id="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Explain why you want to contribute and what expertise you bring to this research"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="orcid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ORCID ID (Optional)
          </label>
          <input
            id="orcid"
            type="text"
            value={orcidId}
            onChange={(e) => setOrcidId(e.target.value)}
            placeholder="e.g., 0000-0002-1825-0097"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your ORCID identifier (https://orcid.org/)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
} 
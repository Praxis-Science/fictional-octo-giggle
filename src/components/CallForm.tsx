'use client';

import { useState, FormEvent } from 'react';
import { creditRoles, CreditRole } from '@/data/creditTaxonomy';
import { api, ResearchCall } from '@/services/api';

interface CallFormProps {
  userId: string;
  onSuccess?: (call: ResearchCall) => void;
  onError?: (error: Error) => void;
}

export default function CallForm({ userId, onSuccess, onError }: CallFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title || !summary || !keywords || selectedRoles.length === 0) {
      alert('Please fill all required fields and select at least one role.');
      return;
    }

    setIsSubmitting(true);

    try {
      const callData = {
        title,
        summary,
        keywords: keywords.split(',').map(kw => kw.trim()).filter(Boolean),
        credit_roles: selectedRoles,
        lead_author_id: userId,
      };

      const { data, error } = await api.calls.create(callData);

      if (error) {
        throw new Error(error.message);
      }

      // Reset form
      setTitle('');
      setSummary('');
      setKeywords('');
      setSelectedRoles([]);

      // Callback
      onSuccess?.(data);
    } catch (error) {
      console.error('Error creating research call:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to create research call'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Research Call</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for your research call"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Summary *
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Provide a summary of your research goals, methods, and expected outcomes"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Keywords *
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords separated by commas (e.g., machine learning, neural networks, NLP)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate keywords with commas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Roles Needed (CRediT Taxonomy) *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-2">
            {creditRoles.map((role: CreditRole) => (
              <div key={role.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`role-${role.id}`}
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`role-${role.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                    {role.name}
                  </label>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please select at least one role</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Research Call'}
        </button>
      </form>
    </div>
  );
} 
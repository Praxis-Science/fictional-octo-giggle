'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CallForm from '@/components/CallForm';
import { api, ResearchCall } from '@/services/api';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [userCalls, setUserCalls] = useState<ResearchCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Redirect to login if no userId
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    const fetchUserCalls = async () => {
      try {
        const { data, error } = await api.calls.getByAuthor(userId);
        
        if (error) {
          throw new Error(error.message);
        }
        
        setUserCalls(data || []);
      } catch (err) {
        console.error('Error fetching user calls:', err);
        setError('Failed to load your research calls. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCalls();
  }, [userId]);

  const handleCallCreated = (newCall: ResearchCall) => {
    setUserCalls(prevCalls => [newCall, ...prevCalls]);
    setShowCreateForm(false);
  };

  const handleCloseCall = async (callId: string) => {
    const confirmClose = window.confirm(
      'Are you sure you want to close this research call? This will invalidate the unique URL.'
    );

    if (!confirmClose) return;

    try {
      const { data, error } = await api.calls.close(callId);
      
      if (error) {
        throw new Error(error.message);
      }

      // Update the call in the list
      setUserCalls(prevCalls => 
        prevCalls.map(call => 
          call.id === callId ? { ...call, status: 'closed' } : call
        )
      );
    } catch (err) {
      console.error('Error closing call:', err);
      alert('Failed to close the research call. Please try again.');
    }
  };

  // If no userId, don't render the dashboard
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Author Dashboard</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create New Call'}
            </button>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your research calls and track co-author applications
          </p>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CallForm userId={userId} onSuccess={handleCallCreated} onError={err => setError(err.message)} />
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Research Calls</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading your research calls...</div>
          ) : userCalls.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              You haven't created any research calls yet.
              <div className="mt-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create your first research call
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {userCalls.map((call) => (
                    <tr key={call.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {call.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'open'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(call.created_at!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/calls/${call.slug}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          View
                        </Link>
                        {call.status === 'open' && (
                          <>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <Link
                              href={`/calls/${call.slug}/edit`}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                            >
                              Edit
                            </Link>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <button
                              onClick={() => handleCloseCall(call.id!)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Close
                            </button>
                          </>
                        )}
                        {call.status === 'closed' && call.publication_url && (
                          <>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <a
                              href={call.publication_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              Publication
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
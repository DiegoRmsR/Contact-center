import { Suspense } from 'react';
import AgentsClientPage from '@/components/agents/AgentsClientPage';
import { fetchAgents } from '@/services/api';

// This function runs on the server to generate dynamic metadata
export async function generateMetadata({ searchParams }) {
  const status = searchParams.status || 'all';
  return {
    title: `Agents ${status !== 'all' ? status : ''} - Contact Center`,
  };
}

export default async function AgentsPage({ searchParams }) {
  // Get the status filter from the search parameters
  const statusFilter = searchParams.status || null;
  const filters = statusFilter ? { status: statusFilter } : {};

  try {
    // Fetch the agents from the server's API
    const initialAgents = await fetchAgents(filters);

    // Return the component with the initial state and suspense while loading
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <AgentsClientPage 
          initialAgents={initialAgents} 
          initialStatus={statusFilter} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors in case data fetching fails
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Contact Center Agents</h1>
        <p className="text-red-500">
          Error loading data. Please try reloading the page.
        </p>
      </div>
    );
  }
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Center Dashb</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Agent Management</h2>
          <p className="mb-4">View and filter contact center agents by their current status.</p>
          <Link 
            href="/agents"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Agents
          </Link>
        </div>
        
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Waiting Clients</h2>
          <p className="mb-4">Check the list of waiting clients and filter by wait time.</p>
          <Link 
            href="/clients"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Clients
          </Link>
        </div>
      </div>
    </div>
  );
}

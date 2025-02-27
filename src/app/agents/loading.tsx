export default function AgentsLoading() {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Contact Center Agents</h1>
        
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="h-8 w-20 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i} 
              className="border rounded-lg p-4 h-32 shadow-sm animate-pulse bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }
  
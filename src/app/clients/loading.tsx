export default function ClientsLoading() {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Waiting Clients</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="h-16 w-48 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Name</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Wait Time</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Priority</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Joined at</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
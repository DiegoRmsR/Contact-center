"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import RenderWaitTimeFilters from "./RenderWaitTimeFilters";
import { useClients } from "@/hooks/useClients";

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clients, loading, error, statusFilter, updateFilters } = useClients();

  useEffect(() => {
    const minWaitTime = searchParams.get("minWaitTime")
      ? parseInt(searchParams.get("minWaitTime")!)
      : undefined;

    const maxWaitTime = searchParams.get("maxWaitTime")
      ? parseInt(searchParams.get("maxWaitTime")!)
      : undefined;

    if (
      minWaitTime !== statusFilter?.minWaitTime ||
      maxWaitTime !== statusFilter?.maxWaitTime
    ) {
      updateFilters({ minWaitTime, maxWaitTime });
    }
  }, [searchParams, statusFilter, updateFilters]);

  const handleUpdateFilters = (min?: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min !== undefined) {
      params.set("minWaitTime", min.toString());
    } else {
      params.delete("minWaitTime");
    }

    if (max !== undefined) {
      params.set("maxWaitTime", max.toString());
    } else {
      params.delete("maxWaitTime");
    }

    router.push(`/clients?${params.toString()}`);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Waiting Clients</h1>

      <RenderWaitTimeFilters
        statusFilter={statusFilter}
        handleUpdateFilters={handleUpdateFilters}
      />

      {loading && <p>Loading clients...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && clients.length === 0 && (
        <p>No clients in waiting with the selected filters.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">
                Wait Time
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">
                Priority
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">
                Joined At
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {client.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {formatTime(client.waitTime)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {client.priority}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {new Date(client.joinedAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

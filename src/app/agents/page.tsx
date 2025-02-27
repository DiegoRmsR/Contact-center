import { Suspense } from "react";
import { Metadata } from "next";
import AgentsClientPage from "@/components/agents/AgentsClientPage";
import { fetchAgents } from "@/services/api";
import { AgentStatus } from "@/types/agent";

interface SearchParams {
  status?: AgentStatus;
}

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const status = params.status || "all";

  return {
    title: `Agents ${status !== "all" ? ` - ${status}` : ""} | Contact Center`,
  };
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status || null;
  const filters = statusFilter ? { status: statusFilter } : {};

  try {
    const initialAgents = await fetchAgents(filters);

    return (
      <Suspense fallback={<div className="p-4">Loading agents...</div>}>
        <AgentsClientPage
          initialAgents={initialAgents}
          initialStatus={statusFilter}
        />
      </Suspense>
    );
  } catch {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Contact Center Agents</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading agents. Please try again later.
        </div>
      </div>
    );
  }
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Agent, AgentStatus } from '@/types/agent';
import AgentCard from '@/components/agents/AgentCard';
import websocketService from '@/services/websocket';

interface AgentsClientPageProps {
  initialAgents: Agent[];
  initialStatus: AgentStatus | null;
}

export default function AgentsClientPage({ 
  initialAgents,
  initialStatus 
}: AgentsClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | null>(initialStatus);
  
  // Update filters in the URL
  const updateFilters = (status: AgentStatus | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    router.push(`/agents?${params.toString()}`);
    setStatusFilter(status);
  };
  
  // Set up WebSocket for real-time updates
  useEffect(() => {
    const handleAgentUpdate = (updatedAgent: Agent) => {
      setAgents(prevAgents => {
        // If the updated agent shouldn't be shown due to the filter, remove it
        if (statusFilter && updatedAgent.status !== statusFilter) {
          return prevAgents.filter(agent => agent.id !== updatedAgent.id);
        }
        
        // Check if the agent already exists in the list
        const agentExists = prevAgents.some(agent => agent.id === updatedAgent.id);
        
        if (agentExists) {
          // Update the existing agent
          return prevAgents.map(agent => 
            agent.id === updatedAgent.id ? updatedAgent : agent
          );
        } else if (!statusFilter || updatedAgent.status === statusFilter) {
          // Add the new agent if it matches the filter
          return [...prevAgents, updatedAgent];
        }
        
        return prevAgents;
      });
    };
    
    // Subscribe to agent updates
    websocketService.on('agent_update', handleAgentUpdate);
    
    // Connect WebSocket
    websocketService.connect();
    
    // Cleanup on unmount
    return () => {
      websocketService.off('agent_update', handleAgentUpdate);
    };
  }, [statusFilter]);
  
  // Render status filters
  const renderStatusFilters = () => {
    const statuses: AgentStatus[] = ['available', 'on_call', 'on_break', 'offline'];
    
    return (
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${!statusFilter ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => updateFilters(null)}
        >
          All
        </button>
        {statuses.map(status => (
          <button
            key={status}
            className={`px-3 py-1 rounded ${statusFilter === status ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => updateFilters(status)}
          >
            {status === 'available' && 'Available'}
            {status === 'on_call' && 'On Call'}
            {status === 'on_break' && 'On Break'}
            {status === 'offline' && 'Offline'}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Center Agents</h1>
      
      {renderStatusFilters()}
      
      {agents.length === 0 && (
        <p>No agents match the selected filters.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

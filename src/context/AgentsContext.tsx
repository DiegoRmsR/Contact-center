'use client';

import { Agent, AgentStatus } from '@/types/agent';
import { fetchAgents } from '@/services/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import websocketService from '@/services/websocket';

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  filterByStatus: (status: AgentStatus | null) => void;
  currentFilter: AgentStatus | null;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | null>(null);
  
  const loadAgents = async () => {
    try {
      setLoading(true);
      const filters = statusFilter ? { status: statusFilter } : {};
      const data = await fetchAgents(filters);
      setAgents(data);
      setError(null);
    } catch (err) {
      setError('Error loading agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAgents();
  }, [statusFilter]);
  
  useEffect(() => {
    const handleAgentUpdate = (updatedAgent: Agent) => {
      setAgents(prevAgents => {
        // If there's an active filter and the agent doesn't match, remove it
        if (statusFilter && updatedAgent.status !== statusFilter) {
          return prevAgents.filter(agent => agent.id !== updatedAgent.id);
        }
        
        // Check if the agent already exists
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
    
    websocketService.on('agent_update', handleAgentUpdate);
    websocketService.connect();
    
    return () => {
      websocketService.off('agent_update', handleAgentUpdate);
    };
  }, [statusFilter]);
  
  const filterByStatus = (status: AgentStatus | null) => {
    setStatusFilter(status);
  };
  
  const value = {
    agents,
    loading,
    error,
    filterByStatus,
    currentFilter: statusFilter
  };
  
  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
}

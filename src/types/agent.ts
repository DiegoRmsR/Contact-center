export type AgentStatus = 'available' | 'on_call' | 'on_break' | 'offline';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  waitTime: number;
  lastStatusChange: string;
}

export interface AgentFilters {
  status?: AgentStatus;
}
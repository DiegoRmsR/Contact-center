import { Agent } from '@/types/agent';
import { Client } from '@/types/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchAgents(filters = {}): Promise<Agent[]> {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  
  const response = await fetch(`${API_URL}/agents?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  
  return response.json();
}

export async function fetchClients(filters = {}): Promise<Client[]> {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  
  const response = await fetch(`${API_URL}/clients?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  
  return response.json();
}
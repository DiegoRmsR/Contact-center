'use client';

import { Client } from '@/types/client';
import { fetchClients } from '@/services/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import websocketService from '@/services/websocket';

interface ClientFilters {
  minWaitTime?: number;
  maxWaitTime?: number;
}

interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  filters: ClientFilters;
  updateFilters: (newFilters: ClientFilters) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({});
  
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients(filters);
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadClients();
  }, [filters]);
  
  useEffect(() => {
    const handleClientUpdate = (updatedClient: Client) => {
      setClients(prevClients => {
        // Verificar si el cliente cumple con los filtros
        if ((filters.minWaitTime !== undefined && updatedClient.waitTime < filters.minWaitTime) ||
            (filters.maxWaitTime !== undefined && updatedClient.waitTime > filters.maxWaitTime)) {
          return prevClients.filter(client => client.id !== updatedClient.id);
        }
        
        // Verificar si el cliente ya existe
        const clientExists = prevClients.some(client => client.id === updatedClient.id);
        
        if (clientExists) {
          // Actualizar el cliente existente
          return prevClients.map(client => 
            client.id === updatedClient.id ? updatedClient : client
          );
        } else {
          // Añadir el nuevo cliente si cumple con los filtros
          return [...prevClients, updatedClient];
        }
      });
    };
    
    const handleClientRemoved = (clientId: string) => {
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    };
    
    websocketService.on('client_update', handleClientUpdate);
    websocketService.on('new_client', handleClientUpdate);
    websocketService.on('client_removed', handleClientRemoved);
    
    websocketService.connect();
    
    return () => {
      websocketService.off('client_update', handleClientUpdate);
      websocketService.off('new_client', handleClientUpdate);
      websocketService.off('client_removed', handleClientRemoved);
    };
  }, [filters]);
  
  const updateFilters = (newFilters: ClientFilters) => {
    setFilters(newFilters);
  };
  
  const value = {
    clients,
    loading,
    error,
    filters,
    updateFilters
  };
  
  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
}
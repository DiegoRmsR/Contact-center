"use client";

import { Client } from "@/types/client";
import { fetchClients } from "@/services/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import websocketService from "@/services/websocket";

interface ClientFilters {
  minWaitTime?: number;
  maxWaitTime?: number;
}

interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  statusFilter: ClientFilters;
  updateFilters: (newFilters: ClientFilters) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter]  = useState<ClientFilters>({});

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchClients(statusFilter);
      setClients(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);
  
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    const handleClientUpdate = (updatedClient: Client) => {
      setClients((prevClients) => {
        if (
          (statusFilter.minWaitTime !== undefined &&
            updatedClient.waitTime < statusFilter.minWaitTime) ||
          (statusFilter.maxWaitTime !== undefined &&
            updatedClient.waitTime > statusFilter.maxWaitTime)
        ) {
          return prevClients.filter((client) => client.id !== updatedClient.id);
        }

        const clientExists = prevClients.some(
          (client) => client.id === updatedClient.id
        );

        if (clientExists) {
          return prevClients.map((client) =>
            client.id === updatedClient.id ? updatedClient : client
          );
        } else {
          return [...prevClients, updatedClient];
        }
      });
    };

    const handleClientRemoved = ({ clientId }: { clientId: string }) => {
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
    };

    websocketService.on("client_update", handleClientUpdate);
    websocketService.on("new_client", handleClientUpdate);
    websocketService.on("client_removed", handleClientRemoved);

    websocketService.connect();

    return () => {
      websocketService.off("client_update", handleClientUpdate);
      websocketService.off("new_client", handleClientUpdate);
      websocketService.off("client_removed", handleClientRemoved);
    };
  }, [statusFilter]);

  const updateFilters = (newFilters: ClientFilters) => {
    setStatusFilter(newFilters);
  };

  const value = {
    clients,
    loading,
    error,
    statusFilter,
    updateFilters,
  };

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
}

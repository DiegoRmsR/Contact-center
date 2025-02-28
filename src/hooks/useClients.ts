import { ClientsContext } from "@/context/ClientsContext";
import { useContext } from "react";

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
}

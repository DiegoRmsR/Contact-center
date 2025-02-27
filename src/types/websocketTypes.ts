import { Agent } from "./agent";
import { Client } from "./client";


export type WebSocketMessageType = 
  | 'agent_update'
  | 'client_update'
  | 'new_client'
  | 'client_removed';

export interface WebSocketMessageMap {
  agent_update: Agent;
  client_update: Client;
  new_client: Client;
  client_removed: { clientId: string };
}

export type ListenerFunction<T extends WebSocketMessageType> = (payload: WebSocketMessageMap[T]) => void;

export type WebSocketMessage<T extends WebSocketMessageType = WebSocketMessageType> = 
  { [K in T]: { type: K, payload: WebSocketMessageMap[K] } }[T];

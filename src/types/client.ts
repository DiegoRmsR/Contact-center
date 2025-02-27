export interface Client {
  id: string;
  name: string;
  waitTime: number; // in seconds
  joinedAt: string; // ISO date string
  priority: number;
}

export interface ClientFilters {
  minWaitTime?: number;
  maxWaitTime?: number;
  priority?: number;
}

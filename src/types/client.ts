export interface Client {
  id: string;
  name: string;
  waitTime: number;
  joinedAt: string;
  priority: number;
}

export interface ClientFilters {
  minWaitTime?: number;
  maxWaitTime?: number;
  priority?: number;
}

export type WebSocketMessageType = 'agent_update' | 'client_update' | 'new_client' | 'client_removed';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private listeners: Map<WebSocketMessageType, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyListeners(message);
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error', error);
        this.socket?.close();
      };
    } catch (e) {
      console.error('Failed to connect to WebSocket', e);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  on(type: WebSocketMessageType, callback: Function): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    
    this.listeners.get(type)?.push(callback);
  }

  off(type: WebSocketMessageType, callback: Function): void {
    if (!this.listeners.has(type)) return;
    
    const callbacks = this.listeners.get(type) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  private notifyListeners(message: WebSocketMessage): void {
    const { type, payload } = message;
    const callbacks = this.listeners.get(type) || [];
    
    callbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (e) {
        console.error(`Error in WebSocket listener for ${type}`, e);
      }
    });
  }
}

export default new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws');
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketManager = new SocketManager();
export default socketManager; 
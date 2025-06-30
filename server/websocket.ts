import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { EventEmitter } from 'events';

class WebSocketManager extends EventEmitter {
  private io: SocketServer | null = null;
  private connectedUsers: Map<string, Socket> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.auth.userId;
      console.log('🔌 New WebSocket connection:', { userId, socketId: socket.id });

      if (userId) {
        // Store user connection
        this.connectedUsers.set(userId, socket);

        // Join user-specific room
        socket.join(`user:${userId}`);
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        if (userId) {
          this.connectedUsers.delete(userId);
          console.log('🔌 User disconnected:', { userId, socketId: socket.id });
        }
      });

      // Error handling
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    console.log('✅ WebSocket server initialized');
  }

  // Broadcast activity to all connected users
  broadcastActivity(activity: any) {
    if (!this.io) {
      console.error('❌ WebSocket server not initialized');
      return;
    }

    console.log('📢 Broadcasting activity:', activity);
    this.io.emit('new_activity', activity);
  }

  // Send activity to specific users
  sendActivityToUsers(userIds: string[], activity: any) {
    if (!this.io) {
      console.error('❌ WebSocket server not initialized');
      return;
    }

    console.log('📨 Sending activity to users:', { userIds, activity });
    userIds.forEach(userId => {
      this.io?.to(`user:${userId}`).emit('new_activity', activity);
    });
  }

  // Update existing activity
  updateActivity(activity: any) {
    if (!this.io) {
      console.error('❌ WebSocket server not initialized');
      return;
    }

    console.log('🔄 Updating activity:', activity);
    this.io.emit('activity_update', activity);
  }

  // Get connected user count
  getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }

  // Check if a user is connected
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get all connected user IDs
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export const webSocketManager = new WebSocketManager();
export default webSocketManager; 
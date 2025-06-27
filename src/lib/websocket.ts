import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: 'notification' | 'discussion_update' | 'user_activity' | 'research_update' | 'system_alert';
  data: any;
  timestamp: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UserPresence {
  userId: string;
  username: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentPage?: string;
  isTyping?: boolean;
}

export interface RealTimeNotification {
  id: string;
  type: 'research_published' | 'discussion_reply' | 'bookmark_added' | 'expert_joined' | 'achievement_earned';
  title: string;
  message: string;
  data?: any;
  userId: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface LiveDiscussionUpdate {
  discussionId: string;
  postId?: string;
  action: 'new_post' | 'edit_post' | 'delete_post' | 'reaction_added' | 'user_joined' | 'user_left';
  data: any;
  userId: string;
  timestamp: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    if (typeof window === 'undefined') return; // Server-side check

    try {
      this.socket = io('ws://localhost:3003', {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        transports: ['websocket', 'polling'],
        upgrade: true
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection_status', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { status: 'disconnected', reason });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.emit('connection_status', { status: 'reconnected', attempts: attemptNumber });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🚫 WebSocket reconnection failed:', error);
      this.reconnectAttempts++;
      this.emit('connection_status', { status: 'reconnect_failed', attempts: this.reconnectAttempts });
    });

    // Real-time notification handling
    this.socket.on('notification', (notification: RealTimeNotification) => {
      console.log('🔔 Real-time notification received:', notification);
      this.emit('notification', notification);
      
      // Show browser notification if permission granted
      this.showBrowserNotification(notification);
    });

    // Live discussion updates
    this.socket.on('discussion_update', (update: LiveDiscussionUpdate) => {
      console.log('💬 Discussion update received:', update);
      this.emit('discussion_update', update);
    });

    // User presence updates
    this.socket.on('user_presence', (presence: UserPresence[]) => {
      console.log('👥 User presence update:', presence);
      this.emit('user_presence', presence);
    });

    // Research updates
    this.socket.on('research_update', (update: any) => {
      console.log('📚 Research update received:', update);
      this.emit('research_update', update);
    });

    // System alerts
    this.socket.on('system_alert', (alert: any) => {
      console.log('⚠️ System alert received:', alert);
      this.emit('system_alert', alert);
    });

    // Live analytics updates
    this.socket.on('analytics_update', (analytics: any) => {
      console.log('📊 Analytics update received:', analytics);
      this.emit('analytics_update', analytics);
    });
  }

  // Event emitter functionality
  public on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Authentication with WebSocket server
  public authenticate(token: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('authenticate', { token, userId });
      console.log('🔐 WebSocket authentication sent for user:', userId);
    }
  }

  // Join specific rooms for targeted updates
  public joinRoom(roomType: 'discussion' | 'research' | 'notifications', roomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { roomType, roomId });
      console.log(`🏠 Joined ${roomType} room:`, roomId);
    }
  }

  public leaveRoom(roomType: 'discussion' | 'research' | 'notifications', roomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { roomType, roomId });
      console.log(`🚪 Left ${roomType} room:`, roomId);
    }
  }

  // Send real-time messages
  public sendMessage(type: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(type, data);
    } else {
      console.warn('WebSocket not connected, message queued');
      // In real implementation, queue messages for when connection is restored
    }
  }

  // User presence management
  public updatePresence(status: 'online' | 'away' | 'busy' | 'offline', currentPage?: string) {
    this.sendMessage('update_presence', { status, currentPage, timestamp: new Date().toISOString() });
  }

  public setTyping(discussionId: string, isTyping: boolean) {
    this.sendMessage('typing_indicator', { discussionId, isTyping, timestamp: new Date().toISOString() });
  }

  // Discussion real-time features
  public joinDiscussion(discussionId: string) {
    this.joinRoom('discussion', discussionId);
    this.sendMessage('join_discussion', { discussionId });
  }

  public leaveDiscussion(discussionId: string) {
    this.leaveRoom('discussion', discussionId);
    this.sendMessage('leave_discussion', { discussionId });
  }

  public sendDiscussionMessage(discussionId: string, message: any) {
    this.sendMessage('discussion_message', { discussionId, message, timestamp: new Date().toISOString() });
  }

  // Notification management
  public markNotificationRead(notificationId: string) {
    this.sendMessage('mark_notification_read', { notificationId });
  }

  public requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  private showBrowserNotification(notification: RealTimeNotification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/images/logo-icon.png',
        badge: '/images/logo-icon.png',
        tag: notification.id,
        requireInteraction: notification.type === 'system_alert',
        actions: notification.actionUrl ? [
          { action: 'view', title: 'View', icon: '/icons/view.png' }
        ] : undefined
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds for non-urgent notifications
      if (notification.type !== 'system_alert') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  // Analytics and monitoring
  public sendAnalyticsEvent(event: string, data: any) {
    this.sendMessage('analytics_event', {
      event,
      data,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent
    });
  }

  // Connection status
  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  public getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' | 'reconnecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connecting) return 'connecting';
    if (this.socket.connected) return 'connected';
    return 'disconnected';
  }

  // Cleanup
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket manually disconnected');
    }
  }

  public destroy() {
    this.disconnect();
    this.eventListeners.clear();
  }
}

// Singleton instance
let webSocketService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!webSocketService) {
    webSocketService = new WebSocketService();
  }
  return webSocketService;
};

// React hooks for WebSocket functionality
export const useWebSocket = () => {
  const ws = getWebSocketService();
  
  return {
    isConnected: ws.isSocketConnected(),
    connectionStatus: ws.getConnectionStatus(),
    authenticate: ws.authenticate.bind(ws),
    joinRoom: ws.joinRoom.bind(ws),
    leaveRoom: ws.leaveRoom.bind(ws),
    sendMessage: ws.sendMessage.bind(ws),
    updatePresence: ws.updatePresence.bind(ws),
    setTyping: ws.setTyping.bind(ws),
    joinDiscussion: ws.joinDiscussion.bind(ws),
    leaveDiscussion: ws.leaveDiscussion.bind(ws),
    sendDiscussionMessage: ws.sendDiscussionMessage.bind(ws),
    markNotificationRead: ws.markNotificationRead.bind(ws),
    requestNotificationPermission: ws.requestNotificationPermission.bind(ws),
    sendAnalyticsEvent: ws.sendAnalyticsEvent.bind(ws),
    on: ws.on.bind(ws),
    off: ws.off.bind(ws)
  };
};

export default WebSocketService; 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'research' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
  metadata?: {
    researchId?: string;
    userId?: string;
    commentId?: string;
    [key: string]: any;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isConnected: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      const notification = {
        ...action.payload,
        timestamp: new Date(action.payload.timestamp),
      };
      
      // Add to beginning of array (newest first)
      state.notifications.unshift(notification);
      
      // Update unread count
      if (!notification.read) {
        state.unreadCount += 1;
      }
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload.map(n => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConnected,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setNotifications,
  setLoading,
  setError,
} = notificationSlice.actions;

export default notificationSlice.reducer; 
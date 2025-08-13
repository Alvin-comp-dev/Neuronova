import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'expert' | 'admin';
  avatar?: string;
  isVerified: boolean;
  preferences: {
    categories: string[];
    emailNotifications: boolean;
    darkMode: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

// Initialize state with token from localStorage if available
const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

// Initialize auth state by checking stored token
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        return { user: null, token: null, isAuthenticated: false };
      }
      
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Transform backend user data to match frontend User interface
      const userData = response.data.data;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        avatar: userData.avatar,
        isVerified: userData.verified || false,
        preferences: {
          categories: userData.preferences?.categories || [],
          emailNotifications: userData.preferences?.emailNotifications || true,
          darkMode: userData.preferences?.darkMode || false,
        }
      };
      
      return {
        user,
        token,
        isAuthenticated: true,
      };
    } catch (error: any) {
      // Remove invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return { user: null, token: null, isAuthenticated: false };
    }
  }
);

// Async thunks - Updated to use Next.js API routes
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      
      // Transform backend user data to match frontend User interface
      const userData = response.data.user;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        avatar: userData.avatar,
        isVerified: userData.verified || false,
        preferences: {
          categories: userData.preferences?.categories || [],
          emailNotifications: userData.preferences?.emailNotifications || true,
          darkMode: userData.preferences?.darkMode || false,
        }
      };
      
      return {
        ...response.data,
        user
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, agreedToTerms }: { name: string; email: string; password: string; agreedToTerms: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        agreedToTerms,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      
      // Transform backend user data to match frontend User interface
      const userData = response.data.user;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        avatar: userData.avatar,
        isVerified: userData.verified || false,
        preferences: {
          categories: userData.preferences?.categories || [],
          emailNotifications: userData.preferences?.emailNotifications || true,
          darkMode: userData.preferences?.darkMode || false,
        }
      };
      
      return {
        ...response.data,
        user
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Transform backend user data to match frontend User interface
      const userData = response.data.data;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        avatar: userData.avatar,
        isVerified: userData.verified || false,
        preferences: {
          categories: userData.preferences?.categories || [],
          emailNotifications: userData.preferences?.emailNotifications || true,
          darkMode: userData.preferences?.darkMode || false,
        }
      };
      
      return {
        ...response.data,
        data: user
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      });
  },
});

export const { logout, clearError, setCredentials, setAuth } = authSlice.actions;
export default authSlice.reducer; 
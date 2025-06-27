'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { initializeTheme } from '@/lib/store/slices/themeSlice';
import { initializeAuth } from '@/lib/store/slices/authSlice';

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only run theme initialization on client
    if (typeof window !== 'undefined') {
      console.log('ThemeInitializer useEffect called');
      dispatch(initializeTheme());
      console.log('initializeTheme dispatched');
    }
  }, [dispatch]);

  return <>{children}</>;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize authentication state on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeInitializer>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </ThemeInitializer>
    </Provider>
  );
} 
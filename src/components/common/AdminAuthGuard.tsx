'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { initializeAuth } from '@/lib/store/slices/authSlice';
import { LoadingSpinner } from './LoadingSpinner';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('🔍 Auth Debug:', { user, isAuthenticated, isInitialized, isLoading });
    
    // Initialize auth if not already done
    if (!isInitialized) {
      dispatch(initializeAuth());
      return;
    }

    setIsChecking(false);

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/admin');
      return;
    }

    // If authenticated but not admin, redirect to home
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, isInitialized, router, dispatch]);

  // Show loading while checking authentication
  if (isLoading || isChecking || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // If not admin, show access denied
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin, render the protected content
  return <>{children}</>;
}

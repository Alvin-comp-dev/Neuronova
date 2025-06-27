'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { initializeAuth } from '@/lib/store/slices/authSlice';
import { LoadingSpinner } from './LoadingSpinner';

interface UserAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}

export default function UserAuthGuard({ 
  children, 
  redirectTo = '/auth/login',
  message = "Please sign in to access this page"
}: UserAuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initialize auth if not already done
    if (!isInitialized) {
      dispatch(initializeAuth());
      return;
    }

    setIsChecking(false);

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
  }, [isAuthenticated, user, isInitialized, router, dispatch, redirectTo]);

  // Show loading while checking authentication
  if (isLoading || isChecking || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show access denied message
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Authentication Required</h1>
          <p className="mt-2 text-gray-600">{message}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setIsSubmitted(true);
        
        // In development, show the reset token for testing
        if (data.resetToken) {
          console.log('Reset token (for testing):', data.resetToken);
          setMessage(
            `${data.message}\n\nFor testing purposes, your reset token is: ${data.resetToken}\n\nClick here to reset your password with this token.`
          );
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestReset = () => {
    // For development - redirect to reset password page
    const urlParams = new URLSearchParams(window.location.search);
    const token = message.match(/reset token is: ([a-f0-9]+)/)?.[1];
    if (token) {
      router.push(`/auth/reset-password?token=${token}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Neuronova
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-4">
              <div className="text-sm text-green-600 dark:text-green-400 whitespace-pre-line">
                {message}
              </div>
            </div>

            {message.includes('reset token is:') && (
              <div className="space-y-4">
                <button
                  onClick={handleTestReset}
                  className="w-full btn-primary py-3 text-base"
                >
                  Reset Password Now (Testing)
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  This button is only available in development mode
                </p>
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                  setError('');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                try again
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
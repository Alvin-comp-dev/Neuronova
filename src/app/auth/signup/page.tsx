'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    researchInterests: [] as string[],
    academicLevel: '',
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState('');

  const academicLevels = [
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'postdoc', label: 'Postdoctoral Researcher' },
    { value: 'professor', label: 'Professor' },
    { value: 'researcher', label: 'Independent Researcher' },
    { value: 'other', label: 'Other' },
  ];

  const commonInterests = [
    'Neuroscience', 'Artificial Intelligence', 'Machine Learning', 'Brain-Computer Interface',
    'Cognitive Science', 'Neurobiology', 'Psychology', 'Computational Neuroscience',
    'Medical Research', 'Bioinformatics', 'Neuroimaging', 'Genetics'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (error) setError('');
  };

  const addResearchInterest = (interest: string) => {
    if (interest && !formData.researchInterests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        researchInterests: [...prev.researchInterests, interest]
      }));
      setNewInterest('');
    }
  };

  const removeResearchInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter(i => i !== interest)
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateStep2()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          institution: formData.institution.trim(),
          researchInterests: formData.researchInterests,
          academicLevel: formData.academicLevel,
          agreedToTerms: formData.agreedToTerms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        setTimeout(() => {
          router.push('/auth/signin?message=registration-success');
        }, 3000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    if (oauthLoading) return;
    
    setOauthLoading(provider);
    setError('');
    
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Neuronova
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your research account
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Account</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Profile</span>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* OAuth Providers */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={!!oauthLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {oauthLoading === 'google' ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <FaGoogle className="w-5 h-5 text-red-500" />
                )}
                <span className="ml-3">Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuthSignIn('github')}
                disabled={!!oauthLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {oauthLoading === 'github' ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <FaGithub className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
                <span className="ml-3">Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or create with email
                </span>
              </div>
            </div>

            {/* Step 1 Form */}
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {currentStep === 2 && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Institution Field */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Institution (Optional)
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your university or organization"
              />
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Academic Level (Optional)
              </label>
              <select
                id="academicLevel"
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your level</option>
                {academicLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Research Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Research Interests (Optional)
              </label>
              
              {/* Common Interests */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {commonInterests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => addResearchInterest(interest)}
                      disabled={formData.researchInterests.includes(interest)}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Interest Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add custom interest"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResearchInterest(newInterest);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addResearchInterest(newInterest)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Selected Interests */}
              {formData.researchInterests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.researchInterests.map(interest => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-full"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeResearchInterest(interest)}
                        className="ml-2 text-blue-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="agreedToTerms"
                name="agreedToTerms"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded mt-1"
              />
              <label htmlFor="agreedToTerms" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 
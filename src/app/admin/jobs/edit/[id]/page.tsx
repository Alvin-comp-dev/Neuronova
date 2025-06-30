'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  isActive: boolean;
}

export default function EditJob({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Job | null>(null);

  const departments = [
    'Research',
    'Engineering',
    'Data Science',
    'Healthcare',
    'Neuroscience',
    'Biotech'
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ];

  useEffect(() => {
    if (!token) {
      setError('Authentication required');
      return;
    }
    fetchJob();
  }, [token, params.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/jobs?id=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job');
      }

      const data = await response.json();
      setFormData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    try {
      setLoading(true);
      setError(null);

      // Filter out empty array items
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        qualifications: formData.qualifications.filter(item => item.trim() !== '')
      };

      const response = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: params.id,
          ...cleanedData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (
    field: 'requirements' | 'responsibilities' | 'qualifications',
    index: number,
    value: string
  ) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      };
    });
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'qualifications') => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: [...prev[field], '']
      };
    });
  };

  const removeArrayField = (
    field: 'requirements' | 'responsibilities' | 'qualifications',
    index: number
  ) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      };
    });
  };

  if (loading && !formData) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="mt-2 text-gray-600">{error || 'Failed to load job data'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Jobs
            </button>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Edit Job
            </h2>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => prev ? { ...prev, title: e.target.value } : prev)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <select
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData(prev => prev ? { ...prev, department: e.target.value } : prev)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Job Type *
              </label>
              <select
                id="type"
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => prev ? { ...prev, type: e.target.value } : prev)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => prev ? { ...prev, location: e.target.value } : prev)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experience Required *
              </label>
              <input
                type="text"
                id="experience"
                required
                value={formData.experience}
                onChange={(e) => setFormData(prev => prev ? { ...prev, experience: e.target.value } : prev)}
                placeholder="e.g. 3+ years"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => prev ? { ...prev, description: e.target.value } : prev)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  required
                  value={req}
                  onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Requirement
            </button>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities *
            </label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  required
                  value={resp}
                  onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('responsibilities', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('responsibilities')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications *
            </label>
            {formData.qualifications.map((qual, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  required
                  value={qual}
                  onChange={(e) => handleArrayFieldChange('qualifications', index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('qualifications', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('qualifications')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Qualification
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => prev ? { ...prev, isActive: e.target.checked } : prev)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Make this job posting active
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
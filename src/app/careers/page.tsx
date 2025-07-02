'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon, ClockIcon, BriefcaseIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary_range?: string;
  posted_date: string;
  application_deadline?: string;
  remote_ok: boolean;
  status: string;
}

interface JobFilters {
  departments: string[];
  locations: string[];
  types: string[];
  levels: string[];
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    departments: [],
    locations: [],
    types: [],
    levels: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Application form state
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [selectedDepartment, selectedLocation, selectedType, selectedLevel, remoteOnly]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDepartment) params.append('department', selectedDepartment);
      if (selectedLocation) params.append('location', selectedLocation);
      if (selectedType) params.append('type', selectedType);
      if (selectedLevel) params.append('level', selectedLevel);
      if (remoteOnly) params.append('remote', 'true');

      const response = await fetch(`/api/careers?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.jobs);
        setFilters(data.filters);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob.id,
          applicantData: applicationData
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Application submitted successfully!');
        setShowApplication(false);
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          resume: '',
          coverLetter: '',
          linkedinUrl: '',
          portfolioUrl: ''
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (showApplication && selectedJob) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => setShowApplication(false)}
              className="text-blue-400 hover:text-blue-300 mb-4"
            >
              ← Back to Jobs
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Apply for {selectedJob.title}</h1>
            <p className="text-slate-400">{selectedJob.department} • {selectedJob.location}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-8">
            <form onSubmit={handleApplication} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.name}
                    onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={applicationData.linkedinUrl}
                    onChange={(e) => setApplicationData({ ...applicationData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={applicationData.portfolioUrl}
                    onChange={(e) => setApplicationData({ ...applicationData, portfolioUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Resume / CV *
                </label>
                <textarea
                  required
                  rows={4}
                  value={applicationData.resume}
                  onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your resume content here or provide a link to your resume..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  required
                  rows={6}
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Help us build the future of research discovery. Work with cutting-edge AI, 
            collaborate with brilliant minds, and make a global impact on academic research.
          </p>
        </div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Innovation First</h3>
            <p className="text-slate-400">Push boundaries with cutting-edge AI and research technology</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Global Impact</h3>
            <p className="text-slate-400">Democratize access to research for millions worldwide</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Work-Life Balance</h3>
            <p className="text-slate-400">Flexible schedules, remote options, and comprehensive benefits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Jobs</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    {filters.departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {filters.locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {filters.types.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    {filters.levels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-slate-300">
                    Remote positions only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-400 mt-4">Loading opportunities...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No jobs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedDepartment('');
                    setSelectedLocation('');
                    setSelectedType('');
                    setSelectedLevel('');
                    setRemoteOnly(false);
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Open Positions ({jobs.length})
                  </h2>
                </div>

                {jobs.map(job => (
                  <div key={job.id} className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <BriefcaseIcon className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                          </span>
                          {job.salary_range && (
                            <span className="flex items-center gap-1">
                              <CurrencyDollarIcon className="h-4 w-4" />
                              {job.salary_range}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {job.remote_ok && (
                          <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">
                            Remote OK
                          </span>
                        )}
                        <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                          {job.level.charAt(0).toUpperCase() + job.level.slice(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">
                        Posted {formatDate(job.posted_date)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {selectedJob?.id === job.id ? 'Hide Details' : 'View Details'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowApplication(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>

                    {/* Job Details */}
                    {selectedJob?.id === job.id && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-white mb-3">Requirements</h4>
                            <ul className="space-y-1">
                              {job.requirements.map((req, index) => (
                                <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">•</span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-3">Responsibilities</h4>
                            <ul className="space-y-1">
                              {job.responsibilities.slice(0, 4).map((resp, index) => (
                                <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold text-white mb-3">Benefits & Perks</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {job.benefits.map((benefit, index) => (
                              <div key={index} className="text-slate-300 text-sm flex items-start gap-2">
                                <span className="text-purple-400 mt-1">✓</span>
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
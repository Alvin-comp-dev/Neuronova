'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Globe, 
  Brain,
  Code,
  Database,
  ChevronRight,
  Building2,
  GraduationCap,
  HeartPulse,
  Microscope,
  Dna
} from 'lucide-react';

interface JobPosting {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  icon?: any;
}

const departmentIcons = {
  'research': Microscope,
  'engineering': Code,
  'data-science': Database,
  'healthcare': HeartPulse,
  'neuroscience': Brain,
  'biotech': Dna
};

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const departments = [
    { id: 'all', name: 'All Departments', icon: Building2 },
    { id: 'research', name: 'Research', icon: Microscope },
    { id: 'engineering', name: 'Engineering', icon: Code },
    { id: 'data-science', name: 'Data Science', icon: Database },
    { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
    { id: 'neuroscience', name: 'Neuroscience', icon: Brain },
    { id: 'biotech', name: 'Biotech', icon: Dna }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs${selectedDepartment !== 'all' ? `?department=${selectedDepartment}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        // Add icons to jobs based on department
        const jobsWithIcons = data.map((job: JobPosting) => ({
          ...job,
          icon: departmentIcons[job.department as keyof typeof departmentIcons] || Building2
        }));
        setJobs(jobsWithIcons);
      } catch (err) {
        setError('Failed to load job postings');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedDepartment]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Join the Future of Neurotechnology
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Help us revolutionize neuroscience and healthcare through cutting-edge research and technology
            </p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-blue-100">
                <Globe className="h-6 w-6 mr-2" />
                <span>Global Opportunities</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Users className="h-6 w-6 mr-2" />
                <span>Diverse Teams</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Brain className="h-6 w-6 mr-2" />
                <span>Cutting-edge Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {dept.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No job postings available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => {
              const Icon = job.icon;
              return (
                <div
                  key={job._id}
                  className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <Icon className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                      <p className="text-slate-300 mb-6">{job.description}</p>
                      <div className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <div key={index} className="flex items-start text-sm text-slate-400">
                            <ChevronRight className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/careers/${job._id}`}
                      className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                    >
                      Apply Now
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Join Neuronova?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We offer competitive benefits and a supportive environment where you can grow your career while making a real impact in neuroscience and healthcare.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cutting-edge Research</h3>
              <p className="text-slate-400">
                Work on groundbreaking projects in neuroscience, AI, and healthcare technology.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Collaborative Culture</h3>
              <p className="text-slate-400">
                Join a diverse team of experts working together to solve complex challenges.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="h-12 w-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Impact</h3>
              <p className="text-slate-400">
                Make a real difference in healthcare and improve lives around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
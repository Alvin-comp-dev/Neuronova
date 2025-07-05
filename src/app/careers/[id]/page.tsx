'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Building2,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Brain,
  Code,
  Database,
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
  responsibilities: string[];
  qualifications: string[];
}

const departmentIcons = {
  'research': Microscope,
  'engineering': Code,
  'data-science': Database,
  'healthcare': HeartPulse,
  'neuroscience': Brain,
  'biotech': Dna
};

export default function JobPostingPage() {
  const params = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError('Failed to load job posting');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-slate-400 mb-8">{error || "The job posting you're looking for doesn't exist."}</p>
          <Link
            href="/careers"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  const Icon = departmentIcons[job.department as keyof typeof departmentIcons] || Building2;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/careers"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Jobs
        </Link>

        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <div className="flex items-center mb-6">
            <Icon className="h-8 w-8 text-blue-500 mr-4" />
            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-8">
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

          <div className="prose prose-invert max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">About the Role</h2>
              <p className="text-slate-300">{job.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <ChevronRight className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <ChevronRight className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Qualifications</h2>
              <ul className="space-y-2">
                {job.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <ChevronRight className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              onClick={() => window.location.href = 'mailto:careers@neuronova.ai'}
            >
              Apply for this Position
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
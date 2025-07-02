import { NextRequest, NextResponse } from 'next/server';

// Job data structure
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // 'full-time', 'part-time', 'contract', 'intern'
  level: string; // 'entry', 'mid', 'senior', 'lead'
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary_range?: string;
  posted_date: string;
  application_deadline?: string;
  remote_ok: boolean;
  status: 'active' | 'paused' | 'closed';
}

// Import job postings from admin system
import { jobPostings } from '@/app/api/admin/job-management/route';

// Convert admin job postings to frontend format
const getActiveJobs = (): Job[] => {
  return jobPostings
    .filter(job => job.status === 'active')
    .map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      level: job.level,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      salary_range: job.salary_range,
      posted_date: job.posted_date,
      application_deadline: job.application_deadline,
      remote_ok: job.remote_ok,
      status: job.status as 'active' | 'paused' | 'closed'
    }));
};

// Fallback static jobs if no admin jobs exist
const STATIC_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'full-time',
    level: 'senior',
    description: 'Join our core engineering team to build the next generation of research discovery tools. You\'ll work on cutting-edge AI integration, scalable backend systems, and intuitive user interfaces.',
    requirements: [
      '5+ years of full-stack development experience',
      'Expert knowledge of TypeScript, React, Node.js',
      'Experience with MongoDB, PostgreSQL, or similar databases',
      'Familiarity with AI/ML APIs and integration',
      'Strong understanding of system architecture and scalability',
      'Experience with cloud platforms (AWS, GCP, or Azure)'
    ],
    responsibilities: [
      'Design and implement new features for the NeuroNova platform',
      'Optimize application performance and scalability',
      'Collaborate with AI/ML team on research integration',
      'Mentor junior developers and code review',
      'Participate in architecture decisions and technical planning',
      'Ensure code quality and maintain testing standards'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work arrangements and remote options',
      'Professional development budget ($3,000/year)',
      'Unlimited PTO policy',
      'State-of-the-art equipment and workspace'
    ],
    salary_range: '$140,000 - $180,000',
    posted_date: '2024-01-15',
    application_deadline: '2024-02-15',
    remote_ok: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'AI Research Scientist',
    department: 'Research & AI',
    location: 'Remote',
    type: 'full-time',
    level: 'senior',
    description: 'Lead our AI research initiatives to improve academic paper discovery, relevance scoring, and knowledge extraction. Work at the intersection of NLP, information retrieval, and academic research.',
    requirements: [
      'PhD in Computer Science, AI/ML, or related field',
      'Strong background in NLP and information retrieval',
      'Experience with large language models and embeddings',
      'Published research in top-tier conferences (ACL, EMNLP, ICLR, etc.)',
      'Proficiency in Python, PyTorch/TensorFlow',
      'Experience with academic databases and APIs'
    ],
    responsibilities: [
      'Develop novel AI algorithms for research discovery',
      'Improve semantic search and ranking systems',
      'Research and implement state-of-the-art NLP techniques',
      'Collaborate with academic institutions and researchers',
      'Publish research findings and represent NeuroNova at conferences',
      'Mentor junior AI engineers and researchers'
    ],
    benefits: [
      'Competitive research scientist compensation',
      'Research publication support and conference budget',
      'Access to premium compute resources and datasets',
      'Collaboration opportunities with top universities',
      'Flexible research time allocation',
      'Comprehensive benefits package'
    ],
    salary_range: '$160,000 - $220,000',
    posted_date: '2024-01-10',
    remote_ok: true,
    status: 'active'
  },
  {
    id: '3',
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'full-time',
    level: 'mid',
    description: 'Shape the user experience of NeuroNova\'s research platform. Design intuitive interfaces that make complex academic content accessible to researchers worldwide.',
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating UX/UI design skills',
      'Experience with design tools (Figma, Sketch, Adobe Creative Suite)',
      'Understanding of user research and usability testing',
      'Experience designing for complex data and search interfaces',
      'Knowledge of accessibility standards and best practices'
    ],
    responsibilities: [
      'Design user-centered experiences for research discovery',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with engineering team on implementation',
      'Maintain and evolve design system components',
      'Advocate for user needs in product decisions'
    ],
    benefits: [
      'Competitive salary and equity',
      'Professional design tool subscriptions',
      'Conference and workshop attendance support',
      'Collaborative and creative work environment',
      'Health and wellness benefits',
      'Flexible work schedule'
    ],
    salary_range: '$110,000 - $140,000',
    posted_date: '2024-01-20',
    remote_ok: true,
    status: 'active'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'full-time',
    level: 'mid',
    description: 'Build and maintain the infrastructure that powers NeuroNova\'s global research platform. Focus on scalability, reliability, and performance optimization.',
    requirements: [
      '3+ years of DevOps/Infrastructure experience',
      'Strong knowledge of AWS/GCP cloud platforms',
      'Experience with containerization (Docker, Kubernetes)',
      'Proficiency in Infrastructure as Code (Terraform, CloudFormation)',
      'Monitoring and observability experience (Prometheus, Grafana)',
      'Experience with CI/CD pipelines and automation'
    ],
    responsibilities: [
      'Maintain and optimize cloud infrastructure',
      'Implement monitoring, alerting, and incident response',
      'Automate deployment and scaling processes',
      'Ensure security and compliance standards',
      'Optimize costs and performance across services',
      'Support development teams with infrastructure needs'
    ],
    benefits: [
      'Competitive compensation package',
      'Cloud certification support and training',
      'Remote-first work culture',
      'On-call compensation and rotation',
      'Latest tools and technology access',
      'Health and retirement benefits'
    ],
    salary_range: '$120,000 - $150,000',
    posted_date: '2024-01-12',
    remote_ok: true,
    status: 'active'
  },
  {
    id: '5',
    title: 'Research Partnership Manager',
    department: 'Business Development',
    location: 'New York, NY',
    type: 'full-time',
    level: 'mid',
    description: 'Build strategic partnerships with universities, research institutions, and academic publishers to expand NeuroNova\'s content and reach.',
    requirements: [
      'Bachelor\'s degree in Business, Science, or related field',
      '3+ years of partnership or business development experience',
      'Understanding of academic research ecosystem',
      'Strong relationship building and negotiation skills',
      'Experience with contract negotiation and management',
      'Excellent communication and presentation skills'
    ],
    responsibilities: [
      'Identify and develop strategic academic partnerships',
      'Negotiate content licensing and data access agreements',
      'Build relationships with university research offices',
      'Represent NeuroNova at academic conferences and events',
      'Collaborate with product team on partnership integrations',
      'Track and report on partnership metrics and outcomes'
    ],
    benefits: [
      'Base salary plus performance bonuses',
      'Travel budget for conferences and meetings',
      'Professional development opportunities',
      'Networking event attendance support',
      'Comprehensive benefits package',
      'Career growth and advancement opportunities'
    ],
    salary_range: '$90,000 - $120,000',
    posted_date: '2024-01-18',
    remote_ok: false,
    status: 'active'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const remote = searchParams.get('remote');

    // Get jobs from admin system, fallback to static jobs
    const availableJobs = getActiveJobs().length > 0 ? getActiveJobs() : STATIC_JOBS;
    let filteredJobs = availableJobs.filter(job => job.status === 'active');

    // Apply filters
    if (department) {
      filteredJobs = filteredJobs.filter(job => 
        job.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    if (level) {
      filteredJobs = filteredJobs.filter(job => job.level === level);
    }

    if (remote === 'true') {
      filteredJobs = filteredJobs.filter(job => job.remote_ok);
    }

          return NextResponse.json({
        success: true,
        jobs: filteredJobs,
        total: filteredJobs.length,
        filters: {
          departments: [...new Set(availableJobs.map(job => job.department))],
          locations: [...new Set(availableJobs.map(job => job.location))],
          types: [...new Set(availableJobs.map(job => job.type))],
          levels: [...new Set(availableJobs.map(job => job.level))]
        }
      });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, applicantData } = body;

    // In a real application, this would save to database
    console.log('Job application received:', { jobId, applicantData });

    // Simulate processing
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 
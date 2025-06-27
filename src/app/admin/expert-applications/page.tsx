'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Building,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface ExpertApplication {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  specialization: string;
  institution: string;
  location: string;
  bio: string;
  expertise: string;
  publications: number;
  citations: number;
  hIndex: number;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    orcid?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ExpertApplicationsPage() {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<ExpertApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/expert-applications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      if (data.success) {
        setApplications(data.data.applications);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdating(applicationId);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('/api/admin/expert-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          status,
          adminNotes: adminNotes.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh the applications list
        await fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
        setAdminNotes('');
        alert(`Application ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    } finally {
      setUpdating(null);
    }
  };

  // Handle search and filter changes
  const handleSearch = () => {
    setCurrentPage(1);
    fetchApplications();
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchApplications();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchApplications();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expert Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage expert applications from users
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, specialization, or institution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No applications found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {application.userName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {application.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {application.specialization}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {application.institution}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {application.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(application.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Expert Application Details
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApplication(null);
                    setAdminNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Applicant Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Applicant Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-medium">{selectedApplication.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium">{selectedApplication.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Specialization</h4>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {selectedApplication.specialization}
                  </p>
                </div>

                {/* Institution & Location */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Institution & Location</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedApplication.institution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedApplication.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bio</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.bio}</p>
                </div>

                {/* Expertise */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedApplication.expertise) ? selectedApplication.expertise : selectedApplication.expertise.split(',')).map((exp, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Research Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Publications</span>
                      </div>
                      <p className="text-lg font-medium">{selectedApplication.publications}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Citations</span>
                      </div>
                      <p className="text-lg font-medium">{selectedApplication.citations}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">h-index</span>
                      </div>
                      <p className="text-lg font-medium">{selectedApplication.hIndex}</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(selectedApplication.socialLinks.linkedin || selectedApplication.socialLinks.twitter || selectedApplication.socialLinks.orcid) && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Social Links</h4>
                    <div className="space-y-1">
                      {selectedApplication.socialLinks.linkedin && (
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">LinkedIn:</span>{' '}
                          <a href={selectedApplication.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedApplication.socialLinks.linkedin}
                          </a>
                        </p>
                      )}
                      {selectedApplication.socialLinks.twitter && (
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Twitter:</span>{' '}
                          <a href={selectedApplication.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedApplication.socialLinks.twitter}
                          </a>
                        </p>
                      )}
                      {selectedApplication.socialLinks.orcid && (
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">ORCID:</span>{' '}
                          <a href={selectedApplication.socialLinks.orcid} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedApplication.socialLinks.orcid}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Application Date */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Application Details</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Submitted on {formatDate(selectedApplication.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedApplication.status === 'pending' && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Admin Notes (Optional)</h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about your decision..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>
                )}

                {/* Existing Admin Notes */}
                {selectedApplication.adminNotes && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Previous Admin Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.adminNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                    disabled={updating === selectedApplication._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {updating === selectedApplication._id ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'approved')}
                    disabled={updating === selectedApplication._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {updating === selectedApplication._id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ResearchFilters {
  categories?: string[];
  sources?: string[];
  sortBy?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ResearchStats {
  totalArticles: number;
  publishedArticles: number;
  categoriesCount: number;
  recentArticles: number;
}

export interface ResearchArticle {
  _id: string;
  title: string;
  abstract: string;
  authors: {
    name: string;
    affiliation?: string;
  }[];
  categories: string[];
  tags: string[];
  source: {
    name: string;
    url: string;
    type: 'journal' | 'preprint' | 'conference' | 'patent';
  };
  doi?: string;
  publicationDate: string;
  citationCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number;
  status: 'published' | 'preprint' | 'under-review';
  keywords: string[];
  metrics: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
  likeCount?: number;
  shareCount?: number;
}

export interface ResearchResponse {
  success: boolean;
  data: ResearchArticle[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: any;
}

class ResearchService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getResearch(filters: ResearchFilters = {}): Promise<ResearchResponse> {
    const params = new URLSearchParams();
    
    if (filters.categories?.length) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.sources?.length) {
      params.append('sources', filters.sources.join(','));
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const url = `${API_BASE_URL}/research?${params.toString()}`;
    return this.fetchWithErrorHandling(url);
  }

  async searchResearch(query: string, filters: ResearchFilters = {}): Promise<ResearchResponse> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.categories?.length) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.sources?.length) {
      params.append('sources', filters.sources.join(','));
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const url = `${API_BASE_URL}/research/search?${params.toString()}`;
    return this.fetchWithErrorHandling(url);
  }

  async getResearchStats(): Promise<{ success: boolean; data: ResearchStats }> {
    const url = `${API_BASE_URL}/research/stats`;
    return this.fetchWithErrorHandling(url);
  }

  async getTrendingResearch(limit: number = 10): Promise<ResearchResponse> {
    const url = `${API_BASE_URL}/research/trending?limit=${limit}`;
    return this.fetchWithErrorHandling(url);
  }

  async getResearchCategories(): Promise<{ success: boolean; data: string[] }> {
    const url = `${API_BASE_URL}/research/categories`;
    return this.fetchWithErrorHandling(url);
  }

  async getResearchById(id: string): Promise<{ success: boolean; data: ResearchArticle }> {
    const url = `${API_BASE_URL}/research/${id}`;
    return this.fetchWithErrorHandling(url);
  }

  async bookmarkResearch(id: string, token: string): Promise<{ success: boolean; message: string }> {
    const url = `${API_BASE_URL}/research/${id}/bookmark`;
    return this.fetchWithErrorHandling(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const researchService = new ResearchService();
export default researchService;
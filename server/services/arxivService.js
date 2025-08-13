const axios = require('axios');
const xml2js = require('xml2js');

class ArxivService {
  constructor() {
    this.baseURL = 'http://export.arxiv.org/api/query';
  }

  /**
   * Search arXiv for papers
   * @param {string} query - Search query
   * @param {number} maxResults - Maximum number of results (default: 20)
   * @param {string} sortBy - Sort order (default: 'relevance')
   */
  async searchPapers(query, maxResults = 20, sortBy = 'relevance') {
    try {
      console.log(`🔍 Searching arXiv for: "${query}"`);

      const params = {
        search_query: this.buildSearchQuery(query),
        start: 0,
        max_results: maxResults,
        sortBy: sortBy === 'newest' ? 'submittedDate' : 'relevance',
        sortOrder: 'descending'
      };

      const response = await axios.get(this.baseURL, {
        params,
        timeout: 10000,
        headers: {
          'User-Agent': 'Neuronova-Research-Platform/1.0'
        }
      });

      const papers = await this.parseXMLResponse(response.data);
      console.log(`✅ Successfully processed ${papers.length} arXiv papers`);
      
      return papers;

    } catch (error) {
      console.error('❌ arXiv API Error:', error.message);
      return [];
    }
  }

  /**
   * Build search query for arXiv API
   */
  buildSearchQuery(query) {
    // Focus on relevant categories for our platform
    const relevantCategories = [
      'q-bio', // Quantitative Biology
      'cs.AI', // Artificial Intelligence
      'cs.LG', // Machine Learning
      'cs.HC', // Human-Computer Interaction
      'cs.CY', // Computers and Society
      'eess.SP', // Signal Processing
      'stat.ML' // Machine Learning (Statistics)
    ];

    // Enhance query with relevant categories
    const categoryQuery = relevantCategories.map(cat => `cat:${cat}`).join(' OR ');
    
    // Combine text search with category filter
    return `(all:${query}) AND (${categoryQuery})`;
  }

  /**
   * Parse arXiv XML response
   */
  async parseXMLResponse(xmlData) {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      normalize: true,
      normalizeTags: true,
      trim: true
    });

    try {
      const result = await parser.parseStringPromise(xmlData);
      const entries = result.feed?.entry || [];
      
      // Handle single entry case
      const entryArray = Array.isArray(entries) ? entries : [entries];
      
      const papers = entryArray.map(entry => this.formatArxivEntry(entry)).filter(Boolean);
      
      return papers;
    } catch (error) {
      console.error('❌ arXiv XML Parsing Error:', error.message);
      return [];
    }
  }

  /**
   * Format arXiv entry to our article format
   */
  formatArxivEntry(entry) {
    try {
      if (!entry || !entry.title) return null;

      // Extract arXiv ID from the entry ID
      const arxivId = entry.id?.split('/abs/')?.[1] || entry.id;
      
      // Extract authors
      const authorData = entry.author || [];
      const authorArray = Array.isArray(authorData) ? authorData : [authorData];
      const authors = authorArray.map(author => ({
        name: author.name || 'Unknown Author',
        affiliation: author.affiliation || ''
      }));

      // Extract categories
      const categories = this.extractCategories(entry);
      
      // Extract publication date
      const publishedDate = entry.published ? new Date(entry.published) : new Date();
      
      // Create formatted article
      const formattedArticle = {
        _id: `arxiv_${arxivId}`,
        title: entry.title,
        abstract: entry.summary || 'No abstract available',
        authors: authors,
        categories: categories,
        tags: this.extractTags(entry.title, entry.summary),
        keywords: this.extractKeywords(entry.title, entry.summary),
        source: {
          name: 'arXiv',
          url: `https://arxiv.org/abs/${arxivId}`,
          type: 'preprint'
        },
        doi: entry.doi || null,
        arxivId: arxivId,
        publicationDate: publishedDate,
        citationCount: Math.floor(Math.random() * 50), // Placeholder
        viewCount: Math.floor(Math.random() * 500),
        bookmarkCount: Math.floor(Math.random() * 25),
        trendingScore: Math.random() * 8, // Preprints generally have lower trending scores
        status: 'preprint',
        language: 'en',
        metrics: {
          impactScore: Math.random() * 8,
          readabilityScore: Math.random() * 10,
          noveltyScore: Math.random() * 9 // Preprints often have high novelty
        },
        externalSource: 'arxiv',
        primaryCategory: entry.primary_category?.term || 'unknown',
        allCategories: this.extractAllCategories(entry)
      };

      return formattedArticle;
    } catch (error) {
      console.error('❌ Error formatting arXiv entry:', error.message);
      return null;
    }
  }

  /**
   * Extract and map arXiv categories to our system
   */
  extractCategories(entry) {
    const arxivCategories = this.extractAllCategories(entry);
    const mappedCategories = [];

    const categoryMap = {
      'ai': ['cs.ai', 'cs.lg', 'stat.ml'],
      'neuroscience': ['q-bio.nc', 'cs.hc'],
      'biotech': ['q-bio.bm', 'q-bio.gn', 'q-bio.mn'],
      'healthcare': ['q-bio.to', 'q-bio.pe', 'cs.cy'],
      'medical-devices': ['eess.sp', 'cs.hc'],
      'brain-computer-interface': ['cs.hc', 'eess.sp', 'q-bio.nc']
    };

    for (const [ourCategory, arxivCats] of Object.entries(categoryMap)) {
      if (arxivCats.some(cat => arxivCategories.includes(cat.toLowerCase()))) {
        mappedCategories.push(ourCategory);
      }
    }

    return mappedCategories.length > 0 ? mappedCategories : ['ai']; // Default for arXiv
  }

  /**
   * Extract all arXiv categories from entry
   */
  extractAllCategories(entry) {
    const categories = [];
    
    // Primary category
    if (entry.primary_category?.term) {
      categories.push(entry.primary_category.term.toLowerCase());
    }
    
    // Additional categories
    const categoryData = entry.category || [];
    const categoryArray = Array.isArray(categoryData) ? categoryData : [categoryData];
    
    categoryArray.forEach(cat => {
      if (cat.term) {
        categories.push(cat.term.toLowerCase());
      }
    });

    return [...new Set(categories)]; // Remove duplicates
  }

  /**
   * Extract tags from title and abstract
   */
  extractTags(title, abstract) {
    const text = `${title} ${abstract || ''}`.toLowerCase();
    const commonTags = [
      'machine learning', 'deep learning', 'neural networks', 'artificial intelligence',
      'computer vision', 'natural language processing', 'reinforcement learning',
      'biomedical', 'healthcare', 'medical imaging', 'bioinformatics',
      'signal processing', 'data analysis', 'algorithm', 'optimization'
    ];

    return commonTags.filter(tag => text.includes(tag)).slice(0, 5);
  }

  /**
   * Extract keywords from title and abstract
   */
  extractKeywords(title, abstract) {
    const text = `${title} ${abstract || ''}`;
    
    // Simple keyword extraction - in production, you'd use NLP
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'will', 'would', 'could', 'should'].includes(word));

    // Get most frequent words
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Get recent papers in specific categories
   */
  async getRecentPapers(categories = ['cs.AI', 'cs.LG', 'q-bio'], maxResults = 20) {
    try {
      const categoryQuery = categories.map(cat => `cat:${cat}`).join(' OR ');
      
      const params = {
        search_query: categoryQuery,
        start: 0,
        max_results: maxResults,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      };

      const response = await axios.get(this.baseURL, {
        params,
        timeout: 10000
      });

      return await this.parseXMLResponse(response.data);
    } catch (error) {
      console.error('❌ Error fetching recent arXiv papers:', error.message);
      return [];
    }
  }
}

module.exports = ArxivService;
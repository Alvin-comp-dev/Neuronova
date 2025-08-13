class SemanticSearchService {
  constructor() {
    // Simple semantic search using keyword expansion and synonyms
    this.synonymMap = {
      'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural networks'],
      'brain': ['neural', 'cerebral', 'neurological', 'cognitive', 'cortical'],
      'gene': ['genetic', 'genomic', 'dna', 'rna', 'hereditary'],
      'drug': ['pharmaceutical', 'medicine', 'therapy', 'treatment', 'medication'],
      'cancer': ['tumor', 'oncology', 'malignant', 'carcinoma', 'neoplasm'],
      'heart': ['cardiac', 'cardiovascular', 'coronary', 'myocardial'],
      'diabetes': ['diabetic', 'glucose', 'insulin', 'glycemic'],
      'covid': ['coronavirus', 'sars-cov-2', 'pandemic', 'viral infection'],
      'alzheimer': ['dementia', 'cognitive decline', 'neurodegenerative'],
      'stem cell': ['regenerative medicine', 'cell therapy', 'tissue engineering']
    };

    this.conceptMap = {
      'neuroscience': ['brain', 'neural', 'cognitive', 'neuron', 'synapse', 'cortex'],
      'biotechnology': ['gene', 'protein', 'enzyme', 'bioengineering', 'synthetic biology'],
      'medical imaging': ['mri', 'ct scan', 'ultrasound', 'x-ray', 'pet scan'],
      'clinical trial': ['randomized', 'placebo', 'double-blind', 'efficacy', 'safety'],
      'machine learning': ['algorithm', 'neural network', 'deep learning', 'classification']
    };
  }

  /**
   * Expand search query with semantic synonyms and related terms
   */
  expandQuery(originalQuery) {
    if (!originalQuery || typeof originalQuery !== 'string') {
      return originalQuery;
    }

    const query = originalQuery.toLowerCase();
    const expandedTerms = new Set([originalQuery]);

    // Add synonyms for each word in the query
    for (const [term, synonyms] of Object.entries(this.synonymMap)) {
      if (query.includes(term)) {
        synonyms.forEach(synonym => expandedTerms.add(synonym));
      }
    }

    // Add concept-related terms
    for (const [concept, relatedTerms] of Object.entries(this.conceptMap)) {
      if (query.includes(concept)) {
        relatedTerms.forEach(term => expandedTerms.add(term));
      }
    }

    return Array.from(expandedTerms);
  }

  /**
   * Calculate semantic similarity score between query and article
   */
  calculateSimilarityScore(query, article) {
    if (!query || !article) return 0;

    const queryTerms = this.expandQuery(query.toLowerCase());
    const articleText = `${article.title} ${article.abstract} ${article.keywords?.join(' ') || ''}`.toLowerCase();
    
    let score = 0;
    let matches = 0;

    queryTerms.forEach(term => {
      if (articleText.includes(term.toLowerCase())) {
        matches++;
        // Weight title matches higher
        if (article.title.toLowerCase().includes(term.toLowerCase())) {
          score += 3;
        }
        // Weight abstract matches
        if (article.abstract?.toLowerCase().includes(term.toLowerCase())) {
          score += 2;
        }
        // Weight keyword matches
        if (article.keywords?.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))) {
          score += 1;
        }
      }
    });

    // Normalize score by query length and add match ratio
    const matchRatio = matches / queryTerms.length;
    return (score * matchRatio) / queryTerms.length;
  }

  /**
   * Enhance search results with semantic scoring
   */
  enhanceSearchResults(query, articles) {
    if (!query || !articles || articles.length === 0) {
      return articles;
    }

    // Calculate semantic scores for each article
    const scoredArticles = articles.map(article => ({
      ...article,
      semanticScore: this.calculateSimilarityScore(query, article)
    }));

    // Sort by semantic score (descending) and then by original relevance
    return scoredArticles.sort((a, b) => {
      if (Math.abs(a.semanticScore - b.semanticScore) < 0.1) {
        // If semantic scores are close, use other factors
        return (b.trendingScore || 0) - (a.trendingScore || 0);
      }
      return b.semanticScore - a.semanticScore;
    });
  }

  /**
   * Generate search suggestions based on query
   */
  generateSearchSuggestions(query) {
    if (!query || query.length < 2) return [];

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    // Add exact matches from synonym map
    for (const [term, synonyms] of Object.entries(this.synonymMap)) {
      if (term.includes(queryLower) || queryLower.includes(term)) {
        suggestions.add(term);
        synonyms.forEach(synonym => {
          if (synonym.includes(queryLower) || queryLower.includes(synonym)) {
            suggestions.add(synonym);
          }
        });
      }
    }

    // Add concept matches
    for (const [concept, relatedTerms] of Object.entries(this.conceptMap)) {
      if (concept.includes(queryLower) || queryLower.includes(concept)) {
        suggestions.add(concept);
        relatedTerms.forEach(term => {
          if (term.includes(queryLower)) {
            suggestions.add(term);
          }
        });
      }
    }

    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Extract key concepts from text
   */
  extractConcepts(text) {
    if (!text) return [];

    const textLower = text.toLowerCase();
    const concepts = [];

    // Find matching concepts
    for (const [concept, relatedTerms] of Object.entries(this.conceptMap)) {
      const conceptScore = relatedTerms.reduce((score, term) => {
        return score + (textLower.includes(term) ? 1 : 0);
      }, 0);

      if (conceptScore > 0) {
        concepts.push({
          concept,
          relevance: conceptScore / relatedTerms.length,
          matchingTerms: relatedTerms.filter(term => textLower.includes(term))
        });
      }
    }

    return concepts.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Find similar articles based on content
   */
  findSimilarArticles(targetArticle, candidateArticles, limit = 5) {
    if (!targetArticle || !candidateArticles || candidateArticles.length === 0) {
      return [];
    }

    const targetText = `${targetArticle.title} ${targetArticle.abstract}`;
    const targetConcepts = this.extractConcepts(targetText);

    const similarArticles = candidateArticles
      .filter(article => article._id !== targetArticle._id)
      .map(article => {
        const articleText = `${article.title} ${article.abstract}`;
        const articleConcepts = this.extractConcepts(articleText);

        // Calculate concept overlap
        let conceptSimilarity = 0;
        targetConcepts.forEach(targetConcept => {
          const matchingConcept = articleConcepts.find(c => c.concept === targetConcept.concept);
          if (matchingConcept) {
            conceptSimilarity += Math.min(targetConcept.relevance, matchingConcept.relevance);
          }
        });

        // Calculate category overlap
        const categoryOverlap = targetArticle.categories?.filter(cat => 
          article.categories?.includes(cat)
        ).length || 0;

        const totalSimilarity = conceptSimilarity + (categoryOverlap * 0.3);

        return {
          ...article,
          similarityScore: totalSimilarity
        };
      })
      .filter(article => article.similarityScore > 0.1)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return similarArticles;
  }
}

module.exports = SemanticSearchService;
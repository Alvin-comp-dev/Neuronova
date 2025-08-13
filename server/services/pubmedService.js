const axios = require('axios');

class PubMedService {
  constructor() {
    this.baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
    this.apiKey = process.env.PUBMED_API_KEY; // Optional but recommended
  }

  /**
   * Search PubMed for articles
   * @param {string} query - Search query
   * @param {number} maxResults - Maximum number of results (default: 20)
   * @param {string} sort - Sort order (default: 'relevance')
   */
  async searchArticles(query, maxResults = 20, sort = 'relevance') {
    try {
      console.log(`🔍 Searching PubMed for: "${query}"`);
      
      // Step 1: Search for PMIDs
      const searchParams = {
        db: 'pubmed',
        term: query,
        retmax: maxResults,
        sort: sort,
        retmode: 'json'
      };

      if (this.apiKey) {
        searchParams.api_key = this.apiKey;
      }

      const searchResponse = await axios.get(`${this.baseURL}/esearch.fcgi`, {
        params: searchParams,
        timeout: 10000
      });

      const pmids = searchResponse.data.esearchresult.idlist;
      
      if (!pmids || pmids.length === 0) {
        return [];
      }

      console.log(`📚 Found ${pmids.length} PubMed articles`);

      // Step 2: Fetch detailed information for PMIDs
      const detailParams = {
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'xml',
        rettype: 'abstract'
      };

      if (this.apiKey) {
        detailParams.api_key = this.apiKey;
      }

      const detailResponse = await axios.get(`${this.baseURL}/efetch.fcgi`, {
        params: detailParams,
        timeout: 15000
      });

      // Step 3: Parse XML and convert to our format
      const articles = await this.parseXMLToArticles(detailResponse.data, pmids);
      
      console.log(`✅ Successfully processed ${articles.length} PubMed articles`);
      return articles;

    } catch (error) {
      console.error('❌ PubMed API Error:', error.message);
      return [];
    }
  }

  /**
   * Parse PubMed XML response to our article format
   */
  async parseXMLToArticles(xmlData, pmids) {
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser();
    
    try {
      const result = await parser.parseStringPromise(xmlData);
      const articles = [];
      
      const pubmedArticles = result.PubmedArticleSet?.PubmedArticle || [];
      
      for (let i = 0; i < pubmedArticles.length; i++) {
        const article = pubmedArticles[i];
        const medlineCitation = article.MedlineCitation?.[0];
        const pubmedData = article.PubmedData?.[0];
        
        if (!medlineCitation) continue;

        const articleData = medlineCitation.Article?.[0];
        if (!articleData) continue;

        // Extract basic information
        const title = articleData.ArticleTitle?.[0] || 'No title available';
        const abstract = articleData.Abstract?.[0]?.AbstractText?.[0] || 'No abstract available';
        
        // Extract authors
        const authorList = articleData.AuthorList?.[0]?.Author || [];
        const authors = authorList.map(author => ({
          name: `${author.ForeName?.[0] || ''} ${author.LastName?.[0] || ''}`.trim(),
          affiliation: author.AffiliationInfo?.[0]?.Affiliation?.[0] || ''
        })).filter(author => author.name);

        // Extract publication date
        const pubDate = articleData.Journal?.[0]?.JournalIssue?.[0]?.PubDate?.[0];
        const year = pubDate?.Year?.[0] || new Date().getFullYear();
        const month = pubDate?.Month?.[0] || '01';
        const day = pubDate?.Day?.[0] || '01';
        
        // Extract journal info
        const journal = articleData.Journal?.[0];
        const journalTitle = journal?.Title?.[0] || 'Unknown Journal';
        
        // Extract keywords/MeSH terms
        const meshHeadings = medlineCitation.MeshHeadingList?.[0]?.MeshHeading || [];
        const keywords = meshHeadings.map(mesh => 
          mesh.DescriptorName?.[0]?._ || mesh.DescriptorName?.[0]
        ).filter(Boolean);

        // Create article in our format
        const formattedArticle = {
          _id: `pubmed_${pmids[i]}`,
          title: title,
          abstract: abstract,
          authors: authors,
          categories: this.extractCategories(keywords, abstract, title),
          tags: keywords.slice(0, 5), // First 5 keywords as tags
          keywords: keywords,
          source: {
            name: journalTitle,
            url: `https://pubmed.ncbi.nlm.nih.gov/${pmids[i]}/`,
            type: 'journal'
          },
          doi: this.extractDOI(pubmedData),
          pmid: pmids[i],
          publicationDate: new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`),
          citationCount: Math.floor(Math.random() * 100), // Placeholder - would need separate API
          viewCount: Math.floor(Math.random() * 1000),
          bookmarkCount: Math.floor(Math.random() * 50),
          trendingScore: Math.random() * 10,
          status: 'published',
          language: 'en',
          metrics: {
            impactScore: Math.random() * 10,
            readabilityScore: Math.random() * 10,
            noveltyScore: Math.random() * 10
          },
          externalSource: 'pubmed'
        };

        articles.push(formattedArticle);
      }

      return articles;
    } catch (error) {
      console.error('❌ XML Parsing Error:', error.message);
      return [];
    }
  }

  /**
   * Extract DOI from PubMed data
   */
  extractDOI(pubmedData) {
    try {
      const articleIds = pubmedData?.ArticleIdList?.[0]?.ArticleId || [];
      const doiId = articleIds.find(id => id.$.IdType === 'doi');
      return doiId?._ || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Map keywords and content to our categories
   */
  extractCategories(keywords, abstract, title) {
    const categoryMap = {
      'neuroscience': ['neuroscience', 'brain', 'neural', 'neuron', 'cognitive', 'neurological'],
      'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'algorithm'],
      'genetics': ['gene', 'genetic', 'dna', 'rna', 'genome', 'crispr', 'mutation'],
      'pharmaceuticals': ['drug', 'pharmaceutical', 'medicine', 'therapy', 'treatment', 'clinical trial'],
      'biotech': ['biotechnology', 'bioengineering', 'synthetic biology', 'protein', 'enzyme'],
      'healthcare': ['health', 'medical', 'clinical', 'patient', 'diagnosis', 'disease'],
      'medical-devices': ['device', 'implant', 'prosthetic', 'sensor', 'monitoring'],
      'brain-computer-interface': ['brain-computer', 'bci', 'neural interface', 'neuroprosthetic']
    };

    const content = `${title} ${abstract} ${keywords.join(' ')}`.toLowerCase();
    const categories = [];

    for (const [category, terms] of Object.entries(categoryMap)) {
      if (terms.some(term => content.includes(term.toLowerCase()))) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['healthcare']; // Default category
  }

  /**
   * Get trending topics from PubMed
   */
  async getTrendingTopics(limit = 10) {
    const trendingQueries = [
      'artificial intelligence medicine',
      'CRISPR gene editing',
      'brain computer interface',
      'machine learning healthcare',
      'neural networks medical',
      'gene therapy clinical trial',
      'biomarkers diagnosis',
      'precision medicine',
      'immunotherapy cancer',
      'stem cell therapy'
    ];

    try {
      const results = [];
      for (const query of trendingQueries.slice(0, limit)) {
        const articles = await this.searchArticles(query, 3);
        if (articles.length > 0) {
          results.push({
            topic: query,
            articleCount: articles.length,
            recentArticles: articles
          });
        }
      }
      return results;
    } catch (error) {
      console.error('❌ Error fetching trending topics:', error.message);
      return [];
    }
  }
}

module.exports = PubMedService;
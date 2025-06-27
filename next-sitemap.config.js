/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronova.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/auth/*',
    '/admin/*',
    '/profile/*',
    '/server-sitemap.xml',
  ],
  additionalPaths: async (config) => {
    const result = [];

    // Add dynamic routes for research articles
    // In a real implementation, you'd fetch these from your database
    const researchArticles = [
      'neural-networks-breakthrough',
      'brain-computer-interfaces',
      'neurodegenerative-diseases',
      'cognitive-enhancement',
      'neuroplasticity-research',
    ];

    researchArticles.forEach((slug) => {
      result.push({
        loc: `/research/${slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    // Add expert profiles
    const expertProfiles = [
      'dr-sarah-johnson',
      'prof-michael-chen',
      'dr-emily-rodriguez',
      'prof-david-kim',
      'dr-lisa-thompson',
    ];

    expertProfiles.forEach((slug) => {
      result.push({
        loc: `/experts/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/admin/',
          '/profile/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronova.com'}/server-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform function to modify sitemap entries
    const priority = getPriorityForPath(path);
    const changefreq = getChangefreqForPath(path);

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

function getPriorityForPath(path) {
  if (path === '/') return 1.0;
  if (path.startsWith('/research')) return 0.9;
  if (path.startsWith('/experts')) return 0.8;
  if (path.startsWith('/community')) return 0.7;
  if (path.startsWith('/trending')) return 0.8;
  if (path.startsWith('/analytics')) return 0.6;
  if (path.startsWith('/search')) return 0.7;
  return 0.5;
}

function getChangefreqForPath(path) {
  if (path === '/') return 'daily';
  if (path.startsWith('/research')) return 'daily';
  if (path.startsWith('/experts')) return 'weekly';
  if (path.startsWith('/community')) return 'daily';
  if (path.startsWith('/trending')) return 'hourly';
  if (path.startsWith('/analytics')) return 'weekly';
  if (path.startsWith('/search')) return 'weekly';
  return 'monthly';
} 
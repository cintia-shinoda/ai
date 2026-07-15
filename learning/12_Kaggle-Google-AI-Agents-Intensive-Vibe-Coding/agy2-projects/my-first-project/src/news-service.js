import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['source'],
  }
});

/**
 * Parses raw article titles to extract clean title and source name.
 * Google News titles are usually formatted as "Article Title - Source Name".
 * @param {string} rawTitle 
 * @returns {{ title: string, source: string }}
 */
export function parseTitle(rawTitle) {
  if (!rawTitle) return { title: 'No Title', source: 'Unknown' };
  
  const lastDashIndex = rawTitle.lastIndexOf(' - ');
  if (lastDashIndex !== -1) {
    const title = rawTitle.substring(0, lastDashIndex).trim();
    const source = rawTitle.substring(lastDashIndex + 3).trim();
    return { title, source };
  }
  
  return { title: rawTitle, source: 'Unknown' };
}

/**
 * Fetches and parses Google News RSS feed based on options.
 * @param {object} options 
 * @param {string} [options.search] - Search keyword
 * @param {string} [options.topic] - Topic code (e.g. 'TECHNOLOGY')
 * @param {string} [options.language='en'] - Host language (hl)
 * @param {string} [options.country='US'] - Geolocation country (gl)
 * @param {number} [options.limit=10] - Number of items to return
 * @returns {Promise<object>} Parsed feed containing array of articles
 */
export async function fetchGoogleNews(options = {}) {
  const {
    search,
    topic,
    language = 'en',
    country = 'US',
    limit = 10
  } = options;

  let baseUrl = 'https://news.google.com/rss';

  if (search) {
    baseUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(search)}`;
  } else if (topic) {
    baseUrl = `https://news.google.com/rss/headlines/section/topic/${topic.toUpperCase()}`;
  }

  // Construct query parameters
  const queryParams = new URLSearchParams({
    hl: language.toLowerCase() === 'en' && country.toUpperCase() === 'US' ? 'en-US' : language,
    gl: country.toUpperCase(),
    ceid: `${country.toUpperCase()}:${language.toLowerCase()}`
  });

  const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryParams.toString()}`;

  try {
    const parsedFeed = await parser.parseURL(url);
    
    const items = (parsedFeed.items || [])
      .slice(0, limit)
      .map(item => {
        const { title, source } = parseTitle(item.title);
        return {
          title,
          source: item.source && item.source._ ? item.source._ : source,
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : null,
          rawDate: item.pubDate,
          guid: item.guid
        };
      });

    return {
      title: parsedFeed.title,
      description: parsedFeed.description,
      link: parsedFeed.link,
      items
    };
  } catch (error) {
    throw new Error(`Failed to fetch Google News feed from ${url}: ${error.message}`);
  }
}

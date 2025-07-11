const { parse } = require('@postlight/parser');
const cheerio = require('cheerio');

async function scrapeArticle(url) {
  try {
    // Use the parser to extract article content
    const result = await parse(url);

    // Parse the HTML content to plain text if available
    const plainTextContent = result.content ? cheerio.load(result.content).text() : '';

    return {
      url,
      title: result.title || 'No title found',
      author: result.author || 'N/A',
      content: plainTextContent.trim(),
      publishedDate: result.date_published ? new Date(result.date_published) : new Date(),
      source: result.domain || new URL(url).hostname.replace('www.', ''),
      snippet: (result.excerpt || (plainTextContent.slice(0, 250) + '...')).trim()
    };
  } catch (error) {
    console.error(`Error scraping article from ${url}:`, error);
    throw new Error(`Failed to parse article content: ${error.message}`);
  }
}

module.exports = { scrapeArticle };

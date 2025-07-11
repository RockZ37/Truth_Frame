const axios = require('axios');

/**
 * Check claims in article content using Google Fact Check Tools API
 * @param {string} text - The text content to fact-check
 * @returns {Promise<Array>} - Array of fact-check results
 */
async function checkFacts(text) {
  try {
    const API_KEY = process.env.GOOGLE_FACTCHECK_API_KEY;
    if (!API_KEY) {
      console.warn('Google FactCheck API key not configured');
      return [];
    }

    // Extract key sentences that might contain claims
    const sentences = extractClaimSentences(text);
    const results = [];

    // Check each potential claim
    for (const sentence of sentences) {
      try {
        const response = await axios.get(
          'https://factchecktools.googleapis.com/v1alpha1/claims:search',
          {
            params: {
              key: API_KEY,
              query: sentence,
              languageCode: 'en',
              pageSize: 3,
            },
          }
        );

        if (response.data?.claims?.length > 0) {
          results.push({
            originalText: sentence,
            claims: response.data.claims.map(claim => ({
              text: claim.text,
              claimant: claim.claimant,
              claimDate: claim.claimDate,
              claimReview: claim.claimReview,
              rating: claim.claimReview?.[0]?.textualRating || 'No rating',
              url: claim.claimReview?.[0]?.url,
            })),
          });
        }
      } catch (error) {
        console.error('Error checking fact:', error.message);
      }
    }

    return results;
  } catch (error) {
    console.error('Fact-checking failed:', error);
    return [];
  }
}

/**
 * Extract potential claim sentences from text
 * @param {string} text - The text to analyze
 * @returns {Array<string>} - Array of potential claim sentences
 */
function extractClaimSentences(text) {
  // Simple implementation - could be enhanced with NLP
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences
    .filter(s => s.split(' ').length > 5) // Filter out very short sentences
    .slice(0, 5); // Limit to top 5 sentences for performance
}

module.exports = {
  checkFacts,
};

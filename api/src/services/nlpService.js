const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

// Initialize the Watson NLU client
const nlu = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_API_KEY || '',
  }),
  serviceUrl: process.env.IBM_WATSON_URL || '',
});

/**
 * Analyze article content using IBM Watson Natural Language Understanding
 * @param {string} text - The article content to analyze
 * @returns {Promise<Object>} - Analysis results including sentiment, entities, and keywords
 */
async function analyzeArticleContent(text) {
  try {
    const analysis = await nlu.analyze({
      text,
      features: {
        sentiment: {},
        entities: {
          sentiment: true,
          limit: 10,
        },
        keywords: {
          sentiment: true,
          emotion: true,
          limit: 10,
        },
        categories: {},
      },
    });

    return {
      success: true,
      data: analysis.result,
    };
  } catch (error) {
    console.error('Error analyzing article with Watson NLU:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze article content',
    };
  }
}

/**
 * Process article analysis results into our standard format
 * @param {Object} watsonResults - Raw results from Watson NLU
 * @returns {Object} - Formatted analysis results
 */
function formatAnalysisResults(watsonResults) {
  if (!watsonResults || !watsonResults.data) {
    return null;
  }

  const { sentiment, entities, keywords, categories } = watsonResults.data;

  // Extract key entities and their sentiment
  const keyEntities = entities?.map(entity => ({
    name: entity.text,
    type: entity.type,
    relevance: entity.relevance,
    sentiment: entity.sentiment?.score || 0,
  })) || [];

  // Process keywords with sentiment and emotion
  const processedKeywords = keywords?.map(keyword => ({
    text: keyword.text,
    relevance: keyword.relevance,
    sentiment: keyword.sentiment?.score || 0,
    emotion: keyword.emotion,
  })) || [];

  // Get main categories
  const themes = categories?.map(category => ({
    label: category.label,
    score: category.score,
  })) || [];

  return {
    sentiment: {
      score: sentiment?.document?.score || 0,
      label: sentiment?.document?.label || 'neutral',
    },
    entities: keyEntities,
    keywords: processedKeywords,
    themes,
  };
}

module.exports = {
  analyzeArticleContent,
  formatAnalysisResults,
};

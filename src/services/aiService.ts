import { VertexAI } from '@google-cloud/vertexai';

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

if (!projectId) {
  throw new Error('Please define the GOOGLE_CLOUD_PROJECT environment variable');
}

const vertexai = new VertexAI({
  project: projectId,
  location: location,
});

const model = vertexai.preview.getGenerativeModel({
  model: 'gemini-pro',
});

export async function analyzeArticle(content: string) {
  try {
    const prompt = `
      Analyze this news article for:
      1. Political bias (score from -1 to 1, where -1 is far left and 1 is far right)
      2. Sentiment (positive, negative, neutral percentages)
      3. Key themes and topics
      4. Important keywords
      
      Article content:
      ${content}
      
      Provide the analysis in JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textParts = response.candidates?.[0]?.content?.parts?.filter(part => part.text) ?? [];
    const analysisText = textParts.map(part => part.text).join('');
    return JSON.parse(analysisText);
  } catch (error) {
    console.error('Error analyzing article:', error);
    throw error;
  }
}

export async function generateEmbedding(text: string) {
  try {
    const prompt = `Generate a vector embedding for the following text: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textParts = response.candidates?.[0]?.content?.parts?.filter(part => part.text) ?? [];
    const embeddingText = textParts.map(part => part.text).join('');
    return JSON.parse(embeddingText);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
} 
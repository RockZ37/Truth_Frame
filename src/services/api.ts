const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

export async function analyzeArticle(url: string) {
  const response = await fetch(`${API_URL}/functions/v1/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze article');
  }
  
  return response.json();
}

export async function compareArticles(urls: string[]) {
  const queryString = urls.join(',');
  const response = await fetch(`${API_URL}/functions/v1/compare?urls=${queryString}`, {
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to compare articles');
  }
  
  return response.json();
}
import { config } from 'dotenv';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { getRandomUserAgent } from './utils/userAgent';

// Load environment variables
config();

const apiKey = process.env.ECOMMERCE_API_KEY;
if (!apiKey) {
  throw new Error("ECOMMERCE_API_KEY is not defined");
}

const api = rateLimit(axios.create(), {
  maxRequests: 10, // maximum number of requests per minute
  perMilliseconds: 60000 // 1 minute
});

// Function to search products using the E-commerce Search API with pagination
async function searchProducts(query: string, page: number = 1, limit: number = 10) {
  try {
    const userAgent = getRandomUserAgent();
    const response = await axios.get('https://api.alibaba.com/search', {
      params: { q: query, page, limit },
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': userAgent
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error: Received status code ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// Function to fetch all pages of results
async function fetchAllPages(query: string, limit: number = 10) {
  let page = 1;
  let allResults: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const data = await searchProducts(query, page, limit);
    allResults = allResults.concat(data.results);

    if (data.results.length < limit) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allResults;
}

// Example usage
fetchAllPages('sneakers')
  .then(data => console.log('All search results:', data))
  .catch(error => console.error('Error:', error));
import { puppeteerScraper } from '../scrapers/puppeteerScraper';

export async function collectData(url: string) {
  try {
    const data = await puppeteerScraper(url);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Data collector error:", error.message);
      throw error;
    } else {
      console.error("Unknown Data Collector error:", error);
    }
  }
}
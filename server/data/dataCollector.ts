import { puppeteerScraper } from '../scrapers/puppeteerScraper';

export async function collectData(url: string): Promise<void> {
  try {
    await puppeteerScraper(url);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Data collector error:", error.message);
    } else {
      console.error("Unknown Data Collector error:", error);
    }
  }
}
import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// Function to introduce a random delay
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Function to scrape data using Puppeteer
async function scrapeData(url: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Set User-Agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the data
    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', element => element.getAttribute('content'));

    console.log('Title:', title);
    console.log('Description:', description);

    // Introduce a random delay between requests
    await randomDelay(1000, 5000);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Example usage
const url = 'https://example.com';
scrapeData(url);
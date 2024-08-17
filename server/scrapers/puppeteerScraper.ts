import puppeteer from "puppeteer";
import { randomDelay } from "../utils/randomDelay";
import { getRandomUserAgent } from "../utils/userAgent";

export const puppeteerScraper = async (url: string): Promise<void> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    await page.goto(url, { waitUntil: "networkidle2" });

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', (element) => element.getAttribute("content"));

    console.log("Title:", title);
    console.log("Description:", description);

    await randomDelay(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Puppetter scraper error:", error.message);
    } else {
      console.error("Puppetter scraper error:", error);
    }
  } finally {
    await browser.close();
  }
}
import puppeteer from "puppeteer";
import { randomDelay } from "../utils/randomDelay";

export const puppeteerScraper = async (url: string): Promise<void> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    await page.goto(url, { waitUntil: "networkidle2" });

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', (element) => element.getAttribute("content"));

    console.log("Title:", title);
    console.log("Description:", description);

    await randomDelay(1000, 5000);
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
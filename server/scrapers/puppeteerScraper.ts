import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { randomDelay } from "../utils/randomDelay";
import { getRandomUserAgent } from "../utils/userAgent";
import { Data } from "../models/Data";
import mongoose from "mongoose";

puppeteer.use(StealthPlugin());

export const puppeteerScraper = async (url: string): Promise<{ title: string; description: string; url: string; products: { name: string; category: string }[] } | undefined> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    const response = await page.goto(url, { waitUntil: "networkidle2" });

    if (response && response.status() === 404) {
      console.error("Page not found (404):", url);
      return;
    }

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', (element) => element.getAttribute("content") || "");

    // Extract product data
    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-item'));
      return items.map(item => ({
        name: item.querySelector('.product-name')?.textContent || '',
        category: item.querySelector('.product-category')?.textContent || ''
      }));
    });

    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Products:", products);

    await randomDelay(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));

    // Save data to MongoDB
    const data = new Data({
      title,
      description,
      url,
      products
    });
    await data.save();
    console.log("Data saved to MongoDB");

    return { title, description, url, products };

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
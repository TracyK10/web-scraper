import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { randomDelay } from "../utils/randomDelay";
import { getRandomUserAgent } from "../utils/userAgent";
import { Data } from "../models/Data";
import mongoose from "mongoose";

puppeteer.use(StealthPlugin());

export const puppeteerScraper = async (url: string): Promise<{ title: string; description: string; url: string; products: { name: string; category: string }[]; html: string } | undefined> => {
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

    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || "";


    // Extract product data
    const products = $('.product-item').map((_, element) => ({
      name: $(element).find('.product-name').text(),
      category: $(element).find('.product-category').text()
    })).get();

    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Products:", products);
    console.log("HTML:", html);

    await randomDelay(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));

    // Save data to MongoDB
    const data = new Data({
      title,
      description,
      url,
      products,
      html
    });
    await data.save();
    console.log("Data saved to MongoDB");

    return { title, description, url, products, html };

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
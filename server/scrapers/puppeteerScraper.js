"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerScraper = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const randomDelay_1 = require("../utils/randomDelay");
const userAgent_1 = require("../utils/userAgent");
const Data_1 = require("../models/Data");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const puppeteerScraper = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    try {
        const userAgent = (0, userAgent_1.getRandomUserAgent)();
        yield page.setUserAgent(userAgent);
        const response = yield page.goto(url, { waitUntil: "networkidle2" });
        if (response && response.status() === 404) {
            console.error("Page not found (404):", url);
            return;
        }
        const title = yield page.title();
        const description = yield page.$eval('meta[name="description"]', (element) => element.getAttribute("content"));
        console.log("Title:", title);
        console.log("Description:", description);
        yield (0, randomDelay_1.randomDelay)(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));
        // Save data to MongoDB
        const data = new Data_1.Data({
            title,
            description,
            url,
        });
        yield data.save();
        console.log("Data saved to MongoDB");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Puppetter scraper error:", error.message);
        }
        else {
            console.error("Puppetter scraper error:", error);
        }
    }
    finally {
        yield browser.close();
    }
});
exports.puppeteerScraper = puppeteerScraper;

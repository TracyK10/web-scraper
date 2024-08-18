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
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectData = collectData;
const puppeteerScraper_1 = require("../scrapers/puppeteerScraper");
function collectData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, puppeteerScraper_1.puppeteerScraper)(url);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Data collector error:", error.message);
                throw error;
            }
            else {
                console.error("Unknown Data Collector error:", error);
            }
        }
    });
}

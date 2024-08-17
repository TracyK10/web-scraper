import { config } from "dotenv";
import { collectData } from "./data/dataCollector";

// Load environment variables
config();

const url = process.env.URL;
if (!url) {
  throw new Error("URL is not defined");
} else {
  collectData(url);
}
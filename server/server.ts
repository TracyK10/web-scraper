import { config } from "dotenv";
import { collectData } from "./data/dataCollector";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import historyRoutes from "./routes/historyRoutes";

// Load environment variables
config();

/* CONFIGURATION */
const app = express();
const port = process.env.PORT || 3001;
const url = process.env.URL;
const mongoURI = process.env.MONGO_URI;

if (!url) {
  throw new Error("URL is not defined");
}

if (!mongoURI) {
  throw new Error("MongoDB URI is not defined");
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
}) .then(() => {
  console.log("Connected to MongoDB");
  collectData(url);
}) .catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Middleswares
app.use(cors());
app.use(express.json());

// Routes
app.use(express.urlencoded({ extended: false }));
app.use("/api/history", historyRoutes);

// API endpoint to handle URL submissions
app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;
  const apiKey = req.headers.authorization?.split(" ")[1];

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = await collectData(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

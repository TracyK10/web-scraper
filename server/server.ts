import { config } from "dotenv";
import { collectData } from "./data/dataCollector";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

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

// API endpoint to handle URL submissions
app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
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
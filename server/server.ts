import { config } from "dotenv";
import { collectData } from "./data/dataCollector";
import mongoose from "mongoose";
import express from "express";

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
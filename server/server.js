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
const dotenv_1 = require("dotenv");
const dataCollector_1 = require("./data/dataCollector");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables
(0, dotenv_1.config)();
/* CONFIGURATION */
const app = (0, express_1.default)();
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
mongoose_1.default.connect(mongoURI, {}).then(() => {
    console.log("Connected to MongoDB");
    (0, dataCollector_1.collectData)(url);
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
// Middleswares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API endpoint to handle URL submissions
app.post("/api/scrape", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }
    try {
        const data = yield (0, dataCollector_1.collectData)(url);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to scrape data" });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

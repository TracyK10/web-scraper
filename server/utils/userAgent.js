"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomUserAgent = getRandomUserAgent;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userAgents = (_b = (_a = process.env.USER_AGENT) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : [];
function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

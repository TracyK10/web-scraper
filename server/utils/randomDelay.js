"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDelay = randomDelay;
function randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, delay));
}

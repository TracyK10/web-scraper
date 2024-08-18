"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const mongoose_1 = require("mongoose");
const dataSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
}, { timestamps: true });
exports.Data = (0, mongoose_1.model)('Data', dataSchema);

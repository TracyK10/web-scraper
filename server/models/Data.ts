import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

export const Data = model('Data', dataSchema);
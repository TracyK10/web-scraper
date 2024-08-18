import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

export const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('/models/model.json');
  }
  return model;
};
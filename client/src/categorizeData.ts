import * as tf from '@tensorflow/tfjs';
import { loadModel } from './modelLoader';

export const categorizeData = async (embeddings: tf.Tensor, categories: Record<string, tf.Tensor[]>) => {
  const model: tf.LayersModel = await loadModel();

  const categoryEmbeddings = await Promise.all(
    Object.entries(categories).map(async ([category, examples]) => {
      const exampleEmbeddings = await model.predict(examples) as tf.Tensor;
      return { category, embedding: tf.mean(exampleEmbeddings, 0) };
    })
  );

  const titleEmbedding = embeddings.squeeze();
  let maxSimilarity = -1;
  let bestCategory = "";

  for (const { category, embedding } of categoryEmbeddings) {
    const similarity = cosineSimilarity(titleEmbedding, embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestCategory = category;
    }
  }

  return bestCategory;
};

const cosineSimilarity = (a: tf.Tensor, b: tf.Tensor) => {
  return tf.tidy(() => {
    const a_norm = a.div(tf.norm(a));
    const b_norm = b.div(tf.norm(b));
    return a_norm.dot(b_norm).dataSync()[0];
  });
};
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

const categories = {
  Technology: ['The latest smartphone features', 'Artificial intelligence advancements'],
  Health: ['New medical treatments', 'Healthy lifestyle tips'],
  Finance: ['Stock market trends', 'Cryptocurrency news'],
  Education: ['Online learning platforms', 'Educational policy changes']
};

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    title: string;
    url: string;
    category: string;
    products: { name: string; category: string }[];
  } | null>(null);
  const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);

  useEffect(() => {
    use.load().then(setModel);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/scrape`,
        { url },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
          }
        }
      );
      const data = res.data;
      if (model) {
        const embeddings = await model.embed([data.title]);
        const category = await categorizeData(embeddings);
        setResult({ ...data, category });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const categorizeData = async (embeddings: tf.Tensor) => {
    const categoryEmbeddings = await Promise.all(
      Object.entries(categories).map(async ([category, examples]) => {
        const exampleEmbeddings = await model!.embed(examples);
        return { category, embedding: tf.mean(exampleEmbeddings, 0) };
      })
    );

    const titleEmbedding = embeddings.squeeze();
    let maxSimilarity = -1;
    let bestCategory = '';

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

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Web scraper</h1>
      <p className="mb-8 text-lg">
        Please enter a URL, and we'll help you scrape the title of the webpage
        for easy viewing. Simply paste the link and let us do the rest!
      </p>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-6 w-96 border border-customLime"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 my-2 border border-customLime rounded-lg"
        />
        <button
          type="submit"
          className="border border-customLime text-customLime p-2 rounded-lg"
        >
          Scrape
        </button>
      </form>
      {result && (
        <div className="shadow-md rounded-lg p-6 mt-8 w-96">
          <h2 className="text-xl font-semibold mb-4">Scraped Data</h2>
          <table className="table-auto w-full border-collapse">
            <tbody>
              <tr className="border-b border-customLime">
                <td className="font-semibold p-2">Title</td>
                <td className="p-2">{result.title}</td>
              </tr>
              <tr className="border-b border-customLime">
                <td className="font-semibold p-2">URL</td>
                <td className="p-2">{result.url}</td>
              </tr>
              <tr className="border-b border-customLime">
                <td className="font-semibold p-2">Category</td>
                <td className="p-2">{result.category}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
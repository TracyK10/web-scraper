import React, { useState, useEffect } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import HistoryPage from "./components/HistoryPage";

const categories = {
  Technology: [
    "The latest smartphone features",
    "Artificial intelligence advancements",
  ],
  Health: ["New medical treatments", "Healthy lifestyle tips"],
  Finance: ["Stock market trends", "Cryptocurrency news"],
  Education: ["Online learning platforms", "Educational policy changes"],
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalResults,
  resultsPerPage,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalResults: number;
  resultsPerPage: number;
}) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-l-md"
    >
      Previous
    </button>
    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
      disabled={currentPage * resultsPerPage >= totalResults}
      className="px-4 py-2 border rounded-r-md"
    >
      Next
    </button>
  </div>
);

const Dashboard = ({ results }: { results: Array<{ category: string }> }) => {
  const categoryCount = results.reduce((acc, result) => {
    acc[result.category] = (acc[result.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Total Scrapes</h3>
          <p className="text-3xl font-bold">{results.length}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Categories</h3>
          {Object.entries(categoryCount).map(([category, count]) => (
            <p key={category}>
              {category}: {count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<
    Array<{
      title: string;
      url: string;
      category: string;
      products: { name: string; category: string }[];
    }>
  >([]);
  const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const resultsPerPage = 5;

  useEffect(() => {
    use.load().then(setModel);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHtmlContent("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/scrape`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        }
      );
      const data = res.data;
      if (model) {
        const embeddings = await model.embed([data.title]);
        const category = await categorizeData(embeddings);
        setResults((prev) => [...prev, { ...data, category }]);
      } else {
        setResults((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Web scraper</h1>
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="border border-customLime text-customLime p-2 rounded-lg mb-4"
      >
        {showHistory ? "Back to Scraper" : "View History"}
      </button>
      {showHistory ? (
        <HistoryPage />
      ) : (
        <>
          <p className="mb-8 text-lg">
            Please enter a URL, and we'll help you scrape the title of the
            webpage for easy viewing. Simply paste the link and let us do the
            rest!
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
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              {paginatedResults.map((result, index) => (
                <div key={index} className="shadow-md rounded-lg p-6 mt-8 w-96">
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
              ))}
              <div className="mt-8 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">Page Content</h2>
                <iframe
                  srcDoc={htmlContent}
                  title="Scraped Page Content"
                  className="w-full h-96 border border-customLime rounded"
                />
              </div>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalResults={results.length}
                resultsPerPage={resultsPerPage}
              />
              <Dashboard results={results} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;

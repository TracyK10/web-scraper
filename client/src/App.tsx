import { useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    title: string;
    url: string;
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      const res = await axios.post("/api/scrape", {url})
      setResult(res.data)
    } catch(error) {
      console.error(error)
    }
  }

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
              <tr>
                <td className="font-semibold p-2 border-b border-customLime">
                  URL
                </td>
                <td className="p-2 border-b border-customLime">{result.url}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App

import React, { useState, useEffect } from 'react';
import { fetchHistory, HistoryItem, HistoryResponse } from '../services/historyService';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchHistory(page);
      setHistory(data);
    };
    loadHistory();
  }, [page]);

  if (!history) return <div>Loading...</div>;

  return (
    <div>
      <h1>Scrape History</h1>
      <ul>
        {history.data.map((item: HistoryItem) => (
          <li key={item._id}>
            {item.title} - {item.category} ({new Date(item.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
      <div>
        <button className='m-10' onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <span>Page {page} of {history.totalPages}</span>
        <button className='m-10' onClick={() => setPage(p => p + 1)} disabled={page === history.totalPages}>Next</button>
      </div>
    </div>
  );
};

export default HistoryPage;
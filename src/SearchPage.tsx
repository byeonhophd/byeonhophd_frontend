// SearchPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import './SearchPage.css';

interface Clause {
  identifier: string;
  content: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Clause[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError('검색어를 입력하세요.');
      return;
    }
    setError('');
    axios.get('http://127.0.0.1:8000/api/search/', {  // 필요한 경우 URL을 조정하세요
      params: {
        q: searchQuery
      }
    })
    .then(response => {
      setResults(response.data);
    })
    .catch(error => {
      console.error('검색 중 오류가 발생했습니다!', error);
      setError('검색 중 오류가 발생했습니다.');
    });
  };

  return (
    <div className="page-content">
      <header className="settings-header">법률 검색</header>

      {/* 검색창 */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 검색 결과 */}
      <div className="search-results">
        {error && <p className="error">{error}</p>}
        {results.map((clause, index) => (
          <div key={index} className="clause">
            <h3>{clause.identifier}</h3>
            <p>{clause.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
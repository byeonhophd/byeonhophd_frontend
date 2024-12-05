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
    const apiUrl = `${import.meta.env.VITE_BE_BASE_URL}/api/search/`;
    axios.get(apiUrl, {
      params: {
        q: searchQuery
      }
    })
    .then(response => {
      console.log('API 응답 데이터:', response.data); // 디버깅용 로그
      // 응답 데이터 구조에 따라 아래를 수정하세요
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else if (Array.isArray(response.data.clauses)) {
        setResults(response.data.clauses);
      } else {
        setError('예상치 못한 응답 형식입니다.');
      }
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
        {Array.isArray(results) && results.map((clause, index) => (
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
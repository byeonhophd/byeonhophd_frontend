import React, { useState } from 'react';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

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
        <button className="search-button">
          검색
        </button>
      </div>

      <p>현재 준비중입니다.</p>
    </div>
  );
};

export default SearchPage;
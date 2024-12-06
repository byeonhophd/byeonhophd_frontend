import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import './SearchPage.css';

interface Clause {
  identifier: string;
  content: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Clause[];
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Clause[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set());

  const observer = useRef<IntersectionObserver | null>(null);
  const lastResultElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const pageSize = 10; // 페이지당 항목 수 (백엔드와 동일하게 설정)

  // 현재 검색을 추적하기 위한 참조
  const currentSearchRef = useRef<number>(0);

  const handleSearch = () => {
    setError('');
    setIsLoading(true);
    setResults([]);
    setPage(1);
    setExpandedClauses(new Set()); // 검색 시 확장 상태 초기화

    // 새로운 검색 ID 생성
    const searchId = currentSearchRef.current + 1;
    currentSearchRef.current = searchId;

    const apiUrl = `${import.meta.env.VITE_BE_BASE_URL}/api/search/`;
    const params: any = { page: 1 };
    if (searchQuery.trim()) {
      params.q = searchQuery;
    }

    // 이전 요청을 취소할 수 있는 CancelToken 생성
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    axios
      .get<PaginatedResponse>(apiUrl, { params, cancelToken: cancelTokenSource.token })
      .then(response => {
        // 최신 검색인지 확인
        if (currentSearchRef.current !== searchId) return;
        setResults(response.data.results);
        setHasMore(response.data.next !== null);
      })
      .catch(error => {
        if (axios.isCancel(error)) return; // 요청이 취소된 경우 무시
        console.error('검색 중 오류가 발생했습니다!', error);
        setError('검색 중 오류가 발생했습니다.');
      })
      .finally(() => {
        if (currentSearchRef.current === searchId) {
          setIsLoading(false);
        }
      });

    // 새 검색이 시작되면 이전 요청 취소
    return () => {
      cancelTokenSource.cancel();
    };
  };

  useEffect(() => {
    if (page === 1) return; // 이미 첫 페이지는 handleSearch에서 로드됨
    setIsLoading(true);

    const apiUrl = `${import.meta.env.VITE_BE_BASE_URL}/api/search/`;
    const params: any = { page: page };
    if (searchQuery.trim()) {
      params.q = searchQuery;
    }

    // 페이지네이션 요청에 대한 CancelToken 생성
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    axios
      .get<PaginatedResponse>(apiUrl, { params, cancelToken: cancelTokenSource.token })
      .then(response => {
        setResults(prevResults => [...prevResults, ...response.data.results]);
        setHasMore(response.data.next !== null);
      })
      .catch(error => {
        if (axios.isCancel(error)) return; // 요청이 취소된 경우 무시
        console.error('추가 검색 중 오류가 발생했습니다!', error);
        setError('추가 검색 중 오류가 발생했습니다.');
        if (error.response && error.response.status === 404) {
          setHasMore(false); // 더 이상 로드할 페이지가 없다고 설정
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, [page, searchQuery]);

  // Enter 키로도 검색 가능하게 하기
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 초기 로드 시 전체 리스트 가져오기 (옵션)
  useEffect(() => {
    handleSearch();
  }, []);

  // 특정 항목의 확장 상태를 토글하는 함수
  const toggleClause = (identifier: string) => {
    setExpandedClauses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(identifier)) {
        newSet.delete(identifier);
      } else {
        newSet.add(identifier);
      }
      return newSet;
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
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 검색 결과 */}
      <div className="search-results">
        {error && <p className="error">{error}</p>}
        {results.map((clause, index) => {
          const isExpanded = expandedClauses.has(clause.identifier);
          const uniqueKey = `${clause.identifier}-${index}`; // 고유한 key 생성

          if (results.length === index + 1) {
            // 마지막 항목에 ref 할당
            return (
              <div
                key={uniqueKey}
                className="clause"
                ref={lastResultElementRef}
              >
                <h3
                  className="clause-title"
                  onClick={() => toggleClause(clause.identifier)}
                >
                  {clause.identifier}
                </h3>
                {isExpanded && <p className="clause-content">{clause.content}</p>}
              </div>
            );
          } else {
            return (
              <div key={uniqueKey} className="clause">
                <h3
                  className="clause-title"
                  onClick={() => toggleClause(clause.identifier)}
                >
                  {clause.identifier}
                </h3>
                {isExpanded && <p className="clause-content">{clause.content}</p>}
              </div>
            );
          }
        })}
        {!isLoading && results.length === 0 && !error && <p>검색 결과가 없습니다.</p>}
      </div>

      {/* 로딩 표시 */}
      {isLoading && <div className="loading">로딩 중...</div>}
    </div>
  );
};

export default SearchPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

// JSON 데이터 타입 정의
interface Feed {
  title: string;
  link: string;
  description: string;
  language: string;
  pubDate: string;
}

interface Item {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}

interface FeedData {
  feed: Feed;
  items: Item[];
}

const Home: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [isComposing, setIsComposing] = useState(false); // IME 입력 상태 관리
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatContent(event.target.value);
  };

  const onChatButtonClick = () => {
    const trimmedContent = chatContent.trim();
    if (trimmedContent === '') {
      alert('내용을 입력해주세요.');
      return;
    }
    console.log('전송된 채팅 내용:', trimmedContent);
    setChatContent('');
    navigate('/chatbot', { state: { chatContent: trimmedContent } });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isComposing) {
      event.preventDefault();
      onChatButtonClick();
    }
  };

  useEffect(() => {
    const fetchFeedData = async () => {
      setLoading(true);
      try {
        const apiUrl = `${import.meta.env.VITE_BE_BASE_URL}/api/rss`;
        console.log(apiUrl)
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FeedData = await response.json();
        setFeedData(data);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  // Helper 함수: 제목에서 카테고리와 서브카테고리 추출
  const parseTitle = (title: string) => {
    const categoryMatch = title.match(/\(([^)]+)\)/);
    const category = categoryMatch ? categoryMatch[1] : '';
    let mainTitle = title.replace(/\([^)]+\)\s*/, '').trim();

    let subcategory = '';
    if (category === '생활법령') {
      const parts = mainTitle.split('>');
      mainTitle = parts.length > 0 ? parts[parts.length - 1].trim() : '';
      subcategory = parts.length > 1 ? parts[0].trim() : '';
    }

    if (mainTitle.length > 15) {
      mainTitle = mainTitle.substring(0, 15) + '...';
    }

    return { category, subcategory, mainTitle };
  };

  // Helper 함수: 설명을 20자로 자르기
  const truncateDescription = (description: string, maxLength: number = 20) => {
    // HTML 태그 제거
    const removeHtmlTags = (text: string): string => text.replace(/<\/?[^>]+(>|$)/g, '');

    const cleanDescription = removeHtmlTags(description);

    // 문자열 길이 제한 처리
    if (cleanDescription.length <= maxLength) return cleanDescription;
    return cleanDescription.substring(0, maxLength) + '...';
  };

  return (
    <div className="page-content">
      <header>
        <h1>안녕하세요,</h1>
        <h1>시민님</h1>
      </header>

      {/* 채팅 입력 섹션 */}
      <div className="chat-bar">
        <input
          type="text"
          placeholder="궁금한 내용은 무엇이든 물어보세요!"
          value={chatContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="chat-input"
        />
        <button className="chat-button" onClick={onChatButtonClick}>
          <FontAwesomeIcon icon={faGavel} />
        </button>
      </div>

      {/* 생활 법령 정보 섹션 */}
      <section className="info-slider">
        <h2>생활법령정보</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p>{error}</p>}
        {feedData && (
          <div className="slider">
            {feedData.items
              .filter(item => {
                const { category } = parseTitle(item.title);
                return category !== '공지사항';
              })
              .slice(0, 10)
              .map((item, index) => {
                const { category, subcategory, mainTitle } = parseTitle(item.title);
                const truncatedDescription = truncateDescription(item.description);

                return (
                  <div key={index} className="card">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <div className="card_title">
                        <h3>{mainTitle}</h3>
                      </div>
                      {category && <p className="category">{category}</p>}
                      {subcategory && <p className="subcategory">{subcategory}</p>}
                      {item.description && <p className="description">{truncatedDescription}</p>}
                    </a>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [isComposing, setIsComposing] = useState(false); // IME 입력 상태 관리
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
        <div className="slider">
          <div className="card">카드뉴스형 생활법령 <p>『양육비』등 5건 개통</p></div>
          <div className="card">생활법령 이벤트 <p>2024년 12월 외국어 생활법령 이벤트</p></div>
          <div className="card">주택청약종합저축의 월납입금 인정액 상향 11월 1일 시행 <p>주택청약종합저축의 저축총액으로 산정되는 월납입금 인정 한도가 10만원에서 25만원으로 상향됩니다.</p></div>
          <div className="card">당첨자 발표 <p>2024년 11월 반가워요 생활법령 퀴즈 이벤트</p></div>
          <div className="card">신규 콘텐츠 <p>『주민투표』 개통</p></div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGavel } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios'; // For fetching data
// import xml2js from 'xml2js'; // For parsing XML
// import './Home.css';

// const Home: React.FC = () => {
//   const [chatContent, setChatContent] = useState('');
//   const [isComposing, setIsComposing] = useState(false);
//   const [rssItems, setRssItems] = useState<any[]>([]); // State to hold RSS items
//   const navigate = useNavigate();

//   // Fetch and parse RSS feed
//   useEffect(() => {
//     const fetchRSS = async () => {
//       try {
//         const response = await axios.get(
//           'https://www.easylaw.go.kr/CSP/RssNtcRetrieve.laf?topMenu=serviceUl7',
//           { responseType: 'text' }
//         );
//         console.log('Fetched RSS feed:', response.data);

//         xml2js.parseString(response.data, (err, result) => {
//           if (err) {
//             console.error('Failed to parse XML:', err);
//           } else {
//             const items = result.rss.channel[0].item;
//             setRssItems(items);
//           }
//         });
//       } catch (error) {
//         console.error('Failed to fetch RSS feed:', error);
//       }
//     };

//     fetchRSS();
//   }, []);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setChatContent(event.target.value);
//   };

//   const onChatButtonClick = () => {
//     const trimmedContent = chatContent.trim();
//     if (trimmedContent === '') {
//       alert('내용을 입력해주세요.');
//       return;
//     }
//     console.log('전송된 채팅 내용:', trimmedContent);
//     setChatContent('');
//     navigate('/chatbot', { state: { chatContent: trimmedContent } });
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter' && !isComposing) {
//       event.preventDefault();
//       onChatButtonClick();
//     }
//   };

//   return (
//     <div className="page-content">
//       <header>
//         <h1>안녕하세요,</h1>
//         <h1>시민님</h1>
//       </header>

//       {/* 채팅 입력 섹션 */}
//       <div className="chat-bar">
//         <input
//           type="text"
//           placeholder="궁금한 내용은 무엇이든 물어보세요!"
//           value={chatContent}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyPress}
//           className="chat-input"
//         />
//         <button className="chat-button" onClick={onChatButtonClick}>
//           <FontAwesomeIcon icon={faGavel} />
//         </button>
//       </div>

//       {/* 생활 법령 정보 섹션 */}
//       <section className="info-slider">
//         <h2>생활법령정보</h2>
//         <div className="slider">
//           {rssItems.map((item, index) => (
//             <div className="card" key={index}>
//               <h3>{item.title[0]}</h3>
//               <p>{item.pubDate[0]}</p>
//               <a href={item.link[0]} target="_blank" rel="noopener noreferrer">
//                 자세히 보기
//               </a>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

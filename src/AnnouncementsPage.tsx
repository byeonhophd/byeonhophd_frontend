// AnnouncementsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './AnnouncementsPage.css'; // 별도의 CSS 파일을 사용


const AnnouncementsPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="announcements-page">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> 뒤로가기
      </button>
      
      <h1 className="page-title">공지사항</h1>
      <div className="announcement-item">
        <h2 className="announcement-title" onClick={toggleContent}>
          애플리케이션 사용을 환영합니다.
        </h2>
        {isOpen && (
          <div className="announcement-content">
            <p>안녕하세요, 로젠다 애플리케이션을 이용해주셔서 감사합니다.</p>
            <ul>
              <li>이 앱은 사용자가 법률 상담 서비스를 이용할 수 있도록 돕습니다.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
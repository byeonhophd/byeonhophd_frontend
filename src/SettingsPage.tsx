import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './SettingsPage.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-header">환경설정</div>
      
      <div className="settings-container">
        <div className="profile-section">
          <div className="profile-image">
            <FontAwesomeIcon className="profile" icon={faUser} size="2x" />
          </div>
          <h1 className="profile-name">김 시 민</h1>
        </div>
        
        <div className="info-section">
          <h2 className="section-title">개인정보</h2>
          <ul>
            <li className="info-item">비밀번호 변경</li>
            <li className="info-item">로그아웃</li>
          </ul>
        </div>
        
        <div className="guide-section">
          <h2 className="section-title">안내</h2>
          <ul>
            <li className="guide-item">공지사항</li>
            <li className="guide-item">FAQ</li>
            <li className="guide-item">문의</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
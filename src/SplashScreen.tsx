import React from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h2>당신을 위한 법률 서비스</h2>
        <img src="src/assets/logo.png" width="30%" />
        {/* 예시로 간단한 스피너 추가 */}
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
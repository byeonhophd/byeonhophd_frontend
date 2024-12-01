import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StreamLangchain from './StreamLangchain';
import Home from './Home';
import SearchPage from './SearchPage';
import MapPage from './MapPage';
import SettingsPage from './SettingsPage';
import TabBar from './TabBar';
import SplashScreen from './SplashScreen';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로딩 시 타이머 설정
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 (1000밀리초)

    // 클린업 함수
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <SplashScreen />}
      {!isLoading && (
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<StreamLangchain />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
            <TabBar />
          </div>
        </Router>
      )}
    </>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StreamLangchain from './StreamLangchain';
import Home from './Home';
import SearchPage from './SearchPage';
import MapPage from './MapPage';
import SettingsPage from './SettingsPage';
import TabBar from './TabBar';
import './App.css';

const App: React.FC = () => {
  return (
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
  );
}

export default App;
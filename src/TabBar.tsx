// components/TabBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './TabBar.css';

const TabBar: React.FC = () => {
  return (
    <div className="tab-bar">
      <NavLink 
        end
        to="/" 
        className={({ isActive }) => isActive ? "tab active-tab" : "tab"}
      >
        기본
      </NavLink>
      <NavLink 
        to="/chatbot" 
        className={({ isActive }) => isActive ? "tab active-tab" : "tab"}
      >
        상담
      </NavLink>
      <NavLink 
        to="/map" 
        className={({ isActive }) => isActive ? "tab active-tab" : "tab"}
      >
        지도
      </NavLink>
      <NavLink 
        to="/search" 
        className={({ isActive }) => isActive ? "tab active-tab" : "tab"}
      >
        찾기
      </NavLink>
      <NavLink 
        to="/settings" 
        className={({ isActive }) => isActive ? "tab active-tab" : "tab"}
      >
        설정
      </NavLink>
    </div>
  );
}

export default TabBar;
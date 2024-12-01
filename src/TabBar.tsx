import React from 'react';
import { NavLink } from 'react-router-dom';
import './TabBar.css';

// 아이콘 import
import activeAsset1 from './assets/home1.png';
import inactiveAsset1 from './assets/home0.png';
import activeAsset2 from './assets/chat1.png';
import inactiveAsset2 from './assets/chat0.png';
import activeAsset3 from './assets/map1.png';
import inactiveAsset3 from './assets/map0.png';
import activeAsset4 from './assets/search1.png';
import inactiveAsset4 from './assets/search0.png';
import activeAsset5 from './assets/setting1.png';
import inactiveAsset5 from './assets/setting0.png';

const TabBar: React.FC = () => {
  return (
    <div className="tab-bar">
      <NavLink
        end
        to="/"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'tab active-tab' : 'tab'
        }
      >
        {({ isActive }: { isActive: boolean }) => (
          <img
            src={isActive ? activeAsset1 : inactiveAsset1}
            alt="홈"
            className="tab-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/chatbot"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'tab active-tab' : 'tab'
        }
      >
        {({ isActive }: { isActive: boolean }) => (
          <img
            src={isActive ? activeAsset2 : inactiveAsset2}
            alt="채팅"
            className="tab-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/map"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'tab active-tab' : 'tab'
        }
      >
        {({ isActive }: { isActive: boolean }) => (
          <img
            src={isActive ? activeAsset3 : inactiveAsset3}
            alt="지도"
            className="tab-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'tab active-tab' : 'tab'
        }
      >
        {({ isActive }: { isActive: boolean }) => (
          <img
            src={isActive ? activeAsset4 : inactiveAsset4}
            alt="검색"
            className="tab-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'tab active-tab' : 'tab'
        }
      >
        {({ isActive }: { isActive: boolean }) => (
          <img
            src={isActive ? activeAsset5 : inactiveAsset5}
            alt="설정"
            className="tab-icon"
          />
        )}
      </NavLink>
    </div>
  );
};

export default TabBar;
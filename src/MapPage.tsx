import React, { useEffect } from 'react';
import './MapPage.css';

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

const MapPage: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5742, 126.9732),
      level: 2,
    };
    const map = new kakao.maps.Map(container, options);

    // 마커가 표시될 위치
    const markerPosition = new kakao.maps.LatLng(37.5744, 126.9730);
    // 마커 생성
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    // 마커를 지도에 표시
    marker.setMap(map);
  }, []);

  return (
    
    <div className="page-content">
      <header className="settings-header">지도</header>
      <div
        id="map"
        style={{ width: '500px', height: '500px' }}
      ></div>
    </div>
  );
};

export default MapPage;
// src/components/MapPage.tsx
import React, { useEffect, useState } from 'react';
import './MapPage.css';

// 글로벌 kakao 객체 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

// 법무법인 인터페이스 및 데이터 가져오기
import { LawFirm, lawFirms } from './lawFirms';

// 최대 마커 개수 상수 정의
const MAX_MARKERS = 300; // 원하는 최대 마커 수로 설정

// Overlay 컴포넌트 정의
const Overlay: React.FC<{
  lawFirm: LawFirm | null;
  onClose: () => void;
}> = ({ lawFirm, onClose }) => {
  if (!lawFirm) return null;

  return (
    <div className="overlay">
      <button className="close-button" onClick={onClose}>
        닫기
      </button>
      <h2>{lawFirm.name}</h2>
      <p>{lawFirm.description}</p>
      {/* 추가적인 법무법인 정보를 여기에 표시하세요 */}
    </div>
  );
};

const MapPage: React.FC = () => {
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // 기본적으로 오버레이를 숨김

  useEffect(() => {
    const container = document.getElementById('map');
    if (!container) {
      console.error('Map container not found');
      return;
    }

    const options = {
      center: new kakao.maps.LatLng(37.4918, 127.0075),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    // 마커 개수 제한
    const markersToRender = lawFirms.slice(0, MAX_MARKERS);

    // 법무법인별 마커 생성 및 클릭 이벤트 추가
    markersToRender.forEach((firm) => {
      const markerPosition = new kakao.maps.LatLng(firm.latitude, firm.longitude);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);

      // 마커 클릭 시 오버레이 표시
      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedLawFirm(firm);
        setIsOverlayVisible(true);
      });
    });

    // 지도 클릭 시 오버레이 닫기
    kakao.maps.event.addListener(map, 'click', () => {
      setIsOverlayVisible(false);
    });
  }, []);

  // 오버레이 닫기 핸들러
  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className="page-content">
      <header className="settings-header">법률 상담소 찾기</header>
      <div
        id="map"
        style={{ width: '100%', height: '100vh' }}
      ></div>
      {isOverlayVisible && (
        <Overlay
          lawFirm={selectedLawFirm}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
};

export default MapPage;
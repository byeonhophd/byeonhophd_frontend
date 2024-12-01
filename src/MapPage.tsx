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

// LawFirm 인터페이스 정의
interface LawFirm {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

// 법무법인 데이터 예시
const lawFirms: LawFirm[] = [
  {
    id: 1,
    name: '법무법인 김앤장',
    latitude: 37.5744,
    longitude: 126.9730,
    description: '대한민국 최대 로펌 중 하나입니다.',
  },
  {
    id: 2,
    name: '법무법인 태평양',
    latitude: 37.5750,
    longitude: 126.9750,
    description: '다양한 분야에서 전문성을 갖춘 로펌입니다.',
  },
  // 추가 법무법인 데이터를 여기에 추가하세요
];

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
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(lawFirms[0]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true); // 기본적으로 오버레이를 표시

  useEffect(() => {
    const container = document.getElementById('map');
    if (!container) {
      console.error('Map container not found');
      return;
    }

    const options = {
      center: new kakao.maps.LatLng(37.5742, 126.9732),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    // 법무법인별 마커 생성 및 클릭 이벤트 추가
    lawFirms.forEach((firm) => {
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
      <header className="settings-header">지도</header>
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
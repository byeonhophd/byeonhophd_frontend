import React, { useEffect } from 'react';

const { kakao } = window;

const MapPage = () => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    // 마커가 표시될 위치
    const markerPosition = new kakao.maps.LatLng(37.5665, 126.9780);
    // 마커 생성
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    // 마커를 지도에 표시
    marker.setMap(map);
  }, []);

  return (
    <div className="page-content">
      <h1>지도</h1>
      <div
        id="map"
        style={{ width: '500px', height: '500px' }}
      ></div>
    </div>
  );
};

export default MapPage;
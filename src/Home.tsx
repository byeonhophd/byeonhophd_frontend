import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="page-content">
      <header>
        <h1>안녕하세요,</h1>
        <h1>시민님</h1>
      </header>

      {/* 채팅 입력 섹션 */}
      <div className="chat-bar">
        <input type="text" placeholder="궁금한 내용은 무엇이든 물어보세요!" />
        <button className="chat-button">
          <img src="button-asset.png" alt="버튼" />
        </button>
      </div>

      {/* 생활 법령 정보 섹션 */}
      <section className="info-slider">
        <h2>생활법령정보</h2>
        <div className="slider">
          <div className="card">카드 1</div>
          <div className="card">카드 2</div>
          <div className="card">카드 3</div>
          <div className="card">카드 4</div>
          <div className="card">카드 5</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React from 'react';
import './about.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';

function About() {
  return (
    <div className="maincontent">
      <Sidebar />
      <div className="about-page">
        <h1>О нас</h1>
        <div className="about-container">
          <div className="about-container">
          <h1>Мега крутая мебель</h1>
          <p>такая мебель только у тебя и у майкла джексона</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 
import React from 'react';
import './about.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';
import App from '../App.jsx';

function About() {
  return (
    <div>
    <div  className='header-container'>
      <App />
    </div>
    <div  className='main-container'>
    <div className='sidebar-container'>
      <Sidebar />
      </div>
      <div className='maincontent'>
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
      </div>
      </div>
  );
}

export default About; 
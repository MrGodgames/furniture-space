import React from 'react';
import '../App.css';
import './profile.css';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';



function Profile() {
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
                <h1>Профиль</h1>
            <div className="profile-page">
            </div>
            </div>
            </div>
        </div>
    )
}

export default Profile;
import React from 'react';
import '../App.css';
import './profile.css';
import Sidebar from '../sidebar.jsx';



function Profile() {
    return (
        <div className="maincontent">
            <Sidebar />
            <div className="profile-page">
                <h1>Профиль</h1>
            </div>
        </div>
    )
}

export default Profile;
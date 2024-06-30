import React from "react";

function Header(){
    return (
      <header>
        <section className="logo-section">
          <img alt="profile-photo" className="profile-photo" src="image1.png" />
            <h2 className="logo-name">At Tilawah</h2>
        </section>
        <section className="personal-section">
          <i className='fas fa-bell bell-icon'></i>
          <i className='fas fa-comment-dots chat-icon'></i>
          <img alt="profile-photo" className="profile-photo" src="image1.png" />
        </section>
      </header>
    );
}

export default Header; 
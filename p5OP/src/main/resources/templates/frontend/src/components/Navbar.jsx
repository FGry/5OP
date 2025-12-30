import React from 'react';
import './Navbar.css';

const Navbar = ({ onOpenModal }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="/" id="site-title">
          5OP <span>Jobs</span>
        </a>

        {}
        <div className="navbar-menu d-none d-lg-flex">
          <button className="nav-menu-item active">
            <i className="fas fa-home"></i> <span>Trang chủ</span>
          </button>
          <button className="nav-menu-item">
            <i className="fas fa-briefcase"></i> <span>Việc làm</span>
          </button>
          <button className="nav-menu-item">
            <i className="fas fa-building"></i> <span>Công ty</span>
          </button>
          <button className="nav-menu-item">
            <i className="fas fa-newspaper"></i> <span>Blog</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center">
          <button
            className="btn-chat"
            onClick={() => onOpenModal('chat')}
            aria-label="Chat"
          >
            <i className="fas fa-comment-dots"></i>
            <span className="badge-notify badge-chat">2</span>
          </button>

          <button
            className="btn-notification"
            onClick={() => onOpenModal('notification')}
            aria-label="Thông báo"
          >
            <i className="fas fa-bell"></i>
            <span className="badge-notify">3</span>
          </button>

          <button
            className="btn-profile"
            onClick={() => onOpenModal('profile')}
            aria-label="Hồ sơ"
          >
            <i className="fas fa-user"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
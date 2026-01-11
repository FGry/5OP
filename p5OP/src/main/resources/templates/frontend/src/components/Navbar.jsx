import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onOpenModal, user }) => {
  const location = useLocation();

  // Helper để kiểm tra active menu
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        {/* 1. LOGO */}
        <Link className="navbar-brand" to="/">
          5OP <span>Jobs</span>
        </Link>

        {/* 2. MENU CHÍNH */}
        <div className="navbar-menu d-none d-lg-flex">
          <Link to="/" className={`nav-menu-item ${isActive('/')}`}>
            <i className="fas fa-home"></i> <span>Trang chủ</span>
          </Link>
          <Link to="/jobs" className={`nav-menu-item ${isActive('/jobs')}`}>
            <i className="fas fa-briefcase"></i> <span>Việc làm</span>
          </Link>
          <Link to="/company" className={`nav-menu-item ${isActive('/company')}`}>
            <i className="fas fa-building"></i> <span>Công ty</span>
          </Link>
          <button className="nav-menu-item">
            <i className="fas fa-newspaper"></i> <span>Blog</span>
          </button>
        </div>

        {/* 3. KHU VỰC TÀI KHOẢN (USER / LOGIN) */}
        <div className="d-flex align-items-center gap-2">
          {user ? (
            /* --- TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP (Hiện icon) --- */
            <div className="d-flex align-items-center">
              <button
                className="btn-chat"
                onClick={() => onOpenModal && onOpenModal('chat')}
                title="Tin nhắn"
              >
                <i className="fas fa-comment-dots"></i>
                <span className="badge-notify badge-chat">2</span>
              </button>

              <button
                className="btn-notification"
                onClick={() => onOpenModal && onOpenModal('notification')}
                title="Thông báo"
              >
                <i className="fas fa-bell"></i>
                <span className="badge-notify">3</span>
              </button>

              <button
                className="btn-profile"
                onClick={() => onOpenModal && onOpenModal('profile')}
                title="Hồ sơ cá nhân"
              >
                {/* Hiển thị chữ cái đầu của tên user */}
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <i className="fas fa-user"></i>}
              </button>
            </div>
          ) : (
            /* --- TRƯỜNG HỢP CHƯA ĐĂNG NHẬP (Hiện nút Login/Register) --- */
            <div className="auth-buttons">
              <Link to="/login" className="btn-login-nav">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-register-nav">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
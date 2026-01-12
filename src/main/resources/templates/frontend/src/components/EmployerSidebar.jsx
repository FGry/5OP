import React from 'react';
import './EmployerSidebar.css';

const Sidebar = ({ activePage, onNavigate, onPostJob }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { id: 'company', icon: 'fas fa-building', label: 'Thông tin công ty' },
    { id: 'post-job', icon: 'fas fa-plus-circle', label: 'Đăng tin việc làm', action: true }, // action: true để xử lý riêng
    { id: 'applicants', icon: 'fas fa-users', label: 'Danh sách ứng viên', badge: 12 },
    { id: 'jobs', icon: 'fas fa-briefcase', label: 'Quản lý tin đăng' },
    { id: 'blog', icon: 'fas fa-pen-fancy', label: 'Đăng Blog' },
    { id: 'analytics', icon: 'fas fa-chart-bar', label: 'Thống kê' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Cài đặt' }
  ];

  return (
    <aside className="sidebar">
      {/* Header Sidebar */}
      <div className="sidebar-header">
        <a href="/" className="logo">5OP <span>Jobs</span></a>

        <div className="company-info-mini">
          <div className="company-avatar-mini">🏢</div>
          <div className="company-details-mini">
            <h4>FPT Software</h4>
            <p>Nhà tuyển dụng</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => {
              if (item.action && item.id === 'post-job') {
                onPostJob(); // Gọi hàm mở modal đăng tin
              } else {
                onNavigate(item.id); // Chuyển trang bình thường
              }
            }}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
            {item.badge && <span className="menu-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
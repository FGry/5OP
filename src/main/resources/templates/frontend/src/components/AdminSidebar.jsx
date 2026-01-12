import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'users', icon: 'fas fa-users', label: 'Quản lý người dùng', badge: 248 },
    { id: 'jobs', icon: 'fas fa-briefcase', label: 'Duyệt tin tuyển dụng', badge: 15, badgeColor: 'warning' },
    { id: 'blog', icon: 'fas fa-blog', label: 'Quản lý Blog' },
    { id: 'analytics', icon: 'fas fa-chart-line', label: 'Báo cáo thống kê' },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-logo" onClick={() => window.location.reload()}>
        <h1><i className="fas fa-crown"></i> <span>5OP Admin</span> <span className="badge-admin">Pro</span></h1>
      </div>

      {/* Admin Profile Widget */}
      <div className="admin-profile">
        <div className="admin-avatar">👨‍💼</div>
        <div className="admin-info">
          <h4>Admin System</h4>
          <p>Super Administrator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-section">
          <div className="nav-section-title">Quản lý</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor || ''}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
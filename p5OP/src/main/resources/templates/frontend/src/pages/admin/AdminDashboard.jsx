import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // --- States ---
  const [activePage, setActivePage] = useState('users');
  const [activeModal, setActiveModal] = useState(null); // 'notification', 'profile', 'delete'
  const [toast, setToast] = useState(null);

  // Fake data cho Jobs Pending để xử lý logic duyệt/từ chối
  const [pendingJobs, setPendingJobs] = useState([
    { id: 1, title: 'Senior Frontend Developer', company: 'FPT Software', location: 'Hà Nội', salary: '20-30 triệu VNĐ', time: '2 giờ trước', status: 'pending' },
    { id: 2, title: 'UI/UX Designer', company: 'Viettel Solutions', location: 'Hồ Chí Minh', salary: '15-25 triệu VNĐ', time: '4 giờ trước', status: 'pending' },
    { id: 3, title: 'Backend Developer', company: 'VNG Corporation', location: 'Hồ Chí Minh', salary: '25-40 triệu VNĐ', time: '1 ngày trước', status: 'pending' }
  ]);

  // --- Helpers ---
  const showToast = (message, color = '#667eea') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJobAction = (id, action) => {
    setPendingJobs(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, status: action }; // action = 'approved' or 'rejected'
      }
      return job;
    }));

    if (action === 'approved') showToast('Tin tuyển dụng đã được duyệt!', '#10b981');
    else showToast('Tin tuyển dụng đã bị từ chối!', '#ef4444');
  };

  // --- Render Functions for Modals ---
  const renderNotifications = () => (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-xl p-6 w-[420px] max-h-[600px] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 m-0">Thông báo</h3>
                <button onClick={() => setActiveModal(null)} className="border-none bg-transparent text-2xl cursor-pointer text-gray-400">&times;</button>
            </div>
            <div className="p-4 bg-red-50 rounded-lg mb-4 border-l-4 border-red-500">
                <p className="m-0 font-bold text-gray-800 text-sm">Cảnh báo: Phát hiện hoạt động bất thường</p>
                <small className="text-gray-500">30 phút trước</small>
            </div>
            <div className="p-4 bg-green-50 rounded-lg mb-4 border-l-4 border-green-500">
                <p className="m-0 font-bold text-gray-800 text-sm">15 tin tuyển dụng mới đang chờ duyệt</p>
                <small className="text-gray-500">1 giờ trước</small>
            </div>
        </div>
    </div>
  );

  const renderProfileModal = () => (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-xl p-6 w-[340px] relative" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-4xl text-white border-4 border-indigo-100">👨‍💼</div>
                <h4 className="m-0 text-lg font-bold text-gray-800">Admin System</h4>
                <p className="m-2 text-sm text-gray-500">super.admin@5opjobs.com</p>
                <span className="inline-block mt-3 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-xs font-bold">SUPER ADMIN</span>
            </div>
            <button className="w-full text-left p-3 text-red-500 font-bold hover:bg-red-50 rounded-lg transition">
                <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
            </button>
        </div>
    </div>
  );

  const renderDeleteConfirm = () => (
    <div className="modal-overlay">
        <div className="bg-white rounded-xl p-10 max-w-md text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-red-500">
                <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="m-0 mb-4 text-2xl font-bold text-gray-800">Xác nhận xóa</h3>
            <p className="m-0 mb-8 text-gray-500 text-base">Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-4">
                <button onClick={() => setActiveModal(null)} className="flex-1 p-3 bg-gray-100 border-none rounded-lg font-bold text-gray-600 cursor-pointer">Hủy bỏ</button>
                <button onClick={() => { setActiveModal(null); showToast('Đã xóa thành công!', '#ef4444'); }} className="flex-1 p-3 bg-gradient-to-r from-red-500 to-red-600 border-none rounded-lg font-bold text-white cursor-pointer">Xóa ngay</button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="admin-wrapper">
      {/* 1. Sidebar Component */}
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />

      {/* 2. Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2>Admin Dashboard</h2>
            <p>Chào mừng đến với trang quản trị hệ thống</p>
          </div>
          <div className="topbar-right">
            <div className="search-admin">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
            <button className="admin-icon-btn" onClick={() => setActiveModal('notification')}>
              <i className="fas fa-bell"></i><span className="icon-badge">12</span>
            </button>
            <button className="admin-icon-btn" onClick={() => showToast('Hộp thư chưa có tin mới', '#3b82f6')}>
              <i className="fas fa-envelope"></i><span className="icon-badge">5</span>
            </button>
            <button className="admin-icon-btn" onClick={() => setActiveModal('profile')}>
              <i className="fas fa-user-shield"></i>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="admin-content">
          {/* Stats Grid */}
          <div className="stats-row">
            {[
              { icon: 'fas fa-users', color: 'purple', value: '2,847', label: 'Tổng người dùng', trend: '+12.5%' },
              { icon: 'fas fa-clock', color: 'orange', value: '15', label: 'Tin đang chờ duyệt', trend: '-3', negative: true },
              { icon: 'fas fa-dollar-sign', color: 'green', value: '$48,562', label: 'Doanh thu tháng này', trend: '+28.3%' },
              { icon: 'fas fa-chart-bar', color: 'blue', value: '1,245', label: 'Hoạt động hôm nay', trend: '+8%' }
            ].map((stat, idx) => (
              <div key={idx} className="stat-box">
                <div className={`stat-icon-wrapper ${stat.color}`}><i className={stat.icon}></i></div>
                <div className="stat-details">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                  <small className={stat.negative ? 'decrease' : ''}>
                    <i className={`fas fa-arrow-${stat.negative ? 'down' : 'up'}`}></i> {stat.trend}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="dashboard-grid">
            {/* User List */}
            <div className="dashboard-card">
              <div className="card-head">
                <h3>Người dùng mới nhất</h3>
                <button>Xem tất cả <i className="fas fa-arrow-right"></i></button>
              </div>
              {[
                { name: 'Nguyễn Văn Tâm', role: 'Ứng viên', time: '2 giờ trước', color: '#667eea', short: 'NT' },
                { name: 'Lê Thị Hương', role: 'Nhà tuyển dụng', time: '5 giờ trước', color: '#f093fb', short: 'LH' }
              ].map((user, idx) => (
                <div key={idx} className="user-row">
                  <div className="user-img" style={{ background: user.color }}>{user.short}</div>
                  <div className="user-data">
                    <h4>{user.name}</h4>
                    <p>{user.role} • Đăng ký {user.time}</p>
                  </div>
                  <div className="user-actions">
                    <button className="action-btn edit"><i className="fas fa-edit"></i></button>
                    <button className="action-btn delete" onClick={() => setActiveModal('delete')}><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Activities */}
            <div className="dashboard-card">
              <div className="card-head">
                <h3>Hoạt động gần đây</h3>
                <button>Xem tất cả</button>
              </div>
              <div className="activity-item">
                <div className="activity-icon success"><i className="fas fa-check"></i></div>
                <div className="activity-content"><p>Đã duyệt tin "Frontend Dev"</p><small>15 phút trước</small></div>
              </div>
              <div className="activity-item">
                <div className="activity-icon info"><i className="fas fa-user-plus"></i></div>
                <div className="activity-content"><p>Người dùng mới: Nguyễn Văn Tâm</p><small>2 giờ trước</small></div>
              </div>
            </div>
          </div>

          {/* Pending Jobs Section (Dynamic) */}
          <div className="full-width-section">
            <div className="card-head">
                <h3>Tin tuyển dụng đang chờ duyệt</h3>
                <button>Xem tất cả <i className="fas fa-arrow-right"></i></button>
            </div>

            {pendingJobs.map((job) => (
                <div
                    key={job.id}
                    className="job-pending"
                    style={{
                        background: job.status === 'approved' ? '#f0fdf4' : job.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                        borderColor: job.status === 'approved' ? '#86efac' : job.status === 'rejected' ? '#fca5a5' : '#fef3c7'
                    }}
                >
                    <div className="job-head-row">
                        <div>
                            <h4 className="job-pending-title">{job.title}</h4>
                            <p className="job-company"><i className="fas fa-building"></i> {job.company}</p>
                        </div>
                        <span className={`status-tag ${job.status}`}>
                            {job.status === 'pending' ? 'Chờ duyệt' : job.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                    </div>
                    <div className="job-info-row">
                        <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                        <span><i className="fas fa-dollar-sign"></i> {job.salary}</span>
                        <span><i className="fas fa-clock"></i> {job.time}</span>
                    </div>

                    {/* Action Buttons - Only show if pending */}
                    {job.status === 'pending' ? (
                        <div className="job-actions-row">
                            <button className="action-btn approve" onClick={() => handleJobAction(job.id, 'approved')}>
                                <i className="fas fa-check"></i> Duyệt tin
                            </button>
                            <button className="action-btn reject" onClick={() => handleJobAction(job.id, 'rejected')}>
                                <i className="fas fa-times"></i> Từ chối
                            </button>
                            <button className="action-btn edit"><i className="fas fa-eye"></i> Chi tiết</button>
                        </div>
                    ) : (
                        <div className="job-actions-row">
                            <span style={{ color: job.status === 'approved' ? '#065f46' : '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <i className={`fas fa-${job.status === 'approved' ? 'check' : 'times'}-circle`}></i>
                                {job.status === 'approved' ? 'Tin đã được duyệt' : 'Tin đã bị từ chối'}
                            </span>
                        </div>
                    )}
                </div>
            ))}
          </div>

          {/* Main Action Buttons */}
          <div className="main-actions">
            <button className="admin-btn admin-btn-primary">
                <i className="fas fa-users-cog"></i> Quản lý toàn bộ người dùng
            </button>
            <button className="admin-btn admin-btn-secondary">
                <i className="fas fa-chart-bar"></i> Xem báo cáo chi tiết
            </button>
          </div>
        </div>
      </main>

      {/* Modals & Toasts */}
      {activeModal === 'notification' && renderNotifications()}
      {activeModal === 'profile' && renderProfileModal()}
      {activeModal === 'delete' && renderDeleteConfirm()}

      {toast && (
        <div className="toast-message" style={{ background: toast.color }}>
            <i className="fas fa-info-circle mr-2"></i> {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
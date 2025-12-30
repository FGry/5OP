import React, { useState } from 'react';
import EmployerSidebar from '../../components/EmployerSidebar';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
    // --- State Management ---
    const [activePage, setActivePage] = useState('dashboard');
    const [activeModal, setActiveModal] = useState(null); // 'chat', 'notification', 'profile', 'postJob'
    const [toast, setToast] = useState(null);

    // --- Data Mockup ---
    const stats = [
        { icon: 'fas fa-briefcase', color: 'blue', value: 24, label: 'Tin tuyển dụng', trend: '+3', trendIcon: 'fas fa-arrow-up' },
        { icon: 'fas fa-user-check', color: 'green', value: 156, label: 'Ứng viên mới', trend: '+18', trendIcon: 'fas fa-arrow-up' },
        { icon: 'fas fa-eye', color: 'orange', value: '2,847', label: 'Lượt xem tin', trend: '+245', trendIcon: 'fas fa-arrow-up' },
        { icon: 'fas fa-handshake', color: 'red', value: 8, label: 'Đã tuyển dụng', trend: '+2', trendIcon: 'fas fa-arrow-up' },
    ];

    const applicants = [
        { name: 'Nguyễn Văn Tâm', role: 'Frontend Developer', exp: '4 năm', status: 'Mới', statusClass: 'new', avatar: 'NT', color: '#3498db' },
        { name: 'Lê Thị Hương', role: 'UI/UX Designer', exp: '3 năm', status: 'Đang xem xét', statusClass: 'review', avatar: 'LH', color: '#27ae60' },
        { name: 'Phạm Văn Minh', role: 'Backend Developer', exp: '5 năm', status: 'Mới', statusClass: 'new', avatar: 'PM', color: '#f39c12' },
        { name: 'Trần Thị Lan', role: 'Product Manager', exp: '6 năm', status: 'Đang xem xét', statusClass: 'review', avatar: 'TL', color: '#e74c3c' },
    ];

    const jobs = [
        { title: 'Senior Frontend Developer', status: 'Đang tuyển', statusClass: 'active', applicants: 24, views: 456 },
        { title: 'UI/UX Designer', status: 'Đang tuyển', statusClass: 'active', applicants: 18, views: 312 },
        { title: 'Backend Developer', status: 'Chờ duyệt', statusClass: 'pending', applicants: 0, views: 0 },
        { title: 'DevOps Engineer', status: 'Đang tuyển', statusClass: 'active', applicants: 12, views: 234 },
    ];

    // --- Helpers ---
    const showToast = (message, color = '#3498db') => {
        setToast({ message, color });
        setTimeout(() => setToast(null), 3000);
    };

    const handlePostJob = (e) => {
        e.preventDefault();
        setActiveModal(null);
        showToast('Tin tuyển dụng đã được gửi đi duyệt!', '#27ae60');
    };

    // --- Sub-components (Render Functions) ---

    const renderChatModal = () => (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', width: '380px', height: '550px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'linear-gradient(135deg, #27ae60, #229954)', color: 'white', padding: '1.25rem', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>Tin nhắn</h3>
                    <small style={{ opacity: 0.9 }}>5 cuộc trò chuyện mới</small>
                </div>
                <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: '#f8f9fa' }}>
                {['Nguyễn Văn Tâm', 'Lê Thị Hương'].map((name, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', cursor: 'pointer', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: idx === 0 ? '#3498db' : '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                {name.match(/\b(\w)/g).join('').substring(0,2)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#2c3e50' }}>{name}</h4>
                                <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d', fontSize: '0.85rem' }}>Tin nhắn mới...</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNotificationPanel = () => (
        <div style={{ position: 'fixed', top: '80px', right: '30px', width: '400px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', padding: '1.5rem', zIndex: 10000, maxHeight: '500px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid #ecf0f1' }}>
                <h3 style={{ margin: 0, color: '#2c3e50', fontWeight: 700, fontSize: '1.2rem' }}>Thông báo</h3>
                <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
            </div>
            <div style={{ padding: '1rem', background: '#fef5f5', borderRadius: '10px', marginBottom: '1rem', borderLeft: '4px solid #e74c3c' }}>
                <p style={{ margin: 0, color: '#2c3e50', fontWeight: 600 }}>Có 5 ứng viên mới ứng tuyển</p>
                <small style={{ color: '#7f8c8d' }}>1 giờ trước</small>
            </div>
            <div style={{ padding: '1rem', background: '#d5f4e6', borderRadius: '10px', marginBottom: '1rem', borderLeft: '4px solid #27ae60' }}>
                <p style={{ margin: 0, color: '#2c3e50', fontWeight: 600 }}>Tin tuyển dụng đã được duyệt</p>
                <small style={{ color: '#7f8c8d' }}>3 giờ trước</small>
            </div>
        </div>
    );

    const renderProfilePanel = () => (
        <div style={{ position: 'fixed', top: '80px', right: '30px', width: '320px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', padding: '1.5rem', zIndex: 10000 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, color: '#2c3e50', fontWeight: 700, fontSize: '1.2rem' }}>Tài khoản</h3>
                <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #ecf0f1' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e74c3c, #c0392b)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white' }}>🏢</div>
                <h4 style={{ margin: 0, color: '#2c3e50', fontWeight: 700, fontSize: '1.1rem' }}>FPT Software</h4>
                <small style={{ color: '#7f8c8d' }}>Tài khoản Doanh nghiệp</small>
            </div>
            <div style={{ color: '#e74c3c', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</div>
        </div>
    );

    const renderPostJobModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Đăng tin tuyển dụng mới</h2>
                    <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '2rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
                </div>
                <form onSubmit={handlePostJob}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 600 }}>Tiêu đề công việc</label>
                        <input type="text" placeholder="VD: Senior Frontend Developer" style={{ width: '100%', padding: '0.75rem', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} required />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 600 }}>Địa điểm</label>
                        <input type="text" placeholder="VD: Hà Nội" style={{ width: '100%', padding: '0.75rem', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} required />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 600 }}>Mức lương</label>
                        <input type="text" placeholder="VD: 20-30 triệu VNĐ" style={{ width: '100%', padding: '0.75rem', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} required />
                    </div>
                     <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 600 }}>Mô tả công việc</label>
                        <textarea rows="4" placeholder="Mô tả chi tiết..." style={{ width: '100%', padding: '0.75rem', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <i className="fas fa-paper-plane"></i> Đăng tin tuyển dụng
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="employer-dashboard-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">5OP <span>Jobs</span></div>
                    <div className="company-info">
                        <div className="company-avatar">🏢</div>
                        <div className="company-details">
                            <h4>FPT Software</h4>
                            <p>Nhà tuyển dụng</p>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-menu">
                    {[
                        { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
                        { id: 'company', icon: 'fas fa-building', label: 'Thông tin công ty' },
                        { id: 'post-job', icon: 'fas fa-plus-circle', label: 'Đăng tin việc làm' },
                        { id: 'applicants', icon: 'fas fa-users', label: 'Danh sách ứng viên', badge: 12 },
                        { id: 'jobs', icon: 'fas fa-briefcase', label: 'Quản lý tin đăng' },
                        { id: 'settings', icon: 'fas fa-cog', label: 'Cài đặt' }
                    ].map(item => (
                        <button
                            key={item.id}
                            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setActivePage(item.id);
                                if(item.id === 'post-job') setActiveModal('postJob');
                            }}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                            {item.badge && <span className="menu-badge">{item.badge}</span>}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="top-bar">
                    <div className="top-bar-left">
                        <h1>Bảng điều khiển nhà tuyển dụng</h1>
                        <p>Chào mừng trở lại! Hãy kiểm tra các ứng viên mới nhất.</p>
                    </div>
                    <div className="top-bar-right">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Tìm kiếm ứng viên, công việc..." />
                        </div>
                        <button className="icon-button chat" onClick={() => setActiveModal('chat')}>
                            <i className="fas fa-comment-dots"></i>
                            <span className="badge">5</span>
                        </button>
                        <button className="icon-button" onClick={() => setActiveModal('notification')}>
                            <i className="fas fa-bell"></i>
                            <span className="badge">8</span>
                        </button>
                        <button className="icon-button" onClick={() => setActiveModal('profile')}>
                            <i className="fas fa-user-circle"></i>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card">
                                <div className={`stat-icon ${stat.color}`}>
                                    <i className={stat.icon}></i>
                                </div>
                                <div className="stat-info">
                                    <h3>{stat.value}</h3>
                                    <p>{stat.label}</p>
                                    <small><i className={stat.trendIcon}></i> {stat.trend} tuần này</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="content-grid">
                        {/* Applicants */}
                        <div className="card">
                            <div className="card-header">
                                <h2>Ứng viên mới nhất</h2>
                                <button onClick={() => showToast('Đang tải danh sách...', '#3498db')}>
                                    Xem tất cả <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            {applicants.map((app, idx) => (
                                <div key={idx} className="applicant-item">
                                    <div className="applicant-avatar" style={{background: `linear-gradient(135deg, ${app.color}, #2980b9)`}}>
                                        {app.avatar}
                                    </div>
                                    <div className="applicant-info">
                                        <h4>{app.name}</h4>
                                        <p>{app.role} • {app.exp}</p>
                                    </div>
                                    <span className={`applicant-status ${app.statusClass}`}>{app.status}</span>
                                </div>
                            ))}
                        </div>

                        {/* Active Jobs */}
                        <div className="card">
                            <div className="card-header">
                                <h2>Tin đang tuyển</h2>
                                <button onClick={() => showToast('Đang tải...', '#3498db')}>
                                    Xem tất cả <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            {jobs.map((job, idx) => (
                                <div key={idx} className="job-item">
                                    <div className="job-header-row">
                                        <h3 className="job-title">{job.title}</h3>
                                        <span className={`job-status ${job.statusClass}`}>{job.status}</span>
                                    </div>
                                    <div className="job-meta">
                                        <span><i className="fas fa-user-check"></i> {job.applicants} ứng viên</span>
                                        <span><i className="fas fa-eye"></i> {job.views} lượt xem</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={() => setActiveModal('postJob')}>
                            <i className="fas fa-plus-circle"></i> Đăng tin tuyển dụng mới
                        </button>
                        <button className="btn btn-secondary" onClick={() => showToast('Đang tải danh sách...', '#3498db')}>
                            <i className="fas fa-users"></i> Xem tất cả ứng viên
                        </button>
                    </div>
                </div>
            </main>

            {/* Modals & Popups */}
            {activeModal === 'chat' && renderChatModal()}
            {activeModal === 'notification' && renderNotificationPanel()}
            {activeModal === 'profile' && renderProfilePanel()}
            {activeModal === 'postJob' && renderPostJobModal()}

            {/* Toast */}
            {toast && (
                <div className="toast-message" style={{ backgroundColor: toast.color }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
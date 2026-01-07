import React, { useState, useEffect } from 'react';
import './EmployerDashboard.css';
import { FaHome, FaBriefcase, FaUserFriends, FaCog, FaSignOutAlt, FaSearch, FaBell, FaEnvelope, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const res = await api.get('/company/my-company');
                if (res.data) {
                    setCompany(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin công ty hoặc chưa tạo hồ sơ:", error);
            }
        };
        fetchCompanyInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const getInitial = () => {
            if (company && company.name) {
                return company.name.charAt(0).toUpperCase();
            }
            return '?';
    };

    return (
        <div className="employer-dashboard-wrapper">
            {/* --- SIDEBAR --- */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">5<span>Op</span> Jobs</div>

                    <div className="company-info">
                        {company && company.logo ? (
                            <img
                                src={company.logo}
                                alt="Logo"
                                style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="company-avatar">
                                {company && company.name ? company.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}

                        <div className="company-details">
                            {/* Tên công ty */}
                            <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                                {company ? company.name : "Chưa cập nhật"}
                            </h4>
                            {/* Quy mô */}
                            <p>{company ? company.scale : "Vui lòng cập nhật"}</p>
                        </div>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <i><FaHome /></i> <span>Tổng quan</span>
                    </button>
                    <button className={`menu-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
                        <i><FaBriefcase /></i> <span>Tin tuyển dụng</span>
                        <span className="menu-badge">3</span>
                    </button>
                    <button className={`menu-item ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
                        <i><FaUserFriends /></i> <span>Ứng viên</span>
                        <span className="menu-badge">12</span>
                    </button>

                    {/* Nút chuyển sang trang sửa hồ sơ */}
                    <button className={`menu-item`} onClick={() => navigate('/employer/company')}>
                        <i><FaCog /></i> <span>Hồ sơ công ty</span>
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <button className="menu-item" onClick={handleLogout} style={{ color: '#e74c3c' }}>
                        <i><FaSignOutAlt /></i> <span>Đăng xuất</span>
                    </button>
                </div>
            </div>

            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
                    <div className="top-bar-left">
                        {/* Hiển thị tên HR nếu muốn, tạm thời để cứng hoặc lấy từ User Context */}
                        <h1>Xin chào, HR Manager!</h1>
                        <p>Đây là tình hình tuyển dụng tại <strong>{company ? company.name : "công ty"}</strong> hôm nay.</p>
                    </div>
                    <div className="top-bar-right">
                        <div className="search-box">
                            <i><FaSearch /></i>
                            <input type="text" placeholder="Tìm kiếm ứng viên, công việc..." />
                        </div>
                        <button className="icon-button">
                            <i><FaBell /></i>
                            <span className="badge">5</span>
                        </button>
                        <button className="icon-button chat">
                            <i><FaEnvelope /></i>
                            <span className="badge">2</span>
                        </button>
                    </div>
                </div>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => navigate('/employer/post')}><FaPlus /> Đăng tin mới</button>
                </div>
                <div className="content-area">
                    {/* Stats Grid - Giữ nguyên logic thống kê giả lập (Hoặc gọi API thống kê sau này) */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon blue"><FaBriefcase /></div>
                            <div className="stat-info">
                                <h3>12</h3>
                                <p>Tin đang mở</p>
                            </div>
                        </div>
                        <div className="stat-card green">
                            <div className="stat-icon green"><FaUserFriends /></div>
                            <div className="stat-info">
                                <h3>48</h3>
                                <p>Hồ sơ ứng tuyển</p>
                                <small>+12 tuần này</small>
                            </div>
                        </div>
                        <div className="stat-card orange">
                            <div className="stat-icon orange"><FaBell /></div>
                            <div className="stat-info">
                                <h3>5</h3>
                                <p>Lịch phỏng vấn</p>
                            </div>
                        </div>
                        <div className="stat-card red">
                            <div className="stat-icon red"><FaSignOutAlt /></div>
                            <div className="stat-info">
                                <h3>2</h3>
                                <p>Tin hết hạn</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-grid">
                        {/* Recent Applicants */}
                        <div className="card">
                            <div className="card-header">
                                <h2>Ứng viên gần đây</h2>
                                <button>Xem tất cả</button>
                            </div>

                            {[1, 2, 3].map((item) => (
                                <div className="applicant-item" key={item}>
                                    <div className="applicant-avatar">NV</div>
                                    <div className="applicant-info" style={{ flex: 1 }}>
                                        <h4>Nguyễn Văn A</h4>
                                        <p>Java Developer • 3 năm kinh nghiệm</p>
                                    </div>
                                    <span className="applicant-status new">Mới ứng tuyển</span>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2>Tin nổi bật</h2>
                                <button><FaPlus /></button>
                            </div>

                            <div className="job-item">
                                <div className="job-header-row">
                                    <h4 className="job-title">Senior Backend Java</h4>
                                    <span className="job-status active">Active</span>
                                </div>
                                <div className="job-meta">
                                    <span>Full-time</span>
                                    <span>Hà Nội</span>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
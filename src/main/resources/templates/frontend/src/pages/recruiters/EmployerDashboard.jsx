import React, { useState, useEffect } from 'react';
import './EmployerDashboard.css';
import { FaHome, FaBriefcase, FaUserFriends, FaCog, FaSignOutAlt, FaSearch, FaBell, FaEnvelope, FaPlus, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // State dữ liệu
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            setLoading(true);
            try {
                const compRes = await api.get('/company/my-company');
                if (compRes.data) {
                    setCompany(compRes.data);
                }

                const [jobsRes, appsRes] = await Promise.all([
                    api.get('/employer/jobs'),
                    api.get('/employer/applications')
                ]);

                setJobs(jobsRes.data);
                setApplications(appsRes.data);

            } catch (error) {
                console.error("Lỗi tải dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, []);

    const handleUpdateStatus = async (appId, newStatus) => {
        if(!window.confirm(`Bạn muốn chuyển trạng thái sang ${newStatus}?`)) return;
        try {
            await api.put(`/employer/applications/${appId}/status`, null, {
                params: { status: newStatus }
            });
            alert("Cập nhật thành công!");

            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    const handleDeleteJob = async (jobId) => {
        if(!window.confirm("Bạn có chắc muốn xóa tin này? Hành động này không thể hoàn tác.")) return;
        try {
            await api.delete(`/employer/job/${jobId}`);
            setJobs(prev => prev.filter(j => j.id !== jobId));
            alert("Đã xóa tin tuyển dụng");
        } catch (error) { alert("Lỗi khi xóa job"); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- RENDER TAB: TIN TUYỂN DỤNG ---
    const renderJobsTab = () => (
        <div className="card">
            <div className="card-header">
                <h2>Quản lý tin tuyển dụng</h2>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/employer/post')}>
                    <FaPlus /> Đăng tin mới
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Ngày đăng</th>
                            <th>Mức lương</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length === 0 ? <tr><td colSpan="5">Chưa có tin tuyển dụng nào.</td></tr> :
                        jobs.map(job => (
                            <tr key={job.id}>
                                <td>
                                    <strong>{job.title}</strong><br/>
                                    <small className="text-muted">{job.location} • {job.type}</small>
                                </td>
                                <td>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>{job.salaryMin ? `${(job.salaryMin/1000000)} - ${(job.salaryMax/1000000)} Tr` : 'Thỏa thuận'}</td>
                                <td><span className={`badge ${job.status === 'OPEN' ? 'bg-success' : 'bg-secondary'}`}>{job.status}</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-info me-2" title="Xem" onClick={()=>navigate(`/jobs/${job.id}`)}><FaEye /></button>
                                    <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={()=>handleDeleteJob(job.id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- RENDER TAB: ỨNG VIÊN ---
    const renderCandidatesTab = () => (
        <div className="card">
            <div className="card-header">
                <h2>Quản lý ứng viên ({applications.length})</h2>
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Ứng viên</th>
                            <th>Vị trí</th>
                            <th>Ngày nộp</th>
                            <th>CV</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? <tr><td colSpan="6">Chưa có ứng viên nào.</td></tr> :
                        applications.map(app => (
                            <tr key={app.id}>
                                <td>
                                    <strong>{app.user?.profile?.fullName || app.user?.username}</strong><br/>
                                    <small>{app.user?.email}</small>
                                </td>
                                <td>{app.job?.title}</td>
                                <td>{new Date(app.appliedAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    {app.cv ? (
                                        <a
                                            href={`http://localhost:8080/${app.cv.replace(/\\/g, '/').replace(/^\//, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <FaDownload /> Xem CV
                                        </a>
                                    ) : <span className="text-muted">Không có CV</span>}
                                </td>
                                <td>
                                    <span className={`badge
                                        ${app.status === 'PENDING' ? 'bg-warning' :
                                            app.status === 'ACCEPTED' ? 'bg-success' :
                                            app.status === 'REJECTED' ? 'bg-danger' : 'bg-info'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {app.status === 'PENDING' && (
                                        <>
                                            <button className="btn btn-sm btn-success me-1" onClick={()=>handleUpdateStatus(app.id, 'ACCEPTED')}>Duyệt</button>
                                            <button className="btn btn-sm btn-danger" onClick={()=>handleUpdateStatus(app.id, 'REJECTED')}>Loại</button>
                                        </>
                                    )}
                                    {app.status === 'ACCEPTED' && (
                                            <button className="btn btn-sm btn-outline-primary" onClick={()=>handleUpdateStatus(app.id, 'INTERVIEW_SCHEDULED')}>Mời PV</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- RENDER MAIN LAYOUT ---
    return (
        <div className="employer-dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">5<span>Op</span> Jobs</div>
                    <div className="company-info">
                        {company && company.logo ? (
                            <img src={company.logo} alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                        ) : (
                            <div className="company-avatar">{company ? company.name.charAt(0).toUpperCase() : '?'}</div>
                        )}
                        <div className="company-details">
                            <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                                {company ? company.name : "Chưa cập nhật"}
                            </h4>
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
                    </button>
                    <button className={`menu-item ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
                        <i><FaUserFriends /></i> <span>Ứng viên</span>
                        {applications.filter(a => a.status === 'PENDING').length > 0 &&
                            <span className="menu-badge">{applications.filter(a => a.status === 'PENDING').length}</span>
                        }
                    </button>
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

            {/* MAIN CONTENT */}
            <div className="main-content">
                <div className="top-bar">
                    <div className="top-bar-left">
                        <h1>Xin chào, {company?.name || 'Nhà tuyển dụng'}!</h1>
                        <p>Quản lý tuyển dụng hiệu quả cùng 5OP Jobs.</p>
                    </div>
                    <div className="top-bar-right">
                         <div className="search-box">
                            <i><FaSearch /></i>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                        <button className="icon-button"><i><FaBell /></i></button>
                        <button className="icon-button chat"><i><FaEnvelope /></i></button>
                    </div>
                </div>

                <div className="content-area">
                    {loading ? <div className="text-center p-5">Đang tải dữ liệu...</div> : (
                        <>
                            {/* DASHBOARD TAB */}
                            {activeTab === 'dashboard' && (
                                <>
                                    {/* PHẦN 1: THỐNG KÊ (GRID) */}
                                    <div className="stats-grid">
                                        <div className="stat-card" onClick={() => setActiveTab('jobs')} style={{cursor:'pointer'}}>
                                            <div className="stat-icon blue"><FaBriefcase /></div>
                                            <div className="stat-info"><h3>{jobs.length}</h3><p>Tin đã đăng</p></div>
                                        </div>
                                        <div className="stat-card green" onClick={() => setActiveTab('candidates')} style={{cursor:'pointer'}}>
                                            <div className="stat-icon green"><FaUserFriends /></div>
                                            <div className="stat-info"><h3>{applications.length}</h3><p>Tổng hồ sơ</p></div>
                                        </div>
                                        <div className="stat-card orange" onClick={() => setActiveTab('candidates')} style={{cursor:'pointer'}}>
                                            <div className="stat-icon orange"><FaBell /></div>
                                            <div className="stat-info"><h3>{applications.filter(a => a.status === 'PENDING').length}</h3><p>Chờ duyệt</p></div>
                                        </div>
                                        <div className="stat-card red">
                                            <div className="stat-icon red"><FaSignOutAlt /></div>
                                            <div className="stat-info"><h3>{jobs.filter(j => j.status === 'CLOSED').length}</h3><p>Đã đóng</p></div>
                                        </div>
                                    </div>
                                    {/* HẾT PHẦN GRID STATS */}

                                    {/* PHẦN 2: ỨNG VIÊN MỚI NHẤT (HIỂN THỊ DƯỚI DẠNG DANH SÁCH FULL MÀN HÌNH) */}
                                    <div className="mt-4">
                                        <h4 className="mb-3">Ứng viên mới nhất</h4>
                                        <div className="bg-white rounded shadow-sm overflow-hidden" style={{ width: '100%' }}>
                                            {applications.length === 0 ? (
                                                <div className="p-5 text-center text-muted">Chưa có ứng viên mới.</div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-hover mb-0" style={{ width: '100%' }}>
                                                        <thead className="bg-light">
                                                            <tr>
                                                                <th className="border-0 p-3" style={{ width: '30%' }}>Ứng viên</th>
                                                                <th className="border-0 p-3" style={{ width: '30%' }}>Vị trí</th>
                                                                <th className="border-0 p-3" style={{ width: '20%' }}>Ngày nộp</th>
                                                                <th className="border-0 p-3" style={{ width: '20%' }}>Trạng thái</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {applications
                                                                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                                                                .slice(0, 5)
                                                                .map(app => (
                                                                <tr key={app.id}>
                                                                    <td className="p-3">
                                                                        <div className="d-flex align-items-center">
                                                                            <div style={{
                                                                                width: '40px', height: '40px',
                                                                                background: '#f1f2f6', color: '#57606f',
                                                                                borderRadius: '50%', display: 'flex',
                                                                                alignItems: 'center', justifyContent: 'center',
                                                                                fontWeight: 'bold', marginRight: '15px',
                                                                                fontSize: '1.1rem'
                                                                            }}>
                                                                                {(app.user?.profile?.fullName || app.user?.username || 'U').charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <div style={{fontWeight: '600', color: '#2f3542', fontSize: '1rem'}}>{app.user?.profile?.fullName || app.user?.username}</div>
                                                                                <small className="text-muted">{app.user?.email}</small>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-3 text-primary" style={{fontWeight: '500', fontSize: '1rem', verticalAlign: 'middle'}}>{app.job?.title}</td>
                                                                    <td className="p-3 text-muted" style={{verticalAlign: 'middle'}}>{new Date(app.appliedAt).toLocaleDateString('vi-VN')}</td>
                                                                    <td className="p-3" style={{verticalAlign: 'middle'}}>
                                                                        <span className={`badge ${
                                                                            app.status === 'PENDING' ? 'bg-warning text-dark' :
                                                                            app.status === 'ACCEPTED' ? 'bg-success' :
                                                                            app.status === 'REJECTED' ? 'bg-danger' : 'bg-info'
                                                                        }`} style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                                                                            {app.status === 'PENDING' ? 'Chờ duyệt' :
                                                                             app.status === 'ACCEPTED' ? 'Đã duyệt' :
                                                                             app.status === 'REJECTED' ? 'Đã loại' : app.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'jobs' && renderJobsTab()}
                            {activeTab === 'candidates' && renderCandidatesTab()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
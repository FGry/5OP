import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import './MainInterface.css';

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navbar State
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        checkUserAndFetch();
    }, []);

    const checkUserAndFetch = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            // Lấy User cho Navbar
            const userRes = await api.get('/profile/me');
            const localUser = JSON.parse(localStorage.getItem('user'));
            const role = localUser ? localUser.role : 'USER';
            setUser({ ...userRes.data, role: role });

            // Lấy danh sách jobs
            const res = await api.get('/activity/saved');
            if (Array.isArray(res.data)) setSavedJobs(res.data);
            else setSavedJobs([]);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderProfilePanel = () => (
        <div className="profile-panel">
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <h5>{user?.fullName}</h5>
            </div>
            <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
                <div onClick={() => navigate('/')} className="d-block py-2" style={{cursor:'pointer'}}>
                    <i className="fas fa-home me-2"></i>Trang chủ
                </div>
                <div onClick={() => navigate('/profile')} className="d-block py-2" style={{cursor:'pointer'}}>
                    <i className="fas fa-id-card me-2"></i>Xem hồ sơ
                </div>
                <div onClick={() => setActiveModal(null)} className="d-block py-2" style={{cursor:'pointer', fontWeight:'bold'}}>
                    <i className="fas fa-heart me-2"></i>Công việc đã lưu
                </div>
                <div onClick={() => navigate('/applied-jobs')} className="d-block py-2" style={{cursor:'pointer'}}>
                    <i className="fas fa-history me-2"></i>Lịch sử ứng tuyển
                </div>
                <div onClick={handleLogout} className="d-block py-2 text-danger" style={{cursor:'pointer'}}>
                    <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                </div>
            </div>
        </div>
    );

    const handleUnsave = async (e, jobId) => {
        e.stopPropagation();
        if(!window.confirm("Bạn có chắc muốn bỏ lưu công việc này?")) return;
        try {
            await api.post(`/activity/save/${jobId}`);
            setSavedJobs(prev => prev.filter(item => item.id !== jobId));
        } catch (error) { alert("Lỗi khi thao tác"); }
    };

    return (
        <div className="main-wrapper" style={{background: '#f8f9fa', minHeight: '100vh'}}>
            <Navbar onOpenModal={setActiveModal} user={user} />

            <div className="container py-5">
                <h2 className="mb-4" style={{color: '#2c3e50', fontWeight: '700'}}>
                    <i className="fas fa-bookmark me-2" style={{color: '#e74c3c'}}></i>
                    Công việc đã lưu ({savedJobs.length})
                </h2>

                {loading ? (
                    <div className="text-center p-5">Đang tải...</div>
                ) : savedJobs.length === 0 ? (
                    <div className="text-center p-5 bg-white rounded shadow-sm">
                        <p className="text-muted">Bạn chưa lưu công việc nào.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Tìm việc ngay</button>
                    </div>
                ) : (
                    <div className="row">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="col-md-6 mb-4">
                                <div className="job-card h-100 p-4 bg-white rounded shadow-sm" onClick={() => navigate(`/jobs/${job.id}`)} style={{cursor: 'pointer', position: 'relative'}}>
                                    <div className="d-flex align-items-center">
                                        <div className="company-logo me-3">
                                            {job.company?.logo ? <img src={job.company.logo} alt="logo" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : '🏢'}
                                        </div>
                                        <div>
                                            <h5 className="mb-1 text-primary fw-bold">{job.title}</h5>
                                            <p className="mb-1 text-muted">{job.company?.name}</p>
                                            <small className="text-secondary"><i className="fas fa-map-marker-alt me-1"></i>{job.location}</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-danger btn-sm" style={{position: 'absolute', top: '20px', right: '20px'}} onClick={(e) => handleUnsave(e, job.id)} title="Bỏ lưu">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeModal === 'profile' && renderProfilePanel()}
        </div>
    );
};

export default SavedJobs;
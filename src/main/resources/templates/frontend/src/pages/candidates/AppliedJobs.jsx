import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

const AppliedJobs = () => {
    const navigate = useNavigate();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navbar State
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                // Lấy User
                const userRes = await api.get('/profile/me');
                const localUser = JSON.parse(localStorage.getItem('user'));
                const role = localUser ? localUser.role : 'USER';
                setUser({ ...userRes.data, role: role });

                // Lấy danh sách
                const res = await api.get('/activity/applied');
                if (Array.isArray(res.data)) setAppliedJobs(res.data);
                else setAppliedJobs([]);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setAppliedJobs([]);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [navigate]);

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
                <div onClick={() => navigate('/saved-jobs')} className="d-block py-2" style={{cursor:'pointer'}}>
                    <i className="fas fa-heart me-2"></i>Công việc đã lưu
                </div>
                <div onClick={() => setActiveModal(null)} className="d-block py-2" style={{cursor:'pointer', fontWeight:'bold'}}>
                    <i className="fas fa-history me-2"></i>Lịch sử ứng tuyển
                </div>
                <div onClick={handleLogout} className="d-block py-2 text-danger" style={{cursor:'pointer'}}>
                    <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                </div>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            'PENDING': 'bg-warning text-dark',
            'REVIEWING': 'bg-info text-white',
            'INTERVIEW_SCHEDULED': 'bg-primary text-white',
            'ACCEPTED': 'bg-success text-white',
            'REJECTED': 'bg-danger text-white',
            'CANCELED': 'bg-secondary text-white'
        };
        const labels = {
            'PENDING': 'Đang chờ',
            'REVIEWING': 'Đang xem xét',
            'INTERVIEW_SCHEDULED': 'Phỏng vấn',
            'ACCEPTED': 'Trúng tuyển',
            'REJECTED': 'Từ chối',
            'CANCELED': 'Đã hủy'
        };
        return <span className={`badge ${styles[status] || 'bg-secondary'}`}>{labels[status] || status}</span>;
    };

    return (
        <div style={{background: '#f8f9fa', minHeight: '100vh'}}>
            <Navbar onOpenModal={setActiveModal} user={user} />

            <div className="container py-5">
                <h2 className="mb-4" style={{color: '#2c3e50', fontWeight: '700'}}>
                    <i className="fas fa-paper-plane me-2" style={{color: '#3498db'}}></i>
                    Lịch sử ứng tuyển ({appliedJobs.length})
                </h2>

                <div className="bg-white rounded shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="p-3">Công việc</th>
                                    <th className="p-3">Công ty</th>
                                    <th className="p-3">Ngày ứng tuyển</th>
                                    <th className="p-3">Trạng thái</th>
                                    <th className="p-3">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-4">Đang tải...</td></tr>
                                ) : appliedJobs.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center p-4">Bạn chưa ứng tuyển công việc nào.</td></tr>
                                ) : (
                                    appliedJobs.map((app) => (
                                        <tr key={app.id} style={{verticalAlign: 'middle'}}>
                                            <td className="p-3 fw-bold text-primary" style={{cursor:'pointer'}} onClick={() => navigate(`/jobs/${app.job.id}`)}>
                                                {app.job?.title}
                                            </td>
                                            <td className="p-3">{app.job?.company?.name}</td>
                                            <td className="p-3">{new Date(app.appliedAt).toLocaleDateString('vi-VN')}</td>
                                            <td className="p-3">{getStatusBadge(app.status)}</td>
                                            <td className="p-3">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/jobs/${app.job.id}`)}>Xem Job</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {activeModal === 'profile' && renderProfilePanel()}
        </div>
    );
};

export default AppliedJobs;
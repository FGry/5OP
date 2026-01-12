import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

const CompanyList = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navbar State
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const fetchCompanyAndUser = async () => {
            try {
                // 1. Lấy dữ liệu công ty
                const res = await api.get('/company/public');
                setCompany(res.data);

                // 2. Lấy User nếu đã login
                const token = localStorage.getItem('token');
                if (token) {
                    const userRes = await api.get('/profile/me');
                    const localUser = JSON.parse(localStorage.getItem('user'));
                    const role = localUser ? localUser.role : 'USER';
                    setUser({ ...userRes.data, role: role });
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanyAndUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const renderProfilePanel = () => (
        <div className="profile-panel" style={{position:'fixed', top:'60px', right:'20px', background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)', zIndex:1000}}>
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
                {user?.role === 'USER' && (
                    <>
                        <div onClick={() => navigate('/saved-jobs')} className="d-block py-2" style={{cursor:'pointer'}}>
                            <i className="fas fa-heart me-2"></i>Công việc đã lưu
                        </div>
                        <div onClick={() => navigate('/applied-jobs')} className="d-block py-2" style={{cursor:'pointer'}}>
                            <i className="fas fa-history me-2"></i>Lịch sử ứng tuyển
                        </div>
                    </>
                )}
                <div onClick={handleLogout} className="d-block py-2 text-danger" style={{cursor:'pointer'}}>
                    <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar onOpenModal={setActiveModal} user={user} />

            <div className="container py-5">
                <h2 className="text-center mb-5" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                    Nhà tuyển dụng hàng đầu
                </h2>

                {loading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <div className="row">
                        {company.map((comp) => (
                            <div key={comp.id} className="col-md-4 mb-4">
                                <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onClick={() => navigate(`/company/${comp.id}`)}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div className="card-body text-center p-4">
                                        <img
                                            src={comp.logo || "https://via.placeholder.com/100"}
                                            alt={comp.name}
                                            style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '15px' }}
                                        />
                                        <h5 className="card-title text-dark font-weight-bold">{comp.name}</h5>
                                        <p className="text-muted small">
                                            <i className="fas fa-map-marker-alt me-1"></i> {comp.address || 'Chưa cập nhật'}
                                        </p>
                                        <button className="btn btn-outline-primary btn-sm mt-2">
                                            Xem {comp.jobs?.length || ''} việc làm
                                        </button>
                                    </div>
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

export default CompanyList;
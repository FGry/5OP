import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navbar State
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song 3 API (Company, Jobs, User)
                const promises = [
                    api.get(`/company/${id}`),
                    api.get(`/jobs/company/${id}`)
                ];

                const token = localStorage.getItem('token');
                if(token) promises.push(api.get('/profile/me'));

                const results = await Promise.all(promises);

                setCompany(results[0].data);
                setJobs(results[1].data);

                if(token && results[2]) {
                    const localUser = JSON.parse(localStorage.getItem('user'));
                    const role = localUser ? localUser.role : 'USER';
                    setUser({ ...results[2].data, role: role });
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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

    if (loading) return <div className="text-center p-5">Đang tải...</div>;
    if (!company) return <div className="text-center p-5">Không tìm thấy công ty</div>;

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar onOpenModal={setActiveModal} user={user} />

            {/* Banner Công ty */}
            <div style={{ backgroundColor: '#fff', padding: '40px 0', borderBottom: '1px solid #eee' }}>
                <div className="container">
                    <div className="d-flex align-items-center">
                        <img
                            src={company.logo || "https://via.placeholder.com/150"}
                            alt="logo"
                            style={{ width: '120px', height: '120px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '10px', marginRight: '30px' }}
                        />
                        <div>
                            <h1 style={{ fontWeight: 'bold', color: '#2c3e50' }}>{company.name}</h1>
                            <p className="text-muted"><i className="fas fa-map-marker-alt me-2"></i>{company.address}</p>
                            <p><i className="fas fa-globe me-2"></i><a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <h5 className="mb-3 font-weight-bold">Giới thiệu công ty</h5>
                            <p style={{ whiteSpace: 'pre-line', color: '#555' }}>
                                {company.description || "Chưa có mô tả."}
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <h4 className="mb-4 font-weight-bold">Việc làm đang tuyển ({jobs.length})</h4>
                        {jobs.length === 0 ? (
                            <p>Hiện công ty chưa có bài đăng tuyển dụng nào.</p>
                        ) : (
                            jobs.map(job => (
                                <div
                                    key={job.id}
                                    className="card mb-3 shadow-sm border-0 job-card"
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title text-primary font-weight-bold mb-1">{job.title}</h5>
                                            <span className="badge bg-success">
                                                {job.salaryMin ? `${(job.salaryMin/1000000).toFixed(0)} - ${(job.salaryMax/1000000).toFixed(0)} Triệu` : 'Thỏa thuận'}
                                            </span>
                                        </div>
                                        <div className="text-muted small mb-2">
                                            <span className="me-3"><i className="fas fa-map-marker-alt me-1"></i>{job.location}</span>
                                            <span><i className="fas fa-clock me-1"></i>{job.type}</span>
                                        </div>
                                        <p className="card-text text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {activeModal === 'profile' && renderProfilePanel()}
        </div>
    );
};

export default CompanyDetail;
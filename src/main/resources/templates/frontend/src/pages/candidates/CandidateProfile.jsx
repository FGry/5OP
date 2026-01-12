import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import './CandidateProfile.css';

const CandidateProfile = () => {
    const navigate = useNavigate();

    // --- State cho Navbar & Modal ---
    const [user, setUser] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    // --- State dữ liệu form ---
    const [profile, setProfile] = useState({
        fullName: '',
        dob: '',
        phone: '',
        address: '',
        email: '',
        cvUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin User để hiển thị Navbar và Form
                const response = await api.get('/profile/me');

                // Cập nhật User cho Navbar
                const localUser = JSON.parse(localStorage.getItem('user'));
                const role = localUser ? localUser.role : 'USER';
                setUser({ ...response.data, role: role });

                // Cập nhật dữ liệu vào Form
                if (response.data) {
                    setProfile({
                        fullName: response.data.fullName || '',
                        dob: response.data.dob || '',
                        phone: response.data.phone || '',
                        address: response.data.address || '',
                        email: response.data.email || '',
                        cvUrl: response.data.cvUrl || ''
                    });
                }
            } catch (error) {
                console.error("Lỗi tải hồ sơ:", error);
                // Nếu chưa đăng nhập thì đẩy về login
                if(error.response && error.response.status === 403) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- MENU PROFILE (Đồng bộ với MainInterface + Nút Trang chủ) ---
    const renderProfilePanel = () => (
        <div className="profile-panel">
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <h5>{user?.fullName}</h5>
                {user?.role === 'EMPLOYER' && <span className="badge bg-primary">Nhà tuyển dụng</span>}
            </div>
            <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
                {/* NÚT QUAY LẠI TRANG CHỦ */}
                <div onClick={() => navigate('/')} className="d-block py-2" style={{cursor:'pointer'}}>
                    <i className="fas fa-home me-2"></i>Trang chủ
                </div>

                <div onClick={() => setActiveModal(null)} className="d-block py-2" style={{cursor:'pointer', fontWeight:'bold'}}>
                    <i className="fas fa-id-card me-2"></i>Hồ sơ cá nhân
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

    // --- XỬ LÝ FORM ---
    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleUploadCV = async () => {
        if (!selectedFile) { alert("Vui lòng chọn file trước!"); return; }
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const res = await api.post('/profile/upload-cv', formData);
            setProfile(prev => ({ ...prev, cvUrl: res.data.cvUrl }));
            alert("Upload CV thành công!");
            setSelectedFile(null);
        } catch (error) { console.error(error); alert("Lỗi khi upload CV!"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await api.put('/profile/update', profile); alert("Cập nhật thành công!"); }
        catch (error) { alert("Cập nhật thất bại!"); }
    };

    if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Đang tải...</div>;

    return (
        <div style={{backgroundColor: '#f8f9fa', minHeight:'100vh'}}>
            {/* Navbar đồng bộ */}
            <Navbar onOpenModal={setActiveModal} user={user} />

            <div className="container py-5">
                <div className="profile-container" style={{maxWidth: '800px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
                    <h2 className="profile-title text-center mb-4">Hồ Sơ Cá Nhân</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                             <div className="col-md-6 mb-3">
                                <label className="form-label">Email (Không thể sửa):</label>
                                <input className="form-control" value={profile.email} readOnly disabled style={{background: '#e9ecef'}}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Số điện thoại (Không thể sửa):</label>
                                <input className="form-control" value={profile.phone} readOnly disabled style={{background: '#e9ecef'}}/>
                            </div>
                        </div>

                        {/* Upload CV */}
                        <div className="mb-4 p-3 bg-light rounded border">
                            <label className="form-label fw-bold">Hồ sơ năng lực (CV):</label>
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="form-control w-auto" />
                                <button type="button" onClick={handleUploadCV} className="btn btn-primary">
                                    <i className="fas fa-cloud-upload-alt me-1"></i> Tải lên
                                </button>
                            </div>
                            {profile.cvUrl && (
                                <div className="mt-2">
                                    <i className="fas fa-check-circle text-success me-1"></i>
                                    <a href={`http://localhost:8080${profile.cvUrl}`} target="_blank" rel="noreferrer" className="text-decoration-none">
                                        Xem CV hiện tại
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Họ và tên:</label>
                            <input className="form-control" name="fullName" value={profile.fullName} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ngày sinh:</label>
                            <input className="form-control" type="date" name="dob" value={profile.dob} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ:</label>
                            <input className="form-control" type="text" name="address" value={profile.address} onChange={handleChange} placeholder="Nhập địa chỉ..." />
                        </div>

                        <button type="submit" className="btn btn-success w-100 py-2 mt-3 fw-bold">Lưu Thay Đổi</button>
                    </form>
                </div>
            </div>

            {/* Modal Profile */}
            {activeModal === 'profile' && renderProfilePanel()}
        </div>
    );
};

export default CandidateProfile;
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './CandidateProfile.css';

const CandidateProfile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        dob: '',
        phone: '',
        address: '',
        email: '',
        cvUrl: ''
    });

    const [selectedFile, setSelectedFile] = useState(null); // File đang chọn
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/me');
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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadCV = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn file trước!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await api.post('/profile/upload-cv', formData);

            // Cập nhật lại Link CV ngay lập tức
            setProfile(prev => ({ ...prev, cvUrl: res.data.cvUrl }));

            alert("Upload CV thành công!");
            setSelectedFile(null); // Reset ô chọn file
        } catch (error) {
            console.error(error);
            alert("Lỗi khi upload CV! Vui lòng thử lại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile/update', profile);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error(error);
            alert("Cập nhật thất bại!");
        }
    };

    if (loading) return <div className="profile-container" style={{textAlign:'center'}}>Đang tải dữ liệu...</div>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">Hồ Sơ Cá Nhân</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email đăng ký:</label>
                    <input
                        className="form-input readonly"
                        type="email"
                        value={profile.email}
                        readOnly
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Số điện thoại:</label>
                    <input
                        className="form-input readonly"
                        type="text"
                        value={profile.phone}
                        readOnly
                        disabled
                        placeholder="Số điện thoại đăng ký"
                    />
                </div>

                <div className="file-upload-wrapper">
                    <label className="form-label">Hồ sơ năng lực (CV):</label>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileChange}
                            style={{ fontSize: '0.9rem' }}
                        />
                        <button type="button" onClick={handleUploadCV} className="btn-upload">
                            <i className="fas fa-cloud-upload-alt" style={{marginRight:'5px'}}></i> Tải lên
                        </button>
                    </div>

                    {/* Hiển thị Link CV nếu đã có */}
                    {profile.cvUrl && (
                        <div style={{ marginTop: '15px' }}>
                            <i className="fas fa-file-alt" style={{ marginRight: '5px', color: '#27ae60' }}></i>
                            <span style={{ color: '#2c3e50', fontSize: '0.9rem' }}>CV hiện tại: </span>
                            <a
                                href={`http://localhost:8080${profile.cvUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cv-link"
                            >
                                Xem / Tải xuống CV
                            </a>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Họ và tên:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Ngày sinh:</label>
                    <input
                        className="form-input"
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Địa chỉ:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ hiện tại"
                    />
                </div>

                <button type="submit" className="btn-save-profile">
                    Lưu Thay Đổi
                </button>
            </form>
        </div>
    );
};

export default CandidateProfile;
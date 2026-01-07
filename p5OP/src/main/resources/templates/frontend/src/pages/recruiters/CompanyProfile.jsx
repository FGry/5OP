import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './CompanyProfile.css'; // Import CSS

const CompanyProfile = () => {
    const [company, setCompany] = useState({ name: '', description: '', website: '', location: '', logo: '', scale: 'STARTUP' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get('/company/my-company');
                if (res.data) setCompany(res.data);
            } catch (error) { console.error("Lỗi:", error); }
            finally { setLoading(false); }
        };
        fetchCompany();
    }, []);

    const handleChange = (e) => setCompany({ ...company, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/company/save', company);
            setMessage('Lưu thông tin công ty thành công!');
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data || "Có lỗi xảy ra"));
        }
    };

    if (loading) return <div className="company-profile-container">Đang tải...</div>;

    return (
        <div className="company-profile-container">
            <h2 className="company-title">Hồ Sơ Công Ty</h2>
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                {/* Cột Trái */}
                <div>
                    <div className="form-group">
                        <label className="form-label">Tên công ty <span className="required">*</span></label>
                        <input className="form-input" type="text" name="name" value={company.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Website</label>
                        <input className="form-input" type="text" name="website" value={company.website || ''} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Quy mô <span className="required">*</span></label>
                        <select className="form-select" name="scale" value={company.scale} onChange={handleChange}>
                            <option value="STARTUP">Startup (1-10 NV)</option>
                            <option value="SMALL">Nhỏ (10-50 NV)</option>
                            <option value="MEDIUM">Vừa (50-200 NV)</option>
                            <option value="LARGE">Lớn (200-1000 NV)</option>
                            <option value="ENTERPRISE">Tập đoàn (>1000 NV)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Địa chỉ trụ sở <span className="required">*</span></label>
                        <input className="form-input" type="text" name="location" value={company.location} onChange={handleChange} required />
                    </div>
                </div>

                {/* Cột Phải */}
                <div>
                    <div className="form-group">
                        <label className="form-label">Logo (URL Ảnh) <span className="required">*</span></label>
                        <input className="form-input" type="text" name="logo" value={company.logo} onChange={handleChange} required placeholder="Dán link ảnh logo..." />
                        {company.logo && (
                            <div className="logo-preview">
                                <img src={company.logo} alt="Logo Preview" className="logo-img" onError={(e) => e.target.style.display='none'} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Hàng Full Width */}
                <div className="full-width">
                    <div className="form-group">
                        <label className="form-label">Mô tả công ty</label>
                        <textarea className="form-textarea" name="description" value={company.description || ''} onChange={handleChange} rows="5"></textarea>
                    </div>
                    <button type="submit" className="btn-save-company">Lưu Thông Tin</button>
                </div>
            </form>
        </div>
    );
};
export default CompanyProfile;
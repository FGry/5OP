import { useState } from 'react';
import { registerUser } from '../api/authService';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Import CSS

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', password: '', fullName: '', email: '', phoneNumber: '', role: 'USER'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const message = await registerUser(formData);
            alert(message);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(typeof err === 'string' ? err : "Có lỗi xảy ra");
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Đăng Ký Tài Khoản</h2>
            {error && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group"><input className="form-input" type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} required /></div>
                <div className="form-group"><input className="form-input" type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required /></div>
                <div className="form-group"><input className="form-input" type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} required /></div>
                <div className="form-group"><input className="form-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><input className="form-input" type="tel" name="phoneNumber" placeholder="Số điện thoại" value={formData.phoneNumber} onChange={handleChange} required /></div>

                <div className="form-group">
                    <label className="form-label">Bạn là: </label>
                    <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                        <option value="USER">Ứng viên tìm việc</option>
                        <option value="EMPLOYER">Nhà tuyển dụng</option>
                    </select>
                </div>

                <button type="submit" className="btn-register">Đăng Ký Ngay</button>
            </form>

            <div className="login-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
        </div>
    );
};
export default RegisterPage;
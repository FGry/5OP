import { useState } from 'react';
import { loginUser } from '../api/authService';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(credentials);
            alert("Đăng nhập thành công! Xin chào " + data.username);

            // Chuyển hướng dựa trên Role
            if (data.role === 'ADMIN') navigate('/admin');
            else if (data.role === 'EMPLOYER') navigate('/employer');
            else navigate('/');

        } catch (err) {
            console.error(err);
            setError(typeof err === 'string' ? err : "Đăng nhập thất bại");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Đăng Nhập</h2>
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input className="form-input" type="text" name="username" placeholder="Tên đăng nhập" value={credentials.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input className="form-input" type="password" name="password" placeholder="Mật khẩu" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-login">Đăng Nhập</button>
            </form>

            <div className="register-link">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
        </div>
    );
};
export default LoginPage;
import { useState } from 'react';
import { loginUser } from '../api/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser(credentials);
            alert("Đăng nhập thành công! Xin chào " + data.username);

            if (data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError(typeof err === 'string' ? err : "Đăng nhập thất bại");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Đăng Nhập</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text" name="username" placeholder="Tên đăng nhập"
                        value={credentials.username} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password" name="password" placeholder="Mật khẩu"
                        value={credentials.password} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', width: '100%' }}>
                    Đăng Nhập
                </button>
            </form>

            <p style={{ marginTop: '10px' }}>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </div>
    );
};

export default LoginPage;
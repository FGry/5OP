import { useState } from 'react';
import { registerUser } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        role: 'USER'
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Đăng Ký Tài Khoản</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text" name="username" placeholder="Tên đăng nhập"
                        value={formData.username} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password" name="password" placeholder="Mật khẩu"
                        value={formData.password} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text" name="fullName" placeholder="Họ và tên"
                        value={formData.fullName} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="email" name="email" placeholder="Email"
                        value={formData.email} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="tel" name="phoneNumber" placeholder="Số điện thoại"
                        value={formData.phoneNumber} onChange={handleChange} required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Bạn là: </label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="USER">Ứng viên tìm việc</option>
                        <option value="ADMIN">Nhà tuyển dụng (Test)</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Đăng Ký Ngay
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
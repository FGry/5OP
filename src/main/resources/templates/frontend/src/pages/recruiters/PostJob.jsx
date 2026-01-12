import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './PostJob.css'; // Sử dụng lại CSS cũ

const PostJob = () => {
    const navigate = useNavigate();

    // State khớp hoàn toàn với Job.java của bạn
    const [jobData, setJobData] = useState({
        title: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        type: 'FULL_TIME', // Giá trị mặc định phải khớp Enum
        deadLine: '',      // Khớp tên biến deadLine (chữ L viết hoa)
        description: '',
        requirements: '',
        benefits: '',      // Trường bắt buộc mới
        status: 'OPEN'     // Mặc định mở
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation cơ bản (chuyển đổi lương sang số nếu cần, nhưng input type="number" đã hỗ trợ)
        const payload = {
            ...jobData,
            salaryMin: parseFloat(jobData.salaryMin), // Đảm bảo là số để khớp BigDecimal
            salaryMax: parseFloat(jobData.salaryMax)
        };

        try {
            await api.post('/jobs/create', payload);
            alert('Đăng tin tuyển dụng thành công!');
            navigate('/employer');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 500) {
                alert("Lỗi: Vui lòng kiểm tra lại thông tin (đặc biệt là Quyền lợi và Lương)!");
            } else {
                alert("Đăng tin thất bại. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="post-job-container">
            <h2 className="page-title">Đăng Tin Tuyển Dụng Mới</h2>

            <form onSubmit={handleSubmit} className="form-grid">
                {/* 1. Tiêu đề */}
                <div className="full-width">
                    <label className="form-label">Tiêu đề công việc <span style={{color:'red'}}>*</span></label>
                    <input className="form-input" type="text" name="title" placeholder="VD: Senior Java Developer" required onChange={handleChange} />
                </div>

                {/* 2. Mức lương (Min - Max) */}
                <div>
                    <label className="form-label">Lương tối thiểu (VNĐ)</label>
                    <input className="form-input" type="number" name="salaryMin" placeholder="VD: 10000000" onChange={handleChange} />
                </div>
                <div>
                    <label className="form-label">Lương tối đa (VNĐ)</label>
                    <input className="form-input" type="number" name="salaryMax" placeholder="VD: 30000000" onChange={handleChange} />
                </div>

                {/* 3. Địa điểm & Loại hình */}
                <div>
                    <label className="form-label">Địa điểm làm việc <span style={{color:'red'}}>*</span></label>
                    <input className="form-input" type="text" name="location" placeholder="VD: Hà Nội" required onChange={handleChange} />
                </div>

                <div>
                    <label className="form-label">Loại hình</label>
                    {/* Value phải KHỚP với Enum JobType trong Backend */}
                    <select className="form-select" name="type" onChange={handleChange} value={jobData.type}>
                        <option value="FULL_TIME">Toàn thời gian</option>
                        <option value="PART_TIME">Bán thời gian</option>
                        <option value="INTERNSHIP">Thực tập</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="REMOTE">Làm từ xa</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>

                {/* 4. Hạn nộp */}
                <div className="full-width">
                    <label className="form-label">Hạn nộp hồ sơ</label>
                    <input className="form-input" type="datetime-local" name="deadLine" onChange={handleChange} />
                </div>

                {/* 5. Các trường văn bản dài (Textarea) */}
                <div className="full-width">
                    <label className="form-label">Mô tả công việc <span style={{color:'red'}}>*</span></label>
                    <textarea className="form-textarea" name="description" rows="5" placeholder="Mô tả chi tiết..." required onChange={handleChange}></textarea>
                </div>

                <div className="full-width">
                    <label className="form-label">Yêu cầu ứng viên <span style={{color:'red'}}>*</span></label>
                    <textarea className="form-textarea" name="requirements" rows="4" placeholder="Kỹ năng yêu cầu..." required onChange={handleChange}></textarea>
                </div>

                {/* Trường Benefits (Bắt buộc theo Job.java của bạn) */}
                <div className="full-width">
                    <label className="form-label">Quyền lợi <span style={{color:'red'}}>*</span></label>
                    <textarea className="form-textarea" name="benefits" rows="4" placeholder="Bảo hiểm, thưởng, du lịch..." required onChange={handleChange}></textarea>
                </div>

                <div className="full-width">
                    <button type="submit" className="btn-submit-job">Đăng Tin Ngay</button>
                    <button type="button" onClick={() => navigate('/employer')} style={{marginTop:'10px', background:'none', border:'none', color:'#7f8c8d', cursor:'pointer', width:'100%'}}>Hủy bỏ</button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
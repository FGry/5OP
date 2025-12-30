import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import './JobDetail.css';

const JobDetail = () => {
  // --- States ---
  const [activeModal, setActiveModal] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState(null);

  // --- Mock Data (Thay thế cho defaultConfig) ---
  const jobData = {
    title: "Senior Frontend Developer",
    company: "FPT Software",
    logo: "🏢",
    location: "Hà Nội",
    experience: "3-5 năm kinh nghiệm",
    type: "Full-time",
    deadline: "31/12/2024",
    salary: "20-30 triệu VNĐ",
    description: "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm để tham gia đội ngũ phát triển sản phẩm. Bạn sẽ làm việc với các công nghệ hiện đại như React, Vue.js và tham gia xây dựng các ứng dụng web quy mô lớn phục vụ hàng triệu người dùng.",
    requirements: [
      "3-5 năm kinh nghiệm lập trình Frontend với các dự án thực tế",
      "Thành thạo HTML5, CSS3, JavaScript (ES6+)",
      "Có kinh nghiệm với React hoặc Vue.js framework",
      "Hiểu biết về Responsive Design và Cross-browser compatibility",
      "Kỹ năng làm việc nhóm tốt, giao tiếp hiệu quả",
      "Có kinh nghiệm với Git và Agile/Scrum là một lợi thế"
    ],
    benefits: [
      "Mức lương cạnh tranh: 20-30 triệu VNĐ tùy theo năng lực",
      "Thưởng hiệu suất hàng quý, thưởng cuối năm lên đến 3-4 tháng lương",
      "Bảo hiểm đầy đủ theo quy định pháp luật + bảo hiểm sức khỏe cao cấp",
      "Chế độ nghỉ phép 12 ngày/năm + nghỉ lễ theo quy định",
      "Môi trường làm việc chuyên nghiệp, năng động và thân thiện"
    ],
    companyInfo: {
        size: "1000+ nhân viên",
        website: "https://www.fpt-software.com",
        description: "FPT Software là công ty công nghệ hàng đầu Việt Nam, cung cấp các giải pháp chuyển đổi số toàn diện cho doanh nghiệp. Với hơn 30 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn lớn trên toàn cầu."
    }
  };

  // --- Handlers ---
  const showToast = (message, color = '#3498db') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApply = () => {
    showToast(<span><i className="fas fa-check-circle me-2"></i>Đơn ứng tuyển của bạn đã được gửi!</span>, '#27ae60');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      showToast(<span><i className="fas fa-check-circle me-2"></i>Đã lưu công việc!</span>, '#27ae60');
    }
  };

  const handleContact = () => {
    setActiveModal('chat');
  };

  // --- Render Functions cho Modal (Tái sử dụng logic từ JobListing) ---
  const renderChatWindow = () => (
    <div className="chat-window">
        {/* Header Chat */}
        <div style={{ background: 'linear-gradient(135deg, #27ae60, #229954)', color: 'white', padding: '1rem', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h6 style={{ margin: 0, fontWeight: 700 }}>Nhắn tin với nhà tuyển dụng</h6>
                <small style={{ opacity: 0.9 }}>Đang hoạt động</small>
            </div>
            <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
        </div>
        {/* Body Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8f9fa' }}>
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '12px 12px 12px 0', maxWidth: '80%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem' }}>Xin chào! Cảm ơn bạn đã quan tâm. Tôi có thể giúp gì cho bạn?</p>
                    <small style={{ color: '#7f8c8d', fontSize: '0.75rem' }}>Vừa xong</small>
                </div>
            </div>
        </div>
        {/* Input Chat */}
        <div style={{ padding: '1rem', borderTop: '1px solid #ecf0f1', display: 'flex', gap: '0.5rem' }}>
            <input type="text" placeholder="Nhập tin nhắn..." style={{ flex: 1, border: '2px solid #ecf0f1', borderRadius: '20px', padding: '0.5rem 1rem', outline: 'none', fontSize: '0.9rem' }} />
            <button style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
  );

  // (Bạn có thể thêm renderNotificationPanel và renderProfilePanel tương tự như ở JobListing.jsx nếu cần)

  return (
    <div className="main-wrapper">
      {/* 1. Navbar (Tái sử dụng) */}
      <Navbar onOpenModal={setActiveModal} />

      {/* 2. Main Content */}
      <section className="content-section">
        <div className="container">
          <div className="row">

            {/* Cột trái: Thông tin chi tiết */}
            <div className="col-lg-8">
              {/* Job Header */}
              <div className="job-header-card">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="company-logo-large">{jobData.logo}</div>
                  <div className="flex-grow-1">
                    <h1 className="job-title-main">{jobData.title}</h1>
                    <h2 className="company-name-main">{jobData.company}</h2>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div className="meta-item"><i className="fas fa-map-marker-alt"></i> {jobData.location}</div>
                      <div className="meta-item"><i className="fas fa-briefcase"></i> {jobData.experience}</div>
                      <div className="meta-item"><i className="fas fa-clock"></i> {jobData.type}</div>
                      <div className="meta-item"><i className="fas fa-calendar-alt"></i> Hạn: {jobData.deadline}</div>
                    </div>
                    <div className="salary-badge"><i className="fas fa-dollar-sign me-2"></i> {jobData.salary}</div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn-apply" onClick={handleApply}>
                    <i className="fas fa-paper-plane me-2"></i>Ứng tuyển ngay
                  </button>
                  <button className={`btn-save ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                    <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark me-1`}></i>
                    {isSaved ? 'Đã lưu' : 'Lưu tin'}
                  </button>
                  <button className="btn-contact" onClick={handleContact}>
                    <i className="fas fa-comment-dots me-2"></i>Liên hệ
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-file-alt"></i> Mô tả công việc</h3>
                <p className="info-card-text">{jobData.description}</p>
              </div>

              {/* Requirements */}
              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-clipboard-check"></i> Yêu cầu công việc</h3>
                <ul className="info-list">
                  {jobData.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                </ul>
              </div>

              {/* Benefits */}
              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-gift"></i> Quyền lợi</h3>
                <ul className="info-list">
                  {jobData.benefits.map((ben, idx) => <li key={idx}>{ben}</li>)}
                </ul>
              </div>
            </div>

            {/* Cột phải: Sidebar công ty */}
            <div className="col-lg-4">
              <div className="company-sidebar">
                <h3 className="info-card-title"><i className="fas fa-building"></i> Thông tin công ty</h3>
                <div className="company-logo-sidebar">{jobData.logo}</div>
                <h4 className="company-name-sidebar">{jobData.company}</h4>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="company-info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong className="company-info-label">Địa điểm:</strong>
                      <span className="company-info-value">{jobData.location}</span>
                    </div>
                  </div>
                  <div className="company-info-item">
                    <i className="fas fa-users"></i>
                    <div>
                      <strong className="company-info-label">Quy mô:</strong>
                      <span className="company-info-value">{jobData.companyInfo.size}</span>
                    </div>
                  </div>
                  <div className="company-info-item">
                    <i className="fas fa-globe"></i>
                    <div>
                      <strong className="company-info-label">Website:</strong>
                      <a href={jobData.companyInfo.website} target="_blank" rel="noopener noreferrer" className="company-info-link">
                        {jobData.companyInfo.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="company-desc-section">
                  <h5 className="company-desc-title">Giới thiệu công ty:</h5>
                  <p className="company-desc-text">{jobData.companyInfo.description}</p>
                </div>

                <button className="btn-view-jobs">
                    <i className="fas fa-building me-2"></i>Xem tất cả việc làm
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Footer (Có thể tách thành component riêng sau này) */}
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="footer-title">Về 5OP Jobs</h5>
              <p className="footer-description">5OP Jobs là nền tảng tuyển dụng hàng đầu Việt Nam.</p>
              <div className="footer-social">
                 <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                 <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            {/* Các cột footer khác... */}
          </div>
          <div className="footer-bottom">
            <p>© 2024 5OP Jobs. Bản quyền thuộc về Công ty Cổ phần 5OP Technology.</p>
          </div>
        </div>
      </footer>

      {/* 4. Modals & Toasts */}
      {activeModal === 'chat' && renderChatWindow()}

      {toast && (
        <div className="toast-message" style={{ backgroundColor: toast.color }}>
            {toast.message}
        </div>
      )}
    </div>
  );
};

export default JobDetail;
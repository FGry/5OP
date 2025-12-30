import React, { useState, useEffect } from 'react';
import './MainInterface.css';

const MainInterface = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ];

  const [activeModal, setActiveModal] = useState(null); // 'chat', 'notification', 'profile', 'search'
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [savedJobs, setSavedJobs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'FPT Software', logo: '🏢', location: 'Hà Nội', exp: '3-5 năm kinh nghiệm', salary: '20-30 triệu VNĐ' },
    { id: 2, title: 'Marketing Manager', company: 'Viettel Group', logo: '💼', location: 'TP. Hồ Chí Minh', exp: '5+ năm kinh nghiệm', salary: '25-35 triệu VNĐ' },
    { id: 3, title: 'Full Stack Developer', company: 'VNG Corporation', logo: '🚀', location: 'TP. Hồ Chí Minh', exp: '2-4 năm kinh nghiệm', salary: '18-28 triệu VNĐ' },
    { id: 4, title: 'Mobile App Developer', company: 'Tiki Corporation', logo: '📱', location: 'Hà Nội', exp: '1-3 năm kinh nghiệm', salary: '15-25 triệu VNĐ' },
    { id: 5, title: 'UI/UX Designer', company: 'Shopee Vietnam', logo: '🎨', location: 'Đà Nẵng', exp: '2-3 năm kinh nghiệm', salary: '12-20 triệu VNĐ' },
    { id: 6, title: 'Data Analyst', company: 'Momo E-wallet', logo: '📊', location: 'TP. Hồ Chí Minh', exp: '1-2 năm kinh nghiệm', salary: '12-18 triệu VNĐ' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const showToast = (message, color = '#3498db') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSaveJob = (e, jobId) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const isSaved = !prev[jobId];
      if (isSaved) showToast('Đã lưu công việc!', '#27ae60');
      return { ...prev, [jobId]: isSaved };
    });
  };

  const handleSearch = () => {
    setActiveModal('search');
  };

  const handleFilterChange = () => {
    showToast('Đang lọc công việc...', '#3498db');
  };

  const renderChatWindow = () => (
    <div className="chat-window">
      <div style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: 'white', padding: '1rem', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h6 style={{ margin: 0, fontWeight: 700 }}>Nhắn tin với nhà tuyển dụng</h6>
          <small style={{ opacity: 0.9 }}>Đang hoạt động</small>
        </div>
        <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8f9fa' }}>
        {/* Mock chat messages */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ background: 'white', padding: '0.75rem', borderRadius: '12px 12px 12px 0', maxWidth: '80%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem' }}>Xin chào! Tôi có thể giúp gì cho bạn?</p>
            <small style={{ color: '#7f8c8d', fontSize: '0.75rem' }}>10:30 AM</small>
          </div>
        </div>
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid #ecf0f1', display: 'flex', gap: '0.5rem' }}>
        <input type="text" placeholder="Nhập tin nhắn..." style={{ flex: 1, border: '2px solid #ecf0f1', borderRadius: '20px', padding: '0.5rem 1rem', outline: 'none', fontSize: '0.9rem' }} />
        <button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );

  const renderNotificationPanel = () => (
    <div className="notification-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Thông báo</h5>
        <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
      </div>
      <div style={{ borderBottom: '1px solid #ecf0f1', padding: '0.75rem 0' }}>
        <p style={{ margin: 0, color: '#2c3e50', fontWeight: 600 }}>FPT Software đã xem hồ sơ của bạn</p>
        <small style={{ color: '#7f8c8d' }}>2 giờ trước</small>
      </div>
      {/* Thêm các thông báo khác nếu cần */}
    </div>
  );

  const renderProfilePanel = () => (
    <div className="profile-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Hồ sơ cá nhân</h5>
        <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e74c3c, #c0392b)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>👤</div>
        <h6 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Nguyễn Văn A</h6>
        <small style={{ color: '#7f8c8d' }}>nguyenvana@email.com</small>
      </div>
      <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
        <a href="#" className="d-block py-2 text-decoration-none" style={{ color: '#34495e' }}>Xem hồ sơ đầy đủ</a>
        <a href="#" className="d-block py-2 text-decoration-none" style={{ color: '#34495e' }}>Công việc đã lưu</a>
        <a href="#" className="d-block py-2 text-decoration-none" style={{ color: '#e74c3c', fontWeight: 600 }}>Đăng xuất</a>
      </div>
    </div>
  );

  const renderJobDetail = () => (
    <>
      <div className="custom-modal-overlay" onClick={() => setSelectedJob(null)}></div>
      <div className="detail-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Chi tiết công việc</h4>
          <button onClick={() => setSelectedJob(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h5 style={{ color: '#2c3e50', fontWeight: 700 }}>{selectedJob.title}</h5>
          <p style={{ color: '#7f8c8d', margin: '0.5rem 0' }}>{selectedJob.company}</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h6 style={{ color: '#2c3e50', fontWeight: 600 }}>Mô tả công việc:</h6>
          <p style={{ color: '#34495e' }}>Đây là nội dung mô tả công việc mẫu. Ứng viên sẽ làm việc tại {selectedJob.location} với mức lương {selectedJob.salary}.</p>
        </div>
        <button style={{ width: '100%', background: '#e74c3c', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>Ứng tuyển ngay</button>
      </div>
    </>
  );

  const renderCompanyInfo = () => (
    <>
      <div className="custom-modal-overlay" onClick={() => setSelectedCompany(null)}></div>
      <div className="detail-panel" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Thông tin công ty</h4>
          <button onClick={() => setSelectedCompany(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedCompany.logo}</div>
          <h5 style={{ color: '#2c3e50', fontWeight: 700, marginBottom: '0.5rem' }}>{selectedCompany.company}</h5>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Công ty hàng đầu tại {selectedCompany.location}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button style={{ flex: 1, background: '#e74c3c', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả việc làm</button>
          <button onClick={() => setSelectedCompany(null)} style={{ flex: 1, background: 'white', color: '#e74c3c', border: '2px solid #e74c3c', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Đóng</button>
        </div>
      </div>
    </>
  );

  return (
    <div className="main-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <a className="navbar-brand" href="/" id="site-title">
            5OP <span>Jobs</span>
          </a>
          <div className="navbar-menu d-none d-lg-flex">
            <button className="nav-menu-item active">
              <i className="fas fa-home"></i> <span>Trang chủ</span>
            </button>
            <button className="nav-menu-item">
              <i className="fas fa-briefcase"></i> <span>Việc làm</span>
            </button>
            <button className="nav-menu-item">
              <i className="fas fa-building"></i> <span>Công ty</span>
            </button>
            <button className="nav-menu-item">
              <i className="fas fa-newspaper"></i> <span>Blog</span>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn-chat" onClick={() => setActiveModal('chat')} aria-label="Chat">
              <i className="fas fa-comment-dots"></i>
              <span className="badge-notify badge-chat">2</span>
            </button>
            <button className="btn-notification" onClick={() => setActiveModal('notification')} aria-label="Thông báo">
              <i className="fas fa-bell"></i>
              <span className="badge-notify">3</span>
            </button>
            <button className="btn-profile" onClick={() => setActiveModal('profile')} aria-label="Hồ sơ">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="banner-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: slide.background }}
            ></div>
          ))}
        </div>
        <div className="container hero-content">
          <h1 className="hero-title text-center">Tìm kiếm công việc mơ ước của bạn</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Nhập vị trí, công ty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-search" onClick={handleSearch}>
              <i className="fas fa-search me-2"></i>Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3">
            <div className="filter-section">
              <h5 className="filter-title"><i className="fas fa-filter me-2"></i>Lọc công việc</h5>
              <div className="filter-group">
                <label htmlFor="filter-location">Địa điểm</label>
                <select id="filter-location" className="form-select" onChange={handleFilterChange}>
                  <option value="">Tất cả</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-experience">Kinh nghiệm</label>
                <select id="filter-experience" className="form-select" onChange={handleFilterChange}>
                  <option value="">Tất cả</option>
                  <option value="intern">Thực tập sinh</option>
                  <option value="1-3">1-3 năm</option>
                  <option value="5+">Trên 5 năm</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-type">Loại hình</label>
                <select id="filter-type" className="form-select" onChange={handleFilterChange}>
                  <option value="">Tất cả</option>
                  <option value="fulltime">Toàn thời gian</option>
                  <option value="remote">Làm từ xa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="col-lg-9">
            <div id="job-listings">
              {jobs.map((job) => (
                <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="company-logo" onClick={(e) => { e.stopPropagation(); setSelectedCompany(job); }}>
                        {job.logo}
                      </div>
                    </div>
                    <div className="col">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <div className="job-meta">
                        <div className="meta-item">
                          <i className="fas fa-map-marker-alt"></i> {job.location}
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-briefcase"></i> {job.exp}
                        </div>
                        <div className="meta-item">
                          <span className="salary-badge">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <button
                        className={`btn-save ${savedJobs[job.id] ? 'saved' : ''}`}
                        onClick={(e) => toggleSaveJob(e, job.id)}
                      >
                        <i className={`${savedJobs[job.id] ? 'fas' : 'far'} fa-bookmark me-1`}></i>
                        {savedJobs[job.id] ? 'Đã lưu' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
            {/* ... Other footer cols ... */}
            <div className="col-lg-2 col-md-6 mb-4">
               <h5 className="footer-title">Dành cho ứng viên</h5>
               <ul className="footer-links">
                 <li><a href="#">Tìm việc làm</a></li>
                 <li><a href="#">Danh sách công ty</a></li>
               </ul>
            </div>
             <div className="col-lg-2 col-md-6 mb-4">
               <h5 className="footer-title">Hỗ trợ</h5>
               <ul className="footer-links">
                 <li><a href="#">Liên hệ</a></li>
               </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 5OP Jobs. Bản quyền thuộc về Công ty Cổ phần 5OP Technology.</p>
          </div>
        </div>
      </footer>

      {/* Render Modals based on State */}
      {activeModal === 'chat' && renderChatWindow()}
      {activeModal === 'notification' && renderNotificationPanel()}
      {activeModal === 'profile' && renderProfilePanel()}
      {activeModal === 'search' && (
        <>
            <div className="custom-modal-overlay" onClick={() => setActiveModal(null)}></div>
            <div className="search-message">
                <i className="fas fa-search" style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}></i>
                <p style={{ margin: 0, color: '#2c3e50', fontSize: '1.1rem' }}>Đang tìm kiếm: <strong>{searchQuery || 'Tất cả'}</strong></p>
                <button onClick={() => setActiveModal(null)} style={{ marginTop: '1rem', background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Đóng</button>
            </div>
        </>
      )}

      {selectedJob && renderJobDetail()}
      {selectedCompany && renderCompanyInfo()}

      {toast && (
        <div className="toast-message" style={{ backgroundColor: toast.color }}>
            {toast.color === '#27ae60' && <i className="fas fa-check-circle me-2"></i>}
            {toast.color === '#3498db' && <i className="fas fa-filter me-2"></i>}
            {toast.message}
        </div>
      )}
    </div>
  );
};

export default MainInterface;
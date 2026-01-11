import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './MainInterface.css';

const MainInterface = () => {
  const navigate = useNavigate();

  // --- 1. STATE QUẢN LÝ GIAO DIỆN ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ];

  const [activeModal, setActiveModal] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [toast, setToast] = useState(null);

  // --- 2. STATE DỮ LIỆU ---
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [savedJobIds, setSavedJobIds] = useState([]);

  // --- 3. STATE TÌM KIẾM & BỘ LỌC ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  // --- EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    checkLoginStatus();
    fetchJobs();
  }, []);

  // --- API FUNCTIONS ---
  const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
          const res = await api.get('/jobs/search', {
              params: {
                  keyword: searchQuery || null,
                  location: (filterLocation === 'Tất cả' || filterLocation === '') ? null : filterLocation,
                  type: (filterType === 'Tất cả' || filterType === '') ? null : filterType,
                  salary: (filterSalary === 'Tất cả' || filterSalary === '') ? null : filterSalary
              }
          });
          // Kiểm tra an toàn dữ liệu mảng
          if (Array.isArray(res.data)) {
              setJobs(res.data);
          } else {
              setJobs([]);
          }
      } catch (error) {
          console.error("Lỗi tải danh sách việc làm:", error);
          setJobs([]);
      } finally {
          setLoadingJobs(false);
      }
  };

  const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
          try {
              const res = await api.get('/profile/me');
              const localUser = JSON.parse(localStorage.getItem('user'));
              const role = localUser ? localUser.role : 'USER';
              setUser({ ...res.data, role: role });

              if (role === 'USER') {
                  fetchSavedJobs();
              }
          } catch (error) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
          }
      }
  };

  const fetchSavedJobs = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const res = await api.get('/activity/saved');
      if (Array.isArray(res.data)) {
        const ids = res.data.map(item => item.id); // Lưu ý: item là Job do backend trả về List<Job>
        setSavedJobIds(ids);
      }
    } catch (err) { console.error(err); }
  };

  const toggleSaveJob = async (e, jobId) => {
    e.stopPropagation();
    if (!user) {
        showToast('Vui lòng đăng nhập để lưu công việc!', '#e74c3c');
        navigate('/login');
        return;
    }
    if (user.role === 'EMPLOYER') {
        showToast('Nhà tuyển dụng không thể lưu công việc!', '#e74c3c');
        return;
    }

    try {
      await api.post(`/activity/save/${jobId}`);
      if (savedJobIds.includes(jobId)) {
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
        showToast('Đã bỏ lưu công việc!', '#e74c3c');
      } else {
        setSavedJobIds(prev => [...prev, jobId]);
        showToast('Đã lưu công việc!', '#27ae60');
      }
    } catch (error) {
      showToast('Lỗi khi thao tác!', '#e74c3c');
    }
  };

  const handleSearch = () => {
      fetchJobs();
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setActiveModal(null);
      setSavedJobIds([]);
      navigate('/login');
  };

  // --- HELPER FUNCTIONS ---
  const showToast = (message, color = '#3498db') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const formatSalary = (min, max) => {
      if (!min && !max) return 'Thỏa thuận';
      if (min && !max) return `Từ ${min.toLocaleString()} VNĐ`;
      if (!min && max) return `Đến ${max.toLocaleString()} VNĐ`;
      return `${(min/1000000).toFixed(0)} - ${(max/1000000).toFixed(0)} Triệu VNĐ`;
  };

  const formatType = (type) => {
      const types = {'FULL_TIME': 'Toàn thời gian', 'PART_TIME': 'Bán thời gian', 'INTERNSHIP': 'Thực tập', 'FREELANCE': 'Freelance', 'REMOTE': 'Remote', 'HYBRID': 'Hybrid'};
      return types[type] || type;
  };

  // --- RENDER MODALS ---

  // MENU PROFILE (Đã cập nhật giống các trang khác)
  const renderProfilePanel = () => (
    <div className="profile-panel">
      <div style={{ textAlign: 'center', padding: '10px' }}>
          <h5>{user?.fullName}</h5>
          {user?.role === 'EMPLOYER' && <span className="badge bg-primary">Nhà tuyển dụng</span>}
      </div>
      <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
        <div onClick={() => navigate('/')} className="d-block py-2" style={{cursor:'pointer', fontWeight: 'bold'}}>
            <i className="fas fa-home me-2"></i>Trang chủ
        </div>

        <div onClick={() => navigate('/profile')} className="d-block py-2" style={{cursor:'pointer'}}>
            <i className="fas fa-id-card me-2"></i>Xem hồ sơ
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

        {user?.role === 'EMPLOYER' && (
            <div onClick={() => navigate('/employer')} className="d-block py-2" style={{cursor:'pointer', fontWeight:'bold'}}>
                <i className="fas fa-briefcase me-2"></i>Trang quản lý
            </div>
        )}

        <div onClick={handleLogout} className="d-block py-2 text-danger" style={{cursor:'pointer'}}>
            <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </div>
      </div>
    </div>
  );

  const renderChatWindow = () => (
      <div className="chat-window">
        <div style={{ background: '#27ae60', color: 'white', padding: '10px', borderRadius: '10px 10px 0 0', display:'flex', justifyContent:'space-between'}}>
            <span>Chat</span>
            <button onClick={()=>setActiveModal(null)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>x</button>
        </div>
        <div style={{padding:'20px', height:'400px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            Tính năng đang phát triển...
        </div>
      </div>
  );

  const renderNotificationPanel = () => (<div className="notification-panel">Thông báo (Trống)</div>);

  const renderCompanyInfo = () => (
      <div className="custom-modal-overlay" onClick={()=>setSelectedCompany(null)}>
          <div className="detail-panel" onClick={(e)=>e.stopPropagation()}>
              <h4>{selectedCompany?.name}</h4>
              <p><strong>Địa chỉ:</strong> {selectedCompany?.address || 'Chưa cập nhật'}</p>
              <p><strong>Website:</strong> <a href={selectedCompany?.website} target="_blank" rel="noreferrer">{selectedCompany?.website || 'Chưa cập nhật'}</a></p>
              <hr/>
              <p>{selectedCompany?.description}</p>
              <button className="btn btn-secondary mt-3" onClick={()=>setSelectedCompany(null)}>Đóng</button>
          </div>
      </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="main-wrapper">
      {/* 1. Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={() => window.location.href='/'}>5OP <span>Jobs</span></Link>

          {/* MENU NAVBAR */}
          <div className="navbar-menu d-none d-lg-flex" style={{flex: 1, justifyContent: 'center', gap: '20px'}}>
              <button className="nav-menu-item active" style={{background:'none', border:'none'}} onClick={() => window.location.href='/'}>
                  <i className="fas fa-home"></i> <span style={{display:'block'}}>Trang chủ</span>
              </button>
              <button className="nav-menu-item" style={{background:'none', border:'none'}} onClick={() => navigate('/jobs')}>
                  <i className="fas fa-briefcase"></i> <span style={{display:'block'}}>Việc làm</span>
              </button>
              <button className="nav-menu-item" style={{background:'none', border:'none'}} onClick={() => window.location.href='/company'}>
                  <i className="fas fa-building"></i> <span style={{display:'block'}}>Công ty</span>
              </button>
              <button className="nav-menu-item" style={{background:'none', border:'none'}}>
                  <i className="fas fa-newspaper"></i> <span style={{display:'block'}}>Blog</span>
              </button>
          </div>

          <div className="d-flex align-items-center gap-2">
             {user ? (
                 <div className="d-flex align-items-center">
                    <button className="btn-chat" onClick={()=>setActiveModal('chat')}><i className="fas fa-comment-dots"></i></button>
                    <button className="btn-notification" onClick={()=>setActiveModal('notification')}><i className="fas fa-bell"></i></button>
                    <button className="btn-profile" onClick={()=>setActiveModal(activeModal === 'profile' ? null : 'profile')}>
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </button>
                 </div>
             ) : (
                 <div className="auth-buttons">
                     <Link to="/login" className="btn-login-nav">Đăng nhập</Link>
                     <Link to="/register" className="btn-register-nav">Đăng ký</Link>
                 </div>
             )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (Banner) */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title text-center">Tìm kiếm công việc mơ ước</h1>
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

      {/* 3. Main Content (Filters & List) */}
      <div className="container" style={{marginTop: '40px', marginBottom: '40px'}}>
        <div className="row">

          {/* Cột trái: Bộ lọc */}
          <div className="col-lg-3">
             <div className="filter-section">
                 <h5 className="filter-title">Lọc công việc</h5>

                 {/* Lọc Địa điểm */}
                 <div className="mb-3">
                     <label>Địa điểm</label>
                     <select className="form-control" onChange={(e) => setFilterLocation(e.target.value)}>
                         <option value="">Tất cả</option>
                         <option value="Hà Nội">Hà Nội</option>
                         <option value="Hồ Chí Minh">TP. HCM</option>
                         <option value="Đà Nẵng">Đà Nẵng</option>
                     </select>
                 </div>

                 {/* Lọc Loại hình */}
                 <div className="mb-3">
                     <label>Loại hình</label>
                     <select className="form-control" onChange={(e) => setFilterType(e.target.value)}>
                         <option value="">Tất cả</option>
                         <option value="FULL_TIME">Toàn thời gian</option>
                         <option value="PART_TIME">Bán thời gian</option>
                         <option value="INTERNSHIP">Thực tập</option>
                         <option value="REMOTE">Làm từ xa</option>
                         <option value="FREELANCE">Freelance</option>
                     </select>
                 </div>

                 {/* Lọc Mức lương */}
                 <div className="mb-3">
                     <label>Mức lương tối thiểu</label>
                     <select className="form-control" onChange={(e) => setFilterSalary(e.target.value)}>
                         <option value="">Tất cả</option>
                         <option value="5000000">Trên 5 triệu</option>
                         <option value="10000000">Trên 10 triệu</option>
                         <option value="15000000">Trên 15 triệu</option>
                         <option value="20000000">Trên 20 triệu</option>
                         <option value="30000000">Trên 30 triệu</option>
                     </select>
                 </div>

                 <button className="btn btn-primary w-100 mt-2" onClick={handleSearch}>Áp dụng bộ lọc</button>
             </div>
          </div>

          {/* Cột phải: Danh sách công việc */}
          <div className="col-lg-9">
            <div id="job-listings">
              {loadingJobs ? (
                  <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2">Đang tải danh sách...</p>
                  </div>
              ) : jobs.length === 0 ? (
                  <div className="text-center p-5 bg-light rounded">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <p>Không tìm thấy công việc nào phù hợp.</p>
                  </div>
              ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <div
                              className="company-logo"
                              onClick={(e) => { e.stopPropagation(); setSelectedCompany(job.company); }}
                              title="Xem thông tin công ty"
                          >
                              {job.company?.logo ? <img src={job.company.logo} alt="logo" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : '🏢'}
                          </div>
                        </div>
                        <div className="col">
                          <h3 className="job-title">{job.title}</h3>
                          <p className="company-name">{job.company?.name}</p>
                          <div className="job-meta">
                            <div className="meta-item"><i className="fas fa-map-marker-alt"></i> {job.location}</div>
                            <div className="meta-item"><i className="fas fa-briefcase"></i> {formatType(job.type)}</div>
                            <div className="meta-item"><span className="salary-badge">{formatSalary(job.salaryMin, job.salaryMax)}</span></div>
                          </div>
                        </div>
                        <div className="col-auto">
                          {user?.role !== 'EMPLOYER' && (
                              <button
                                  className={`btn-save ${savedJobIds.includes(job.id) ? 'saved' : ''}`}
                                  onClick={(e) => toggleSaveJob(e, job.id)}
                                  title={savedJobIds.includes(job.id) ? "Bỏ lưu" : "Lưu công việc"}
                              >
                                <i className={`${savedJobIds.includes(job.id) ? 'fas' : 'far'} fa-bookmark me-1`}></i>
                                {savedJobIds.includes(job.id) ? 'Đã lưu' : 'Lưu'}
                              </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <footer className="footer-section">
         <div className="container"><p className="text-center text-white">© 2024 5OP Jobs</p></div>
      </footer>

      {/* 5. Modals & Popups */}
      {activeModal === 'chat' && renderChatWindow()}
      {activeModal === 'notification' && renderNotificationPanel()}
      {activeModal === 'profile' && renderProfilePanel()}
      {selectedCompany && renderCompanyInfo()}

      {/* Toast Message */}
      {toast && <div className="toast-message" style={{ backgroundColor: toast.color }}>{toast.message}</div>}
    </div>
  );
};

export default MainInterface;
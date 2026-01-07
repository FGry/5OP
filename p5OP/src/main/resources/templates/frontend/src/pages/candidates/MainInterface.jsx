import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios'; // Đảm bảo đường dẫn import đúng tới file axios của bạn
import './MainInterface.css';

const MainInterface = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ UI ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ];

  const [activeModal, setActiveModal] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // --- STATE DỮ LIỆU ---
  const [user, setUser] = useState(null); // Thông tin user đang đăng nhập
  const [jobs, setJobs] = useState([]);   // Danh sách việc làm từ API
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Dữ liệu cá nhân (chỉ dành cho Ứng viên)
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobList, setSavedJobList] = useState([]);
  const [appliedJobList, setAppliedJobList] = useState([]);

  // --- HELPER FUNCTIONS ---

  // Format hiển thị mức lương
  const formatSalary = (min, max) => {
      if (!min && !max) return 'Thỏa thuận';
      if (min && !max) return `Từ ${min.toLocaleString()} VNĐ`;
      if (!min && max) return `Đến ${max.toLocaleString()} VNĐ`;
      return `${(min/1000000).toFixed(0)} - ${(max/1000000).toFixed(0)} Triệu VNĐ`;
  };

  // Format hiển thị loại hình công việc
  const formatType = (type) => {
      const types = {
          'FULL_TIME': 'Toàn thời gian',
          'PART_TIME': 'Bán thời gian',
          'INTERNSHIP': 'Thực tập',
          'FREELANCE': 'Freelance',
          'REMOTE': 'Làm từ xa',
          'HYBRID': 'Linh hoạt'
      };
      return types[type] || type;
  };

  // --- EFFECTS ---

  // Slide chạy tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Load dữ liệu khi vào trang
  useEffect(() => {
    checkLoginStatus();
    fetchJobs(); // Gọi API lấy danh sách việc làm
  }, []);

  // --- API CALLS ---

  const fetchJobs = async () => {
      try {
          // Gọi API public để lấy danh sách job (đã sắp xếp mới nhất ở Backend)
          const res = await api.get('/jobs/public');
          setJobs(res.data);
      } catch (error) {
          console.error("Lỗi tải danh sách việc làm:", error);
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

              // Nếu là Ứng viên thì tải thêm danh sách đã lưu/đã ứng tuyển
              if (role === 'USER') {
                  fetchSavedJobs();
                  fetchAppliedJobs();
              }
          } catch (error) {
              console.error("Token lỗi hoặc hết hạn:", error);
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
      setSavedJobList(res.data);
      const ids = res.data.map(item => item.id);
      setSavedJobIds(ids);
    } catch (err) { console.error(err); }
  };

  const fetchAppliedJobs = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const res = await api.get('/activity/applied');
      setAppliedJobList(res.data);
    } catch (err) { console.error(err); }
  };

  const toggleSaveJob = async (e, jobId) => {
    e.stopPropagation();
    if (!user) {
        showToast('Vui lòng đăng nhập để lưu công việc!', '#e74c3c');
        navigate('/login');
        return;
    }
    // Chặn Nhà tuyển dụng lưu job
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
      fetchSavedJobs(); // Refresh danh sách ngầm
    } catch (error) { showToast('Lỗi khi lưu công việc', '#e74c3c'); }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setActiveModal(null);
      setSavedJobIds([]);
      navigate('/login');
  };

  // --- UI RENDERING ---

  const showToast = (message, color = '#3498db') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = () => setActiveModal('search');

  // Modal: Hồ sơ cá nhân (Menu Dropdown)
  const renderProfilePanel = () => (
    <div className="profile-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>Hồ sơ cá nhân</h5>
        <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7f8c8d' }}>&times;</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e74c3c, #c0392b)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <h6 style={{ margin: 0, color: '#2c3e50', fontWeight: 700 }}>
            {user?.fullName || 'Người dùng'}
        </h6>
        {user?.role === 'EMPLOYER' ?
            <span className="badge bg-primary" style={{margin:'5px auto', display:'block', width:'fit-content', padding:'5px 10px', borderRadius:'10px', color:'white', fontSize:'0.8rem'}}>Nhà tuyển dụng</span> :
            <span className="badge bg-success" style={{margin:'5px auto', display:'block', width:'fit-content', padding:'5px 10px', borderRadius:'10px', color:'white', fontSize:'0.8rem'}}>Ứng viên</span>
        }
      </div>

      <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
        <div onClick={() => {navigate('/profile'); setActiveModal(null)}} className="d-block py-2 text-decoration-none" style={{ color: '#34495e', cursor: 'pointer' }}>
            Xem hồ sơ đầy đủ
        </div>

        {/* Menu cho Ứng viên */}
        {user?.role === 'USER' && (
            <>
                <div onClick={() => { fetchSavedJobs(); setActiveModal('saved-jobs'); }} className="d-block py-2 text-decoration-none" style={{ color: '#34495e', cursor: 'pointer' }}>
                    Công việc đã lưu
                </div>
                <div onClick={() => { fetchAppliedJobs(); setActiveModal('applied-jobs'); }} className="d-block py-2 text-decoration-none" style={{ color: '#34495e', cursor: 'pointer' }}>
                    Lịch sử ứng tuyển
                </div>
            </>
        )}

        {/* Menu cho Nhà tuyển dụng */}
        {user?.role === 'EMPLOYER' && (
            <div onClick={() => navigate('/employer')} className="d-block py-2 text-decoration-none" style={{ color: '#2c3e50', fontWeight: 'bold', cursor: 'pointer' }}>
                <i className="fas fa-chart-line me-2"></i>Trang quản lý
            </div>
        )}

        <div onClick={handleLogout} className="d-block py-2 text-decoration-none" style={{ color: '#e74c3c', fontWeight: 600, cursor: 'pointer' }}>
            Đăng xuất
        </div>
      </div>
    </div>
  );

  // Modal: Chi tiết công việc
  const renderJobDetail = () => (
      <>
        <div className="custom-modal-overlay" onClick={() => setSelectedJob(null)}></div>
        <div className="detail-panel">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h4 style={{color:'#2c3e50', fontWeight:'bold', margin:0}}>{selectedJob?.title}</h4>
                <button onClick={() => setSelectedJob(null)} style={{border:'none', background:'none', fontSize:'1.5rem', cursor:'pointer'}}>&times;</button>
            </div>
            <p style={{color:'#7f8c8d', fontWeight:'600', marginTop:'5px'}}>{selectedJob?.company?.name}</p>

            <div style={{margin:'20px 0', borderTop:'1px solid #eee', paddingTop:'15px'}}>
                <h5 style={{color:'#2c3e50', fontWeight:'bold'}}>Mô tả công việc:</h5>
                <p style={{whiteSpace: 'pre-line', color:'#34495e'}}>{selectedJob?.description}</p>

                <h5 style={{marginTop:'15px', color:'#2c3e50', fontWeight:'bold'}}>Yêu cầu ứng viên:</h5>
                <p style={{whiteSpace: 'pre-line', color:'#34495e'}}>{selectedJob?.requirements}</p>

                <h5 style={{marginTop:'15px', color:'#2c3e50', fontWeight:'bold'}}>Quyền lợi:</h5>
                <p style={{whiteSpace: 'pre-line', color:'#34495e'}}>{selectedJob?.benefits}</p>

                <div style={{marginTop:'15px', fontStyle:'italic', color:'#7f8c8d'}}>
                    Địa điểm: {selectedJob?.location} • Loại hình: {formatType(selectedJob?.type)}
                </div>
            </div>

            {/* Chỉ hiện nút Ứng tuyển cho Ứng viên */}
            {user?.role !== 'EMPLOYER' && (
                <button style={{width:'100%', padding:'12px', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', fontSize:'1rem', cursor:'pointer'}}>
                    Ứng tuyển ngay
                </button>
            )}
        </div>
      </>
  );

  // Modal: Thông tin công ty
  const renderCompanyInfo = () => (
      <>
        <div className="custom-modal-overlay" onClick={() => setSelectedCompany(null)}></div>
        <div className="detail-panel" style={{textAlign:'center'}}>
            <button onClick={() => setSelectedCompany(null)} style={{position:'absolute', right:'20px', top:'20px', border:'none', background:'none', fontSize:'1.5rem', cursor:'pointer'}}>&times;</button>
            <div style={{marginBottom:'1rem'}}>
                {selectedCompany?.logo ?
                    <img src={selectedCompany.logo} alt="logo" style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'15px'}} onError={(e)=>e.target.style.display='none'}/>
                    : <div style={{fontSize:'3rem'}}>🏢</div>
                }
            </div>
            <h4 style={{fontWeight:'bold', color:'#2c3e50'}}>{selectedCompany?.name}</h4>
            <p style={{color:'#7f8c8d'}}>{selectedCompany?.website}</p>
            <p>{selectedCompany?.description}</p>
        </div>
      </>
  );

  // Các Modal phụ khác (Chat, Notification, Saved List...)
  const renderSavedJobsModal = () => (
    <>
      <div className="custom-modal-overlay" onClick={() => setActiveModal(null)}></div>
      <div className="detail-panel">
        <h4>Công việc đã lưu</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {savedJobList.length === 0 ? <p style={{textAlign:'center', color:'#999'}}>Chưa lưu công việc nào.</p> : savedJobList.map(job => (
             <div key={job.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{job.title} - {job.company?.name}</div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAppliedJobsModal = () => (/* Code hiển thị lịch sử ứng tuyển */ <></>);
  const renderChatWindow = () => (<div className="chat-window"><div style={{padding:'1rem'}}>Hệ thống chat đang bảo trì</div></div>);
  const renderNotificationPanel = () => (<div className="notification-panel"><h5>Thông báo</h5><p>Chưa có thông báo mới</p></div>);

  // --- MAIN RENDER ---
  return (
    <div className="main-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <Link className="navbar-brand" to="/" id="site-title">5OP <span>Jobs</span></Link>
          <div className="navbar-menu d-none d-lg-flex">
            <button className="nav-menu-item active"><i className="fas fa-home"></i> <span>Trang chủ</span></button>
            <button className="nav-menu-item"><i className="fas fa-briefcase"></i> <span>Việc làm</span></button>
            <button className="nav-menu-item"><i className="fas fa-building"></i> <span>Công ty</span></button>
            <button className="nav-menu-item"><i className="fas fa-newspaper"></i> <span>Blog</span></button>
          </div>

          <div className="d-flex align-items-center">
            {user ? (
                <>
                    <button className="btn-chat" onClick={() => setActiveModal('chat')}><i className="fas fa-comment-dots"></i></button>
                    <button className="btn-notification" onClick={() => setActiveModal('notification')}><i className="fas fa-bell"></i></button>
                    <button className="btn-profile" onClick={() => setActiveModal('profile')}>
                         <div style={{width: '100%', height:'100%', borderRadius:'50%', background: '#e74c3c', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
                             {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                         </div>
                    </button>
                </>
            ) : (
                <div className="auth-buttons">
                    <Link to="/login" className="btn-login-nav">Đăng nhập</Link>
                    <Link to="/register" className="btn-register-nav">Đăng ký</Link>
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="banner-slider">
          {slides.map((slide, index) => (
            <div key={index} className={`banner-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: slide.background }}></div>
          ))}
        </div>
        <div className="container hero-content">
          <h1 className="hero-title text-center">
              {user ? `Chào mừng trở lại, ${user.fullName}!` : 'Tìm kiếm công việc mơ ước của bạn'}
          </h1>
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Nhập vị trí, công ty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="btn-search" onClick={handleSearch}><i className="fas fa-search me-2"></i>Tìm kiếm</button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="row">
          {/* Sidebar Filter */}
          <div className="col-lg-3">
             <div className="filter-section">
                 <h5 className="filter-title">Lọc công việc</h5>
                 <div className="filter-group">
                     <label>Địa điểm</label>
                     <select className="form-select"><option>Tất cả</option><option>Hà Nội</option><option>TP. HCM</option><option>Đà Nẵng</option></select>
                 </div>
                 <div className="filter-group">
                     <label>Loại hình</label>
                     <select className="form-select"><option>Tất cả</option><option>Toàn thời gian</option><option>Part-time</option></select>
                 </div>
             </div>
          </div>

          {/* Job Listings: HIỂN THỊ DỮ LIỆU THẬT */}
          <div className="col-lg-9">
            <div id="job-listings">
              {loadingJobs ? (
                  <div style={{textAlign:'center', padding:'20px', color:'#7f8c8d'}}>
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                      <p>Đang tải danh sách việc làm...</p>
                  </div>
              ) : jobs.length === 0 ? (
                  <div style={{textAlign:'center', padding:'40px', background:'white', borderRadius:'12px'}}>
                      <p style={{fontSize:'1.2rem', color:'#7f8c8d'}}>Chưa có tin tuyển dụng nào được đăng.</p>
                  </div>
              ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
                      <div className="row align-items-center">
                        <div className="col-auto">
                          {/* Logo Công Ty */}
                          <div className="company-logo" onClick={(e) => { e.stopPropagation(); setSelectedCompany(job.company); }}>
                             {job.company?.logo ?
                                <img src={job.company.logo} alt="logo" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px'}} onError={(e)=>e.target.style.display='none'} />
                                : <span style={{fontSize:'2rem'}}>🏢</span>
                             }
                          </div>
                        </div>
                        <div className="col">
                          <h3 className="job-title">{job.title}</h3>
                          <p className="company-name">{job.company?.name || 'Công ty ẩn danh'}</p>
                          <div className="job-meta">
                            <div className="meta-item"><i className="fas fa-map-marker-alt"></i> {job.location}</div>
                            <div className="meta-item"><i className="fas fa-clock"></i> {formatType(job.type)}</div>
                            <div className="meta-item"><span className="salary-badge">{formatSalary(job.salaryMin, job.salaryMax)}</span></div>
                          </div>
                        </div>
                        <div className="col-auto">
                          {/* Ẩn nút Lưu với Employer */}
                          {user?.role !== 'EMPLOYER' && (
                              <button className={`btn-save ${savedJobIds.includes(job.id) ? 'saved' : ''}`} onClick={(e) => toggleSaveJob(e, job.id)}>
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

      <footer className="footer-section">
         <div className="container"><p className="text-center text-white">© 2024 5OP Jobs. Nền tảng tuyển dụng hàng đầu.</p></div>
      </footer>

      {/* Render Modals */}
      {activeModal === 'chat' && renderChatWindow()}
      {activeModal === 'notification' && renderNotificationPanel()}
      {activeModal === 'profile' && renderProfilePanel()}
      {activeModal === 'saved-jobs' && renderSavedJobsModal()}
      {activeModal === 'applied-jobs' && renderAppliedJobsModal()}

      {activeModal === 'search' && (
        <>
            <div className="custom-modal-overlay" onClick={() => setActiveModal(null)}></div>
            <div className="search-message">
                <i className="fas fa-search" style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}></i>
                <p>Kết quả tìm kiếm cho: <strong>{searchQuery}</strong></p>
                <button onClick={() => setActiveModal(null)} style={{marginTop:'10px'}}>Đóng</button>
            </div>
        </>
      )}

      {selectedJob && renderJobDetail()}
      {selectedCompany && renderCompanyInfo()}

      {toast && <div className="toast-message" style={{ backgroundColor: toast.color }}>{toast.message}</div>}
    </div>
  );
};

export default MainInterface;
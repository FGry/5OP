import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navbar & User State
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Job Actions State
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState(null);

  // Apply State
  const [cvFile, setCvFile] = useState(null);
  const [cvOption, setCvOption] = useState('upload'); // 'upload' | 'profile'
  const [isApplying, setIsApplying] = useState(false);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy chi tiết Job
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);

        // Lấy thông tin User (nếu đã login)
        const token = localStorage.getItem('token');
        if (token) {
           const userRes = await api.get('/profile/me');
           const localUser = JSON.parse(localStorage.getItem('user'));
           const role = localUser ? localUser.role : 'USER';
           setUser({ ...userRes.data, role: role });

           // Nếu user có CV trong profile -> Mặc định chọn 'profile'
           if (userRes.data.cvUrl) {
               setCvOption('profile');
           }
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- 3. HELPER FUNCTIONS ---
  const showToast = (message, color = '#3498db') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    if (min && !max) return `Từ ${min.toLocaleString()} VNĐ`;
    if (!min && max) return `Đến ${max.toLocaleString()} VNĐ`;
    return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} Triệu VNĐ`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- 4. ACTION HANDLERS ---
  const handleSave = async () => {
    if (!user) {
        showToast('Vui lòng đăng nhập để lưu!', '#e74c3c');
        return navigate('/login');
    }
    try {
        await api.post(`/activity/save/${id}`);
        setIsSaved(!isSaved);
        showToast(
            <span><i className="fas fa-check-circle me-2"></i>{isSaved ? 'Đã bỏ lưu' : 'Đã lưu công việc!'}</span>,
            isSaved ? '#e74c3c' : '#27ae60'
        );
    } catch (error) {
        showToast('Lỗi khi thao tác', '#e74c3c');
    }
  };

  const openApplyModal = () => {
      if (!user) {
          showToast('Vui lòng đăng nhập để ứng tuyển!', '#e74c3c');
          return navigate('/login');
      }
      setActiveModal('apply');
  };

  // Xử lý nộp đơn ứng tuyển
  const handleSubmitApply = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      // Logic chọn loại CV
      if (cvOption === 'upload') {
          if (!cvFile) {
              showToast('Vui lòng chọn file CV!', '#e74c3c');
              return;
          }
          formData.append('cvFile', cvFile);
          formData.append('useProfileCv', false);
      } else {
          // Kiểm tra lại lần nữa cho chắc
          if (!user?.cvUrl) {
               showToast('Hồ sơ chưa có CV. Vui lòng cập nhật hoặc upload mới!', '#e74c3c');
               return;
          }
          formData.append('useProfileCv', true);
      }

      try {
          setIsApplying(true);
          await api.post(`/activity/apply/${id}`, formData);

          showToast(<span><i className="fas fa-check-circle me-2"></i>Ứng tuyển thành công!</span>, '#27ae60');
          setActiveModal(null);
          setCvFile(null);
      } catch (error) {
          console.error(error);
          const msg = error.response?.data || 'Lỗi khi ứng tuyển. Vui lòng thử lại!';
          showToast(msg, '#e74c3c');
      } finally {
          setIsApplying(false);
      }
  };

  // --- 5. RENDER MODALS ---

  // Modal Menu Profile
  const renderProfilePanel = () => (
      <div className="profile-panel" style={{position:'fixed', top:'60px', right:'20px', background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)', zIndex:1000}}>
           <div style={{ textAlign: 'center', padding: '10px' }}>
              <h5>{user?.fullName}</h5>
          </div>
          <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
              <div onClick={() => navigate('/')} className="d-block py-2" style={{cursor:'pointer'}}>
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
              <div onClick={handleLogout} className="d-block py-2 text-danger" style={{cursor:'pointer'}}>
                  <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
              </div>
          </div>
      </div>
  );

  const renderChatWindow = () => (
    <div className="chat-window">
        <div style={{ background: '#27ae60', color: 'white', padding: '10px', borderRadius: '10px 10px 0 0', display:'flex', justifyContent:'space-between'}}>
            <span>Chat với nhà tuyển dụng</span>
            <button onClick={()=>setActiveModal(null)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>x</button>
        </div>
        <div style={{padding:'20px', height:'200px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            Tính năng đang phát triển...
        </div>
    </div>
  );

  // Modal Ứng tuyển (Đã chỉnh sửa vị trí nút)
  const renderApplyModal = () => (
      <div className="custom-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()} style={{minWidth: '450px'}}>
              <h4 style={{marginBottom: '20px', color: '#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'10px', textAlign: 'center'}}>
                  Ứng tuyển: {job.title}
              </h4>
              <form onSubmit={handleSubmitApply}>

                  {/* Option 1: Dùng CV Profile */}
                  <div className="mb-3 p-3 rounded" style={{border: cvOption === 'profile' ? '1px solid #3498db' : '1px solid #eee', background: cvOption === 'profile' ? '#f7fbff' : 'white'}}>
                      <div className="form-check">
                          <input
                              className="form-check-input"
                              type="radio"
                              name="cvOption"
                              id="optProfile"
                              checked={cvOption === 'profile'}
                              onChange={() => setCvOption('profile')}
                              disabled={!user?.cvUrl}
                          />
                          <label className="form-check-label fw-bold" htmlFor="optProfile" style={{cursor:'pointer'}}>
                              Sử dụng CV trong hồ sơ
                          </label>
                      </div>
                      <div className="ms-4 mt-2" style={{fontSize: '0.9rem'}}>
                          {user?.cvUrl ? (
                              <div className="text-success">
                                  <i className="fas fa-check-circle me-1"></i> Đã có CV:
                                  <a href={`http://localhost:8080${user.cvUrl}`} target="_blank" rel="noreferrer" className="ms-1 fw-bold text-decoration-none" onClick={(e)=>e.stopPropagation()}>Xem trước</a>
                              </div>
                          ) : (
                              <div className="text-danger">
                                  <i className="fas fa-exclamation-circle me-1"></i> Bạn chưa cập nhật CV.
                                  <span className="text-primary ms-1" style={{cursor:'pointer', textDecoration:'underline'}} onClick={()=>navigate('/profile')}>Cập nhật ngay</span>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Option 2: Upload CV Mới */}
                  <div className="mb-3 p-3 rounded" style={{border: cvOption === 'upload' ? '1px solid #3498db' : '1px solid #eee', background: cvOption === 'upload' ? '#f7fbff' : 'white'}}>
                      <div className="form-check mb-2">
                          <input
                              className="form-check-input"
                              type="radio"
                              name="cvOption"
                              id="optUpload"
                              checked={cvOption === 'upload'}
                              onChange={() => setCvOption('upload')}
                          />
                          <label className="form-check-label fw-bold" htmlFor="optUpload" style={{cursor:'pointer'}}>
                              Tải lên CV mới
                          </label>
                      </div>
                      {cvOption === 'upload' && (
                          <input
                              type="file"
                              className="form-control"
                              onChange={(e) => setCvFile(e.target.files[0])}
                              accept=".pdf,.doc,.docx"
                          />
                      )}
                  </div>

                  {/* --- KHU VỰC NÚT BẤM (ĐÃ CHỈNH SỬA) --- */}
                  <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '25px'
                  }}>
                      {/* Nút Nộp hồ sơ (Lên trên) */}
                      <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isApplying}
                          style={{
                              background: '#27ae60',
                              border: 'none',
                              padding: '10px 40px',
                              borderRadius: '50px',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              width: '100%',
                              boxShadow: '0 4px 10px rgba(39, 174, 96, 0.4)'
                          }}
                      >
                          {isApplying ? <><i className="fas fa-spinner fa-spin me-2"></i>Đang gửi...</> : 'Nộp hồ sơ ngay'}
                      </button>

                      {/* Nút Huỷ (Xuống dưới - dạng text link) */}
                      <button
                          type="button"
                          onClick={() => setActiveModal(null)}
                          style={{
                              background: 'none',
                              border: 'none',
                              color: '#95a5a6',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                          }}
                      >
                          Huỷ bỏ
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );

  // --- 6. MAIN RENDER ---
  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Đang tải dữ liệu...</div>;
  if (!job) return <div style={{textAlign:'center', padding:'50px'}}>Không tìm thấy công việc!</div>;

  return (
    <div className="main-wrapper">
      <Navbar onOpenModal={setActiveModal} user={user} />

      <section className="content-section">
        <div className="container">
          <div className="row">
            {/* Cột trái: Thông tin Job */}
            <div className="col-lg-8">
              <div className="job-header-card">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="company-logo-large">
                     {job.company?.logo ? <img src={job.company.logo} alt="logo" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : "🏢"}
                  </div>
                  <div className="flex-grow-1">
                    <h1 className="job-title-main">{job.title}</h1>
                    <h2 className="company-name-main">{job.company?.name}</h2>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div className="meta-item"><i className="fas fa-map-marker-alt"></i> {job.location}</div>
                      <div className="meta-item"><i className="fas fa-briefcase"></i> {job.type}</div>
                      <div className="meta-item"><i className="fas fa-clock"></i> Hạn: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</div>
                    </div>
                    <div className="salary-badge"><i className="fas fa-dollar-sign me-2"></i> {formatSalary(job.salaryMin, job.salaryMax)}</div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn-apply" onClick={openApplyModal}>
                    <i className="fas fa-paper-plane me-2"></i>Ứng tuyển ngay
                  </button>
                  <button className={`btn-save ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                    <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark me-1`}></i> {isSaved ? 'Đã lưu' : 'Lưu tin'}
                  </button>
                  <button className="btn-contact" onClick={() => setActiveModal('chat')}>
                    <i className="fas fa-comment-dots me-2"></i>Liên hệ
                  </button>
                </div>
              </div>

              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-file-alt"></i> Mô tả công việc</h3>
                <p className="info-card-text" style={{whiteSpace: 'pre-line'}}>{job.description}</p>
              </div>

              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-clipboard-check"></i> Yêu cầu</h3>
                <p className="info-card-text" style={{whiteSpace: 'pre-line'}}>{job.requirements}</p>
              </div>

              <div className="info-card">
                <h3 className="info-card-title"><i className="fas fa-gift"></i> Quyền lợi</h3>
                <p className="info-card-text" style={{whiteSpace: 'pre-line'}}>{job.benefits}</p>
              </div>
            </div>

            {/* Cột phải: Thông tin Công ty */}
            <div className="col-lg-4">
              <div className="company-sidebar">
                <h3 className="info-card-title"><i className="fas fa-building"></i> Công ty</h3>
                <div className="company-logo-sidebar">
                    {job.company?.logo ? <img src={job.company.logo} alt="logo" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : "🏢"}
                </div>
                <h4 className="company-name-sidebar">{job.company?.name}</h4>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="company-info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div><strong>Địa chỉ:</strong> {job.company?.address || job.location}</div>
                  </div>
                  <div className="company-info-item">
                    <i className="fas fa-globe"></i>
                    <div>
                        <strong>Website:</strong>
                        <a href={job.company?.website} target="_blank" rel="noreferrer" style={{marginLeft:'5px'}}>{job.company?.website || 'Đang cập nhật'}</a>
                    </div>
                  </div>
                </div>

                <div className="company-desc-section">
                  <h5 className="company-desc-title">Giới thiệu:</h5>
                  <p className="company-desc-text">{job.company?.description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="container"><p className="text-center text-white">© 2024 5OP Jobs</p></div>
      </footer>

      {/* RENDER MODALS & POPUPS */}
      {activeModal === 'chat' && renderChatWindow()}
      {activeModal === 'apply' && renderApplyModal()}
      {activeModal === 'profile' && renderProfilePanel()}

      {/* TOAST MESSAGE */}
      {toast && <div className="toast-message" style={{ backgroundColor: toast.color }}>{toast.message}</div>}
    </div>
  );
};

export default JobDetail;
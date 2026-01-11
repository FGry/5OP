import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainInterface from './pages/candidates/MainInterface';
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CandidateProfile from './pages/candidates/CandidateProfile'
import EmployerDashboard from './pages/recruiters/EmployerDashboard'
import CompanyProfile from './pages/recruiters/CompanyProfile'
import PostJob from './pages/recruiters/PostJob'
import JobDetail from './pages/candidates/JobDetail'
import CompanyList from './pages/recruiters/CompanyList'
import CompanyDetail from './pages/recruiters/CompanyDetail'
import SaveJobs from './pages/candidates/SaveJobs'
import AppliedJobs from './pages/candidates/AppliedJobs'
function App() {

  return (
    <Routes>
          <Route path="/" element={<MainInterface />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/company" element={<CompanyProfile />} />
          <Route path="/employer/post" element={<PostJob />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/saved-jobs" element={<SaveJobs />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
    </Routes>
  )
}

export default App;

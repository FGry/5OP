import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainInterface from './pages/candidates/MainInterface';
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CandidateProfile from './pages/candidates/CandidateProfile'
import EmployerDashboard from './pages/recruiters/EmployerDashboard'
import CompanyProfile from './pages/recruiters/CompanyProfile'
import PostJob from './pages/recruiters/PostJob'
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
    </Routes>
  )
}

export default App;

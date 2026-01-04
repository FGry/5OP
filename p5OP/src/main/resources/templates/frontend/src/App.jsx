import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainInterface from './pages/candidates/MainInterface';
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
function App() {

  return (
    <Routes>
          <Route path="/" element={<MainInterface />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App;

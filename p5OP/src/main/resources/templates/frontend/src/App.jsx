import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainInterface from './pages/candidates/MainInterface';
import RegisterPage from './pages/RegisterPage'
function App() {

  return (
    <Routes>
          <Route path="/" element={<MainInterface />} />
          <Route path="/register" element={<RegisterPage />} />

    </Routes>
  )
}

export default App;

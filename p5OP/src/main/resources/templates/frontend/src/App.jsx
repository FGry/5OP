import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainInterface from './pages/candidates/MainInterface';

function App() {

  return (
    <Routes>
          <Route path="/" element={<MainInterface />} />

    </Routes>
  )
}

export default App;

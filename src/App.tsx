import React from 'react';
import './App.module.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/pages/public/Home/Home';
import AppRoutes from './Routes/Routes';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default App;

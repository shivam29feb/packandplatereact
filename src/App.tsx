import React from 'react';
import './App.module.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/pages/public/Home/Home';
import AppRoutes from './Routes/Routes';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/molecules/ErrorBoundary/ErrorBoundary';
import './styles/animations.css';

const App: React.FC = () => {
  // Handle global errors
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would log this to an error reporting service
    console.error('Global error caught by ErrorBoundary:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
          <Outlet />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

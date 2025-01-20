// Reports module entry point
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './Reports.module.css';

const Reports = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <h1>Reports</h1>
      </div>
      <Outlet />
    </div>
  );
};

export default Reports;

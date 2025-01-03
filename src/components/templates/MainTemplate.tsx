
import React from 'react';
import Header from '../organisms/Header';

const MainTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainTemplate;
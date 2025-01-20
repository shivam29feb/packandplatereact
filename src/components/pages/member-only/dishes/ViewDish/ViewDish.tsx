// src/components/ViewDish.tsx

import React from 'react';
import './ViewDish.module.css';
import MemberNavigation from '../../../../molecules/MemberNavigation/MemberNavigation';

const ViewDish: React.FC = () => {
  return (
    <div>
      <MemberNavigation/>
      <p>i'm view dish</p>
    </div>
  );
};

export default ViewDish;

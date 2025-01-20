import React from 'react';
import './MemberDashboard.module.css';
import MemberNavigation from '../../../../molecules/MemberNavigation/MemberNavigation';

const MemberDashboard: React.FC = () => {
    return (
        <div>
            <MemberNavigation/>
            <h1>Member Dashboard</h1>
            <p>Welcome to the member-only dashboard!</p>
            {/* Add more components and functionality here */}
        </div>
    );
};

export default MemberDashboard;
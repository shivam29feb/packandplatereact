import React from 'react';
import './MemberDashboard.module.css';
import MemberNavigation from '../../../../molecules/MemberNavigation/MemberNavigation';
import MemberHeader from '../../../../molecules/MemberHeader/MemberHeader';

const MemberDashboard: React.FC = () => {
    return (
        <div>
            <MemberNavigation/>
            <MemberHeader/>
            <h1>Member Dashboard</h1>
            <p>Welcome to the m<p>Admin ID in session: </p>ember-only dashboard!</p>
            

            {/* Add more components and functionality here */}
        </div>
    );
};

export default MemberDashboard;
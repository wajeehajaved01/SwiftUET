import React from 'react';
import Navbar from '../../components/common/Navbar';

const ParentDashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Parent Dashboard</h1>
                <div className="card">
                    <h2>My Children</h2>
                    <p>View your children's bookings and track their rides</p>
                </div>
                <div className="card">
                    <h2>Notifications</h2>
                    <p>View SMS notifications about your children's rides</p>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;

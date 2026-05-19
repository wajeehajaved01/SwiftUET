import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AnalyticsTab from '../../components/admin/AnalyticsTab';
import ManagementTab from '../../components/admin/ManagementTab';
import BroadcastTab from '../../components/admin/BroadcastTab';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'analytics', label: 'Ridership Analytics', icon: '📊' },
        { id: 'management', label: 'Route & System Management', icon: '⚙️' },
        { id: 'broadcast', label: 'Emergency Broadcast', icon: '📢' }
    ];

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <p className="dashboard-subtitle">Manage your SwiftUET bus system</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <span className="btn-icon">📥</span>
                        Export Data
                    </button>
                    <button className="btn btn-primary" onClick={fetchDashboardData}>
                        <span className="btn-icon">🔄</span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'analytics' && (
                    <AnalyticsTab data={dashboardData} onRefresh={fetchDashboardData} />
                )}
                {activeTab === 'management' && (
                    <ManagementTab data={dashboardData} onRefresh={fetchDashboardData} />
                )}
                {activeTab === 'broadcast' && (
                    <BroadcastTab onRefresh={fetchDashboardData} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

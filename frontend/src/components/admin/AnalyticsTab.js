import React from 'react';
import './AnalyticsTab.css';

const AnalyticsTab = ({ data, onRefresh }) => {
    const metrics = [
        {
            id: 'daily-riders',
            title: 'Daily Riders',
            value: data?.dailyRiders || 0,
            change: '+12%',
            trend: 'up',
            icon: '👥',
            color: 'teal'
        },
        {
            id: 'active-routes',
            title: 'Active Routes',
            value: data?.activeRoutes || 0,
            change: '+2',
            trend: 'up',
            icon: '🗺️',
            color: 'yellow'
        },
        {
            id: 'fleet-efficiency',
            title: 'Fleet Efficiency',
            value: `${data?.fleetEfficiency || 0}%`,
            change: '+5%',
            trend: 'up',
            icon: '⚡',
            color: 'success'
        },
        {
            id: 'avg-delay',
            title: 'Avg Delay Time',
            value: `${data?.avgDelay || 0} min`,
            change: '-3 min',
            trend: 'down',
            icon: '⏱️',
            color: 'warning'
        }
    ];

    const topRoutes = data?.topRoutes || [
        { name: 'Main Campus ↔ KSK', riders: 245, efficiency: 92 },
        { name: 'Main Campus ↔ City Campus', riders: 189, efficiency: 88 },
        { name: 'Hostel Route A', riders: 156, efficiency: 85 }
    ];

    const recentActivity = data?.recentActivity || [
        { time: '10 mins ago', action: 'New booking on Route 3', type: 'booking' },
        { time: '25 mins ago', action: 'Bus #12 completed trip', type: 'trip' },
        { time: '1 hour ago', action: 'Delay alert sent to 45 students', type: 'alert' },
        { time: '2 hours ago', action: 'New driver assigned to Route 5', type: 'system' }
    ];

    const getActivityIcon = (type) => {
        const icons = {
            booking: '🎫',
            trip: '🚌',
            alert: '⚠️',
            system: '⚙️'
        };
        return icons[type] || '📌';
    };

    return (
        <div className="analytics-tab">
            {/* Key Metrics */}
            <div className="metrics-grid">
                {metrics.map(metric => (
                    <div key={metric.id} className={`metric-card metric-${metric.color}`}>
                        <div className="metric-icon">{metric.icon}</div>
                        <div className="metric-content">
                            <h3 className="metric-title">{metric.title}</h3>
                            <div className="metric-value">{metric.value}</div>
                            <div className={`metric-change ${metric.trend}`}>
                                <span className="change-icon">{metric.trend === 'up' ? '↑' : '↓'}</span>
                                <span className="change-value">{metric.change}</span>
                                <span className="change-label">vs last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="analytics-grid">
                {/* Chart Placeholders */}
                <div className="card chart-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">📈</span>
                            Ridership Trends
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="chart-placeholder">
                            <div className="chart-bars">
                                <div className="chart-bar" style={{ height: '60%' }}>
                                    <span className="bar-label">Mon</span>
                                </div>
                                <div className="chart-bar" style={{ height: '75%' }}>
                                    <span className="bar-label">Tue</span>
                                </div>
                                <div className="chart-bar" style={{ height: '85%' }}>
                                    <span className="bar-label">Wed</span>
                                </div>
                                <div className="chart-bar" style={{ height: '70%' }}>
                                    <span className="bar-label">Thu</span>
                                </div>
                                <div className="chart-bar" style={{ height: '90%' }}>
                                    <span className="bar-label">Fri</span>
                                </div>
                                <div className="chart-bar" style={{ height: '45%' }}>
                                    <span className="bar-label">Sat</span>
                                </div>
                                <div className="chart-bar" style={{ height: '30%' }}>
                                    <span className="bar-label">Sun</span>
                                </div>
                            </div>
                            <p className="chart-note">📊 Integrate with Chart.js or Recharts for live data visualization</p>
                        </div>
                    </div>
                </div>

                {/* Most Active Routes */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">🏆</span>
                            Most Active Routes
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="routes-list">
                            {topRoutes.map((route, index) => (
                                <div key={index} className="route-item">
                                    <div className="route-rank">#{index + 1}</div>
                                    <div className="route-info">
                                        <h4 className="route-name">{route.name}</h4>
                                        <div className="route-stats">
                                            <span className="stat">
                                                <span className="stat-icon">👥</span>
                                                {route.riders} riders
                                            </span>
                                            <span className="stat">
                                                <span className="stat-icon">⚡</span>
                                                {route.efficiency}% efficiency
                                            </span>
                                        </div>
                                    </div>
                                    <div className="route-progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${route.efficiency}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card activity-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">🔔</span>
                            Recent Activity
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                                    <div className="activity-content">
                                        <p className="activity-action">{activity.action}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;

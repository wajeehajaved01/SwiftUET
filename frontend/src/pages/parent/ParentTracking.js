import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './ParentTracking.css';

const ParentTracking = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentBookings();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchRecentBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRecentBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/recent');
            const bookings = response.data.data || [];
            setRecentBookings(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setRecentBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStudentName = (booking) => {
        if (booking?.studentId?.firstName && booking?.studentId?.lastName) {
            return `${booking.studentId.firstName} ${booking.studentId.lastName}`;
        }
        if (booking?.studentName) {
            return booking.studentName;
        }
        return 'Student';
    };

    const getStatusBadge = (status) => {
        const badges = {
            'booked': { class: 'badge-success', text: 'Booked', icon: '✓' },
            'picked-up': { class: 'badge-info', text: 'Picked Up', icon: '🚌' },
            'cancelled': { class: 'badge-danger', text: 'Cancelled', icon: '✕' },
            'waiting': { class: 'badge-warning', text: 'Waiting', icon: '⏱' }
        };
        return badges[status] || badges['booked'];
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="parent-tracking">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading tracking information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="parent-tracking">
            {/* Logout Button */}
            <button className="parent-logout-btn" onClick={handleLogout} title="Logout">
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
            </button>

            {/* Header */}
            <div className="parent-header">
                <div className="parent-info">
                    <div className="parent-avatar">
                        {user?.firstName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="parent-details">
                        <h1 className="parent-name">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : 'Parent'}
                        </h1>
                        <p className="parent-role">Parent Portal - Recent Activity</p>
                    </div>
                </div>
                <button className="refresh-btn" onClick={fetchRecentBookings}>
                    <span className="refresh-icon">🔄</span>
                    Refresh
                </button>
            </div>

            {/* Auto-update indicator */}
            <div className="auto-update-banner">
                <span className="update-icon">🕐</span>
                <span className="update-text">Auto-updates every 30 seconds</span>
            </div>

            {/* Recent Bookings */}
            <div className="bookings-container">
                <div className="bookings-header">
                    <h2 className="bookings-title">
                        <span className="title-icon">🎫</span>
                        Recent Bookings ({recentBookings.length})
                    </h2>
                    <p className="bookings-subtitle">
                        Showing the latest 10 bookings from all students
                    </p>
                </div>

                {recentBookings.length > 0 ? (
                    <div className="bookings-grid">
                        {recentBookings.map((booking) => {
                            const statusBadge = getStatusBadge(booking.status);
                            return (
                                <div key={booking._id} className={`booking-card ${booking.status}`}>
                                    <div className="booking-card-header">
                                        <div className="student-info">
                                            <div className="student-avatar-small">
                                                {getStudentName(booking).charAt(0).toUpperCase()}
                                            </div>
                                            <div className="student-details-small">
                                                <h3 className="student-name-small">
                                                    {getStudentName(booking)}
                                                </h3>
                                                <p className="booking-time">
                                                    {formatDateTime(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`status-badge ${statusBadge.class}`}>
                                            <span className="badge-icon">{statusBadge.icon}</span>
                                            {statusBadge.text}
                                        </span>
                                    </div>

                                    <div className="booking-card-body">
                                        <div className="booking-detail-row">
                                            <span className="detail-icon">🚌</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Route</span>
                                                <span className="detail-value">
                                                    {booking.scheduleId?.route || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="booking-detail-row">
                                            <span className="detail-icon">💺</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Seat</span>
                                                <span className="detail-value">
                                                    {booking.seatNumber}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="booking-detail-row">
                                            <span className="detail-icon">📅</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Date</span>
                                                <span className="detail-value">
                                                    {booking.scheduleId?.date || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="booking-detail-row">
                                            <span className="detail-icon">🚍</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Bus</span>
                                                <span className="detail-value">
                                                    {booking.scheduleId?.busId?.busNumber || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="booking-detail-row">
                                            <span className="detail-icon">🕐</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Departure</span>
                                                <span className="detail-value">
                                                    {booking.scheduleId?.departureTime || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎫</div>
                        <h3>No Recent Bookings</h3>
                        <p>There are no bookings in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentTracking;

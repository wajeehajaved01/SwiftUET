import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './DriverDashboard.css';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickingUp, setPickingUp] = useState({});

    useEffect(() => {
        fetchDriverSchedules();
        // Refresh every 30 seconds
        const interval = setInterval(fetchDriverSchedules, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDriverSchedules = async () => {
        try {
            setLoading(true);

            // Get today's date
            const today = new Date().toISOString().split('T')[0];

            // Fetch all schedules for today
            const schedulesRes = await api.get(`/schedules?date=${today}`);
            const allSchedules = schedulesRes.data.data || [];

            // For each schedule, fetch bookings
            const schedulesWithBookings = await Promise.all(
                allSchedules.map(async (schedule) => {
                    try {
                        const bookingsRes = await api.get(`/bookings/schedule/${schedule._id}`);
                        const bookings = bookingsRes.data.data || [];

                        // Transform bookings to include student details
                        const students = bookings.map(booking => ({
                            bookingId: booking._id,
                            studentId: booking.studentId?._id || booking.studentId,
                            name: booking.studentId?.firstName && booking.studentId?.lastName
                                ? `${booking.studentId.firstName} ${booking.studentId.lastName}`
                                : booking.studentName || 'Student',
                            seatNumber: booking.seatNumber,
                            status: booking.status
                        }));

                        return {
                            ...schedule,
                            students,
                            pickedUpCount: students.filter(s => s.status === 'picked-up').length,
                            totalCount: students.length
                        };
                    } catch (error) {
                        console.error('Error fetching bookings for schedule:', error);
                        return {
                            ...schedule,
                            students: [],
                            pickedUpCount: 0,
                            totalCount: 0
                        };
                    }
                })
            );

            // Filter schedules that have bookings
            const schedulesWithStudents = schedulesWithBookings.filter(s => s.students.length > 0);

            setTodaySchedules(schedulesWithStudents);
        } catch (error) {
            console.error('Error fetching driver schedules:', error);
            setTodaySchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPickup = async (bookingId, scheduleIndex) => {
        try {
            setPickingUp(prev => ({ ...prev, [bookingId]: true }));

            await api.patch(`/bookings/${bookingId}/pickup`);

            // Refresh schedules to show updated status
            await fetchDriverSchedules();

            // Show success feedback
            alert('✅ Student marked as picked up!');
        } catch (error) {
            console.error('Error marking pickup:', error);
            alert('❌ Failed to mark pickup. Please try again.');
        } finally {
            setPickingUp(prev => ({ ...prev, [bookingId]: false }));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="driver-dashboard dark-mode">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your schedules...</p>
                </div>
            </div>
        );
    }

    if (todaySchedules.length === 0) {
        return (
            <div className="driver-dashboard dark-mode">
                {/* Logout Button */}
                <button className="driver-logout-btn" onClick={handleLogout} title="Logout">
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                </button>

                <div className="empty-state">
                    <div className="empty-state-icon">🚌</div>
                    <h2>No Active Trips</h2>
                    <p>You don't have any scheduled trips with bookings for today.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="driver-dashboard dark-mode">
            {/* Logout Button */}
            <button className="driver-logout-btn" onClick={handleLogout} title="Logout">
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
            </button>

            {/* Driver Header */}
            <div className="driver-header">
                <div className="driver-info">
                    <div className="driver-avatar">
                        {user?.firstName?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div className="driver-details">
                        <h1 className="driver-name">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : 'Driver'}
                        </h1>
                        <p className="driver-role">Bus Driver</p>
                    </div>
                </div>
                <button className="refresh-btn" onClick={fetchDriverSchedules}>
                    <span className="refresh-icon">🔄</span>
                    Refresh
                </button>
            </div>

            {/* Schedules List */}
            <div className="schedules-container">
                {todaySchedules.map((schedule, scheduleIndex) => (
                    <div key={schedule._id} className="schedule-card">
                        {/* Schedule Header */}
                        <div className="schedule-header">
                            <div className="schedule-info">
                                <h2 className="schedule-route">
                                    <span className="route-icon">🚌</span>
                                    {schedule.route || 'Route'}
                                </h2>
                                <div className="schedule-meta">
                                    <span className="meta-item">
                                        <span className="meta-icon">🚍</span>
                                        Bus {schedule.busId?.busNumber || 'N/A'}
                                    </span>
                                    <span className="meta-item">
                                        <span className="meta-icon">🕐</span>
                                        {schedule.departureTime} - {schedule.arrivalTime}
                                    </span>
                                    <span className="meta-item">
                                        <span className="meta-icon">📅</span>
                                        {schedule.date}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Counter */}
                            <div className="progress-counter">
                                <div className="counter-circle">
                                    <span className="counter-value">
                                        {schedule.pickedUpCount}/{schedule.totalCount}
                                    </span>
                                </div>
                                <p className="counter-label">Picked Up</p>
                            </div>
                        </div>

                        {/* Students List */}
                        <div className="students-list">
                            <h3 className="students-title">
                                <span className="title-icon">👥</span>
                                Student Manifest ({schedule.students.length})
                            </h3>

                            {schedule.students.length > 0 ? (
                                <div className="students-grid">
                                    {schedule.students.map((student) => (
                                        <div
                                            key={student.bookingId}
                                            className={`student-card ${student.status === 'picked-up' ? 'picked-up' : ''}`}
                                        >
                                            <div className="student-info">
                                                <div className="student-avatar">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="student-details">
                                                    <h4 className="student-name">{student.name}</h4>
                                                    <p className="student-seat">
                                                        <span className="seat-icon">💺</span>
                                                        Seat {student.seatNumber}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="student-actions">
                                                {student.status === 'picked-up' ? (
                                                    <div className="status-badge picked-up">
                                                        <span className="badge-icon">✓</span>
                                                        Picked Up
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="pickup-btn"
                                                        onClick={() => handleMarkPickup(student.bookingId, scheduleIndex)}
                                                        disabled={pickingUp[student.bookingId]}
                                                    >
                                                        {pickingUp[student.bookingId] ? (
                                                            <>
                                                                <span className="btn-spinner"></span>
                                                                Marking...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="btn-icon">✓</span>
                                                                Mark as Picked Up
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-students">
                                    <p>No students booked for this schedule</p>
                                </div>
                            )}
                        </div>

                        {/* Schedule Footer */}
                        {schedule.students.length > 0 && (
                            <div className="schedule-footer">
                                {schedule.pickedUpCount === schedule.totalCount ? (
                                    <div className="completion-message">
                                        <span className="completion-icon">🎉</span>
                                        <span className="completion-text">All students picked up!</span>
                                    </div>
                                ) : (
                                    <div className="remaining-message">
                                        <span className="remaining-icon">⏱</span>
                                        <span className="remaining-text">
                                            {schedule.totalCount - schedule.pickedUpCount} student(s) remaining
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverDashboard;

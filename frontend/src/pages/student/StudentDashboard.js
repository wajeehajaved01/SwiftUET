import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';
import './StudentDashboard.css';
import SeatBookingModal from '../../components/student/SeatBookingModal';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StudentDashboard = () => {
    const location = useLocation();
    const isBookingsPage = location.pathname === '/student/bookings';

    const [activeRoute, setActiveRoute] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [delayAlert, setDelayAlert] = useState(null);
    const [myBookings, setMyBookings] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Poll for updates every 15 seconds
        const interval = setInterval(fetchDashboardData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch today's schedules
            const schedulesRes = await api.get('/schedules/today');
            const schedules = schedulesRes.data.data || [];

            // For each schedule, get booked seats count
            const schedulesWithSeats = await Promise.all(
                schedules.map(async (schedule) => {
                    try {
                        const bookedSeatsRes = await api.get(`/bookings/schedule/${schedule._id}`);
                        const bookedSeats = bookedSeatsRes.data.data || [];
                        const totalSeats = schedule.busId?.capacity || 40;
                        const availableSeats = totalSeats - bookedSeats.length;

                        return {
                            ...schedule,
                            bookedSeatsCount: bookedSeats.length,
                            availableSeats: availableSeats > 0 ? availableSeats : 0
                        };
                    } catch (error) {
                        return {
                            ...schedule,
                            bookedSeatsCount: 0,
                            availableSeats: schedule.busId?.capacity || 40
                        };
                    }
                })
            );

            setTodaySchedules(schedulesWithSeats);

            // Fetch my bookings
            const bookingsRes = await api.get('/bookings/my');
            setMyBookings(bookingsRes.data.data || []);

            // Check for delay alerts (mock for now)
            const hasDelay = Math.random() > 0.8;
            if (hasDelay) {
                setDelayAlert({
                    message: 'Heavy traffic expected on Main Campus route. Estimated delay: 10-15 minutes.'
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSeat = (schedule) => {
        setSelectedSchedule(schedule);
        setShowBookingModal(true);
    };

    const handleBookingComplete = () => {
        setShowBookingModal(false);
        setSelectedSchedule(null);
        fetchDashboardData();
    };

    const groupBookingsByMonth = () => {
        const grouped = {};
        myBookings.forEach(booking => {
            const date = new Date(booking.createdAt);
            const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(booking);
        });
        return grouped;
    };

    const getStatusBadge = (status) => {
        const badges = {
            booked: { class: 'badge-success', text: 'Booked' },
            'picked-up': { class: 'badge-info', text: 'Picked Up' },
            cancelled: { class: 'badge-danger', text: 'Cancelled' },
            completed: { class: 'badge-navy', text: 'Completed' }
        };
        return badges[status] || { class: 'badge-navy', text: status };
    };

    if (loading) {
        return (
            <div className="student-dashboard">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If on bookings page, show only bookings
    if (isBookingsPage) {
        const groupedHistory = groupBookingsByMonth();

        return (
            <div className="student-dashboard">
                <div className="dashboard-header">
                    <h1>My Bookings</h1>
                    <p className="dashboard-subtitle">View and manage your bus bookings</p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-section full-width">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="section-icon">🎫</span>
                                    All Bookings
                                </h2>
                            </div>
                            <div className="card-body">
                                {myBookings.length > 0 ? (
                                    <div className="bookings-grid">
                                        {myBookings.map(booking => {
                                            const statusBadge = getStatusBadge(booking.status);
                                            return (
                                                <div key={booking._id} className="booking-card">
                                                    <div className="booking-header">
                                                        <h4 className="booking-route">
                                                            {booking.scheduleId?.route || 'Route'}
                                                        </h4>
                                                        <span className={`badge ${statusBadge.class}`}>
                                                            {statusBadge.text}
                                                        </span>
                                                    </div>
                                                    <div className="booking-details">
                                                        <p className="booking-detail">
                                                            <span className="detail-icon">📅</span>
                                                            <strong>Date:</strong> {booking.scheduleId?.date || 'N/A'}
                                                        </p>
                                                        <p className="booking-detail">
                                                            <span className="detail-icon">🚌</span>
                                                            <strong>Bus:</strong> {booking.scheduleId?.busId?.busNumber || 'N/A'}
                                                        </p>
                                                        <p className="booking-detail">
                                                            <span className="detail-icon">💺</span>
                                                            <strong>Seat:</strong> {booking.seatNumber}
                                                        </p>
                                                        <p className="booking-detail">
                                                            <span className="detail-icon">🕐</span>
                                                            <strong>Departure:</strong> {booking.scheduleId?.departureTime || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">🎫</div>
                                        <h3>No Bookings Yet</h3>
                                        <p>You haven't booked any rides yet. Book your first ride from the dashboard!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard view
    const groupedHistory = groupBookingsByMonth();

    return (
        <div className="student-dashboard">
            {/* Delay Alert Banner */}
            {delayAlert && (
                <div className="delay-alert-banner">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                        <h3 className="alert-title">Delay Risk High</h3>
                        <p className="alert-message">{delayAlert.message}</p>
                    </div>
                    <button
                        className="alert-close"
                        onClick={() => setDelayAlert(null)}
                        aria-label="Close alert"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="dashboard-header">
                <h1>Welcome to SwiftUET</h1>
                <p className="dashboard-subtitle">Track your bus and manage your bookings</p>
            </div>

            <div className="dashboard-grid">
                {/* Live Track Section */}
                <div className="dashboard-section live-track-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">📍</span>
                                Live Bus Tracking
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="map-container">
                                <MapContainer
                                    center={[31.5204, 74.3587]} // Lahore, Pakistan (UET)
                                    zoom={13}
                                    style={{ height: '400px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[31.5204, 74.3587]}>
                                        <Popup>
                                            <strong>UET Main Campus</strong><br />
                                            Your location
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                                <div className="route-status-card card-floating">
                                    <div className="route-status-header">
                                        <span className="status-icon">🚌</span>
                                        <div>
                                            <h4 className="route-name">Main Campus ↔ KSK</h4>
                                            <p className="route-description">Live tracking available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedules */}
                <div className="dashboard-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">📅</span>
                                Today's Schedules
                            </h2>
                        </div>
                        <div className="card-body">
                            {todaySchedules.length > 0 ? (
                                <div className="schedules-list">
                                    {todaySchedules.map(schedule => (
                                        <div key={schedule._id} className="schedule-card">
                                            <div className="schedule-info">
                                                <h4 className="schedule-route">
                                                    {schedule.route || 'Route'}
                                                </h4>
                                                <p className="schedule-time">
                                                    <span className="time-icon">🕐</span>
                                                    Departure: {schedule.departureTime}
                                                </p>
                                                <p className="schedule-bus">
                                                    <span className="bus-icon">🚌</span>
                                                    Bus: {schedule.busId?.busNumber || 'N/A'}
                                                </p>
                                                <p className="schedule-seats">
                                                    <span className="seat-icon">💺</span>
                                                    {schedule.availableSeats} seats available
                                                </p>
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleBookSeat(schedule)}
                                                disabled={schedule.availableSeats === 0}
                                            >
                                                {schedule.availableSeats === 0 ? 'Full' : 'Book a Seat'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📅</div>
                                    <h3>No Schedules Today</h3>
                                    <p>There are no bus schedules available for today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Boarding History */}
                <div className="dashboard-section history-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">📜</span>
                                Recent Bookings
                            </h2>
                        </div>
                        <div className="card-body">
                            {myBookings.length > 0 ? (
                                <div className="history-list">
                                    {myBookings.slice(0, 5).map(booking => {
                                        const statusBadge = getStatusBadge(booking.status);
                                        return (
                                            <div key={booking._id} className="history-item">
                                                <div className="history-icon">🎫</div>
                                                <div className="history-details">
                                                    <h4 className="history-route">
                                                        {booking.scheduleId?.route || 'Route'}
                                                    </h4>
                                                    <p className="history-date">
                                                        {booking.scheduleId?.date || 'N/A'} • Seat {booking.seatNumber}
                                                    </p>
                                                </div>
                                                <span className={`badge ${statusBadge.class}`}>
                                                    {statusBadge.text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📜</div>
                                    <p>No booking history yet. Book your first ride!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Seat Booking Modal */}
            {showBookingModal && selectedSchedule && (
                <SeatBookingModal
                    schedule={selectedSchedule}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedSchedule(null);
                    }}
                    onComplete={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default StudentDashboard;

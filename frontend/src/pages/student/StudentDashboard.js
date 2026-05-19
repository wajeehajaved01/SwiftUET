import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
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
    const [activeRoute, setActiveRoute] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [delayAlert, setDelayAlert] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Poll for bus location updates every 10 seconds
        const interval = setInterval(fetchBusLocation, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [routeRes, historyRes, schedulesRes, alertRes] = await Promise.all([
                axios.get('/api/routes/active'),
                axios.get('/api/bookings/my-history'),
                axios.get('/api/schedules/available'),
                axios.get('/api/notifications/delay-alerts')
            ]);

            setActiveRoute(routeRes.data);
            setBookingHistory(historyRes.data);
            setAvailableSchedules(schedulesRes.data);

            if (alertRes.data && alertRes.data.length > 0) {
                setDelayAlert(alertRes.data[0]);
            }

            if (routeRes.data) {
                fetchBusLocation();
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusLocation = async () => {
        try {
            const response = await axios.get('/api/locations/current');
            if (response.data) {
                setBusLocation(response.data);
            }
        } catch (error) {
            console.error('Error fetching bus location:', error);
        }
    };

    const handleBookSeat = (schedule) => {
        setSelectedSchedule(schedule);
        setShowBookingModal(true);
    };

    const handleBookingComplete = () => {
        setShowBookingModal(false);
        fetchDashboardData();
    };

    const groupBookingsByMonth = () => {
        const grouped = {};
        bookingHistory.forEach(booking => {
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
            confirmed: 'badge-success',
            pending: 'badge-warning',
            cancelled: 'badge-danger',
            completed: 'badge-info'
        };
        return badges[status] || 'badge-navy';
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

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
                                {activeRoute ? (
                                    <>
                                        <MapContainer
                                            center={[31.5204, 74.3587]} // Lahore, Pakistan (UET)
                                            zoom={13}
                                            style={{ height: '400px', width: '100%' }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            {busLocation && (
                                                <Marker position={[busLocation.latitude, busLocation.longitude]}>
                                                    <Popup>
                                                        <strong>Bus Location</strong><br />
                                                        Last updated: {new Date(busLocation.timestamp).toLocaleTimeString()}
                                                    </Popup>
                                                </Marker>
                                            )}
                                            {activeRoute.stops && (
                                                <Polyline
                                                    positions={activeRoute.stops.map(stop => [stop.latitude, stop.longitude])}
                                                    color="var(--color-accent-teal)"
                                                    weight={4}
                                                />
                                            )}
                                        </MapContainer>
                                        <div className="route-status-card card-floating">
                                            <div className="route-status-header">
                                                <span className="status-icon">🚌</span>
                                                <div>
                                                    <h4 className="route-name">{activeRoute.name}</h4>
                                                    <p className="route-description">{activeRoute.description}</p>
                                                </div>
                                            </div>
                                            <div className="route-status-details">
                                                <div className="status-item">
                                                    <span className="status-label">Status:</span>
                                                    <span className={`badge ${activeRoute.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                        {activeRoute.status}
                                                    </span>
                                                </div>
                                                <div className="status-item">
                                                    <span className="status-label">ETA:</span>
                                                    <span className="status-value">{activeRoute.eta || '15 mins'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">🚌</div>
                                        <h3>No Active Route</h3>
                                        <p>There are no buses currently running on your route.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Schedules */}
                <div className="dashboard-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">📅</span>
                                Available Schedules
                            </h2>
                        </div>
                        <div className="card-body">
                            {availableSchedules.length > 0 ? (
                                <div className="schedules-list">
                                    {availableSchedules.map(schedule => (
                                        <div key={schedule._id} className="schedule-card">
                                            <div className="schedule-info">
                                                <h4 className="schedule-route">{schedule.route?.name}</h4>
                                                <p className="schedule-time">
                                                    <span className="time-icon">🕐</span>
                                                    {new Date(schedule.departureTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
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
                                                {schedule.availableSeats === 0 ? 'Full' : 'Book Seat'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📅</div>
                                    <p>No schedules available at the moment.</p>
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
                                Boarding History
                            </h2>
                        </div>
                        <div className="card-body">
                            {Object.keys(groupedHistory).length > 0 ? (
                                <div className="history-timeline">
                                    {Object.entries(groupedHistory).map(([month, bookings]) => (
                                        <div key={month} className="history-month">
                                            <h3 className="month-header">{month}</h3>
                                            <div className="history-list">
                                                {bookings.map(booking => (
                                                    <div key={booking._id} className="history-item">
                                                        <div className="history-icon">🎫</div>
                                                        <div className="history-details">
                                                            <h4 className="history-route">{booking.schedule?.route?.name}</h4>
                                                            <p className="history-date">
                                                                {new Date(booking.schedule?.departureTime).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="history-seat">Seat: {booking.seatNumber}</p>
                                                        </div>
                                                        <span className={`badge ${getStatusBadge(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
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
            {showBookingModal && (
                <SeatBookingModal
                    schedule={selectedSchedule}
                    onClose={() => setShowBookingModal(false)}
                    onComplete={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default StudentDashboard;

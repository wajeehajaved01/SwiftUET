import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ViewBookings.css';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filter state
    const [filters, setFilters] = useState({
        date: '',
        status: ''
    });

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        booked: 0,
        pickedUp: 0,
        cancelled: 0
    });

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, []);

    // Apply filters when bookings or filters change
    useEffect(() => {
        applyFilters();
    }, [bookings, filters]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings');
            setBookings(response.data.data);
            calculateStats(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch bookings');
            console.error('Fetch bookings error:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (bookingsData) => {
        const stats = {
            total: bookingsData.length,
            booked: bookingsData.filter(b => b.status === 'booked').length,
            pickedUp: bookingsData.filter(b => b.status === 'picked-up').length,
            cancelled: bookingsData.filter(b => b.status === 'cancelled').length
        };
        setStats(stats);
    };

    const applyFilters = () => {
        let filtered = [...bookings];

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(booking => {
                if (booking.scheduleId && booking.scheduleId.date) {
                    return booking.scheduleId.date === filters.date;
                }
                return false;
            });
        }

        // Filter by status
        if (filters.status) {
            filtered = filtered.filter(booking => booking.status === filters.status);
        }

        setFilteredBookings(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const clearFilters = () => {
        setFilters({
            date: '',
            status: ''
        });
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        const statusText = newStatus === 'cancelled' ? 'cancel' : `mark as ${newStatus}`;
        if (!window.confirm(`Are you sure you want to ${statusText} this booking?`)) {
            return;
        }

        try {
            const response = await api.patch(`/bookings/${bookingId}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                setSuccess(`Booking ${newStatus} successfully!`);
                // Refresh bookings
                fetchBookings();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update booking');
            console.error('Update booking error:', err);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'booked':
                return 'badge-success';
            case 'picked-up':
                return 'badge-info';
            case 'cancelled':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="view-bookings">
            <h1>View Bookings</h1>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Bookings</div>
                    </div>
                </div>
                <div className="stat-card stat-booked">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.booked}</div>
                        <div className="stat-label">Booked</div>
                    </div>
                </div>
                <div className="stat-card stat-picked">
                    <div className="stat-icon">🚌</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.pickedUp}</div>
                        <div className="stat-label">Picked Up</div>
                    </div>
                </div>
                <div className="stat-card stat-cancelled">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.cancelled}</div>
                        <div className="stat-label">Cancelled</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <h2>Filters</h2>
                <div className="filters-row">
                    <div className="filter-group">
                        <label htmlFor="date">Filter by Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="status">Filter by Status</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="booked">Booked</option>
                            <option value="picked-up">Picked Up</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-actions">
                        <button
                            onClick={clearFilters}
                            className="btn btn-secondary"
                            disabled={!filters.date && !filters.status}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
                <div className="filter-info">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </div>
            </div>

            {/* Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Bookings Table */}
            <div className="card">
                <h2>All Bookings</h2>

                {loading ? (
                    <div className="loading">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <p>
                            {bookings.length === 0
                                ? 'No bookings found. Students will see their bookings here once they book seats.'
                                : 'No bookings match the selected filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Bus Number</th>
                                    <th>Route</th>
                                    <th>Date</th>
                                    <th>Departure</th>
                                    <th>Seat</th>
                                    <th>Status</th>
                                    <th>Booked At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="student-name">
                                            {booking.studentName}
                                        </td>
                                        <td>{booking.studentId?.email || 'N/A'}</td>
                                        <td className="bus-number">
                                            {booking.scheduleId?.busId?.busNumber || 'N/A'}
                                        </td>
                                        <td>{booking.scheduleId?.route || 'N/A'}</td>
                                        <td>{booking.scheduleId?.date ? formatDate(booking.scheduleId.date) : 'N/A'}</td>
                                        <td>{booking.scheduleId?.departureTime || 'N/A'}</td>
                                        <td className="seat-number">{booking.seatNumber}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="booking-time">
                                            {formatDateTime(booking.createdAt)}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {booking.status === 'booked' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(booking._id, 'picked-up')}
                                                            className="btn btn-info btn-sm"
                                                            title="Mark as Picked Up"
                                                        >
                                                            Picked Up
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                                            className="btn btn-danger btn-sm"
                                                            title="Cancel Booking"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'picked-up' && (
                                                    <span className="text-muted">Completed</span>
                                                )}
                                                {booking.status === 'cancelled' && (
                                                    <span className="text-muted">Cancelled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBookings;

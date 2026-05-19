import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManageSchedules.css';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        busId: '',
        date: '',
        departureTime: '',
        arrivalTime: '',
        route: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch schedules and buses on component mount
    useEffect(() => {
        fetchSchedules();
        fetchBuses();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await api.get('/schedules');
            setSchedules(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch schedules');
            console.error('Fetch schedules error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get('/buses');
            // Filter only active buses
            const activeBuses = response.data.data.filter(bus => bus.status === 'active');
            setBuses(activeBuses);
        } catch (err) {
            console.error('Fetch buses error:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/schedules', formData);

            if (response.data.success) {
                setSuccess('Schedule created successfully!');
                // Reset form
                setFormData({
                    busId: '',
                    date: '',
                    departureTime: '',
                    arrivalTime: '',
                    route: ''
                });
                // Refresh schedule list
                fetchSchedules();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create schedule');
            console.error('Create schedule error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (scheduleId, newStatus) => {
        const statusText = newStatus === 'cancelled' ? 'cancel' : 'mark as delayed';
        if (!window.confirm(`Are you sure you want to ${statusText} this schedule?`)) {
            return;
        }

        try {
            const response = await api.patch(`/schedules/${scheduleId}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                setSuccess(`Schedule ${newStatus} successfully!`);
                // Refresh schedule list
                fetchSchedules();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update schedule');
            console.error('Update schedule error:', err);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'scheduled':
                return 'badge-success';
            case 'cancelled':
                return 'badge-danger';
            case 'delayed':
                return 'badge-warning';
            default:
                return 'badge-info';
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

    return (
        <div className="manage-schedules">
            <h1>Manage Schedules</h1>

            {/* Create Schedule Form */}
            <div className="card">
                <h2>Create New Schedule</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="schedule-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="busId">Select Bus *</label>
                            <select
                                id="busId"
                                name="busId"
                                value={formData.busId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">-- Select a bus --</option>
                                {buses.map((bus) => (
                                    <option key={bus._id} value={bus._id}>
                                        {bus.busNumber} - {bus.route} (Driver: {bus.driverName})
                                    </option>
                                ))}
                            </select>
                            {buses.length === 0 && (
                                <small className="text-muted">No active buses available. Add buses first.</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="departureTime">Departure Time *</label>
                            <input
                                type="time"
                                id="departureTime"
                                name="departureTime"
                                value={formData.departureTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="arrivalTime">Arrival Time *</label>
                            <input
                                type="time"
                                id="arrivalTime"
                                name="arrivalTime"
                                value={formData.arrivalTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="route">Route *</label>
                        <input
                            type="text"
                            id="route"
                            name="route"
                            value={formData.route}
                            onChange={handleInputChange}
                            placeholder="e.g., Main Campus to Hostels"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting || buses.length === 0}
                    >
                        {submitting ? 'Creating...' : 'Create Schedule'}
                    </button>
                </form>
            </div>

            {/* Schedules List */}
            <div className="card">
                <h2>All Schedules ({schedules.length})</h2>

                {loading ? (
                    <div className="loading">Loading schedules...</div>
                ) : schedules.length === 0 ? (
                    <div className="empty-state">
                        <p>No schedules found. Create your first schedule above!</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="schedules-table">
                            <thead>
                                <tr>
                                    <th>Bus Number</th>
                                    <th>Date</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Route</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule._id}>
                                        <td className="bus-number">
                                            {schedule.busId?.busNumber || 'N/A'}
                                        </td>
                                        <td>{formatDate(schedule.date)}</td>
                                        <td>{schedule.departureTime}</td>
                                        <td>{schedule.arrivalTime}</td>
                                        <td>{schedule.route}</td>
                                        <td>{schedule.busId?.driverName || 'N/A'}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(schedule.status)}`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {schedule.status === 'scheduled' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(schedule._id, 'delayed')}
                                                            className="btn btn-warning btn-sm"
                                                            title="Mark as Delayed"
                                                        >
                                                            Delay
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(schedule._id, 'cancelled')}
                                                            className="btn btn-danger btn-sm"
                                                            title="Cancel Schedule"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {schedule.status === 'delayed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(schedule._id, 'cancelled')}
                                                        className="btn btn-danger btn-sm"
                                                        title="Cancel Schedule"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {schedule.status === 'cancelled' && (
                                                    <span className="text-muted">No actions</span>
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

export default ManageSchedules;

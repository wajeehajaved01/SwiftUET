import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminBuses.css';

const AdminSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        busId: '',
        date: '',
        departureTime: '',
        arrivalTime: '',
        route: '',
        status: 'scheduled'
    });

    useEffect(() => {
        fetchSchedules();
        fetchBuses();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await api.get('/schedules');
            setSchedules(response.data.data || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get('/buses');
            setBuses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching buses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/schedules', formData);
            setShowModal(false);
            setFormData({
                busId: '',
                date: '',
                departureTime: '',
                arrivalTime: '',
                route: '',
                status: 'scheduled'
            });
            fetchSchedules();
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert(error.response?.data?.error || 'Failed to create schedule');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/schedules/${id}/status`, { status: newStatus });
            fetchSchedules();
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert(error.response?.data?.error || 'Failed to update schedule');
        }
    };

    if (loading) {
        return (
            <div className="admin-buses">
                <div className="loading">Loading schedules...</div>
            </div>
        );
    }

    return (
        <div className="admin-buses">
            <div className="page-header">
                <h1>Schedule Management</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <span className="btn-icon">➕</span>
                    Add New Schedule
                </button>
            </div>

            <div className="buses-grid">
                {schedules.map(schedule => (
                    <div key={schedule._id} className="bus-card">
                        <div className="bus-header">
                            <h3>Bus {schedule.busId?.busNumber || 'N/A'}</h3>
                            <span className={`status-badge ${schedule.status}`}>
                                {schedule.status}
                            </span>
                        </div>
                        <div className="bus-details">
                            <p><strong>Date:</strong> {schedule.date}</p>
                            <p><strong>Route:</strong> {schedule.route}</p>
                            <p><strong>Departure:</strong> {schedule.departureTime}</p>
                            <p><strong>Arrival:</strong> {schedule.arrivalTime}</p>
                        </div>
                        <div className="bus-actions">
                            {schedule.status === 'scheduled' && (
                                <>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleStatusUpdate(schedule._id, 'delayed')}
                                    >
                                        Mark Delayed
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleStatusUpdate(schedule._id, 'cancelled')}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Schedule</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Bus</label>
                                <select
                                    value={formData.busId}
                                    onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a bus</option>
                                    {buses.map(bus => (
                                        <option key={bus._id} value={bus._id}>
                                            Bus {bus.busNumber} - {bus.route}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Route</label>
                                <input
                                    type="text"
                                    value={formData.route}
                                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Departure Time</label>
                                <input
                                    type="time"
                                    value={formData.departureTime}
                                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Arrival Time</label>
                                <input
                                    type="time"
                                    value={formData.arrivalTime}
                                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSchedules;

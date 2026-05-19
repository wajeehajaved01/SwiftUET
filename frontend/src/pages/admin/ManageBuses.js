import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManageBuses.css';

const ManageBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        busNumber: '',
        capacity: 40,
        route: '',
        driverName: '',
        status: 'active'
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch buses on component mount
    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/buses');
            setBuses(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch buses');
            console.error('Fetch buses error:', err);
        } finally {
            setLoading(false);
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
            const response = await api.post('/buses', formData);

            if (response.data.success) {
                setSuccess('Bus added successfully!');
                // Reset form
                setFormData({
                    busNumber: '',
                    capacity: 40,
                    route: '',
                    driverName: '',
                    status: 'active'
                });
                // Refresh bus list
                fetchBuses();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add bus');
            console.error('Add bus error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (busId, busNumber) => {
        if (!window.confirm(`Are you sure you want to delete bus ${busNumber}?`)) {
            return;
        }

        try {
            const response = await api.delete(`/buses/${busId}`);

            if (response.data.success) {
                setSuccess('Bus deleted successfully!');
                // Refresh bus list
                fetchBuses();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete bus');
            console.error('Delete bus error:', err);
        }
    };

    return (
        <div className="manage-buses">
            <h1>Manage Buses</h1>

            {/* Add Bus Form */}
            <div className="card">
                <h2>Add New Bus</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="bus-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="busNumber">Bus Number *</label>
                            <input
                                type="text"
                                id="busNumber"
                                name="busNumber"
                                value={formData.busNumber}
                                onChange={handleInputChange}
                                placeholder="e.g., LHR-1234"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacity">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                min="10"
                                max="60"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
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

                        <div className="form-group">
                            <label htmlFor="driverName">Driver Name *</label>
                            <input
                                type="text"
                                id="driverName"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleInputChange}
                                placeholder="e.g., Ahmed Khan"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Adding...' : 'Add Bus'}
                    </button>
                </form>
            </div>

            {/* Buses List */}
            <div className="card">
                <h2>All Buses ({buses.length})</h2>

                {loading ? (
                    <div className="loading">Loading buses...</div>
                ) : buses.length === 0 ? (
                    <div className="empty-state">
                        <p>No buses found. Add your first bus above!</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="buses-table">
                            <thead>
                                <tr>
                                    <th>Bus Number</th>
                                    <th>Capacity</th>
                                    <th>Route</th>
                                    <th>Driver Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.map((bus) => (
                                    <tr key={bus._id}>
                                        <td className="bus-number">{bus.busNumber}</td>
                                        <td>{bus.capacity}</td>
                                        <td>{bus.route}</td>
                                        <td>{bus.driverName}</td>
                                        <td>
                                            <span className={`badge badge-${bus.status === 'active' ? 'success' : 'danger'}`}>
                                                {bus.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(bus._id, bus.busNumber)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
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

export default ManageBuses;

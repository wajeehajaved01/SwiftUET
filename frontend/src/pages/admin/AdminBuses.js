import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminBuses.css';

const AdminBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        busNumber: '',
        capacity: 40,
        route: '',
        driverName: '',
        status: 'active'
    });

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/buses');
            setBuses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching buses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/buses', formData);
            setShowModal(false);
            setFormData({
                busNumber: '',
                capacity: 40,
                route: '',
                driverName: '',
                status: 'active'
            });
            fetchBuses();
        } catch (error) {
            console.error('Error creating bus:', error);
            alert(error.response?.data?.error || 'Failed to create bus');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await api.delete(`/buses/${id}`);
                fetchBuses();
            } catch (error) {
                console.error('Error deleting bus:', error);
                alert(error.response?.data?.error || 'Failed to delete bus');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-buses">
                <div className="loading">Loading buses...</div>
            </div>
        );
    }

    return (
        <div className="admin-buses">
            <div className="page-header">
                <h1>Bus Management</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <span className="btn-icon">➕</span>
                    Add New Bus
                </button>
            </div>

            <div className="buses-grid">
                {buses.map(bus => (
                    <div key={bus._id} className="bus-card">
                        <div className="bus-header">
                            <h3>Bus {bus.busNumber}</h3>
                            <span className={`status-badge ${bus.status}`}>
                                {bus.status}
                            </span>
                        </div>
                        <div className="bus-details">
                            <p><strong>Route:</strong> {bus.route}</p>
                            <p><strong>Driver:</strong> {bus.driverName}</p>
                            <p><strong>Capacity:</strong> {bus.capacity} seats</p>
                        </div>
                        <div className="bus-actions">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(bus._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Bus</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Bus Number</label>
                                <input
                                    type="text"
                                    value={formData.busNumber}
                                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
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
                                <label>Driver Name</label>
                                <input
                                    type="text"
                                    value={formData.driverName}
                                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Capacity</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    min="10"
                                    max="60"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Bus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBuses;

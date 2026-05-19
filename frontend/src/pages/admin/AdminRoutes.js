import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminBuses.css';

const AdminRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startPoint: '',
        endPoint: '',
        stops: '',
        status: 'active'
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/routes');
            setRoutes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching routes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stopsArray = formData.stops.split(',').map(s => s.trim()).filter(s => s);
            await api.post('/routes', {
                ...formData,
                stops: stopsArray
            });
            setShowModal(false);
            setFormData({
                name: '',
                startPoint: '',
                endPoint: '',
                stops: '',
                status: 'active'
            });
            fetchRoutes();
        } catch (error) {
            console.error('Error creating route:', error);
            alert(error.response?.data?.error || 'Failed to create route');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await api.delete(`/routes/${id}`);
                fetchRoutes();
            } catch (error) {
                console.error('Error deleting route:', error);
                alert(error.response?.data?.error || 'Failed to delete route');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-buses">
                <div className="loading">Loading routes...</div>
            </div>
        );
    }

    return (
        <div className="admin-buses">
            <div className="page-header">
                <h1>Route Management</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <span className="btn-icon">➕</span>
                    Add New Route
                </button>
            </div>

            <div className="buses-grid">
                {routes.map(route => (
                    <div key={route._id} className="bus-card">
                        <div className="bus-header">
                            <h3>{route.name}</h3>
                            <span className={`status-badge ${route.status}`}>
                                {route.status}
                            </span>
                        </div>
                        <div className="bus-details">
                            <p><strong>Start:</strong> {route.startPoint}</p>
                            <p><strong>End:</strong> {route.endPoint}</p>
                            <p><strong>Stops:</strong> {route.stops?.length || 0}</p>
                        </div>
                        <div className="bus-actions">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(route._id)}
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
                            <h2>Add New Route</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Route Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Point</label>
                                <input
                                    type="text"
                                    value={formData.startPoint}
                                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Point</label>
                                <input
                                    type="text"
                                    value={formData.endPoint}
                                    onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stops (comma-separated)</label>
                                <textarea
                                    value={formData.stops}
                                    onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                                    rows="3"
                                    placeholder="Stop 1, Stop 2, Stop 3"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e5e7eb' }}
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
                                    Create Route
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRoutes;

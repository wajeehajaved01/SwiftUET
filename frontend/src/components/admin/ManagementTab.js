import React, { useState } from 'react';
import axios from 'axios';
import './ManagementTab.css';

const ManagementTab = ({ data, onRefresh }) => {
    const [activeSection, setActiveSection] = useState('routes');
    const [facultyRowsLocked, setFacultyRowsLocked] = useState(true);
    const [formData, setFormData] = useState({
        routeName: '',
        routeDescription: '',
        driverId: '',
        busId: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            await axios.post('/api/routes', {
                name: formData.routeName,
                description: formData.routeDescription
            });
            setMessage({ type: 'success', text: 'Route created successfully!' });
            setFormData({ ...formData, routeName: '', routeDescription: '' });
            onRefresh();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create route' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDriver = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            await axios.post('/api/admin/assign-driver', {
                driverId: formData.driverId,
                busId: formData.busId
            });
            setMessage({ type: 'success', text: 'Driver assigned successfully!' });
            setFormData({ ...formData, driverId: '', busId: '' });
            onRefresh();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to assign driver' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFacultyRows = async () => {
        try {
            await axios.post('/api/admin/toggle-faculty-rows', {
                locked: !facultyRowsLocked
            });
            setFacultyRowsLocked(!facultyRowsLocked);
            setMessage({ type: 'success', text: `Faculty rows ${!facultyRowsLocked ? 'locked' : 'unlocked'} successfully!` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to toggle faculty rows' });
        }
    };

    return (
        <div className="management-tab">
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                    <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
                    {message.text}
                </div>
            )}

            {/* Section Selector */}
            <div className="section-selector">
                <button
                    className={`section-btn ${activeSection === 'routes' ? 'active' : ''}`}
                    onClick={() => setActiveSection('routes')}
                >
                    <span className="section-icon">🗺️</span>
                    Routes
                </button>
                <button
                    className={`section-btn ${activeSection === 'drivers' ? 'active' : ''}`}
                    onClick={() => setActiveSection('drivers')}
                >
                    <span className="section-icon">👨‍✈️</span>
                    Drivers & Buses
                </button>
                <button
                    className={`section-btn ${activeSection === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveSection('settings')}
                >
                    <span className="section-icon">⚙️</span>
                    Settings
                </button>
            </div>

            {/* Routes Section */}
            {activeSection === 'routes' && (
                <div className="management-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">➕</span>
                                Create New Route
                            </h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateRoute} className="management-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="routeName">Route Name</label>
                                        <input
                                            type="text"
                                            id="routeName"
                                            name="routeName"
                                            value={formData.routeName}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Main Campus ↔ KSK"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="routeDescription">Description</label>
                                        <input
                                            type="text"
                                            id="routeDescription"
                                            name="routeDescription"
                                            value={formData.routeDescription}
                                            onChange={handleInputChange}
                                            placeholder="Brief route description"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Route'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">📋</span>
                                Existing Routes
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Route Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Main Campus ↔ KSK</td>
                                            <td>Main route between campuses</td>
                                            <td><span className="badge badge-success">Active</span></td>
                                            <td>
                                                <button className="btn-icon-small">✏️</button>
                                                <button className="btn-icon-small">🗑️</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>City Campus Route</td>
                                            <td>City campus connection</td>
                                            <td><span className="badge badge-success">Active</span></td>
                                            <td>
                                                <button className="btn-icon-small">✏️</button>
                                                <button className="btn-icon-small">🗑️</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drivers Section */}
            {activeSection === 'drivers' && (
                <div className="management-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">🔗</span>
                                Assign Driver to Bus
                            </h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAssignDriver} className="management-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="driverId">Select Driver</label>
                                        <select
                                            id="driverId"
                                            name="driverId"
                                            value={formData.driverId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Choose a driver...</option>
                                            <option value="1">Ahmed Khan</option>
                                            <option value="2">Muhammad Ali</option>
                                            <option value="3">Hassan Raza</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="busId">Select Bus</label>
                                        <select
                                            id="busId"
                                            name="busId"
                                            value={formData.busId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Choose a bus...</option>
                                            <option value="1">Bus #101 (UET-001)</option>
                                            <option value="2">Bus #102 (UET-002)</option>
                                            <option value="3">Bus #103 (UET-003)</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'Assigning...' : 'Assign Driver'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
                <div className="management-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <span className="section-icon">🔒</span>
                                Faculty Rows Management
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3 className="setting-title">Faculty-Only Seat Rows</h3>
                                    <p className="setting-description">
                                        Control whether the first 3 rows of buses are reserved exclusively for faculty members.
                                        When locked, students cannot book these seats.
                                    </p>
                                </div>
                                <div className="setting-control">
                                    <button
                                        className={`toggle-button ${facultyRowsLocked ? 'locked' : 'unlocked'}`}
                                        onClick={handleToggleFacultyRows}
                                    >
                                        <span className="toggle-icon">{facultyRowsLocked ? '🔒' : '🔓'}</span>
                                        <span className="toggle-text">
                                            {facultyRowsLocked ? 'Locked' : 'Unlocked'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="setting-preview">
                                <h4 className="preview-title">Current Configuration:</h4>
                                <div className="preview-content">
                                    <div className="preview-item">
                                        <span className="preview-label">Faculty Rows:</span>
                                        <span className="preview-value">Rows 1-3</span>
                                    </div>
                                    <div className="preview-item">
                                        <span className="preview-label">Student Rows:</span>
                                        <span className="preview-value">Rows 4-10</span>
                                    </div>
                                    <div className="preview-item">
                                        <span className="preview-label">Status:</span>
                                        <span className={`badge ${facultyRowsLocked ? 'badge-danger' : 'badge-success'}`}>
                                            {facultyRowsLocked ? 'Restricted' : 'Open'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementTab;

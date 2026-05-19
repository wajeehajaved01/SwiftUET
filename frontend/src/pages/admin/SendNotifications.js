import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './SendNotifications.css';

const SendNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'broadcast'
    });
    const [submitting, setSubmitting] = useState(false);

    // Character counts
    const titleMaxLength = 100;
    const messageMaxLength = 500;

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            setNotifications(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch notifications');
            console.error('Fetch notifications error:', err);
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
            const response = await api.post('/notifications/broadcast', formData);

            if (response.data.success) {
                setSuccess('Notification broadcast successfully to all students!');
                // Reset form
                setFormData({
                    title: '',
                    message: '',
                    type: 'broadcast'
                });
                // Refresh notification list
                fetchNotifications();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to broadcast notification');
            console.error('Broadcast notification error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'broadcast':
                return '📢';
            case 'alert':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            case 'update':
                return '🔔';
            default:
                return '📢';
        }
    };

    return (
        <div className="send-notifications">
            <h1>Send Notifications</h1>

            {/* Broadcast Form */}
            <div className="card">
                <h2>📢 Broadcast to All Students</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="notification-form">
                    <div className="form-group">
                        <label htmlFor="title">
                            Notification Title *
                            <span className="char-count">
                                {formData.title.length}/{titleMaxLength}
                            </span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Bus Schedule Update"
                            maxLength={titleMaxLength}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">
                            Message *
                            <span className="char-count">
                                {formData.message.length}/{messageMaxLength}
                            </span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Enter your message here..."
                            rows="5"
                            maxLength={messageMaxLength}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Notification Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="broadcast">📢 Broadcast</option>
                            <option value="alert">⚠️ Alert</option>
                            <option value="info">ℹ️ Info</option>
                            <option value="update">🔔 Update</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-broadcast"
                        disabled={submitting}
                    >
                        {submitting ? 'Broadcasting...' : '📢 Broadcast to All Students'}
                    </button>
                </form>
            </div>

            {/* Past Notifications */}
            <div className="card">
                <h2>Past Notifications ({notifications.length})</h2>

                {loading ? (
                    <div className="loading">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="empty-state">
                        <p>No notifications sent yet. Create your first notification above!</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <div key={notification._id} className="notification-item">
                                <div className="notification-header">
                                    <div className="notification-title">
                                        <span className="type-icon">
                                            {getTypeIcon(notification.type)}
                                        </span>
                                        <strong>{notification.title}</strong>
                                    </div>
                                    <div className="notification-meta">
                                        <span className="notification-date">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="notification-message">
                                    {notification.message}
                                </div>
                                <div className="notification-footer">
                                    <span className="created-by">
                                        Sent by: {notification.createdBy?.firstName} {notification.createdBy?.lastName}
                                    </span>
                                    <span className={`type-badge type-${notification.type}`}>
                                        {notification.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendNotifications;

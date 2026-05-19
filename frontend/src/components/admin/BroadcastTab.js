import React, { useState } from 'react';
import axios from 'axios';
import './BroadcastTab.css';

const BroadcastTab = ({ onRefresh }) => {
    const [broadcastData, setBroadcastData] = useState({
        message: '',
        targetAudience: 'all',
        urgency: 'normal'
    });
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setBroadcastData({
            ...broadcastData,
            [e.target.name]: e.target.value
        });
    };

    const handlePreview = (e) => {
        e.preventDefault();
        if (broadcastData.message.trim()) {
            setShowConfirmation(true);
        }
    };

    const handleSendBroadcast = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/admin/broadcast', broadcastData);
            setResult({
                type: 'success',
                message: `Alert sent successfully to ${response.data.recipientCount} recipients!`,
                details: response.data
            });
            setBroadcastData({
                message: '',
                targetAudience: 'all',
                urgency: 'normal'
            });
            setShowConfirmation(false);
            onRefresh();
        } catch (error) {
            setResult({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send broadcast',
                details: null
            });
        } finally {
            setLoading(false);
        }
    };

    const getRecipientCount = () => {
        const counts = {
            all: 1250,
            students: 1100,
            drivers: 25,
            faculty: 125
        };
        return counts[broadcastData.targetAudience] || 0;
    };

    const quickMessages = [
        {
            title: 'Schedule Delay',
            message: 'All bus schedules are delayed by 15 minutes due to heavy traffic. Please plan accordingly.',
            urgency: 'high'
        },
        {
            title: 'Weather Alert',
            message: 'Heavy rain expected. Bus services may experience delays. Stay updated.',
            urgency: 'high'
        },
        {
            title: 'Route Change',
            message: 'Route 3 has been temporarily modified due to road construction. Check the app for updated route.',
            urgency: 'normal'
        },
        {
            title: 'Service Resumption',
            message: 'All bus services have resumed normal operations. Thank you for your patience.',
            urgency: 'low'
        }
    ];

    const useQuickMessage = (template) => {
        setBroadcastData({
            ...broadcastData,
            message: template.message,
            urgency: template.urgency
        });
    };

    return (
        <div className="broadcast-tab">
            {result && (
                <div className={`alert alert-${result.type === 'success' ? 'success' : 'danger'} broadcast-result`}>
                    <div className="result-icon">
                        {result.type === 'success' ? '✓' : '⚠️'}
                    </div>
                    <div className="result-content">
                        <h3>{result.message}</h3>
                        {result.details && (
                            <p>Sent via Twilio SMS at {new Date(result.details.timestamp).toLocaleString()}</p>
                        )}
                    </div>
                    <button className="alert-close" onClick={() => setResult(null)}>✕</button>
                </div>
            )}

            <div className="broadcast-grid">
                {/* Broadcast Form */}
                <div className="card broadcast-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">📢</span>
                            Emergency Broadcast Console
                        </h2>
                        <p className="card-subtitle">Send instant SMS alerts to all registered users via Twilio</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handlePreview} className="broadcast-form">
                            <div className="form-group">
                                <label htmlFor="targetAudience">Target Audience</label>
                                <select
                                    id="targetAudience"
                                    name="targetAudience"
                                    value={broadcastData.targetAudience}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="all">All Users ({getRecipientCount()})</option>
                                    <option value="students">Students Only (1,100)</option>
                                    <option value="drivers">Drivers Only (25)</option>
                                    <option value="faculty">Faculty Only (125)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="urgency">Alert Urgency</label>
                                <div className="urgency-selector">
                                    <label className={`urgency-option ${broadcastData.urgency === 'low' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="low"
                                            checked={broadcastData.urgency === 'low'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="urgency-icon">ℹ️</span>
                                        <span className="urgency-label">Low</span>
                                    </label>
                                    <label className={`urgency-option ${broadcastData.urgency === 'normal' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="normal"
                                            checked={broadcastData.urgency === 'normal'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="urgency-icon">⚠️</span>
                                        <span className="urgency-label">Normal</span>
                                    </label>
                                    <label className={`urgency-option ${broadcastData.urgency === 'high' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="high"
                                            checked={broadcastData.urgency === 'high'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="urgency-icon">🚨</span>
                                        <span className="urgency-label">High</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Broadcast Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={broadcastData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your emergency alert message here..."
                                    rows="6"
                                    maxLength="160"
                                    required
                                />
                                <div className="character-count">
                                    {broadcastData.message.length} / 160 characters
                                </div>
                            </div>

                            <button type="submit" className="btn btn-danger btn-xl btn-block broadcast-button">
                                <span className="btn-icon">📡</span>
                                Preview & Send Broadcast
                            </button>
                        </form>
                    </div>
                </div>

                {/* Quick Templates */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">⚡</span>
                            Quick Message Templates
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="templates-list">
                            {quickMessages.map((template, index) => (
                                <div key={index} className="template-item">
                                    <div className="template-header">
                                        <h4 className="template-title">{template.title}</h4>
                                        <span className={`badge badge-${template.urgency === 'high' ? 'danger' : template.urgency === 'normal' ? 'warning' : 'info'}`}>
                                            {template.urgency}
                                        </span>
                                    </div>
                                    <p className="template-message">{template.message}</p>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => useQuickMessage(template)}
                                    >
                                        Use Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Broadcast History */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">📜</span>
                            Recent Broadcasts
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="history-list">
                            <div className="history-item">
                                <div className="history-time">2 hours ago</div>
                                <div className="history-content">
                                    <p className="history-message">Schedule delayed by 10 mins due to peak hours</p>
                                    <div className="history-meta">
                                        <span className="badge badge-success">Sent to 1,250 users</span>
                                        <span className="history-urgency">Normal Priority</span>
                                    </div>
                                </div>
                            </div>
                            <div className="history-item">
                                <div className="history-time">Yesterday</div>
                                <div className="history-content">
                                    <p className="history-message">Route 5 temporarily suspended for maintenance</p>
                                    <div className="history-meta">
                                        <span className="badge badge-success">Sent to 450 users</span>
                                        <span className="history-urgency">High Priority</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="modal-backdrop" onClick={() => setShowConfirmation(false)}>
                    <div className="modal confirmation-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">⚠️ Confirm Broadcast</h2>
                            <button className="modal-close" onClick={() => setShowConfirmation(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="confirmation-warning">
                                <div className="warning-icon">🚨</div>
                                <p>You are about to send an SMS alert to <strong>{getRecipientCount()} recipients</strong>.</p>
                            </div>
                            <div className="confirmation-preview">
                                <h3>Message Preview:</h3>
                                <div className="preview-box">
                                    <div className="preview-header">
                                        <span className="preview-sender">SwiftUET Alert</span>
                                        <span className={`preview-urgency urgency-${broadcastData.urgency}`}>
                                            {broadcastData.urgency.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="preview-message">{broadcastData.message}</p>
                                </div>
                            </div>
                            <div className="confirmation-details">
                                <div className="detail-item">
                                    <span className="detail-label">Target:</span>
                                    <span className="detail-value">{broadcastData.targetAudience}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Recipients:</span>
                                    <span className="detail-value">{getRecipientCount()} users</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Delivery:</span>
                                    <span className="detail-value">Immediate via Twilio SMS</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger btn-lg"
                                onClick={handleSendBroadcast}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner-small"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">📡</span>
                                        Confirm & Send Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BroadcastTab;

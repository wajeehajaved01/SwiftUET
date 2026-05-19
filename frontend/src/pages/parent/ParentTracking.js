import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './ParentTracking.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ParentTracking = () => {
    const [studentData, setStudentData] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [tripStatus, setTripStatus] = useState('waiting'); // waiting, in_transit, arrived
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrackingData();
        // Poll for updates every 15 seconds
        const interval = setInterval(fetchTrackingData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchTrackingData = async () => {
        try {
            setLoading(true);
            const [studentRes, locationRes, notificationsRes] = await Promise.all([
                axios.get('/api/parent/student-info'),
                axios.get('/api/parent/bus-location'),
                axios.get('/api/parent/notifications')
            ]);

            setStudentData(studentRes.data);
            setBusLocation(locationRes.data);
            setNotifications(notificationsRes.data);
            setTripStatus(studentRes.data.status || 'waiting');
        } catch (error) {
            console.error('Error fetching tracking data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = () => {
        const statuses = {
            waiting: {
                label: 'Waiting to Board',
                icon: '⏱️',
                color: 'warning',
                description: 'Your child is waiting for the bus to arrive'
            },
            in_transit: {
                label: 'In Transit',
                icon: '🚌',
                color: 'info',
                description: 'Your child is safely on the bus'
            },
            arrived: {
                label: 'Safely Arrived',
                icon: '✓',
                color: 'success',
                description: 'Your child has arrived at the destination'
            }
        };
        return statuses[tripStatus] || statuses.waiting;
    };

    const statusInfo = getStatusInfo();

    if (loading) {
        return (
            <div className="parent-tracking">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading tracking information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="parent-tracking">
            {/* Header */}
            <div className="tracking-header">
                <div className="header-content">
                    <h1 className="tracking-title">
                        <span className="title-icon">👨‍👩‍👧</span>
                        Parent Tracking Portal
                    </h1>
                    <p className="tracking-subtitle">Real-time updates for your child's journey</p>
                </div>
                <div className="student-badge">
                    <div className="student-avatar">
                        {studentData?.name?.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <div className="student-info">
                        <h3 className="student-name">{studentData?.name || 'Student'}</h3>
                        <p className="student-details">
                            {studentData?.route?.name} • Seat {studentData?.seatNumber}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Stepper */}
            <div className="status-stepper">
                <div className={`step ${tripStatus === 'waiting' || tripStatus === 'in_transit' || tripStatus === 'arrived' ? 'active' : ''} ${tripStatus === 'in_transit' || tripStatus === 'arrived' ? 'completed' : ''}`}>
                    <div className="step-icon">⏱️</div>
                    <div className="step-content">
                        <h4 className="step-title">Waiting to Board</h4>
                        <p className="step-time">
                            {notifications.find(n => n.type === 'waiting')?.timestamp || 'Pending'}
                        </p>
                    </div>
                </div>

                <div className="step-connector"></div>

                <div className={`step ${tripStatus === 'in_transit' || tripStatus === 'arrived' ? 'active' : ''} ${tripStatus === 'arrived' ? 'completed' : ''}`}>
                    <div className="step-icon">🚌</div>
                    <div className="step-content">
                        <h4 className="step-title">In Transit</h4>
                        <p className="step-time">
                            {notifications.find(n => n.type === 'boarded')?.timestamp || 'Not yet'}
                        </p>
                    </div>
                </div>

                <div className="step-connector"></div>

                <div className={`step ${tripStatus === 'arrived' ? 'active completed' : ''}`}>
                    <div className="step-icon">✓</div>
                    <div className="step-content">
                        <h4 className="step-title">Safely Arrived</h4>
                        <p className="step-time">
                            {notifications.find(n => n.type === 'arrived')?.timestamp || 'Not yet'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Status Card */}
            <div className="current-status-card">
                <div className={`status-indicator status-${statusInfo.color}`}>
                    <div className="status-icon-large">{statusInfo.icon}</div>
                    <div className="status-content">
                        <h2 className="status-label">{statusInfo.label}</h2>
                        <p className="status-description">{statusInfo.description}</p>
                    </div>
                </div>
            </div>

            <div className="tracking-grid">
                {/* Live Map */}
                <div className="card map-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">📍</span>
                            Live Bus Location
                        </h2>
                        <button className="btn btn-secondary btn-sm" onClick={fetchTrackingData}>
                            <span className="btn-icon">🔄</span>
                            Refresh
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="map-container">
                            {busLocation ? (
                                <MapContainer
                                    center={[busLocation.latitude, busLocation.longitude]}
                                    zoom={14}
                                    style={{ height: '400px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    <Marker position={[busLocation.latitude, busLocation.longitude]} />
                                    {studentData?.route?.stops && (
                                        <Polyline
                                            positions={studentData.route.stops.map(stop => [stop.latitude, stop.longitude])}
                                            color="var(--color-accent-teal)"
                                            weight={4}
                                        />
                                    )}
                                </MapContainer>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🗺️</div>
                                    <p>Bus location not available</p>
                                </div>
                            )}
                            <div className="map-info">
                                <div className="info-item">
                                    <span className="info-label">Last Updated:</span>
                                    <span className="info-value">
                                        {busLocation ? new Date(busLocation.timestamp).toLocaleTimeString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Speed:</span>
                                    <span className="info-value">{busLocation?.speed || 0} km/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Log */}
                <div className="card notifications-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">🔔</span>
                            Notification Log
                        </h2>
                    </div>
                    <div className="card-body">
                        {notifications.length > 0 ? (
                            <div className="notifications-list">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="notification-item">
                                        <div className="notification-icon">
                                            {notification.type === 'boarded' ? '🚌' :
                                                notification.type === 'arrived' ? '✓' :
                                                    notification.type === 'delay' ? '⚠️' : '📢'}
                                        </div>
                                        <div className="notification-content">
                                            <p className="notification-message">{notification.message}</p>
                                            <span className="notification-time">
                                                {new Date(notification.timestamp).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔔</div>
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trip Details */}
                <div className="card details-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <span className="section-icon">ℹ️</span>
                            Trip Details
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="details-list">
                            <div className="detail-row">
                                <span className="detail-label">Route:</span>
                                <span className="detail-value">{studentData?.route?.name || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Bus Number:</span>
                                <span className="detail-value">{studentData?.bus?.number || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Driver:</span>
                                <span className="detail-value">{studentData?.driver?.name || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Seat Number:</span>
                                <span className="detail-value">{studentData?.seatNumber || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Pickup Location:</span>
                                <span className="detail-value">{studentData?.pickupLocation || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Estimated Arrival:</span>
                                <span className="detail-value">{studentData?.eta || 'Calculating...'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reassurance Footer */}
            <div className="reassurance-footer">
                <div className="reassurance-icon">🔒</div>
                <p className="reassurance-text">
                    Your child's safety is our priority. This page updates automatically every 15 seconds.
                </p>
            </div>
        </div>
    );
};

export default ParentTracking;

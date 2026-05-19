import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './DriverDashboard.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DriverDashboard = () => {
    const [currentTrip, setCurrentTrip] = useState(null);
    const [students, setStudents] = useState([]);
    const [nextStop, setNextStop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        fetchTripData();
        const interval = setInterval(fetchTripData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchTripData = async () => {
        try {
            setLoading(true);
            const [tripRes, studentsRes] = await Promise.all([
                axios.get('/api/driver/current-trip'),
                axios.get('/api/driver/students')
            ]);

            setCurrentTrip(tripRes.data);
            setStudents(studentsRes.data);

            // Find next stop
            if (tripRes.data && tripRes.data.route && tripRes.data.route.stops) {
                const nextUnvisited = tripRes.data.route.stops.find(stop => !stop.visited);
                setNextStop(nextUnvisited);
            }
        } catch (error) {
            console.error('Error fetching trip data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHoldStart = () => {
        setIsHolding(true);
        setHoldProgress(0);

        const interval = setInterval(() => {
            setHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    handlePickupComplete();
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
    };

    const handleHoldEnd = () => {
        setIsHolding(false);
        setHoldProgress(0);
    };

    const handlePickupComplete = async () => {
        try {
            await axios.post('/api/driver/mark-pickup', {
                tripId: currentTrip._id,
                stopId: nextStop._id
            });

            // Show success feedback
            setIsHolding(false);
            setHoldProgress(0);

            // Refresh data
            fetchTripData();
        } catch (error) {
            console.error('Error marking pickup:', error);
            setIsHolding(false);
            setHoldProgress(0);
        }
    };

    const getRemainingStudents = () => {
        return students.filter(s => s.status !== 'picked_up').length;
    };

    if (loading) {
        return (
            <div className="driver-dashboard dark-mode">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your trip...</p>
                </div>
            </div>
        );
    }

    if (!currentTrip) {
        return (
            <div className="driver-dashboard dark-mode">
                <div className="empty-state">
                    <div className="empty-state-icon">🚌</div>
                    <h2>No Active Trip</h2>
                    <p>You don't have any scheduled trips at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="driver-dashboard dark-mode">
            {/* Status Bar */}
            <div className="status-bar">
                <div className="status-item">
                    <span className="status-icon">🚌</span>
                    <div className="status-info">
                        <span className="status-label">Route</span>
                        <span className="status-value">{currentTrip.route?.name}</span>
                    </div>
                </div>
                <div className="status-item">
                    <span className="status-icon">📍</span>
                    <div className="status-info">
                        <span className="status-label">Next Stop</span>
                        <span className="status-value">{nextStop?.name || 'Final Destination'}</span>
                    </div>
                </div>
                <div className="status-item">
                    <span className="status-icon">👥</span>
                    <div className="status-info">
                        <span className="status-label">Remaining</span>
                        <span className="status-value-large">{getRemainingStudents()}</span>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-section">
                <MapContainer
                    center={[31.5204, 74.3587]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    {currentTrip.route?.stops && (
                        <>
                            <Polyline
                                positions={currentTrip.route.stops.map(stop => [stop.latitude, stop.longitude])}
                                color="#06B6D4"
                                weight={5}
                            />
                            {currentTrip.route.stops.map((stop, index) => (
                                <Marker
                                    key={index}
                                    position={[stop.latitude, stop.longitude]}
                                />
                            ))}
                        </>
                    )}
                </MapContainer>
            </div>

            {/* Student Manifest */}
            <div className="manifest-section">
                <h2 className="manifest-title">
                    <span className="manifest-icon">📋</span>
                    Student Manifest
                </h2>
                <div className="student-list">
                    {students.map(student => (
                        <div
                            key={student._id}
                            className={`student-item ${student.status === 'picked_up' ? 'picked-up' : ''}`}
                        >
                            <div className="student-avatar">
                                {student.name?.charAt(0).toUpperCase() || '👤'}
                            </div>
                            <div className="student-info">
                                <h4 className="student-name">{student.name}</h4>
                                <p className="student-details">
                                    <span className="detail-icon">💺</span>
                                    Seat {student.seatNumber}
                                    <span className="detail-separator">•</span>
                                    <span className="detail-icon">📍</span>
                                    {student.pickupLocation}
                                </p>
                            </div>
                            {student.status === 'picked_up' ? (
                                <div className="status-badge picked-up">
                                    <span className="badge-icon">✓</span>
                                    Picked Up
                                </div>
                            ) : (
                                <div className="status-badge pending">
                                    <span className="badge-icon">⏱</span>
                                    Waiting
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Action Button */}
            <div className="action-section">
                <div className="action-instructions">
                    <span className="instruction-icon">👆</span>
                    <p>Hold the button below to confirm student pickup</p>
                </div>
                <button
                    className={`hold-button ${isHolding ? 'holding' : ''} ${holdProgress === 100 ? 'complete' : ''}`}
                    onMouseDown={handleHoldStart}
                    onMouseUp={handleHoldEnd}
                    onMouseLeave={handleHoldEnd}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={handleHoldEnd}
                    disabled={getRemainingStudents() === 0}
                >
                    <div className="hold-progress" style={{ width: `${holdProgress}%` }}></div>
                    <div className="hold-content">
                        {holdProgress === 100 ? (
                            <>
                                <span className="hold-icon">✓</span>
                                <span className="hold-text">Pickup Confirmed!</span>
                            </>
                        ) : isHolding ? (
                            <>
                                <span className="hold-icon">⏱</span>
                                <span className="hold-text">Hold to Confirm...</span>
                            </>
                        ) : (
                            <>
                                <span className="hold-icon">👆</span>
                                <span className="hold-text">Mark as Picked Up</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default DriverDashboard;

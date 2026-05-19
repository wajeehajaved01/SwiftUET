import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatBookingModal.css';

const SeatBookingModal = ({ schedule, onClose, onComplete }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');

    // Bus layout configuration
    const ROWS = 10;
    const SEATS_PER_ROW = 4;
    const FACULTY_ROWS = 3; // First 3 rows reserved for faculty

    useEffect(() => {
        fetchSeatAvailability();
    }, [schedule]);

    const fetchSeatAvailability = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/bookings/schedule/${schedule._id}/seats`);
            setSeats(response.data);
        } catch (error) {
            console.error('Error fetching seats:', error);
            setError('Failed to load seat availability');
        } finally {
            setLoading(false);
        }
    };

    const generateSeatLayout = () => {
        const layout = [];
        for (let row = 1; row <= ROWS; row++) {
            const rowSeats = [];
            for (let col = 1; col <= SEATS_PER_ROW; col++) {
                const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // 1A, 1B, etc.
                const isFacultyRow = row <= FACULTY_ROWS;
                const isBooked = seats.some(seat => seat.seatNumber === seatNumber && seat.status === 'confirmed');
                const isAisle = col === 2; // Aisle after 2nd seat

                rowSeats.push({
                    number: seatNumber,
                    row,
                    col,
                    isFacultyRow,
                    isBooked,
                    isAisle
                });
            }
            layout.push(rowSeats);
        }
        return layout;
    };

    const handleSeatClick = (seat) => {
        if (seat.isFacultyRow) {
            setError('This seat is reserved for faculty members only');
            return;
        }
        if (seat.isBooked) {
            setError('This seat is already booked');
            return;
        }
        setError('');
        setSelectedSeat(seat.number);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSeat) {
            setError('Please select a seat');
            return;
        }

        try {
            setBooking(true);
            setError('');
            await axios.post('/api/bookings', {
                scheduleId: schedule._id,
                seatNumber: selectedSeat
            });
            onComplete();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to book seat');
        } finally {
            setBooking(false);
        }
    };

    const seatLayout = generateSeatLayout();

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal seat-booking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Select Your Seat</h2>
                        <p className="modal-subtitle">{schedule.route?.name}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="alert alert-danger">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <p>Loading seat availability...</p>
                        </div>
                    ) : (
                        <>
                            {/* Bus Front Indicator */}
                            <div className="bus-front">
                                <div className="driver-section">
                                    <span className="driver-icon">🚗</span>
                                    <span className="driver-label">Driver</span>
                                </div>
                            </div>

                            {/* Seat Grid */}
                            <div className="seat-grid">
                                {seatLayout.map((row, rowIndex) => (
                                    <div key={rowIndex} className="seat-row">
                                        <div className="row-label">Row {rowIndex + 1}</div>
                                        <div className="seats-container">
                                            {row.map((seat, seatIndex) => (
                                                <React.Fragment key={seat.number}>
                                                    <button
                                                        className={`seat ${seat.isFacultyRow ? 'seat-faculty' : ''
                                                            } ${seat.isBooked ? 'seat-booked' : ''
                                                            } ${selectedSeat === seat.number ? 'seat-selected' : ''
                                                            } ${!seat.isFacultyRow && !seat.isBooked ? 'seat-available' : ''
                                                            }`}
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={seat.isFacultyRow || seat.isBooked}
                                                        title={
                                                            seat.isFacultyRow
                                                                ? 'Faculty Only'
                                                                : seat.isBooked
                                                                    ? 'Already Booked'
                                                                    : `Seat ${seat.number}`
                                                        }
                                                    >
                                                        <span className="seat-icon">💺</span>
                                                        <span className="seat-number">{seat.number}</span>
                                                        {seat.isFacultyRow && (
                                                            <span className="faculty-badge">Faculty</span>
                                                        )}
                                                    </button>
                                                    {seat.isAisle && <div className="aisle"></div>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="seat-legend">
                                <div className="legend-item">
                                    <div className="legend-icon seat-available">💺</div>
                                    <span>Available</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-icon seat-selected">💺</div>
                                    <span>Selected</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-icon seat-booked">💺</div>
                                    <span>Booked</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-icon seat-faculty">💺</div>
                                    <span>Faculty Only</span>
                                </div>
                            </div>

                            {/* Selected Seat Info */}
                            {selectedSeat && (
                                <div className="selected-seat-info">
                                    <div className="info-icon">✓</div>
                                    <div className="info-content">
                                        <h4>Selected Seat: {selectedSeat}</h4>
                                        <p>
                                            Departure: {new Date(schedule.departureTime).toLocaleString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={booking}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleConfirmBooking}
                        disabled={!selectedSeat || booking}
                    >
                        {booking ? (
                            <>
                                <div className="loading-spinner-small"></div>
                                Booking...
                            </>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatBookingModal;

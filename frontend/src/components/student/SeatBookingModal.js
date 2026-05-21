import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './SeatBookingModal.css';

const SeatBookingModal = ({ schedule, onClose, onComplete }) => {
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchBookedSeats();
    }, [schedule]);

    const fetchBookedSeats = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/bookings/schedule/${schedule._id}`);
            const seats = response.data.data || response.data || [];
            // Extract just the seat numbers
            const seatNumbers = seats.map(s => s.seatNumber || s);
            setBookedSeats(seatNumbers);
        } catch (error) {
            console.error('Error fetching booked seats:', error);
            setBookedSeats([]);
        } finally {
            setLoading(false);
        }
    };

    const generateSeats = () => {
        const seats = [];
        const rows = 10;
        const seatsPerRow = 4;
        const seatLabels = ['A', 'B', 'C', 'D'];

        for (let row = 1; row <= rows; row++) {
            for (let col = 0; col < seatsPerRow; col++) {
                const seatNumber = `${row}${seatLabels[col]}`;
                const isFacultyRow = row <= 3;
                const isBooked = bookedSeats.includes(seatNumber);
                const isSelected = selectedSeat === seatNumber;

                seats.push({
                    number: seatNumber,
                    row,
                    col,
                    isFacultyRow,
                    isBooked,
                    isSelected,
                    isAvailable: !isFacultyRow && !isBooked
                });
            }
        }

        return seats;
    };

    const handleSeatClick = (seat) => {
        if (seat.isFacultyRow || seat.isBooked) {
            return; // Do nothing for faculty or booked seats
        }

        setSelectedSeat(seat.number);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSeat) {
            alert('Please select a seat first');
            return;
        }

        try {
            setBooking(true);
            await api.post('/bookings', {
                scheduleId: schedule._id,
                seatNumber: selectedSeat
            });

            alert(`✅ Seat ${selectedSeat} booked successfully!`);
            onComplete();
        } catch (error) {
            console.error('Error booking seat:', error);
            const errorMessage = error.response?.data?.error || 'Failed to book seat. Please try again.';
            alert(`❌ ${errorMessage}`);
        } finally {
            setBooking(false);
        }
    };

    const seats = generateSeats();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content seat-booking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Select Your Seat</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {/* Schedule Info */}
                    <div className="schedule-info-banner">
                        <div className="info-item">
                            <span className="info-icon">🚌</span>
                            <span className="info-text">Bus {schedule.busId?.busNumber || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <span className="info-text">{schedule.route || 'Route'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">🕐</span>
                            <span className="info-text">{schedule.departureTime}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="seat-legend">
                        <div className="legend-item">
                            <div className="legend-box available"></div>
                            <span>Available</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box booked"></div>
                            <span>Booked</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box faculty"></div>
                            <span>Faculty Only</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box selected"></div>
                            <span>Selected</span>
                        </div>
                    </div>

                    {/* Bus Layout */}
                    {loading ? (
                        <div className="loading-seats">
                            <div className="loading-spinner"></div>
                            <p>Loading seats...</p>
                        </div>
                    ) : (
                        <div className="bus-layout">
                            <div className="bus-front">
                                <div className="driver-seat">🚗 Driver</div>
                            </div>

                            <div className="seats-grid">
                                {[...Array(10)].map((_, rowIndex) => {
                                    const rowNumber = rowIndex + 1;
                                    const rowSeats = seats.filter(s => s.row === rowNumber);
                                    const isFacultyRow = rowNumber <= 3;

                                    return (
                                        <div key={rowNumber} className="seat-row">
                                            {isFacultyRow && (
                                                <div className="faculty-label">Faculty Only</div>
                                            )}
                                            <div className="row-seats">
                                                {rowSeats.slice(0, 2).map(seat => (
                                                    <button
                                                        key={seat.number}
                                                        className={`seat ${seat.isFacultyRow ? 'faculty' :
                                                                seat.isBooked ? 'booked' :
                                                                    seat.isSelected ? 'selected' :
                                                                        'available'
                                                            }`}
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={seat.isFacultyRow || seat.isBooked}
                                                        title={
                                                            seat.isFacultyRow ? 'Faculty Only' :
                                                                seat.isBooked ? 'Already Booked' :
                                                                    `Seat ${seat.number}`
                                                        }
                                                    >
                                                        {seat.number}
                                                    </button>
                                                ))}
                                                <div className="aisle"></div>
                                                {rowSeats.slice(2, 4).map(seat => (
                                                    <button
                                                        key={seat.number}
                                                        className={`seat ${seat.isFacultyRow ? 'faculty' :
                                                                seat.isBooked ? 'booked' :
                                                                    seat.isSelected ? 'selected' :
                                                                        'available'
                                                            }`}
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={seat.isFacultyRow || seat.isBooked}
                                                        title={
                                                            seat.isFacultyRow ? 'Faculty Only' :
                                                                seat.isBooked ? 'Already Booked' :
                                                                    `Seat ${seat.number}`
                                                        }
                                                    >
                                                        {seat.number}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Selected Seat Info */}
                    {selectedSeat && (
                        <div className="selected-seat-info">
                            <span className="selected-icon">✓</span>
                            <span className="selected-text">You selected seat <strong>{selectedSeat}</strong></span>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={booking}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirmBooking}
                        disabled={!selectedSeat || booking}
                    >
                        {booking ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatBookingModal;

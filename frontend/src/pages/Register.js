import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'student',
        phone: '+92',
        isFaculty: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(formData);

        if (result.success) {
            navigate(`/${formData.role}/dashboard`);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-pattern"></div>
            </div>

            <div className="login-content">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <div className="logo-icon">🚌</div>
                            <h1 className="logo-text">SwiftUET</h1>
                        </div>
                        <p className="login-subtitle">Create Your Account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="alert alert-danger">
                                <span>⚠️</span>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ahmed"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Khan"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@uet.edu.pk"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+923001234567"
                                pattern="^\+92\d{10}$"
                            />
                            <small style={{ color: 'var(--color-gray-600)', marginTop: 'var(--spacing-xs)', display: 'block' }}>
                                Format: +92XXXXXXXXXX
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Register As</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="student">Student</option>
                                <option value="driver">Driver</option>
                                <option value="parent">Parent</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {formData.role === 'student' && (
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="isFaculty"
                                        checked={formData.isFaculty}
                                        onChange={handleChange}
                                        style={{ width: 'auto', minHeight: 'auto' }}
                                    />
                                    <span>I am a faculty member</span>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner-small"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <Link to="/login" className="login-link">Already have an account?</Link>
                    </div>

                    <div className="login-info">
                        <p className="info-text">
                            <span className="info-icon">🔒</span>
                            Secure registration powered by SwiftUET
                        </p>
                    </div>
                </div>

                <div className="login-features">
                    <div className="feature-item">
                        <div className="feature-icon">📍</div>
                        <h3>Real-Time Tracking</h3>
                        <p>Track your bus location live on the map</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">💺</div>
                        <h3>Easy Seat Booking</h3>
                        <p>Reserve your seat with a single tap</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Alerts</h3>
                        <p>Get notified about delays and updates</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);

            // Navigate based on role from backend response
            const user = JSON.parse(localStorage.getItem('user'));
            switch (user.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'driver':
                    navigate('/driver/dashboard');
                    break;
                case 'parent':
                    navigate('/parent/tracking');
                    break;
                default:
                    navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        <p className="login-subtitle">Smart University Bus Management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="alert alert-danger">
                                <span>⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@uet.edu.pk"
                                required
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
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner-small"></div>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In to SwiftUET'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <Link to="/forgot-password" className="login-link">Forgot Password?</Link>
                        <span className="login-divider">•</span>
                        <Link to="/register" className="login-link">Create Account</Link>
                    </div>

                    <div className="login-info">
                        <p className="info-text">
                            <span className="info-icon">🔒</span>
                            Secure login powered by SwiftUET
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

export default Login;

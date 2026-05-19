import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setMessage({
                type: 'success',
                text: response.data.message || 'Password reset instructions have been sent to your email.'
            });
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send reset email. Please try again.'
            });
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
                        <p className="login-subtitle">Reset Your Password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {message.text && (
                            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                                <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
                                {message.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@uet.edu.pk"
                                required
                                autoComplete="email"
                            />
                            <small style={{ color: 'var(--color-gray-600)', marginTop: 'var(--spacing-xs)', display: 'block' }}>
                                Enter your email address and we'll send you instructions to reset your password.
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner-small"></div>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Instructions'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <Link to="/login" className="login-link">
                            ← Back to Login
                        </Link>
                        <span className="login-divider">•</span>
                        <Link to="/register" className="login-link">Create Account</Link>
                    </div>

                    <div className="login-info">
                        <p className="info-text">
                            <span className="info-icon">🔒</span>
                            Secure password reset powered by SwiftUET
                        </p>
                    </div>
                </div>

                <div className="login-features">
                    <div className="feature-item">
                        <div className="feature-icon">📧</div>
                        <h3>Email Verification</h3>
                        <p>We'll send a secure reset link to your email</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🔐</div>
                        <h3>Secure Process</h3>
                        <p>Your account security is our top priority</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <h3>Quick Reset</h3>
                        <p>Get back to your account in minutes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

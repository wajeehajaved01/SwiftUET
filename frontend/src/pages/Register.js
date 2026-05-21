import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        password: '', confirmPassword: '', phoneNumber: '',
        role: 'student', isFaculty: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.password || !formData.phoneNumber) {
            return setError('All fields are required');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (formData.role === 'admin') {
            return setError('Admin accounts cannot be created here. Contact system administrator.');
        }

        setLoading(true);
        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                isFaculty: formData.isFaculty
            });

            if (result.success) {
                switch (formData.role) {
                    case 'driver': navigate('/driver/dashboard'); break;
                    case 'parent': navigate('/parent/tracking'); break;
                    default: navigate('/student/dashboard');
                }
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: '#1E293B', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2rem' }}>🚌</div>
                    <h1 style={{ color: '#F59E0B', margin: '0.5rem 0', fontSize: '1.8rem' }}>SwiftUET</h1>
                    <p style={{ color: '#94A3B8', margin: 0 }}>Create Your Account</p>
                </div>

                {error && (
                    <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '14px' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>First Name</label>
                            <input name="firstName" value={formData.firstName} onChange={handleChange}
                                placeholder="Ahmed" required
                                style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Last Name</label>
                            <input name="lastName" value={formData.lastName} onChange={handleChange}
                                placeholder="Khan" required
                                style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Email Address</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="ahmed@uet.edu.pk" required
                            style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                            placeholder="+923001234567" required
                            style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                                placeholder="Min 6 characters" required
                                style={{ width: '100%', padding: '10px 40px 10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                        <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange}
                            placeholder="Repeat your password" required
                            style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Register As</label>
                        <select name="role" value={formData.role} onChange={handleChange}
                            style={{ width: '100%', padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
                            <option value="student">Student</option>
                            <option value="driver">Driver</option>
                            <option value="parent">Parent</option>
                        </select>
                        <p style={{ color: '#64748B', fontSize: '12px', margin: '4px 0 0' }}>Admin accounts are created by the system administrator only.</p>
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" name="isFaculty" id="isFaculty" checked={formData.isFaculty} onChange={handleChange}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        <label htmlFor="isFaculty" style={{ color: '#94A3B8', fontSize: '14px', cursor: 'pointer' }}>I am a faculty member</label>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '12px', background: loading ? '#475569' : '#F59E0B', border: 'none', borderRadius: '8px', color: '#0F172A', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#64748B', marginTop: '1.5rem', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#F59E0B', textDecoration: 'none' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
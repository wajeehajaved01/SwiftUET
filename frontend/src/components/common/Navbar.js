import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const getRoleBasedLinks = () => {
        if (!user) return null;

        switch (user.role) {
            case 'admin':
                return (
                    <>
                        <Link
                            to="/admin/dashboard"
                            className={`navbar-link ${isActive('/admin/dashboard')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">📊</span>
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/buses"
                            className={`navbar-link ${isActive('/admin/buses')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">🚌</span>
                            Buses
                        </Link>
                        <Link
                            to="/admin/routes"
                            className={`navbar-link ${isActive('/admin/routes')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">🗺️</span>
                            Routes
                        </Link>
                        <Link
                            to="/admin/schedules"
                            className={`navbar-link ${isActive('/admin/schedules')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">📅</span>
                            Schedules
                        </Link>
                        <Link
                            to="/admin/users"
                            className={`navbar-link ${isActive('/admin/users')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">👥</span>
                            Users
                        </Link>
                    </>
                );
            case 'driver':
                return (
                    <>
                        <Link
                            to="/driver/dashboard"
                            className={`navbar-link ${isActive('/driver/dashboard')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">🎯</span>
                            Dashboard
                        </Link>
                        <Link
                            to="/driver/schedule"
                            className={`navbar-link ${isActive('/driver/schedule')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">📋</span>
                            My Schedule
                        </Link>
                    </>
                );
            case 'student':
                return (
                    <>
                        <Link
                            to="/student/dashboard"
                            className={`navbar-link ${isActive('/student/dashboard')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">🏠</span>
                            Dashboard
                        </Link>
                        <Link
                            to="/student/bookings"
                            className={`navbar-link ${isActive('/student/bookings')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">🎫</span>
                            My Bookings
                        </Link>
                    </>
                );
            case 'parent':
                return (
                    <>
                        <Link
                            to="/parent/tracking"
                            className={`navbar-link ${isActive('/parent/tracking')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">📍</span>
                            Track Student
                        </Link>
                    </>
                );
            default:
                return null;
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { text: 'Admin', class: 'badge-danger' },
            driver: { text: 'Driver', class: 'badge-info' },
            student: { text: 'Student', class: 'badge-success' },
            parent: { text: 'Parent', class: 'badge-warning' }
        };
        return badges[role] || { text: role, class: 'badge-navy' };
    };

    const getUserName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.name || 'User';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                    <span className="brand-icon">🚌</span>
                    <span className="brand-text">SwiftUET</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="toggle-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
                </button>

                <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {user ? (
                        <>
                            <div className="navbar-links">
                                {getRoleBasedLinks()}
                            </div>

                            <div className="navbar-user">
                                <div className="user-info">
                                    <span className="user-avatar">
                                        {getUserName().charAt(0).toUpperCase()}
                                    </span>
                                    <div className="user-details">
                                        <span className="user-name">{getUserName()}</span>
                                        <span className={`badge ${getRoleBadge(user.role).class}`}>
                                            {getRoleBadge(user.role).text}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                                    <span className="logout-icon">🚪</span>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminBuses.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Note: This endpoint needs to be created in the backend
            const response = await api.get('/users');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // For now, show empty state
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = filter === 'all'
        ? users
        : users.filter(user => user.role === filter);

    const getRoleBadgeClass = (role) => {
        const classes = {
            admin: 'badge-danger',
            driver: 'badge-info',
            student: 'badge-success',
            parent: 'badge-warning'
        };
        return classes[role] || 'badge-navy';
    };

    if (loading) {
        return (
            <div className="admin-buses">
                <div className="loading">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="admin-buses">
            <div className="page-header">
                <h1>User Management</h1>
                <div className="filter-buttons">
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Users
                    </button>
                    <button
                        className={`btn ${filter === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('student')}
                    >
                        Students
                    </button>
                    <button
                        className={`btn ${filter === 'driver' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('driver')}
                    >
                        Drivers
                    </button>
                    <button
                        className={`btn ${filter === 'parent' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('parent')}
                    >
                        Parents
                    </button>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <p>No users found. The user management endpoint needs to be implemented in the backend.</p>
                </div>
            ) : (
                <div className="buses-grid">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="bus-card">
                            <div className="bus-header">
                                <h3>{user.firstName} {user.lastName}</h3>
                                <span className={`status-badge ${getRoleBadgeClass(user.role)}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="bus-details">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                                {user.isFaculty && (
                                    <p><strong>Faculty Member:</strong> Yes</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

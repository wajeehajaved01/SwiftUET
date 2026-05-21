import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/student/StudentDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBuses from './pages/admin/AdminBuses';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminUsers from './pages/admin/AdminUsers';
import ParentTracking from './pages/parent/ParentTracking';

import './App.css';

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Protected Student routes */}
                        <Route
                            path="/student/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <AuthenticatedLayout>
                                        <StudentDashboard />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student/bookings"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <AuthenticatedLayout>
                                        <StudentDashboard />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Driver routes */}
                        <Route
                            path="/driver/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['driver']}>
                                    <DriverDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Admin routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AuthenticatedLayout>
                                        <AdminDashboard />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/buses"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AuthenticatedLayout>
                                        <AdminBuses />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/routes"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AuthenticatedLayout>
                                        <AdminRoutes />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/schedules"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AuthenticatedLayout>
                                        <AdminSchedules />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AuthenticatedLayout>
                                        <AdminUsers />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Parent routes */}
                        <Route
                            path="/parent/tracking"
                            element={
                                <ProtectedRoute allowedRoles={['parent']}>
                                    <AuthenticatedLayout>
                                        <ParentTracking />
                                    </AuthenticatedLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

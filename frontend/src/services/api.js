import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// Authentication APIs
// ============================================
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me')
};

// ============================================
// Student APIs
// ============================================
export const studentAPI = {
    getDashboard: () => api.get('/student/dashboard'),
    getActiveRoute: () => api.get('/routes/active'),
    getBookingHistory: () => api.get('/bookings/my-history'),
    getAvailableSchedules: () => api.get('/schedules/available'),
    getDelayAlerts: () => api.get('/notifications/delay-alerts'),
    getBusLocation: () => api.get('/locations/current'),
    getSeatAvailability: (scheduleId) => api.get(`/bookings/schedule/${scheduleId}/seats`),
    bookSeat: (bookingData) => api.post('/bookings', bookingData),
    cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`)
};

// ============================================
// Driver APIs
// ============================================
export const driverAPI = {
    getCurrentTrip: () => api.get('/driver/current-trip'),
    getStudents: () => api.get('/driver/students'),
    markPickup: (data) => api.post('/driver/mark-pickup', data),
    updateLocation: (locationData) => api.post('/driver/update-location', locationData),
    getSchedule: () => api.get('/driver/schedule')
};

// ============================================
// Admin APIs
// ============================================
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),

    // Routes
    getRoutes: () => api.get('/routes'),
    createRoute: (routeData) => api.post('/routes', routeData),
    updateRoute: (routeId, routeData) => api.put(`/routes/${routeId}`, routeData),
    deleteRoute: (routeId) => api.delete(`/routes/${routeId}`),

    // Buses
    getBuses: () => api.get('/buses'),
    createBus: (busData) => api.post('/buses', busData),
    updateBus: (busId, busData) => api.put(`/buses/${busId}`, busData),
    deleteBus: (busId) => api.delete(`/buses/${busId}`),

    // Drivers
    getDrivers: () => api.get('/users/drivers'),
    assignDriver: (data) => api.post('/admin/assign-driver', data),

    // Schedules
    getSchedules: () => api.get('/schedules'),
    createSchedule: (scheduleData) => api.post('/schedules', scheduleData),
    updateSchedule: (scheduleId, scheduleData) => api.put(`/schedules/${scheduleId}`, scheduleData),
    deleteSchedule: (scheduleId) => api.delete(`/schedules/${scheduleId}`),

    // Settings
    toggleFacultyRows: (data) => api.post('/admin/toggle-faculty-rows', data),

    // Broadcast
    sendBroadcast: (broadcastData) => api.post('/admin/broadcast', broadcastData),
    getBroadcastHistory: () => api.get('/admin/broadcast-history'),

    // Analytics
    getAnalytics: () => api.get('/admin/analytics'),
    exportData: () => api.get('/admin/export', { responseType: 'blob' })
};

// ============================================
// Parent APIs
// ============================================
export const parentAPI = {
    getStudentInfo: () => api.get('/parent/student-info'),
    getBusLocation: () => api.get('/parent/bus-location'),
    getNotifications: () => api.get('/parent/notifications'),
    getTrackingData: () => api.get('/parent/tracking')
};

// ============================================
// Common APIs
// ============================================
export const commonAPI = {
    getLocations: () => api.get('/locations'),
    getNotifications: () => api.get('/notifications'),
    markNotificationRead: (notificationId) => api.put(`/notifications/${notificationId}/read`)
};

export default api;

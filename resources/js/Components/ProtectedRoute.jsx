// resources/js/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // SELAMA LOADING → TUNGGU DULU (INI YANG PENTING!)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-2xl font-bold text-indigo-600">Loading...</div>
            </div>
        );
    }

    // KALAU GAK ADA USER → BARU REDIRECT
    if (!user || user.role !== 'umkm_admin') {
        return <Navigate to="/login" replace />;
    }

    // KALAU SUDAH ADA USER → LANJUT KE DASHBOARD
    return <Outlet />;
}

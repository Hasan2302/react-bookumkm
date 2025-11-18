// resources/js/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Login from '@/Pages/Auth/Login';
import UmkmDashboard from '@/Pages/Umkm/UmkmDashboard';
import FormBuilder from '@/Pages/Umkm/FormBuilder';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><div className="text-2xl">Loading...</div></div>;
    }

    if (!user || user.role !== 'umkm_admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-3xl font-bold text-indigo-600">BookUMKM</div></div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/umkm/dashboard"
                element={
                    <ProtectedRoute>
                        <UmkmDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/umkm/formbuilder"
                element={
                    <ProtectedRoute>
                        <FormBuilder />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

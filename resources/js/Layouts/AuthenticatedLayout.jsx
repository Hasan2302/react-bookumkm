// resources/js/Layouts/AuthenticatedLayout.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // GANTI dari @inertiajs/react

export default function AuthenticatedLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            // Kalau tidak ada → redirect ke login
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-lg">
                <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
                    <div className="text-2xl font-bold text-indigo-600">BookUMKM</div>
                    <div className="flex items-center gap-6">
                        <span className="text-gray-700">Hi, {user.name}!</span>
                        <button onClick={handleLogout} className="text-red-600 hover:underline">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}

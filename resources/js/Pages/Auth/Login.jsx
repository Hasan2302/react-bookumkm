// resources/js/Pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '@/Services/Api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate(); // ← PENTING! Pakai React Router

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const { token, user } = response.data.data;

            // Simpan token & user ke localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'superadmin') {
                navigate('/superadmin/dashboard');
                window.location.reload();
            } else if (user.role === 'umkm_admin') {
                navigate('/umkm/dashboard');
                window.location.reload();
            } else {
                navigate('/');
                window.location.reload();
            }

        } catch (err) {
            const msg = err.response?.data?.message || 'Email atau password salah!';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl md:p-10">
                {/* Logo & Judul */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        BookUMKM
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">Login ke dashboard UMKM Anda</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 mb-6 font-medium text-center text-red-700 border border-red-300 bg-red-50 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-4 text-base transition border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            placeholder="owner@salonbudi.com"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-4 text-base transition border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center w-full gap-3 py-5 text-lg font-bold text-white transition shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Sedang masuk...
                            </>
                        ) : (
                            'Masuk ke Dashboard'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-sm text-center text-gray-600">
                    <p>
                        Belum punya akun?{' '}
                        <a href="/register" className="font-bold text-indigo-600 hover:underline">
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

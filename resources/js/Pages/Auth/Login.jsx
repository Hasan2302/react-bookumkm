import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Store, Shield } from 'lucide-react';
import api from '@/Services/Api';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        role: 'umkm_admin' // Default role untuk UMKM
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ensure email is set for superadmin
            const payload = {
                ...form,
                email: form.role === 'superadmin' ? 'admin@gmail.com' : form.email
            };

            const response = await api.post('/login', payload);
            const { token, user } = response.data.data;

            // Simpan ke localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect berdasarkan role
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
            setError(err.response?.data?.message || 'Email atau password salah!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center flex-1 p-6 bg-white lg:p-8">
                <div className="w-full max-w-md">
                    {/* Logo & Brand */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                            BookUMKM
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">Masuk ke dashboard Anda</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Login Sebagai
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, role: 'umkm_admin', email: '' })}
                                className={`p-3 text-center border rounded-lg transition-all ${
                                    form.role === 'umkm_admin'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <Store className="w-4 h-4 mx-auto mb-1" />
                                <span className="text-xs font-medium">UMKM</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, role: 'superadmin', email: 'admin@example.com' })}
                                className={`p-3 text-center border rounded-lg transition-all ${
                                    form.role === 'superadmin'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <Shield className="w-4 h-4 mx-auto mb-1" />
                                <span className="text-xs font-medium">Super Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 mb-4 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Field - HIDDEN untuk Super Admin */}
                        <div className={`${form.role === 'superadmin' ? 'hidden' : 'block'}`}>
                            <label className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required={form.role !== 'superadmin'}
                                className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                placeholder="owner@salon.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 pr-10 text-sm transition border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                    placeholder={
                                        form.role === 'superadmin'
                                            ? "Masukkan password super admin"
                                            : "Masukkan password"
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-gray-600">Ingat saya</span>
                            </label>
                            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                                Lupa password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sedang masuk...
                                </>
                            ) : (
                                `Masuk sebagai ${form.role === 'superadmin' ? 'Super Admin' : 'UMKM'}`
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className={`mt-6 text-center ${form.role === 'superadmin' ? 'hidden' : 'block'}`}>
                        <p className="text-sm text-gray-600">
                            Belum punya akun UMKM?{' '}
                            <Link to="/register-umkm" className="font-bold text-primary-600 hover:underline">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="flex-1 hidden bg-gradient-to-br from-primary-600 to-primary-700 lg:flex lg:items-center lg:justify-center">
                <div className="max-w-md p-6 text-white">
                    <h2 className="mb-4 text-2xl font-bold">
                        {form.role === 'superadmin' ? 'Admin System' : 'Tingkatkan Bisnis UMKM'}
                    </h2>
                    <p className="mb-6 text-sm text-primary-100">
                        {form.role === 'superadmin'
                            ? 'Kelola sistem dan pantau semua UMKM dalam satu dashboard terpusat.'
                            : 'Kelola booking pelanggan dengan mudah dan tumbuhkan bisnis dengan tools modern.'
                        }
                    </p>
                    <div className="space-y-3">
                        {form.role === 'superadmin' ? (
                            <>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Kelola semua UMKM</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Statistik sistem lengkap</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Support & monitoring</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Kelola booking 24/7</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Notifikasi WhatsApp</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                        ✓
                                    </div>
                                    <span>Dashboard analitik</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// resources/js/Pages/Auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, Store, BadgeCheck } from 'lucide-react';
import api from '@/Services/Api';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        umkm_name: '',
        phone: '',
        business_type: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const businessTypes = [
        'Salon & Kecantikan',
        'Laundry & Cuci',
        'Bengkel & Servis',
        'Klinik & Kesehatan',
        'Restoran & Cafe',
        'Lainnya'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/auth/register', {
                ...form,
                role: 'umkm_admin'
            });

            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setSuccess(true);
            setTimeout(() => {
                navigate('/umkm/dashboard');
            }, 1500);

        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Registrasi gagal!'] });
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6 bg-white">
                <div className="w-full max-w-sm p-6 text-center bg-white shadow-sm rounded-xl">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="mb-2 text-lg font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                    <p className="text-sm text-gray-600">Mengarahkan ke dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form - LEBAR SAMA DENGAN LOGIN */}
            <div className="flex items-center justify-center flex-1 p-6 bg-white lg:p-8">
                <div className="w-full max-w-md">
                    {/* Logo & Brand - SAMA PERSIS DENGAN LOGIN */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            BookUMKM
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">Daftar akun UMKM baru</p>
                    </div>

                    {/* Error Message - SAMA DENGAN LOGIN */}
                    {errors.general && (
                        <div className="p-3 mb-4 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
                            {errors.general[0]}
                        </div>
                    )}

                    {/* Form - LAYOUT LEBAR */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Pemilik & Email - Inline */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Nama Pemilik *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Nama lengkap"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="email@umkm.com"
                                />
                            </div>
                        </div>

                        {/* Nama UMKM & WhatsApp - Inline */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Nama UMKM *
                                </label>
                                <input
                                    type="text"
                                    value={form.umkm_name}
                                    onChange={(e) => setForm({ ...form, umkm_name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Nama usaha"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="62xxx"
                                />
                            </div>
                        </div>

                        {/* Kategori Usaha - Full Width */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Kategori Usaha *
                            </label>
                            <select
                                value={form.business_type}
                                onChange={(e) => setForm({ ...form, business_type: e.target.value })}
                                required
                                className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Pilih kategori usaha</option>
                                {businessTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Passwords - Inline */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 pr-10 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Min. 8 karakter"
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

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Konfirmasi *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={form.password_confirmation}
                                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 pr-10 text-sm transition border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Ulangi password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms - SAMA DENGAN LOGIN */}
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-gray-600">
                                    Saya menyetujui{' '}
                                    <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Syarat & Ketentuan
                                    </Link>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button - SAMA PERSIS DENGAN LOGIN */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mendaftarkan...
                                </>
                            ) : (
                                <>
                                    <BadgeCheck className="w-4 h-4" />
                                    Daftar UMKM Sekarang
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer - SAMA DENGAN LOGIN */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image - SAMA DENGAN LOGIN */}
            <div className="flex-1 hidden bg-gradient-to-br from-indigo-600 to-purple-700 lg:flex lg:items-center lg:justify-center">
                <div className="max-w-md p-6 text-white">
                    <h2 className="mb-4 text-2xl font-bold">Mulai Bisnis Digital Anda</h2>
                    <p className="mb-6 text-sm text-indigo-100">
                        Daftar sekarang dan kelola bisnis UMKM dengan tools modern yang mudah digunakan.
                    </p>
                    <div className="space-y-3">
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
                            <span>Notifikasi WhatsApp otomatis</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                ✓
                            </div>
                            <span>Dashboard analitik lengkap</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="flex items-center justify-center w-6 h-6 mr-3 bg-white rounded-full bg-opacity-20">
                                ✓
                            </div>
                            <span>Gratis selamanya</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

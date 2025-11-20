// resources/js/Pages/Auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, User, Store, Phone, MapPin, Lock, BadgeCheck } from 'lucide-react';
import api from '@/Services/Api';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        umkm_name: '',
        phone: '',
        address: '',
        business_type: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const businessTypes = [
        { value: 'salon', label: 'Salon & Kecantikan' },
        { value: 'laundry', label: 'Laundry & Cuci' },
        { value: 'bengkel', label: 'Bengkel & Servis' },
        { value: 'klinik', label: 'Klinik & Kesehatan' },
        { value: 'restoran', label: 'Restoran & Cafe' },
        { value: 'retail', label: 'Retail & Toko' },
        { value: 'other', label: 'Lainnya' }
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
            <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
                <div className="w-full max-w-sm p-8 text-center bg-white shadow-lg rounded-2xl">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="mb-3 text-xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                    <p className="mb-6 text-sm text-gray-600">
                        Akun UMKM Anda sudah aktif. Mengarahkan ke dashboard...
                    </p>
                    <div className="w-20 h-1 mx-auto bg-gray-200 rounded-full">
                        <div className="h-1 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex items-center justify-center flex-1 p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link to="/" className="inline-flex items-center text-lg font-bold text-indigo-600">
                            <Store className="w-6 h-6 mr-2" />
                            BookUMKM
                        </Link>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">Daftar UMKM Baru</h1>
                        <p className="mt-2 text-sm text-gray-600">Mulai kelola bisnis Anda dalam 2 menit</p>
                    </div>

                    {/* Form Container */}
                    <div className="p-6 bg-white shadow-sm rounded-xl">
                        {errors.general && (
                            <div className="p-3 mb-4 text-sm text-red-700 rounded-lg bg-red-50">
                                {errors.general[0]}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Pemilik */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Nama Pemilik *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Nama lengkap Anda"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                            </div>

                            {/* Email & Phone - Inline */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="email@umkm.com"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        required
                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="62xxx"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone[0]}</p>}
                                </div>
                            </div>

                            {/* UMKM Name */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Nama UMKM *
                                </label>
                                <input
                                    type="text"
                                    value={form.umkm_name}
                                    onChange={(e) => setForm({ ...form, umkm_name: e.target.value })}
                                    required
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.umkm_name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Nama usaha Anda"
                                />
                                {errors.umkm_name && <p className="mt-1 text-xs text-red-600">{errors.umkm_name[0]}</p>}
                            </div>

                            {/* Business Type */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Jenis Usaha *
                                </label>
                                <select
                                    value={form.business_type}
                                    onChange={(e) => setForm({ ...form, business_type: e.target.value })}
                                    required
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.business_type ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih jenis usaha</option>
                                    {businessTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.business_type && <p className="mt-1 text-xs text-red-600">{errors.business_type[0]}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Alamat UMKM *
                                </label>
                                <textarea
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    required
                                    rows={2}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.address ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Alamat lengkap usaha"
                                />
                                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address[0]}</p>}
                            </div>

                            {/* Passwords - Inline */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            required
                                            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.password ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Min. 8 karakter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Konfirmasi *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={form.password_confirmation}
                                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                            required
                                            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Ulangi password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation[0]}</p>}
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start pt-2 space-x-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-3.5 h-3.5 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label className="text-xs text-gray-600">
                                    Saya menyetujui{' '}
                                    <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Syarat & Ketentuan
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center w-full gap-2 py-2.5 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
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

                        {/* Login Link */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-600">
                                Sudah punya akun?{' '}
                                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Quick Benefits */}
                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <div className="text-sm font-medium text-blue-700">📅 Booking 24/7</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50">
                                <div className="text-sm font-medium text-green-700">💬 Notif WA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

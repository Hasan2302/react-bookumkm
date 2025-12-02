// resources/js/Pages/Auth/RegisterUmkm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, Store, BadgeCheck, ArrowLeft } from 'lucide-react';
import api from '@/Services/Api';

export default function RegisterUmkm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        umkm_name: '',
        phone: '',
        address: '',
        category: ''
    });

    const categories = [
        'Salon', 'Laundry', 'Bengkel', 'Klinik Kecantikan',
        'Barbershop', 'Spa', 'Lainnya'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await api.post('/register-umkm', form);

            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            localStorage.setItem('umkm', JSON.stringify(res.data.data.umkm));

            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/umkm/dashboard'; 
            }, 2000);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Gagal mendaftar!'] });
            }
        } finally {
            setLoading(false);
        }
    };

    // SUCCESS SCREEN — SAMA DENGAN REGISTER BIASA
    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6 bg-white">
                <div className="w-full max-w-sm p-8 text-center bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                    <p className="text-lg text-gray-600">
                        Selamat datang, <strong>{form.umkm_name}</strong>!
                    </p>
                    <p className="mt-4 text-sm text-gray-500">Mengarahkan ke dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* LEFT SIDE — FORM */}
            <div className="flex items-center justify-center flex-1 p-6 bg-white lg:p-12">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-brand-600 hover:text-brand-800">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                    </Link>

                    {/* Logo & Title */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl">
                                <Store className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-600">
                            Daftar UMKM
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">Gratis selamanya • Tanpa biaya</p>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="p-4 mb-6 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
                            {errors.general[0]}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama & Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Nama Pemilik *</label>
                                <input required type="text" placeholder="Nama lengkap" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Email *</label>
                                <input required type="email" placeholder="email@contoh.com" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                            </div>
                        </div>

                        {/* Nama UMKM & WhatsApp */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Nama UMKM *</label>
                                <input required type="text" placeholder="Contoh: Salon Budi" value={form.umkm_name}
                                    onChange={e => setForm({ ...form, umkm_name: e.target.value })}
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                {errors.umkm_name && <p className="mt-1 text-xs text-red-600">{errors.umkm_name[0]}</p>}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">WhatsApp *</label>
                                <input required type="tel" placeholder="628123456789" value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                {errors.phone && <p className="mt-1 text-xs text-ment-600">{errors.phone[0]}</p>}
                            </div>
                        </div>

                        {/* Alamat & Kategori */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Alamat Lengkap *</label>
                            <textarea required rows={3} placeholder="Jl. Contoh No.123, Jakarta" value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address[0]}</p>}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Kategori Usaha *</label>
                            <select required value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                                <option value="">Pilih kategori</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category[0]}</p>}
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                                <div className="relative">
                                    <input required type={showPassword ? 'text' : 'password'} placeholder="Min. 8 karakter" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="w-full px-4 py-3 pr-10 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 flex items-center text-gray-500 right-3">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Konfirmasi Password *</label>
                                <div className="relative">
                                    <input required type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi password" value={form.password_confirmation}
                                        onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                        className="w-full px-4 py-3 pr-10 text-sm transition border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 flex items-center text-gray-500 right-3">
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading}
                            className="flex items-center justify-center w-full gap-3 py-4 mt-6 text-lg font-bold text-white transition-all rounded-xl bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 disabled:opacity-70">
                            {loading ? (
                                <> <Loader2 className="w-6 h-6 animate-spin" /> Mendaftarkan... </>
                            ) : (
                                <> <BadgeCheck className="w-6 h-6" /> Daftar UMKM Sekarang </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-bold text-brand-600 hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE — HERO (Desktop Only) */}
            <div className="flex-1 hidden bg-gradient-to-br from-brand-600 to-brand-700 lg:flex lg:items-center lg:justify-center">
                <div className="max-w-md p-8 text-white">
                    <h2 className="mb-6 text-4xl font-bold">Mulai Digitalisasi Bisnis Anda</h2>
                    <p className="mb-8 text-lg text-brand-100">
                        Kelola booking, notifikasi WhatsApp, dan dashboard analitik — semuanya dalam satu tempat.
                    </p>
                    <div className="space-y-5 text-lg">
                        {['Kelola booking 24/7', 'Notifikasi WhatsApp otomatis', 'Dashboard analitik lengkap', 'Gratis selamanya!'].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full bg-opacity-20">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

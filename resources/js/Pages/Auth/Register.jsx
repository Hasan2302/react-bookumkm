// resources/js/Pages/Auth/Register.jsx
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/Services/Api';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        umkm_name: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/register', form);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="w-full max-w-md p-10 text-center bg-white shadow-2xl rounded-3xl">
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-800">Registrasi Berhasil!</h2>
                    <p className="mb-8 text-gray-600">Akun UMKM Anda sudah aktif. Silakan login untuk mulai.</p>
                    <a href="/login" className="px-8 py-4 font-bold text-white transition bg-brand-600 rounded-xl hover:bg-brand-700">
                        Masuk ke Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-brand-50 to-purple-100">
            <div className="w-full max-w-2xl p-10 bg-white shadow-2xl rounded-3xl">
                <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Daftar UMKM Baru</h1>

                {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" placeholder="Nama Lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />
                    <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />
                    <input type="text" placeholder="Nama UMKM" value={form.umkm_name} onChange={e => setForm({ ...form, umkm_name: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />
                    <input type="tel" placeholder="No. HP / WhatsApp" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />
                    <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />
                    <input type="password" placeholder="Konfirmasi Password" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} required className="w-full px-5 py-4 border-2 rounded-xl focus:border-brand-500" />

                    <button type="submit" disabled={loading} className="flex items-center justify-center w-full gap-3 py-5 text-xl font-bold text-white transition shadow-lg bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl hover:from-brand-700 hover:to-purple-700">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Sudah punya akun? <a href="/login" className="font-bold text-brand-600 hover:underline">Login di sini</a>
                </p>
            </div>
        </div>
    );
}

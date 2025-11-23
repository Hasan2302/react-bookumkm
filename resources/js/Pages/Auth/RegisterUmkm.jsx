// resources/js/Pages/Auth/RegisterUmkm.jsx

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Store, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/Services/Api';

export default function RegisterUmkm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: '',
        umkm_name: '', phone: '', address: '', category: ''
    });

    const categories = ['Salon', 'Laundry', 'Bengkel', 'Klinik Kecantikan', 'Tukang Cukur', 'Spa', 'Lainnya'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/register-umkm', form);
            // Token akan dihandle oleh Laravel Session
            setSuccess(true);
            setTimeout(() => router.visit('/umkm/dashboard'), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mendaftar');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <Head title="Pendaftaran Berhasil" />
                <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="max-w-lg p-12 text-center bg-white shadow-2xl rounded-3xl">
                    <div className="flex items-center justify-center mx-auto mb-6 bg-green-100 rounded-full w-28 h-28">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold text-gray-800">Selamat Datang!</h1>
                    <p className="mb-8 text-xl text-gray-600">
                        Akun UMKM <strong>{form.umkm_name}</strong> berhasil dibuat!
                    </p>
                    <div className="text-2xl font-bold text-indigo-600">
                        Mengarahkan ke dashboard...
                    </div>
                </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Daftar UMKM" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 text-indigo-600 hover:text-indigo-800">
                        <ArrowLeft size={20} /> Kembali ke Beranda
                    </Link>

                    <div className="overflow-hidden bg-white shadow-2xl rounded-3xl">
                        <div className="p-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600">
                            <Store className="w-20 h-20 mx-auto mb-4 text-white" />
                            <h1 className="text-4xl font-bold text-white">Daftar sebagai UMKM</h1>
                            <p className="mt-3 text-xl text-indigo-100">Gratis selamanya • Tanpa biaya bulanan</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <input required placeholder="Nama Pemilik" value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />

                                <input required type="email" placeholder="Email" value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />
                            </div>

                            <input required placeholder="Nama UMKM (contoh: Salon Budi)" value={form.umkm_name}
                                onChange={e => setForm({...form, umkm_name: e.target.value})}
                                className="w-full px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />

                            <div className="grid gap-6 md:grid-cols-2">
                                <input required placeholder="No. WhatsApp" value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />

                                <select required value={form.category}
                                    onChange={e => setForm({...form, category: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500">
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(cat => <option key={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <textarea required placeholder="Alamat Lengkap UMKM" rows={3} value={form.address}
                                onChange={e => setForm({...form, address: e.target.value})}
                                className="w-full px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500"></textarea>

                            <div className="grid gap-6 md:grid-cols-2">
                                <input required type="password" placeholder="Password" value={form.password}
                                    onChange={e => setForm({...form, password: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />

                                <input required type="password" placeholder="Konfirmasi Password" value={form.password_confirmation}
                                    onChange={e => setForm({...form, password_confirmation: e.target.value})}
                                    className="px-6 py-4 text-lg border-2 outline-none rounded-xl focus:border-indigo-500" />
                            </div>

                            <button type="submit" disabled={loading}
                                className="flex items-center justify-center w-full gap-3 py-6 text-xl font-bold text-white transition shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700">
                                {loading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang & Mulai Gratis'}
                            </button>
                        </form>

                        <div className="p-8 text-center bg-gray-50">
                            <p className="text-gray-600">
                                Sudah punya akun? <Link href="/login" className="font-bold text-indigo-600 hover:underline">Login di sini</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

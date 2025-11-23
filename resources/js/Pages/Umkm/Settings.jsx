// resources/js/Pages/Umkm/Settings.jsx
import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Store, Upload, Plus, Trash2, Clock, Save, Home, FileText, Settings, LogOut } from 'lucide-react';
import api from '@/Services/Api';

export default function UmkmSettings({ auth }) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [loading, setLoading] = useState(false);
    const [umkm, setUmkm] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const user = auth?.user || {};

    const [form, setForm] = useState({
        name: '', phone: '', address: '', category: '', description: '',
        services: [{ name: '', price: '' }],
        opening_hours: { senin: '08:00-17:00', selasa: '08:00-17:00', rabu: '08:00-17:00', kamis: '08:00-17:00', jumat: '08:00-17:00', sabtu: '09:00-15:00', minggu: 'Tutup' }
    });

    const navItems = [
        { name: 'Dashboard', href: '/umkm/dashboard', icon: Home },
        { name: 'Form Builder', href: '/umkm/formbuilder', icon: FileText },
        { name: 'Pengaturan', href: '/umkm/settings', icon: Settings },
    ];

    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                const res = await api.get('/umkm/me');
                const data = res.data.data;
    
                // PERBAIKAN UTAMA: PARSE JSON STRING!
                let services = [];
                let opening_hours = {
                    senin: '08:00-17:00', selasa: '08:00-17:00', rabu: '08:00-17:00',
                    kamis: '08:00-17:00', jumat: '08:00-17:00', sabtu: '09:00-15:00', minggu: 'Tutup'
                };
    
                // Parse services
                if (data.services) {
                    if (typeof data.services === 'string') {
                        try {
                            services = JSON.parse(data.services);
                        } catch (e) {
                            console.error('Gagal parse services:', e);
                            services = [];
                        }
                    } else if (Array.isArray(data.services)) {
                        services = data.services;
                    }
                }
                if (services.length === 0) services = [{ name: '', price: '' }];
    
                // Parse opening_hours
                if (data.opening_hours) {
                    if (typeof data.opening_hours === 'string') {
                        try {
                            opening_hours = JSON.parse(data.opening_hours);
                        } catch (e) {
                            console.error('Gagal parse opening_hours:', e);
                        }
                    } else if (typeof data.opening_hours === 'object') {
                        opening_hours = { ...opening_hours, ...data.opening_hours };
                    }
                }
    
                setUmkm(data);
                setForm({
                    name: data.name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    category: data.category || '',
                    description: data.description || '',
                    services: services,
                    opening_hours: opening_hours
                });
    
                setLogoPreview(data.logo ? `/storage/${data.logo}` : null);
                setBannerPreview(data.banner ? `/storage/${data.banner}` : null);
    
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    router.visit('/login');
                }
            }
        };
        fetchUmkm();
    }, [navigate]);

    const handleAddService = () => setForm(prev => ({ ...prev, services: [...prev.services, { name: '', price: '' }] }));
    const handleRemoveService = (i) => setForm(prev => ({ ...prev, services: prev.services.filter((_, idx) => idx !== i) }));
    const handleServiceChange = (i, field, value) => setForm(prev => ({
        ...prev,
        services: prev.services.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    }));
    const handleHourChange = (day, value) => setForm(prev => ({
        ...prev,
        opening_hours: { ...prev.opening_hours, [day]: value }
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        ['name', 'phone', 'address', 'category', 'description'].forEach(key => formData.append(key, form[key]));
        formData.append('services', JSON.stringify(form.services.filter(s => s.name.trim() !== '')));
        formData.append('opening_hours', JSON.stringify(form.opening_hours));

        const logo = document.getElementById('logo')?.files[0];
        const banner = document.getElementById('banner')?.files[0];
        if (logo) formData.append('logo', logo);
        if (banner) formData.append('banner', banner);

        try {
            const res = await api.post('/umkm/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            localStorage.setItem('umkm', JSON.stringify(res.data.data));
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            alert('Gagal menyimpan: ' + (err.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    if (!umkm) return <div className="flex items-center justify-center min-h-screen text-3xl font-bold text-indigo-600">Memuat...</div>;

    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <>
            <Head title="Pengaturan - UMKM" />
            
            {/* NAVBAR ATAS — SAMA DENGAN DASHBOARD */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
                <div className="px-4 py-3 mx-auto max-w-7xl md:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-8">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPath === item.href ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="hidden sm:block">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden text-sm font-medium md:block">Hi, {user.name}!</span>
                            <button onClick={() => router.post('/logout')}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOMBOL SIMPAN FLOATING */}
            <button onClick={handleSubmit} disabled={loading}
                className="fixed z-50 flex items-center gap-3 px-8 py-5 text-xl font-bold text-white transition-all rounded-full shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 bottom-20 right-6 hover:scale-105">
                <Save className="w-7 h-7" /> {loading ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
            </button>

            {/* MAIN CONTENT — LAYOUT 2 KOLOM, SUPER RAPIH */}
            <div className="min-h-screen pb-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 md:pb-6">
                <div className="px-4 py-8 mx-auto max-w-7xl">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Profil UMKM</h1>
                        <p className="text-gray-600">Kelola informasi bisnis agar lebih profesional</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* KIRI: FOTO + INFO DASAR */}
                        <div className="space-y-8">
                            {/* LOGO & BANNER */}
                            <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-3xl">
                                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800">
                                    <Store className="text-indigo-600 w-7 h-7" /> Foto Profil & Banner
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <p className="mb-3 text-sm font-medium text-gray-700">Logo</p>
                                        <label className="block cursor-pointer">
                                            <div className="relative overflow-hidden border-4 border-dashed rounded-2xl w-44 h-44 bg-gray-50">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo" className="object-cover w-full h-full rounded-2xl" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <Upload className="w-12 h-12 mb-2" />
                                                        <span className="text-xs">Upload Logo</span>
                                                    </div>
                                                )}
                                                <input type="file" id="logo" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => e.target.files[0] && setLogoPreview(URL.createObjectURL(e.target.files[0]))} />
                                            </div>
                                        </label>
                                    </div>
                                    <div>
                                        <p className="mb-3 text-sm font-medium text-gray-700">Banner</p>
                                        <label className="block cursor-pointer">
                                            <div className="relative overflow-hidden border-4 border-dashed rounded-2xl h-44 bg-gray-50">
                                                {bannerPreview ? (
                                                    <img src={bannerPreview} alt="Banner" className="object-cover w-full h-full rounded-2xl" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <Upload className="w-16 h-16 mb-2" />
                                                        <span className="text-xs">Upload Banner</span>
                                                    </div>
                                                )}
                                                <input type="file" id="banner" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => e.target.files[0] && setBannerPreview(URL.createObjectURL(e.target.files[0]))} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* INFORMASI DASAR */}
                            <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-3xl">
                                <h2 className="mb-6 text-2xl font-bold text-gray-800">Informasi Dasar</h2>
                                <div className="space-y-5">
                                    <input type="text" placeholder="Nama UMKM" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full px-6 py-4 text-lg transition border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" required />
                                    <input type="text" placeholder="No. WhatsApp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full px-6 py-4 text-lg transition border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                                    <input type="text" placeholder="Kategori (contoh: Salon, Laundry)" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                                        className="w-full px-6 py-4 text-lg transition border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                                    <textarea rows="3" placeholder="Alamat Lengkap" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                                        className="w-full px-6 py-4 text-lg transition border-2 resize-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                                    <textarea rows="4" placeholder="Deskripsi singkat tentang UMKM Anda..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full px-6 py-4 text-lg transition border-2 resize-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                                </div>
                            </div>
                        </div>

                        {/* KANAN: LAYANAN + JAM BUKA */}
                        <div className="space-y-8">
                            {/* LAYANAN */}
                            <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-3xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Layanan & Harga</h2>
                                    <button type="button" onClick={handleAddService}
                                        className="flex items-center gap-2 px-5 py-3 text-white transition bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700">
                                        <Plus className="w-5 h-5" /> Tambah
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {form.services.map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                            <input type="text" placeholder="Nama layanan" value={s.name}
                                                onChange={e => handleServiceChange(i, 'name', e.target.value)}
                                                className="flex-1 px-5 py-3 transition border-2 rounded-xl focus:border-indigo-500" />
                                            <input type="number" placeholder="Harga" value={s.price}
                                                onChange={e => handleServiceChange(i, 'price', e.target.value)}
                                                className="w-32 px-5 py-3 transition border-2 rounded-xl focus:border-indigo-500" />
                                            {form.services.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveService(i)}
                                                    className="p-3 text-red-600 transition bg-red-50 rounded-xl hover:bg-red-100">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* JAM OPERASIONAL */}
                            <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-3xl">
                                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800">
                                    <Clock className="text-indigo-600 w-7 h-7" /> Jam Operasional
                                </h2>
                                <div className="space-y-4">
                                    {days.map((day, i) => (
                                        <div key={day} className="flex items-center gap-4">
                                            <label className="w-20 text-sm font-semibold text-gray-700 capitalize">{dayLabels[i]}</label>
                                            <input type="text" value={form.opening_hours[day]}
                                                onChange={e => handleHourChange(day, e.target.value)}
                                                placeholder="08:00-17:00" 
                                                className="flex-1 px-5 py-3 transition border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE NAVBAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
                <div className="grid grid-cols-3 py-3">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href}
                            className={`flex flex-col items-center text-xs font-medium py-2 ${currentPath === item.href ? 'text-indigo-600' : 'text-gray-500'}`}>
                            <item.icon className="w-6 h-6 mb-1" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
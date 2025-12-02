// resources/js/Pages/Umkm/Settings.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Store, Upload, Plus, Trash2, Clock, Save, Home, FileText, Settings, LogOut, QrCode } from 'lucide-react';
import api from '@/Services/Api';
import MetronicLayout from '@/Layouts/MetronicLayout';

export default function UmkmSettings() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [umkm, setUmkm] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [qrisPreview, setQrisPreview] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [form, setForm] = useState({
        name: '', phone: '', address: '', category: '', description: '',
        services: [{ name: '', price: '' }],
        opening_hours: { senin: '08:00-17:00', selasa: '08:00-17:00', rabu: '08:00-17:00', kamis: '08:00-17:00', jumat: '08:00-17:00', sabtu: '09:00-15:00', minggu: 'Tutup' }
    });

    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                const res = await api.get('/umkm/me');
                const data = res.data.data;

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

                setQrisPreview(data.qris_image ? `/storage/${data.qris_image}` : null);
                setLogoPreview(data.logo ? `/storage/${data.logo}` : null);
                setBannerPreview(data.banner ? `/storage/${data.banner}` : null);

            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
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

        ['name', 'phone', 'address', 'category', 'description'].forEach(key => {
            formData.append(key, form[key] || '');
        });
        formData.append('opening_hours', JSON.stringify(form.opening_hours));

        const logo = document.getElementById('logo')?.files[0];
        const banner = document.getElementById('banner')?.files[0];
        const qris = document.getElementById('qris')?.files[0];
        if (logo) formData.append('logo', logo);
        if (banner) formData.append('banner', banner);
        if (qris) formData.append('qris_image', qris);

        formData.append('_method', 'PUT');

        try {
            const response = await fetch('/api/umkm/settings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menyimpan');
            }

            localStorage.setItem('umkm', JSON.stringify(result.data));
            alert('Profil & QRIS berhasil diperbarui!');

            if (qris) {
                setQrisPreview(`/storage/${result.data.qris_image}?t=${Date.now()}`);
            }

        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async (type) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        setLoading(true);
        try {
            const res = await api.delete('/umkm/settings/image', { data: { type } });
            const updatedUmkm = res.data.data;

            localStorage.setItem('umkm', JSON.stringify(updatedUmkm));
            setUmkm(updatedUmkm);

            if (type === 'logo') setLogoPreview(null);
            if (type === 'banner') setBannerPreview(null);
            if (type === 'qris_image') setQrisPreview(null);

            alert('Image deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete image');
        } finally {
            setLoading(false);
        }
    };

    if (!umkm) return (
        <MetronicLayout>
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
            </div>
        </MetronicLayout>
    );

    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <MetronicLayout title="Settings" breadcrumbs={['Profile']}>
            {/* TOMBOL SIMPAN FLOATING */}
            <button onClick={handleSubmit} disabled={loading}
                className="fixed z-50 flex items-center gap-3 px-6 py-4 text-sm font-bold text-white transition-all rounded-lg shadow-lg bg-primary bottom-10 right-10 hover:bg-primary-active hover:shadow-xl">
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'SAVE CHANGES'}
            </button>

            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* KIRI: FOTO + INFO DASAR */}
                    <div className="space-y-8">
                        {/* LOGO & BANNER */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Store className="w-5 h-5 text-gray-400" />
                                    Profile & Banner
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-gray-700">Logo</p>
                                            {logoPreview && (
                                                <button onClick={() => handleDeleteImage('logo')} className="flex items-center gap-1 text-xs text-danger hover:underline">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            )}
                                        </div>
                                        <label className="block cursor-pointer group">
                                            <div className="relative w-full overflow-hidden transition-colors border border-gray-300 border-dashed rounded-xl aspect-square bg-gray-50 group-hover:border-primary">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo" className="object-cover w-full h-full rounded-xl" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <Upload className="w-8 h-8 mb-2" />
                                                        <span className="text-xs font-medium">Upload Logo</span>
                                                    </div>
                                                )}
                                                <input type="file" id="logo" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => e.target.files[0] && setLogoPreview(URL.createObjectURL(e.target.files[0]))} />
                                            </div>
                                        </label>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-gray-700">Banner</p>
                                            {bannerPreview && (
                                                <button onClick={() => handleDeleteImage('banner')} className="flex items-center gap-1 text-xs text-danger hover:underline">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            )}
                                        </div>
                                        <label className="block cursor-pointer group">
                                            <div className="relative w-full overflow-hidden transition-colors border border-gray-300 border-dashed rounded-xl aspect-square bg-gray-50 group-hover:border-primary">
                                                {bannerPreview ? (
                                                    <img src={bannerPreview} alt="Banner" className="object-cover w-full h-full rounded-xl" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <Upload className="w-8 h-8 mb-2" />
                                                        <span className="text-xs font-medium">Upload Banner</span>
                                                    </div>
                                                )}
                                                <input type="file" id="banner" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => e.target.files[0] && setBannerPreview(URL.createObjectURL(e.target.files[0]))} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INFORMASI DASAR */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Basic Info</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">UMKM Name</label>
                                    <input type="text" placeholder="Nama UMKM" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full px-4 py-3 text-sm font-medium transition-colors border-transparent rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-0" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">WhatsApp Number</label>
                                    <input type="text" placeholder="No. WhatsApp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full px-4 py-3 text-sm font-medium transition-colors border-transparent rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-0" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" placeholder="Kategori (contoh: Salon, Laundry)" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                                        className="w-full px-4 py-3 text-sm font-medium transition-colors border-transparent rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-0" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                                    <textarea rows="3" placeholder="Alamat Lengkap" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                                        className="w-full px-4 py-3 text-sm font-medium transition-colors border-transparent rounded-lg resize-none bg-gray-50 focus:bg-white focus:border-primary focus:ring-0" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                                    <textarea rows="4" placeholder="Deskripsi singkat tentang UMKM Anda..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full px-4 py-3 text-sm font-medium transition-colors border-transparent rounded-lg resize-none bg-gray-50 focus:bg-white focus:border-primary focus:ring-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: QRIS + JAM BUKA */}
                    <div className="space-y-8">

                        {/* QRIS UPLOAD */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <QrCode className="w-5 h-5 text-gray-400" /> Payment (QRIS)
                                </h3>
                                <span className="px-3 py-1 text-xs font-bold rounded-md text-success bg-success/10">
                                    Recommended
                                </span>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="relative p-6 transition-all border border-gray-300 border-dashed rounded-xl bg-gray-50 hover:border-primary hover:bg-primary/5 group">
                                    {qrisPreview && (
                                        <button onClick={() => handleDeleteImage('qris_image')} className="absolute z-10 p-2 bg-white rounded-full shadow-sm top-2 right-2 text-danger hover:bg-danger/10" title="Delete QRIS">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <p className="mb-4 text-sm font-medium text-center text-gray-600">
                                        Upload your QRIS image here
                                    </p>

                                    <label className="block cursor-pointer">
                                        <input
                                            type="file"
                                            id="qris"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    setQrisPreview(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            {qrisPreview ? (
                                                <div className="w-full space-y-4 text-center">
                                                    <img src={qrisPreview} alt="QRIS" className="object-contain mx-auto rounded-lg shadow-lg max-h-64" />
                                                    <p className="text-sm font-bold text-success">QRIS Ready!</p>
                                                    <p className="text-xs text-gray-400">Click to replace</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <QrCode className="w-12 h-12 mx-auto mb-3 text-gray-300 transition-colors group-hover:text-primary" />
                                                    <p className="text-sm font-bold text-gray-700 transition-colors group-hover:text-primary">Click to upload QRIS</p>
                                                    <p className="mt-1 text-xs text-gray-400">PNG, JPG • Max 2MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-3 p-4 border rounded-lg border-primary/20 bg-primary/5">
                                    <div className="mt-0.5">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
                                            <span className="text-xs font-bold text-primary">i</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-gray-600">
                                        Use <strong>QRIS All Payment</strong> to accept payments from all e-wallets and banking apps.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* JAM OPERASIONAL */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Clock className="w-5 h-5 text-gray-400" /> Opening Hours
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {days.map((day, i) => (
                                    <div key={day} className="flex items-center gap-4">
                                        <label className="w-24 text-sm font-semibold text-gray-600 capitalize">{dayLabels[i]}</label>
                                        <input type="text" value={form.opening_hours[day]}
                                            onChange={e => handleHourChange(day, e.target.value)}
                                            placeholder="08:00-17:00"
                                            className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-0 transition-colors" />
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </MetronicLayout>
    );
}

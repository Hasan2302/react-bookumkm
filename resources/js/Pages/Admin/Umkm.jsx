// resources/js/Pages/Superadmin/Umkm.jsx
import AdminSidebar from '@/Components/AdminSidebar';
import { Search, Building2, Edit, Trash2, X, Plus, Upload, ImageOff } from 'lucide-react';
import { useTheme } from '@/Components/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// DUMMY IMAGE (ganti dengan gambar kamu sendiri kalau mau)
const DUMMY_LOGO = "https://via.placeholder.com/150/6366f1/ffffff?text=UMKM";
const DUMMY_BANNER = "https://via.placeholder.com/600x200/4f46e5/ffffff?text=Banner+UMKM";

export default function Umkm() {
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(umkms.length / itemsPerPage);

  const sortedUmkms = [...umkms].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
  const paginatedUmkms = sortedUmkms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', category: '', description: '', subdomain: '',
    latitude: '', longitude: '', status: 'active', logo: null, banner: null
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  const fetchUmkms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard/data', {
        params: { search },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUmkms(res.data.umkms || []);
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Gagal memuat data UMKM', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkms();
    const delay = setTimeout(fetchUmkms, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '', phone: '', address: '', category: '', description: '', subdomain: '',
      latitude: '', longitude: '', status: 'active', logo: null, banner: null
    });
    setPreviewLogo(null);
    setPreviewBanner(null);
    setShowModal(true);
  };

  const openEditModal = (umkm) => {
    setModalMode('edit');
    setSelectedUmkm(umkm);

    setFormData({
      name: umkm.name || '',
      subdomain: umkm.subdomain || '',
      phone: umkm.phone || '',
      address: umkm.address || '',
      category: umkm.category || '',
      description: umkm.description || '',
      latitude: umkm.latitude ? String(umkm.latitude) : '',
      longitude: umkm.longitude ? String(umkm.longitude) : '',
      status: umkm.status || 'active',
      logo: null,
      banner: null
    });

    setPreviewLogo(umkm.logo || DUMMY_LOGO);
    setPreviewBanner(umkm.banner || DUMMY_BANNER);
    setModalKey(prev => prev + 1);
    setShowModal(true);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        type === 'logo' ? setPreviewLogo(reader.result) : setPreviewBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('name', formData.name);
    form.append('subdomain', formData.subdomain.toLowerCase().replace(/[^a-z0-9]/g, ''));
    form.append('phone', formData.phone || '');
    form.append('address', formData.address || '');
    form.append('category', formData.category || '');
    form.append('description', formData.description || '');
    form.append('latitude', formData.latitude || '');
    form.append('longitude', formData.longitude || '');
    form.append('status', formData.status);

    if (formData.logo instanceof File) form.append('logo', formData.logo);
    if (formData.banner instanceof File) form.append('banner', formData.banner);

    try {
      if (modalMode === 'create') {
        await axios.post('/api/admin/umkms', form, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        Swal.fire('Sukses!', 'UMKM berhasil ditambahkan', 'success');
      } else {
        form.append('_method', 'PUT');
        await axios.post(`/api/admin/umkms/${selectedUmkm.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        Swal.fire('Sukses!', 'UMKM berhasil diperbarui', 'success');
      }
      setShowModal(false);
      fetchUmkms();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || 'Gagal menyimpan';
      Swal.fire('Error!', msg, 'error');
    }
  };

  const handleDelete = async (umkm) => {
    const result = await Swal.fire({
      title: 'Yakin hapus?',
      text: `${umkm.name} akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/admin/umkms/${umkm.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        Swal.fire('Terhapus!', 'UMKM berhasil dihapus', 'success');
        fetchUmkms();
      } catch (err) {
        Swal.fire('Error!', err.response?.data?.message || 'Gagal menghapus', 'error');
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors`}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main style={{ marginLeft: window.innerWidth < 1024 ? 0 : collapsed ? '80px' : '320px' }} className="min-h-screen transition-all duration-500">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* HEADER */}
            <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manajemen UMKM</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Total {umkms.length} UMKM terdaftar • Revenue bulan ini</p>
                </div>
            </div>
            <div className='p-6 bg-white border lg:col-span-2 rounded-xl dark:bg-gray-800'>

                <div className='flex flex-col mb-4 card-header sm:flex-row sm:items-center sm:justify-between'>
                    <div className="flex items-center gap-3 pb-4 float-end">
                        <div className="relative">
                        </div>
                        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white rounded-lg bg-primary-500 dark:bg-white dark:text-black hover:opacity-90">
                        <Plus className="w-5 h-5" /> Tambah UMKM
                        </button>
                    </div>
                    <div className="flex items-center gap-3 pb-4">
                        <div className="relative">
                        <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama UMKM..."
                            className="py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-lg w-80 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                        </div>
                        <div className="inline-flex p-1 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        {['table', 'grid'].map((mode) => (
                            <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all capitalize
                                ${viewMode === mode
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                            {mode === 'grid' ? 'Grid' : 'Table'}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>

                {/* LOADING SKELETON */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array(6).fill().map((_, i) => (
                        <div key={i} className="p-6 bg-white border shadow-sm rounded-xl dark:bg-gray-800 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-300 rounded-xl dark:bg-gray-700" />
                            <div>
                            <div className="w-32 h-4 bg-gray-300 rounded dark:bg-gray-700" />
                            <div className="w-24 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-600" />
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : umkms.length === 0 ? (
                    <div className="py-20 text-center">
                    <Building2 className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">Belum ada UMKM terdaftar</p>
                    </div>
                ) : (
                    <>
                        {/* GRID VIEW — DENGAN NOMOR URUT & PAGINATION */}
                        {viewMode === 'grid' && (
                        <>
                            <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                            >
                            {paginatedUmkms.map((umkm, index) => {
                                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                                return (
                                <motion.div
                                    key={umkm.id}
                                    whileHover={{ y: -4 }}
                                    className={`relative overflow-hidden transition-all bg-white border rounded-xl dark:bg-gray-800 hover:shadow-xl ${
                                    globalIndex === 0 ? 'ring-2 ring-primary-500/30 shadow-lg' : 'shadow-sm'
                                    }`}
                                >
                                    {/* NOMOR URUT DI POJOK KIRI ATAS */}
                                    <div className="absolute z-10 top-3 left-3">
                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                                        globalIndex === 0 ? 'bg-primary-600 text-white shadow-lg' :
                                        globalIndex === 1 ? 'bg-gray-500 text-white' :
                                        globalIndex === 2 ? 'bg-orange-500 text-white' :
                                        'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                        {globalIndex === 0 ? '1st' : globalIndex === 1 ? '2nd' : globalIndex === 2 ? '3rd' : `#${globalIndex + 1}`}
                                    </span>
                                    </div>

                                    <div className="p-6 pt-12">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 overflow-hidden border-2 border-gray-200 rounded-xl dark:border-gray-700">
                                            <img
                                            src={umkm.logo ? `/umkm/logo/${umkm.logo.split('/').pop()}` : '/placeholder.svg'}
                                            alt={umkm.name}
                                            className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{umkm.name}</h3>
                                            <p className="text-sm text-primary-600 dark:text-primary-400">{umkm.subdomain}.bookumkm.id</p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{umkm.category || 'Uncategorized'}</p>
                                        </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        umkm.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {umkm.status === 'active' ? 'Aktif' : 'Suspended'}
                                        </span>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Revenue bulan ini</p>
                                        <p className={`text-2xl font-bold ${globalIndex === 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                                        {formatRupiah(umkm.revenue)}
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button onClick={() => openEditModal(umkm)} className="p-2 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button onClick={() => handleDelete(umkm)} className="p-2 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                    </div>
                                </motion.div>
                                );
                            })}
                            </motion.div>

                            {/* PAGINATION UNTUK GRID */}
                            {umkms.length > itemsPerPage && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm transition border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                ← Sebelumnya
                                </button>

                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                Halaman {currentPage} dari {totalPages}
                                </span>

                                <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm transition border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                Selanjutnya →
                                </button>
                            </div>
                            )}
                        </>
                        )}


                        {/* TABLE VIEW — SUDAH SAMA PAGINATION & URUTAN */}
                        {viewMode === 'table' && (
                        <div className="overflow-hidden bg-white border rounded-xl dark:bg-gray-800">
                            <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                <th className="w-20 px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">No</th>
                                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">UMKM</th>
                                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Revenue</th>
                                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedUmkms.map((umkm, index) => {
                                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                                return (
                                    <tr key={umkm.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${globalIndex === 0 ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                    <td className="px-6 py-4 font-semibold">
                                        {globalIndex === 0 ? '1st' : globalIndex === 1 ? '2nd' : globalIndex === 2 ? '3rd' : `#${globalIndex + 1}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                        <img src={umkm.logo ? `/umkm/logo/${umkm.logo.split('/').pop()}` : '/placeholder.svg'} className="object-cover w-10 h-10 rounded-lg"/>
                                        <div>
                                            <p className="font-medium">{umkm.name}</p>
                                            <p className="text-xs text-gray-500">{umkm.subdomain}.bookumkm.id</p>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{umkm.category || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${umkm.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {umkm.status === 'active' ? 'Aktif' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{formatRupiah(umkm.revenue)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                        <button onClick={() => openEditModal(umkm)} className="p-2 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(umkm)} className="p-2 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-600" /></button>
                                        </div>
                                    </td>
                                    </tr>
                                );
                                })}
                            </tbody>
                            </table>

                            {/* PAGINATION TABLE — SAMA DENGAN GRID */}
                            {umkms.length > itemsPerPage && (
                            <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm transition border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700">
                                ← Sebelumnya
                                </button>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                Halaman {currentPage} dari {totalPages}
                                </span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm transition border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Selanjutnya →
                                </button>
                            </div>
                            )}
                        </div>
                        )}
                    </>
                )}

                {/* MODAL CRUD */}
                <AnimatePresence>
                    {showModal && (
                    <>
                        <motion.div key={`backdrop-${modalKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                        <motion.div key={`modal-${modalKey}`} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl dark:bg-gray-900">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold">{modalMode === 'create' ? 'Tambah UMKM Baru' : 'Edit UMKM'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                <label className="block mb-2 text-sm font-medium">Nama UMKM *</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800" />
                                </div>
                                <div>
                                <label className="block mb-2 text-sm font-medium">Subdomain *</label>
                                <div className="flex">
                                    <input required type="text" value={formData.subdomain} onChange={e => setFormData(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))} className="flex-1 px-4 py-3 border rounded-l-lg dark:border-gray-700 dark:bg-gray-800" placeholder="myshop" />
                                    <span className="px-4 py-3 text-gray-500 bg-gray-100 border border-l-0 rounded-r-lg dark:bg-gray-800 dark:border-gray-700">.bookumkm.id</span>
                                </div>
                                </div>
                                <div><label className="block mb-2 text-sm font-medium">Telepon</label><input type="text" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800" /></div>
                                <div><label className="block mb-2 text-sm font-medium">Kategori</label>
                                <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                    <option value="">Pilih kategori</option>
                                    <option>Kuliner</option><option>Tukang Cukur</option><option>Salon Kecantikan</option><option>Kafe & Resto</option><option>Laundry</option><option>Otomotif</option><option>Lainnya</option>
                                </select>
                                </div>
                                <div className="md:col-span-2"><label className="block mb-2 text-sm font-medium">Alamat</label><input type="text" value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800" /></div>
                                <div className="md:col-span-2"><label className="block mb-2 text-sm font-medium">Deskripsi</label><textarea rows="3" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800"></textarea></div>
                                <div><label className="block mb-2 text-sm font-medium">Latitude</label><input type="text" value={formData.latitude} onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800" placeholder="-6.123456" /></div>
                                <div><label className="block mb-2 text-sm font-medium">Longitude</label><input type="text" value={formData.longitude} onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800" placeholder="106.123456" /></div>
                                <div><label className="block mb-2 text-sm font-medium">Status</label>
                                <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-3 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                    <option value="active">Aktif</option><option value="suspended">Suspended</option>
                                </select>
                                </div>
                                <div>
                                <label className="block mb-2 text-sm font-medium">Logo</label>
                                <div className="flex items-center gap-4">
                                    {previewLogo && <img src={previewLogo} alt="Logo" className="object-cover w-24 h-24 border rounded-lg" />}
                                    <label className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700 hover:border-gray-400">
                                        <Upload className="w-5 h-5" /> Upload Logo
                                    </div>
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo')} className="hidden" />
                                    </label>
                                </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Banner</label>
                                    <div className="flex items-center gap-4">
                                        {previewBanner && <img src={previewBanner} alt="Banner" className="object-cover w-48 h-24 border rounded-lg" />}
                                        <label className="cursor-pointer">
                                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700 hover:border-gray-400">
                                            <Upload className="w-5 h-5" /> Upload Banner
                                        </div>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Batal</button>
                                <button type="submit" className="px-6 py-3 font-medium text-white bg-black rounded-lg dark:bg-white dark:text-black">Simpan UMKM</button>
                            </div>
                            </form>
                        </div>
                        </motion.div>
                    </>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>
    </div>
  );
}

// resources/js/Pages/Admin/SuperadminDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { Home, Users, Building, FileText, Eye, Edit, Trash2, X, Plus, LogOut, Upload, Search, Star, MapPin, Phone, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/Services/Api';

const ITEMS_PER_PAGE = 12;

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className={`w-full ${maxWidth} mx-6 p-8 bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-screen`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function SuperadminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeMenu, setActiveMenu] = useState("umkm");
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingUmkm, setDeletingUmkm] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '', phone: '', address: '', category: '', description: '', subdomain: '', status: 'active',
    logo: null, banner: null, logoPreview: '', bannerPreview: ''
  });

  const fetchUmkms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/umkms'); // PAKAI ROUTE SUPERADMIN
      setUmkms(res.data.data || []);
    } catch (err) {
      alert('Gagal memuat data UMKM');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === 'superadmin') fetchUmkms();
  }, []);

  const filteredUmkms = useMemo(() => {
    return umkms.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
    );
  }, [umkms, search]);

  const paginated = filteredUmkms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUmkms.length / ITEMS_PER_PAGE);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        [type]: file,
        [type + 'Preview']: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && key !== 'logoPreview' && key !== 'bannerPreview') {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editingUmkm) {
        await api.post(`/admin/umkms/${editingUmkm.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/umkms', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      fetchUmkms();
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/umkms/${deletingUmkm.id}`);
      fetchUmkms();
      setShowDelete(false);
      setDeletingUmkm(null);
    } catch (err) {
      alert('Gagal menghapus');
    }
  };

  const openEdit = (umkm) => {
    setEditingUmkm(umkm);
    setForm({
      name: umkm.name, phone: umkm.phone || '', address: umkm.address || '', category: umkm.category || '',
      description: umkm.description || '', subdomain: umkm.subdomain, status: umkm.status,
      logo: null, banner: null,
      logoPreview: umkm.logo ? `/storage/${umkm.logo}` : '',
      bannerPreview: umkm.banner ? `/storage/${umkm.banner}` : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', address: '', category: '', description: '', subdomain: '', status: 'active', logo: null, banner: null, logoPreview: '', bannerPreview: '' });
    setEditingUmkm(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-2xl font-bold text-indigo-600">Memuat Dashboard Superadmin...</div>
    </div>
  );

  return (
    <>
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              BookUMKM • Superadmin
            </div>
            <div className="flex items-center gap-6">
              <span className="hidden font-medium md:block">Hi, {user.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT — CARD STYLE MODERN */}
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">

          {/* Header + Search */}
          <div className="mb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daftar UMKM</h1>
                <p className="text-gray-600">Total {umkms.length} UMKM terdaftar</p>
              </div>
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-6 py-3 text-white transition transform rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105">
                <Plus className="w-5 h-5" /> Add Store
              </button>
            </div>

            <div className="relative mt-6">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search Store..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full py-4 pl-12 pr-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* CARD GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map(umkm => (
              <div key={umkm.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-2xl">
                {/* Header Card */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    {umkm.logo ? (
                      <img src={`/storage/${umkm.logo}`} alt={umkm.name} className="object-cover rounded-full shadow-lg w-14 h-14" />
                    ) : (
                      <div className="flex items-center justify-center text-xl font-bold text-white rounded-full w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600">
                        {umkm.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{umkm.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">4.8</span>
                        <span className="text-gray-500">(128 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${umkm.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {umkm.status === 'active' ? 'Open' : 'Closed'}
                  </span>
                </div>

                {/* Body Card */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">Offline Store</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Performance</p>
                      <p className={`font-medium ${Math.random() > 0.5 ? 'text-green-600' : 'text-orange-600'}`}>
                        {Math.random() > 0.5 ? 'Good' : 'Needs Attention'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3 border-t border-gray-100">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-700">{umkm.address || 'Alamat belum diisi'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{umkm.phone || '—'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a href={`https://${umkm.subdomain}.bookumkm.com`} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">
                        {umkm.subdomain}.bookumkm.com
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button className="flex-1 py-3 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200">
                      View Store
                    </button>
                    <button onClick={() => openEdit(umkm)} className="flex-1 py-3 text-sm font-medium text-indigo-700 transition bg-indigo-100 rounded-xl hover:bg-indigo-200">
                      Edit Store Info
                    </button>
                  </div>

                  {/* Superadmin Actions */}
                  <div className="flex gap-2 pt-3">
                    <button onClick={() => { setSelectedUmkm(umkm); setShowDetail(true); }}
                      className="flex-1 py-2.5 text-xs font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" /> Detail
                    </button>
                    <button onClick={() => openEdit(umkm)}
                      className="px-4 py-2.5 text-xs text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setDeletingUmkm(umkm); setShowDelete(true); }}
                      className="px-4 py-2.5 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 mt-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-6 py-3 text-sm font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredUmkms.length)} of {filteredUmkms.length} entries
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-6 py-3 text-sm font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEMUA MODAL TETAP PAKAI YANG SUDAH ADA (tidak diubah) */}
      <BaseModal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail UMKM">
        {selectedUmkm && (
          <div className="space-y-4">
            {selectedUmkm.logo && <img src={`/storage/${selectedUmkm.logo}`} alt="logo" className="object-cover w-32 h-32 rounded" />}
            {selectedUmkm.banner && <img src={`/storage/${selectedUmkm.banner}`} alt="banner" className="object-cover w-full h-48 rounded" />}
            <div><strong>Nama:</strong> {selectedUmkm.name}</div>
            <div><strong>Phone:</strong> {selectedUmkm.phone}</div>
            <div><strong>Alamat:</strong> {selectedUmkm.address}</div>
            <div><strong>Kategori:</strong> {selectedUmkm.category}</div>
            <div><strong>Subdomain:</strong> {selectedUmkm.subdomain}</div>
            <div><strong>Status:</strong> {selectedUmkm.status}</div>
          </div>
        )}
      </BaseModal>

      <BaseModal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingUmkm ? "Edit UMKM" : "Tambah UMKM Baru"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Nama UMKM" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
          <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
          <textarea placeholder="Alamat" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
          <input type="text" placeholder="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
          <input type="text" placeholder="Subdomain (tanpa spasi)" value={form.subdomain} onChange={e => setForm({ ...form, subdomain: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
          <textarea placeholder="Deskripsi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />

          <div>
            <label className="block mb-2 font-medium">Logo</label>
            <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo')} className="w-full" />
            {form.logoPreview && <img src={form.logoPreview} alt="preview" className="object-cover w-32 h-32 mt-3 rounded-lg shadow" />}
          </div>
          <div>
            <label className="block mb-2 font-medium">Banner</label>
            <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'banner')} className="w-full" />
            {form.bannerPreview && <img src={form.bannerPreview} alt="preview" className="object-cover w-full h-48 mt-3 rounded-lg shadow" />}
          </div>

          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
            <option value="active">Aktif</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-8 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
            <button type="submit" className="px-8 py-3 text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg">Simpan</button>
          </div>
        </form>
      </BaseModal>

      <BaseModal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus UMKM" maxWidth="max-w-md">
        <p className="text-lg">Yakin ingin menghapus <strong className="text-red-600">{deletingUmkm?.name}</strong> secara permanen?</p>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={() => setShowDelete(false)} className="px-8 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
          <button onClick={handleDelete} className="px-8 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus Permanen</button>
        </div>
      </BaseModal>
    </>
  );
}
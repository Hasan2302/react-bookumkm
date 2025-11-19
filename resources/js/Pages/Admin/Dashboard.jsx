// resources/js/Pages/Admin/SuperadminDashboard.jsx
// 100% SESUAI DESIGN YANG KAMU MAU — TAB DI DALAM CARD PUTIH + UNDERLINE!

import { useState, useMemo } from 'react';
import {
  Home, Users, Building, FileText, Eye, Edit, Trash2, X, Plus, LogOut
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Dummy Data (50 UMKM + 60 Users)
const dummyUmkm = [
  { id: 1, name: "Warung Makan Bu Siti", owner: "Siti Aminah", category: "Kuliner", phone: "08123456789", email: "siti@example.com", address: "Jl. Sudirman No. 12, Jakarta", status: "Aktif" },
  { id: 2, name: "Toko Baju Batik Jaya", owner: "Ahmad Fauzi", category: "Fashion", phone: "08234567890", email: "batikjaya@example.com", address: "Jl. Malioboro, Yogyakarta", status: "Aktif" },
  { id: 3, name: "Kopi Hitam 88", owner: "Rudi Hartono", category: "Kuliner", phone: "08345678901", email: "kopi88@example.com", address: "Jl. Gatot Subroto, Bandung", status: "Nonaktif" },
  ...Array.from({ length: 47 }, (_, i) => ({
    id: i + 4,
    name: `UMKM ${i + 4}`,
    owner: `Pemilik ${i + 4}`,
    category: ["Kuliner", "Fashion", "Jasa", "Kerajinan", "Retail"][i % 5],
    phone: `08${String(i + 4).padStart(10, "0")}`,
    email: `umkm${i + 4}@example.com`,
    address: `Jl. Contoh No. ${i + 4}, Kota`,
    status: i % 8 === 0 ? "Nonaktif" : "Aktif",
  })),
];

const dummyUsers = [
  { id: 1, name: "Super Admin", email: "admin@bookumkm.com", role: "Admin", status: "Aktif", joinDate: "2023-01-01" },
  ...Array.from({ length: 59 }, (_, i) => ({
    id: i + 2,
    name: `Pengguna ${i + 2}`,
    email: `user${i + 2}@example.com`,
    role: ["Admin", "UMKM Owner", "Customer"][i % 3],
    status: i % 9 === 0 ? "Nonaktif" : "Aktif",
    joinDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  })),
];

// Modal Components (sama seperti sebelumnya, tapi lebih rapi)
const BaseModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className={`w-full ${maxWidth} mx-6 p-8 bg-white rounded-2xl shadow-2xl`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DetailModal = ({ title, data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;
  const displayData = { ...data };
  delete displayData.id;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-5">
        {Object.entries(displayData).map(([key, value]) => (
          <div key={key} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
            <span className="w-32 font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <button onClick={onClose} className="px-8 py-3 font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">Tutup</button>
      </div>
    </BaseModal>
  );
};

const UmkmFormModal = ({ umkm, isOpen, onClose, onSubmit, isEditing = false }) => {
  const [form, setForm] = useState(umkm || { name: "", owner: "", category: "", phone: "", email: "", address: "", status: "Aktif" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id: umkm?.id });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit UMKM" : "Tambah UMKM"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {['name', 'owner', 'category', 'phone', 'email', 'address'].map(field => (
          <input key={field} type={field === 'email' ? 'email' : 'text'} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="w-full px-5 py-4 border-2 border-gray-200 outline-none rounded-xl focus:border-indigo-500" required />
        ))}
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full px-5 py-4 border-2 border-gray-200 outline-none rounded-xl focus:border-indigo-500">
          <option>Aktif</option><option>Nonaktif</option>
        </select>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-8 py-3 font-medium bg-gray-200 rounded-xl hover:bg-gray-300">Batal</button>
          <button type="submit" className="px-8 py-3 font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
            {isEditing ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

const DeleteModal = ({ item, isOpen, onClose, onDelete }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title="Hapus UMKM" maxWidth="max-w-md">
    <p className="mb-8 text-gray-700">Yakin ingin menghapus <strong>{item?.name}</strong>?</p>
    <div className="flex justify-end gap-4">
      <button onClick={onClose} className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300">Batal</button>
      <button onClick={onDelete} className="px-6 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700">Hapus</button>
    </div>
  </BaseModal>
);

// Stat Card
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

export default function SuperadminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [umkmData, setUmkmData] = useState(dummyUmkm);
  const [umkmSearch, setUmkmSearch] = useState("");
  const [umkmPage, setUmkmPage] = useState(1);
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUmkm, setEditUmkm] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUmkm, setDeleteUmkm] = useState(null);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "umkm", label: "Daftar UMKM", icon: Building },
    { id: "users", label: "Pengguna", icon: Users },
    { id: "reports", label: "Laporan", icon: FileText },
  ];

  const handleTabChange = (tabId) => {
    setActiveMenu(tabId);
    setUmkmSearch(""); setUmkmPage(1);
    setSelectedUmkm(null);
  };

  const filteredUmkm = useMemo(() => umkmData.filter(u =>
    u.name.toLowerCase().includes(umkmSearch.toLowerCase()) ||
    u.owner.toLowerCase().includes(umkmSearch.toLowerCase()) ||
    u.category.toLowerCase().includes(umkmSearch.toLowerCase())
  ), [umkmData, umkmSearch]);

  const paginatedUmkm = filteredUmkm.slice((umkmPage - 1) * ITEMS_PER_PAGE, umkmPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUmkm.length / ITEMS_PER_PAGE);

  const handleAdd = (data) => { const newId = Math.max(...umkmData.map(u => u.id), 0) + 1; setUmkmData([...umkmData, { id: newId, ...data }]); };
  const handleEdit = (data) => { setUmkmData(umkmData.map(u => u.id === data.id ? data : u)); };
  const handleDelete = () => { setUmkmData(umkmData.filter(u => u.id !== deleteUmkm.id)); setShowDelete(false); setDeleteUmkm(null); };

  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total UMKM" value={umkmData.length} icon={Building} color="bg-blue-500" />
            <StatCard label="UMKM Aktif" value={umkmData.filter(u => u.status === "Aktif").length} icon={Building} color="bg-green-500" />
            <StatCard label="Total Pengguna" value={dummyUsers.length} icon={Users} color="bg-purple-500" />
            <StatCard label="Pengguna Aktif" value={dummyUsers.filter(u => u.status === "Aktif").length} icon={Users} color="bg-indigo-500" />
          </div>
        );

      case "umkm":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <input type="text" placeholder="Cari UMKM..." value={umkmSearch} onChange={e => { setUmkmSearch(e.target.value); setUmkmPage(1); }}
                className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-2 ml-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                <Plus size={20} /> Tambah UMKM
              </button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Nama UMKM</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Pemilik</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUmkm.map(umkm => (
                    <tr key={umkm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{umkm.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{umkm.owner}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{umkm.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${umkm.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {umkm.status}
                        </span>
                      </td>
                      <td className="flex gap-3 px-6 py-4">
                        <button onClick={() => setSelectedUmkm(umkm)} className="text-indigo-600 hover:text-indigo-900"><Eye size={18} /></button>
                        <button onClick={() => { setEditUmkm(umkm); setShowEdit(true); }} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                        <button onClick={() => { setDeleteUmkm(umkm); setShowDelete(true); }} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button onClick={() => setUmkmPage(p => Math.max(1, p - 1))} disabled={umkmPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">Sebelumnya</button>
                <span className="text-sm text-gray-600">Halaman {umkmPage} dari {totalPages}</span>
                <button onClick={() => setUmkmPage(p => Math.min(totalPages, p + 1))} disabled={umkmPage === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">Selanjutnya</button>
              </div>
            )}
          </div>
        );

      case "users":
        return <div className="py-20 text-xl text-center text-gray-500">Fitur Pengguna sedang dikembangkan</div>;
      case "reports":
        return <div className="py-20 text-xl text-center text-gray-500">Laporan akan segera hadir</div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* NAVBAR ATAS */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-purple-700">BookUMKM</div>
            <div className="flex items-center gap-6">
              <span className="font-medium">Super Admin: {user.name || 'Admin'}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT — PERSIS SEPERTI YANG KAMU MAU! */}
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="mb-8 border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          activeMenu === tab.id
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}>
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <DetailModal title="Detail UMKM" data={selectedUmkm} isOpen={!!selectedUmkm} onClose={() => setSelectedUmkm(null)} />
      <UmkmFormModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
      <UmkmFormModal umkm={editUmkm} isOpen={showEdit} onClose={() => { setShowEdit(false); setEditUmkm(null); }} onSubmit={handleEdit} isEditing />
      <DeleteModal item={deleteUmkm} isOpen={showDelete} onClose={() => setShowDelete(false)} onDelete={handleDelete} />
    </>
  );
}

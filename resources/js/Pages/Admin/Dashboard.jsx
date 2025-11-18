// resources/js/Pages/SuperadminDashboard.jsx

import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Home,
    Users,
    Building,
    FileText,
    Eye,
    Edit,
    Trash2,
    Phone,
    Mail,
    MapPin,
    Calendar,
    X,
    Plus,
} from "lucide-react";

// --- DUMMY DATA ---
// Data dummy untuk UMKM dan Pengguna dipindahkan ke file terpisah
// atau dipertahankan di sini untuk kesederhanaan, tetapi
// dalam aplikasi nyata, ini harus diambil dari API.

// DUMMY DATA UMKM (tetap di sini untuk contoh)
const dummyUmkm = [
    {
        id: 1,
        name: "Warung Makan Bu Siti",
        owner: "Siti Aminah",
        category: "Kuliner",
        phone: "08123456789",
        email: "siti@example.com",
        address: "Jl. Sudirman No. 12, Jakarta",
        status: "Aktif",
    },
    {
        id: 2,
        name: "Toko Baju Batik Jaya",
        owner: "Ahmad Fauzi",
        category: "Fashion",
        phone: "08234567890",
        email: "batikjaya@example.com",
        address: "Jl. Malioboro, Yogyakarta",
        status: "Aktif",
    },
    {
        id: 3,
        name: "Kopi Hitam 88",
        owner: "Rudi Hartono",
        category: "Kuliner",
        phone: "08345678901",
        email: "kopi88@example.com",
        address: "Jl. Gatot Subroto, Bandung",
        status: "Nonaktif",
    },
    ...Array.from({ length: 47 }, (_, i) => ({ // Disesuaikan agar total 50
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

// DUMMY DATA PENGGUNA (tetap di sini untuk contoh)
const dummyUsers = [
    {
        id: 1,
        name: "Super Admin",
        email: "admin@bookumkm.com",
        role: "Admin",
        status: "Aktif",
        joinDate: "2023-01-01",
    },
    ...Array.from({ length: 59 }, (_, i) => ({ // Disesuaikan agar total 60
        id: i + 2,
        name: `Pengguna ${i + 2}`,
        email: `user${i + 2}@example.com`,
        role: ["Admin", "UMKM Owner", "Customer"][i % 3],
        status: i % 9 === 0 ? "Nonaktif" : "Aktif",
        joinDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String(
            (i % 28) + 1
        ).padStart(2, "0")}`,
    })),
];

// Konstanta untuk items per halaman
const ITEMS_PER_PAGE = 10;

// =========================================================================
// --- KOMPONEN MODAL TERPISAH ---
// =========================================================================

/**
 * Komponen Modal dasar yang dapat digunakan kembali.
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isOpen - Status buka/tutup modal.
 * @param {function} props.onClose - Fungsi yang dipanggil saat modal ditutup.
 * @param {string} props.title - Judul modal.
 * @param {React.ReactNode} props.children - Isi dari modal.
 * @param {string} [props.maxWidth='max-w-lg'] - Lebar maksimal modal.
 */
const BaseModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose} // Menutup modal saat mengklik di luar
        >
            <div
                className={`w-full ${maxWidth} p-8 bg-white shadow-2xl rounded-xl`}
                onClick={(e) => e.stopPropagation()} // Mencegah penutupan saat mengklik di dalam modal
            >
                {/* Header Modal */}
                <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                {/* Isi Modal */}
                {children}
            </div>
        </div>
    );
};

/**
 * Komponen Modal Konfirmasi Hapus UMKM.
 */
const DeleteUmkmModal = ({ umkm, isOpen, onClose, onDelete }) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Hapus UMKM"
        maxWidth="max-w-md"
    >
        {umkm && (
            <>
                <p className="mb-6 text-gray-700">
                    Apakah Anda yakin ingin menghapus{" "}
                    <span className="font-semibold">{umkm.name}</span>?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                        onClick={onDelete}
                    >
                        Hapus
                    </button>
                </div>
            </>
        )}
    </BaseModal>
);

/**
 * Komponen Modal Tambah/Edit UMKM.
 */
const UmkmFormModal = ({ umkm, isOpen, onClose, onSubmit, isEditing = false }) => {
    // State lokal untuk form
    const [formData, setFormData] = useState(umkm || {
        name: "",
        owner: "",
        category: "",
        phone: "",
        email: "",
        address: "",
        status: "Aktif",
    });

    // Sinkronkan state lokal saat prop umkm (untuk edit) berubah
    React.useEffect(() => {
        if (umkm) {
            setFormData(umkm);
        }
    }, [umkm]);

    /**
     * Handle perubahan input form.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handle submit form.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit UMKM" : "Tambah UMKM"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nama UMKM"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="owner"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Pemilik"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Kategori"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Telepon"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Alamat"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <select
                    name="status"
                    className="w-full px-4 py-2 border rounded"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                </select>
                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

/**
 * Komponen Modal Detail UMKM.
 */
const UmkmDetailModal = ({ umkm, isOpen, onClose }) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Detail UMKM"
    >
        {umkm && (
            <div className="space-y-4 text-gray-700">
                <DetailItem icon={Building} label="Nama" value={umkm.name} />
                <DetailItem icon={Users} label="Pemilik" value={umkm.owner} />
                <DetailItem icon={Phone} label="Telepon" value={umkm.phone} />
                <DetailItem icon={Mail} label="Email" value={umkm.email} />
                <DetailItem icon={MapPin} label="Alamat" value={umkm.address} />
            </div>
        )}
        <div className="flex justify-end mt-8">
            <button
                onClick={onClose}
                className="px-6 py-3 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
                Tutup
            </button>
        </div>
    </BaseModal>
);

/**
 * Komponen Modal Detail Pengguna.
 */
const UserDetailModal = ({ user, isOpen, onClose }) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Detail Pengguna"
    >
        {user && (
            <div className="space-y-4 text-gray-700">
                <DetailItem icon={Users} label="Nama" value={user.name} />
                <DetailItem icon={Mail} label="Email" value={user.email} />
                <DetailItem icon={Building} label="Role" value={user.role} />
                <DetailItem icon={Calendar} label="Bergabung" value={user.joinDate} />
            </div>
        )}
        <div className="flex justify-end mt-8">
            <button
                onClick={onClose}
                className="px-6 py-3 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
                Tutup
            </button>
        </div>
    </BaseModal>
);

/**
 * Komponen kecil untuk menampilkan baris detail.
 */
const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <Icon size={20} className="text-indigo-500" />
        <span>
            <strong>{label}:</strong> {value}
        </span>
    </div>
);

// =========================================================================
// --- KOMPONEN TABEL DAN DASHBOARD TERPISAH ---
// =========================================================================

/**
 * Komponen Kartu Statistik Dashboard.
 */
const StatCard = ({ label, value, color, Icon }) => (
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

/**
 * Komponen Halaman Dashboard.
 */
const DashboardContent = ({ umkmData, usersData }) => {
    // Menghitung statistik berdasarkan data dummy
    const stats = [
        {
            label: "Total UMKM",
            value: umkmData.length,
            color: "bg-blue-500",
            Icon: Building,
        },
        {
            label: "UMKM Aktif",
            value: umkmData.filter((u) => u.status === "Aktif").length,
            color: "bg-green-500",
            Icon: Building,
        },
        {
            label: "Total Pengguna",
            value: usersData.length,
            color: "bg-purple-500",
            Icon: Users,
        },
        {
            label: "Pengguna Aktif",
            value: usersData.filter((u) => u.status === "Aktif").length,
            color: "bg-indigo-500",
            Icon: Users,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
            ))}
        </div>
    );
};

/**
 * Komponen Manajemen UMKM.
 */
const UmkmManagement = ({
    umkmData,
    setUmkmData,
    umkmSearch,
    setUmkmSearch,
    umkmPage,
    setUmkmPage,
    setSelectedUmkm,
}) => {
    // State untuk CRUD dan modal
    const [deleteUmkm, setDeleteUmkm] = useState(null);
    const [showDeleteUmkm, setShowDeleteUmkm] = useState(false);
    const [editUmkm, setEditUmkm] = useState(null);
    const [showEditUmkm, setShowEditUmkm] = useState(false);
    const [showAddUmkm, setShowAddUmkm] = useState(false);

    // Filter dan Pagination UMKM
    const filteredUmkm = useMemo(() => {
        return umkmData.filter(
            (item) =>
                item.name.toLowerCase().includes(umkmSearch.toLowerCase()) ||
                item.owner.toLowerCase().includes(umkmSearch.toLowerCase()) ||
                item.category.toLowerCase().includes(umkmSearch.toLowerCase())
        );
    }, [umkmSearch, umkmData]);

    const umkmTotalPages = Math.ceil(filteredUmkm.length / ITEMS_PER_PAGE);
    const paginatedUmkm = filteredUmkm.slice(
        (umkmPage - 1) * ITEMS_PER_PAGE,
        umkmPage * ITEMS_PER_PAGE
    );

    /**
     * Menangani penambahan UMKM baru.
     */
    const handleAddUmkm = (newUmkmData) => {
        const newId = umkmData.length
            ? Math.max(...umkmData.map((u) => u.id)) + 1
            : 1;

        setUmkmData((prev) => [
            ...prev,
            { id: newId, ...newUmkmData },
        ]);
        setShowAddUmkm(false);
    };

    /**
     * Menangani pembaruan data UMKM yang diedit.
     */
    const handleEditUmkm = (editedUmkmData) => {
        setUmkmData((prev) =>
            prev.map((u) => (u.id === editedUmkmData.id ? editedUmkmData : u))
        );
        setShowEditUmkm(false);
        setEditUmkm(null);
    };

    /**
     * Menangani penghapusan UMKM.
     */
    const handleDeleteUmkm = () => {
        setUmkmData((prev) =>
            prev.filter((u) => u.id !== deleteUmkm.id)
        );
        setShowDeleteUmkm(false);
        setDeleteUmkm(null);
        // Reset ke halaman 1 jika halaman saat ini kosong setelah penghapusan
        if (paginatedUmkm.length === 1 && umkmPage > 1) {
            setUmkmPage(prev => prev - 1);
        }
    };

    /**
     * Menangani perubahan halaman UMKM.
     */
    const handlePageChange = (direction) => {
        if (direction === 'prev') {
            setUmkmPage(p => Math.max(1, p - 1));
        } else {
            setUmkmPage(p => Math.min(umkmTotalPages, p + 1));
        }
    };

    return (
        <div>
            {/* Kontrol dan Tombol Tambah */}
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Cari nama UMKM, pemilik, atau kategori..."
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={umkmSearch}
                    onChange={(e) => {
                        setUmkmSearch(e.target.value);
                        setUmkmPage(1);
                    }}
                />
                <button
                    className="flex items-center gap-1 px-6 py-2 ml-4 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    onClick={() => setShowAddUmkm(true)}
                >
                    <Plus size={20} /> Tambah UMKM
                </button>
            </div>

            {/* Tabel UMKM */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Nama UMKM
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Pemilik
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Kategori
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUmkm.map((umkm) => (
                            <tr
                                key={umkm.id}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {umkm.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {umkm.owner}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {umkm.category}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                            umkm.status === "Aktif"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {umkm.status}
                                    </span>
                                </td>
                                <td className="flex items-center px-6 py-4 space-x-3 text-sm">
                                    <button
                                        onClick={() => setSelectedUmkm(umkm)}
                                        className="text-indigo-600 transition hover:text-indigo-900"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="text-blue-600 transition hover:text-blue-900"
                                        title="Edit"
                                        onClick={() => {
                                            setEditUmkm(umkm);
                                            setShowEditUmkm(true);
                                        }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="text-red-600 transition hover:text-red-900"
                                        title="Hapus"
                                        onClick={() => {
                                            setDeleteUmkm(umkm);
                                            setShowDeleteUmkm(true);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginasi */}
            {umkmTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={umkmPage === 1}
                        className="px-4 py-2 transition border rounded disabled:opacity-50 hover:bg-gray-100"
                    >
                        Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                        Halaman **{umkmPage}** dari **{umkmTotalPages}**
                    </span>
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={umkmPage === umkmTotalPages}
                        className="px-4 py-2 transition border rounded disabled:opacity-50 hover:bg-gray-100"
                    >
                        Selanjutnya
                    </button>
                </div>
            )}

            {/* Modals */}
            <UmkmFormModal
                isOpen={showAddUmkm}
                onClose={() => setShowAddUmkm(false)}
                onSubmit={handleAddUmkm}
                isEditing={false}
            />
            <UmkmFormModal
                umkm={editUmkm}
                isOpen={showEditUmkm}
                onClose={() => {
                    setShowEditUmkm(false);
                    setEditUmkm(null);
                }}
                onSubmit={handleEditUmkm}
                isEditing={true}
            />
            <DeleteUmkmModal
                umkm={deleteUmkm}
                isOpen={showDeleteUmkm}
                onClose={() => {
                    setShowDeleteUmkm(false);
                    setDeleteUmkm(null);
                }}
                onDelete={handleDeleteUmkm}
            />
        </div>
    );
};

/**
 * Komponen Manajemen Pengguna.
 */
const UserManagement = ({
    usersData,
    userSearch,
    setUserSearch,
    userPage,
    setUserPage,
    setSelectedUser,
}) => {
    // Filter dan Pagination Pengguna
    const filteredUsers = useMemo(() => {
        return usersData.filter(
            (user) =>
                user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.role.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [userSearch, usersData]);

    const userTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (userPage - 1) * ITEMS_PER_PAGE,
        userPage * ITEMS_PER_PAGE
    );

    /**
     * Menangani perubahan halaman Pengguna.
     */
    const handlePageChange = (direction) => {
        if (direction === 'prev') {
            setUserPage(p => Math.max(1, p - 1));
        } else {
            setUserPage(p => Math.min(userTotalPages, p + 1));
        }
    };

    /**
     * Mendapatkan style untuk badge role.
     */
    const getRoleBadge = (role) => {
        switch (role) {
            case "Admin":
                return "bg-purple-100 text-purple-800";
            case "UMKM Owner":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    /**
     * Mendapatkan style untuk badge status.
     */
    const getStatusBadge = (status) => {
        return status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    return (
        <div>
            {/* Kotak Pencarian */}
            <input
                type="text"
                placeholder="Cari nama, email, atau role..."
                className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={userSearch}
                onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1);
                }}
            />

            {/* Tabel Pengguna */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Nama
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Bergabung
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-semibold ${getRoleBadge(user.role)}`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadge(user.status)}`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.joinDate}
                                </td>
                                <td className="flex items-center px-6 py-4 space-x-3 text-sm">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="text-indigo-600 transition hover:text-indigo-900"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="text-blue-600 transition hover:text-blue-900"
                                        title="Edit (belum diimplementasi)"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="text-red-600 transition hover:text-red-900"
                                        title="Hapus (belum diimplementasi)"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginasi */}
            {userTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={userPage === 1}
                        className="px-4 py-2 transition border rounded disabled:opacity-50 hover:bg-gray-100"
                    >
                        Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                        Halaman **{userPage}** dari **{userTotalPages}**
                    </span>
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={userPage === userTotalPages}
                        className="px-4 py-2 transition border rounded disabled:opacity-50 hover:bg-gray-100"
                    >
                        Selanjutnya
                    </button>
                </div>
            )}
        </div>
    );
};


// =========================================================================
// --- KOMPONEN UTAMA DASHBOARD ---
// =========================================================================

export default function SuperadminDashboard({ auth }) {
    // --- State Manajemen Navigasi dan Data ---
    const [activeMenu, setActiveMenu] = useState("dashboard"); // Menu aktif: dashboard, umkm, users, reports
    const [umkmData, setUmkmData] = useState(dummyUmkm); // State data UMKM
    const [umkmSearch, setUmkmSearch] = useState(""); // State untuk pencarian UMKM
    const [umkmPage, setUmkmPage] = useState(1); // State untuk halaman UMKM
    const [userSearch, setUserSearch] = useState(""); // State untuk pencarian Pengguna
    const [userPage, setUserPage] = useState(1); // State untuk halaman Pengguna
    const [selectedUmkm, setSelectedUmkm] = useState(null); // Data UMKM yang dipilih untuk detail
    const [selectedUser, setSelectedUser] = useState(null); // Data Pengguna yang dipilih untuk detail

    // Daftar menu/tab navigasi
    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "umkm", label: "Daftar UMKM", icon: Building },
        { id: "users", label: "Pengguna", icon: Users },
        { id: "reports", label: "Laporan", icon: FileText },
    ];

    /**
     * Menangani klik pada tab navigasi.
     * Mereset state pencarian dan halaman saat berganti tab.
     */
    const handleTabChange = (tabId) => {
        setActiveMenu(tabId);
        setUmkmPage(1);
        setUserPage(1);
        setUmkmSearch("");
        setUserSearch("");
        setSelectedUmkm(null);
        setSelectedUser(null);
    };

    // --- Render Konten Berdasarkan Menu Aktif ---
    const renderContent = () => {
        switch (activeMenu) {
            case "dashboard":
                return <DashboardContent umkmData={umkmData} usersData={dummyUsers} />;
            case "umkm":
                return (
                    <UmkmManagement
                        umkmData={umkmData}
                        setUmkmData={setUmkmData}
                        umkmSearch={umkmSearch}
                        setUmkmSearch={setUmkmSearch}
                        umkmPage={umkmPage}
                        setUmkmPage={setUmkmPage}
                        setSelectedUmkm={setSelectedUmkm}
                    />
                );
            case "users":
                return (
                    <UserManagement
                        usersData={dummyUsers}
                        userSearch={userSearch}
                        setUserSearch={setUserSearch}
                        userPage={userPage}
                        setUserPage={setUserPage}
                        setSelectedUser={setSelectedUser}
                    />
                );
            case "reports":
                return (
                    <div className="py-20 text-center">
                        <FileText className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl text-gray-600">
                            Fitur Laporan sedang dalam pengembangan
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Super Admin Dashboard
                </h2>
            }
        >
            <Head title="Super Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* TAB MENU NAVIGASI */}
                            <div className="mb-8 border-b border-gray-200">
                                <nav className="flex -mb-px space-x-8">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => handleTabChange(tab.id)}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                                                    activeMenu === tab.id
                                                        ? "border-indigo-500 text-indigo-600"
                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                            >
                                                <Icon size={18} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            {/* KONTEN AKTIF */}
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL GLOBAL */}
            <UmkmDetailModal
                umkm={selectedUmkm}
                isOpen={!!selectedUmkm}
                onClose={() => setSelectedUmkm(null)}
            />

            <UserDetailModal
                user={selectedUser}
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </AuthenticatedLayout>
    );
}

import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Eye,
    Edit,
    Trash2,
    X,
    Plus,
    LogOut,
    Search,
    MapPin,
    Phone,
    Loader2,
    AlertCircle,
    Globe,
    Building,
    Users,
    CheckCircle,
    XCircle,
    Calendar,
} from "lucide-react";
import api from "@/Services/Api";

const ITEMS_PER_PAGE = 12;

// Toast
const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-center transition-all duration-300
    ${type === "success" ? "bg-black" : "bg-red-600"}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

// Modal Dasar
const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-2xl",
}) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} bg-white rounded-3xl shadow-2xl max-h-screen overflow-y-auto border border-gray-200`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-200 sm:p-6">
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 transition rounded-full hover:bg-gray-100"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
};

export default function SuperadminDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [umkms, setUmkms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [showDetail, setShowDetail] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedUmkm, setSelectedUmkm] = useState(null);
    const [editingUmkm, setEditingUmkm] = useState(null);
    const [deletingUmkm, setDeletingUmkm] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        category: "",
        description: "",
        subdomain: "",
        status: "active",
        logo: null,
        banner: null,
        logoPreview: "",
        bannerPreview: "",
    });

    const fetchUmkms = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/umkms");
            setUmkms(res.data.data || []);
        } catch (err) {
            showToast("Gagal memuat data UMKM", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user.role === "superadmin") fetchUmkms();
    }, [fetchUmkms, user.role]);

    useEffect(() => setPage(1), [search, statusFilter]);

    // STATISTIK
    const stats = useMemo(() => {
        const total = umkms.length;
        const active = umkms.filter((u) => u.status === "active").length;
        const suspended = umkms.filter((u) => u.status === "suspended").length;

        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;
        const newThisMonth = umkms.filter(
            (u) => u.created_at?.substring(0, 7) === thisMonth
        ).length;

        return { total, active, suspended, newThisMonth };
    }, [umkms]);

    const filteredUmkms = useMemo(() => {
        return umkms.filter((umkm) => {
            const matchSearch =
                !search ||
                umkm.name?.toLowerCase().includes(search.toLowerCase()) ||
                umkm.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
                umkm.phone?.includes(search);
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && umkm.status === "active") ||
                (statusFilter === "suspended" && umkm.status === "suspended");
            return matchSearch && matchStatus;
        });
    }, [umkms, search, statusFilter]);

    const totalPages = Math.ceil(filteredUmkms.length / ITEMS_PER_PAGE);
    const currentPageData = filteredUmkms.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        if (form[type + "Preview"]?.startsWith("blob:"))
            URL.revokeObjectURL(form[type + "Preview"]);
        setForm((prev) => ({
            ...prev,
            [type]: file,
            [type + "Preview"]: URL.createObjectURL(file),
        }));
    };

    const handleSubdomainChange = (e) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "");
        setForm((prev) => ({ ...prev, subdomain: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        const formData = new FormData();
        // Debug: cek value status yang akan dikirim
        console.log("Status yang dikirim:", form.status);
        Object.keys(form).forEach((key) => {
            if (form[key] !== null && !key.includes("Preview"))
                formData.append(key, form[key]);
        });
        if (editingUmkm) formData.append("_method", "PUT");

        try {
            if (editingUmkm) {
                const res = await api.post(
                    `/admin/umkms/${editingUmkm.id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                showToast("UMKM berhasil diperbarui!");
                // Update state umkms langsung tanpa fetch ulang
                setUmkms((prev) =>
                    prev.map((item) =>
                        item.id === editingUmkm.id
                            ? { ...item, ...res.data.data }
                            : item
                    )
                );
            } else {
                await api.post("/admin/umkms", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showToast("UMKM berhasil ditambahkan!");
                fetchUmkms(); // Untuk penambahan, tetap fetch ulang agar data baru masuk
            }
            setShowForm(false);
            resetForm();
        } catch (err) {
            // Ambil pesan error validasi detail jika ada
            let errorMsg = "Gagal menyimpan data";
            if (err.response?.data) {
                if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
                if (err.response.data.errors) {
                    // Gabungkan semua pesan error validasi
                    errorMsg = Object.values(err.response.data.errors)
                        .flat()
                        .join("\n");
                }
            }
            showToast(errorMsg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/umkms/${deletingUmkm.id}`);
            showToast("UMKM berhasil dihapus!");
            fetchUmkms();
            setShowDelete(false);
            setDeletingUmkm(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal menghapus UMKM";
            showToast(msg, "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (deleting) return;
        setDeleting(true);
        try {
            await api.post('/admin/umkms/bulk-delete', { ids: selectedIds });
            showToast(`${selectedIds.length} UMKM berhasil dihapus!`);
            fetchUmkms();
            setSelectedIds([]);
            setShowBulkDelete(false);
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal menghapus UMKM terpilih";
            showToast(msg, "error");
        } finally {
            setDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredUmkms.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredUmkms.map(u => u.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const openEdit = (umkm) => {
        setEditingUmkm(umkm);
        setForm({
            name: umkm.name || "",
            phone: umkm.phone || "",
            address: umkm.address || "",
            category: umkm.category || "",
            description: umkm.description || "",
            subdomain: umkm.subdomain || "",
            status: umkm.status || "active",
            logo: null,
            banner: null,
            logoPreview: umkm.logo ? `/storage/${umkm.logo}` : "",
            bannerPreview: umkm.banner ? `/storage/${umkm.banner}` : "",
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({
            name: "",
            phone: "",
            address: "",
            category: "",
            description: "",
            subdomain: "",
            status: "active",
            logo: null,
            banner: null,
            logoPreview: "",
            bannerPreview: "",
        });
        setEditingUmkm(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex items-center gap-3 text-xl font-semibold text-gray-700">
                    <Loader2 className="w-8 h-8 animate-spin" /> Memuat
                    Dashboard...
                </div>
            </div>
        );
    }

    return (
        <>
            {/* NAVBAR */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-300 shadow-sm">
                <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-black rounded-xl">
                            B
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            BookUMKM • Superadmin
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
                    >
                        <LogOut className="w-5 h-5" />{" "}
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="min-h-screen pb-24 bg-gray-50 sm:pb-8">
                <div className="px-4 py-6 mx-auto max-w-7xl">
                    {/* STATISTIK RINGKAS */}
                    <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
                        <div className="p-6 transition bg-white border border-gray-300 shadow-sm rounded-2xl hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total UMKM
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                                <Users className="w-10 h-10 text-gray-700" />
                            </div>
                        </div>

                        <div className="p-6 transition bg-white border border-gray-300 shadow-sm rounded-2xl hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Aktif
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.active}
                                    </p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-black" />
                            </div>
                        </div>

                        <div className="p-6 transition bg-white border border-gray-300 shadow-sm rounded-2xl hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Nonaktif
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-red-600">
                                        {stats.suspended}
                                    </p>
                                </div>
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>

                        <div className="p-6 transition bg-white border border-gray-300 shadow-sm rounded-2xl hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Baru Bulan Ini
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.newThisMonth}
                                    </p>
                                </div>
                                <Calendar className="w-10 h-10 text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Title + Filter */}
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Daftar UMKM
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Menampilkan{" "}
                                <strong>{filteredUmkms.length}</strong> UMKM
                                {statusFilter !== "all" &&
                                    ` (${
                                        statusFilter === "active"
                                            ? "Aktif"
                                            : "Nonaktif"
                                    })`}
                            </p>
                        </div>

                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    statusFilter === "all"
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setStatusFilter("active")}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    statusFilter === "active"
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Aktif
                            </button>
                            <button
                                onClick={() => setStatusFilter("suspended")}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    statusFilter === "suspended"
                                        ? "bg-red-600 text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Nonaktif
                            </button>
                        </div>
                    </div>

                    {/* BULK ACTION BAR */}
                    {selectedIds.length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white shadow-2xl border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
                            <span className="font-bold text-gray-800">{selectedIds.length} Selected</span>
                            <button 
                                onClick={() => setShowBulkDelete(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" /> Delete Selected
                            </button>
                            <button 
                                onClick={() => setSelectedIds([])}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Search & Select All */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute w-5 h-5 text-gray-500 -translate-y-1/2 left-4 top-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama, subdomain, atau telepon..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 transition bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <button 
                            onClick={toggleSelectAll}
                            className={`px-6 py-4 font-bold border rounded-2xl transition-all ${
                                selectedIds.length === filteredUmkms.length && filteredUmkms.length > 0
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}>
                            {selectedIds.length === filteredUmkms.length && filteredUmkms.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    {/* Cards */}
                    {currentPageData.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-xl font-medium text-gray-500">
                                Tidak ada UMKM ditemukan
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {currentPageData.map((umkm) => (
                                <div
                                    key={umkm.id}
                                    className={`relative overflow-hidden transition-all duration-300 bg-white border shadow-md rounded-3xl hover:shadow-2xl ${selectedIds.includes(umkm.id) ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'}`}
                                >
                                    <div className="absolute z-10 top-3 left-3">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(umkm.id)}
                                            onChange={() => toggleSelect(umkm.id)}
                                            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                                        />
                                    </div>
                                    <div className="absolute z-10 top-3 right-3">
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                                                umkm.status === "active"
                                                    ? "bg-black"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {umkm.status === "active"
                                                ? "AKTIF"
                                                : "NONAKTIF"}
                                        </span>
                                    </div>

                                    <div className="p-6 pt-10">
                                        <div className="flex items-center gap-4 mb-5">
                                            {umkm.logo ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/${umkm.logo}`}
                                                    alt={umkm.name}
                                                    className="object-cover w-16 h-16 transition shadow-lg rounded-2xl grayscale hover:grayscale-0"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-gray-800 shadow-lg rounded-2xl">
                                                    {umkm.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                                    {umkm.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {umkm.subdomain}
                                                    .bookumkm.com
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-6 space-y-3 text-sm text-gray-600">
                                            {umkm.address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                                                    <span className="line-clamp-2">
                                                        {umkm.address}
                                                    </span>
                                                </div>
                                            )}
                                            {umkm.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5 text-gray-600" />
                                                    <span>{umkm.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedUmkm(umkm);
                                                    setShowDetail(true);
                                                }}
                                                className="flex-1 py-3 font-semibold text-white transition bg-black rounded-2xl hover:bg-gray-800"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => openEdit(umkm)}
                                                className="p-3 transition bg-gray-100 rounded-2xl hover:bg-gray-200"
                                            >
                                                <Edit className="w-5 h-5 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingUmkm(umkm);
                                                    setShowDelete(true);
                                                }}
                                                className="p-3 transition bg-gray-100 rounded-2xl hover:bg-gray-200"
                                            >
                                                <Trash2 className="w-5 h-5 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-12">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="px-6 py-3 transition bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-6 py-3 font-medium text-gray-700">
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="px-6 py-3 transition bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* FAB Mobile & Tombol Tambah Desktop */}
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="fixed z-30 flex items-center justify-center text-white transition bg-black rounded-full shadow-2xl bottom-6 right-6 w-14 h-14 hover:scale-110 sm:hidden"
                    >
                        <Plus className="w-8 h-8" />
                    </button>

                    <div className="fixed hidden bottom-8 right-8 sm:block">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="flex items-center gap-3 px-8 py-4 font-bold text-white transition bg-black shadow-2xl rounded-2xl hover:bg-gray-800"
                        >
                            <Plus className="w-6 h-6" /> Tambah UMKM
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}
            <BaseModal
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                title="Detail UMKM"
                maxWidth="max-w-4xl"
            >
                {selectedUmkm && (
                    <div className="space-y-8">
                        {selectedUmkm.banner ? (
                            <img
                                src={`http://127.0.0.1:8000/storage/${selectedUmkm.banner}`}
                                alt="banner"
                                className="object-cover w-full h-64 rounded-2xl grayscale"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-64 bg-gray-200 border-2 border-dashed rounded-2xl">
                                <Building className="w-16 h-16 text-gray-400" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                {selectedUmkm.logo ? (
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${selectedUmkm.logo}`}
                                        alt={selectedUmkm.name}
                                        className="w-full max-w-xs mx-auto shadow-lg rounded-2xl grayscale"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-48 h-48 mx-auto text-6xl font-bold text-white bg-gray-800 shadow-lg rounded-2xl">
                                        {selectedUmkm.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 md:col-span-2">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {selectedUmkm.name}
                                    </h2>
                                    <p className="mt-2 text-lg text-gray-600">
                                        {selectedUmkm.category ||
                                            "Kategori belum diisi"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Globe className="w-5 h-5" />
                                        <span className="font-medium">
                                            Subdomain:
                                        </span>
                                        <a
                                            href={`https://${selectedUmkm.subdomain}.bookumkm.com`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black underline hover:no-underline"
                                        >
                                            {selectedUmkm.subdomain}
                                            .bookumkm.com
                                        </a>
                                    </div>
                                    {selectedUmkm.phone && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Phone className="w-5 h-5" />
                                            <span>{selectedUmkm.phone}</span>
                                        </div>
                                    )}
                                    {selectedUmkm.address && (
                                        <div className="flex items-start gap-3 text-gray-700">
                                            <MapPin className="w-5 h-5 mt-1" />
                                            <span>{selectedUmkm.address}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedUmkm.description && (
                                    <div>
                                        <h4 className="mb-2 font-semibold text-gray-900">
                                            Deskripsi
                                        </h4>
                                        <p className="leading-relaxed text-gray-700">
                                            {selectedUmkm.description}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <span
                                        className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                                            selectedUmkm.status === "active"
                                                ? "bg-black"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {selectedUmkm.status === "active"
                                            ? "AKTIF"
                                            : "NONAKTIF"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </BaseModal>

            {/* Modal Tambah/Edit */}
            <BaseModal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    resetForm();
                }}
                title={editingUmkm ? "Edit UMKM" : "Tambah UMKM Baru"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Nama UMKM
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Telepon
                        </label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Alamat
                        </label>
                        <textarea
                            rows="3"
                            value={form.address}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Subdomain
                        </label>
                        <input
                            type="text"
                            required
                            value={form.subdomain}
                            onChange={handleSubdomainChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        />
                        <small className="text-gray-500">
                            {form.subdomain || "contoh"}.bookumkm.com
                        </small>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            rows="4"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                            description: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        ></textarea>
                    </div>

                    {/* UPLOAD LOGO & BANNER */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Logo
                            </label>
                            <div className="relative w-full overflow-hidden border border-gray-300 border-dashed h-36 rounded-xl bg-gray-50 hover:bg-gray-100">
                                {form.logoPreview ? (
                                    <img
                                        src={form.logoPreview}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <span className="text-sm">Upload Logo</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "logo")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Banner
                            </label>
                            <div className="relative w-full overflow-hidden border border-gray-300 border-dashed h-36 rounded-xl bg-gray-50 hover:bg-gray-100">
                                {form.bannerPreview ? (
                                    <img
                                        src={form.bannerPreview}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <span className="text-sm">Upload Banner</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "banner")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 font-bold text-white transition bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                    Menyimpan...
                                </span>
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </form>
            </BaseModal>

            {/* Modal Konfirmasi Hapus Single */}
            <BaseModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                title="Hapus UMKM"
                maxWidth="max-w-md"
            >
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        Anda yakin?
                    </h3>
                    <p className="mb-6 text-gray-600">
                        Tindakan ini tidak dapat dibatalkan. Semua data UMKM
                        termasuk booking dan pelanggan akan dihapus permanen.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="flex-1 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-3 font-bold text-white transition bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleting ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </BaseModal>

            {/* Modal Konfirmasi Hapus Bulk */}
            <BaseModal
                isOpen={showBulkDelete}
                onClose={() => setShowBulkDelete(false)}
                title={`Hapus ${selectedIds.length} UMKM`}
                maxWidth="max-w-md"
            >
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        Hapus {selectedIds.length} UMKM Terpilih?
                    </h3>
                    <p className="mb-6 text-gray-600">
                        Tindakan ini tidak dapat dibatalkan. Semua data UMKM yang dipilih
                        akan dihapus permanen.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBulkDelete(false)}
                            className="flex-1 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={deleting}
                            className="flex-1 py-3 font-bold text-white transition bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleting ? "Menghapus..." : "Ya, Hapus Semua"}
                        </button>
                    </div>
                </div>
            </BaseModal>
        </>
    );
}

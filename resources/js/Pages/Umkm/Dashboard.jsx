import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Home, FileText, Settings, Calendar, DollarSign, Users, AlertCircle,
    CheckCircle2, Clock, XCircle, MessageCircle, Eye, LogOut
} from 'lucide-react';
import api from '@/Services/Api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function UmkmDashboard() {
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('diterima');
    const [loading, setLoading] = useState(true);

    // USER PASTI ADA KARENA app.jsx SUDAH CEK!
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        api.get('/dashboard/stats')
        .then(res => setStats(res.data.data || res.data))
        .catch(() => {
            setStats({
            todayBookings: 16,
            monthlyRevenue: 2480000,
            newCustomers: 11,
            noShowRate: 4,
            status: { confirmed: 52, pending: 8, cancelled: 2 },
            dailyBookings: { labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], data: [6,10,14,12,18,22,16] },
            revenue: { online: 1480000, onSite: 1000000 }
            });
        })
        .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // baru sekali reload, aman
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-2xl font-bold text-indigo-600">Memuat Dashboard...</div>
        </div>
        );
    }

    // Navigasi (tetap pakai desain lama kamu)
    const navItems = [
        { name: 'Dashboard', href: '/umkm/dashboard', icon: Home },
        { name: 'Form Builder', href: '/umkm/formbuilder', icon: FileText },
        { name: 'Pengaturan', href: '/umkm/settings', icon: Settings },
    ];

    // Data booking dummy
    const bookings = {
        diterima: [
            { id: 101, nama: 'Siti Nurhaliza', layanan: 'Creambath + Masker', waktu: '14 Nov 2025, 14:00' },
            { id: 102, nama: 'Budi Santoso', layanan: 'Cat Rambut', waktu: '14 Nov 2025, 16:30' },
            { id: 103, nama: 'Rina Amelia', layanan: 'Manicure', waktu: '15 Nov 2025, 10:00' },
        ],
        pending: [
            { id: 201, nama: 'Ahmad Yani', layanan: 'Potong Rambut', waktu: '16 Nov 2025, 13:00' },
            { id: 202, nama: 'Dewi Sartika', layanan: 'Facial', waktu: '16 Nov 2025, 15:00' },
        ],
        cancel: [
            { id: 301, nama: 'Joko Widodo', layanan: 'Spa Full Body', waktu: '13 Nov 2025, 11:00' },
        ]
    };

    const bookingChartData = {
        labels: stats?.dailyBookings?.labels || ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [{
            label: 'Booking Masuk',
            data: stats?.dailyBookings?.data || [5, 8, 12, 10, 15, 18, 14],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const revenueChartData = {
        labels: ['Online', 'Bayar di Tempat'],
        datasets: [{
            data: [stats?.revenue?.online || 1250000, stats?.revenue?.onSite || 875000],
            backgroundColor: ['#10B981', '#3B82F6'],
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-3xl font-bold text-indigo-600">Memuat Dashboard...</div>
            </div>
        );
    }

    return (
        <>
            {/* NAVBAR ATAS (DESKTOP) */}
            <div className="sticky top-0 z-40 hidden bg-white border-b shadow-sm md:block">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                        location.pathname === item.href
                                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="hidden md:block">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-700">Hi, {user?.name}!</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT — DESAIN LAMA KAMU 100% */}
            <div className="min-h-screen pb-20 bg-gray-50 md:pb-6">
                <div className="px-4 py-6 mx-auto space-y-8 max-w-7xl">

                    {/* HEADER SELAMAT DATANG */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, {user?.name}!</h1>
                            <p className="text-gray-600">Pantau performa booking UMKM Anda secara real-time</p>
                        </div>
                        <Link
                            to="/umkm/formbuilder"
                            className="flex items-center gap-2 px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700"
                        >
                            <FileText className="w-5 h-5" />
                            Edit Form Booking
                        </Link>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[
                            { label: 'Booking Hari Ini', value: stats?.todayBookings || 14, icon: Calendar, color: 'bg-indigo-500' },
                            { label: 'Pendapatan Bulan Ini', value: `Rp ${(stats?.monthlyRevenue || 2125000).toLocaleString('id-ID')}`, icon: DollarSign, color: 'bg-green-500' },
                            { label: 'Pelanggan Baru', value: stats?.newCustomers || 8, icon: Users, color: 'bg-blue-500' },
                            { label: 'No-Show Rate', value: `${stats?.noShowRate || 5}%`, icon: AlertCircle, color: 'bg-red-500' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 bg-white border shadow-lg rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                                        <stat.icon className="text-white w-7 h-7" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CHARTS */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-6 bg-white border shadow-lg rounded-2xl lg:col-span-2">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Booking 7 Hari Terakhir</h3>
                            <div className="h-64">
                                <Line data={bookingChartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="p-6 bg-white border shadow-lg rounded-2xl">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Pendapatan Bulan Ini</h3>
                            <div className="h-64">
                                <Bar data={revenueChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* STATUS WIDGET */}
                    <div className="p-6 bg-white border shadow-lg rounded-2xl">
                        <h3 className="mb-6 text-xl font-bold text-gray-800">Status Booking Saat Ini</h3>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'Diterima', value: stats?.status?.confirmed || 45, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
                                { label: 'Pending', value: stats?.status?.pending || 12, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                                { label: 'Dibatalkan', value: stats?.status?.cancelled || 3, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.bg}`}>
                                        <item.icon className={`w-9 h-9 ${item.color}`} />
                                    </div>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">{item.value}</p>
                                    <p className="text-sm text-gray-600">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TABEL BOOKING — SAMA PERSIS DENGAN YANG LAMA */}
                    <div className="bg-white border shadow-lg rounded-2xl">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Daftar Booking Terbaru</h3>
                        </div>

                        <div className="flex border-b">
                            {[
                                { key: 'diterima', label: 'Diterima', icon: CheckCircle2, color: 'text-green-600', count: bookings.diterima.length },
                                { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', count: bookings.pending.length },
                                { key: 'cancel', label: 'Dibatalkan', icon: XCircle, color: 'text-red-600', count: bookings.cancel.length },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                                        activeTab === tab.key
                                            ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${tab.color}`} />
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">Pelanggan</th>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">Layanan</th>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">Waktu</th>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings[activeTab].map((booking) => (
                                        <tr key={booking.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">{booking.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{booking.layanan}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{booking.waktu}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                    activeTab === 'diterima' ? 'bg-green-100 text-green-800' :
                                                    activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {activeTab === 'diterima' ? 'Diterima' : activeTab === 'pending' ? 'Pending' : 'Dibatalkan'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {activeTab === 'pending' && (
                                                        <>
                                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                                                                <CheckCircle2 className="w-4 h-4" /> Terima
                                                            </button>
                                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200">
                                                                <XCircle className="w-4 h-4" /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {activeTab === 'diterima' && (
                                                        <>
                                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-700">
                                                                <MessageCircle className="w-4 h-4" /> Chat WA
                                                            </button>
                                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 transition bg-indigo-100 rounded-lg hover:bg-indigo-200">
                                                                <CheckCircle2 className="w-4 h-4" /> Selesaikan
                                                            </button>
                                                        </>
                                                    )}
                                                    {activeTab === 'cancel' && (
                                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200">
                                                            <Eye className="w-4 h-4" /> Lihat Detail
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM NAVBAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
                <div className="grid grid-cols-3 py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center text-xs font-medium ${
                                location.pathname === item.href ? 'text-indigo-600' : 'text-gray-500'
                            }`}
                        >
                            <item.icon className="mb-1 w-7 h-7" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

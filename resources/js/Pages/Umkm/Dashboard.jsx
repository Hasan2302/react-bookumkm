// resources/js/Pages/Umkm/UmkmDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    CheckCircle2, Clock, XCircle, MessageCircle, Eye, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '@/Services/Api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function UmkmDashboard() {
    const [stats, setStats] = useState({
        todayBookings: 0,
        monthlyRevenue: 0,
        newCustomers: 0,
        noShowRate: 0,
        todayServed: 0,
        status: { confirmed: 0, pending: 0, cancelled: 0 },
        dailyBookings: { labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], data: [0,0,0,0,0,0,0] },
        revenue: { online: 0, onSite: 0 }
    });
    
    const [bookings, setBookings] = useState({ diterima: [], pending: [], cancelled: [] });
    const [activeTab, setActiveTab] = useState('diterima');
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs()); // untuk kalender
    const [showCalendar, setShowCalendar] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/bookings/recent')
                ]);

                setStats(prev => ({
                    ...statsRes.data.data || statsRes.data,
                    todayServed: statsRes.data.todayServed || 0
                }));
                setBookings({
                    diterima: bookingsRes.data.diterima || [],
                    pending: bookingsRes.data.pending || [],
                    cancelled: bookingsRes.data.cancelled || []
                });
            } catch (err) {
                console.log('API gagal');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Fungsi antrian berdasarkan tanggal yang dipilih
    const getQueueByDate = (date) => {
        return bookings.diterima
            .filter(b => {
                const bookingDate = dayjs(b.waktu.split(', ')[0], 'D MMM YYYY');
                return bookingDate.isSame(date, 'day');
            })
            .sort((a, b) => a.waktu.localeCompare(b.waktu));
    };

    const currentQueue = getQueueByDate(selectedDate);

    const handleConfirm = async (bookingId) => {
        if (!confirm('Yakin ingin menerima booking ini?')) return;
        try {
            await api.post(`/bookings/${bookingId}/confirm`);
            alert('Booking berhasil diterima!');
            const [statsRes, bookingsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/bookings/recent')
            ]);
            setStats(statsRes.data.data || statsRes.data);
            setBookings({
                diterima: bookingsRes.data.diterima || [],
                pending: bookingsRes.data.pending || [],
                cancelled: bookingsRes.data.cancelled || []
            });
            setActiveTab('diterima');
        } catch (err) {
            alert('Gagal menerima booking');
        }
    };

    const handleReject = async (bookingId) => {
        if (!confirm('Yakin ingin menolak booking ini?')) return;
        try {
            await api.post(`/bookings/${bookingId}/reject`);
            alert('Booking telah ditolak');
            const [statsRes, bookingsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/bookings/recent')
            ]);
            setStats(statsRes.data.data || statsRes.data);
            setBookings({
                diterima: bookingsRes.data.diterima || [],
                pending: bookingsRes.data.pending || [],
                cancelled: bookingsRes.data.cancelled || []
            });
        } catch (err) {
            alert('Gagal menolak booking');
        }
    };

    const handleConfirmAll = async () => {
        if (!confirm(`Yakin ingin menerima SEMUA ${stats.status.pending} booking pending sekaligus?`)) return;
        try {
            setLoading(true);
            const response = await api.post('/bookings/confirm-all');
            alert(response.data.message);
            const [statsRes, bookingsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/bookings/recent')
            ]);
            setStats(statsRes.data.data || statsRes.data);
            setBookings({
                diterima: bookingsRes.data.diterima || [],
                pending: bookingsRes.data.pending || [],
                cancelled: bookingsRes.data.cancelled || []
            });
            setActiveTab('diterima');
        } catch (err) {
            alert('Gagal menerima semua booking');
        } finally {
            setLoading(false);
        }
    };  

    const handleMarkServed = async (bookingId) => {
        if (!confirm('Pelanggan sudah dilayani?')) return;
        try {
            await api.post(`/bookings/${bookingId}/served`);
            setBookings(prev => ({
                ...prev,
                diterima: prev.diterima.filter(b => b.id !== bookingId)
            }));
            alert('Status diubah jadi sudah dilayani');
        } catch (err) {
            alert('Gagal update status');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const navItems = [
        { name: 'Dashboard', href: '/umkm/dashboard', icon: Home },
        { name: 'Form Builder', href: '/umkm/formbuilder', icon: FileText },
        { name: 'Pengaturan', href: '/umkm/settings', icon: Settings },
    ];

    const bookingChartData = {
        labels: stats.dailyBookings?.labels || ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
        datasets: [{
            label: 'Booking Masuk',
            data: stats.dailyBookings?.data || [0,0,0,0,0,0,0],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const revenueChartData = {
        labels: ['Online', 'Bayar di Tempat'],
        datasets: [{
            data: [stats.revenue?.online || 0, stats.revenue?.onSite || 0],
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
            {/* NAVBAR ATAS */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
                <div className="px-4 py-3 mx-auto max-w-7xl md:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-8">
                            {navItems.map((item) => (
                                <Link key={item.name} to={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                        location.pathname === item.href 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="hidden sm:block">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden text-sm font-medium md:block">Hi, {user.name}!</span>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 md:pb-6">
                <div className="px-4 py-6 mx-auto max-w-7xl">

                    <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Halo, {user.name || 'UMKM'}!</h1>
                            <p className="text-sm text-gray-600 md:text-base">Pantau bisnis kamu hari ini</p>
                        </div>
                        <Link to="/umkm/formbuilder" className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:scale-105">
                            <FileText className="w-5 h-5" /> Edit Form Booking
                        </Link>
                    </div>

                    {/* PRIORITAS #1: PENDING BOOKING CARD */}
                    {stats.status.pending > 0 && (
                        <div className="relative p-6 mb-8 overflow-hidden text-white shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl animate-pulse-slow">
                            <div className="absolute inset-0 bg-black opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            
                            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-white bg-opacity-25 shadow-xl rounded-2xl backdrop-blur-lg">
                                <Clock className="w-14 h-14" />
                                </div>
                                <div>
                                <p className="text-5xl font-extrabold tracking-tight">{stats.status.pending}</p>
                                <p className="text-2xl font-bold opacity-95">Menunggu Konfirmasi</p>
                                <p className="mt-1 text-sm opacity-90">Segera konfirmasi untuk pelanggan senang!</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button onClick={handleConfirmAll}
                                className="flex items-center justify-center gap-3 py-4 font-bold text-indigo-700 transition-all transform bg-white shadow-xl px-7 rounded-2xl hover:bg-gray-50 hover:scale-105">
                                <CheckCircle2 className="w-6 h-6" />
                                Terima Semua
                                </button>
                                <button onClick={() => setActiveTab('pending')}
                                className="py-4 font-bold transition-all bg-white border-white px-7 border-3 bg-opacity-20 backdrop-blur-lg rounded-2xl hover:bg-opacity-30">
                                Lihat Detail →
                                </button>
                            </div>
                            </div>
                        </div>
                        )}

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-6 md:gap-4">
                        {[
                            { label: 'Booking Hari Ini', value: stats.todayBookings, icon: Calendar, color: 'bg-indigo-500', text: 'text-indigo-600' },
                            { label: 'Total Diterima', value: stats.status.confirmed, icon: CheckCircle2, color: 'bg-emerald-500', text: 'text-emerald-600' },
                            { label: 'Pending', value: stats.status.pending, icon: Clock, color: 'bg-yellow-500', text: 'text-yellow-600' },
                            { label: 'Dibatalkan', value: stats.status.cancelled, icon: XCircle, color: 'bg-red-500', text: 'text-red-600' },
                            { label: 'Pendapatan Bulan Ini', value: stats.monthlyRevenue > 0 ? `Rp ${(stats.monthlyRevenue / 1000).toFixed(0)}K` : '-', icon: DollarSign, color: 'bg-green-500', text: 'text-green-600' },
                            { label: 'Pelanggan Baru', value: stats.newCustomers, icon: Users, color: 'bg-purple-500', text: 'text-purple-600' },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 transition-all bg-white border border-gray-200 group rounded-xl hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs leading-tight text-gray-500">{stat.label}</p>
                                        <p className={`text-xl md:text-2xl font-bold mt-1 ${stat.value === 0 || stat.value === '-' ? 'text-gray-400' : stat.text}`}>
                                            {stat.value === 0 || stat.value === '-' ? '-' : stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* LAYOUT 2 KOLOM */}
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">

                        {/* KIRI: CHART + TABEL — TETAP 100% SAMA */}
                        <div className="space-y-6 xl:col-span-3">
                            {/* CHARTS */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Trend Booking 7 Hari</h3>
                                    <div className="h-48"><Line data={bookingChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /></div>
                                </div>
                                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Pendapatan Bulan Ini</h3>
                                    <div className="h-48"><Bar data={revenueChartData} options={chartOptions} /></div>
                                </div>
                            </div>

                            {/* TABEL BOOKING — TETAP 100% SEPERTI ASLINYA */}
                            <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl xl:block">
                                <div className="p-5 border-b bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-800">Booking Terbaru</h3>
                                </div>
                                <div className="flex border-b bg-gray-50">
                                    {[
                                        { key: 'diterima', label: 'Diterima', icon: CheckCircle2, color: 'text-green-600', count: bookings.diterima.length },
                                        { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', count: bookings.pending.length },
                                        { key: 'cancelled', label: 'Dibatalkan', icon: XCircle, color: 'text-red-600', count: bookings.cancelled.length },
                                    ].map(tab => (
                                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                                                activeTab === tab.key 
                                                    ? 'text-indigo-700 border-b-3 border-indigo-600 bg-white' 
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}>
                                            <tab.icon className={`w-4 h-4 ${tab.color}`} />
                                            {tab.label} ({tab.count})
                                        </button>
                                    ))}
                                </div>
                                <div className="overflow-y-auto max-h-96">
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">ID</th>
                                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Pelanggan</th>
                                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Layanan</th>
                                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Waktu</th>
                                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bookings[activeTab].length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                        Belum ada booking {activeTab === 'pending' ? 'menunggu' : activeTab}
                                                    </td>
                                                </tr>
                                            ) : (
                                                bookings[activeTab].slice(0, 8).map((b) => (
                                                    <tr key={b.id} className="transition hover:bg-indigo-50">
                                                        <td className="px-4 py-3 text-sm font-medium">#{b.id}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.nama}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">{b.layanan}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">{b.waktu}</td>
                                                        <td className="px-4 py-3">
                                                            {activeTab === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleConfirm(b.id)}
                                                                        className="px-4 py-2 text-xs font-bold text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                                                                        Terima
                                                                    </button>
                                                                    <button onClick={() => handleReject(b.id)}
                                                                        className="px-4 py-2 text-xs font-bold text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200">
                                                                        Tolak
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* KANAN: ANTRIAN + KALENDER LANGSUNG TAMPIL + SUDAH DILAYANI */}
                        <div className="space-y-6">

                            {/* CARD ANTRIAN — KALENDER LANGSUNG TAMPIL DARI AWAL */}
                            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
                                {/* HEADER CARD */}
                                <div className="px-5 py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-6 h-6" />
                                            <div>
                                                <p className="text-lg font-bold">Antrian</p>
                                                <p className="text-xs opacity-90">{selectedDate.format('dddd, D MMM YYYY')}</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 text-sm font-bold text-white bg-white bg-opacity-25 rounded-full">
                                            {currentQueue.length}
                                        </div>
                                    </div>
                                </div>

                                {/* KALENDER — LANGSUNG TAMPIL DARI AWAL (TIDAK PERLU KLIK TOMBOL) */}
                                <div className="p-4 border-b bg-gradient-to-b from-gray-50 to-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <button 
                                            onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
                                            className="p-1 transition rounded-lg hover:bg-white hover:shadow">
                                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <p className="text-sm font-bold text-gray-800">{selectedDate.format('MMMM YYYY')}</p>
                                        <button 
                                            onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}
                                            className="p-1 transition rounded-lg hover:bg-white hover:shadow">
                                            <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-xs text-center">
                                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                            <div key={day} className="py-1 font-bold text-gray-600">{day}</div>
                                        ))}
                                        {Array.from({ length: selectedDate.startOf('month').day() }, (_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
                                            const date = selectedDate.date(i + 1);
                                            const hasBooking = bookings.diterima.some(b => {
                                                const bd = dayjs(b.waktu.split(', ')[0], 'D MMM YYYY');
                                                return bd.isSame(date, 'day');
                                            });
                                            const isToday = date.isSame(dayjs(), 'day');
                                            const isSelected = date.isSame(selectedDate, 'day');

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedDate(date)}
                                                    className={`p-2 rounded-lg text-xs font-medium transition-all relative
                                                        ${isSelected ? 'bg-indigo-600 text-white shadow-lg scale-110' : ''}
                                                        ${isToday && !isSelected ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                                                        ${hasBooking && !isSelected ? 'bg-emerald-100 text-emerald-700 font-bold' : ''}
                                                        ${!isSelected && !isToday && !hasBooking ? 'hover:bg-gray-200' : ''}
                                                    `}>
                                                    {i + 1}
                                                    {hasBooking && !isSelected && (
                                                        <div className="absolute w-1 h-1 rounded-full bg-emerald-600 -top-1 -right-1"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* LIST ANTRIAN */}
                                <div className="overflow-y-auto max-h-96">
                                    {currentQueue.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-sm text-gray-500">Tidak ada antrian pada tanggal ini</p>
                                        </div>
                                    ) : (
                                        currentQueue.map((b, i) => {
                                            const time = b.waktu.split(', ')[1];
                                            const [h, m] = time.split(':');
                                            const bookingTime = dayjs().hour(h).minute(m);
                                            const diff = bookingTime.diff(dayjs(), 'minute');
                                            const isNow = diff >= -10 && diff <= 10;
                                            const isSoon = diff > 10 && diff <= 30;

                                            return (
                                                <div key={b.id} className={`px-5 py-4 border-b border-gray-100 last:border-0 flex items-center justify-between transition-all ${isNow ? 'bg-rose-50 border-l-4 border-rose-500' : isSoon ? 'bg-amber-50 border-l-4 border-amber-500' : ''}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-11 h-11 rounded-full flex-center text-white font-bold shadow-lg content-center text-center ${isNow ? 'bg-rose-600 animate-pulse' : isSoon ? 'bg-amber-600' : 'bg-blue-600'}`}>
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{b.nama}</p>
                                                            <p className="text-xs text-gray-600">{b.layanan}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-blue-700">{time}</p>
                                                        {isNow && <p className="text-xs font-bold text-rose-600 animate-pulse">SEDANG GILIRAN!</p>}
                                                        {isSoon && <p className="text-xs font-bold text-amber-700">{diff} menit lagi</p>}
                                                        <button 
                                                            onClick={() => handleMarkServed(b.id)}
                                                            className="px-4 py-1.5 mt-2 text-xs font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition shadow">
                                                            Selesai
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
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
                        <Link key={item.name} to={item.href}
                            className={`flex flex-col items-center text-xs font-medium py-2 ${location.pathname === item.href ? 'text-indigo-600' : 'text-gray-500'}`}>
                            <item.icon className="w-6 h-6 mb-1" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}